Meteor QR Code Scanner
======================

**A no-nonsense QR Code *Scanner* for Meteor**

This package uses the [getUserMedia stream](http://caniuse.com/stream) API to record webcam or front-facing mobile cameras, constantly scanning frames to read and decode QR codes. The entire package is client-side only.

By default, qr-scanner will use the 'environment facing' camera (the main camera for smartphones) and falls back to 'face facing'.

qr-scanner is made possible by [jsqrcode](https://github.com/LazarSoft/jsqrcode).

## Quickstart

Install with Meteor.

```
meteor add commerse:qr-scanner
```