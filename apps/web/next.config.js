const { InjectManifest } = require("workbox-webpack-plugin");
const TsconfigPathsPlugin = require("tsconfig-paths-webpack-plugin");
const tsLoader = require("ts-loader");

module.exports = {
  reactStrictMode: true,
  experimental: {
    transpilePackages: ["ui"],
    // ... other configs
    webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
      if (!isServer) {
        config.plugins.push(
          new InjectManifest({
            swSrc: "./pages/service-worker.ts",
            swDest: "../public/sw.js",
            runtimeCaching: [
              {
                // cache requests to the following url patterns
                urlPattern: /^https?.*/,
                // use the network first strategy
                handler: "NetworkFirst",
                options: {
                  cacheName: "offlineCache",
                  expiration: {
                    maxEntries: 200,
                  },
                },
              },
              // ... other runtime caching rules
            ],
          })
        );
      }
      config.module.rules.push({
        test: /\.ts$/,
        use: [
          {
            loader: "ts-loader",
            options: {
              transpileOnly: true,
            },
          },
        ],
      });
      config.resolve.plugins = [
        new TsconfigPathsPlugin({ configFile: "./tsconfig.json" }),
      ];
      config.resolve.extensions.push(".ts");
      return config;
    },
  },
};
