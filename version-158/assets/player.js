(function () {
  function ready(fn) {
    if (document.readyState !== 'loading') {
      fn();
      return;
    }
    document.addEventListener('DOMContentLoaded', fn);
  }

  function startVideo(box) {
    var video = box.querySelector('video');
    var cover = box.querySelector('.play-cover');
    if (!video) {
      return;
    }
    var src = video.getAttribute('data-stream');
    if (!src) {
      return;
    }
    if (!video.dataset.ready) {
      if (window.Hls && window.Hls.isSupported()) {
        var hls = new window.Hls({
          enableWorker: true,
          lowLatencyMode: true
        });
        hls.loadSource(src);
        hls.attachMedia(video);
        video._hlsInstance = hls;
      } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = src;
      } else {
        video.src = src;
      }
      video.dataset.ready = '1';
    }
    if (cover) {
      cover.classList.add('is-hidden');
    }
    var playPromise = video.play();
    if (playPromise && typeof playPromise.catch === 'function') {
      playPromise.catch(function () {});
    }
  }

  ready(function () {
    var players = document.querySelectorAll('[data-player]');
    players.forEach(function (box) {
      var cover = box.querySelector('.play-cover');
      if (cover) {
        cover.addEventListener('click', function () {
          startVideo(box);
        });
      }
      box.addEventListener('click', function (event) {
        if (event.target && event.target.tagName === 'VIDEO') {
          startVideo(box);
        }
      });
    });
  });
})();
