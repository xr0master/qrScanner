Meteor.qrScanner = new function() {
	
	var context = null;
	var video = null;
	var intervalID = null;
	var isReady = false;
	var camera = null;
	var videoStream = null;
	
	var options = {
		"width": 1280,
		"height": 720,
		"done": function(result) {
			console.log(result);
		},
		"fail": function(ignore) {return;}
	};
	
	var initContext = function(canvas) {
		canvas.width = options.width;
		canvas.height = options.height;
		context = canvas.getContext('2d');
	}
	
	var initCamera = function() {
		window.URL = window.URL || window.webkitURL || window.mozURL || window.msURL;
		navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;
		navigator.mediaDevices = navigator.mediaDevices || (navigator.getUserMedia? {
			getUserMedia: function(cfg) {
				return new Promise(function(resolve, reject) {
					navigator.getUserMedia.call(navigator, cfg, resolve, reject);
				});
			},
			enumerateDevices: function() {
				return new Promise(function(resolve, reject) {
					MediaStreamTrack.getSources.call(navigator, resolve, reject);
				});
			}
		} : undefined);
		
		camera = chooseCamera();
	}
	
	var chooseCamera = function() {
		navigator.mediaDevices.enumerateDevices().then(function(sources) {
			for (var i = 0; sources.length; ++i) {
				if (sources[i].kind == "videoinput" || (sources[i].kind == "video" && (sources[i].facing == "" || sources[i].facing == "environment"))) {
					return sources[i].id;
				}
			}
		});
	}
	
	var errorCallback = function(error) {
		console.error('An error occurred: [CODE ' + error.code + ']');
		console.log(error);
	}
	
	var successCallback = function(stream) {
		if (video.mozSrcObject !== undefined) {
			video.mozSrcObject = stream;
		} else {
			video.src = (window.URL && window.URL.createObjectURL(stream)) || stream;
		}
		videoStream = stream;
		video.onloadedmetadata = function() {
			video.play();
		}
		
		intervalID = setInterval(captureToCanvas, 500);
	}
	
	var captureToCanvas = function() {
		context.drawImage(video, 0, 0, options.width, options.height);
		try {
			var result = qrcode.decode({"canvas":context.canvas});
			Meteor.qrScanner.stop();
			options.done(result);
		} catch(error) {
			options.fail(error);
		}
	}
	
	var setOptions = function(_options) {
		for (var key in _options) {
			options[key] = _options[key];
		}
	}
	
	this.init = function(_options) {
		var canvas = document.createElement('canvas');
		initCamera();
		
		if (!navigator.mediaDevices) {
			document.getElementById('stremingIsNotSupported').style.display = 'block';
			console.error('Native web camera streaming (getUserMedia) not supported in this browser.');
			return;
		}
		else if (!canvas.getContext || !canvas.getContext('2d')) {
			document.getElementById('canvasIsNotSupported').style.display = 'block';
			console.error("Canvas is not supported");
			return;
		}
		if (_options) {
			setOptions(_options);
		}
		video = document.getElementById('qr-scanner-video');
		initContext(canvas);
		isReady = true;
	}
	
	this.scan = function() {
		if (isReady) {
			navigator.mediaDevices.getUserMedia({
				"video": {
					"mandatory": {
						"maxWidth": options.width,
						"maxHeight": options.height,
					},
					"optional": [{
						"sourceId": camera
					}]
				},
				"audio": false
			}).then(successCallback).catch(errorCallback);
		}
	}
	
	this.stop = function() {
		clearInterval(intervalID);
		video.pause();
		if (video.mozSrcObject !== undefined) {
			video.mozSrcObject = null;
		} else {
			video.src = null;
		}
		if (videoStream) {
			var tracks = videoStream.getTracks();
			for (var i = 0; i < tracks.length; ++i) {
				tracks[i].stop();
			}
		}
		context.clearRect(0, 0, options.width, options.height);
	}
}

Template.qrScanner.rendered = function() {
	Meteor.qrScanner.init();
}

Template.qrScanner.destroyed = function() {
	Meteor.qrScanner.stop();
}
