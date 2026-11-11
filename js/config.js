/**
 * Configuration unique du site Nuage vapeur.
 * Modifiez notamment orderEmail avant toute mise en ligne.
 */
const NUAGE_CONFIG = {
  /** Adresse de réception des demandes de commande. */
  orderEmail: "arakazatresor257@gmail.com",
  ageStorageKey: "nuage_vapeur_age_ok",
  cartStorageKey: "nuage_vapeur_panier",
  productsUrl: "products.json",
  /**
   * Frais de livraison, en euros TTC, par commande.
   * Les libellés doivent rester identiques à ceux du formulaire.
   */
  delivery: {
    voiture: {
      fee: 20,
      label: "Livraison en voiture (Bayonne et alentours, 8 h – 23 h)",
    },
    colis: {
      fee: 35,
      label: "Envoi par colis postal",
    },
  },
};
