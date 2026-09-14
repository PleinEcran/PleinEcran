/* Console éditoriale — Plein Écran
   Tout tourne dans le navigateur. Les données vivent dans le stockage local,
   et se synchronisent entre appareils via votre dépôt GitHub si vous le
   configurez dans les réglages. */

const CLE_DONNEES = "plein-ecran-console";
const CLE_REGLAGES = "plein-ecran-reglages";
const CHEMIN_SYNC = "console/journal.json";

const $ = (s, c = document) => c.querySelector(s);
const $$ = (s, c = document) => Array.from(c.querySelectorAll(s));

/* ------------------------------------------------------------------ état */

const vide = () => ({
  version: 1,
  maj: new Date().toISOString(),
  commandes: [],   // sujets que je dois écrire
  idees: [],       // boîte à idées (article / edito / retro)
  avis: {},        // décisions sur les articles rédigés
  images: {},      // décisions sur les illustrations
  vus: []          // identifiants de sujets de veille déjà vus
});

let etat = vide();
let reglages = { depot: "", jeton: "" };
let veille = { collecte: "", sujets: [], alertes: [] };
let attente = { articles: [], images: [] };
let filtreVeille = "tout";

const identifiant = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 7);

function charger() {
  try {
    const brut = localStorage.getItem(CLE_DONNEES);
    if (brut) etat = Object.assign(vide(), JSON.parse(brut));
    const r = localStorage.getItem(CLE_REGLAGES);
    if (r) reglages = Object.assign(reglages, JSON.parse(r));
  } catch (e) {
    console.warn("Données locales illisibles, on repart à zéro.", e);
  }
}

function sauver(silencieux) {
  etat.maj = new Date().toISOString();
  localStorage.setItem(CLE_DONNEES, JSON.stringify(etat));
  rafraichirPastilles();
  if (!silencieux) toast("Enregistré sur cet appareil");
  if (reglages.depot && reglages.jeton) pousser(true);
}

function toast(message) {
  const t = $("#toast");
  t.textContent = message;
  t.classList.add("visible");
  clearTimeout(toast.minuteur);
  toast.minuteur = setTimeout(() => t.classList.remove("visible"), 2600);
}

/* ------------------------------------------------- chargement des fichiers */

/* Les données produites par veille.py et par la rédaction sont chargées par
   balise <script>, jamais par fetch : la console fonctionne ainsi même ouverte
   par double-clic depuis le disque, sans serveur. */
async function chargerFichiers() {
  veille = (typeof VEILLE !== "undefined") ? VEILLE : { collecte: "", sujets: [], alertes: [] };
  attente = (typeof ATTENTE !== "undefined") ? ATTENTE : { articles: [], images: [] };

  $("#maj-veille").textContent = veille.collecte
    ? `Dernière collecte : ${veille.collecte}. ${veille.sujets.length} sujets suivis.`
    : "La veille n'a pas encore tourné. Lancez veille.py ou attendez la prochaine collecte automatique.";

  const alertesNouvelles = (veille.alertes || []).filter(a => !etat.vus.includes("alerte:" + a));
  if (alertesNouvelles.length) notifier(alertesNouvelles);
}

/* ------------------------------------------------------------ notifications */

function notifier(titres) {
  if (!("Notification" in window) || Notification.permission !== "granted") return;
  const titre = titres.length === 1 ? "Actu chaude" : `${titres.length} sujets chauds`;
  try {
    new Notification(titre, { body: titres.slice(0, 3).join("\n"), icon: "icone.png", tag: "veille" });
    titres.forEach(t => etat.vus.push("alerte:" + t));
    sauver(true);
  } catch (e) { /* certains navigateurs exigent le service worker */ }
}

/* ----------------------------------------------------------------- veille */

function classeThermo(c) { return c >= 6 ? "" : (c >= 3 ? " tiede" : " froid"); }

function afficherVeille() {
  const hote = $("#liste-veille");
  let sujets = veille.sujets || [];

  if (filtreVeille === "chaud") sujets = sujets.filter(s => s.chaleur >= (veille.seuil || 6));
  if (filtreVeille === "nouveau") sujets = sujets.filter(s => !etat.vus.includes(s.id));

  if (!sujets.length) {
    hote.innerHTML = `<div class="vide"><strong>Rien à cet endroit</strong>
      ${veille.sujets && veille.sujets.length ? "Changez de filtre." : "La collecte n'a pas encore tourné."}</div>`;
    return;
  }

  hote.innerHTML = sujets.map(s => {
    const commande = etat.commandes.find(c => c.source === s.id);
    return `
    <article class="sujet${s.chaleur >= (veille.seuil || 6) ? " chaud" : ""}${commande ? " traite" : ""}" data-id="${s.id}">
      <div class="sujet-tete">
        <h3><a href="${s.url}" target="_blank" rel="noopener nofollow">${echapper(s.titre)}</a></h3>
        <span class="thermo${classeThermo(s.chaleur)}">${s.chaleur}</span>
      </div>
      <p class="meta">${s.reprises} reprise${s.reprises > 1 ? "s" : ""} sur ${s.sources.length} source${s.sources.length > 1 ? "s" : ""}, il y a ${s.heures} h</p>
      <div class="liens-sources">
        ${(s.liens || []).map(l => `<a class="lien-source" href="${l.url}" target="_blank" rel="noopener nofollow">${echapper(l.source)}</a>`).join("")}
      </div>
      ${commande
        ? `<p class="meta">Commandé${commande.note ? " avec votre angle" : ""}. <button class="bouton-creux" data-action="annuler" data-id="${commande.id}">Retirer</button></p>`
        : `<div class="actions">
             <button class="bouton" data-action="ecrire" data-id="${s.id}">J'en veux un article</button>
             <button class="bouton-creux" data-action="angle" data-id="${s.id}">Avec mon angle</button>
             <button class="bouton-creux" data-action="ignorer" data-id="${s.id}">Pas intéressé</button>
           </div>
           <div class="zone-angle" id="angle-${s.id}">
             <label class="champ"><span>Votre point de vue, ce qu'il faut dire</span>
               <textarea rows="3" id="texte-${s.id}" placeholder="Ce qui vous frappe, ce qu'il faut rappeler, le ton à prendre."></textarea>
             </label>
             <div class="rang fin"><button class="bouton" data-action="valider-angle" data-id="${s.id}">Commander avec cet angle</button></div>
           </div>`}
    </article>`;
  }).join("");
}

function echapper(t) {
  return String(t).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
}

function commander(idSujet, note) {
  const sujet = (veille.sujets || []).find(s => s.id === idSujet);
  if (!sujet) return;
  etat.commandes.unshift({
    id: identifiant(), type: "article", source: sujet.id,
    titre: sujet.titre, url: sujet.url,
    sources: (sujet.liens || []).map(l => ({ source: l.source, url: l.url })),
    note: note || "", statut: "demande", cree: new Date().toISOString()
  });
  if (!etat.vus.includes(idSujet)) etat.vus.push(idSujet);
  sauver();
  afficherVeille();
  afficherCommandes();
  toast(note ? "Commandé avec votre angle" : "Commandé");
}

/* -------------------------------------------------------------- commandes */

function afficherCommandes() {
  const hote = $("#liste-commandes");
  if (!etat.commandes.length) {
    hote.innerHTML = `<div class="vide"><strong>Aucune commande</strong>
      Passez par l'onglet Veille pour demander un article, ou par la boîte à idées.</div>`;
    return;
  }
  hote.innerHTML = etat.commandes.map(c => `
    <article class="sujet">
      <div class="sujet-tete">
        <h3>${c.url ? `<a href="${c.url}" target="_blank" rel="noopener nofollow">${echapper(c.titre)}</a>` : echapper(c.titre)}</h3>
        <span class="thermo froid">${c.type}</span>
      </div>
      <p class="meta">Demandé le ${new Date(c.cree).toLocaleDateString("fr-FR")}${c.statut === "ecrit" ? ", écrit" : ""}</p>
      ${c.note ? `<p class="meta" style="white-space:pre-wrap">« ${echapper(c.note)} »</p>` : ""}
      <div class="actions">
        <button class="bouton-creux" data-action="editer-note" data-id="${c.id}">${c.note ? "Modifier l'angle" : "Ajouter un angle"}</button>
        <button class="bouton-creux danger" data-action="annuler" data-id="${c.id}">Retirer</button>
      </div>
      <div class="zone-angle" id="note-${c.id}">
        <label class="champ"><span>Votre point de vue</span>
          <textarea rows="3" id="notetexte-${c.id}">${echapper(c.note || "")}</textarea>
        </label>
        <div class="rang fin"><button class="bouton" data-action="enregistrer-note" data-id="${c.id}">Enregistrer</button></div>
      </div>
    </article>`).join("");
}

/* ------------------------------------------------------------- validation */

function afficherValidation() {
  const hote = $("#liste-validation");
  const articles = attente.articles || [];
  if (!articles.length) {
    hote.innerHTML = `<div class="vide"><strong>Rien en attente</strong>
      Les articles que j'écris apparaissent ici avant publication.</div>`;
    return;
  }
  hote.innerHTML = articles.map(a => {
    const avis = etat.avis[a.slug];
    return `
    <article class="avalider">
      ${avis ? `<span class="decision ${avis.decision === "oui" ? "oui" : "non"}">${avis.decision === "oui" ? "Validé" : "Refusé"}</span>` : ""}
      <h3>${echapper(a.titre)}</h3>
      <p class="chapo">${echapper(a.chapo || "")}</p>
      <p class="meta">${echapper((typeof RUBRIQUES !== "undefined" && RUBRIQUES[a.rubrique]) ? RUBRIQUES[a.rubrique].nom : (a.rubrique || ""))}${a.date ? ", " + a.date : ""}${a.lecture ? ", " + a.lecture + " min" : ""}</p>
      <div class="liens-sources">
        ${(a.sources || []).map(s => `<a class="lien-source" href="${s.url}" target="_blank" rel="noopener nofollow">${echapper(s.nom || s.source || s.url)}</a>`).join("")}
      </div>
      <div class="actions">
        <button class="bouton-creux vert" data-action="valider-article" data-slug="${a.slug}">Valider</button>
        <button class="bouton-creux danger" data-action="refuser-article" data-slug="${a.slug}">Refuser</button>
        <button class="bouton-creux" data-action="commenter-article" data-slug="${a.slug}">Commenter</button>
      </div>
      <div class="zone-angle${avis && avis.commentaire ? " ouverte" : ""}" id="avis-${a.slug}">
        <label class="champ"><span>Ce qu'il faut changer</span>
          <textarea rows="3" id="aviscom-${a.slug}">${echapper((avis && avis.commentaire) || "")}</textarea>
        </label>
        <div class="rang fin"><button class="bouton" data-action="enregistrer-avis" data-slug="${a.slug}">Enregistrer</button></div>
      </div>
    </article>`;
  }).join("");
}

/* ----------------------------------------------------------------- images */

function afficherImages() {
  const hote = $("#liste-images");
  const images = attente.images || [];
  if (!images.length) {
    hote.innerHTML = `<div class="vide"><strong>Aucune image à juger</strong>
      Les illustrations trouvées par la veille apparaissent ici avec leur licence.</div>`;
    return;
  }
  hote.innerHTML = images.map(i => {
    const avis = etat.images[i.slug];
    return `
    <article class="avalider">
      ${avis ? `<span class="decision ${avis.decision === "oui" ? "oui" : "non"}">${avis.decision === "oui" ? "Gardée" : "Écartée"}</span>` : ""}
      <div class="apercu-image">
        <img src="../${i.fichier}" alt="" loading="lazy">
        <div>
          <h3>${echapper(i.article || i.slug)}</h3>
          <p class="credit">${echapper(i.credit || "")}</p>
          ${i.lien ? `<p class="meta"><a href="${i.lien}" target="_blank" rel="noopener nofollow">Fiche du fichier et licence</a></p>` : ""}
          <div class="actions">
            <button class="bouton-creux vert" data-action="garder-image" data-slug="${i.slug}">Garder</button>
            <button class="bouton-creux danger" data-action="ecarter-image" data-slug="${i.slug}">Écarter</button>
          </div>
        </div>
      </div>
    </article>`;
  }).join("");
}

/* ------------------------------------------------------------------ idées */

function afficherIdees() {
  const parType = t => etat.idees.filter(i => i.type === t);
  const rendre = (liste, hote) => {
    const cible = $(hote);
    if (!liste.length) {
      cible.innerHTML = `<div class="vide"><strong>Boîte vide</strong>Ajoutez une idée ci-dessus.</div>`;
      return;
    }
    cible.innerHTML = liste.map(i => `
      <div class="idee${i.utilisee ? " utilisee" : ""}">
        <h4>${echapper(i.titre)}</h4>
        ${i.note ? `<p>${echapper(i.note)}</p>` : ""}
        <div class="actions">
          <button class="bouton-creux" data-action="basculer-idee" data-id="${i.id}">${i.utilisee ? "Remettre en stock" : "Marquer utilisée"}</button>
          <button class="bouton-creux danger" data-action="supprimer-idee" data-id="${i.id}">Supprimer</button>
        </div>
      </div>`).join("");
  };

  const edito = parType("edito"), retro = parType("retro"), article = parType("article");
  rendre(edito, "#liste-edito");
  rendre(retro, "#liste-retro");
  rendre(article, "#liste-idees-article");

  const dispo = l => l.filter(i => !i.utilisee).length;
  $("#compte-edito").textContent = `${dispo(edito)} en stock`;
  $("#compte-retro").textContent = `${dispo(retro)} en stock`;
  $("#compte-article").textContent = `${dispo(article)} en stock`;
}

/* -------------------------------------------------------------- pastilles */

function rafraichirPastilles() {
  const marquer = (sel, n) => {
    const p = $(sel);
    p.textContent = n;
    p.classList.toggle("visible", n > 0);
  };
  const seuil = veille.seuil || 6;
  marquer("#pastille-veille", (veille.sujets || []).filter(s => s.chaleur >= seuil && !etat.vus.includes(s.id)).length);
  marquer("#pastille-commandes", etat.commandes.filter(c => c.statut === "demande").length);
  marquer("#pastille-validation", (attente.articles || []).filter(a => !etat.avis[a.slug]).length);
  marquer("#pastille-images", (attente.images || []).filter(i => !etat.images[i.slug]).length);
}

/* ------------------------------------------------- synchronisation GitHub */

function enteteGitHub() {
  return {
    "Authorization": `Bearer ${reglages.jeton}`,
    "Accept": "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28"
  };
}

async function tirer(silencieux) {
  if (!reglages.depot || !reglages.jeton) return retourSync("Dépôt ou jeton manquant.", false);
  try {
    const r = await fetch(`https://api.github.com/repos/${reglages.depot}/contents/${CHEMIN_SYNC}`, { headers: enteteGitHub() });
    if (r.status === 404) return retourSync("Aucune sauvegarde distante pour l'instant.", true);
    if (!r.ok) throw new Error(r.status);
    const fichier = await r.json();
    const distant = JSON.parse(decodeURIComponent(escape(atob(fichier.content.replace(/\n/g, "")))));
    if (!distant.maj || (etat.maj && distant.maj <= etat.maj)) {
      return retourSync("Cet appareil est déjà à jour.", true);
    }
    etat = Object.assign(vide(), distant);
    localStorage.setItem(CLE_DONNEES, JSON.stringify(etat));
    toutAfficher();
    retourSync("Données récupérées.", true);
  } catch (e) {
    retourSync("Récupération impossible : " + e.message, false);
  }
  if (!silencieux) toast("Synchronisation terminée");
}

async function pousser(silencieux) {
  if (!reglages.depot || !reglages.jeton) return retourSync("Dépôt ou jeton manquant.", false);
  try {
    let sha = null;
    const existant = await fetch(`https://api.github.com/repos/${reglages.depot}/contents/${CHEMIN_SYNC}`, { headers: enteteGitHub() });
    if (existant.ok) sha = (await existant.json()).sha;

    const contenu = btoa(unescape(encodeURIComponent(JSON.stringify(etat, null, 2))));
    const r = await fetch(`https://api.github.com/repos/${reglages.depot}/contents/${CHEMIN_SYNC}`, {
      method: "PUT",
      headers: Object.assign(enteteGitHub(), { "Content-Type": "application/json" }),
      body: JSON.stringify({ message: "Console : mise à jour du journal", content: contenu, sha })
    });
    if (!r.ok) throw new Error(r.status);
    retourSync("Envoyé sur le dépôt.", true);
    if (!silencieux) toast("Envoyé sur le dépôt");
  } catch (e) {
    retourSync("Envoi impossible : " + e.message, false);
    if (!silencieux) toast("Envoi impossible");
  }
}

function retourSync(message, ok) {
  const p = $("#retour-sync");
  p.textContent = message;
  p.className = "retour " + (ok ? "ok" : "erreur");
}

/* ----------------------------------------------------------------- actions */

function auClic(evenement) {
  const bouton = evenement.target.closest("[data-action]");
  if (!bouton) return;
  const action = bouton.dataset.action;
  const id = bouton.dataset.id;
  const slug = bouton.dataset.slug;

  const basculer = sel => { const z = $(sel); if (z) z.classList.toggle("ouverte"); };

  switch (action) {
    case "ecrire": commander(id, ""); break;
    case "angle": basculer("#angle-" + CSS.escape(id)); break;
    case "valider-angle": commander(id, ($("#texte-" + CSS.escape(id)) || {}).value || ""); break;
    case "ignorer":
      if (!etat.vus.includes(id)) etat.vus.push(id);
      sauver(true); afficherVeille(); break;
    case "annuler":
      etat.commandes = etat.commandes.filter(c => c.id !== id);
      sauver(); afficherCommandes(); afficherVeille(); break;
    case "editer-note": basculer("#note-" + CSS.escape(id)); break;
    case "enregistrer-note": {
      const c = etat.commandes.find(x => x.id === id);
      if (c) c.note = ($("#notetexte-" + CSS.escape(id)) || {}).value || "";
      sauver(); afficherCommandes(); break;
    }
    case "valider-article":
      etat.avis[slug] = Object.assign({}, etat.avis[slug], { decision: "oui" });
      sauver(); afficherValidation(); break;
    case "refuser-article":
      etat.avis[slug] = Object.assign({}, etat.avis[slug], { decision: "non" });
      sauver(); afficherValidation(); break;
    case "commenter-article": basculer("#avis-" + CSS.escape(slug)); break;
    case "enregistrer-avis":
      etat.avis[slug] = Object.assign({ decision: "attente" }, etat.avis[slug],
        { commentaire: ($("#aviscom-" + CSS.escape(slug)) || {}).value || "" });
      sauver(); afficherValidation(); break;
    case "garder-image":
      etat.images[slug] = { decision: "oui" }; sauver(); afficherImages(); break;
    case "ecarter-image":
      etat.images[slug] = { decision: "non" }; sauver(); afficherImages(); break;
    case "basculer-idee": {
      const i = etat.idees.find(x => x.id === id);
      if (i) i.utilisee = !i.utilisee;
      sauver(); afficherIdees(); break;
    }
    case "supprimer-idee":
      etat.idees = etat.idees.filter(x => x.id !== id);
      sauver(); afficherIdees(); break;
  }
}

function toutAfficher() {
  afficherVeille(); afficherCommandes(); afficherValidation(); afficherImages(); afficherIdees();
  rafraichirPastilles();
}

/* ---------------------------------------------------------------- démarrage */

document.addEventListener("DOMContentLoaded", async () => {
  charger();

  $$(".onglet").forEach(o => o.addEventListener("click", () => {
    $$(".onglet").forEach(x => x.classList.remove("actif"));
    $$(".vue").forEach(x => x.classList.remove("active"));
    o.classList.add("actif");
    $("#vue-" + o.dataset.vue).classList.add("active");
    toutAfficher();          // la vue affichée est toujours à jour
    window.scrollTo({ top: 0 });
  }));

  $$(".puce").forEach(p => p.addEventListener("click", () => {
    $$(".puce").forEach(x => x.classList.remove("active"));
    p.classList.add("active");
    filtreVeille = p.dataset.filtre;
    afficherVeille();
  }));

  document.addEventListener("click", auClic);

  $("#form-idee").addEventListener("submit", e => {
    e.preventDefault();
    const titre = $("#idee-titre").value.trim();
    if (!titre) return;
    etat.idees.unshift({
      id: identifiant(), type: $("#idee-type").value, titre,
      note: $("#idee-note").value.trim(), utilisee: false, cree: new Date().toISOString()
    });
    $("#idee-titre").value = ""; $("#idee-note").value = "";
    sauver(); afficherIdees();
  });

  // réglages
  $("#ouvrir-reglages").addEventListener("click", () => {
    $("#reg-depot").value = reglages.depot;
    $("#reg-jeton").value = reglages.jeton;
    $("#reglages").showModal();
  });
  const memoriser = () => {
    reglages.depot = $("#reg-depot").value.trim();
    reglages.jeton = $("#reg-jeton").value.trim();
    localStorage.setItem(CLE_REGLAGES, JSON.stringify(reglages));
  };
  $("#reg-depot").addEventListener("change", memoriser);
  $("#reg-jeton").addEventListener("change", memoriser);
  $("#tester-sync").addEventListener("click", async () => {
    memoriser();
    if (!reglages.depot || !reglages.jeton) return retourSync("Renseignez le dépôt et le jeton.", false);
    try {
      const r = await fetch(`https://api.github.com/repos/${reglages.depot}`, { headers: enteteGitHub() });
      retourSync(r.ok ? "Connexion au dépôt réussie." : `Refusé par GitHub (code ${r.status}).`, r.ok);
    } catch (e) { retourSync("Connexion impossible : " + e.message, false); }
  });
  $("#tirer-sync").addEventListener("click", () => { memoriser(); tirer(false); });
  $("#pousser-sync").addEventListener("click", () => { memoriser(); pousser(false); });

  $("#activer-notifs").addEventListener("click", async () => {
    if (!("Notification" in window)) return ($("#retour-notifs").textContent = "Ce navigateur ne gère pas les notifications.");
    const p = await Notification.requestPermission();
    const r = $("#retour-notifs");
    r.textContent = p === "granted" ? "Notifications autorisées sur cet appareil." : "Refusé. Vous serez prévenu par courriel.";
    r.className = "retour " + (p === "granted" ? "ok" : "erreur");
  });

  $("#exporter").addEventListener("click", () => {
    const lien = document.createElement("a");
    lien.href = URL.createObjectURL(new Blob([JSON.stringify(etat, null, 2)], { type: "application/json" }));
    lien.download = "console-plein-ecran.json";
    lien.click();
  });
  $("#vider").addEventListener("click", () => {
    if (!confirm("Effacer toutes vos notes sur cet appareil ? La sauvegarde distante n'est pas touchée.")) return;
    etat = vide(); localStorage.setItem(CLE_DONNEES, JSON.stringify(etat)); toutAfficher(); toast("Effacé");
  });

  await chargerFichiers();
  if (reglages.depot && reglages.jeton) await tirer(true);
  toutAfficher();
  $("#etat").textContent = veille.collecte ? "À jour" : "Veille en attente";

  if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("sw.js").catch(() => {});
  }

  // rechargement périodique : on relit le fichier de veille s'il a changé
  setInterval(async () => {
    try {
      const r = await fetch("veille.js?t=" + Date.now());
      if (!r.ok) return;
      const texte = await r.text();
      const frais = JSON.parse(texte.slice(texte.indexOf("{"), texte.lastIndexOf("}") + 1));
      if (frais.collecte !== veille.collecte) {
        veille = frais;
        const nouvelles = (veille.alertes || []).filter(a => !etat.vus.includes("alerte:" + a));
        if (nouvelles.length) notifier(nouvelles);
        toutAfficher();
        $("#etat").textContent = "À jour";
      }
    } catch (e) { /* hors ligne ou fichier local : on garde ce qu'on a */ }
  }, 600000);
});
