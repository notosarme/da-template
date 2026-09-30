module.exports = function (eleventyConfig) {

  eleventyConfig.addPassthroughCopy("./build/css/");
  eleventyConfig.addPassthroughCopy("./build/assets/");

  return {
    dir: {
      input: "build",
      output: "public",
    },
  };
};