/**
 * Utilitaires partagés : formatage, chargement des produits, navigation.
 */

/**
 * Formate un prix en euros selon l’usage typographique français
 * (virgule décimale et espace insécable fine avant le symbole).
 */
function formatPrice(value) {
  const amount = Number(value).toFixed(2).replace(".", ",");
  return amount + "\u202F€";
}

/**
 * Charge le catalogue depuis products.json.
 * @returns {Promise<Array>}
 */
async function loadProducts() {
  const response = await fetch(NUAGE_CONFIG.productsUrl, { cache: "no-store" });
  if (!response.ok) {
    throw new Error("Impossible de charger le catalogue (code " + response.status + ").");
  }
  const data = await response.json();
  if (!Array.isArray(data)) {
    throw new Error("Le fichier products.json doit contenir un tableau de produits.");
  }
  return data;
}

function getProductById(products, id) {
  return products.find(function (item) {
    return item.id === id;
  });
}

/** Met à jour le compteur d’articles affiché dans la navigation. */
function updateCartBadge() {
  const badge = document.querySelector("[data-cart-count]");
  if (!badge) {
    return;
  }
  const count = getCartCount();
  badge.textContent = String(count);
  badge.hidden = count === 0;
  badge.setAttribute("aria-label", count + " article" + (count > 1 ? "s" : "") + " dans le panier");
}

/** Indique la page courante dans la navigation. */
function markCurrentNav() {
  const file = (location.pathname.split("/").pop() || "index.html").toLowerCase();
  const current = file === "" ? "index.html" : file;
  document.querySelectorAll(".site-nav a[href]").forEach(function (link) {
    const href = link.getAttribute("href");
    if (href === current || (current === "" && href === "index.html")) {
      link.setAttribute("aria-current", "page");
    } else {
      link.removeAttribute("aria-current");
    }
  });
}

document.addEventListener("DOMContentLoaded", function () {
  markCurrentNav();
  updateCartBadge();
});

window.addEventListener("nuage:panier-change", updateCartBadge);
