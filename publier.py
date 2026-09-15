#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Publier — bascule les décisions prises dans la console vers le dépôt.

La console (console/console.js) ne fait qu'enregistrer vos clics dans votre
navigateur, puis les synchronise dans console/journal.json si vous avez
renseigné un dépôt et un jeton dans les réglages. Ce script lit ce journal et
console/brouillons.js pour faire le tri mécanique :

  - un brouillon validé ("Valider" dans l'onglet À valider) est affiché en
    entier ici, prêt à être copié dans ARTICLES (assets/js/data.js) — ce
    script ne touche jamais data.js lui-même, l'ajout reste un geste de
    rédaction, pas d'automatisation ;
  - un brouillon refusé est simplement retiré de brouillons.js ;
  - dans les deux cas, la commande d'origine disparaît de la liste, puisque
    la décision a été prise ;
  - les commandes ("Commandes" dans la console) qui n'ont pas encore de
    brouillon sont listées en fin de compte-rendu : c'est le travail de la
    prochaine session de rédaction ;
  - une image écartée ("Écarter" dans l'onglet Images) est supprimée du
    disque et retirée de assets/js/illustrations.js, pour que le dépôt
    n'accumule pas indéfiniment des photos que personne n'a retenues.

Rien n'est écrit à partir de rien : chaque brouillon doit être rédigé à la
main, depuis des sources primaires, avant d'atterrir dans brouillons.js.

Usage :
    python3 publier.py
"""

import json
import pathlib
import sys

# Sur Windows, la console n'est pas en UTF-8 par défaut : sans ça, print()
# plante dès qu'un titre ou une citation contient un caractère hors cp1252
# (accents japonais translittérés, guillemets typographiques…), en plein
# milieu du script, avant que les fichiers aient été réécrits.
if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")

RACINE = pathlib.Path(__file__).parent
JOURNAL = RACINE / "console" / "journal.json"
BROUILLONS = RACINE / "console" / "brouillons.js"
ILLUSTRATIONS = RACINE / "assets" / "js" / "illustrations.js"


def lire_json_js(chemin, cle):
    """Lit un fichier console/*.js du type « const CLE = {...}; » et renvoie l'objet."""
    if not chemin.exists():
        return None
    texte = chemin.read_text(encoding="utf-8")
    debut, fin = texte.find("{"), texte.rfind("}")
    if debut == -1 or fin <= debut:
        return None
    try:
        return json.loads(texte[debut:fin + 1])
    except json.JSONDecodeError as erreur:
        print(f"{chemin.name} illisible : {erreur}", file=sys.stderr)
        return None


def ecrire_brouillons(donnees):
    BROUILLONS.write_text(
        "/* Brouillons d'articles en cours de rédaction, un par commande retenue.\n"
        "   Rempli à la main pendant les sessions de rédaction : chaque entrée suit le\n"
        "   même schéma qu'un article de data.js, avec en plus un champ \"commande\" qui\n"
        "   la relie à la demande d'origine (console/journal.json). Purgé par\n"
        "   publier.py une fois l'article validé ou refusé dans la console — ne pas\n"
        "   laisser traîner un brouillon déjà tranché. */\n"
        "const BROUILLONS = " + json.dumps(donnees, ensure_ascii=False, indent=2) + ";\n",
        encoding="utf-8")


def ecrire_journal(etat):
    JOURNAL.write_text(json.dumps(etat, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")


def ecrire_illustrations(donnees):
    ILLUSTRATIONS.write_text(
        "/* Généré par illustrations.py et steam.py — ne pas modifier à la main.\n"
        "   Chaque entrée porte l'attribution exigée par sa source. */\n"
        "const ILLUSTRATIONS = " + json.dumps(donnees, ensure_ascii=False, indent=2) + ";\n",
        encoding="utf-8")


def nettoyer_images(etat):
    """Supprime du disque et de illustrations.js les candidats que la console
    a écartés (onglet Images), pour que le dépôt n'accumule pas indéfiniment
    des photos que personne n'a retenues."""
    avis_images = {slug: avis for slug, avis in etat.get("images", {}).items()
                   if (avis or {}).get("decision") == "non"}
    if not avis_images:
        return []

    illustrations = lire_json_js(ILLUSTRATIONS, "illustrations")
    if not illustrations:
        return []

    supprimes = []
    modifie = False
    for slug, entree in list(illustrations.items()):
        candidats = entree.get("candidats") or [dict(entree)]
        restants = []
        for rang, candidat in enumerate(candidats, start=1):
            if avis_images.get(f"{slug}-{rang}"):
                chemin = RACINE / candidat["fichier"]
                if chemin.exists():
                    chemin.unlink()
                supprimes.append(candidat["fichier"])
                modifie = True
            else:
                restants.append(candidat)

        if not restants:
            del illustrations[slug]
        elif len(restants) != len(candidats):
            illustrations[slug] = dict(restants[0])
            illustrations[slug]["candidats"] = restants

    if modifie:
        ecrire_illustrations(illustrations)
    return supprimes


def main():
    etat = lire_json_js(JOURNAL, "journal")
    if etat is None:
        print("Aucun console/journal.json : la synchronisation n'est pas configurée")
        print("(Réglages de la console) ou n'a pas encore été envoyée. Rien à publier.")
        return 0

    supprimees = nettoyer_images(etat)
    if supprimees:
        print(f"{len(supprimees)} image(s) écartée(s) supprimée(s) : {', '.join(supprimees)}\n")

    brouillons = lire_json_js(BROUILLONS, "brouillons") or {"articles": []}
    articles = brouillons.get("articles", [])
    avis = etat.get("avis", {})
    commandes = etat.get("commandes", [])

    prets, refuses, en_attente = [], [], []
    commandes_traitees = set()

    for article in articles:
        decision = (avis.get(article.get("slug"), {}) or {}).get("decision")
        if decision == "oui":
            prets.append(article)
            if article.get("commande"):
                commandes_traitees.add(article["commande"])
        elif decision == "non":
            refuses.append(article)
            if article.get("commande"):
                commandes_traitees.add(article["commande"])
        else:
            en_attente.append(article)

    if prets:
        print(f"{len(prets)} article(s) validé(s), prêt(s) à copier dans ARTICLES (assets/js/data.js) :\n")
        for article in prets:
            print("-" * 70)
            print(json.dumps(article, ensure_ascii=False, indent=2))
        print("-" * 70)
        print("\nÀ faire à la main : coller chaque objet ci-dessus dans ARTICLES, le plus")
        print("récent en tête, puis retirer le champ \"commande\" qui ne concerne que ce script.\n")

    if refuses:
        print(f"{len(refuses)} brouillon(s) refusé(s), retiré(s) : "
              + ", ".join(a.get("slug", "?") for a in refuses))

    if en_attente:
        print(f"{len(en_attente)} brouillon(s) en attente de votre décision dans l'onglet « À valider » : "
              + ", ".join(a.get("slug", "?") for a in en_attente))

    a_ecrire = [c for c in commandes
                if c.get("statut") == "demande" and c.get("id") not in commandes_traitees
                and not any(a.get("commande") == c.get("id") for a in en_attente)]

    if a_ecrire:
        print(f"\n{len(a_ecrire)} commande(s) sans brouillon — à écrire à la prochaine session :\n")
        for c in a_ecrire:
            print(f"  [{c.get('id')}] {c.get('titre')}")
            if c.get("note"):
                print(f"      angle : {c['note']}")
            for s in c.get("sources", []):
                print(f"      source citée par la veille : {s.get('source')} — {s.get('url')}")
    elif not prets and not refuses and not en_attente and not supprimees:
        print("Rien à publier, rien en attente, aucune commande non traitée.")

    if prets or refuses:
        articles_restants = en_attente
        if articles_restants != articles:
            brouillons["articles"] = articles_restants
            ecrire_brouillons(brouillons)
        commandes_restantes = [c for c in commandes if c.get("id") not in commandes_traitees]
        if len(commandes_restantes) != len(commandes):
            etat["commandes"] = commandes_restantes
            ecrire_journal(etat)

    return 0


if __name__ == "__main__":
    raise SystemExit(main())
