(function () {
  function attachSource(video, src, onReady) {
    var nativeSupport = video.canPlayType('application/vnd.apple.mpegurl') || video.canPlayType('application/x-mpegURL');
    if (nativeSupport) {
      if (video.getAttribute('src') !== src) {
        video.setAttribute('src', src);
      }
      onReady();
      return;
    }
    if (window.Hls && window.Hls.isSupported()) {
      if (!video.__hlsInstance) {
        var hls = new window.Hls({
          lowLatencyMode: true,
          backBufferLength: 90
        });
        hls.loadSource(src);
        hls.attachMedia(video);
        video.__hlsInstance = hls;
        hls.on(window.Hls.Events.MANIFEST_PARSED, onReady);
      } else {
        onReady();
      }
      return;
    }
    if (video.getAttribute('src') !== src) {
      video.setAttribute('src', src);
    }
    onReady();
  }

  function playVideo(video) {
    var promise = video.play();
    if (promise && typeof promise.catch === 'function') {
      promise.catch(function () {});
    }
  }

  window.initMoviePlayer = function (src) {
    var player = document.querySelector('.movie-player');
    if (!player || !src) {
      return;
    }
    var video = player.querySelector('video');
    var overlay = player.querySelector('.player-overlay');
    var playButton = player.querySelector('.player-play');
    if (!video) {
      return;
    }
    var started = false;
    function activate() {
      attachSource(video, src, function () {
        started = true;
        video.setAttribute('controls', 'controls');
        if (overlay) {
          overlay.classList.add('is-hidden');
        }
        playVideo(video);
      });
    }
    if (overlay) {
      overlay.addEventListener('click', activate);
    }
    if (playButton) {
      playButton.addEventListener('click', function (event) {
        event.stopPropagation();
        activate();
      });
    }
    video.addEventListener('click', function () {
      if (!started && video.paused) {
        activate();
      }
    });
  };
})();
