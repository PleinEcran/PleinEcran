#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Illustrations libres de droits — Wikimedia Commons.

Aucune dépendance à installer : uniquement la bibliothèque standard de Python.
Le recadrage en 16/9 est fait par la feuille de style du site, pas ici.

Le script interroge l'API de Commons, LIT LA LICENCE DE CHAQUE FICHIER et
refuse tout ce qui n'est pas librement réutilisable, y compris commercialement.
Il télécharge ensuite une version de 1200 px de large et écrit l'attribution
exigée par la licence : auteur, licence, lien vers le fichier d'origine.

Ce qu'il ne fera jamais : récupérer une capture de jeu, une jaquette ou un
visuel promotionnel. Ces images appartiennent à leurs éditeurs et ne sont
jamais sous licence libre. Pour celles-là, passez par fetch_presskit.py.

Trois façons de le lancer :
  - double-clic sur illustrations.command (Mac) ou illustrations.bat (Windows)
  - onglet Actions de GitHub, workflow « illustrations »
  - en ligne de commande : python3 illustrations.py [slug]

Sorties :
    assets/img/photos/<slug>.<ext>
    assets/js/illustrations.js   (lu automatiquement par le site)
"""

import json
import pathlib
import re
import sys
import urllib.parse
import urllib.request

RACINE = pathlib.Path(__file__).parent
DOSSIER = RACINE / "assets" / "img" / "photos"
SORTIE = RACINE / "assets" / "js" / "illustrations.js"
API = "https://commons.wikimedia.org/w/api.php"
AGENT = "PleinEcran/1.0 (site de presse jeu video ; contact redaction@plein-ecran.fr)"
LARGEUR = 1200

# Licences acceptées. Tout le reste est rejeté, y compris les mentions
# non commerciales (NC) et sans modification (ND).
LICENCES_OK = (
    "cc0", "cc-zero", "public domain", "pd-", "pd ", "cc by 2", "cc by 3", "cc by 4",
    "cc by-sa 2", "cc by-sa 3", "cc by-sa 4",
)
LICENCES_INTERDITES = ("nc", "nd", "fair use", "non-free")

# ---------------------------------------------------------------------------
# PRIORITÉ 1 — fichier choisi à la main.
# Le moyen le plus sûr d'avoir une image pertinente : coller ici le nom exact
# d'un fichier Commons. Trouvez-le avec :  python3 illustrations.py --choix slug
# Exemple : "warren-spector": "File:Warren Spector - Game Developers Conference 2017 - 01.jpg"
FICHIERS = {
}

# PRIORITÉ 2 — recherches, de la plus précise à la plus générique.
# Le script s'arrête à la première qui donne un résultat libre et exploitable.
# Écrivez en anglais : le fonds de Commons y est beaucoup plus fourni.
SUJETS = {
    "zelda-40-ocarina": [
        "Nintendo Switch 2 console",
        "Nintendo Museum Kyoto",
        "ocarina instrument",
        "Nintendo 64 console",
    ],
    "oot-encore-jouable": [
        "ocarina instrument",
        "Nintendo 64 controller",
        "Nintendo 64 console",
    ],
    "horizon-hunters": [
        "Guerrilla Games",
        "PlayStation 5 DualSense controller",
        "PlayStation 5 console",
    ],
    "warren-spector": [
        "Warren Spector",
        "Game Developers Conference 2017",
    ],
    "calendrier-sept": [
        "video game store shelf",
        "video game retail shop",
        "game shop interior",
    ],
    "jeton-live-service": [
        "arcade coin slot",
        "arcade token",
        "arcade cabinet",
    ],
}

def nettoyer_html(texte):
    texte = re.sub(r"<[^>]+>", "", texte or "")
    for avant, apres in (("&amp;", "&"), ("&#160;", " "), ("&quot;", '"'), ("&#39;", "'")):
        texte = texte.replace(avant, apres)
    return re.sub(r"\s+", " ", texte).strip()


def appel_api(parametres):
    url = API + "?" + urllib.parse.urlencode(parametres)
    requete = urllib.request.Request(url, headers={"User-Agent": AGENT})
    with urllib.request.urlopen(requete, timeout=30) as reponse:
        return json.loads(reponse.read().decode("utf-8"))


def licence_acceptee(nom):
    n = (nom or "").strip().lower()
    if not n:
        return False
    if any(mot in n for mot in LICENCES_INTERDITES):
        return False
    return any(n.startswith(ok) or ok in n for ok in LICENCES_OK)


def chercher(requete):
    """Renvoie la meilleure image libre et exploitable en paysage."""
    donnees = appel_api({
        "action": "query", "format": "json", "generator": "search",
        "gsrsearch": f"filetype:bitmap {requete}", "gsrnamespace": "6", "gsrlimit": "30",
        "prop": "imageinfo", "iiprop": "url|extmetadata|size", "iiurlwidth": str(LARGEUR),
    })
    pages = (donnees.get("query") or {}).get("pages") or {}
    candidats = []

    for page in pages.values():
        infos = (page.get("imageinfo") or [{}])[0]
        meta = infos.get("extmetadata") or {}
        licence = nettoyer_html((meta.get("LicenseShortName") or {}).get("value"))
        if not licence_acceptee(licence):
            continue

        largeur, hauteur = infos.get("width", 0), infos.get("height", 0)
        if largeur < 1000 or hauteur == 0 or largeur / hauteur < 1.15:
            continue  # il faut du paysage, le site recadre en 16/9

        candidats.append({
            "titre": page.get("title", "")[5:],
            "url": infos.get("thumburl") or infos.get("url"),
            "page": infos.get("descriptionurl", ""),
            "auteur": (nettoyer_html((meta.get("Artist") or {}).get("value")) or "Auteur non précisé")[:90],
            "licence": licence,
            "largeur": largeur,
        })

    candidats.sort(key=lambda c: -c["largeur"])
    return candidats[0] if candidats else None


def fiche_fichier(titre):
    """Métadonnées d'un fichier Commons désigné par son nom exact."""
    donnees = appel_api({
        "action": "query", "format": "json", "titles": titre,
        "prop": "imageinfo", "iiprop": "url|extmetadata|size", "iiurlwidth": str(LARGEUR),
    })
    pages = (donnees.get("query") or {}).get("pages") or {}
    for page in pages.values():
        if "missing" in page:
            continue
        infos = (page.get("imageinfo") or [{}])[0]
        meta = infos.get("extmetadata") or {}
        licence = nettoyer_html((meta.get("LicenseShortName") or {}).get("value"))
        if not licence_acceptee(licence):
            print(f"      licence refusée : {licence or 'inconnue'}")
            return None
        return {
            "titre": page.get("title", "")[5:],
            "url": infos.get("thumburl") or infos.get("url"),
            "page": infos.get("descriptionurl", ""),
            "auteur": (nettoyer_html((meta.get("Artist") or {}).get("value")) or "Auteur non précisé")[:90],
            "licence": licence,
            "largeur": infos.get("width", 0),
        }
    return None


def proposer(slug, requetes):
    """Affiche les candidats libres pour un article, à choisir à la main."""
    print(f"Candidats libres pour « {slug} » :\n")
    vus = set()
    for requete in requetes:
        print(f"  Recherche : {requete}")
        try:
            donnees = appel_api({
                "action": "query", "format": "json", "generator": "search",
                "gsrsearch": f"filetype:bitmap {requete}", "gsrnamespace": "6", "gsrlimit": "30",
                "prop": "imageinfo", "iiprop": "url|extmetadata|size", "iiurlwidth": str(LARGEUR),
            })
        except Exception as erreur:
            print(f"    échec ({erreur.__class__.__name__})")
            continue
        pages = (donnees.get("query") or {}).get("pages") or {}
        trouves = 0
        for page in pages.values():
            infos = (page.get("imageinfo") or [{}])[0]
            meta = infos.get("extmetadata") or {}
            licence = nettoyer_html((meta.get("LicenseShortName") or {}).get("value"))
            largeur, hauteur = infos.get("width", 0), infos.get("height", 0)
            if not licence_acceptee(licence) or largeur < 1000 or not hauteur:
                continue
            if largeur / hauteur < 1.15 or page.get("title") in vus:
                continue
            vus.add(page.get("title"))
            auteur = (nettoyer_html((meta.get("Artist") or {}).get("value")) or "?")[:60]
            print(f'    "{page.get("title")}"')
            print(f"        {licence} — {auteur} — {largeur} px")
            print(f"        {infos.get('descriptionurl', '')}")
            trouves += 1
            if trouves >= 5:
                break
        print()
    print("Collez le nom entre guillemets dans FICHIERS, en haut du script, puis relancez.")
    return 0


def traiter(slug, requetes, resultats):
    impose = FICHIERS.get(slug)
    if impose:
        try:
            trouve = fiche_fichier(impose)
        except Exception as erreur:
            print(f"  {slug} : fichier imposé illisible ({erreur.__class__.__name__})")
            trouve = None
        if trouve:
            requetes = []
        else:
            print(f"  {slug} : fichier imposé inutilisable, retour à la recherche")
            trouve = None
    else:
        trouve = None

    if trouve:
        return enregistrer(slug, trouve, "fichier choisi à la main", resultats)


    for requete in requetes:
        try:
            trouve = chercher(requete)
        except Exception as erreur:
            print(f"  {slug} : recherche impossible ({erreur.__class__.__name__})")
            return False
        if not trouve:
            continue
        return enregistrer(slug, trouve, requete, resultats)

    print(f"  {slug} : aucune image libre trouvée, l'illustration générée est conservée")
    return False


def enregistrer(slug, trouve, origine, resultats):
        extension = pathlib.Path(urllib.parse.urlparse(trouve["url"]).path).suffix.lower()
        if extension not in (".jpg", ".jpeg", ".png", ".webp"):
            extension = ".jpg"

        try:
            demande = urllib.request.Request(trouve["url"], headers={"User-Agent": AGENT})
            with urllib.request.urlopen(demande, timeout=45) as reponse:
                donnees = reponse.read()
        except Exception as erreur:
            print(f"  {slug} : téléchargement échoué ({erreur.__class__.__name__})")
            return False

        DOSSIER.mkdir(parents=True, exist_ok=True)
        chemin = DOSSIER / f"{slug}{extension}"
        chemin.write_bytes(donnees)

        resultats[slug] = {
            "fichier": f"assets/img/photos/{slug}{extension}",
            "credit": f"Photo : {trouve['auteur']}, {trouve['licence']}, via Wikimedia Commons",
            "lien": trouve["page"],
            "licence": trouve["licence"],
            "recherche": origine,
        }
        print(f"  {slug}")
        print(f"      {trouve['titre']}")
        print(f"      {trouve['licence']} — {trouve['auteur']} — {len(donnees)//1024} Ko")
        return True


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
    options = [a for a in sys.argv[1:] if a.startswith("-")]
    demandes = [a for a in sys.argv[1:] if not a.startswith("-")]

    if "--choix" in options:
        if len(demandes) != 1:
            print("Usage : python3 illustrations.py --choix <slug>")
            return 1
        return proposer(demandes[0], SUJETS.get(demandes[0], []))

    inconnus = [d for d in demandes if d not in SUJETS]
    if inconnus:
        print(f"Slug inconnu : {', '.join(inconnus)}")
        print(f"Disponibles : {', '.join(SUJETS)}")
        return 1

    sujets = {k: v for k, v in SUJETS.items() if not demandes or k in demandes}
    resultats = lire_existant()

    print(f"Recherche d'illustrations libres pour {len(sujets)} article(s).\n")
    for slug, requetes in sujets.items():
        traiter(slug, requetes, resultats)

    SORTIE.parent.mkdir(parents=True, exist_ok=True)
    SORTIE.write_text(
        "/* Généré par illustrations.py — ne pas modifier à la main.\n"
        "   Chaque entrée porte l'attribution exigée par la licence du fichier.\n"
        "   Pour retirer une image, supprimez son entrée : le site reprend\n"
        "   automatiquement l'illustration générée de l'article. */\n"
        "const ILLUSTRATIONS = " + json.dumps(resultats, ensure_ascii=False, indent=2) + ";\n",
        encoding="utf-8",
    )

    print(f"\n{len(resultats)} illustration(s) en place.")
    print("Ouvrez index.html pour les voir.")
    print("La licence est vérifiée automatiquement ; la pertinence, non : regardez-les avant de publier.")
    return 0


if __name__ == "__main__":
    code = main()
    if sys.stdin.isatty() and sys.platform.startswith("win"):
        input("\nAppuyez sur Entrée pour fermer.")
    raise SystemExit(code)
