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
            artworks: [],
          });
        }

        categories.get(tag).artworks.push(item);
      }
    }

    return [...categories.values()]
      .sort((a, b) => a.name.localeCompare(b.name));
  });

  
eleventyConfig.addFilter("excerpt", (content, url) => {
  if (!content) return "";

  const html = content.trim();
  const imgMatch = /<img\b[^>]*>/i.exec(html);
  const paragraphBreaks = [...html.matchAll(/<\/p\s*>/gi)];

  let end = html.length;
  let truncated = false;

  if (imgMatch) {
    // cut off if it hits an image
    end = Math.min(end, imgMatch.index);
    truncated = true;
  } else if (paragraphBreaks.length >= 3) {
    // cut off after 3 paragraphs
    end = paragraphBreaks[2].index + paragraphBreaks[2][0].length;
    truncated = true;
  }

  const excerpt = html.slice(0, end).trim();

  if (truncated && url) {
    return `${excerpt} <div class="read-more"><a href="${url}">Read more</a></div>`;
  }

  return excerpt;
});


  return {
    dir: {
      input: "build",
      output: "public",
    },
  };
};
