/* Brouillons d'articles en cours de rédaction, un par commande retenue.
   Rempli à la main pendant les sessions de rédaction : chaque entrée suit le
   même schéma qu'un article de data.js, avec en plus un champ "commande" qui
   la relie à la demande d'origine (console/journal.json). Purgé par
   publier.py une fois l'article validé ou refusé dans la console — ne pas
   laisser traîner un brouillon déjà tranché. */
const BROUILLONS = {
  "articles": []
};
