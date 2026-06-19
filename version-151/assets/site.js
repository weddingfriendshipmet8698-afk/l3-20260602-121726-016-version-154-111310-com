(function () {
  var menuButton = document.querySelector('.menu-toggle');
  var mobilePanel = document.querySelector('.mobile-panel');
  if (menuButton && mobilePanel) {
    menuButton.addEventListener('click', function () {
      mobilePanel.classList.toggle('open');
    });
  }

  var slides = Array.prototype.slice.call(document.querySelectorAll('.hero-slide'));
  var dots = Array.prototype.slice.call(document.querySelectorAll('.hero-dot'));
  if (slides.length > 1) {
    var activeIndex = 0;
    var showSlide = function (index) {
      activeIndex = index % slides.length;
      slides.forEach(function (slide, slideIndex) {
        slide.classList.toggle('active', slideIndex === activeIndex);
      });
      dots.forEach(function (dot, dotIndex) {
        dot.classList.toggle('active', dotIndex === activeIndex);
      });
    };
    dots.forEach(function (dot, index) {
      dot.addEventListener('click', function () {
        showSlide(index);
      });
    });
    window.setInterval(function () {
      showSlide(activeIndex + 1);
    }, 5500);
  }

  var filterInput = document.querySelector('.card-filter');
  var filterButtons = Array.prototype.slice.call(document.querySelectorAll('[data-filter]'));
  var cards = Array.prototype.slice.call(document.querySelectorAll('.movie-card, .rank-item'));
  var activeFilter = 'all';
  var applyFilter = function () {
    var query = filterInput ? filterInput.value.trim().toLowerCase() : '';
    cards.forEach(function (card) {
      var text = [
        card.getAttribute('data-title'),
        card.getAttribute('data-region'),
        card.getAttribute('data-genre'),
        card.getAttribute('data-type'),
        card.getAttribute('data-year')
      ].join(' ').toLowerCase();
      var queryMatch = !query || text.indexOf(query) !== -1;
      var typeMatch = activeFilter === 'all' || text.indexOf(activeFilter.toLowerCase()) !== -1;
      card.classList.toggle('hidden-card', !(queryMatch && typeMatch));
    });
  };
  if (filterInput) {
    filterInput.addEventListener('input', applyFilter);
    var params = new URLSearchParams(window.location.search);
    var q = params.get('q');
    if (q) {
      filterInput.value = q;
      applyFilter();
    }
  }
  filterButtons.forEach(function (button) {
    button.addEventListener('click', function () {
      filterButtons.forEach(function (item) {
        item.classList.remove('active');
      });
      button.classList.add('active');
      activeFilter = button.getAttribute('data-filter') || 'all';
      applyFilter();
    });
  });

  var player = document.querySelector('.player-box');
  if (player) {
    var video = player.querySelector('video');
    var cover = player.querySelector('.player-cover');
    var button = player.querySelector('.player-button');
    var srcUrl = player.getAttribute('data-video') || '';
    var started = false;
    var start = function () {
      if (!video || !srcUrl) {
        return;
      }
      if (!started) {
        started = true;
        if (window.Hls && window.Hls.isSupported()) {
          var hls = new window.Hls({ enableWorker: true });
          hls.loadSource(srcUrl);
          hls.attachMedia(video);
        } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
          video.src = srcUrl;
        } else {
          video.src = srcUrl;
        }
      }
      if (cover) {
        cover.classList.add('hidden');
      }
      video.play().catch(function () {});
    };
    if (button) {
      button.addEventListener('click', start);
    }
    if (video) {
      video.addEventListener('click', function () {
        if (video.paused) {
          start();
        } else {
          video.pause();
        }
      });
    }
  }
})();
