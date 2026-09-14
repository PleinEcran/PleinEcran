/* Plein Écran — base de contenu.
   Règles de la maison :
   1. Rien n'est publié qui ne soit vérifiable. Pas de faux rédacteurs,
      pas d'historique inventé, pas de chiffre sans source.
   2. On part des faits et des sources primaires, jamais d'un article existant.
   3. Chaque papier porte ses sources, liées et datées.
*/

/* ------------------------------------------------------------------
   À REMPLIR AVANT PUBLICATION : qui écrit ce site.
   Tant que ce champ n'est pas rempli, le site se présente honnêtement
   comme un site tenu par une personne dont le nom n'est pas affiché.
   ------------------------------------------------------------------ */
const SITE = {
  nom: "Plein Écran",
  lance: 2026,
  ville: "",                    // ex. "Roanne" — laissez vide si vous ne voulez pas l'afficher
  publicite: false,             // passez à true le jour où il y a de la publicité
  contact: "redaction@plein-ecran.fr"
};

const RUBRIQUES = {
  actu:      { nom: "Actu",      couleur: "jaune" },
  enquete:   { nom: "Enquête",   couleur: "menthe" },
  retro:     { nom: "Encore jouable ?", couleur: "violet" },
  jeton:     { nom: "Le Jeton",  couleur: "orange" },
  test:      { nom: "Test",      couleur: "rose" },
  pratique:  { nom: "Pratique",  couleur: "bleu" }
};

/* Description des rubriques, affichée sur la page d'accueil et dans la charte. */
const CONCEPTS = {
  enquete: {
    titre: "Enquête",
    promesse: "Une fois par mois, un sujet qu'on ne peut pas traiter en une heure.",
    formats: [
      { nom: "Pièces à conviction", detail: "Une question d'argent ou de pouvoir, traitée avec des documents publics : comptes déposés, appels d'offres, conditions générales, dépôts de marque. La méthode est publiée en fin d'article, les documents sont liés." },
      { nom: "Le Long Jeu", detail: "Un essai sur une tendance de fond, écrit quand elle est visible mais pas encore commentée. Pas de scoop, une démonstration." }
    ]
  },
  retro: {
    titre: "Encore jouable ?",
    promesse: "Deux fois par mois, un jeu ancien passé au même examen.",
    formats: [
      { nom: "L'examen", detail: "Ce que le jeu a apporté, ce qui a vieilli, ce qui tient encore. Sans nostalgie de principe : un classique peut être devenu injouable, on le dit." },
      { nom: "Où y jouer aujourd'hui", detail: "Un encadré systématique listant les moyens légaux d'y accéder en 2026, avec leurs limites. C'est la partie la plus utile de la rubrique, et la plus rare ailleurs." }
    ]
  },
  jeton: {
    titre: "Le Jeton",
    promesse: "Le vendredi, une pièce jetée sur l'absurdité de la semaine.",
    formats: [
      { nom: "Format court", detail: "2 500 à 3 500 signes, un seul sujet, une seule cible. Sec, drôle si possible, jamais sur une personne : sur une décision, une communication, un chiffre." },
      { nom: "Règle de conduite", detail: "On tape sur ceux qui ont du pouvoir, pas sur ceux qui subissent. Un stagiaire de communication n'est pas responsable de la stratégie de son groupe." }
    ]
  }
};

/* Signature du site. Ajoutez d'autres entrées quand d'autres personnes écrivent. */
const EQUIPE = [
  {
    id: "vieux-joueur",
    nom: "Vieux joueur",
    role: "Rédaction",
    photo: "assets/img/team/vieux-joueur.svg",
    arrivee: 2026,
    specialites: ["Actu", "Enquête", "Encore jouable ?", "Le Jeton"],
    accroche: "Plein Écran est écrit par une seule personne, sous pseudonyme. Pas d'équipe, pas de bureau, pas d'historique.",
    bio: [
      "Vieux joueur est le pseudonyme sous lequel tout ce site est écrit. Une personne, qui signe ses papiers et assume ses erreurs.",
      "Ce que cette signature engage : chaque fait publié est sourcé et lié, chaque correction est signalée en bas d'article, et aucun texte n'est écrit à partir de l'article d'une autre rédaction."
    ],
    manie: "Ne publie pas un fait sans un lien vers l'endroit où le vérifier.",
    moyenne: null,
    interets: "Aucun lien financier avec un éditeur, un studio ou une agence. Aucune copie de presse reçue à ce jour.",
    contact: "redaction@plein-ecran.fr"
  }
];

const ECHELLE = [
  { min: 9,   label: "Marquant" },
  { min: 8,   label: "Très bon" },
  { min: 6.5, label: "Bon" },
  { min: 5,   label: "Correct" },
  { min: 3,   label: "Raté" },
  { min: 0,   label: "À éviter" }
];

const ARTICLES = [
  {
    slug: "zelda-40-ocarina",
    rubrique: "actu",
    jeu: "The Legend of Zelda: Ocarina of Time",
    titre: "Ocarina of Time revient le 5 novembre, et Nintendo assume la fidélité",
    sousTitre: "Le Direct des 40 ans de Zelda a livré une date, quinze minutes de jeu et un parti pris de conservation",
    chapo: "Nintendo a daté son remake d'Ocarina of Time au 5 novembre sur Switch 2. Le plus frappant n'est pas ce qui a été refait, mais ce que le studio a choisi de ne pas toucher.",
    auteur: "vieux-joueur",
    date: "2026-09-09",
    lecture: 5,
    cover: "assets/img/covers/zelda-40-ocarina.svg",
    creditImage: "Illustration originale Plein Écran",
    plateformes: ["Switch 2"],
    note: null,
    aLaUne: true,
    corps: [
      "Nintendo a diffusé lundi 8 septembre un Direct d'une trentaine de minutes consacré aux quarante ans de la série The Legend of Zelda. L'essentiel du temps d'antenne est allé au remake d'Ocarina of Time, annoncé en juin et jusqu'ici resté à l'état de quelques secondes d'images. Il sortira le 5 novembre 2026, exclusivement sur Switch 2.",
      "Le producteur de la série, Eiji Aonuma, a joué une quinzaine de minutes en direct, en partant de la forêt Kokiri jusqu'au premier donjon. Nintendo décrit un remake fidèle au jeu de 1998, réalisé avec des moyens techniques contemporains : la refonte visuelle est complète, la structure ne bouge pas.",
      "Deux détails en disent plus long que la bande-annonce. D'abord, les écrans de chargement entre certaines zones ont été conservés volontairement, Nintendo expliquant vouloir préserver la sensation du jeu d'origine. C'est un choix rare : l'industrie considère depuis dix ans le temps de chargement comme un défaut à éliminer, jamais comme un élément de rythme à protéger.",
      "Ensuite, le micro de la Switch 2 sert à jouer les mélodies à l'ocarina : le joueur peut fredonner ou souffler l'air, et Link exécute le morceau correspondant. C'est le seul ajout qui modifie réellement la manière de jouer, et il porte précisément sur ce qui a donné son nom au jeu.",
      "Autour du jeu, Nintendo a annoncé une console Switch 2 et une manette Pro aux couleurs de l'anniversaire pour le 29 octobre, des amiibo à l'effigie du jeune Link et de la jeune Zelda, une tournée de concerts, des animations au Nintendo Museum de Kyoto étalées sur un an, et un ensemble LEGO de 1 750 pièces prévu au printemps 2027.",
      "Le prix n'a pas été confirmé officiellement au moment où nous publions. Un affichage temporaire sur la boutique australienne, depuis corrigé, laissait entrevoir un tarif proche des autres remakes Switch 2. Nous mettrons cette information à jour quand Nintendo la communiquera.",
      "Un second Direct, généraliste celui-là, était programmé le lendemain 9 septembre. Nous y reviendrons."
    ],
    sources: [
      { nom: "Nintendo — page officielle du Direct", url: "https://www.nintendo.com/us/nintendo-direct/9-8-2026/" },
      { nom: "Nintendo — fiche produit du remake", url: "https://www.nintendo.com/us/store/products/the-legend-of-zelda-ocarina-of-time-switch-2/" },
      { nom: "Nintendo Life — date de sortie et détails de la démonstration", url: "https://www.nintendolife.com/news/2026/09/zelda-ocarina-of-time-launches-on-switch-2-on-5th-november-2026" }
    ]
  },
  {
    slug: "horizon-hunters",
    rubrique: "actu",
    jeu: "Horizon Hunters Gathering",
    titre: "Sony retire le live-service de son Horizon coopératif",
    sousTitre: "Selon Bloomberg, Guerrilla reconstruit Hunters Gathering depuis juin et devra convaincre en décembre",
    chapo: "Passes de saison et monétisation récurrente sautent, le mode histoire revient, l'ambition rétrécit. C'est le énième demi-tour de PlayStation sur le jeu service.",
    auteur: "vieux-joueur",
    date: "2026-09-08",
    lecture: 6,
    cover: "assets/img/covers/horizon-hunters.svg",
    creditImage: "Illustration originale Plein Écran",
    plateformes: ["PS5"],
    note: null,
    aLaUne: false,
    corps: [
      "L'information vient de Jason Schreier, pour Bloomberg, le 19 août. Horizon Hunters Gathering, le jeu d'action en ligne annoncé par PlayStation en février et développé par Guerrilla Games à Amsterdam, est en cours de refonte depuis juin après des retours négatifs lors de tests fermés.",
      "Le projet n'est pas annulé, mais il change de nature. La composante jeu service disparaît : la monétisation continue et le calendrier de contenus saisonniers sont retirés. Le jeu devient une coopération plus classique, dotée d'un mode histoire, sur un périmètre nettement réduit.",
      "Selon les sources de Bloomberg, l'essentiel des équipes a été redéployé sur un autre projet, et une petite équipe travaille désormais sur le prochain Horizon solo. Le nouveau jalon de Hunters Gathering doit être présenté à la direction en décembre. C'est à cette échéance que se jouera la survie du projet.",
      "Ce demi-tour n'a rien d'isolé. PlayStation a annulé ces dernières années plusieurs jeux service en développement, dont le multijoueur de The Last of Us et un projet God of War, et Concord reste l'échec de référence du secteur. Le rachat de Bungie, motivé en partie par cette stratégie, n'a pas produit les résultats attendus.",
      "Ce qu'il faut en retenir dépasse Horizon. Une entreprise qui a investi des années d'ingénierie dans un modèle économique et qui recule après un test fermé indique surtout que le public ne suit plus automatiquement une franchise vers ce format. Le calcul qui a orienté toute une génération de productions est en train d'être refait, éditeur par éditeur.",
      "Sony n'a pas commenté publiquement ces informations à ce jour."
    ],
    sources: [
      { nom: "Bloomberg — Jason Schreier, 19 août 2026", url: "https://www.bloomberg.com/news/articles/2026-08-19/playstation-reboots-horizon-hunters-gathering-as-live-service-strategy-struggles" },
      { nom: "PC Gamer — reprise et contexte", url: "https://www.pcgamer.com/games/action/sony-reportedly-reverses-course-on-live-service-co-op-horizon-game-after-negative-player-feedback/" },
      { nom: "Kotaku — historique des jeux service abandonnés chez PlayStation", url: "https://kotaku.com/horizon-co-op-mulitplayer-game-development-reboot-2000725807" }
    ]
  },
  {
    slug: "warren-spector",
    rubrique: "actu",
    titre: "Warren Spector arrête, après quarante-quatre ans et dix-sept jeux",
    sousTitre: "Le créateur de Deus Ex annonce sa retraite sur LinkedIn et laisse une consigne aux jeunes développeurs",
    chapo: "Il avait déjà envisagé de partir. Cette fois il dit que c'est la bonne, invoque son âge, sa santé, et une industrie où il s'amuse moins.",
    auteur: "vieux-joueur",
    date: "2026-09-07",
    lecture: 6,
    cover: "assets/img/covers/warren-spector.svg",
    creditImage: "Illustration originale Plein Écran",
    plateformes: [],
    note: null,
    aLaUne: false,
    corps: [
      "Warren Spector a annoncé le 18 août, dans un message publié sur LinkedIn, qu'il arrêtait le développement de jeux. Il a soixante-dix ans et compte quarante-quatre années de métier, dix-sept jeux terminés et une neuvaine d'extensions.",
      "Le parcours a commencé loin de l'écran : au jeu de rôle sur table, chez Steve Jackson Games puis chez TSR, à partir de 1983. Il rejoint Origin Systems en 1989, produit Ultima Underworld, passe par Looking Glass et System Shock, puis fonde la branche texane d'Ion Storm où sortent Deus Ex et Thief : Deadly Shadows. Suivront Epic Mickey chez Disney, puis Otherside Entertainment.",
      "Ce catalogue est à l'origine d'un genre entier, l'immersive sim, dont le principe tient en une phrase : donner au joueur plusieurs manières de résoudre un problème et faire en sorte que le monde en tienne compte. Une grande partie de la production actuelle, de Dishonored à Prey en passant par des dizaines de petits jeux, en descend directement.",
      "Spector explique que l'âge et la santé le rattrapent, et que le métier a changé au point de l'amuser moins. Il dit garder en tête trois jeux qu'il aurait aimé faire, sans les nommer, et se tourner vers l'écriture, la lecture, quelques conférences et du conseil.",
      "Il a toujours corrigé ceux qui le présentaient comme l'auteur unique de ses jeux, en rappelant qu'ils sont le produit d'équipes allant de douze à huit cents personnes. Son message de départ s'adresse d'ailleurs moins au public qu'aux développeurs : selon lui, le jeu vidéo n'est pas un problème résolu, et il reste beaucoup à expérimenter.",
      "Sa dernière phrase, adressée aux jeunes développeurs, tient de la consigne plus que de l'adieu : leur travail consiste à faire oublier que des gens comme lui ont existé."
    ],
    sources: [
      { nom: "Video Games Chronicle — annonce et parcours", url: "https://www.videogameschronicle.com/news/its-just-not-as-much-fun-for-me-anymore-deus-ex-creator-warren-spector-is-retiring-from-game-development/" },
      { nom: "PC Gamer — extraits du message LinkedIn", url: "https://www.pcgamer.com/gaming-industry/industry-legend-warren-spector-is-retiring-im-feeling-like-ive-done-what-i-set-out-to-do/" },
      { nom: "GameSpot — réactions et suite annoncée", url: "https://www.gamespot.com/articles/deus-ex-and-immersive-sim-founding-father-warren-spector-retires-from-game-development/" }
    ]
  },
  {
    slug: "calendrier-sept",
    rubrique: "enquete",
    format: "Le Long Jeu",
    titre: "Pourquoi septembre est embouteillé à ce point",
    sousTitre: "Une trentaine de sorties en quatre semaines, et une seule explication : personne ne veut être en face de GTA 6",
    chapo: "Moonlighter 2, The Blood of Dawnwalker, Onimusha, NBA 2K27, Phantom Blade Zero, EA Sports FC 27 : le mois est saturé. Ce n'est pas un hasard de calendrier, c'est une stratégie d'évitement.",
    auteur: "vieux-joueur",
    date: "2026-09-06",
    lecture: 7,
    cover: "assets/img/covers/calendrier-sept.svg",
    creditImage: "Illustration originale Plein Écran",
    plateformes: ["PC", "PS5", "Xbox Series", "Switch 2"],
    note: null,
    aLaUne: false,
    corps: [
      "Le mois s'ouvre à un rythme que le secteur n'avait plus connu depuis plusieurs années. Moonlighter 2 passe en version 1.0 le 2 septembre. Orbitals, coopératif exclusif à la Switch 2, arrive le 3, en même temps que The Blood of Dawnwalker, l'action-RPG de Rebel Wolves porté par des vétérans de CD Projekt et édité par Bandai Namco. Le 4, Capcom fait revenir Onimusha avec Way of the Sword, plus de vingt ans après le dernier épisode, tandis que NBA 2K27 ouvre la saison des jeux de sport annuels. Phantom Blade Zero suit le 9, EA Sports FC 27 le 25.",
      "S'y ajoutent Marvel's Wolverine chez Insomniac, un remaster de The Witcher 3 et une série de portages Switch 2. Une trentaine de sorties notables en quatre semaines, dont plusieurs qui auraient tenu la tête d'affiche à elles seules un mois normal.",
      "L'explication tient en trois lettres. GTA 6 est attendu pour la fin novembre, et personne ne veut sortir dans son sillage. Les éditeurs ont deux fenêtres : avant, c'est-à-dire maintenant, ou après, c'est-à-dire l'an prochain. La plupart ont choisi maintenant, et l'embouteillage est le résultat mécanique de ce calcul.",
      "Ce genre de concentration a des conséquences très concrètes. Pour les studios de taille moyenne, sortir la même semaine qu'un jeu de sport annuel ou qu'une exclusivité première partie, c'est perdre l'essentiel de la visibilité commerciale — et de la couverture presse, puisque les rédactions n'ont pas le temps de tout tester.",
      "Pour les joueurs, l'effet est plus banal mais tout aussi réel : un budget qui ne suit pas, et des jeux qui se retrouvent en promotion très vite parce qu'ils n'ont pas trouvé leur public à la sortie. C'est souvent en janvier que se rattrapent les meilleures affaires de septembre.",
      "Notre position là-dessus est simple, et c'est celle que nous appliquerons : nous ne couvrirons pas tout, nous couvrirons ce que nous pouvons vérifier et finir. Un jeu traité trois semaines après sa sortie reste utile ; un papier bâclé, non."
    ],
    sources: [
      { nom: "ActuGaming — calendrier des sorties de septembre 2026", url: "https://www.actugaming.net/calendrier-sorties-jeux-video-septembre-2026-821860/" },
      { nom: "JeuxVideo.com — fiches de sorties du mois", url: "https://www.jeuxvideo.com/jeux/sorties/annee-2026/mois-9/" },
      { nom: "Gameblog — densité du calendrier et effet GTA 6", url: "https://www.gameblog.fr/jeu-video/ed/news/sorties-jeux-video-septembre-2026-721992" }
    ]
  },
  {
    slug: "oot-encore-jouable",
    rubrique: "retro",
    jeu: "The Legend of Zelda: Ocarina of Time",
    format: "L'examen",
    titre: "Ocarina of Time (1998) : ce qui tient, ce qui a lâché",
    sousTitre: "Avant le remake du 5 novembre, l'original repassé au même examen que n'importe quel jeu de la rubrique",
    chapo: "On vend Ocarina of Time comme un monument. La question qui nous intéresse est autre : vingt-huit ans après, est-ce qu'on peut encore y jouer sans indulgence, et par quels moyens légaux ?",
    auteur: "vieux-joueur",
    date: "2026-09-05",
    lecture: 9,
    cover: "assets/img/covers/oot-encore-jouable.svg",
    creditImage: "Illustration originale Plein Écran",
    plateformes: ["N64", "Switch", "Switch 2"],
    note: null,
    aLaUne: false,
    corps: [
      "Sorti sur Nintendo 64 en 1998, Ocarina of Time est le premier Zelda en trois dimensions, et le jeu qui a fixé une bonne partie de la grammaire de l'action-aventure en 3D. Ce n'est pas une formule de commémoration : la plupart des jeux de ce type utilisent aujourd'hui encore des solutions qu'il a inventées ou popularisées.",
      "La principale s'appelle le verrouillage de cible. Avant lui, se battre en trois dimensions supposait d'orienter soi-même la caméra et le personnage en même temps, avec les résultats qu'on imagine. Ocarina of Time règle le problème en permettant de verrouiller un adversaire d'une touche : la caméra se place, le personnage reste tourné vers la cible, et le joueur se concentre sur le déplacement. Toute une génération de jeux d'action a copié ce système sans le modifier.",
      "L'autre trouvaille est plus discrète : les actions contextuelles. Une même touche parle, ramasse, grimpe, ouvre, selon ce que le personnage a devant lui, avec un libellé affiché à l'écran. Cela paraît banal parce que c'est devenu la norme absolue. En 1998, cela ne l'était pas.",
      "Ce qui a vieilli, maintenant, parce que la rubrique ne sert à rien si elle ne le dit pas. La caméra reste rigide dès qu'on s'écarte du combat verrouillé. Les espaces intérieurs sont anguleux et répétitifs, en particulier deux donjons de la seconde moitié que même les défenseurs du jeu traversent en soupirant. Le rythme, surtout, suppose une patience que le jeu moderne n'exige plus : trajets longs, allers-retours, dialogues qui se répètent à chaque rechargement.",
      "Le verdict de l'examen, c'est qu'Ocarina of Time se rejoue très bien à condition de savoir ce qu'on vient chercher. Comme document sur la naissance d'une grammaire, il est passionnant et lisible immédiatement. Comme jeu d'aventure à découvrir en 2026 sans contexte, il demande une indulgence que personne n'est obligé d'accorder.",
      "Reste la question qui manque presque toujours dans les articles de célébration : où y jouer, légalement, aujourd'hui."
    ],
    encadre: {
      titre: "Où y jouer légalement en 2026",
      items: [
        "La version Nintendo 64 d'origine figure dans la bibliothèque N64 de Nintendo Switch Online + Pack additionnel, ouverte en octobre 2021. Limite importante : le jeu n'est pas achetable séparément, l'accès s'arrête avec l'abonnement.",
        "La version Nintendo 3DS de 2011, souvent considérée comme la plus confortable, n'est plus vendue : la boutique 3DS a fermé en mars 2023. Elle reste jouable si vous possédez déjà la console et le jeu, ou une cartouche d'occasion.",
        "Les rééditions Wii et Wii U ne sont plus disponibles depuis la fermeture de leurs boutiques respectives.",
        "Le remake Switch 2 sort le 5 novembre 2026. C'est un achat, pas un abonnement, et donc le seul moyen à venir de posséder durablement une version du jeu.",
        "Bilan : d'un jeu vendu à plusieurs millions d'exemplaires, il ne reste en 2026 qu'un accès locatif et un remake à venir. C'est exactement le problème de fond de la préservation, sur l'un des titres les plus célèbres du médium."
      ]
    },
    corps2: [
      "Ce constat n'a rien d'anecdotique. Si le jeu le plus cité de l'histoire du médium n'est accessible que par abonnement, la question se pose en pire pour les milliers de titres que personne ne remasterise. La rubrique reviendra régulièrement sur ce point, jeu par jeu, sans le traiter comme une fatalité."
    ],
    sources: [
      { nom: "Nintendo — fiche du remake Switch 2", url: "https://www.nintendo.com/us/store/products/the-legend-of-zelda-ocarina-of-time-switch-2/" },
      { nom: "Nintendo Switch Online — historique du service et bibliothèque N64", url: "https://en.wikipedia.org/wiki/Nintendo_Switch_Online" },
      { nom: "Ocarina of Time — fiche encyclopédique et rééditions", url: "https://en.wikipedia.org/wiki/The_Legend_of_Zelda:_Ocarina_of_Time" }
    ]
  },
  {
    slug: "jeton-live-service",
    rubrique: "jeton",
    jeu: "Horizon Hunters Gathering",
    titre: "Sony découvre que les gens n'aiment pas payer un abonnement pour chasser des robots",
    sousTitre: "Le Jeton de la semaine",
    chapo: "Il aura fallu quatre ans, un rachat à plusieurs milliards et un cimetière de projets annulés pour arriver à cette conclusion d'une audace folle : peut-être que le public voulait juste un bon jeu.",
    auteur: "vieux-joueur",
    date: "2026-09-04",
    lecture: 3,
    cover: "assets/img/covers/jeton-live-service.svg",
    creditImage: "Illustration originale Plein Écran",
    plateformes: [],
    note: null,
    aLaUne: false,
    corps: [
      "Résumons la séquence. Une entreprise possède une série d'aventure solo qui marche. Elle décide d'en tirer un jeu en ligne à monétisation continue. Elle y consacre des années et l'essentiel d'un studio. Elle organise des tests fermés. Les testeurs n'aiment pas. L'entreprise retire alors la monétisation continue, remet un mode histoire, réduit la voilure, et se retrouve avec — tenez-vous bien — un jeu d'aventure coopératif normal.",
      "On appelle ça un pivot stratégique. Dans n'importe quel autre secteur, on appellerait ça revenir à la case départ après avoir brûlé quatre ans.",
      "Le plus beau est que personne n'avait besoin des tests fermés pour prévoir le résultat. La même entreprise a déjà annulé un multijoueur The Last of Us, un projet God of War, et sorti Concord, dont la durée de vie commerciale se mesure en jours. À un certain stade, le refus d'écouter cesse d'être un pari et devient une méthode.",
      "Ce qui rend l'affaire plus agaçante qu'amusante, c'est qui paie. Pas les dirigeants qui ont arbitré. Les équipes, déplacées d'un projet à l'autre au gré des jalons trimestriels, et les joueurs de la série principale, qui attendent une suite depuis quatre ans pendant qu'on démontait puis remontait un jeu dont personne n'avait réclamé l'existence.",
      "Prochain jalon en décembre. Si vous cherchez un pronostic, notez simplement qu'un projet qu'on présente à sa direction en lui demandant de l'impressionner n'est déjà plus tout à fait vivant.",
      "Une pièce a été jetée. À la semaine prochaine."
    ],
    sources: [
      { nom: "Notre article de fond sur le sujet", url: "article.html?a=horizon-hunters" },
      { nom: "Bloomberg — Jason Schreier, 19 août 2026", url: "https://www.bloomberg.com/news/articles/2026-08-19/playstation-reboots-horizon-hunters-gathering-as-live-service-strategy-struggles" }
    ]
  }
];
