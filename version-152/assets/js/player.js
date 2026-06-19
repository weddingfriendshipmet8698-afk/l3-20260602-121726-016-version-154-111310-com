import { H as Hls } from './video-vendor-dru42stk.js';

(function () {
  var video = document.getElementById('movie-player');
  var overlay = document.querySelector('[data-play-overlay]');

  if (!video) {
    return;
  }

  var hlsSource = video.getAttribute('data-hls');
  var mp4Source = video.getAttribute('data-mp4');

  function useMp4Fallback() {
    if (mp4Source) {
      video.src = mp4Source;
    }
  }

  try {
    if (hlsSource && Hls && Hls.isSupported()) {
      var hls = new Hls({
        enableWorker: true,
        lowLatencyMode: false,
        backBufferLength: 30
      });

      hls.loadSource(hlsSource);
      hls.attachMedia(video);
      hls.on(Hls.Events.ERROR, function (_event, data) {
        if (data && data.fatal) {
          hls.destroy();
          useMp4Fallback();
        }
      });
    } else if (hlsSource && video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = hlsSource;
    } else {
      useMp4Fallback();
    }
  } catch (error) {
    useMp4Fallback();
  }

  function startPlayback() {
    if (overlay) {
      overlay.classList.add('is-hidden');
    }

    var promise = video.play();

    if (promise && typeof promise.catch === 'function') {
      promise.catch(function () {
        video.controls = true;
      });
    }
  }

  if (overlay) {
    overlay.addEventListener('click', startPlayback);
  }

  video.addEventListener('play', function () {
    if (overlay) {
      overlay.classList.add('is-hidden');
    }
  });

  video.addEventListener('pause', function () {
    if (overlay && video.currentTime < 0.1) {
      overlay.classList.remove('is-hidden');
    }
  });
})();
