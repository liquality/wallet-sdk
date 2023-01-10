const { InjectManifest } = require("workbox-webpack-plugin");

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
            swDest: "./public/sw.js",
            include: ["__nothing__"],
          })
        );
      }

      return config;
    },
  },
};
