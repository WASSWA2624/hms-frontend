/**
 * App Identity – single source of truth for app name, short name, and asset paths.
 * Used by app.config.js (Expo) and in-app branding (shell/header, AuthLayout).
 * File: app-identity.js
 */

const resolvePublicEnvValue = (rawValue, fallbackValue) => {
  const normalized = typeof rawValue === 'string' ? rawValue.trim() : '';
  return normalized || fallbackValue;
};

/** Display name (Expo name, web.name, launcher) */
export const APP_DISPLAY_NAME = resolvePublicEnvValue(
  process.env.EXPO_PUBLIC_APP_DISPLAY_NAME,
  'Hospital Management System'
);

/** Short name (web.shortName, PWA, home screen) */
export const APP_SHORT_NAME = resolvePublicEnvValue(
  process.env.EXPO_PUBLIC_APP_SHORT_NAME,
  'HMS'
);

/** Fluent primary for Android adaptiveIcon backgroundColor and web themeColor (theme-design.mdc) */
export const FLUENT_PRIMARY = '#0078D4';

/** App icon path (1024×1024 recommended; used for Expo icon, splash, Android foreground, iOS) */
export const ASSET_ICON = './assets/favicon.png';

/** Splash screen image (native; defaults to ASSET_ICON) */
export const ASSET_SPLASH = ASSET_ICON;

/** Web/PWA: favicon (browser tab); must exist in public/ */
export const PUBLIC_FAVICON = '/favicon.png';
/** Web/PWA: 192×192 add-to-home-screen icon; must exist in public/ */
export const PUBLIC_ICON_192 = '/logo-192.png';
/** Web/PWA: 512×512 add-to-home-screen icon; must exist in public/ */
export const PUBLIC_ICON_512 = '/logo-512.png';
/** Web: Apple touch icon (180×180 preferred; fallback to logo-192); must exist in public/ */
export const PUBLIC_APPLE_TOUCH_ICON = '/logo-192.png';

/** Shared logo (assets for native bundle; public for web) */
export const ASSET_LOGO = './assets/logo.png';

/** Web: absolute path to logo in public (used by AppLogo on web) */
export const PUBLIC_LOGO = '/logo.png';
