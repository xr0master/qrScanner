qrScanner = new function() {
	
	var context = null;
	var video = null;
	var intervalID = null;
	var isReady = false;
	
	var options = {
		"width": 1024,
		"height": 768,
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
		navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;
		window.URL = window.URL || window.webkitURL || window.mozURL || window.msURL;		
	}
	
	var errorCallback = function(error) {
		console.error('An error occurred: [CODE ' + error.code + ']');
	}
	
	var successCallback = function(stream) {
		if (video.mozSrcObject !== undefined) {
			video.mozSrcObject = stream;
		} else {
			video.src = (window.URL && window.URL.createObjectURL(stream)) || stream;
		}
		video.play();
		
		intervalID = setInterval(captureToCanvas, 500);
	}
	
	var captureToCanvas = function() {
		context.drawImage(video, 0, 0, options.width, options.height);
		try {
			var result = qrcode.decode({"canvas":context.canvas});
			qrScanner.stop();
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
		
		if (!navigator.getUserMedia) {
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
			navigator.getUserMedia({
				"video":  { width: options.width, height: options.width }
				"audio": false
			}, successCallback, errorCallback);
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
	}
}

Template.qrScanner.rendered = function() {
	qrScanner.init();
}

Template.qrScanner.destroyed = function() {
	qrScanner.stop();
}
