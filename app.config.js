const fs = require('fs');
const path = require('path');

const {
  APP_DISPLAY_NAME,
  APP_SHORT_NAME,
  FLUENT_PRIMARY,
  ASSET_ICON,
  ASSET_SPLASH,
} = require('./src/config/app-identity');

const syncWebManifest = () => {
  const manifestPath = path.resolve(__dirname, 'public/manifest.json');
  if (!fs.existsSync(manifestPath)) return;

  try {
    const current = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
    const isAlreadySynced =
      current?.name === APP_DISPLAY_NAME &&
      current?.short_name === APP_SHORT_NAME &&
      current?.description === APP_DISPLAY_NAME &&
      current?.theme_color === FLUENT_PRIMARY;
    if (isAlreadySynced) return;

    const next = {
      ...current,
      name: APP_DISPLAY_NAME,
      short_name: APP_SHORT_NAME,
      description: APP_DISPLAY_NAME,
      theme_color: FLUENT_PRIMARY,
    };
    fs.writeFileSync(manifestPath, `${JSON.stringify(next, null, 2)}\n`, 'utf8');
  } catch (error) {
    console.warn('[app.config] Failed to sync public/manifest.json', error?.message || error);
  }
};

syncWebManifest();

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

