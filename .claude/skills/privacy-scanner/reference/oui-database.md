# Camera & Surveillance Device OUI Database

Curated from `/usr/share/nmap/nmap-mac-prefixes` (52,091 entries) + supplementary sources.
Used by `scan.sh` for manufacturer identification and risk tier assignment.

## Tier 1: Dedicated Surveillance Manufacturers (auto-CRITICAL)

Devices from these manufacturers are purpose-built surveillance/camera equipment.

### Hangzhou Hikvision Digital Technology
World's largest surveillance camera manufacturer.
```
00BC99 040312 04EECD 083BC1 085411 08A189 08CC81 0C75D2 1012FB
1868CB 188025 240F9B 2428FD 2432AE 244845 2857BE 2CA59C 340962
3C1BF8 40ACBF 4419B6 4447CC 44A642 48785B 4C1F86 4C62DF 4CBD8F
4CF5DC 50E538 548C81 54C415 5803FB 5850ED 5C345B 64DB8B 686DBC
743FC2 80489F 807C62 80BEAF 80F5AE 849459 849A40 88DE39 8C22D2
8CE748 94E1AC 988B0A 989DE5 98DF82 98F112 A0FF0C A41437 A42902
A44BD9 A4A459 A4D5C2 ACCB51 ACB92F B4A382 BC2978 BC5E33 BC9B5E
BCAD28 BCBAC2 C0517E C056E3 C06DED C42F90 C8A702 D4E853 DC07F8
DCD26A E0BAAD E0CA3C E0DF13 E4D58B E8A0ED ECA971 ECC89C F84DFC
FC9FFD
```

### Hangzhou EZVIZ Software (Hikvision consumer brand)
```
0CA64C 20BBBC 34C6DD 54D60D 588FCF 64244D 64F2FB 78A6A0 78C1AE
94EC13 AC1C26 EC97E0 F47018
```

### Zhejiang Dahua Technology
Second-largest surveillance camera manufacturer globally.
```
08EDED 14A78B 24526A 30DDAA 38AF29 3CE36B 3CEF8C 407AA4 4C11BF
4C99E8 5CF51A 64FD29 6C1C71 74C929 8CE9B4 9002A9 98F9CC 9C1463
A0BD1D A8CA87 B44C3B BC325F C0395A C4AAC4 D4430E E02EFE E0508B
E4246C F4B1C2 F8CE07 FC5F49 FCB69D
```

### Amcrest Technologies (Dahua rebrand for US market)
```
00651E 9C8ECD A06032
```

### Zhejiang Uniview Technologies
Enterprise surveillance cameras.
```
48EA63 6CF17E 88263F C47905
```

### Axis Communications AB
Enterprise-grade IP surveillance cameras.
```
00408C ACCC8E B8A44F E82725
```

### Reolink Innovation Limited
```
EC71DB
```

### Prama Hikvision India
```
24B105
```

## Tier 2: Consumer Camera Brands (auto-HIGH)

Consumer-focused camera brands — primarily make cameras but not enterprise surveillance.

### Wyze Labs
```
2CAA8E 7C78B2 80482C D03F27 F0C88B
```

### Blink by Amazon
```
3CA070 70AD43 74AB93 F074C1
```

### Arlo Technology
```
486264 A41162 FC9C98
```

### Nest Labs (Google)
```
18B430 641666
```

### Foscam (NOT in nmap DB — manually curated)
```
C0562D C8D719 008E10 E0B9E5 001EF2
```

### Yi Technology / Xiaomi Camera Division
```
78025E 7811DC 34CE00 04CF8C 28D127 58A60B 641327
```

### Eufy / Anker (camera models)
```
98F1B1 78C57D 8CEEA7
```

## Tier 3: Multi-Purpose IoT (require port scan confirmation)

These manufacturers make cameras AND non-camera products. A matching OUI alone is not
sufficient — camera-specific ports must be open to elevate risk.

### Indicators
- **TP-Link**: 256 OUIs in nmap DB. Makes Tapo cameras + routers/switches/plugs
- **Espressif**: 297 OUIs. ESP32/ESP8266 chipsets used in cheap cameras AND everything else
- **Realtek**: Chipsets in cameras AND laptops/routers/USB devices
- **MediaTek**: Chipsets in cameras AND phones/routers/TVs
- **Amazon**: Echo Show has camera, most devices don't
- **Google**: Nest Hub has camera, most devices don't
- **Xiaomi**: Makes cameras AND 1000 other IoT products
- **Samsung**: SmartThings cameras AND phones/TVs/appliances

### Espressif keywords to match in nmap-mac-prefixes
```
Espressif
```

### Realtek keywords
```
Realtek Semiconductor
```

### MediaTek keywords
```
MediaTek
```

## Usage in scan.sh

The script should:
1. First check `/usr/share/nmap/nmap-mac-prefixes` for the OUI (fast, comprehensive)
2. Then cross-reference against the Tier 1/2 lists above for risk classification
3. For Tier 3 matches, require port evidence before elevating risk
4. For unknown/unresolved OUIs, treat as MODERATE and scan thoroughly
