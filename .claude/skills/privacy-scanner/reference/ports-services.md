# Camera Ports & Service Signatures

## Primary Camera Ports

These ports are scanned on ALL discovered devices.

| Port | Protocol | Service | Significance |
|------|----------|---------|-------------|
| 554 | TCP | RTSP | **Smoking gun** — Real Time Streaming Protocol, primary camera streaming |
| 8554 | TCP | RTSP-alt | Alternative RTSP port (common on consumer cameras) |
| 80 | TCP | HTTP | Web interface — check response body for camera keywords |
| 443 | TCP | HTTPS | Secure web interface |
| 8080 | TCP | HTTP-alt | Very common alternative HTTP on cameras |
| 8443 | TCP | HTTPS-alt | Alternative HTTPS |

## Vendor-Specific Ports

Strong indicators when found on devices with camera-related OUI.

| Port | Protocol | Vendor | Service |
|------|----------|--------|---------|
| 8000 | TCP | Hikvision | ISAPI/SDK service port |
| 8200 | TCP | Hikvision | Web service alternate |
| 37777 | TCP | Dahua/Amcrest | Dahua proprietary protocol |
| 34567 | TCP | Generic Chinese NVR | XMEye/CMS protocol |
| 34599 | TCP | Generic Chinese NVR | XMEye alternate |
| 9000 | TCP | Reolink | Reolink proprietary protocol |
| 3702 | TCP/UDP | ONVIF | WS-Discovery for ONVIF cameras |
| 1935 | TCP | Various | RTMP streaming (some IP cameras) |
| 5000 | TCP | Various | Synology/QNAP NAS Surveillance Station |
| 6667 | TCP | Various | Alternate RTSP on some cameras |
| 8899 | TCP | Various | Alternative HTTP camera port |
| 49152 | TCP | UPnP | UPnP control port |
| 7070 | TCP | Various | Alternative RTSP/streaming |
| 9527 | TCP | Various | Chinese camera debug port |

## Combined Port List for nmap

```
554,8554,80,443,8080,8443,8000,8200,37777,34567,34599,9000,3702,1935,5000,6667,8899,49152,7070,9527
```

## HTTP Response Keywords

Search in both HTML body AND HTTP headers (case-insensitive):

### High confidence (camera-specific)
```
camera, webcam, ipcam, ip cam, ipcamera, netcam, web camera,
DVR, NVR, surveillance, security cam, security camera, CCTV,
hikvision, dahua, amcrest, reolink, foscam, wyze,
ONVIF, onvif, rtsp://, video feed, live view, liveview,
snapshot, motion detect, motion detection, recording, playback,
pan tilt, PTZ, night vision, infrared,
DNVRS-Webs, App-webs, DH-, XMEye, NETSurveillance,
IPCamera, IPCam, NetIPCamera, webcamXP, Yawcam,
Streaming/Channels, cam/realmonitor, ISAPI
```

### Medium confidence (could be camera or other device)
```
stream, video, media server, live, viewer, monitor, capture,
MJPEG, H.264, H.265, HEVC, codec, bitrate, resolution,
firmware, device info, device configuration, system settings
```

## RTSP Service Signatures

### Response indicators
- `RTSP/1.0 200 OK` with `Content-Type: application/sdp`
- Any `RTSP/1.0` response header
- SDP body containing `m=video` line

### Common RTSP Paths (per vendor)
| Vendor | RTSP Paths |
|--------|-----------|
| Hikvision | `/Streaming/Channels/101`, `/Streaming/Channels/102`, `/h264/ch1/main` |
| Dahua | `/cam/realmonitor?channel=1&subtype=0`, `/cam/realmonitor` |
| Generic | `/live`, `/cam`, `/stream1`, `/stream`, `/h264`, `/video`, `/ch0_0.h264` |
| Amcrest | `/cam/realmonitor?channel=1&subtype=0` (same as Dahua) |
| Reolink | `/h264Preview_01_main`, `/h264Preview_01_sub` |
| Foscam | `/videoMain`, `/videoSub` |
| Wyze | `/live` |
| ONVIF | `/onvif/media_service/snapshot`, `/onvif1`, `/onvif2` |

## mDNS Service Types

Monitor these via `avahi-browse`:

| Service Type | Significance |
|-------------|-------------|
| `_rtsp._tcp` | **High** — RTSP streaming service |
| `_camera._tcp` | **High** — Explicitly advertised camera |
| `_nvr._tcp` | **High** — Network video recorder |
| `_onvif._tcp` | **High** — ONVIF-compatible camera |
| `_http._tcp` | **Medium** — Web service (check further) |
| `_airplay._tcp` | **Low** — AirPlay (Apple TV, etc.) |
| `_raop._tcp` | **Low** — Remote audio (Apple) |
| `_googlecast._tcp` | **Low** — Chromecast/Google device |

## UPnP/SSDP Keywords

Search M-SEARCH responses and device descriptions for:
```
camera, webcam, surveillance, DVR, NVR, video, streaming,
MediaRenderer, MediaServer, IPC, IPCamera, NetworkCamera,
SecurityCamera, DigitalSecurityCamera
```
