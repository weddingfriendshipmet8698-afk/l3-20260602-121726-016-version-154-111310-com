(function () {
  window.initMoviePlayer = function (playUrl) {
    var video = document.getElementById("movie-video");
    var trigger = document.querySelector("[data-play-trigger]");
    if (!video || !playUrl) {
      return;
    }

    var hls = null;
    var ready = false;

    function attach() {
      if (ready) {
        return;
      }
      if (video.canPlayType("application/vnd.apple.mpegurl")) {
        video.src = playUrl;
        ready = true;
        return;
      }
      if (window.Hls && window.Hls.isSupported()) {
        hls = new window.Hls({
          enableWorker: true,
          lowLatencyMode: true
        });
        hls.loadSource(playUrl);
        hls.attachMedia(video);
        hls.on(window.Hls.Events.ERROR, function (event, data) {
          if (data && data.fatal && trigger) {
            trigger.innerHTML = "<span class=\"play-circle\">!</span><span>视频加载失败，请稍后再试</span>";
            trigger.classList.remove("is-hidden");
          }
        });
        ready = true;
        return;
      }
      video.src = playUrl;
      ready = true;
    }

    function start() {
      attach();
      if (trigger) {
        trigger.classList.add("is-hidden");
      }
      var playing = video.play();
      if (playing && typeof playing.catch === "function") {
        playing.catch(function () {
          if (trigger) {
            trigger.classList.remove("is-hidden");
          }
        });
      }
    }

    attach();

    if (trigger) {
      trigger.addEventListener("click", start);
    }

    video.addEventListener("click", function () {
      if (video.paused) {
        start();
      }
    });

    video.addEventListener("play", function () {
      if (trigger) {
        trigger.classList.add("is-hidden");
      }
    });

    window.addEventListener("pagehide", function () {
      if (hls) {
        hls.destroy();
      }
    });
  };
})();
