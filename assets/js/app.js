/* Plein Écran — logique du site. Tout est rendu côté client à partir de data.js. */

const MOIS = ["janvier","février","mars","avril","mai","juin","juillet","août","septembre","octobre","novembre","décembre"];

const $  = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));

function dateLisible(iso) {
  const d = new Date(iso + "T12:00:00");
  return `${d.getDate()} ${MOIS[d.getMonth()]} ${d.getFullYear()}`;
}

function auteurDe(id) {
  return EQUIPE.find(m => m.id === id);
}

function lienArticle(slug) {
  return `article.html?a=${encodeURIComponent(slug)}`;
}

function classeNote(n) {
  if (n >= 8) return "note-haute";
  if (n >= 6) return "note-moyenne";
  return "note-basse";
}

function libelleNote(n) {
  return (ECHELLE.find(e => n >= e.min) || ECHELLE[ECHELLE.length - 1]).label;
}

function etiquette(rub) {
  const r = RUBRIQUES[rub];
  return `<a class="etiquette etiquette-${r.couleur}" href="tests.html?rubrique=${rub}">${r.nom}</a>`;
}

function noteAffichee(a) {
  if (a.provisoire) return `<span class="note note-moyenne" style="font-size:24px">provisoire</span>`;
  if (a.note === null || a.note === undefined) return "";
  return `<span class="note ${classeNote(a.note)}">${String(a.note).replace(".", ",")}</span>`;
}

const parRubrique  = r => ARTICLES.filter(a => a.rubrique === r);
const plusRecents  = liste => [...liste].sort((a, b) => b.date.localeCompare(a.date));

/* ---------------- Fragments réutilisables ---------------- */

function visuelDe(a) {
  const libre = (typeof ILLUSTRATIONS !== "undefined") ? ILLUSTRATIONS[a.slug] : null;
  if (libre && libre.fichier) {
    return { src: libre.fichier, credit: libre.credit, lien: libre.lien };
  }
  return { src: a.cover, credit: a.creditImage || "", lien: "" };
}

function jourCourt(iso) {
  const d = new Date(iso + "T12:00:00");
  return `${String(d.getDate()).padStart(2, "0")} ${MOIS[d.getMonth()].slice(0, 4)}`;
}

function chipsPlateformes(a) {
  return (a.plateformes && a.plateformes.length)
    ? `<span class="plateformes">${a.plateformes.map(p => `<span class="plateforme">${p}</span>`).join("")}</span>`
    : "";
}

function entreeFil(a) {
  const m = auteurDe(a.auteur);
  return `
  <article class="fil-entree">
    <p class="fil-heure">${jourCourt(a.date)}${a.heure ? `<br>${a.heure}` : ""}</p>
    <a href="${lienArticle(a.slug)}" tabindex="-1" aria-hidden="true"><img src="${visuelDe(a).src}" alt=""></a>
    <div>
      ${etiquette(a.rubrique)}${a.format ? `<span class="format-rubrique">${a.format}</span>` : ""}
      <h3><a href="${lienArticle(a.slug)}">${a.titre}</a></h3>
      <p>${a.chapo}</p>
      <div class="fil-meta">
        <span class="signature">${m.nom}, ${a.lecture} min de lecture</span>
        ${chipsPlateformes(a)}
      </div>
    </div>
  </article>`;
}

function carte(a) {
  return `
  <article class="carte">
    <a href="${lienArticle(a.slug)}" tabindex="-1" aria-hidden="true"><img src="${visuelDe(a).src}" alt=""></a>
    ${etiquette(a.rubrique)}${a.format ? `<span class="format-rubrique">${a.format}</span>` : ""}
    <h3><a href="${lienArticle(a.slug)}">${a.titre}</a></h3>
    <p>${a.chapo}</p>
    <p class="signature">${dateLisible(a.date)}, ${a.lecture} min de lecture</p>
  </article>`;
}

function ligneTest(a) {
  const m = auteurDe(a.auteur);
  return `
  <article class="ligne-test">
    <a href="${lienArticle(a.slug)}" tabindex="-1" aria-hidden="true"><img src="${visuelDe(a).src}" alt=""></a>
    <div>
      ${etiquette(a.rubrique)}
      <h3 class="ligne-titre"><a href="${lienArticle(a.slug)}">${a.titre}</a></h3>
      <p class="ligne-chapo">${a.chapo}</p>
      <p class="signature">${m.nom}, ${dateLisible(a.date)}${a.plateformes.length ? ". Testé sur " + a.plateformes.join(", ") : ""}</p>
    </div>
    <div class="ligne-note">
      ${noteAffichee(a)}
      ${a.note != null ? `<small>${libelleNote(a.note)}</small>` : (a.provisoire ? "<small>accès anticipé</small>" : "")}
    </div>
  </article>`;
}

function blocDossier(a) {
  const m = auteurDe(a.auteur);
  return `
  <article class="dossier">
    <a href="${lienArticle(a.slug)}" tabindex="-1" aria-hidden="true"><img src="${visuelDe(a).src}" alt=""></a>
    <div>
      ${etiquette(a.rubrique)}
      <h3><a href="${lienArticle(a.slug)}">${a.titre}</a></h3>
      <p>${a.chapo}</p>
      <p class="signature">${m.nom}, ${dateLisible(a.date)}, ${a.lecture} min de lecture</p>
    </div>
  </article>`;
}

function itemActu(a) {
  return `
  <li>
    ${etiquette(a.rubrique)}
    <h4><a href="${lienArticle(a.slug)}">${a.titre}</a></h4>
    <p>${dateLisible(a.date)}, par ${auteurDe(a.auteur).nom}</p>
  </li>`;
}

function carteMembre(m) {
  return `
  <article class="membre">
    <img src="${m.photo}" alt="Portrait illustré de ${m.nom}">
    <div class="membre-corps">
      <h3>${m.nom}</h3>
      <p class="membre-role">${m.role}</p>
      <p>${m.accroche}</p>
      <div class="membre-specs">${m.specialites.map(s => `<span class="spec">${s}</span>`).join("")}</div>
      <a class="lien-section" href="redaction.html#${m.id}">Sa fiche</a>
    </div>
  </article>`;
}

/* ---------------- En-tête commun ---------------- */

function initEntete() {
  const b = $(".bouton-menu");
  const nav = $(".nav");
  if (!b || !nav) return;
  b.addEventListener("click", () => {
    const ouvert = nav.classList.toggle("ouvert");
    b.setAttribute("aria-expanded", ouvert ? "true" : "false");
    b.textContent = ouvert ? "Fermer" : "Menu";
  });
}

/* ---------------- Compte à rebours du hero ---------------- */

function initCompteur() {
  const chiffre = $("#compteur-chiffre");
  if (!chiffre) return;
  const rejouer = $("#rejouer");
  const doux = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  let timer;

  function lancer() {
    clearInterval(timer);
    if (doux) { chiffre.textContent = "1"; return; }
    let n = 9;
    chiffre.textContent = n;
    timer = setInterval(() => {
      n -= 1;
      chiffre.textContent = n;
      if (n <= 1) clearInterval(timer);
    }, 420);
  }
  lancer();
  if (rejouer) rejouer.addEventListener("click", lancer);
}

/* ---------------- Infolettre ---------------- */

function initInfolettre() {
  const form = $("#form-lettre");
  if (!form) return;
  const champ = $("#courriel");
  const msg = $("#message-lettre");
  form.addEventListener("submit", e => {
    e.preventDefault();
    const v = champ.value.trim();
    const valide = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v);
    msg.className = "message-form " + (valide ? "ok" : "erreur");
    msg.textContent = valide
      ? "Inscription enregistrée. Vous recevrez la prochaine lettre vendredi."
      : "Cette adresse n'a pas le bon format. Vérifiez la partie après l'arobase.";
    if (valide) { form.reset(); champ.blur(); }
    else champ.focus();
  });
}

/* ---------------- Page d'accueil ---------------- */

function initAccueil() {
  const tous = plusRecents(ARTICLES);
  const une = tous.find(a => a.aLaUne) || tous[0];
  const mUne = auteurDe(une.auteur);

  $("#vedette").innerHTML = `
    <a href="${lienArticle(une.slug)}" tabindex="-1" aria-hidden="true"><img src="${visuelDe(une).src}" alt=""></a>
    <div class="vedette-texte">
      ${etiquette(une.rubrique)}
      <h2><a href="${lienArticle(une.slug)}">${une.titre}</a></h2>
      <p>${une.chapo}</p>
      <div class="fil-meta">
        <span class="signature">${mUne.nom}, ${dateLisible(une.date)}, ${une.lecture} min de lecture</span>
        ${chipsPlateformes(une)}
      </div>
    </div>`;

  $("#rail-une").innerHTML = tous.filter(a => a.slug !== une.slug).slice(0, 4).map(a => `
    <article>
      <a href="${lienArticle(a.slug)}" tabindex="-1" aria-hidden="true"><img src="${visuelDe(a).src}" alt=""></a>
      <div>
        ${etiquette(a.rubrique)}
        <h3><a href="${lienArticle(a.slug)}">${a.titre}</a></h3>
        <p class="signature">${dateLisible(a.date)}</p>
      </div>
    </article>`).join("");

  $("#fil-jour").innerHTML = tous.slice(0, 10).map(entreeFil).join("");

  const jeton = plusRecents(parRubrique("jeton"))[0];
  const zoneJeton = $("#jeton");
  if (jeton) {
    zoneJeton.innerHTML = `
      <div class="jeton-bloc">
        <p class="jeton-promesse">${CONCEPTS.jeton.promesse}</p>
        <h3><a href="${lienArticle(jeton.slug)}">${jeton.titre}</a></h3>
        <p>${jeton.chapo}</p>
        <p class="signature">${dateLisible(jeton.date)}, ${jeton.lecture} min de lecture</p>
      </div>`;
  } else {
    zoneJeton.innerHTML = `<div class="jeton-bloc"><p class="jeton-promesse">${CONCEPTS.jeton.promesse}</p><p>Le premier paraît vendredi.</p></div>`;
  }

  const enquetes = plusRecents(parRubrique("enquete")).slice(0, 2);
  $("#enquetes").innerHTML = enquetes.length
    ? enquetes.map(blocDossier).join("")
    : `<p class="section-note">${CONCEPTS.enquete.promesse}</p>`;

  const retros = plusRecents(parRubrique("retro")).slice(0, 3);
  $("#retro").innerHTML = retros.length
    ? retros.map(carte).join("")
    : `<p class="section-note">${CONCEPTS.retro.promesse}</p>`;

  $("#concepts").innerHTML = Object.values(CONCEPTS).map(c => `
    <article class="concept">
      <h3>${c.titre}</h3>
      <p class="concept-promesse">${c.promesse}</p>
      <dl>${c.formats.map(f => `<dt>${f.nom}</dt><dd>${f.detail}</dd>`).join("")}</dl>
    </article>`).join("");
}

/* ---------------- Page tests / tous les articles ---------------- */

function initListe() {
  const conteneur = $("#resultats");
  const compte = $("#compte");
  const fRubrique = $("#f-rubrique");
  const fPlateforme = $("#f-plateforme");
  const fAuteur = $("#f-auteur");
  const fTri = $("#f-tri");
  const fTexte = $("#f-texte");

  EQUIPE.forEach(m => fAuteur.insertAdjacentHTML("beforeend", `<option value="${m.id}">${m.nom}</option>`));
  const plateformes = [...new Set(ARTICLES.flatMap(a => a.plateformes || []))].sort();
  plateformes.forEach(p => fPlateforme.insertAdjacentHTML("beforeend", `<option value="${p}">${p}</option>`));

  const params = new URLSearchParams(location.search);
  if (params.get("rubrique") && RUBRIQUES[params.get("rubrique")]) fRubrique.value = params.get("rubrique");

  function filtrer() {
    let liste = ARTICLES.filter(a => {
      if (fRubrique.value && a.rubrique !== fRubrique.value) return false;
      if (fPlateforme.value && !(a.plateformes || []).includes(fPlateforme.value)) return false;
      if (fAuteur.value && a.auteur !== fAuteur.value) return false;
      const q = fTexte.value.trim().toLowerCase();
      if (q && !(a.titre + " " + a.sousTitre + " " + a.chapo).toLowerCase().includes(q)) return false;
      return true;
    });

    if (fTri.value === "note") liste.sort((a, b) => (b.note ?? -1) - (a.note ?? -1));
    else liste.sort((a, b) => b.date.localeCompare(a.date));

    compte.textContent = liste.length === 0
      ? "Aucun article ne correspond."
      : `${liste.length} article${liste.length > 1 ? "s" : ""} affiché${liste.length > 1 ? "s" : ""}.`;

    conteneur.innerHTML = liste.length
      ? liste.map(ligneTest).join("")
      : `<div class="vide">
           <h3>Rien à cet endroit</h3>
           <p>Élargissez la recherche : retirez la plateforme ou le nom du rédacteur.</p>
           <button class="bouton bouton-creux" id="reinit-vide">Réinitialiser les filtres</button>
         </div>`;

    const rv = $("#reinit-vide");
    if (rv) rv.addEventListener("click", reinit);
  }

  function reinit() {
    fRubrique.value = ""; fPlateforme.value = ""; fAuteur.value = ""; fTexte.value = ""; fTri.value = "date";
    filtrer();
  }

  [fRubrique, fPlateforme, fAuteur, fTri].forEach(c => c.addEventListener("change", filtrer));
  fTexte.addEventListener("input", filtrer);
  $("#reinit").addEventListener("click", reinit);
  filtrer();
}

/* ---------------- Page article ---------------- */

function initArticle() {
  const slug = new URLSearchParams(location.search).get("a");
  const a = ARTICLES.find(x => x.slug === slug);
  const hote = $("#article");

  if (!a) {
    document.title = "Article introuvable — Plein Écran";
    hote.innerHTML = `
      <div class="page-tete">
        <h1>Cette page n'existe pas</h1>
        <p>Le lien est peut-être ancien, ou l'adresse comporte une faute.</p>
        <p style="margin-top:22px"><a class="bouton" href="tests.html">Voir tous les articles</a></p>
      </div>`;
    return;
  }

  const m = auteurDe(a.auteur);
  const visuel = visuelDe(a);
  document.title = `${a.titre} — Plein Écran`;

  const verdict = (a.note != null || a.provisoire) ? `
    <div class="verdict">
      <div class="verdict-tete">
        ${a.note != null ? `<span class="note ${classeNote(a.note)}">${String(a.note).replace(".", ",")}</span>` : ""}
        <p>
          <span class="verdict-label">${a.note != null ? libelleNote(a.note) : "Verdict provisoire"}</span><br>
          <span class="verdict-echelle">${a.note != null
            ? "Note sur 10, attribuée après le test complet. Elle peut être révisée."
            : "Jeu en accès anticipé : pas de note tant qu'il n'est pas terminé."}</span>
        </p>
      </div>
      <div class="verdict-listes">
        <div class="oui"><h4>Ce qui marche</h4><ul>${(a.pour || []).map(x => `<li>${x}</li>`).join("")}</ul></div>
        <div class="non"><h4>Ce qui ne marche pas</h4><ul>${(a.contre || []).map(x => `<li>${x}</li>`).join("")}</ul></div>
      </div>
    </div>` : "";

  const t = a.transparence;
  const transparence = t ? `
    <div class="transparence">
      <h3>Comment nous avons testé</h3>
      <p>Ce bloc figure sur tous nos tests. Il est renseigné avant l'écriture, jamais après.</p>
      <dl>
        <dt>Temps de jeu</dt><dd>${t.temps}</dd>
        <dt>Plateformes testées</dt><dd>${t.plateforme}</dd>
        <dt>Provenance de la copie</dt><dd>${t.copie}</dd>
        <dt>Version testée</dt><dd>${t.version}</dd>
        <dt>Accessibilité</dt><dd>${t.accessibilite}</dd>
      </dl>
    </div>` : "";

  const sources = (a.sources && a.sources.length) ? `
    <div class="sources">
      <h3>Sources</h3>
      <p>Cet article a été écrit à partir des documents ci-dessous. Nous n'en reprenons ni le texte ni la structure : les liens renvoient chez leurs auteurs.</p>
      <ul>${a.sources.map(s => `<li><a href="${s.url}" rel="noopener nofollow" target="_blank">${s.nom}</a></li>`).join("")}</ul>
    </div>` : "";

  const memeAuteur = plusRecents(ARTICLES.filter(x => x.auteur === a.auteur && x.slug !== a.slug)).slice(0, 3);
  const suite = memeAuteur.length ? memeAuteur : plusRecents(ARTICLES.filter(x => x.slug !== a.slug)).slice(0, 3);

  hote.innerHTML = `
    <div class="article-tete">
      ${etiquette(a.rubrique)}${a.format ? `<span class="format-rubrique">${a.format}</span>` : ""}
      <h1>${a.titre}</h1>
      <p class="article-soustitre">${a.sousTitre}</p>
      <div class="article-meta">
        <img src="${m.photo}" alt="">
        <p class="signature">Par <a href="redaction.html#${m.id}">${m.nom}</a>, ${m.role.toLowerCase()}<br>
        ${dateLisible(a.date)}, ${a.lecture} min de lecture${a.plateformes && a.plateformes.length ? ", testé sur " + a.plateformes.join(", ") : ""}</p>
      </div>
    </div>
    <figure class="article-image">
      <img src="${visuel.src}" alt="Illustration accompagnant l'article ${a.titre}">
      ${visuel.credit ? `<figcaption>${visuel.lien
          ? `<a href="${visuel.lien}" rel="noopener nofollow" target="_blank">${visuel.credit}</a>`
          : visuel.credit}</figcaption>` : ""}
    </figure>
    <div class="article-corps">
      <p class="chapo">${a.chapo}</p>
      ${a.corps.map(p => `<p>${p}</p>`).join("")}
      ${a.encadre ? `<div class="encadre-pratique">
        <h3>${a.encadre.titre}</h3>
        <ul>${a.encadre.items.map(i => `<li>${i}</li>`).join("")}</ul>
      </div>` : ""}
      ${(a.corps2 || []).map(p => `<p>${p}</p>`).join("")}
      ${verdict}
      ${transparence}
      ${sources}
      <div class="bloc-auteur">
        <img src="${m.photo}" alt="">
        <div>
          <h3>${m.nom}</h3>
          <p>${m.role}. ${m.accroche}</p>
          <a class="lien-section" href="redaction.html#${m.id}">Ses autres articles et sa déclaration d'intérêts</a>
        </div>
      </div>
    </div>
    <section class="section" style="border-bottom:none">
      <div class="section-tete"><h2 class="section-titre">À lire ensuite</h2></div>
      <div class="a-lire">
        ${suite.map(x => `
          <article>
            <a href="${lienArticle(x.slug)}" tabindex="-1" aria-hidden="true"><img src="${visuelDe(x).src}" alt=""></a>
            ${etiquette(x.rubrique)}
            <h3><a href="${lienArticle(x.slug)}">${x.titre}</a></h3>
            <p class="signature">${dateLisible(x.date)}</p>
          </article>`).join("")}
      </div>
    </section>`;
}

/* ---------------- Page rédaction ---------------- */

function initRedaction() {
  $("#fiches").innerHTML = EQUIPE.map(m => {
    const siens = plusRecents(ARTICLES.filter(a => a.auteur === m.id)).slice(0, 4);
    return `
    <article class="fiche-membre" id="${m.id}">
      <img src="${m.photo}" alt="Portrait illustré de ${m.nom}">
      <div>
        <h2>${m.nom}</h2>
        <p class="fiche-role">${m.role}, à la rédaction depuis ${m.arrivee}</p>
        ${m.bio.map(p => `<p>${p}</p>`).join("")}
        <table class="tableau-perso">
          <tr><th>Spécialités</th><td>${m.specialites.join(", ")}</td></tr>
          ${m.moyenne != null ? `<tr><th>Note moyenne</th><td>${String(m.moyenne).replace(".", ",")} sur 10, sur l'ensemble de ses tests publiés</td></tr>` : ""}
          <tr><th>Sa manie</th><td>${m.manie}</td></tr>
          <tr><th>Déclaration d'intérêts</th><td>${m.interets}</td></tr>
          <tr><th>Contact</th><td>${m.contact}</td></tr>
          ${siens.length ? `<tr><th>Derniers articles</th><td>${siens.map(a => `<a href="${lienArticle(a.slug)}">${a.titre}</a>`).join(", ")}</td></tr>` : ""}
        </table>
      </div>
    </article>`;
  }).join("");
}

/* ---------------- Revue de presse ---------------- */

function initRevue() {
  const hote = $("#revue");
  const maj = $("#revue-maj");
  if (typeof REVUE === "undefined" || !REVUE.entrees || !REVUE.entrees.length) {
    hote.innerHTML = `<div class="vide">
        <h3>La revue n'a pas encore tourné</h3>
        <p>Lancez <code>python3 build_revue.py</code> pour générer <code>assets/js/revue.js</code> à partir des flux configurés.</p>
      </div>`;
    return;
  }
  if (maj) maj.textContent = `Dernière collecte : ${REVUE.genere}. ${REVUE.entrees.length} liens.`;

  const parSource = {};
  REVUE.entrees.forEach(e => { (parSource[e.source] = parSource[e.source] || []).push(e); });

  hote.innerHTML = Object.entries(parSource).map(([src, liens]) => `
    <section class="revue-source">
      <h3>${src}</h3>
      <ul class="fil-actu">
        ${liens.slice(0, 6).map(e => `
          <li>
            <h4><a href="${e.url}" rel="noopener nofollow" target="_blank">${e.titre}</a></h4>
            <p>${e.date || ""}</p>
          </li>`).join("")}
      </ul>
    </section>`).join("");
}

/* ---------------- Amorçage ---------------- */

document.addEventListener("DOMContentLoaded", () => {
  initEntete();
  initInfolettre();
  const page = document.body.dataset.page;
  if (page === "accueil")   initAccueil();
  if (page === "liste")     initListe();
  if (page === "article")   initArticle();
  if (page === "redaction") initRedaction();
  if (page === "revue")     initRevue();
  const annee = $("#annee");
  if (annee) annee.textContent = new Date().getFullYear();
});
