#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Veille — collecte toutes les deux heures et détection de l'actualité chaude.

Le principe : une information reprise par plusieurs rédactions en peu de temps
est une information qui compte. C'est un signal mesurable, contrairement au
nombre de vues d'un article chez un confrère, auquel personne n'a accès de
l'extérieur.

Le script récupère les titres des flux, regroupe ceux qui parlent de la même
chose, et calcule une température : nombre de sources distinctes, fraîcheur,
et poids des mots-clés que vous avez définis.

Aucun texte d'article n'est copié : titre, date, lien, rien d'autre.

Usage :
    python3 veille.py

Sorties :
    console/veille.js     lu par la console éditoriale
    code retour 10 si au moins un sujet chaud est apparu depuis la dernière fois
"""

import json
import pathlib
import re
import sys
import unicodedata
import urllib.request
from datetime import datetime, timezone
from email.utils import parsedate_to_datetime
from xml.etree import ElementTree as ET

RACINE = pathlib.Path(__file__).parent
SORTIE = RACINE / "console" / "veille.js"
AGENT = "PleinEcran/1.0 (veille editoriale ; contact redaction@plein-ecran.fr)"
DELAI = 20

FLUX = [
    ("Eurogamer",          "https://www.eurogamer.net/feed"),
    ("Rock Paper Shotgun", "https://www.rockpapershotgun.com/feed"),
    ("Game Developer",     "https://www.gamedeveloper.com/rss.xml"),
    ("Nintendo Life",      "https://www.nintendolife.com/feeds/latest"),
    ("Push Square",        "https://www.pushsquare.com/feeds/latest"),
    ("VGC",                "https://www.videogameschronicle.com/feed/"),
    ("PC Gamer",           "https://www.pcgamer.com/rss/"),
    ("GamesIndustry.biz",  "https://www.gamesindustry.biz/feed"),
]

# Mots qui montent la température. Ajoutez les vôtres.
POIDS = {
    "gta": 3, "nintendo": 2, "switch": 2, "playstation": 2, "xbox": 2, "steam": 2,
    "zelda": 2, "licenciement": 3, "layoff": 3, "fermeture": 3, "closure": 3,
    "rachat": 3, "acquisition": 3, "grève": 3, "strike": 3, "report": 2, "delay": 2,
    "annulé": 3, "cancelled": 3, "procès": 2, "lawsuit": 2, "record": 2,
}

# Mots vides écartés du regroupement
VIDES = set("""the a an of for and to in on with is are new his her its this that
les des une the de la le du au aux et en sur pour par avec dans est sont ce ces
plus tout tous son sa ses qui que quoi dont vous nous ils elles game games jeu
jeux video after before now more just says said report""".split())

SEUIL_CHAUD = 6


def nettoyer(texte):
    texte = re.sub(r"<[^>]+>", "", texte or "")
    for a, b in (("&amp;", "&"), ("&#39;", "'"), ("&quot;", '"'), ("&nbsp;", " "),
                 ("&lt;", "<"), ("&gt;", ">"), ("&#8217;", "'")):
        texte = texte.replace(a, b)
    return re.sub(r"\s+", " ", texte).strip()


def mots_cles(titre):
    sans_accent = "".join(c for c in unicodedata.normalize("NFD", titre.lower())
                          if unicodedata.category(c) != "Mn")
    mots = re.findall(r"[a-z0-9]{3,}", sans_accent)
    return {m for m in mots if m not in VIDES}


def heures_depuis(brut):
    if not brut:
        return 48.0
    for parseur in (parsedate_to_datetime, datetime.fromisoformat):
        try:
            d = parseur(brut.strip().replace("Z", "+00:00"))
            if d.tzinfo is None:
                d = d.replace(tzinfo=timezone.utc)
            return max(0.0, (datetime.now(timezone.utc) - d).total_seconds() / 3600)
        except Exception:
            continue
    return 48.0


def lire_flux(nom, url):
    requete = urllib.request.Request(url, headers={"User-Agent": AGENT})
    with urllib.request.urlopen(requete, timeout=DELAI) as reponse:
        racine = ET.fromstring(reponse.read())

    espaces = {"atom": "http://www.w3.org/2005/Atom"}
    entrees = []

    for item in racine.iter("item"):
        titre = nettoyer(item.findtext("title"))
        lien = (item.findtext("link") or "").strip()
        date = item.findtext("pubDate") or item.findtext("{http://purl.org/dc/elements/1.1/}date")
        if titre and lien:
            entrees.append({"source": nom, "titre": titre, "url": lien, "age": heures_depuis(date)})

    if not entrees:
        for item in racine.findall("atom:entry", espaces):
            titre = nettoyer(item.findtext("atom:title", namespaces=espaces))
            maillon = item.find("atom:link", espaces)
            lien = maillon.get("href") if maillon is not None else ""
            date = (item.findtext("atom:published", namespaces=espaces)
                    or item.findtext("atom:updated", namespaces=espaces))
            if titre and lien:
                entrees.append({"source": nom, "titre": titre, "url": lien, "age": heures_depuis(date)})

    return [e for e in entrees if e["age"] <= 36][:15]


def regrouper(entrees):
    """Rassemble les titres qui parlent visiblement du même sujet."""
    groupes = []
    for entree in sorted(entrees, key=lambda e: e["age"]):
        cles = mots_cles(entree["titre"])
        if not cles:
            continue
        rattache = False
        for groupe in groupes:
            commun = cles & groupe["cles"]
            if len(commun) >= 2 and len(commun) / min(len(cles), len(groupe["cles"])) >= 0.34:
                groupe["entrees"].append(entree)
                groupe["cles"] |= cles
                rattache = True
                break
        if not rattache:
            groupes.append({"cles": cles, "entrees": [entree]})
    return groupes


def temperature(groupe):
    sources = {e["source"] for e in groupe["entrees"]}
    plus_recent = min(e["age"] for e in groupe["entrees"])
    score = len(sources) * 3
    if plus_recent <= 4:
        score += 3
    elif plus_recent <= 12:
        score += 1
    texte = " ".join(e["titre"].lower() for e in groupe["entrees"])
    score += sum(poids for mot, poids in POIDS.items() if mot in texte)
    return score


def main():
    entrees = []
    for nom, url in FLUX:
        try:
            trouvees = lire_flux(nom, url)
            entrees.extend(trouvees)
            print(f"  {nom} : {len(trouvees)}")
        except Exception as erreur:
            print(f"  {nom} : ignoré ({erreur.__class__.__name__})", file=sys.stderr)

    if not entrees:
        print("Aucun flux récupéré, fichier inchangé.", file=sys.stderr)
        return 1

    sujets = []
    for groupe in regrouper(entrees):
        principal = min(groupe["entrees"], key=lambda e: e["age"])
        sources = sorted({e["source"] for e in groupe["entrees"]})
        sujets.append({
            "id": re.sub(r"[^a-z0-9]+", "-", principal["titre"].lower())[:60].strip("-"),
            "titre": principal["titre"],
            "url": principal["url"],
            "sources": sources,
            "reprises": len(groupe["entrees"]),
            "heures": round(principal["age"], 1),
            "chaleur": temperature(groupe),
            "liens": [{"source": e["source"], "url": e["url"], "titre": e["titre"]}
                      for e in groupe["entrees"][:6]],
        })

    sujets.sort(key=lambda s: (-s["chaleur"], s["heures"]))

    anciens_chauds = set()
    if SORTIE.exists():
        try:
            texte = SORTIE.read_text(encoding="utf-8")
            ancien = json.loads(texte[texte.find("{"):texte.rfind("}") + 1])
            anciens_chauds = {s["id"] for s in ancien.get("sujets", [])
                              if s.get("chaleur", 0) >= SEUIL_CHAUD}
        except Exception:
            pass

    chauds = [s for s in sujets if s["chaleur"] >= SEUIL_CHAUD]
    nouveaux = [s for s in chauds if s["id"] not in anciens_chauds]

    charge = {
        "collecte": datetime.now(timezone.utc).astimezone().strftime("%d/%m/%Y à %Hh%M"),
        "seuil": SEUIL_CHAUD,
        "sujets": sujets[:60],
        "alertes": [s["titre"] for s in nouveaux],
    }
    SORTIE.parent.mkdir(parents=True, exist_ok=True)
    SORTIE.write_text(
        "/* Généré par veille.py — ne pas modifier à la main. */\n"
        "const VEILLE = " + json.dumps(charge, ensure_ascii=False, indent=2) + ";\n",
        encoding="utf-8")

    print(f"\n{len(sujets)} sujets, dont {len(chauds)} chauds, {len(nouveaux)} nouveaux.")
    for s in nouveaux[:5]:
        print(f"  [{s['chaleur']}] {s['titre'][:80]}  ({', '.join(s['sources'])})")

    return 10 if nouveaux else 0


if __name__ == "__main__":
    raise SystemExit(main())
