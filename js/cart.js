/**
 * Panier persistant (localStorage) : ajout, suppression, quantités et total.
 */

function getCart() {
  try {
    const raw = localStorage.getItem(NUAGE_CONFIG.cartStorageKey);
    if (!raw) {
      return [];
    }
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) {
      return [];
    }
    return parsed
      .filter(function (line) {
        return line && typeof line.id === "string" && Number(line.quantity) > 0;
      })
      .map(function (line) {
        return { id: line.id, quantity: Math.floor(Number(line.quantity)) };
      });
  } catch (error) {
    return [];
  }
}

function saveCart(items) {
  const cleaned = items.filter(function (line) {
    return line.quantity > 0;
  });
  try {
    localStorage.setItem(NUAGE_CONFIG.cartStorageKey, JSON.stringify(cleaned));
  } catch (error) {
    console.error("Impossible d’enregistrer le panier.", error);
  }
  window.dispatchEvent(new CustomEvent("nuage:panier-change"));
}

function getCartCount() {
  return getCart().reduce(function (sum, line) {
    return sum + line.quantity;
  }, 0);
}

function addToCart(productId, quantity) {
  const qty = Math.max(1, Math.floor(Number(quantity) || 1));
  const items = getCart();
  const existing = items.find(function (line) {
    return line.id === productId;
  });
  if (existing) {
    existing.quantity += qty;
  } else {
    items.push({ id: productId, quantity: qty });
  }
  saveCart(items);
}

function setCartQuantity(productId, quantity) {
  const qty = Math.floor(Number(quantity) || 0);
  const items = getCart()
    .map(function (line) {
      if (line.id === productId) {
        return { id: line.id, quantity: qty };
      }
      return line;
    })
    .filter(function (line) {
      return line.quantity > 0;
    });
  saveCart(items);
}

function removeFromCart(productId) {
  saveCart(
    getCart().filter(function (line) {
      return line.id !== productId;
    })
  );
}

function clearCart() {
  saveCart([]);
}

/**
 * Enrichit le panier avec les fiches produits et calcule le total.
 * Les identifiants inconnus sont ignorés.
 */
function getCartDetails(products) {
  const lines = [];
  let total = 0;
  getCart().forEach(function (line) {
    const product = getProductById(products, line.id);
    if (!product) {
      return;
    }
    const lineTotal = product.price * line.quantity;
    total += lineTotal;
    lines.push({
      product: product,
      quantity: line.quantity,
      lineTotal: lineTotal,
    });
  });
  return { lines: lines, total: total };
}
