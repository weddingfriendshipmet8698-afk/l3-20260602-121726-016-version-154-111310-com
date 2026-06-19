(function () {
  function getAll(selector, root) {
    return Array.prototype.slice.call((root || document).querySelectorAll(selector));
  }

  function initNavigation() {
    var toggle = document.querySelector('.nav-toggle');
    var mobileNav = document.querySelector('.mobile-nav');
    if (!toggle || !mobileNav) {
      return;
    }
    toggle.addEventListener('click', function () {
      var isOpen = mobileNav.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });
  }

  function initHero() {
    var slides = getAll('.hero-slide');
    var dots = getAll('.hero-dot');
    if (!slides.length || !dots.length) {
      return;
    }
    var current = 0;
    var timer = null;
    function show(index) {
      current = (index + slides.length) % slides.length;
      slides.forEach(function (slide, slideIndex) {
        slide.classList.toggle('is-active', slideIndex === current);
      });
      dots.forEach(function (dot, dotIndex) {
        dot.classList.toggle('is-active', dotIndex === current);
      });
    }
    function play() {
      clearInterval(timer);
      timer = setInterval(function () {
        show(current + 1);
      }, 5200);
    }
    dots.forEach(function (dot, index) {
      dot.addEventListener('click', function () {
        show(index);
        play();
      });
    });
    show(0);
    play();
  }

  function normalize(value) {
    return String(value || '').toLowerCase().trim();
  }

  function initCategoryFilter() {
    var list = document.querySelector('[data-filter-list]');
    if (!list) {
      return;
    }
    var cards = getAll('[data-filter-card]', list);
    var queryInput = document.querySelector('[data-filter-query]');
    var yearSelect = document.querySelector('[data-filter-year]');
    var typeSelect = document.querySelector('[data-filter-type]');
    function apply() {
      var query = normalize(queryInput && queryInput.value);
      var year = normalize(yearSelect && yearSelect.value);
      var type = normalize(typeSelect && typeSelect.value);
      cards.forEach(function (card) {
        var haystack = normalize([
          card.getAttribute('data-title'),
          card.getAttribute('data-genre'),
          card.getAttribute('data-region'),
          card.getAttribute('data-tags')
        ].join(' '));
        var cardYear = normalize(card.getAttribute('data-year'));
        var cardType = normalize(card.getAttribute('data-type'));
        var matched = true;
        if (query && haystack.indexOf(query) === -1) {
          matched = false;
        }
        if (year && cardYear !== year) {
          matched = false;
        }
        if (type && cardType.indexOf(type) === -1) {
          matched = false;
        }
        card.style.display = matched ? '' : 'none';
      });
    }
    [queryInput, yearSelect, typeSelect].forEach(function (control) {
      if (control) {
        control.addEventListener('input', apply);
        control.addEventListener('change', apply);
      }
    });
    apply();
  }

  function renderSearchCard(item) {
    return [
      '<a class="search-card" href="' + item.url + '">',
      '<figure><img src="' + item.cover + '" alt="' + item.title + '" loading="lazy"></figure>',
      '<span>',
      '<h3>' + item.title + '</h3>',
      '<span class="card-meta"><span>' + item.type + '</span><span>' + item.region + '</span><span>' + item.year + '</span></span>',
      '<p>' + item.oneLine + '</p>',
      '</span>',
      '</a>'
    ].join('');
  }

  function initSearchPage() {
    var results = document.querySelector('[data-search-results]');
    var input = document.querySelector('[data-search-input]');
    var type = document.querySelector('[data-search-type]');
    var year = document.querySelector('[data-search-year]');
    var button = document.querySelector('[data-search-button]');
    if (!results || !input || !window.__MOVIE_SEARCH__) {
      return;
    }
    var params = new URLSearchParams(window.location.search);
    if (params.get('q')) {
      input.value = params.get('q');
    }
    function apply() {
      var q = normalize(input.value);
      var t = normalize(type && type.value);
      var y = normalize(year && year.value);
      var data = window.__MOVIE_SEARCH__.filter(function (item) {
        var haystack = normalize(item.title + ' ' + item.region + ' ' + item.type + ' ' + item.genre + ' ' + item.tags + ' ' + item.oneLine);
        if (q && haystack.indexOf(q) === -1) {
          return false;
        }
        if (t && normalize(item.type).indexOf(t) === -1) {
          return false;
        }
        if (y && normalize(item.year) !== y) {
          return false;
        }
        return true;
      }).slice(0, 80);
      if (!data.length) {
        results.innerHTML = '<div class="empty-note">没有匹配到影片，换一个关键词继续查找。</div>';
        return;
      }
      results.innerHTML = data.map(renderSearchCard).join('');
    }
    [input, type, year].forEach(function (control) {
      if (control) {
        control.addEventListener('input', apply);
        control.addEventListener('change', apply);
      }
    });
    if (button) {
      button.addEventListener('click', apply);
    }
    apply();
  }

  document.addEventListener('DOMContentLoaded', function () {
    initNavigation();
    initHero();
    initCategoryFilter();
    initSearchPage();
  });
})();
