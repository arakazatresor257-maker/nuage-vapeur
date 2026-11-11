/**
 * Page Commande : récapitulatif du panier, frais de livraison et formulaire
 * envoyé par courriel (mailto). Aucun paiement en ligne n’est proposé.
 */
(function () {
  const summary = document.getElementById("order-summary");
  const empty = document.getElementById("order-empty");
  const form = document.getElementById("order-form");
  const feedback = document.getElementById("order-feedback");
  const mailtoPreview = document.getElementById("order-mailto-address");
  const fulfillmentField = document.getElementById("order-fulfillment");

  if (!form && !summary) {
    return;
  }

  let products = [];

  function getDeliveryOption() {
    const key = fieldValue("order-fulfillment");
    const options = NUAGE_CONFIG.delivery || {};
    return options[key] || null;
  }

  function renderSummary() {
    const details = getCartDetails(products);
    const hasItems = details.lines.length > 0;

    if (empty) {
      empty.hidden = hasItems;
    }
    if (form) {
      form.hidden = !hasItems;
    }
    if (!summary) {
      return;
    }

    summary.innerHTML = "";
    if (!hasItems) {
      return;
    }

    const list = document.createElement("ul");
    list.className = "order-lines";
    details.lines.forEach(function (line) {
      const item = document.createElement("li");
      const name = document.createElement("span");
      name.className = "order-line-name";
      name.textContent = line.product.name + " (produit d’exemple) × " + line.quantity;
      const price = document.createElement("span");
      price.className = "order-line-price";
      price.textContent = formatPrice(line.lineTotal);
      item.appendChild(name);
      item.appendChild(price);
      list.appendChild(item);
    });

    const subtotal = document.createElement("li");
    subtotal.className = "order-subtotal";
    const subLabel = document.createElement("span");
    subLabel.textContent = "Sous-total des articles";
    const subValue = document.createElement("span");
    subValue.textContent = formatPrice(details.total);
    subtotal.appendChild(subLabel);
    subtotal.appendChild(subValue);
    list.appendChild(subtotal);

    const delivery = getDeliveryOption();
    const deliveryLine = document.createElement("li");
    deliveryLine.className = "order-delivery";
    const delLabel = document.createElement("span");
    const delValue = document.createElement("span");
    delValue.id = "order-delivery-fee";
    if (delivery) {
      delLabel.textContent = delivery.label;
      delValue.textContent = formatPrice(delivery.fee);
    } else {
      delLabel.textContent = "Livraison";
      delValue.textContent = "à choisir";
    }
    deliveryLine.appendChild(delLabel);
    deliveryLine.appendChild(delValue);
    list.appendChild(deliveryLine);

    const total = document.createElement("p");
    total.className = "order-total";
    const totalLabel = document.createElement("span");
    totalLabel.textContent = "Total TTC";
    const totalValue = document.createElement("strong");
    totalValue.id = "order-total";
    const deliveryFee = delivery ? delivery.fee : 0;
    totalValue.textContent = formatPrice(details.total + deliveryFee);
    total.appendChild(totalLabel);
    total.appendChild(totalValue);

    summary.appendChild(list);
    summary.appendChild(total);
  }

  function fieldValue(id) {
    const field = document.getElementById(id);
    return field ? field.value.trim() : "";
  }

  function setFieldError(id, message) {
    const field = document.getElementById(id);
    const holder = document.getElementById(id + "-error");
    if (field) {
      if (message) {
        field.setAttribute("aria-invalid", "true");
      } else {
        field.removeAttribute("aria-invalid");
      }
    }
    if (holder) {
      holder.textContent = message || "";
    }
  }

  function validate() {
    let valid = true;
    const name = fieldValue("order-name");
    const email = fieldValue("order-email");
    const phone = fieldValue("order-phone");
    const fulfillment = fieldValue("order-fulfillment");

    setFieldError("order-name", name ? "" : "Indiquez votre nom.");
    if (!name) {
      valid = false;
    }

    const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    setFieldError("order-email", emailOk ? "" : "Indiquez une adresse e-mail valide.");
    if (!emailOk) {
      valid = false;
    }

    const phoneOk = phone.replace(/\s/g, "").length >= 8;
    setFieldError("order-phone", phoneOk ? "" : "Indiquez un numéro de téléphone.");
    if (!phoneOk) {
      valid = false;
    }

    setFieldError("order-fulfillment", fulfillment ? "" : "Choisissez un mode de livraison.");
    if (!fulfillment || !getDeliveryOption()) {
      setFieldError("order-fulfillment", "Choisissez un mode de livraison.");
      valid = false;
    }

    return valid;
  }

  function buildMessage() {
    const details = getCartDetails(products);
    const delivery = getDeliveryOption();
    const deliveryFee = delivery ? delivery.fee : 0;
    const lines = details.lines.map(function (line) {
      return (
        "- " +
        line.product.name +
        " (produit d’exemple) × " +
        line.quantity +
        " — " +
        formatPrice(line.lineTotal)
      );
    });

    return [
      "Nouvelle demande de commande — Nuage vapeur",
      "",
      "Nom : " + fieldValue("order-name"),
      "E-mail : " + fieldValue("order-email"),
      "Téléphone : " + fieldValue("order-phone"),
      "Mode de livraison : " + (delivery ? delivery.label : ""),
      "Frais de livraison : " + formatPrice(deliveryFee),
      "Message : " + (fieldValue("order-message") || "(aucun)"),
      "",
      "Articles :",
      lines.join("\n"),
      "",
      "Sous-total des articles : " + formatPrice(details.total),
      "Livraison : " + formatPrice(deliveryFee),
      "Total TTC : " + formatPrice(details.total + deliveryFee),
      "",
      "Paiement : à convenir avec le vendeur. Aucun paiement en ligne.",
    ].join("\n");
  }

  function onSubmit(event) {
    event.preventDefault();
    if (!validate()) {
      const firstInvalid = form.querySelector("[aria-invalid='true']");
      if (firstInvalid) {
        firstInvalid.focus();
      }
      return;
    }

    const subject = "Commande Nuage vapeur — " + fieldValue("order-name");
    const body = buildMessage();
    const href =
      "mailto:" +
      NUAGE_CONFIG.orderEmail +
      "?subject=" +
      encodeURIComponent(subject) +
      "&body=" +
      encodeURIComponent(body);

    if (feedback) {
      feedback.hidden = false;
      feedback.innerHTML =
        "<p>Votre logiciel de messagerie devrait s’ouvrir avec le récapitulatif de la commande. Si ce n’est pas le cas, envoyez le texte ci-dessous à <strong></strong>.</p>" +
        "<pre class=\"order-preview\"></pre>";
      feedback.querySelector("strong").textContent = NUAGE_CONFIG.orderEmail;
      feedback.querySelector("pre").textContent = body;
    }

    window.location.href = href;
  }

  async function init() {
    if (mailtoPreview) {
      mailtoPreview.textContent = NUAGE_CONFIG.orderEmail;
    }
    try {
      products = await loadProducts();
      renderSummary();
    } catch (error) {
      if (empty) {
        empty.hidden = false;
        empty.querySelector("p").textContent =
          "Le catalogue n’a pas pu être chargé. Ouvrez le site via un serveur local (voir le README).";
      }
      if (form) {
        form.hidden = true;
      }
      console.error(error);
      return;
    }
    if (form) {
      form.addEventListener("submit", onSubmit);
    }
    if (fulfillmentField) {
      fulfillmentField.addEventListener("change", renderSummary);
    }
  }

  document.addEventListener("DOMContentLoaded", init);
})();
