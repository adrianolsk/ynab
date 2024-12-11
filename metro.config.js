const { getDefaultConfig } = require("expo/metro-config");

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

config.resolver.sourceExts.push("sql"); // <--- add this
config.resolver.assetExts.push("ttf");
module.exports = config;
