# MarketRadar Live

Bu paket Netlify için hazırdır.

## Yükleme
1. ZIP'i açın.
2. Klasörü GitHub reposuna yükleyip Netlify'a bağlayın.
   - veya Netlify CLI kullanın.
3. Publish directory: `.`
4. Functions directory: `netlify/functions`

> Netlify'ın sadece HTML "drag & drop" yükleme yöntemi Functions klasörünü her hesap/akışta otomatik deploy etmeyebilir. En sağlıklısı GitHub üzerinden deploy etmektir.

## Nasıl çalışır?
- Sayfa açılışında son aranan ürünü otomatik yeniler.
- Arama her çalıştığında `/.netlify/functions/live-search` marketlerin resmi herkese açık web sayfalarını yeniden çağırır.
- `Cache-Control: no-store` kullanılır; eski demo fiyat tutulmaz.
- Kaynak erişilemiyorsa fiyat uydurulmaz.

## Not
Marketlerin sayfa yapıları veya bot korumaları değişirse ilgili adapter'ın URL/parser kısmının güncellenmesi gerekebilir.
Bölge seçimi şu an sonuç etiketinde tutulur; marketlerin resmi sayfaları oturum/adres seçimi gerektirdiğinde Pendik'e zorla bağlanamaz. Bu yüzden market sitesindeki fiyat mağazaya göre farklı olabilir.
