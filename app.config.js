const {
  APP_DISPLAY_NAME,
  APP_SHORT_NAME,
  FLUENT_PRIMARY,
  ASSET_ICON,
  ASSET_SPLASH,
} = require('./src/config/app-identity');

export default {
  expo: {
    name: APP_DISPLAY_NAME,
    slug: "hms",
    version: "1.0.0",
    orientation: "portrait",
    icon: ASSET_ICON,
    userInterfaceStyle: "light",
    splash: {
      image: ASSET_SPLASH,
      resizeMode: "contain",
      backgroundColor: FLUENT_PRIMARY,
    },
    assetBundlePatterns: ["**/*"],
    ios: {
      supportsTablet: true,
      bundleIdentifier: "com.hms.ios",
      icon: ASSET_ICON,
    },
    android: {
      adaptiveIcon: {
        foregroundImage: ASSET_ICON,
        backgroundColor: FLUENT_PRIMARY,
      },
      package: "com.hms.android",
    },
    web: {
      favicon: ASSET_ICON,
      manifest: "./public/manifest.json",
      bundler: "metro",
      output: "static",
      name: APP_DISPLAY_NAME,
      shortName: APP_SHORT_NAME,
      description: APP_DISPLAY_NAME,
      themeColor: FLUENT_PRIMARY,
      backgroundColor: "#ffffff",
      display: "standalone",
      orientation: "portrait",
      startUrl: "/",
      scope: "/",
    },
    plugins: ["expo-router", "expo-secure-store"],
    scheme: "hms",
    "extra": {
      "eas": {
        "projectId": "c9c95111-8919-4161-874d-cdc473ef1a9f"       
      }
    },
  },
};

