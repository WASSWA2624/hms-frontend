export default {
  expo: {
    name: "hms",
    slug: "hms",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/favicon.png",
    userInterfaceStyle: "light",
    splash: {
      image: "./assets/favicon.png",
      resizeMode: "contain",
      backgroundColor: "#ffffff",
    },
    assetBundlePatterns: ["**/*"],
    ios: {
      supportsTablet: true,
      bundleIdentifier: "com.hms.ios",
    },
    android: {
      adaptiveIcon: {
        foregroundImage: "./assets/favicon.png",
        backgroundColor: "#ffffff",
      },
      package: "com.hms.android",
    },
    web: {
      favicon: "./assets/favicon.png",
      manifest: "./public/manifest.json",
      bundler: "metro",
      output: "static",
      // PWA configuration
      name: "Hospital Management System",
      shortName: "HMS",
      description: "Hospital Management System",
      themeColor: "#007AFF",
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

