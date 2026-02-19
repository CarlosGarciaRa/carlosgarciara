(function () {
  var GRID_ID = "projects-grid";
  var DATA_URL = "data/projects.json";
  var currentFilter = "all";
  var allProjects = [];

  function getLang() {
    var lang = document.documentElement.getAttribute("lang") || "es";
    return lang.startsWith("en") ? "en" : "es";
  }

  function getButtonLabels() {
    var lang = getLang();
    return lang === "en"
      ? { verDemo: "View Demo", github: "GitHub", privadoNda: "Private (NDA)" }
      : { verDemo: "Ver Demo", github: "GitHub", privadoNda: "Privado (NDA)" };
  }

  /** Título y descripción del proyecto según idioma (soporta titleEn/descriptionEn en JSON). */
  function getProjectText(p) {
    var lang = getLang();
    if (lang === "en" && (p.titleEn || p.descriptionEn)) {
      return {
        title: p.titleEn || p.title,
        description: p.descriptionEn || p.description
      };
    }
    return { title: p.title, description: p.description };
  }

  /**
   * Simula una llamada a API: carga projects.json (fetch local).
   */
  function fetchProjects() {
    return fetch(DATA_URL)
      .then(function (res) {
        if (!res.ok) throw new Error("No se pudo cargar projects.json");
        return res.json();
      })
      .catch(function (err) {
        console.warn("fetchProjects error:", err);
        return [];
      });
  }

  function matchesFilter(project) {
    if (currentFilter === "all") return true;
    if (currentFilter === "enterprise") return project.type === "enterprise";
    if (currentFilter === "personal") return project.type === "personal";
    if (currentFilter === "web") return project.categories && project.categories.indexOf("web") !== -1;
    if (currentFilter === "mobile") return project.categories && project.categories.indexOf("mobile") !== -1;
    return true;
  }

  function renderProjects(projects) {
    var grid = document.getElementById(GRID_ID);
    if (!grid) return;

    var labels = getButtonLabels();
    grid.classList.add("is-filtering");
    grid.innerHTML = "";

    setTimeout(function () {
      grid.classList.remove("is-filtering");

      if (projects.length === 0) {
        var empty = document.createElement("div");
        empty.className = "col-12 text-center py-5 text-secondary";
        empty.setAttribute("data-i18n", "proyectos.proximamente");
        empty.textContent = document.documentElement.lang === "en" ? "Content coming soon." : "Contenido próximamente.";
        grid.appendChild(empty);
        return;
      }

      projects.forEach(function (p) {
        var col = document.createElement("div");
        col.className = p.isFeatured ? "col project-card-col col-lg-8" : "col project-card-col";

        var text = getProjectText(p);
        var isEnterprise = p.type === "enterprise";
        var badgeText = isEnterprise ? (getLang() === "en" ? "Enterprise" : "Empresa") : (getLang() === "en" ? "Personal" : "Personal");
        var badgeClass = isEnterprise ? "project-card__badge--enterprise" : "project-card__badge--personal";

        var tagsHtml = (p.tags || []).map(function (tag) {
          return '<span class="project-card__tag">' + escapeHtml(tag) + "</span>";
        }).join("");

        var demoBtn = p.demoUrl && p.demoUrl !== "#"
          ? '<a href="' + escapeHtml(p.demoUrl) + '" target="_blank" rel="noopener noreferrer" class="btn btn-primary btn-sm">' + labels.verDemo + "</a>"
          : '<span class="btn btn-secondary btn-sm disabled">' + labels.verDemo + "</span>";

        var repoBtn;
        if (isEnterprise && !p.repoUrl) {
          repoBtn =
            '<button type="button" class="btn btn-outline-secondary btn-sm" disabled title="' + labels.privadoNda + '" data-bs-toggle="tooltip" data-bs-placement="top">' +
            labels.privadoNda +
            "</button>";
        } else if (p.repoUrl) {
          repoBtn = '<a href="' + escapeHtml(p.repoUrl) + '" target="_blank" rel="noopener noreferrer" class="btn btn-outline-primary btn-sm">' + labels.github + "</a>";
        } else {
          repoBtn = '<span class="btn btn-outline-secondary btn-sm disabled">' + labels.github + "</span>";
        }

        col.innerHTML =
          '<article class="project-card card border-0">' +
          '  <div class="project-card__image-wrap">' +
          '    <img class="project-card__image" src="' + escapeHtml(p.image) + '" alt="" loading="lazy">' +
          '    <span class="project-card__badge ' + badgeClass + '">' + escapeHtml(badgeText) + "</span>" +
          "  </div>" +
          '  <div class="project-card__body">' +
          '    <h3 class="project-card__title">' + escapeHtml(text.title) + "</h3>" +
          '    <div class="project-card__tags">' + tagsHtml + "</div>" +
          '    <p class="project-card__description">' + escapeHtml(text.description) + "</p>" +
          '    <div class="project-card__actions">' + demoBtn + repoBtn + "</div>" +
          "  </div>" +
          "</article>";

        grid.appendChild(col);
      });

      var tooltips = grid.querySelectorAll("[data-bs-toggle=\"tooltip\"]");
      if (typeof bootstrap !== "undefined" && bootstrap.Tooltip) {
        tooltips.forEach(function (el) {
          new bootstrap.Tooltip(el);
        });
      }
    }, 150);
  }

  function escapeHtml(text) {
    if (!text) return "";
    var div = document.createElement("div");
    div.textContent = text;
    return div.innerHTML;
  }

  function applyFilter() {
    var filtered = currentFilter === "all" ? allProjects : allProjects.filter(matchesFilter);
    renderProjects(filtered);
  }

  function initFilters() {
    document.querySelectorAll("input[name=\"projectFilter\"]").forEach(function (radio) {
      radio.addEventListener("change", function () {
        currentFilter = this.value;
        applyFilter();
      });
    });
  }

  function init() {
    fetchProjects().then(function (data) {
      allProjects = Array.isArray(data) ? data : [];
      applyFilter();
    });
    initFilters();
    window.addEventListener("portfolio:langChange", function () {
      // Solo re-renderizar si ya tenemos proyectos cargados (evita mostrar "Contenido próximamente." al recargar)
      if (allProjects.length > 0) {
        applyFilter();
      }
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
