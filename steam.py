#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Visuels officiels déposés par les éditeurs sur Steam.

Ce que fait le script :
  1. lit le champ « jeu » de chaque article dans data.js ;
  2. demande à Steam l'identifiant correspondant à ce nom — vous n'avez donc
     aucun numéro à relever vous-même ;
  3. vérifie que le nom trouvé correspond bien à celui demandé ;
  4. récupère la jaquette et deux captures officielles de la fiche du jeu ;
  5. les ajoute aux propositions visibles dans la console, créditées à l'éditeur.

Ce sont les visuels que l'éditeur a lui-même déposés sur sa page boutique pour
qu'ils soient diffusés. Ils s'emploient pour illustrer un article qui parle du
jeu, avec le crédit affiché. Le script ne va chercher aucune image ailleurs.

Usage :
    python3 steam.py                 # tous les articles ayant un champ « jeu »
    python3 steam.py zelda-40-ocarina

Sortie : assets/img/photos/<slug>-steam-N.jpg
         assets/js/illustrations.js  (propositions fusionnées avec Wikimedia)
"""

import json
import pathlib
import re
import sys
import unicodedata
import urllib.parse
import urllib.request

RACINE = pathlib.Path(__file__).parent
DATA = RACINE / "assets" / "js" / "data.js"
BROUILLONS = RACINE / "console" / "brouillons.js"
DOSSIER = RACINE / "assets" / "img" / "photos"
SORTIE = RACINE / "assets" / "js" / "illustrations.js"

RECHERCHE = "https://store.steampowered.com/api/storesearch/"
FICHE = "https://store.steampowered.com/api/appdetails"
AGENT = "PleinEcran/1.0 (site de presse jeu video ; contact redaction@plein-ecran.fr)"

CAPTURES = 2          # nombre de captures récupérées en plus de la jaquette
SEUIL_RESSEMBLANCE = 0.6


def simplifier(texte):
    texte = "".join(c for c in unicodedata.normalize("NFD", (texte or "").lower())
                    if unicodedata.category(c) != "Mn")
    return re.sub(r"[^a-z0-9]+", " ", texte).strip()


def ressemblance(demande, trouve):
    """Part des mots demandés que l'on retrouve dans le nom proposé par Steam."""
    a, b = set(simplifier(demande).split()), set(simplifier(trouve).split())
    if not a:
        return 0.0
    return len(a & b) / len(a)


def appel(url, parametres=None, binaire=False):
    if parametres:
        url += "?" + urllib.parse.urlencode(parametres)
    requete = urllib.request.Request(url, headers={"User-Agent": AGENT})
    with urllib.request.urlopen(requete, timeout=30) as reponse:
        donnees = reponse.read()
    return donnees if binaire else json.loads(donnees.decode("utf-8"))


def articles_avec_jeu(filtres):
    """Extrait slug et nom de jeu des articles qui en déclarent un — publiés
    dans data.js, ou encore à l'état de brouillon dans console/brouillons.js."""
    texte = DATA.read_text(encoding="utf-8")
    blocs = re.findall(r'slug:\s*"([^"]+)"(.*?)(?=\n  \{|\n\];)', texte, re.S)
    trouves = []
    for slug, corps in blocs:
        if filtres and slug not in filtres:
            continue
        jeu = re.search(r'jeu:\s*"([^"]+)"', corps)
        if jeu:
            trouves.append((slug, jeu.group(1)))

    if BROUILLONS.exists():
        brut = BROUILLONS.read_text(encoding="utf-8")
        debut, fin = brut.find("{"), brut.rfind("}")
        try:
            donnees = json.loads(brut[debut:fin + 1]) if debut != -1 and fin > debut else {}
        except json.JSONDecodeError:
            donnees = {}
        for article in donnees.get("articles", []):
            slug, jeu = article.get("slug"), article.get("jeu")
            if slug and jeu and (not filtres or slug in filtres):
                trouves.append((slug, jeu))

    return trouves


def identifiant_steam(nom):
    """Résout un nom de jeu en identifiant Steam, sans intervention manuelle."""
    donnees = appel(RECHERCHE, {"term": nom, "l": "french", "cc": "fr"})
    meilleurs = []
    for element in donnees.get("items", []):
        score = ressemblance(nom, element.get("name", ""))
        meilleurs.append((score, element.get("id"), element.get("name", "")))
    meilleurs.sort(reverse=True)
    if not meilleurs or meilleurs[0][0] < SEUIL_RESSEMBLANCE:
        return None, None, (meilleurs[0][2] if meilleurs else "")
    return meilleurs[0][1], meilleurs[0][2], ""


def visuels(identifiant):
    donnees = appel(FICHE, {"appids": identifiant, "l": "french", "cc": "fr"})
    fiche = (donnees.get(str(identifiant)) or {})
    if not fiche.get("success"):
        return None
    corps = fiche.get("data", {})
    editeurs = corps.get("publishers") or corps.get("developers") or []
    images = []
    if corps.get("header_image"):
        images.append(corps["header_image"])
    for capture in (corps.get("screenshots") or [])[:CAPTURES]:
        if capture.get("path_full"):
            images.append(capture["path_full"])
    return {
        "nom": corps.get("name", ""),
        "editeur": editeurs[0] if editeurs else "éditeur non précisé",
        "page": f"https://store.steampowered.com/app/{identifiant}/",
        "images": images,
    }


def lire_existant():
    if not SORTIE.exists():
        return {}
    texte = SORTIE.read_text(encoding="utf-8")
    debut, fin = texte.find("{"), texte.rfind("}")
    if debut == -1 or fin <= debut:
        return {}
    try:
        return json.loads(texte[debut:fin + 1])
    except json.JSONDecodeError:
        return {}


def main():
    filtres = [a for a in sys.argv[1:] if not a.startswith("-")]
    articles = articles_avec_jeu(filtres)

    if not articles:
        print("Aucun article ne déclare de champ « jeu » dans data.js.")
        print('Ajoutez par exemple :  jeu: "Hollow Knight Silksong",')
        return 0

    resultats = lire_existant()
    DOSSIER.mkdir(parents=True, exist_ok=True)
    total = 0

    for slug, nom in articles:
        print(f"\n  {slug} — « {nom} »")
        try:
            identifiant, nom_steam, approchant = identifiant_steam(nom)
        except Exception as erreur:
            print(f"      recherche impossible ({erreur.__class__.__name__})")
            continue

        if not identifiant:
            print(f"      aucune correspondance fiable sur Steam"
                  + (f" (le plus proche : {approchant})" if approchant else ""))
            continue
        print(f"      identifié : {nom_steam} — {identifiant}")

        try:
            fiche = visuels(identifiant)
        except Exception as erreur:
            print(f"      fiche illisible ({erreur.__class__.__name__})")
            continue
        if not fiche or not fiche["images"]:
            print("      aucun visuel sur la fiche")
            continue

        candidats = []
        for rang, url in enumerate(fiche["images"], start=1):
            nom_fichier = f"{slug}-steam-{rang}.jpg"
            try:
                (DOSSIER / nom_fichier).write_bytes(appel(url, binaire=True))
            except Exception as erreur:
                print(f"      visuel {rang} : échec ({erreur.__class__.__name__})")
                continue
            candidats.append({
                "fichier": f"assets/img/photos/{nom_fichier}",
                "credit": f"Image : {fiche['editeur']}, via Steam",
                "lien": fiche["page"],
                "licence": "Visuel promotionnel de l'éditeur, usage éditorial",
                "nom": f"Steam {identifiant} — visuel {rang}",
            })

        if not candidats:
            continue

        # les visuels officiels passent devant les photographies Wikimedia
        anciens = resultats.get(slug, {}).get("candidats", [])
        anciens = [c for c in anciens if "steam" not in c.get("fichier", "")]
        fusion = candidats + anciens

        resultats[slug] = dict(fusion[0])
        resultats[slug]["candidats"] = fusion
        total += len(candidats)
        print(f"      {len(candidats)} visuel(s) officiel(s) récupéré(s)")

    SORTIE.write_text(
        "/* Généré par illustrations.py et steam.py — ne pas modifier à la main.\n"
        "   Chaque entrée porte l'attribution exigée par sa source. */\n"
        "const ILLUSTRATIONS = " + json.dumps(resultats, ensure_ascii=False, indent=2) + ";\n",
        encoding="utf-8")

    print(f"\n{total} visuel(s) officiel(s) ajouté(s). À juger dans la console.")
    print("Crédit obligatoire à l'éditeur : il s'affiche automatiquement sous l'image.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
