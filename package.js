Package.describe({
  name:'commerse:qr-scanner',
  version:'1.0.0',
  summary: 'A QR Code Scanner (using jsqrcode)'
});

Package.on_use(function (api) {

  api.versionsFrom('METEOR@1.2.0')

  api.add_files([
    'lib/jsqrcode/grid.js',
    'lib/jsqrcode/version.js',
    'lib/jsqrcode/detector.js',
    'lib/jsqrcode/formatinf.js',
    'lib/jsqrcode/errorlevel.js',
    'lib/jsqrcode/bitmat.js',
    'lib/jsqrcode/datablock.js',
    'lib/jsqrcode/bmparser.js',
    'lib/jsqrcode/datamask.js',
    'lib/jsqrcode/rsdecoder.js',
    'lib/jsqrcode/gf256poly.js',
    'lib/jsqrcode/gf256.js',
    'lib/jsqrcode/decoder.js',
    'lib/jsqrcode/qrcode.js',
    'lib/jsqrcode/findpat.js',
    'lib/jsqrcode/alignpat.js',
    'lib/jsqrcode/databr.js',
    'qr-scanner.html',
    'qr-scanner.js'
  ], 'client')

})
