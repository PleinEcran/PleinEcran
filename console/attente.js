const ATTENTE = (function () {
  const articles = [];

  const images = [];
  if (typeof ILLUSTRATIONS !== "undefined") {
    Object.keys(ILLUSTRATIONS).forEach(function (slug) {
      const image = ILLUSTRATIONS[slug];
      let titre = slug;
      if (typeof ARTICLES !== "undefined") {
        const article = ARTICLES.find(function (a) { return a.slug === slug; });
        if (article) titre = article.titre;
      }
      images.push({
        slug: slug,
        article: titre,
        fichier: image.fichier,
        credit: image.credit,
        lien: image.lien
      });
    });
  }

  return { articles: articles, images: images };
})();
