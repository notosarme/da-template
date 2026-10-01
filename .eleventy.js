module.exports = function (eleventyConfig) {
  eleventyConfig.addPassthroughCopy("./build/css/");
  eleventyConfig.addPassthroughCopy("./build/assets/");

  const english = new Intl.DateTimeFormat("en");
  eleventyConfig.addFilter("niceDate", function (d) {
    return english.format(d);
  });

  eleventyConfig.addCollection("artwork", function (collectionApi) {
    return collectionApi.getFilteredByTag("artwork");
  });

  eleventyConfig.addCollection("categories", function (collectionApi) {
  const categories = new Set();

  for (const item of collectionApi.getFilteredByTag("artwork")) {
    for (const tag of item.data.tags || []) {
      if (tag !== "artwork") {
        categories.add(tag);
      }
    }
  }

  return [...categories]
    .sort()
    .map((name) => ({
      name,
      url: `/categories/${name}/`,
    }));
});


  return {
    dir: {
      input: "build",
      output: "public",
    },
  };
};
