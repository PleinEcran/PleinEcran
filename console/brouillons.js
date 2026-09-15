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
      "titre": "Bungie repousse la mise à jour de Marathon à décembre, et renonce à son calendrier saisonnier strict",
      "sousTitre": "Symbiosis, prévue le 8 décembre, apportera le premier mode PvE permanent du jeu ; une mise à jour intermédiaire arrive dès le 6 octobre",
      "chapo": "La mise à jour majeure annoncée pour le 22 septembre n'aura pas lieu à cette date. Bungie la reporte de plusieurs mois sous le nom Symbiosis, promet un mode PvE permanent, et abandonne le rythme saisonnier fixe qui cadençait Marathon depuis sa sortie.",
      "auteur": "vieux-joueur",
      "date": "2026-09-15",
      "lecture": 4,
      "cover": "assets/img/covers/marathon-symbiosis.svg",
      "creditImage": "Illustration originale Plein Écran",
      "plateformes": ["PC", "PS5", "Xbox Series"],
      "note": null,
      "aLaUne": false,
      "corps": [
        "Bungie a publié le 14 septembre, sur le site officiel du studio, une mise à jour de développement sur Marathon. Elle annonce que la mise à jour majeure prévue pour le 22 septembre n'arrivera pas à cette date : son contenu est reporté au 8 décembre, sous le nom Symbiosis.",
        "Symbiosis apportera la première expérience PvE permanente du jeu, jusqu'ici bâti autour de son mode d'extraction PvPvE. Au programme selon Bungie : une zone Perimeter retravaillée, un nouvel espace social doté d'un stand de tir, une coque de personnage inédite baptisée Runner, un mode de duel par équipes expérimental, et les premières retouches de l'expérience proposée aux nouveaux joueurs.",
        "Entre les deux dates, une mise à jour intermédiaire baptisée Nightfall Refresh arrivera le 6 octobre : remise à zéro de la progression et de l'économie du jeu, nouveau passe de récompenses, ajustements d'équilibrage et retour temporaire du mode Vault Breaker. Bungie explique ce geste par les problèmes de progression de la deuxième saison, « Nightfall », qui avait propulsé une partie des joueurs vers l'endgame en laissant les autres à la traîne.",
        "Le studio en profite pour annoncer l'abandon du rythme saisonnier strict qui cadençait Marathon depuis son lancement. « Nous nous éloignons d'un calendrier saisonnier strict, écrit Bungie. Plutôt que de lier les mises à jour majeures à des échéances saisonnières fixes, nous donnons à l'équipe plus de souplesse pour construire, tester et améliorer les fonctionnalités avant leur sortie. » Le studio relie directement ce choix aux retours des joueurs, qui réclament « plus de profondeur, plus de variété, une meilleure progression, et de meilleures raisons de continuer à jouer sur la durée ».",
        "Marathon, extraction shooter PvPvE développé par Bungie pour Sony, est sorti le 5 mars après plusieurs reports depuis l'annonce initiale. Son accueil critique a été plutôt positif, mais son démarrage commercial a été jugé en retrait par rapport à des concurrents du même genre. Le studio promet un point d'étape plus large sur l'avenir du jeu, à publier plus tard en septembre.",
        "Bungie annonce enfin des vidéos régulières « Dev Insights » pour détailler ces choix au fil de l'eau. Ni le contenu complet de Symbiosis ni son équilibrage ne sont figés à ce stade : le studio se laisse explicitement la possibilité d'ajuster le calendrier de décembre d'ici sa sortie."
      ],
      "sources": [
        { "nom": "Bungie — Marathon Development Update, Nightfall Refresh and Symbiosis (14 septembre 2026)", "url": "https://www.bungie.net/7/en/News/Article/nightfallrefreshandsymbiosis" },
        { "nom": "Push Square — reprise et réactions", "url": "https://www.pushsquare.com/news/2026/09/marathons-future-questioned-as-bungie-delays-big-update-and-scraps-seasonal-schedule" },
        { "nom": "PC Gamer — détail de la mise à jour Symbiosis", "url": "https://www.pcgamer.com/games/fps/bungie-delays-next-marathon-update-and-ends-strict-seasonal-schedule-as-it-goes-all-in-on-destiny-like-features/" }
      ],
      "commande": "mu2xpp9ejd1q3"
    },
    {
      "slug": "steam-frame-ram",
      "rubrique": "actu",
      "titre": "Le Steam Frame coûtera au moins 1059 dollars, la pénurie de mémoire vive en cause",
      "sousTitre": "Valve attribue explicitement ce prix et le retard de ses annonces à la flambée mondiale du prix de la RAM ; le futur successeur du Steam Deck, lui, ne serait « pas vraiment » concerné, selon des ingénieurs de Valve interrogés par IGN",
      "chapo": "Valve a ouvert les réservations de son casque VR autonome Steam Frame à 1059 dollars, et attribue ce prix ainsi que le retard de son annonce à la pénurie mondiale de mémoire et de stockage. Le successeur du Steam Deck, lui, ne serait pas concerné par ce contexte, selon deux ingénieurs de Valve cités par IGN — deux dossiers que la presse anglophone a souvent mélangés.",
      "auteur": "vieux-joueur",
      "date": "2026-09-15",
      "lecture": 5,
      "cover": "assets/img/covers/steam-frame-ram.svg",
      "creditImage": "Illustration originale Plein Écran",
      "plateformes": [],
      "note": null,
      "aLaUne": false,
      "corps": [
        "Valve a ouvert le 14 septembre les réservations de son casque de réalité virtuelle autonome, le Steam Frame, sur la page produit officielle de sa boutique. Le modèle de 256 Go est affiché à 1059 dollars, le modèle de 1 To à 1299 dollars ; chaque exemplaire est livré avec les manettes dédiées, un adaptateur Wi-Fi 6E et une copie de Half-Life: Alyx, le bloc d'alimentation étant vendu séparément. Les inscriptions au tirage au sort d'achat sont ouvertes jusqu'au 17 septembre, les premières invitations devant arriver le lendemain.",
        "Le Steam Frame n'est pas un successeur du Steam Deck : c'est un casque VR distinct, annoncé en novembre 2025 en même temps que le Steam Machine et une nouvelle manette. Une partie de la presse anglophone, dont Video Games Chronicle, a résumé cette actualité sous le raccourci « Steam Deck 2 », ce qui entretient une confusion entre deux produits différents. Nous préférons les distinguer.",
        "Sur le prix, Valve a été explicite : l'entreprise a indiqué que les pénuries de mémoire et de stockage qui touchent toute l'industrie depuis fin 2025 l'ont contrainte à revoir ses tarifs à la hausse et à retarder ses annonces de prix et de dates. L'ingénieur Jeremy Selan a ajouté que Valve visait initialement un appareil « nettement plus abordable », mais que « le marché mondial de la RAM nous a touchés comme tout le monde ».",
        "Sur le successeur du Steam Deck original — un produit qui n'a à ce jour ni nom de code confirmé ni page boutique — Valve tient un discours différent. Dans un entretien publié par IGN le 15 septembre, les ingénieurs Pierre-Loup Griffais et Jeff Leinbaugh affirment que la crise de la RAM n'a « pas vraiment » changé les plans du studio pour cet appareil. Griffais confirme viser un bond de performance nettement démarqué avant de lancer un successeur, sans donner de calendrier : « c'est une question d'observer les conditions actuelles et de voir comment et quand nous pouvons livrer quelque chose comme ça ».",
        "Valve reconnaît malgré tout un effet indirect : la hausse des prix du Steam Deck OLED lui-même — le modèle 1 To a augmenté de plus de 46 % pour atteindre 949 dollars depuis le début de l'année — a probablement pesé sur les ventes de l'appareil, sans qu'un chiffre soit avancé.",
        "Cette actualité doit se lire avec la source qui la porte : c'est IGN, et non Valve directement, qui a recueilli les propos sur le successeur du Steam Deck. Nous les relayons en le nommant, conformément à notre charte."
      ],
      "sources": [
        { "nom": "Valve — page produit officielle du Steam Frame", "url": "https://store.steampowered.com/hardware/steamframe" },
        { "nom": "IGN — entretien avec Pierre-Loup Griffais et Jeff Leinbaugh sur le successeur du Steam Deck", "url": "https://www.ign.com/articles/valve-says-ram-crisis-hasnt-affected-plans-for-steam-deck-2" },
        { "nom": "GamingOnLinux — la déclaration de Valve sur les pénuries de mémoire", "url": "https://www.gamingonlinux.com/2026/02/valve-confirm-steam-deck-stock-issues-due-to-memory-and-storage-shortages/" }
      ],
      "commande": "mu2xpn267lo8b"
    },
    {
      "slug": "gta6-stephen-root",
      "rubrique": "actu",
      "jeu": "Grand Theft Auto VI",
      "titre": "Stephen Root confirme sa présence dans GTA 6, deux jours avant les Emmy Awards",
      "sousTitre": "L'acteur de King of the Hill lève le doute entretenu depuis la deuxième bande-annonce du jeu, dans un entretien avec l'Associated Press",
      "chapo": "Repéré à la voix par les joueurs dès mai 2025, Stephen Root a confirmé son rôle dans GTA 6 lors d'un entretien avec l'Associated Press, en marge d'une réception précédant les Emmy Awards. Rockstar Games, fidèle à son habitude, n'a rien confirmé de son côté.",
      "auteur": "vieux-joueur",
      "date": "2026-09-15",
      "lecture": 3,
      "cover": "assets/img/covers/gta6-stephen-root.svg",
      "creditImage": "Illustration originale Plein Écran",
      "plateformes": ["PS5", "Xbox Series"],
      "note": null,
      "aLaUne": false,
      "corps": [
        "L'acteur américain Stephen Root, connu pour avoir prêté sa voix à Bill Dauterive et Buck Strickland dans King of the Hill, a confirmé sa présence au casting de Grand Theft Auto VI. La déclaration a été recueillie par l'Associated Press lors du BAFTA TV Tea Party, une réception organisée à Los Angeles avant la cérémonie des Emmy Awards, où Root a remporté le 14 septembre le prix du meilleur second rôle dans une série comique pour Widow's Bay.",
        "« Oui, vous allez me voir dedans, a déclaré Root selon les propos relayés par l'AP. Ça sort le 19 novembre. Je crois que dès la première présentation de GTA, il y a presque un an, ils avaient mon personnage, et il y avait trop de gens qui me reconnaissaient à la voix, à cause de King of the Hill. » Il ajoute : « Je suis tellement content d'y être associé. C'est quelque chose d'incroyable à voir. »",
        "Root ne nomme aucun personnage précis dans cet entretien. Les joueurs avaient repéré sa voix dès la diffusion de la deuxième bande-annonce du jeu, en mai 2025, sur un personnage secondaire présenté par Rockstar comme un contrebandier vétéran des Keys de Leonida, tenancier d'un chantier naval. Le rapprochement entre cette voix et ce personnage reste, à ce stade, une déduction de la presse et des joueurs, pas une confirmation nommée de l'acteur.",
        "Rockstar Games n'a publié aucune liste de casting et n'a pas commenté la déclaration de Root — une réserve habituelle chez l'éditeur, qui ne confirme jamais publiquement ses distributions avant la sortie d'un jeu.",
        "GTA 6 est attendu le 19 novembre sur PS5 et Xbox Series, après deux reports depuis l'annonce initiale d'une sortie en 2025."
      ],
      "sources": [
        { "nom": "Associated Press, relayé par Tegna (king5.com) — confirmation de Stephen Root", "url": "https://www.king5.com/article/news/nation-world/stephen-root-grand-theft-auto-vi-confirms/507-f89d59c6-af2e-4995-915c-ac93da36b5c1" },
        { "nom": "NME — reprise et contexte du personnage", "url": "https://www.nme.com/news/gaming-news/grand-theft-auto-6-cast-actor-voice-stephen-root-brian-heder-3968701" },
        { "nom": "Eurogamer — reprise", "url": "https://www.eurogamer.net/gta-6-confirmed-actor-king-of-the-hill-stephen-root" }
      ],
      "commande": "mu1scz6twdezy"
    },
    {
      "slug": "level5-ia-aveu",
      "rubrique": "actu",
      "titre": "Le patron de Level-5 reconnaît avoir utilisé de l'IA générative dans sa présentation, et s'en excuse",
      "sousTitre": "Repérée par les joueurs japonais dès la diffusion, l'utilisation d'IA dans les images du dernier Level-5 Vision a précédé un aveu d'Akihiro Hino sur X",
      "chapo": "Deux jours après avoir présenté remakes et nouveautés en ligne, le PDG de Level-5 a confirmé avoir eu recours à de l'IA générative pour « rendre l'événement plus spectaculaire ». Son message d'excuses s'accompagne d'un objectif qui inquiète davantage que l'aveu lui-même : réduire de cinq à deux ans le temps de développement des gros titres du studio.",
      "auteur": "vieux-joueur",
      "date": "2026-09-15",
      "lecture": 4,
      "cover": "assets/img/covers/level5-ia-aveu.svg",
      "creditImage": "Illustration originale Plein Écran",
      "plateformes": [],
      "note": null,
      "aLaUne": false,
      "corps": [
        "Level-5 a diffusé le 10 septembre en ligne sa présentation « LEVEL5 VISION 2026 II », consacrée notamment à un remake de Professor Layton and the Curious Village et à de nouvelles images d'Inazuma Eleven: Rekka no Kakumei et de Yo-kai Watch 2: Hadō. Dès la diffusion, des joueurs japonais ont relevé des incohérences entre certains visuels montrés et du matériel déjà publié, en particulier sur un personnage inédit d'Inazuma Eleven, Nagi Kōsei, et sur une mise en scène récurrente reprenant les traits du PDG Akihiro Hino sous plusieurs thèmes visuels — des détails caractéristiques d'images produites par IA générative.",
        "Akihiro Hino a confirmé ces soupçons le 12 septembre, dans un message publié sur son compte X personnel : « Par volonté de rendre la présentation spectaculaire, j'ai intégré un traitement qui tenait aussi de l'expérimentation, en utilisant l'IA la plus récente. » Il ajoute : « Il semble que certaines personnes se soient senties mal à l'aise à ce sujet, je m'en excuse profondément. »",
        "Hino distingue cet usage, limité selon lui à la mise en scène de l'événement, du contenu des jeux eux-mêmes : scénarios, character designs et partis pris resteraient entièrement conçus par des humains, l'IA ne servant qu'à « numériser » un travail créatif d'origine humaine. Il assure qu'aucune « donnée de sortie IA produite à la légère » n'entrera dans les jeux commercialisés.",
        "Une phrase du même message a davantage retenu l'attention de la presse et des joueurs japonais que l'aveu lui-même : Hino y présente l'IA comme un moyen de faire passer le temps de développement des gros titres du studio d'environ cinq ans à deux ans. C'est cette ambition, plus que l'usage ponctuel révélé, qui alimente le scepticisme relevé par Famitsu, AUTOMATON et Game*Spark dans leur couverture de l'affaire.",
        "La presse anglophone, dont GamesIndustry.biz et Eurogamer, a repris l'information deux à quatre jours plus tard, à partir du message de Hino et de sa couverture par la presse japonaise."
      ],
      "sources": [
        { "nom": "Akihiro Hino — message d'explications et d'excuses sur X, 12 septembre 2026", "url": "https://x.com/AkihiroHino/status/2098650784934338645" },
        { "nom": "Famitsu — citations complètes et contexte de l'événement", "url": "https://www.famitsu.com/article/202609/87725" },
        { "nom": "AUTOMATON — détail des visuels contestés", "url": "https://automaton-media.com/articles/newsjp/20260912-467049/" }
      ],
      "commande": "mu1scxkqub8ue"
    },
    {
      "slug": "abonnements-cout-resiliations",
      "rubrique": "actu",
      "titre": "Le prix devient la première raison de résilier son abonnement Game Pass, PS Plus ou Switch Online",
      "sousTitre": "Selon des chiffres américains partagés par l'analyste de Circana Mat Piscatella, plus de 40 % des résiliations citent désormais le coût comme motif principal, en hausse sur un an",
      "chapo": "Un graphique partagé par l'analyste jeu vidéo de Circana montre le coût grimper parmi les raisons données par les joueurs américains pour résilier leur abonnement aux trois grands services. Le chiffre vient d'une étude propriétaire non publiée intégralement : nous le présentons avec les réserves qui s'imposent.",
      "auteur": "vieux-joueur",
      "date": "2026-09-15",
      "lecture": 4,
      "cover": "assets/img/covers/abonnements-cout-resiliations.svg",
      "creditImage": "Illustration originale Plein Écran",
      "plateformes": [],
      "note": null,
      "aLaUne": false,
      "corps": [
        "Mat Piscatella, analyste senior chez Circana (l'ex-NPD Group), a publié le 11 septembre sur Bluesky un graphique tiré du tracker trimestriel de la société, la « Future of Insights for Video Games Consumer Survey ». Il y interroge les Américains ayant résilié un abonnement Xbox Game Pass Essential, PlayStation Plus Essential ou Nintendo Switch Online sur leurs motifs.",
        "Le résultat : la réponse « je n'arrivais pas à justifier le coût de l'abonnement dans mon budget, alors que le service me plaisait » progresse nettement en un an. Elle passe de 37 % à 41 % pour Game Pass Essential, de 37 % à 41 % pour PlayStation Plus Essential, et de 40 % à 50 % pour Nintendo Switch Online, entre le premier et le troisième trimestre 2026.",
        "Ces chiffres appellent une précision que Piscatella donne lui-même : ils ne mesurent pas une hausse du nombre de personnes qui résilient, seulement la part que prend le motif du coût parmi celles qui le font déjà. Aucune taille d'échantillon, aucune méthode de recrutement ni aucune autre raison de résiliation chiffrée n'accompagne ce graphique — Circana ne publie pas la totalité de son étude, réservée à ses clients professionnels. Nous le signalons plutôt que de le présenter comme un rapport public complet.",
        "Le contexte tarifaire alimente cette lecture : les trois services ont chacun relevé leurs prix depuis 2025, à des degrés variables selon les paliers d'abonnement. Ni Microsoft, ni Sony, ni Nintendo n'ont réagi publiquement aux chiffres de Circana au moment où nous publions."
      ],
      "sources": [
        { "nom": "Mat Piscatella (Circana) — publication Bluesky du 11 septembre 2026", "url": "https://bsky.app/profile/matpiscatella.bsky.social/post/3mvauudyrtc2n" },
        { "nom": "GamesIndustry.biz — reprise", "url": "https://www.gamesindustry.biz/more-than-40-of-people-cancelling-xbox-game-pass-playstation-plus-and-nintendo-switch-online-subscriptions-blame-rising-costs" }
      ],
      "commande": "mu1sctz54hca2"
    },
    {
      "slug": "blizzcon-2026-annonces",
      "rubrique": "actu",
      "titre": "Blizzard revient de trois ans d'absence avec un StarCraft en monde ouvert prévu pour 2030",
      "sousTitre": "BlizzCon a aussi confirmé Diablo V pour 2029 et une troisième branche de World of Warcraft, « Forever », dès le 4 novembre",
      "chapo": "De retour après trois ans d'interruption, BlizzCon a servi de cadre à l'annonce d'un jeu de tir StarCraft en monde ouvert mené par un ancien de Far Cry, à la confirmation officielle de Diablo V, et au lancement imminent d'une troisième expérience World of Warcraft. Seule la dernière sort avant plusieurs années.",
      "auteur": "vieux-joueur",
      "date": "2026-09-15",
      "lecture": 5,
      "cover": "assets/img/covers/blizzcon-2026-annonces.svg",
      "creditImage": "Illustration originale Plein Écran",
      "plateformes": ["PC"],
      "note": null,
      "aLaUne": false,
      "corps": [
        "BlizzCon a fait son retour le 12 septembre au centre des congrès d'Anaheim, en Californie, après trois ans d'interruption. La cérémonie d'ouverture a servi de cadre à trois annonces, à des horizons très différents malgré une couverture presse qui les a souvent présentées sur le même plan.",
        "La seule à sortir réellement cette année est World of Warcraft: Forever, une troisième expérience du MMO aux côtés des versions moderne et classique, disponible le 4 novembre, avec une bêta ouverte dès le 17 septembre. Elle se situe après les événements de Warcraft III: Reforged – Forsaken Kingdom et avant Molten Core, revient sur les continents d'origine, plafonne la progression au niveau 60, et ajoute trois zones inédites, plus de mille quêtes, neuf donjons, deux raids et une nouvelle race jouable, les Skyborne.",
        "Diablo V a été confirmé « officiellement en développement », pour une sortie au printemps 2029. Blizzard promet un Sanctuaire où, pour la première fois, Diablo a triomphé et où les héros ont échoué. Une série animée Diablo coproduite avec Netflix a été annoncée en marge de ce jeu.",
        "L'annonce la plus lointaine concerne StarCraft : un jeu de tir en monde ouvert, sobrement titré STARCRAFT, qui se déroule environ soixante-dix ans après StarCraft II: Legacy of the Void et laisse le joueur créer son propre Marine du Dominion. Sa sortie est fixée au printemps 2030. Le projet est mené par Dan Hay, ancien directeur créatif de la série Far Cry chez Ubisoft, qui a comparé le ton visé à « Deadwood dans l'espace » lors d'entretiens accordés à la presse en marge de l'événement — une formule qui n'apparaît pas dans le communiqué officiel de Blizzard.",
        "Le communiqué de Blizzard ne nomme aucun studio distinct pour Diablo V et StarCraft : les deux projets restent crédités à Blizzard Entertainment dans son ensemble."
      ],
      "sources": [
        { "nom": "Blizzard — toutes les annonces de la cérémonie d'ouverture de BlizzCon 2026", "url": "https://news.blizzard.com/en-us/article/24301453/everything-announced-at-blizzcon-2026-opening-ceremony" },
        { "nom": "Blizzard — Diablo V, prochaine ère annoncée à BlizzCon", "url": "https://news.blizzard.com/en-us/article/24301509/diablos-next-era-revealed-at-blizzcon-2026-opening-ceremonies-recap" },
        { "nom": "Kotaku — entretien avec Dan Hay sur StarCraft", "url": "https://kotaku.com/ex-far-cry-boss-has-big-ambitions-for-new-starcraft-shooter-if-we-were-to-make-something-that-felt-like-a-deadwood-in-space-i-think-thats-got-something-2000733978" }
      ],
      "commande": "mu1sc7tyth5sp"
    }
  ]
};
