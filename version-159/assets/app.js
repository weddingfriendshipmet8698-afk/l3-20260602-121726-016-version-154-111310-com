(function () {
  function normalize(value) {
    return String(value || "").toLowerCase().trim();
  }

  var toggle = document.querySelector(".menu-toggle");
  var panel = document.querySelector(".mobile-panel");
  if (toggle && panel) {
    toggle.addEventListener("click", function () {
      var open = panel.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
  }

  document.querySelectorAll("[data-filter-list]").forEach(function (list) {
    var wrap = list.closest(".container") || document;
    var input = wrap.querySelector("[data-filter-input]");
    var empty = wrap.querySelector("[data-empty-filter]");
    var chips = Array.prototype.slice.call(wrap.querySelectorAll("[data-filter-genre]"));
    var activeGenre = "all";

    function applyFilter() {
      var q = normalize(input ? input.value : "");
      var visible = 0;
      list.querySelectorAll("[data-movie-card]").forEach(function (card) {
        var text = normalize(card.getAttribute("data-keywords"));
        var genre = normalize(card.getAttribute("data-genre"));
        var genreOk = activeGenre === "all" || genre.indexOf(normalize(activeGenre)) !== -1;
        var textOk = !q || text.indexOf(q) !== -1;
        var show = genreOk && textOk;
        card.hidden = !show;
        if (show) visible += 1;
      });
      if (empty) empty.hidden = visible !== 0;
    }

    if (input) {
      input.addEventListener("input", applyFilter);
    }

    chips.forEach(function (chip) {
      chip.addEventListener("click", function () {
        chips.forEach(function (item) {
          item.classList.remove("is-active");
        });
        chip.classList.add("is-active");
        activeGenre = chip.getAttribute("data-filter-genre") || "all";
        applyFilter();
      });
    });
  });

  var resultRoot = document.querySelector("[data-search-results]");
  if (resultRoot && window.MovieSearchData) {
    var params = new URLSearchParams(window.location.search);
    var query = normalize(params.get("q"));
    var formInput = document.querySelector(".search-page-form input[name='q']");
    var empty = document.querySelector("[data-search-empty]");
    if (formInput) {
      formInput.value = params.get("q") || "";
    }

    function escapeHtml(value) {
      return String(value || "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
    }

    function renderCard(item) {
      var tags = (item.tags || []).slice(0, 3).map(function (tag) {
        return "<span>" + escapeHtml(tag) + "</span>";
      }).join("");
      return "<article class=\"movie-card\">" +
        "<a class=\"poster-wrap\" href=\"" + escapeHtml(item.url) + "\" aria-label=\"" + escapeHtml(item.title) + "\">" +
          "<img src=\"" + escapeHtml(item.cover) + "\" alt=\"" + escapeHtml(item.title) + "\" loading=\"lazy\">" +
          "<span class=\"poster-badge\">" + escapeHtml(item.category) + "</span>" +
        "</a>" +
        "<div class=\"movie-card-body\">" +
          "<h3><a href=\"" + escapeHtml(item.url) + "\">" + escapeHtml(item.title) + "</a></h3>" +
          "<p>" + escapeHtml(item.oneLine) + "</p>" +
          "<div class=\"movie-meta\"><span>" + escapeHtml(item.year) + "</span><span>" + escapeHtml(item.region) + "</span><span>" + escapeHtml(item.type) + "</span></div>" +
          "<div class=\"tag-row\">" + tags + "</div>" +
        "</div>" +
      "</article>";
    }

    if (query) {
      var matches = window.MovieSearchData.filter(function (item) {
        return normalize([
          item.title,
          item.region,
          item.type,
          item.year,
          item.genre,
          item.category,
          item.oneLine,
          (item.tags || []).join(" ")
        ].join(" ")).indexOf(query) !== -1;
      }).slice(0, 120);
      resultRoot.innerHTML = matches.map(renderCard).join("");
      if (empty) empty.hidden = matches.length !== 0;
    }
  }
})();
