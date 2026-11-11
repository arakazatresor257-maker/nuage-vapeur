/**
 * Page Boutique : filtres par catégorie (effectifs calculés) et ajout au panier.
 */
(function () {
  let products = [];
  let activeCategory = "tous";

  const grid = document.getElementById("product-grid");
  const filters = document.getElementById("category-filters");
  const status = document.getElementById("catalog-status");
  const empty = document.getElementById("catalog-empty");

  function uniqueCategories(list) {
    const seen = [];
    list.forEach(function (product) {
      if (seen.indexOf(product.category) === -1) {
        seen.push(product.category);
      }
    });
    return seen;
  }

  function countInCategory(list, category) {
    if (category === "tous") {
      return list.length;
    }
    return list.filter(function (product) {
      return product.category === category;
    }).length;
  }

  function renderFilters() {
    if (!filters) {
      return;
    }
    const categories = uniqueCategories(products);
    const parts = [
      { key: "tous", label: "Tous les produits", count: countInCategory(products, "tous") },
    ].concat(
      categories.map(function (category) {
        return {
          key: category,
          label: category,
          count: countInCategory(products, category),
        };
      })
    );

    filters.innerHTML = "";
    parts.forEach(function (part) {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "filter-chip";
      button.setAttribute("data-category", part.key);
      button.setAttribute("aria-pressed", part.key === activeCategory ? "true" : "false");
      button.innerHTML =
        '<span class="filter-chip-label"></span>' +
        '<span class="filter-chip-count"></span>';
      button.querySelector(".filter-chip-label").textContent = part.label;
      button.querySelector(".filter-chip-count").textContent = String(part.count);
      button.addEventListener("click", function () {
        activeCategory = part.key;
        renderFilters();
        renderGrid();
      });
      filters.appendChild(button);
    });
  }

  function visibleProducts() {
    if (activeCategory === "tous") {
      return products;
    }
    return products.filter(function (product) {
      return product.category === activeCategory;
    });
  }

  function renderGrid() {
    if (!grid) {
      return;
    }
    const list = visibleProducts();
    grid.innerHTML = "";

    if (status) {
      const total = products.length;
      if (activeCategory === "tous") {
        status.textContent = total + " produit" + (total > 1 ? "s" : "") + " d’exemple";
      } else {
        status.textContent =
          list.length +
          " produit" +
          (list.length > 1 ? "s" : "") +
          " dans « " +
          activeCategory +
          " »";
      }
    }

    if (empty) {
      empty.hidden = list.length > 0;
    }

    list.forEach(function (product) {
      const article = document.createElement("article");
      article.className = "product-card";
      article.setAttribute("data-product-id", product.id);

      const media = document.createElement("div");
      media.className = "product-card-media";
      const img = document.createElement("img");
      img.src = product.image;
      img.alt = product.alt || product.name;
      img.width = 640;
      img.height = 480;
      media.appendChild(img);

      const body = document.createElement("div");
      body.className = "product-card-body";

      const badge = document.createElement("p");
      badge.className = "example-badge";
      badge.textContent = "Produit d’exemple";

      const category = document.createElement("p");
      category.className = "product-category";
      category.textContent = product.category;

      const title = document.createElement("h2");
      title.className = "product-name";
      title.textContent = product.name;

      const description = document.createElement("p");
      description.className = "product-description";
      description.textContent = product.description;

      const footer = document.createElement("div");
      footer.className = "product-card-footer";

      const price = document.createElement("p");
      price.className = "product-price";
      price.textContent = formatPrice(product.price);

      const button = document.createElement("button");
      button.type = "button";
      button.className = "button button-primary";
      button.textContent = "Ajouter au panier";
      button.addEventListener("click", function () {
        addToCart(product.id, 1);
        showAddedFeedback(button);
      });

      footer.appendChild(price);
      footer.appendChild(button);

      body.appendChild(badge);
      body.appendChild(category);
      body.appendChild(title);
      body.appendChild(description);

      if (product.nicotine) {
        const warning = document.createElement("p");
        warning.className = "product-nicotine-warning";
        warning.textContent =
          "Contient de la nicotine. La nicotine contenue dans ce produit crée une très forte dépendance. Son utilisation par les non-fumeurs est déconseillée.";
        body.appendChild(warning);
      }

      body.appendChild(footer);
      article.appendChild(media);
      article.appendChild(body);
      grid.appendChild(article);
    });
  }

  function showAddedFeedback(button) {
    const original = button.textContent;
    button.textContent = "Ajouté";
    button.disabled = true;
    window.setTimeout(function () {
      button.textContent = original;
      button.disabled = false;
    }, 1200);
  }

  async function init() {
    if (!grid) {
      return;
    }
    try {
      products = await loadProducts();
      renderFilters();
      renderGrid();
    } catch (error) {
      if (status) {
        status.textContent =
          "Le catalogue n’a pas pu être chargé. Ouvrez le site via un serveur local (voir le README).";
      }
      console.error(error);
    }
  }

  document.addEventListener("DOMContentLoaded", init);
})();
