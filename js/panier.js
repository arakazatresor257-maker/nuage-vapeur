/**
 * Page Panier : liste des lignes, modification des quantités, suppression, total.
 */
(function () {
  const root = document.getElementById("cart-root");
  const empty = document.getElementById("cart-empty");
  const tableBody = document.getElementById("cart-lines");
  const totalEl = document.getElementById("cart-total");
  const checkoutLink = document.getElementById("cart-checkout");

  if (!root) {
    return;
  }

  let products = [];

  function render() {
    const details = getCartDetails(products);
    const hasItems = details.lines.length > 0;

    if (empty) {
      empty.hidden = hasItems;
    }
    root.classList.toggle("is-empty", !hasItems);

    if (!tableBody || !totalEl) {
      return;
    }

    tableBody.innerHTML = "";
    details.lines.forEach(function (line) {
      const tr = document.createElement("tr");

      const cellProduct = document.createElement("td");
      cellProduct.className = "cart-product";
      cellProduct.innerHTML =
        '<div class="cart-product-media"><img alt=""></div>' +
        '<div class="cart-product-info">' +
        '<p class="example-badge">Produit d’exemple</p>' +
        "<p class=\"cart-product-name\"></p>" +
        "<p class=\"cart-product-category\"></p>" +
        "</div>";
      const img = cellProduct.querySelector("img");
      img.src = line.product.image;
      img.alt = line.product.alt || line.product.name;
      cellProduct.querySelector(".cart-product-name").textContent = line.product.name;
      cellProduct.querySelector(".cart-product-category").textContent = line.product.category;

      const cellPrice = document.createElement("td");
      cellPrice.setAttribute("data-label", "Prix unitaire");
      cellPrice.textContent = formatPrice(line.product.price);

      const cellQty = document.createElement("td");
      cellQty.setAttribute("data-label", "Quantité");
      cellQty.className = "cart-qty";

      const minus = document.createElement("button");
      minus.type = "button";
      minus.className = "qty-button";
      minus.setAttribute("aria-label", "Diminuer la quantité de " + line.product.name);
      minus.textContent = "−";
      minus.addEventListener("click", function () {
        setCartQuantity(line.product.id, line.quantity - 1);
        render();
      });

      const input = document.createElement("input");
      input.type = "number";
      input.min = "1";
      input.max = "99";
      input.step = "1";
      input.value = String(line.quantity);
      input.className = "qty-input";
      input.setAttribute("aria-label", "Quantité pour " + line.product.name);
      input.addEventListener("change", function () {
        const value = Math.max(0, Math.min(99, Math.floor(Number(input.value) || 0)));
        setCartQuantity(line.product.id, value);
        render();
      });

      const plus = document.createElement("button");
      plus.type = "button";
      plus.className = "qty-button";
      plus.setAttribute("aria-label", "Augmenter la quantité de " + line.product.name);
      plus.textContent = "+";
      plus.addEventListener("click", function () {
        setCartQuantity(line.product.id, Math.min(99, line.quantity + 1));
        render();
      });

      cellQty.appendChild(minus);
      cellQty.appendChild(input);
      cellQty.appendChild(plus);

      const cellTotal = document.createElement("td");
      cellTotal.setAttribute("data-label", "Sous-total");
      cellTotal.className = "cart-line-total";
      cellTotal.textContent = formatPrice(line.lineTotal);

      const cellRemove = document.createElement("td");
      cellRemove.className = "cart-remove";
      const remove = document.createElement("button");
      remove.type = "button";
      remove.className = "link-button";
      remove.textContent = "Retirer";
      remove.setAttribute("aria-label", "Retirer " + line.product.name + " du panier");
      remove.addEventListener("click", function () {
        removeFromCart(line.product.id);
        render();
      });
      cellRemove.appendChild(remove);

      tr.appendChild(cellProduct);
      tr.appendChild(cellPrice);
      tr.appendChild(cellQty);
      tr.appendChild(cellTotal);
      tr.appendChild(cellRemove);
      tableBody.appendChild(tr);
    });

    totalEl.textContent = formatPrice(details.total);
    if (checkoutLink) {
      if (hasItems) {
        checkoutLink.removeAttribute("aria-disabled");
        checkoutLink.classList.remove("is-disabled");
      } else {
        checkoutLink.setAttribute("aria-disabled", "true");
        checkoutLink.classList.add("is-disabled");
      }
    }
  }

  async function init() {
    try {
      products = await loadProducts();
      render();
    } catch (error) {
      if (empty) {
        empty.hidden = false;
        empty.querySelector("p").textContent =
          "Le catalogue n’a pas pu être chargé. Ouvrez le site via un serveur local (voir le README).";
      }
      console.error(error);
    }
  }

  document.addEventListener("DOMContentLoaded", init);
})();
