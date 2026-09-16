module.exports = {
  webpack: {
    configure: (webpackConfig) => {
      // CRA runs source-map-loader on all JS/TS files, including node_modules,
      // which warns whenever a published package's sourceMappingURL points to
      // source files that weren't included in the npm tarball (e.g. react-simple-maps).
      // Excluding node_modules silences that harmless warning.
      const sourceMapRule = webpackConfig.module.rules.find(
        (rule) => Array.isArray(rule.oneOf) === false && rule.enforce === "pre" && rule.loader?.includes("source-map-loader")
      );

      if (sourceMapRule) {
        sourceMapRule.exclude = /node_modules/;
      }

      return webpackConfig;
    },
  },
};
