const SOURCES = [
  {market:"CarrefourSA", url:q=>`https://www.carrefoursa.com/search/?text=${encodeURIComponent(q)}`},
  {market:"Happy Center", url:q=>`https://www.happycenter.com.tr/Product/Search/?ara=${encodeURIComponent(q)}`},
  {market:"Mopaş", url:q=>`https://mopas.com.tr/search/?text=${encodeURIComponent(q)}`},
  {market:"Migros", url:q=>`https://www.migros.com.tr/arama?q=${encodeURIComponent(q)}`},
  {market:"A101", url:q=>`https://www.a101.com.tr/arama?q=${encodeURIComponent(q)}`},
  {market:"Şok", url:q=>`https://www.sokmarket.com.tr/arama?q=${encodeURIComponent(q)}`},
  {market:"Hakmar", url:q=>`https://www.hakmarexpress.com.tr/search?q=${encodeURIComponent(q)}`},
  {market:"File", url:q=>`https://www.file.com.tr/arama?q=${encodeURIComponent(q)}`},
];

const EXTRA = [
  {market:"BİM", source:"https://www.bim.com.tr/", message:"Herkese açık online raf fiyatı kaynağı bulunmuyor; aktüel katalog kullanılabilir."}
];

const stop = new Set(["ve","ile","pet","adet","ürün","urun","fiyat","tl","sepete","ekle","stokta","var","market","online"]);
const norm = s => (s||"").toLocaleLowerCase("tr-TR")
  .normalize("NFD").replace(/[\u0300-\u036f]/g,"")
  .replace(/ı/g,"i").replace(/ş/g,"s").replace(/ğ/g,"g").replace(/ü/g,"u").replace(/ö/g,"o").replace(/ç/g,"c")
  .replace(/litre|lt\./g," l ").replace(/kilogram|kilo/g," kg ").replace(/gram/g," g ")
  .replace(/[^a-z0-9., ]+/g," ").replace(/\s+/g," ").trim();

function queryTokens(q){
  return norm(q).split(" ").filter(x=>x.length>1 && !stop.has(x));
}
function scoreName(name,q){
  const nt=new Set(norm(name).split(" ").filter(x=>x.length>1&&!stop.has(x)));
  const qt=queryTokens(q);
  if(!qt.length)return 0;
  let hit=0; for(const t of qt) if(nt.has(t) || [...nt].some(n=>n.includes(t)||t.includes(n))) hit++;
  return hit/qt.length;
}
function decode(s){
 return s.replace(/&nbsp;|&#160;/gi," ").replace(/&amp;/gi,"&").replace(/&quot;/gi,'"')
  .replace(/&#39;|&apos;/gi,"'").replace(/&lt;/gi,"<").replace(/&gt;/gi,">");
}
function textLines(html){
 html=html.replace(/<script[\s\S]*?<\/script>/gi," ").replace(/<style[\s\S]*?<\/style>/gi," ");
 html=html.replace(/<(br|\/p|\/div|\/li|\/h\d|\/article|\/span)>/gi,"\n");
 html=html.replace(/<[^>]+>/g," ");
 return decode(html).split(/\n+/).map(x=>x.replace(/\s+/g," ").trim()).filter(Boolean);
}
function parsePrice(s){
 const m=s.match(/(?:₺\s*)?(\d{1,4}(?:[.\s]\d{3})*,\d{2}|\d{1,4},\d{2})\s*(?:TL|₺)?/i);
 if(!m)return null;
 let v=m[1].replace(/\s/g,"").replace(/\./g,"").replace(",",".");
 const n=Number(v); return Number.isFinite(n)&&n>1&&n<100000?n:null;
}
function junk(s){
 const n=norm(s);
 return s.length<4 || s.length>150 || /sepete|giris|üye|filtre|kategori|marka|fiyat|sirala|stok|teslimat|magaza|sube sec|kampanya|anasayfa|ürün bulundu|urun bulundu/i.test(s)
 || /^(adet|tl|₺|\d+)$/.test(n);
}
function extractBest(html,q){
 const lines=textLines(html), c=[];
 for(let i=0;i<lines.length;i++){
   const price=parsePrice(lines[i]); if(price==null) continue;
   let bestName="", bestScore=0;
   for(let j=Math.max(0,i-8);j<i;j++){
     if(junk(lines[j]))continue;
     const sc=scoreName(lines[j],q);
     if(sc>bestScore){bestScore=sc;bestName=lines[j]}
   }
   // Some shops put name and price on same line.
   if(scoreName(lines[i],q)>bestScore){
     bestName=lines[i].replace(/(?:₺\s*)?\d[\d.\s]*,\d{2}\s*(?:TL|₺)?/ig,"").trim();
     bestScore=scoreName(bestName,q);
   }
   if(bestName && bestScore>=0.45)c.push({product:bestName,price,matchScore:bestScore});
 }
 c.sort((a,b)=>b.matchScore-a.matchScore || a.price-b.price);
 return c[0]||null;
}
async function fetchOne(s,q){
 const source=s.url(q);
 try{
  const controller=new AbortController(); const timer=setTimeout(()=>controller.abort(),9000);
  const r=await fetch(source,{headers:{
    "user-agent":"Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 Chrome/124 Safari/537.36",
    "accept":"text/html,application/xhtml+xml"
  },signal:controller.signal,redirect:"follow"});
  clearTimeout(timer);
  if(!r.ok)return {market:s.market,source,message:`Kaynak HTTP ${r.status} döndürdü.`};
  const html=await r.text();
  const best=extractBest(html,q);
  if(!best)return {market:s.market,source,message:"Aramayla yeterince güvenli eşleşen canlı fiyat bulunamadı."};
  return {market:s.market,source,...best};
 }catch(e){
  return {market:s.market,source,message:e.name==="AbortError"?"Kaynak zaman aşımına uğradı.":"Canlı kaynak erişilemedi."};
 }
}

export default async (request) => {
  const u=new URL(request.url), q=(u.searchParams.get("q")||"").trim();
  if(q.length<3)return new Response(JSON.stringify({error:"En az 3 karakterlik ürün adı yaz."}),{status:400,headers:{"content-type":"application/json; charset=utf-8"}});
  const live=await Promise.all(SOURCES.map(s=>fetchOne(s,q)));
  const results=[...live,...EXTRA.map(x=>({market:x.market,source:x.source,message:x.message}))];
  return new Response(JSON.stringify({query:q,district:u.searchParams.get("district")||"",checkedAt:new Date().toISOString(),results}),{
    headers:{
      "content-type":"application/json; charset=utf-8",
      "cache-control":"no-store, max-age=0",
      "access-control-allow-origin":"*"
    }
  });
};
