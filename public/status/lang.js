// Idioma de las páginas de estado (construction.html, 503.html): sin JavaScript se ve el inglés.
// Mismo orden que el sitio (src/i18n/config.ts): elección guardada → idioma del navegador → inglés.
// Los botones EN · FR · ES cambian el bloque visible y guardan la elección (la misma clave que el sitio).
(function () {
  var LOCALES = ["en", "fr", "es"];
  var KEY = "preferred-locale";

  function stored() {
    try {
      return localStorage.getItem(KEY);
    } catch (e) {
      return null;
    }
  }

  function detect() {
    if (LOCALES.indexOf(stored()) >= 0) return stored();
    var tags = navigator.languages || [navigator.language];
    for (var i = 0; i < tags.length; i++) {
      var base = String(tags[i]).toLowerCase().split("-")[0];
      if (LOCALES.indexOf(base) >= 0) return base;
    }
    return "en";
  }

  function show(locale) {
    document.documentElement.lang = locale;
    document.querySelectorAll("[data-lang]").forEach(function (block) {
      block.hidden = block.getAttribute("data-lang") !== locale;
    });
    document.querySelectorAll("[data-set-lang]").forEach(function (button) {
      button.setAttribute("aria-pressed", String(button.getAttribute("data-set-lang") === locale));
    });
    var title = document.querySelector('[data-lang="' + locale + '"] h1');
    if (title) document.title = title.textContent + " — Karol Giraldo";
  }

  document.querySelectorAll("[data-set-lang]").forEach(function (button) {
    button.addEventListener("click", function () {
      var locale = button.getAttribute("data-set-lang");
      try {
        localStorage.setItem(KEY, locale);
      } catch (e) {
        // Navegación privada: solo cambia en esta visita.
      }
      show(locale);
    });
  });

  show(detect());
})();
