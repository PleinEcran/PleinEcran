#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Récupération de visuels depuis les kits presse éditeurs.

Ce script télécharge UNIQUEMENT les URL que vous inscrivez vous-même dans
presskit.json. Il n'explore pas les sites, ne contourne rien, et refuse
d'enregistrer une image sans crédit renseigné.

Avant d'ajouter une source, vérifiez ses conditions :
  - espaces presse éditeurs (PlayStation, Xbox, Nintendo, Ubisoft, Capcom…),
    souvent sur accréditation gratuite ;
  - dossiers presskit() des studios indépendants, licence d'usage éditorial
    généralement explicite ;
  - pages boutique officielles (Steam, itch.io), visuels destinés à la reprise.
Les conditions de chaque éditeur priment sur l'usage courant du secteur.

Usage :
    pip install pillow
    python3 fetch_presskit.py

Entrée  : presskit.json
Sorties : assets/img/covers/<slug>.jpg
          assets/img/credits.json   (crédit + URL d'origine + date de collecte)
          un extrait à coller dans assets/js/data.js
"""

import json
import pathlib
import sys
import urllib.request
from datetime import date
from io import BytesIO

try:
    from PIL import Image
except ImportError:
    sys.exit("Pillow manquant. Installez-le avec : pip install pillow")

RACINE = pathlib.Path(__file__).parent
CONFIG = RACINE / "presskit.json"
DOSSIER = RACINE / "assets" / "img" / "covers"
CREDITS = RACINE / "assets" / "img" / "credits.json"

LARGEUR = 1200          # largeur cible ; hauteur calculée sur le ratio 16/9
QUALITE = 82
AGENT = "PleinEcran/1.0 (presse ; contact redaction@plein-ecran.fr)"

GABARIT = """{
  "images": [
    {
      "slug": "nom-du-jeu",
      "url": "https://presse.exemple.com/jeu/keyart.png",
      "credit": "Image : nom de l'éditeur",
      "source": "https://presse.exemple.com/jeu/",
      "licence": "Kit presse, usage éditorial autorisé"
    }
  ]
}
"""


def recadrer(image):
    """Recadre au ratio 16/9 en gardant le centre, puis redimensionne."""
    cible = 16 / 9
    l, h = image.size
    if l / h > cible:
        nouvelle_l = int(h * cible)
        gauche = (l - nouvelle_l) // 2
        image = image.crop((gauche, 0, gauche + nouvelle_l, h))
    else:
        nouvelle_h = int(l / cible)
        haut = (h - nouvelle_h) // 2
        image = image.crop((0, haut, l, haut + nouvelle_h))
    return image.resize((LARGEUR, int(LARGEUR / cible)), Image.LANCZOS)


def main():
    if not CONFIG.exists():
        CONFIG.write_text(GABARIT, encoding="utf-8")
        print(f"{CONFIG.name} créé. Remplissez-le puis relancez le script.")
        return 0

    config = json.loads(CONFIG.read_text(encoding="utf-8"))
    DOSSIER.mkdir(parents=True, exist_ok=True)
    credits = json.loads(CREDITS.read_text(encoding="utf-8")) if CREDITS.exists() else {}
    reussies = []

    for entree in config.get("images", []):
        slug = entree.get("slug", "").strip()
        url = entree.get("url", "").strip()
        credit = entree.get("credit", "").strip()

        if not (slug and url):
            print("  entrée ignorée : slug ou url manquant", file=sys.stderr)
            continue
        if not credit:
            print(f"  {slug} : refusé, crédit obligatoire", file=sys.stderr)
            continue

        try:
            requete = urllib.request.Request(url, headers={"User-Agent": AGENT})
            with urllib.request.urlopen(requete, timeout=30) as reponse:
                donnees = reponse.read()
            image = Image.open(BytesIO(donnees)).convert("RGB")
            chemin = DOSSIER / f"{slug}.jpg"
            recadrer(image).save(chemin, "JPEG", quality=QUALITE, optimize=True)
        except Exception as erreur:
            print(f"  {slug} : échec ({erreur.__class__.__name__}: {erreur})", file=sys.stderr)
            continue

        credits[slug] = {
            "credit": credit,
            "source": entree.get("source", url),
            "licence": entree.get("licence", "non précisée"),
            "collecte": date.today().isoformat(),
        }
        reussies.append((slug, credit))
        print(f"  {slug} : {chemin.relative_to(RACINE)} ({chemin.stat().st_size // 1024} Ko)")

    CREDITS.write_text(json.dumps(credits, ensure_ascii=False, indent=2), encoding="utf-8")

    if reussies:
        print("\nÀ reporter dans les articles concernés de assets/js/data.js :\n")
        for slug, credit in reussies:
            print(f'  cover: "assets/img/covers/{slug}.jpg",')
            print(f'  creditImage: "{credit}",\n')
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
