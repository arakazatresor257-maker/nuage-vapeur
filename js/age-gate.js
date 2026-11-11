/**
 * Contrôle d’âge : le site n’est accessible qu’après une déclaration
 * de majorité (18 ans), mémorisée dans localStorage.
 * Un refus affiche un écran de sortie et bloque l’accès au contenu.
 */
(function () {
  const ACCEPTED = "oui";

  function isAccepted() {
    try {
      return localStorage.getItem(NUAGE_CONFIG.ageStorageKey) === ACCEPTED;
    } catch (error) {
      return false;
    }
  }

  function accept() {
    try {
      localStorage.setItem(NUAGE_CONFIG.ageStorageKey, ACCEPTED);
    } catch (error) {
      // Si le stockage est indisponible, on laisse tout de même passer pour cette session.
    }
    hideGate();
  }

  function refuse() {
    const gate = document.getElementById("age-gate");
    const dialog = document.getElementById("age-gate-dialog");
    const exitScreen = document.getElementById("age-gate-exit");
    if (dialog) {
      dialog.hidden = true;
    }
    if (exitScreen) {
      exitScreen.hidden = false;
      const heading = exitScreen.querySelector("h1, h2");
      if (heading) {
        heading.focus();
      }
    }
    if (gate) {
      gate.setAttribute("data-refused", "true");
    }
    document.body.classList.add("age-gate-refused");
  }

  function hideGate() {
    const gate = document.getElementById("age-gate");
    if (gate) {
      gate.hidden = true;
      gate.setAttribute("aria-hidden", "true");
    }
    document.body.classList.remove("age-gate-locked");
  }

  function showGate() {
    const gate = document.getElementById("age-gate");
    const dialog = document.getElementById("age-gate-dialog");
    const exitScreen = document.getElementById("age-gate-exit");
    if (exitScreen) {
      exitScreen.hidden = true;
    }
    if (dialog) {
      dialog.hidden = false;
    }
    if (gate) {
      gate.hidden = false;
      gate.removeAttribute("aria-hidden");
    }
    document.body.classList.add("age-gate-locked");
    const acceptButton = document.getElementById("age-accept");
    if (acceptButton) {
      acceptButton.focus();
    }
  }

  function trapFocus(event) {
    const gate = document.getElementById("age-gate");
    if (!gate || gate.hidden) {
      return;
    }
    if (event.key !== "Tab") {
      return;
    }
    const focusable = gate.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
    const visible = Array.prototype.filter.call(focusable, function (el) {
      return !el.disabled && el.offsetParent !== null && !el.closest("[hidden]");
    });
    if (visible.length === 0) {
      event.preventDefault();
      return;
    }
    const first = visible[0];
    const last = visible[visible.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  }

  document.addEventListener("DOMContentLoaded", function () {
    const acceptButton = document.getElementById("age-accept");
    const refuseButton = document.getElementById("age-refuse");
    if (acceptButton) {
      acceptButton.addEventListener("click", accept);
    }
    if (refuseButton) {
      refuseButton.addEventListener("click", refuse);
    }
    document.addEventListener("keydown", trapFocus);

    if (isAccepted()) {
      hideGate();
    } else {
      showGate();
    }
  });
})();
