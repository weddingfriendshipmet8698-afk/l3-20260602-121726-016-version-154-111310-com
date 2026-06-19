(function () {
  var menuButton = document.querySelector("[data-menu-toggle]");
  var mainNav = document.querySelector("[data-main-nav]");

  if (menuButton && mainNav) {
    menuButton.addEventListener("click", function () {
      mainNav.classList.toggle("open");
    });
  }

  var slides = Array.prototype.slice.call(document.querySelectorAll("[data-hero-slide]"));
  var dots = Array.prototype.slice.call(document.querySelectorAll("[data-hero-dot]"));
  var heroIndex = 0;

  function showHeroSlide(index) {
    if (!slides.length) {
      return;
    }

    heroIndex = (index + slides.length) % slides.length;

    slides.forEach(function (slide, slideIndex) {
      slide.classList.toggle("active", slideIndex === heroIndex);
    });

    dots.forEach(function (dot, dotIndex) {
      dot.classList.toggle("active", dotIndex === heroIndex);
    });
  }

  dots.forEach(function (dot, dotIndex) {
    dot.addEventListener("click", function () {
      showHeroSlide(dotIndex);
    });
  });

  if (slides.length > 1) {
    setInterval(function () {
      showHeroSlide(heroIndex + 1);
    }, 5200);
  }

  var filterState = {};

  function applyFilters(targetId) {
    var grid = document.getElementById(targetId);

    if (!grid) {
      return;
    }

    var state = filterState[targetId] || {};
    var cards = Array.prototype.slice.call(grid.querySelectorAll("[data-card]"));
    var shown = 0;

    cards.forEach(function (card) {
      var text = (card.getAttribute("data-search-text") || "").toLowerCase();
      var query = (state.query || "").toLowerCase().trim();
      var type = state.type || "";
      var year = state.year || "";
      var visible = true;

      if (query && text.indexOf(query) === -1) {
        visible = false;
      }

      if (type && card.getAttribute("data-type") !== type) {
        visible = false;
      }

      if (year && card.getAttribute("data-year") !== year) {
        visible = false;
      }

      card.style.display = visible ? "" : "none";

      if (visible) {
        shown += 1;
      }
    });

    var empty = document.querySelector('[data-empty-for="' + targetId + '"]');

    if (empty) {
      empty.classList.toggle("show", shown === 0);
    }
  }

  document.addEventListener("input", function (event) {
    var input = event.target.closest("[data-search-input]");

    if (!input) {
      return;
    }

    var targetId = input.getAttribute("data-target");
    filterState[targetId] = filterState[targetId] || {};
    filterState[targetId].query = input.value;
    applyFilters(targetId);
  });

  document.addEventListener("change", function (event) {
    var select = event.target.closest("[data-filter-select]");

    if (!select) {
      return;
    }

    var targetId = select.getAttribute("data-target");
    var field = select.getAttribute("data-field");
    filterState[targetId] = filterState[targetId] || {};
    filterState[targetId][field] = select.value;
    applyFilters(targetId);
  });

  window.initMoviePlayer = function (videoId, source, buttonId) {
    var video = document.getElementById(videoId);
    var button = document.getElementById(buttonId);
    var ready = false;
    var hls = null;

    if (!video || !source) {
      return;
    }

    function prepare() {
      if (ready) {
        return;
      }

      ready = true;

      if (video.canPlayType("application/vnd.apple.mpegurl")) {
        video.src = source;
      } else if (window.Hls && window.Hls.isSupported()) {
        hls = new window.Hls({
          enableWorker: true,
          lowLatencyMode: true
        });
        hls.loadSource(source);
        hls.attachMedia(video);
      } else {
        video.src = source;
      }
    }

    function start() {
      prepare();

      var attempt = video.play();

      if (attempt && typeof attempt.then === "function") {
        attempt.catch(function () {});
      }

      if (button) {
        button.classList.add("is-hidden");
      }
    }

    if (button) {
      button.addEventListener("click", start);
    }

    video.addEventListener("click", function () {
      if (video.paused) {
        start();
      }
    });

    video.addEventListener("play", function () {
      if (button) {
        button.classList.add("is-hidden");
      }
    });

    window.addEventListener("pagehide", function () {
      if (hls) {
        hls.destroy();
      }
    });
  };
})();
