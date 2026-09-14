# Plein Écran — mode d'emploi

Site statique. Ouvrez `index.html` dans un navigateur, ou déposez le dossier sur n'importe quel hébergement (Netlify, GitHub Pages, un FTP).

## Règle éditoriale qui gouverne tout le reste

**On ne traduit pas, on ne reformule pas, on ne résume pas les articles des autres.** Une traduction est une adaptation, elle appartient à l'auteur de l'original. Le site est construit sur deux mécanismes qui, eux, sont solides :

1. **Articles écrits à partir des faits et des sources primaires.** Un communiqué, une conférence retransmise, un document public, un dépôt légal. Le fait n'est pas protégé ; la manière dont un autre l'a raconté, si. Chaque article porte son bloc `sources`, affiché en bas de page avec les liens.
2. **Revue de presse en liens sortants.** Titre, source, date, lien. Aucun texte repris, aucune image chargée depuis le site source. Le lecteur clique et lit chez l'éditeur.

## Contenu actuel

Quatre articles réels, publiés à partir de sources vérifiables (Direct Nintendo du 8 septembre, rapport Bloomberg sur Horizon Hunters Gathering, retraite de Warren Spector, calendrier de sorties de septembre).

**À faire avant toute mise en ligne :** les six fiches de la page rédaction sont des **modèles** et le site l'affiche explicitement. Des articles réels signés par des journalistes inventés seraient trompeurs. Tant que l'équipe n'existe pas, les articles sont signés « La rédaction ». Remplacez ces fiches par de vraies personnes, ou supprimez-les de `EQUIPE` dans `data.js`.

## Fichiers

| Fichier | Rôle |
|---|---|
| `index.html` | Accueil |
| `tests.html` | Tous les articles, recherche et filtres |
| `article.html` | Gabarit d'article, appelé par `article.html?a=slug` |
| `revue.html` | Revue de presse (liens sortants) |
| `redaction.html` | Fiches rédacteurs |
| `charte.html` | Charte éditoriale |
| `assets/js/data.js` | **Tout le contenu rédactionnel** |
| `assets/js/revue.js` | Généré automatiquement, ne pas modifier à la main |
| `build_revue.py` | Collecte des flux RSS |
| `fetch_presskit.py` | Téléchargement des visuels de kits presse |
| `gen_art.py` | Génère les illustrations SVG originales |

## Publier un article

Ajoutez un objet au tableau `ARTICLES` de `assets/js/data.js` :

```js
{
  slug: "mon-sujet",            // article.html?a=mon-sujet
  rubrique: "actu",             // test | actu | dossier | retro | pratique
  titre: "…",
  sousTitre: "…",
  chapo: "…",
  auteur: "redaction",
  date: "2026-09-09",
  lecture: 5,
  cover: "assets/img/covers/mon-sujet.jpg",
  creditImage: "Image : nom de l'éditeur",
  plateformes: ["PS5"],
  note: null,                   // une note seulement pour un test terminé
  aLaUne: false,
  corps: ["paragraphe", "paragraphe"],
  sources: [ { nom: "Éditeur — communiqué", url: "https://…" } ]
}
```

Pour un test, ajoutez `pour`, `contre` et `transparence` (temps de jeu, plateformes, provenance de la copie, version, accessibilité) : le verdict et le bloc de méthode s'affichent alors automatiquement. Un jeu en accès anticipé se déclare `note: null` et `provisoire: true`.

## Revue de presse quotidienne

```bash
python3 build_revue.py     # écrit assets/js/revue.js
```

Les flux sont listés en haut du script, à adapter. Chaque source échouée est ignorée sans casser la collecte.

Automatisation, au choix :
- **cron** sur un serveur : `30 7 * * * cd /chemin/du/site && /usr/bin/python3 build_revue.py`
- **GitHub Actions** : le workflow est déjà fourni dans `.github/workflows/revue.yml`, il tourne chaque matin et publie le fichier mis à jour.

Le script ne récupère que titre, date et lien. N'ajoutez pas d'extraits de texte : au-delà de très courts fragments, la reprise relève du droit voisin des éditeurs de presse et demande une licence.

## Images

Trois sources, dans cet ordre, et jamais rien d'autre.

### 1. Photographies libres — automatique

Trois façons de lancer la récupération, au choix. Aucune n'exige d'installer quoi que ce soit à part Python.

- **Double-clic** sur `illustrations.command` (Mac) ou `illustrations.bat` (Windows). Sur Mac, si le système refuse de l'ouvrir la première fois : clic droit, « Ouvrir », puis confirmer.
- **Depuis GitHub**, sans rien installer : onglet Actions, workflow `illustrations`, bouton « Run workflow ». Le script tourne sur les serveurs de GitHub et publie les images directement sur le site.
- **En ligne de commande** : `python3 illustrations.py`, ou `python3 illustrations.py warren-spector` pour un seul article.

Le script n'a aucune dépendance à installer : il n'utilise que la bibliothèque standard de Python, et le recadrage en 16/9 est fait par la feuille de style. Il interroge l'API de Wikimedia Commons, **lit la licence de chaque fichier** et rejette tout ce qui n'est pas librement réutilisable, y compris les licences non commerciales. Il télécharge une version de 1200 px de large et écrit l'attribution complète (auteur, licence, lien vers le fichier d'origine) dans `assets/js/illustrations.js`. Le site l'affiche sous l'image, avec le lien.

Deux niveaux de pertinence, dans cet ordre :

1. **`FICHIERS`**, en haut du script : le nom exact d'un fichier Commons, choisi par vous. C'est le seul moyen d'être certain du résultat. Pour trouver ce nom, lancez `python3 illustrations.py --choix warren-spector` : le script affiche les candidats libres avec leur licence, leur auteur et leur lien, vous copiez celui qui vous plaît.
2. **`SUJETS`** : une liste de recherches par article, de la plus précise à la plus générique. Le script s'arrête à la première qui donne un résultat libre et exploitable en paysage.

### Ce que ce script ne peut pas faire

Les captures officielles d'un jeu, les jaquettes et les images promotionnelles ne sont jamais sous licence libre. Elles n'existent pas sur Commons, et aucun outil ne les y trouvera. Le seul chemin légal pour ces visuels est le kit presse de l'éditeur, ci-dessous.

On illustre ainsi par des **photographies** : matériel, personnes, lieux, objets. Une capture de jeu ou une jaquette n'est jamais sous licence libre, le script ne va pas les chercher.

### 2. Visuels officiels — kits presse


```bash
python3 fetch_presskit.py     # crée presskit.json au premier lancement
```

Remplissez `presskit.json` avec les URL, puis relancez. Le script télécharge, recadre en 16/9 à 1200 px, enregistre le crédit dans `assets/img/credits.json` et **refuse toute image sans crédit renseigné**.

Où trouver ces URL :

- **Espaces presse éditeurs** (PlayStation, Xbox, Nintendo, Ubisoft, Capcom…) : accréditation généralement gratuite, à demander avec l'adresse du site. Les conditions autorisent l'usage éditorial.
- **presskit()** : le format standard des studios indépendants, dossier public avec visuels haute définition et licence explicite.
- **Pages boutique officielles** (Steam, itch.io) : captures et jaquettes destinées à la reprise.
- **Vos propres captures** en jouant : pratique standard de la critique.

### 3. Illustrations générées — solution de repli

Tant qu'aucune photo ni visuel officiel n'est disponible pour un article, le site affiche l'illustration vectorielle produite par `gen_art.py`. Le basculement est automatique : dès qu'une photo existe pour un slug, elle prend la place.

Dans tous les cas : créditer, ne pas recadrer un logo, ne rien revendre. Les conditions particulières de chaque éditeur priment sur l'usage courant du secteur. Je ne suis pas juriste : si le site prend de l'ampleur, faites vérifier.

Les illustrations livrées avec le site sont des SVG originaux produits par `gen_art.py`. Elles servent de solution de repli quand aucun visuel officiel n'est disponible.

## Identité visuelle

Registre de site d'actualité jeu vidéo : fond graphite bleuté `#0C0E13`, deux encres à rôle défini — rouge signal `#FF3D2E` pour la marque et l'actualité, bleu `#4DA3FF` pour les données et les plateformes. Vert, ambre et rouge servent aux notes. Titres en Archivo (axe de chasse, condensé extra-gras), courant en Instrument Sans.

L'élément distinctif est la colonne chronologique de la page d'accueil : chaque publication est horodatée sur une ligne verticale. C'est la forme qui rend lisible un site publiant plusieurs fois par jour. Les couleurs sont définies une seule fois, en haut de `style.css`.

## La console éditoriale

`console/index.html` est votre poste de travail. Elle s'ouvre par double-clic sur le PC, et s'installe sur le téléphone depuis le navigateur (menu « Ajouter à l'écran d'accueil »). Elle fonctionne hors ligne.

Cinq onglets :

- **Veille** — ce que la collecte a ramené, classé par température. Chaque sujet peut être commandé d'un bouton, avec ou sans votre angle. Ce que vous écrivez là, je le reprends tel quel.
- **Commandes** — les sujets que vous m'avez demandés, avec votre point de vue. Modifiable à tout moment.
- **À valider** — les articles écrits, avec titre et chapô. Valider, refuser, ou commenter ce qu'il faut changer.
- **Images** — chaque illustration trouvée, avec son crédit et le lien vers sa licence. Garder ou écarter.
- **Idées** — la boîte à idées, séparée en trois stocks : édito, Encore jouable ?, articles. J'y pioche quand il faut produire.

Les données restent sur l'appareil. Pour les retrouver sur le téléphone comme sur le PC, renseignez dans les réglages votre dépôt et un jeton GitHub **à portée restreinte** : un seul dépôt, permission Contents en lecture et écriture, rien d'autre. Le jeton ne quitte pas l'appareil, il n'est envoyé qu'à GitHub. Vous le saisissez vous-même, sur chaque appareil.

## Veille permanente

`veille.py` tourne toutes les deux heures via `.github/workflows/veille.yml`. Il lit huit flux, regroupe les titres qui parlent du même sujet et calcule une température : nombre de rédactions qui reprennent l'information, fraîcheur, et poids des mots-clés définis en haut du script.

Ce signal est mesurable, contrairement au nombre de vues d'un article chez un confrère, auquel personne n'a accès de l'extérieur. Une information reprise par cinq rédactions en deux heures est chaude, et c'est vérifiable.

Quand un sujet franchit le seuil, vous recevez un courriel. La console affiche aussi une notification si vous l'avez autorisée, tant qu'elle est ouverte ou installée.

## Validation par courriel avant publication

La chaîne `.github/workflows/publication.yml` se déclenche dès qu'un article est ajouté à `data.js` : elle cherche les illustrations, puis vous envoie un courriel récapitulatif, puis **attend votre accord**. Rien n'est mis en ligne avant.

Trois réglages à faire une seule fois, et vous seul pouvez les faire :

1. **Mot de passe d'application Gmail.** Dans votre compte Google, activez la validation en deux étapes, puis créez un mot de passe d'application. C'est une suite de seize caractères qui ne donne accès qu'à l'envoi de courriel, révocable à tout moment. N'utilisez jamais le mot de passe de votre compte.
2. **Secrets du dépôt.** Settings > Secrets and variables > Actions > New repository secret. Créez `MAIL_EXPEDITEUR` (votre adresse), `MAIL_MOTDEPASSE` (le mot de passe d'application) et `MAIL_DESTINATAIRE` (l'adresse qui reçoit la validation). GitHub les chiffre, ils n'apparaissent jamais dans les journaux.
3. **Environnement de validation.** Settings > Environments > New environment, nommé exactement `validation`. Cochez « Required reviewers » et ajoutez-vous. C'est ce réglage qui suspend la publication et vous notifie.

Ensuite, le cycle est automatique : article ajouté, illustrations cherchées, courriel reçu, vous approuvez ou refusez d'un clic. Un refus laisse le site inchangé.

## Avant la mise en ligne

- Remplacer les fiches rédacteurs modèles.
- Brancher le formulaire d'infolettre (il ne fait que valider le format).
- Ajouter mentions légales et politique de données, obligatoires pour un site de presse en France.
- Les commentaires sont décrits dans la charte mais non implémentés : ils demandent un serveur.
