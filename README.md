# Nuage vapeur

Site statique de démonstration pour une boutique de produits de vapotage **autorisés** (kits rechargeables, e-liquides, accessoires). Les cigarettes électroniques jetables non rechargeables (« puffs ») ne sont pas proposées.

Le catalogue actuel est composé de **produits d’exemple**. Il ne s’agit pas d’une offre commerciale réelle.

Ce dossier ne nécessite aucune étape de compilation : il suffit de fichiers HTML, CSS et JavaScript.

## Prévisualiser en local

Depuis ce dossier, lancez un petit serveur HTTP (obligatoire pour charger `products.json`) :

```bash
python3 -m http.server 8080
```

Puis ouvrez `http://127.0.0.1:8080/` dans le navigateur. Le contrôle d’âge s’affiche à la première visite.

## Modifier le catalogue

Éditez le fichier `products.json`. Chaque produit a la forme suivante :

```json
{
  "id": "identifiant-unique",
  "name": "Nom du produit",
  "category": "Kits rechargeables",
  "price": 29.9,
  "description": "Description en français.",
  "image": "assets/products/mon-image.svg",
  "nicotine": false
}
```

- Les catégories servent aux filtres de la boutique. Les effectifs sont calculés automatiquement.
- Mettez `nicotine` à `true` pour les e-liquides nicotinés : l’avertissement sanitaire s’affiche alors sur la fiche.
- Conservez le libellé « Produit d’exemple » tant que les articles ne sont pas les vôtres. Ce libellé est ajouté par le site, pas par le fichier JSON.
- Placez les images dans `assets/products/` (WebP, JPEG, PNG ou SVG) et indiquez le chemin relatif.
- Vous pouvez aussi ajouter un champ `alt` (texte alternatif en français) pour chaque produit.
- Les crédits des photos actuelles figurent dans `CREDITS.md`.

## Modifier l’adresse de commande

Dans `js/config.js`, remplacez la constante `orderEmail` :

```javascript
orderEmail: "commandes@example.com",
```

Les demandes de commande s’ouvrent dans le logiciel de messagerie du visiteur (`mailto:`). Il n’y a pas de paiement en ligne ni de serveur de commande.

Les frais de livraison sont également définis dans `js/config.js` : 20 € TTC par commande pour la livraison en voiture (Bayonne et alentours, 8 h – 23 h) et 35 € TTC par commande pour l’envoi par colis postal. Ces montants s’ajoutent au sous-total des articles sur la page de commande, une fois le mode choisi. Le panier affiche seulement le sous-total des articles, avec une mention de ces tarifs.

## Contrôle d’âge et panier

Le site enregistre deux informations dans le navigateur (`localStorage`) :

- la déclaration « 18 ans ou plus » ;
- le contenu du panier.

Aucune donnée n’est envoyée à un serveur, hors le courriel que le visiteur choisit d’expédier.

## Mentions légales et CGV

Les mentions légales se trouvent dans `mentions-legales.html` et les conditions générales de vente dans `cgv.html`.

Les passages encore entre crochets restent à compléter avant une mise en ligne publique, notamment le médiateur de la consommation, dans les CGV.

## Publier sur GitHub Pages

Rien n’est publié depuis ce dépôt d’exemple. Lorsque vous serez prêt, vous pourrez notamment :

1. Créer un dépôt GitHub et y envoyer le contenu de ce dossier (à la racine du dépôt, ou dans un sous-dossier selon votre réglage).
2. Dans le dépôt, ouvrir **Settings → Pages**.
3. Choisir la branche à publier (souvent `main`) et le dossier `/ (root)`, puis enregistrer.
4. Attendre l’adresse du type `https://votre-compte.github.io/nom-du-depot/`.

Les chemins du site sont relatifs, afin de fonctionner aussi bien à la racine d’un domaine que dans un sous-dossier.
