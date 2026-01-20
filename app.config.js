export default {
  expo: {
    name: "biomed",
    slug: "biomed",
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
    },
    android: {
      adaptiveIcon: {
        foregroundImage: "./assets/favicon.png",
        backgroundColor: "#ffffff",
      },
    },
    web: {
      favicon: "./assets/favicon.png",
      manifest: "./public/manifest.json",
      bundler: "metro",
      output: "static",
      // PWA configuration
      name: "Biomedical Marketplace",
      shortName: "BiomedMarket",
      description: "B2B e-commerce platform for healthcare",
      themeColor: "#007AFF",
      backgroundColor: "#ffffff",
      display: "standalone",
      orientation: "portrait",
      startUrl: "/",
      scope: "/",
    },
    plugins: ["expo-router", "expo-secure-store"],
    scheme: "biomed",
  },
};

