(function () {
  function ready(fn) {
    if (document.readyState !== 'loading') {
      fn();
      return;
    }
    document.addEventListener('DOMContentLoaded', fn);
  }

  function setupMenu() {
    var toggle = document.querySelector('[data-menu-toggle]');
    var nav = document.querySelector('[data-main-nav]');
    if (!toggle || !nav) {
      return;
    }
    toggle.addEventListener('click', function () {
      nav.classList.toggle('open');
    });
  }

  function setupFilters() {
    var inputs = document.querySelectorAll('[data-filter-input]');
    if (!inputs.length) {
      return;
    }
    inputs.forEach(function (input) {
      input.addEventListener('input', function () {
        var value = input.value.trim().toLowerCase();
        var cards = document.querySelectorAll('[data-card-search]');
        cards.forEach(function (card) {
          var hay = (card.getAttribute('data-card-search') || '').toLowerCase();
          card.classList.toggle('is-hidden-card', value && hay.indexOf(value) === -1);
        });
      });
    });
  }

  function setupHero() {
    var stage = document.querySelector('[data-hero]');
    if (!stage) {
      return;
    }
    var slides = Array.prototype.slice.call(stage.querySelectorAll('.hero-slide'));
    var dotsWrap = stage.querySelector('[data-hero-dots]');
    if (slides.length < 2 || !dotsWrap) {
      return;
    }
    var index = 0;
    var dots = slides.map(function (_, i) {
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.setAttribute('aria-label', '切换焦点影片');
      btn.addEventListener('click', function () {
        show(i);
      });
      dotsWrap.appendChild(btn);
      return btn;
    });
    function show(next) {
      slides[index].classList.remove('active');
      dots[index].classList.remove('active');
      index = next;
      slides[index].classList.add('active');
      dots[index].classList.add('active');
    }
    dots[0].classList.add('active');
    window.setInterval(function () {
      show((index + 1) % slides.length);
    }, 5200);
  }

  ready(function () {
    setupMenu();
    setupFilters();
    setupHero();
  });
})();
