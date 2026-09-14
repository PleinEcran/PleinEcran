# Plein Écran — fiche de projet

Site d'actualité et de critique du jeu vidéo, en français. Site statique, aucun
serveur : des fichiers HTML, CSS et JavaScript publiés par GitHub Pages.

Publié sur https://pleinecran.github.io/PleinEcran/
Console éditoriale sur https://pleinecran.github.io/PleinEcran/console/

## Règles éditoriales — elles priment sur tout le reste

1. **Ne jamais écrire un article à partir de l'article d'une autre rédaction.**
   Pas de traduction, pas de reformulation, pas de résumé d'un texte existant.
   On part des faits et des sources primaires : communiqués, conférences
   retransmises, notes de patch, documents publics, déclarations de première
   main. Quand une information vient d'un confrère, on le nomme dans le texte
   et on lie vers lui.
2. **Chaque article porte ses sources**, dans le champ `sources`, avec des liens
   sortants vers les documents utilisés.
3. **Rien d'invérifiable sur le site lui-même.** Pas de faux rédacteurs, pas
   d'historique inventé, pas de revenus imaginaires. Le site est écrit par une
   seule personne sous le pseudonyme « Vieux joueur », il est lancé en 2026, il
   n'a aucun revenu. La charte le dit, elle doit rester exacte.
4. **Images** : uniquement des photographies sous licence libre (Wikimedia
   Commons), des visuels officiels déposés par les éditeurs (Steam, kits
   presse), ou les illustrations vectorielles générées par `gen_art.py`. Jamais
   de capture récupérée ailleurs sur le web. Le crédit s'affiche sous l'image.
5. **Les articles sont relus par la personne qui publie avant mise en ligne.**
   La charte l'annonce publiquement, à la section sur l'intelligence
   artificielle.

## Rubriques et rythme annoncés dans la charte

- **Actu** — au fil des jours, articles courts sourcés.
- **Enquête** — une par mois. Deux formats : « Pièces à conviction » (documents
  publics, méthode publiée en fin d'article) et « Le Long Jeu » (essai).
- **Encore jouable ?** — deux fois par mois. Un jeu ancien, ce qui a vieilli, ce
  qui tient, et un encadré obligatoire « Où y jouer légalement aujourd'hui ».
- **Le Jeton** — le vendredi. Édito court et acide. On vise une décision, une
  communication ou un chiffre, jamais une personne sans pouvoir.

## Structure des fichiers

| Chemin | Rôle |
|---|---|
| `assets/js/data.js` | Tout le contenu rédactionnel : `SITE`, `RUBRIQUES`, `CONCEPTS`, `EQUIPE`, `ARTICLES` |
| `assets/js/app.js` | Rendu des pages, filtres, page article |
| `assets/css/style.css` | Feuille de style unique, variables de couleur en tête |
| `assets/js/illustrations.js` | Généré par les scripts d'images, ne pas modifier à la main |
| `console/` | Console éditoriale (application installable) |
| `console/veille.js` | Généré par `veille.py`, ne pas modifier à la main |
| `console/journal.json` | État de la console (commandes, avis, idées), synchronisé depuis le navigateur si un dépôt et un jeton sont réglés. N'existe pas tant que la synchro n'a pas tourné une fois |
| `console/brouillons.js` | Articles en cours de rédaction, un par commande retenue. Rempli à la main en session de rédaction, purgé par `publier.py` une fois la décision prise |
| `veille.py` | Collecte des flux, regroupement, température |
| `illustrations.py` | Photographies libres depuis Wikimedia Commons |
| `steam.py` | Visuels officiels depuis les fiches Steam |
| `publier.py` | Bascule les décisions de la console (validé/refusé) vers le dépôt ; n'écrit jamais dans `data.js` lui-même |
| `notifier.py` | Courriels de validation et d'alerte |
| `gen_art.py` | Illustrations vectorielles de repli |
| `.github/workflows/` | Automatisation : veille toutes les 2 h, images, publication |

## Conventions

- Tout le code, les commentaires et les noms de variables sont en français.
- Identité visuelle : fond graphite `#0C0E13`, rouge signal `#FF3D2E` pour la
  marque et l'actualité, bleu `#4DA3FF` pour les données et les plateformes.
  Titres en Archivo, courant en Instrument Sans.
- Les couleurs ne sont définies qu'une fois, en haut de `style.css`.

## Pipeline éditorial

Le circuit d'une commande à l'article publié, tel qu'il est câblé aujourd'hui :

1. `veille.py` tourne toutes les 2 h et produit `console/veille.js`.
2. Dans la console, onglet Veille, on commande un sujet (avec ou sans angle) :
   ça n'écrit rien de plus qu'une entrée dans le `localStorage` du navigateur.
3. Si un dépôt et un jeton sont réglés (Réglages de la console), cet état se
   synchronise dans `console/journal.json`.
4. **C'est une session de rédaction qui écrit l'article**, jamais un script :
   depuis les sources primaires, en respectant la charte, un objet au même
   format qu'une entrée de `ARTICLES` est ajouté à `console/brouillons.js`,
   avec un champ `commande` qui le relie à la demande d'origine.
5. L'article apparaît dans l'onglet « À valider » de la console, sources
   visibles, pour décision (Valider / Refuser / Commenter).
6. `python3 publier.py` lit la décision : un brouillon validé est affiché en
   entier, prêt à être collé dans `ARTICLES` (`assets/js/data.js`) — ce script
   ne touche jamais `data.js` lui-même, l'ajouter reste un geste de rédaction.
   Un brouillon refusé est retiré. Dans les deux cas la commande d'origine
   disparaît. Les commandes sans brouillon sont listées en fin de
   compte-rendu : c'est le travail de la session suivante.

## Piège connu des workflows GitHub

Les fichiers générés (`console/veille.js`, `assets/js/illustrations.js`) ne
doivent jamais être fusionnés : un `git pull --rebase` provoque un conflit à
chaque exécution. Le bon schéma, déjà en place dans `veille.yml`, est de mettre
le fichier produit de côté, de se recaler sur `origin/main`, de le remettre,
puis de pousser.

## Travaux en attente

- [ ] Ajouter mentions légales et politique de données, obligatoires pour un
      site de presse en France.
- [ ] Écrire les commandes en attente listées par `publier.py` (voir Pipeline
      éditorial ci-dessus).
