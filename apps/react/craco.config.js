const path = require("path");
const { getLoader, loaderByName } = require("@craco/craco");
const webpack = require("webpack");

const packages = [];
console.log(__dirname, "DIIIIRNAAME");
packages.push(path.join(__dirname, "../../packages/ui"));
packages.push(path.join(__dirname, "../../packages/sdk")); //you can add as many as you need, but this gets slightly annoying

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

      webpackConfig.resolve.alias = {
        ...webpackConfig.resolve.alias,
        crypto: require.resolve("crypto-browserify"),
        stream: require.resolve("stream-browserify"),
        assert: require.resolve("assert"),
        http: require.resolve("stream-http"),
        https: require.resolve("https-browserify"),
        os: require.resolve("os-browserify"),
        url: require.resolve("url"),
      };

      webpackConfig.plugins = (webpackConfig.plugins || []).concat([
        new webpack.ProvidePlugin({
          process: "process/browser",
          Buffer: ["buffer", "Buffer"],
        }),
      ]);

      return webpackConfig;
    },
  },
};
