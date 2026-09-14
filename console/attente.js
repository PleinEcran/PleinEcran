const ATTENTE = (function () {
  const articles = (typeof BROUILLONS !== "undefined" && BROUILLONS.articles) ? BROUILLONS.articles : [];

  const images = [];
  if (typeof ILLUSTRATIONS !== "undefined") {
    Object.keys(ILLUSTRATIONS).forEach(function (slug) {
      const entree = ILLUSTRATIONS[slug];
      let titre = slug;
      if (typeof ARTICLES !== "undefined") {
        const article = ARTICLES.find(function (a) { return a.slug === slug; });
        if (article) titre = article.titre;
      }
      const candidats = entree.candidats || [entree];
      candidats.forEach(function (image, rang) {
        images.push({
          slug: slug + "-" + (rang + 1),
          article: titre + "  —  proposition " + (rang + 1) + " sur " + candidats.length,
          fichier: image.fichier,
          credit: image.credit + (image.nom ? "   ·   " + image.nom : ""),
          lien: image.lien
        });
      });
    });
  }

  return { articles: articles, images: images };
})();
