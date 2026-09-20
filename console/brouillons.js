/* Brouillons d'articles en cours de rédaction, un par commande retenue.
   Rempli à la main pendant les sessions de rédaction : chaque entrée suit le
   même schéma qu'un article de data.js, avec en plus un champ "commande" qui
   la relie à la demande d'origine (console/journal.json). Purgé par
   publier.py une fois l'article validé ou refusé dans la console — ne pas
   laisser traîner un brouillon déjà tranché. */
const BROUILLONS = {
  "articles": [
    {
      "slug": "marathon-symbiosis",
      "rubrique": "actu",
      "jeu": "Marathon",
      "titre": "Bungie repousse à décembre la mise à jour Symbiosis de Marathon, et enterre son calendrier saisonnier",
      "sousTitre": "Le mode PvE permanent promis pour le 22 septembre glisse de presque trois mois ; Bungie dit vouloir plus de temps pour finir ce qu'il livre",
      "chapo": "Bungie devait livrer le 22 septembre la première expérience PvE permanente de Marathon. Le studio la reporte au 8 décembre, au sein d'une mise à jour baptisée Symbiosis, et en profite pour annoncer la fin de son calendrier de contenu strictement saisonnier.",
      "auteur": "vieux-joueur",
      "date": "2026-09-20",
      "lecture": 4,
      "cover": "assets/img/covers/marathon-symbiosis.svg",
      "creditImage": "Illustration originale Plein Écran",
      "plateformes": ["PC", "PS5", "Xbox Series"],
      "note": null,
      "aLaUne": false,
      "commande": "mu2xpp9ejd1q3",
      "corps": [
        "Bungie a publié le 15 septembre, sur son site officiel, une mise à jour de développement consacrée à Marathon. Le studio y annonce que la grosse mise à jour prévue pour le 22 septembre — censée introduire la première expérience de jeu en environnement persistant (PvE) permanente du jeu — est repoussée de presque trois mois, au 8 décembre, sous un nouveau nom : Symbiosis.",
        "Le contenu ne change pas de nature, il change de date. Selon le billet de Bungie : « Le contenu prévu pour septembre arrivera désormais dans notre mise à jour Symbiosis, le 8 décembre. Aux côtés d'une nouvelle coque de Runner, d'une expérience PvE permanente et d'une zone Perimeter retravaillée, la mise à jour comprendra aussi un espace social avec stand de tir, un mode expérimental de mort subite en équipe (TDM), et des améliorations de la prise en main pour les nouveaux joueurs. »",
        "Entre-temps, Bungie glisse une mise à jour plus modeste le 6 octobre, baptisée Nightfall Refresh : remise à zéro de la progression et de l'économie du jeu, nouveau passe de récompenses, et une série d'ajustements d'équilibrage et de confort pour la version actuelle.",
        "Le studio en profite pour acter un changement de méthode plus large : la fin d'un calendrier de contenu strictement saisonnier. « Nous abandonnons également un calendrier saisonnier strict, écrit Bungie. Plutôt que de caler les grosses mises à jour sur des échéances saisonnières fixes, nous donnons à l'équipe plus de latitude pour construire, tester et améliorer les fonctionnalités avant leur sortie. » Le studio justifie ce choix par les retours des joueurs depuis le lancement : « Vous nous avez dit que Marathon avait besoin de plus de profondeur, de plus de variété, d'une progression plus solide, et de meilleures raisons d'y rester sur la durée. »",
        "Ce report s'inscrit dans un parcours déjà chahuté. Marathon devait initialement sortir en septembre 2025, avant d'être repoussé sine die après des retours négatifs lors d'un premier alpha fermé ; le jeu n'est finalement sorti que le 5 mars 2026, sur PC, PS5 et Xbox Series, avec un accueil critique plutôt positif mais des ventes jugées décevantes par Sony. Renoncer à un calendrier de contenu figé, pour un jeu-service tout juste lancé, revient à admettre que le rythme initialement promis n'était pas tenable.",
        "Bungie ne donne pas d'autre jalon que le 8 décembre pour l'instant : aucune indication sur ce que deviendra le rythme des mises à jour de Marathon une fois Symbiosis sortie."
      ],
      "sources": [
        { "nom": "Bungie — mise à jour de développement officielle, 15 septembre 2026", "url": "https://www.bungie.net/7/en/News/Article/nightfallrefreshandsymbiosis" },
        { "nom": "Push Square — reprise et citations du billet de Bungie", "url": "https://www.pushsquare.com/news/2026/09/marathons-future-questioned-as-bungie-delays-big-update-and-scraps-seasonal-schedule" },
        { "nom": "Rock Paper Shotgun — contexte et réactions", "url": "https://www.rockpapershotgun.com/marathons-next-major-update-runs-a-few-months-further-away-permanent-pve-in-hand-as-bungie-ditch-their-strict-seasonal-schedule" }
      ]
    }
  ]
};
