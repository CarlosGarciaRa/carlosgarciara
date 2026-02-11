(function () {
  var STORAGE_THEME = "portfolio-theme";
  var DEFAULT_THEME = "violeta";

  // Actualizar año en el footer (manejado por i18n.js)
  function actualizarFooterCredito() {
    var creditoEl = document.getElementById("footer-credito");
    if (creditoEl && window.getCurrentLang) {
      var lang = window.getCurrentLang();
      var texto = lang === "en" 
        ? "© " + new Date().getFullYear() + " · Made with HTML, Bootstrap and a bit of coffee"
        : "© " + new Date().getFullYear() + " · Hecho con HTML, Bootstrap y un poco de café";
      creditoEl.textContent = texto;
    }
  }

  // Esperar a que i18n esté listo
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", function() {
      setTimeout(actualizarFooterCredito, 100);
    });
  } else {
    setTimeout(actualizarFooterCredito, 100);
  }

  // Aplicar tema guardado al cargar
  function aplicarTema(id) {
    document.body.setAttribute("data-theme", id || DEFAULT_THEME);
    var btns = document.querySelectorAll(".paleta-barra__btn");
    btns.forEach(function (btn) {
      btn.classList.toggle("activo", btn.getAttribute("data-theme") === (id || DEFAULT_THEME));
    });
  }

  var saved = localStorage.getItem(STORAGE_THEME);
  if (saved) aplicarTema(saved);
  else aplicarTema(DEFAULT_THEME);

  // Clic en botón de paleta
  document.querySelectorAll(".paleta-barra__btn").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var id = this.getAttribute("data-theme");
      aplicarTema(id);
      localStorage.setItem(STORAGE_THEME, id);
    });
  });
})();
