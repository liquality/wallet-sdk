const path = require("path");
const { getLoader, loaderByName } = require("@craco/craco");

const packages = [];
console.log(__dirname, "DIIIIRNAAME");
//packages.push(path.join(__dirname, "../../packages/ui"));
//packages.push(path.join(__dirname, "../../packages/sdk")); //you can add as many as you need, but this gets slightly annoying

module.exports = {
  webpack: {
    configure: (webpackConfig, arg) => {
      const { isFound, match } = getLoader(
        webpackConfig,
        loaderByName("babel-loader")
      );
      if (isFound) {
        const include = Array.isArray(match.loader.include)
          ? match.loader.include
          : [match.loader.include];

        match.loader.include = include.concat(packages);
      }
      return webpackConfig;
    },
  },
};
