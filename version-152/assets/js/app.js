(function () {
  var menuToggle = document.querySelector('[data-menu-toggle]');
  var mainNav = document.querySelector('[data-main-nav]');

  if (menuToggle && mainNav) {
    menuToggle.addEventListener('click', function () {
      mainNav.classList.toggle('is-open');
    });
  }

  var backTop = document.querySelector('[data-back-top]');

  if (backTop) {
    window.addEventListener('scroll', function () {
      if (window.scrollY > 500) {
        backTop.classList.add('is-visible');
      } else {
        backTop.classList.remove('is-visible');
      }
    });

    backTop.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  var hero = document.querySelector('[data-hero]');

  if (hero) {
    var slides = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-slide]'));
    var dots = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-dot]'));
    var current = 0;
    var timer = null;

    function activate(index) {
      if (!slides.length) {
        return;
      }

      current = (index + slides.length) % slides.length;

      slides.forEach(function (slide, slideIndex) {
        slide.classList.toggle('is-active', slideIndex === current);
      });

      dots.forEach(function (dot, dotIndex) {
        dot.classList.toggle('is-active', dotIndex === current);
      });
    }

    function start() {
      stop();
      timer = window.setInterval(function () {
        activate(current + 1);
      }, 5600);
    }

    function stop() {
      if (timer) {
        window.clearInterval(timer);
        timer = null;
      }
    }

    dots.forEach(function (dot) {
      dot.addEventListener('click', function () {
        var next = Number(dot.getAttribute('data-hero-dot')) || 0;
        activate(next);
        start();
      });
    });

    hero.addEventListener('mouseenter', stop);
    hero.addEventListener('mouseleave', start);
    activate(0);
    start();
  }

  var filterPanel = document.querySelector('[data-filter-panel]');

  if (filterPanel) {
    var searchInput = filterPanel.querySelector('[data-search-input]');
    var yearFilter = filterPanel.querySelector('[data-year-filter]');
    var typeFilter = filterPanel.querySelector('[data-type-filter]');
    var countLabel = filterPanel.querySelector('[data-filter-count]');
    var cards = Array.prototype.slice.call(document.querySelectorAll('[data-movie-grid] .movie-card'));

    function getText(card) {
      return [
        card.getAttribute('data-title'),
        card.getAttribute('data-genre'),
        card.getAttribute('data-region'),
        card.getAttribute('data-type'),
        card.textContent
      ].join(' ').toLowerCase();
    }

    function matchesYear(card, selectedYear) {
      if (!selectedYear) {
        return true;
      }

      if (selectedYear === '更早') {
        var year = Number(card.getAttribute('data-year')) || 0;
        return year > 0 && year < 2020;
      }

      return card.getAttribute('data-year') === selectedYear;
    }

    function matchesType(card, selectedType) {
      if (!selectedType) {
        return true;
      }

      return (card.getAttribute('data-type') || '').indexOf(selectedType) !== -1 ||
        (card.getAttribute('data-genre') || '').indexOf(selectedType) !== -1;
    }

    function applyFilters() {
      var keyword = (searchInput && searchInput.value ? searchInput.value : '').trim().toLowerCase();
      var selectedYear = yearFilter ? yearFilter.value : '';
      var selectedType = typeFilter ? typeFilter.value : '';
      var visible = 0;

      cards.forEach(function (card) {
        var ok = true;

        if (keyword && getText(card).indexOf(keyword) === -1) {
          ok = false;
        }

        if (!matchesYear(card, selectedYear)) {
          ok = false;
        }

        if (!matchesType(card, selectedType)) {
          ok = false;
        }

        card.classList.toggle('is-filter-hidden', !ok);

        if (ok) {
          visible += 1;
        }
      });

      if (countLabel) {
        countLabel.textContent = '正在显示 ' + visible + ' 部影片';
      }
    }

    [searchInput, yearFilter, typeFilter].forEach(function (node) {
      if (node) {
        node.addEventListener('input', applyFilters);
        node.addEventListener('change', applyFilters);
      }
    });

    applyFilters();
  }
})();
