#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Revue de presse — collecte de flux RSS.

Ce script NE COPIE PAS d'articles. Il récupère, pour chaque source :
titre, date, lien. Rien d'autre. Le lecteur clique et lit chez l'éditeur.
C'est la seule forme d'agrégation défendable : pas de texte repris,
pas de résumé automatique, pas d'image chargée depuis le site source.

Usage :
    python3 build_revue.py

Sortie : assets/js/revue.js  (chargé par revue.html)

Automatisation quotidienne :
    crontab -e  →  30 7 * * *  cd /chemin/du/site && /usr/bin/python3 build_revue.py
ou une action programmée GitHub Actions (voir LISEZMOI.md).
"""

import json
import pathlib
import re
import sys
import urllib.request
from datetime import datetime, timezone
from email.utils import parsedate_to_datetime
from xml.etree import ElementTree as ET

# ---------------------------------------------------------------- configuration

# Ajoutez ou retirez des flux ici. Vérifiez que chaque site autorise la reprise
# de son flux : c'est presque toujours le cas, mais les conditions d'utilisation
# priment sur l'usage courant.
FLUX = [
    ("Eurogamer",              "https://www.eurogamer.net/feed"),
    ("Rock Paper Shotgun",     "https://www.rockpapershotgun.com/feed"),
    ("Game Developer",         "https://www.gamedeveloper.com/rss.xml"),
    ("Nintendo Life",          "https://www.nintendolife.com/feeds/latest"),
    ("Push Square",            "https://www.pushsquare.com/feeds/latest"),
]

MAX_PAR_SOURCE = 8
DELAI = 15  # secondes
SORTIE = pathlib.Path(__file__).parent / "assets" / "js" / "revue.js"
AGENT = "PleinEcran/1.0 (revue de presse ; contact redaction@plein-ecran.fr)"

# ------------------------------------------------------------------- traitement


def nettoyer(texte):
    """Retire le balisage éventuel d'un titre et normalise les espaces."""
    texte = re.sub(r"<[^>]+>", "", texte or "")
    texte = (texte.replace("&amp;", "&").replace("&#39;", "'")
                  .replace("&quot;", '"').replace("&nbsp;", " ")
                  .replace("&lt;", "<").replace("&gt;", ">"))
    return re.sub(r"\s+", " ", texte).strip()


def date_lisible(brut):
    if not brut:
        return ""
    for parseur in (parsedate_to_datetime, datetime.fromisoformat):
        try:
            d = parseur(brut.strip().replace("Z", "+00:00"))
            return d.strftime("%d/%m/%Y")
        except Exception:
            continue
    return ""


def lire_flux(nom, url):
    requete = urllib.request.Request(url, headers={"User-Agent": AGENT})
    with urllib.request.urlopen(requete, timeout=DELAI) as reponse:
        brut = reponse.read()

    racine = ET.fromstring(brut)
    espaces = {"atom": "http://www.w3.org/2005/Atom"}
    entrees = []

    # RSS 2.0
    for item in racine.iter("item"):
        titre = nettoyer(item.findtext("title"))
        lien = (item.findtext("link") or "").strip()
        date = item.findtext("pubDate") or item.findtext("{http://purl.org/dc/elements/1.1/}date")
        if titre and lien:
            entrees.append({"source": nom, "titre": titre, "url": lien, "date": date_lisible(date)})

    # Atom
    if not entrees:
        for item in racine.findall("atom:entry", espaces):
            titre = nettoyer(item.findtext("atom:title", namespaces=espaces))
            maillon = item.find("atom:link", espaces)
            lien = maillon.get("href") if maillon is not None else ""
            date = item.findtext("atom:updated", namespaces=espaces) or \
                   item.findtext("atom:published", namespaces=espaces)
            if titre and lien:
                entrees.append({"source": nom, "titre": titre, "url": lien, "date": date_lisible(date)})

    return entrees[:MAX_PAR_SOURCE]


def main():
    toutes = []
    for nom, url in FLUX:
        try:
            trouvees = lire_flux(nom, url)
            toutes.extend(trouvees)
            print(f"  {nom} : {len(trouvees)} liens")
        except Exception as erreur:
            print(f"  {nom} : échec ({erreur.__class__.__name__}) — source ignorée", file=sys.stderr)

    if not toutes:
        print("Aucun flux récupéré. Fichier inchangé.", file=sys.stderr)
        return 1

    charge = {
        "genere": datetime.now(timezone.utc).astimezone().strftime("%d/%m/%Y à %Hh%M"),
        "entrees": toutes,
    }
    SORTIE.parent.mkdir(parents=True, exist_ok=True)
    SORTIE.write_text(
        "/* Généré par build_revue.py — ne pas modifier à la main. */\n"
        "const REVUE = " + json.dumps(charge, ensure_ascii=False, indent=2) + ";\n",
        encoding="utf-8",
    )
    print(f"\n{len(toutes)} liens écrits dans {SORTIE}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
