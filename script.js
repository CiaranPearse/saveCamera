var webrtc = (function() {

    var getVideo = true,
        getAudio = false,

        video = document.getElementById('webcam'),
        feed = document.getElementById('feed'),
        feedContext = feed.getContext('2d'),
        display = document.getElementById('display'),
        displayContext = display.getContext('2d');

    navigator.getUserMedia ||
        (navigator.getUserMedia = navigator.mozGetUserMedia ||
        navigator.webkitGetUserMedia || navigator.msGetUserMedia);

    window.audioContext ||
        (window.audioContext = window.webkitAudioContext);

    window.requestAnimationFrame ||
        (window.requestAnimationFrame = window.webkitRequestAnimationFrame || 
            window.mozRequestAnimationFrame || 
            window.oRequestAnimationFrame || 
            window.msRequestAnimationFrame || 
            function( callback ){
                window.setTimeout(callback, 1000 / 60);
            });

    function onSuccess(stream) {
        var videoSource,
            audioContext,
            mediaStreamSource;

        if (getVideo) {
            if (window.webkitURL) {
                videoSource = window.webkitURL.createObjectURL(stream);
            } else {
                videoSource = stream;
            }

            video.autoplay = true;
            video.src = videoSource;

            display.width = feed.width = 320;
            display.height = feed.height = 240;

            streamFeed();
        }

        if (getAudio && window.audioContext) {
            audioContext = new window.audioContext();
            mediaStreamSource = audioContext.createMediaStreamSource(stream);
            mediaStreamSource.connect(audioContext.destination);
        }
    }

    function onError() {
        alert('Little problem. Are you running this on a server?');
    }

    function takePhoto() {
        var photo = document.getElementById('photo'),
            context = photo.getContext('2d');

        photo.width = display.width;
        photo.height = display.height;

        context.drawImage(display, 0, 0, photo.width, photo.height);

        var canvas = document.getElementById('photo');
        var dataURL = photo.toDataURL();
        document.getElementById('canvasImg').src = dataURL;
    }

    function requestStreams() {
        if (navigator.getUserMedia) {
            navigator.getUserMedia({
                video: getVideo,
                audio: getAudio
            }, onSuccess, onError);
        } else {
            alert('You cant do this in this browser.');
        }
    }

    function addEffects(data) {

        // Just here to show that it can be done.
        var effect = 'redtransparent'; 

        for (var i = 0, l = data.length; i < l; i += 100) {
            switch (effect) {
                case 'red':
                    data[i + 1] = 0; // g
                    data[i + 2] = 0; // b
                    break;
                case 'invert':
                    data[i] = 255 - data[i]; // r
                    data[i + 1] = 255 - data[i + 1]; // g
                    data[i + 2] = 255 - data[i + 2]; // b
                    break;
                case 'redtransparent':
                    if (data[i] > 127) {
                        data[i + 3] = 127;
                    }

            }
            
        }

        return data;
    }

    function streamFeed() {
        requestAnimationFrame(streamFeed);
        feedContext.drawImage(video, 0, 0, display.width, display.height);
        imageData = feedContext.getImageData(0, 0, display.width, display.height);

        imageData.data = addEffects(imageData.data);

        displayContext.putImageData(imageData, 0, 0);
    }

    function initEvents() {
        var photoButton = document.getElementById('takePhoto');
        photoButton.addEventListener('click', takePhoto, false);
    }

    (function init() {
        requestStreams();
        initEvents();
    }());
})();



