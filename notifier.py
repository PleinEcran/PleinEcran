#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Courriel de validation avant publication.

Lit les articles les plus récents de data.js et envoie un message récapitulatif
à l'adresse de validation, avec le lien qui permet d'approuver ou de refuser la
mise en ligne.

Aucun identifiant n'est écrit dans ce fichier. Ils sont lus dans
l'environnement, et sur GitHub ils viennent des secrets du dépôt :
    MAIL_EXPEDITEUR    adresse d'envoi (ex. votreadresse@gmail.com)
    MAIL_MOTDEPASSE    mot de passe d'application, jamais le mot de passe du compte
    MAIL_DESTINATAIRE  adresse qui reçoit la validation
    LIEN_VALIDATION    (optionnel) URL de la page d'approbation

Usage :
    python3 notifier.py            # les 3 articles les plus récents
    python3 notifier.py 5          # les 5 plus récents
"""

import os
import re
import pathlib
import smtplib
import sys
from email.message import EmailMessage

RACINE = pathlib.Path(__file__).parent
DATA = RACINE / "assets" / "js" / "data.js"

SERVEUR = os.environ.get("MAIL_SERVEUR", "smtp.gmail.com")
PORT = int(os.environ.get("MAIL_PORT", "465"))


def derniers_articles(nombre):
    """Extrait slug, titre, chapô et date des articles les plus récents."""
    texte = DATA.read_text(encoding="utf-8")
    blocs = re.findall(
        r'slug:\s*"([^"]+)".*?titre:\s*"((?:[^"\\]|\\.)*)".*?'
        r'chapo:\s*"((?:[^"\\]|\\.)*)".*?date:\s*"([^"]+)"',
        texte, re.S)
    articles = [{"slug": s, "titre": t.replace('\\"', '"'),
                 "chapo": c.replace('\\"', '"'), "date": d} for s, t, c, d in blocs]
    articles.sort(key=lambda a: a["date"], reverse=True)
    return articles[:nombre]


def composer(articles, lien):
    corps = ["Articles en attente de votre validation.", ""]
    html = ["<div style=\"font-family:system-ui,sans-serif;max-width:640px\">",
            "<p>Articles en attente de votre validation.</p>"]

    for a in articles:
        corps += [f"— {a['titre']} ({a['date']})", f"  {a['chapo']}", ""]
        html += [
            f"<div style=\"border-left:4px solid #FF3D2E;padding:4px 0 4px 14px;margin:18px 0\">",
            f"<p style=\"margin:0 0 4px;font-weight:700;font-size:17px\">{a['titre']}</p>",
            f"<p style=\"margin:0 0 6px;color:#555\">{a['chapo']}</p>",
            f"<p style=\"margin:0;color:#888;font-size:13px\">{a['date']} · {a['slug']}</p>",
            "</div>"]

    if lien:
        corps += ["", "Approuver ou refuser la mise en ligne :", lien]
        html += [f"<p style=\"margin:26px 0\"><a href=\"{lien}\" "
                 "style=\"background:#FF3D2E;color:#fff;padding:12px 20px;"
                 "border-radius:3px;text-decoration:none;font-weight:700\">"
                 "Approuver ou refuser</a></p>"]

    corps += ["", "Rien n'est publié tant que vous n'avez pas répondu."]
    html += ["<p style=\"color:#888;font-size:13px\">Rien n'est publié tant que "
             "vous n'avez pas répondu.</p></div>"]
    return "\n".join(corps), "\n".join(html)


def alertes_veille():
    """Sujets chauds détectés par la dernière collecte."""
    fichier = RACINE / "console" / "veille.js"
    if not fichier.exists():
        return []
    import json
    texte = fichier.read_text(encoding="utf-8")
    try:
        donnees = json.loads(texte[texte.find("{"):texte.rfind("}") + 1])
    except Exception:
        return []
    titres = donnees.get("alertes", [])
    chauds = {s["titre"]: s for s in donnees.get("sujets", [])}
    return [{"slug": chauds.get(t, {}).get("id", ""), "titre": t,
             "chapo": "Repris par " + ", ".join(chauds.get(t, {}).get("sources", [])) + ".",
             "date": donnees.get("collecte", "")} for t in titres]


def main():
    if "--alerte" in sys.argv:
        return envoyer(alertes_veille(), "Actu chaude", os.environ.get("LIEN_CONSOLE", ""))

    nombre = int(sys.argv[1]) if len(sys.argv) > 1 and sys.argv[1].isdigit() else 3

    lien = os.environ.get("LIEN_VALIDATION", "")
    return envoyer(derniers_articles(nombre), "À valider", lien)


def envoyer(articles, prefixe, lien):
    expediteur = os.environ.get("MAIL_EXPEDITEUR")
    motdepasse = os.environ.get("MAIL_MOTDEPASSE")
    destinataire = os.environ.get("MAIL_DESTINATAIRE")

    manquants = [n for n, v in (("MAIL_EXPEDITEUR", expediteur),
                                ("MAIL_MOTDEPASSE", motdepasse),
                                ("MAIL_DESTINATAIRE", destinataire)) if not v]
    if manquants:
        print("Identifiants absents : " + ", ".join(manquants), file=sys.stderr)
        return 1
    if not articles:
        print("Rien à signaler, aucun courriel envoyé.")
        return 0

    message = EmailMessage()
    titre = articles[0]["titre"]
    message["Subject"] = f"{prefixe} : {titre[:60]}" + (f" et {len(articles)-1} autre(s)" if len(articles) > 1 else "")
    message["From"] = expediteur
    message["To"] = destinataire
    texte, html = composer(articles, lien)
    message.set_content(texte)
    message.add_alternative(html, subtype="html")

    with smtplib.SMTP_SSL(SERVEUR, PORT, timeout=30) as serveur:
        serveur.login(expediteur, motdepasse)
        serveur.send_message(message)

    print(f"Courriel envoyé à {destinataire} — {len(articles)} article(s).")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
