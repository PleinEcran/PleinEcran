# Feuille de route — Plein Écran

Document de travail. Il décrit le rythme à tenir, les sources à surveiller, les consignes prêtes à coller pour chaque rubrique, et ce qui peut tourner sans vous.

---

## 1. Le rythme hebdomadaire

Calibré sur ce qu'une personne seule peut réellement produire et vérifier. Mieux vaut tenir ce rythme que d'en annoncer un plus ambitieux et le rater : la charte publie ces fréquences, elles vous engagent.

| Jour | Production | Temps |
|---|---|---|
| Lundi | Veille + 1 actu | 1 h 30 |
| Mardi | 1 actu | 1 h |
| Mercredi | Avancement enquête ou rétro | 1 h 30 |
| Jeudi | 1 actu | 1 h |
| Vendredi | **Le Jeton** (édito) + publication | 1 h |
| Week-end | Rien, ou finition d'un long format | — |

**Volume mensuel visé :** 12 actus, 4 Jetons, 2 « Encore jouable ? », 1 enquête. Environ 8 heures par semaine.

Les longs formats se construisent sur plusieurs semaines, pas en une session. Une enquête démarre par une question, pas par un sujet : « combien coûte X » et non « parlons de X ».

---

## 2. Ce qui s'automatise, ce qui ne s'automatise pas

**Automatisable dès maintenant**
- La revue de presse (`build_revue.py`, déjà en place, tourne chaque matin par GitHub Actions).
- La publication : un `git push` met le site en ligne, sans intervention.
- La collecte des visuels de kits presse (`fetch_presskit.py`), une fois les URL renseignées.

**Semi-automatisable — vous ouvrez une session, je produis**
- La veille quotidienne : je cherche, je recoupe, je vous rends 3 à 5 sujets classés par intérêt avec leurs sources.
- La rédaction : je rédige à partir des sources primaires que la veille a identifiées.
- La mise en forme : je vous rends l'objet JavaScript prêt à coller dans `data.js`.

**Non automatisable, et c'est volontaire**
- La relecture avant publication. La charte dit que vous vérifiez chaque fait avant mise en ligne. Si vous sautez cette étape, la charte devient un mensonge de plus.
- Le choix éditorial : ce qui mérite un article, ce qui n'en mérite pas.
- Le ton du Jeton. Un édito acide fonctionne parce qu'il vient de quelqu'un. Je peux écrire une base, vous devez y mettre votre voix.

---

## 3. Les sources à surveiller

### Sources primaires — toujours en premier
- Espaces presse et newsrooms éditeurs : Nintendo, PlayStation Blog, Xbox Wire, Ubisoft News, Capcom, Square Enix, SEGA.
- Pages Steam et itch.io : notes de mise à jour, annonces de développeurs, changements de conditions.
- Documents financiers : résultats trimestriels des éditeurs cotés, très riches et presque jamais lus.
- Registres publics : dépôts de marque, greffes du tribunal de commerce pour les studios français, appels à projets du CNC.
- Retransmissions officielles : Directs, State of Play, conférences. On regarde, on ne reprend pas le résumé d'un autre.

### Presse spécialisée — pour repérer, jamais pour recopier
Game Developer, GamesIndustry.biz, Eurogamer, Rock Paper Shotgun, Video Games Chronicle, Aftermath, Kotaku. Côté français : Canard PC, Gameblog, ActuGaming, JeuxVideo.com.

Règle : quand l'information vient de l'un d'eux, on le nomme dans le texte et on lie vers lui. Un scoop de Jason Schreier reste un scoop de Jason Schreier.

### Réseaux sociaux — utiles, dangereux
- Bluesky et Mastodon : la plupart des journalistes spécialisés y sont, ainsi que beaucoup de développeurs.
- LinkedIn : sous-estimé. Les annonces de départs, de fermetures et de recrutements y passent avant la presse — l'annonce de Warren Spector en est un exemple.
- Comptes officiels des studios, Discord publics, subreddits des jeux service pour les changements de boutique.

**Trois règles non négociables :**
1. Remonter au compte d'origine. Une capture d'écran n'est pas une source.
2. Vérifier si un document existe derrière : communiqué, note de patch, dépôt. Si oui, c'est lui qu'on cite.
3. Une rumeur est présentée comme telle, avec le nom de qui la rapporte. Jamais de titre affirmatif sur une information non confirmée.

---

## 4. Consignes prêtes à coller

À me donner en début de session. Elles sont écrites pour que le résultat soit directement intégrable.

### Veille du matin

> Fais la veille jeu vidéo des dernières 24 à 48 heures. Cherche en priorité les sources primaires : annonces officielles, notes de patch, documents financiers, publications de développeurs. Rends-moi 5 sujets classés par intérêt, avec pour chacun : le fait en une phrase, qui l'a sorti en premier, les liens, et ce qui reste à vérifier. Ne rédige pas encore.

### Article d'actu

> Écris un article d'actu pour Plein Écran sur [sujet], à partir des sources ci-dessous. 4 à 7 paragraphes, français, pas de bullet points. Pars des faits, jamais du texte d'un autre article. Nomme la rédaction qui a sorti l'info si elle vient d'un confrère. Dis explicitement ce qui n'est pas confirmé. Termine par l'objet JavaScript prêt à coller dans data.js, avec le bloc sources renseigné.

### Enquête — Pièces à conviction

> Prépare une enquête « Pièces à conviction » sur cette question : [question précise, chiffrée si possible]. Commence par lister les documents publics qui pourraient y répondre et où les trouver. Ensuite seulement, propose un plan. L'article devra publier sa méthode en fin de texte et lier chaque document.

### Enquête — Le Long Jeu

> Écris un essai « Le Long Jeu » sur [tendance]. Pas de scoop, une démonstration : une thèse, trois ou quatre étapes appuyées sur des faits datés, une objection sérieuse traitée honnêtement, une conclusion qui ne surpromet pas. 8 000 à 12 000 signes.

### Encore jouable ?

> Écris un « Encore jouable ? » sur [jeu, année]. Structure : ce que le jeu a apporté à l'époque et ce qui en descend aujourd'hui, ce qui a vieilli sans indulgence, ce qui tient encore. Puis l'encadré obligatoire « Où y jouer légalement en 2026 » : chaque moyen d'accès actuel avec sa limite (abonnement, boutique fermée, cartouche d'occasion). Vérifie chaque disponibilité, ne te fie pas à ta mémoire.

### Le Jeton

> Écris Le Jeton de la semaine sur [sujet]. 2 500 à 3 500 signes, acide, drôle si ça vient naturellement, jamais méchant gratuitement. Cible une décision, une communication ou un chiffre — jamais une personne sans pouvoir. Termine par une chute sèche. Tout doit rester factuellement exact : l'ironie ne dispense pas de la vérification.

---

## 5. La chaîne de production

1. **Veille** — session avec moi, ou lecture de votre revue de presse du matin.
2. **Rédaction** — je produis l'objet JavaScript complet.
3. **Relecture** — vous vérifiez chaque fait à sa source. C'est l'étape qui vous engage.
4. **Intégration** — coller l'objet en tête du tableau `ARTICLES` dans `assets/js/data.js`.
5. **Visuel** — soit une illustration générée par `gen_art.py`, soit un visuel de kit presse via `fetch_presskit.py`, toujours avec son crédit dans `creditImage`.
6. **Publication** — `git push`. Le site est à jour en deux minutes.

---

## 6. Contrôle avant publication

À passer sur chaque article, sans exception :

- [ ] Chaque fait est rattaché à une source liée dans le bloc `sources`.
- [ ] Aucune phrase ne décalque la formulation d'un article existant.
- [ ] Les informations non confirmées sont annoncées comme telles.
- [ ] Les noms propres, dates, chiffres et prix ont été revérifiés à la source.
- [ ] Le crédit de l'image est renseigné.
- [ ] Aucune affirmation sur le site lui-même qui ne soit vraie (équipe, ancienneté, revenus, copies presse).
- [ ] La date de l'article est correcte.

---

## 7. Montée en charge sur douze semaines

**Semaines 1 à 2 — mise en service**
Remplir le champ `SITE` dans `data.js`, compléter la page « Qui écrit ici » avec votre nom si vous le souhaitez, mettre en ligne, activer la collecte quotidienne. Publier 3 actus et le premier Jeton. Ajouter les mentions légales, obligatoires pour un site de presse en France.

**Semaines 3 à 6 — installer le rythme**
Tenir la cadence sans exception : c'est la période où un site se gagne ou se perd. Publier le premier « Encore jouable ? ». Demander deux ou trois accréditations presse pour accéder aux kits.

**Semaines 7 à 9 — la première enquête**
Choisir une question à laquelle personne n'a répondu, plutôt qu'un sujet déjà traité. Piste solide et à votre portée : le financement public du jeu vidéo en France, dont les documents sont accessibles et que presque personne ne lit.

**Semaines 10 à 12 — outiller**
À ce stade, `data.js` sera devenu inconfortable. Deux chantiers : basculer le contenu en fichiers Markdown avec un générateur statique, et ouvrir un flux RSS pour que le site soit lisible ailleurs. Envisager les commentaires seulement si vous avez le temps de les modérer — sinon, laissez-les fermés, c'est plus honnête.

---

## 8. Les pièges à connaître

- **La tentation du volume.** Quinze reprises d'annonces par jour, c'est ce que font tous les sites et c'est ce que personne ne lit. Trois articles vérifiés valent mieux.
- **L'exclusivité sans document.** Une rumeur relayée sans vérification est le moyen le plus rapide de perdre la confiance d'un lecteur, et le plus lent à réparer.
- **L'édito qui glisse.** Le Jeton doit rester drôle et argumenté. Le jour où il devient une liste de griefs, il faut l'arrêter une semaine.
- **La charte oubliée.** Elle est publique. Un lecteur peut la comparer à ce que fait le site. Relisez-la tous les trois mois et corrigez ce qui n'est plus vrai.
