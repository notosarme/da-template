module.exports = function (eleventyConfig) {
  eleventyConfig.addPassthroughCopy("./build/css/");
  eleventyConfig.addPassthroughCopy("./build/assets/");

  const english = new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      timeZone: "UTC"
    });

  eleventyConfig.addFilter("niceDate", function (d) {
    return english.format(d);
  });

  eleventyConfig.addCollection("artwork", function (collectionApi) {
    return collectionApi.getFilteredByTag("artwork");
  });

 eleventyConfig.addCollection("categories", function (collectionApi) {
  const categories = new Map();

  const artworks = collectionApi
    .getFilteredByTag("artwork")
    .sort((a, b) => b.date - a.date);

  for (const item of artworks) {
    for (const tag of item.data.tags || []) {
      if (tag === "artwork") {
        continue;
      }

      if (!categories.has(tag)) {
        categories.set(tag, {
          name: tag,
          url: `/gallery/${tag}/`,
          image: item.data.url,
        });
      }
    }
  }

  return [...categories.values()]
    .sort((a, b) => a.name.localeCompare(b.name));
});



  return {
    dir: {
      input: "build",
      output: "public",
    },
  };
};
