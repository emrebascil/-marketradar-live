# Device Fingerprints & Signatures

Known network signatures that identify specific camera models and types.

## HTTP Server Headers

Check the `Server:` header in HTTP responses.

### Hikvision
| Header Pattern | Device Type |
|---------------|------------|
| `DNVRS-Webs` | Hikvision DVR/NVR web interface |
| `App-webs/` | Hikvision IP camera web interface |
| `webserver` (from Hikvision IP) | Hikvision camera with minimal header |
| `Hikvision-Webs` | Newer Hikvision firmware |
| `DVRDVS-Webs` | Hikvision DVR system |

### Dahua
| Header Pattern | Device Type |
|---------------|------------|
| `DH-` followed by model | Dahua device identifier |
| `IPC-` followed by model | Dahua IP camera |
| `DHIP` in response body | Dahua HTTP protocol |
| `Dahua` in any header | Dahua device |

### Generic / Chinese OEM
| Header Pattern | Device Type |
|---------------|------------|
| `uc-httpd` | Common on cheap Chinese cameras |
| `GoAhead-Webs` | GoAhead embedded web server (very common on cameras) |
| `thttpd` | Lightweight HTTP server often in cameras |
| `mini_httpd` | Minimal HTTP server in embedded cameras |
| `Boa/` | Boa embedded web server in older cameras |
| `JAWS/` | Dahua-derivative embedded server |
| `lighttpd` | Sometimes used in cameras (also other devices) |

## HTML Title Patterns

Check `<title>` tag in HTTP responses.

| Title Pattern | Confidence | Device Type |
|--------------|-----------|------------|
| `NETSurveillance` | **Critical** | XMEye/Chinese NVR generic platform |
| `DVR Components Download` | **Critical** | ActiveX-based DVR viewer |
| `Web Client` (from camera IP) | **High** | Generic camera web interface |
| `IPCamera` or `IP Camera` | **Critical** | IP camera web UI |
| `Network Camera` | **Critical** | IP camera web UI |
| `WEB SERVICE` (all caps) | **High** | Hikvision/Dahua derivative |
| `iVMS-` | **Critical** | Hikvision management software |
| `Smart Viewer` | **High** | Samsung/Hanwha camera viewer |
| `SADP` | **Critical** | Hikvision device discovery |
| `Device Management` | **Medium** | Could be camera management page |
| `Login` (from camera OUI) | **Medium** | Camera login page |
| `webcamXP` | **Critical** | WebcamXP streaming software |
| `Yawcam` | **Critical** | Yet Another WebCam software |
| `Blue Iris` | **Critical** | Blue Iris surveillance software |
| `ZoneMinder` | **Critical** | Open-source surveillance platform |
| `Shinobi` | **Critical** | Open-source NVR |
| `MotionEye` | **Critical** | Motion-based camera software |
| `Frigate` | **Critical** | NVR with object detection |

## mDNS Hostname Patterns

Hostnames resolved via mDNS/Bonjour that indicate cameras.

| Pattern | Manufacturer |
|---------|-------------|
| `wyze-cam-*` | Wyze camera |
| `wyzecam-*` | Wyze camera (older firmware) |
| `ipcam-*` | Generic IP camera |
| `camera-*` | Generic camera |
| `cam-*` | Generic camera (check further) |
| `DCS-*` | D-Link camera |
| `FI*` (e.g., FI9900P) | Foscam camera |
| `IPC-*` | Generic IP camera |
| `hikvision-*` | Hikvision camera |
| `DH-*` or `dahua-*` | Dahua camera |
| `ESP-*` or `esp32-*` | ESP-based device (could be camera) |
| `tapo-*` or `Tapo_*` | TP-Link Tapo (could be camera or plug) |
| `yi-home-*` | Yi/Xiaomi camera |
| `reolink-*` | Reolink camera |
| `amcrest-*` | Amcrest camera |

## UPnP Device Descriptions

Keywords in UPnP `LOCATION` XML responses.

| XML Element | Pattern | Meaning |
|------------|---------|---------|
| `<deviceType>` | `urn:schemas-upnp-org:device:MediaRenderer` | Media device (check further) |
| `<deviceType>` | `urn:schemas-upnp-org:device:MediaServer` | Media server (check further) |
| `<manufacturer>` | Any Tier 1/2 manufacturer name | Surveillance device |
| `<modelName>` | Contains "cam", "camera", "IPC", "DVR", "NVR" | Camera/recorder |
| `<friendlyName>` | Contains "camera", "cam", "surveillance" | Camera device |

## RTSP Banner Signatures

Response to RTSP OPTIONS request on port 554.

| Banner Pattern | Device |
|---------------|--------|
| `Hikvision-Streaming-Media` | Hikvision camera |
| `Dahua Rtsp` | Dahua camera |
| `GStreamer` | Linux-based camera (RPi, etc.) |
| `Live555` | Live555 streaming library (common in cameras) |
| `UBNT Streaming Server` | Ubiquiti camera |
| `RealServer` | Legacy streaming server |

## Known Safe Devices (reduce false positives)

Devices commonly found on networks that are NOT surveillance threats.

| Manufacturer Keywords | Device Type | Risk |
|---------------------|------------|------|
| Apple | iPhone, iPad, Mac, Apple TV, HomePod | INFO |
| Samsung Electronics | Phone, TV, appliance | INFO |
| Intel, Dell, HP, Lenovo | Laptop, desktop | INFO |
| Sonos | Speaker | INFO |
| Roku | Streaming stick | INFO |
| Brother, Canon (printer OUI) | Printer | INFO |
| Philips Hue | Smart light | INFO |
| Ecobee, Honeywell | Thermostat | INFO |
| iRobot | Robot vacuum | LOW |
| Amazon (non-Blink, non-Ring) | Echo, Fire TV | LOW |
| Google (non-Nest cam) | Home speaker, Chromecast | LOW |
| Smart plug manufacturers | TP-Link Kasa plug, Wemo, etc. | INFO |
