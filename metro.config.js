const { getDefaultConfig } = require("@expo/metro-config");

const defaultConfig = getDefaultConfig(__dirname);
const { assetExts, sourceExts } = defaultConfig.resolver;

/**
 * Metro configuration
 * https://facebook.github.io/metro/docs/configuration
 *
 * @type {import('metro-config').MetroConfig}
 */

defaultConfig.transformer.unstable_allowRequireContext = true;
defaultConfig.transformer.babelTransformerPath = require.resolve(
  "react-native-svg-transformer"
);
defaultConfig.resolver.assetExts = assetExts.filter((ext) => ext !== "svg");
defaultConfig.resolver.sourceExts = [...sourceExts, "svg"];

module.exports = defaultConfig;
