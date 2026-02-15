# App identity assets

Single source of truth for app name and asset paths: `src/config/app-identity.js`.

## Asset layout

| Asset | Location | Usage |
|-------|----------|-------|
| favicon.png | assets/ + public/ | App icon, splash, Android/iOS, web favicon (browser tab) |
| logo.png | assets/ + public/ | In-app branding (shared for light/dark themes) |
| logo-192.png | public/ | PWA add-to-home-screen (192×192) |
| logo-512.png | public/ | PWA add-to-home-screen (512×512) |

## Configuration (app-identity.js)

- **ASSET_ICON** – Expo icon, Android adaptive foreground, iOS icon
- **ASSET_SPLASH** – Native splash screen image
- **PUBLIC_FAVICON** – Web browser tab icon (`/favicon.png`)
- **PUBLIC_ICON_192** – PWA icon (`/logo-192.png`)
- **PUBLIC_ICON_512** – PWA icon (`/logo-512.png`)
- **PUBLIC_APPLE_TOUCH_ICON** – iOS home screen (falls back to logo-192)

## Sync assets to public

Run `node scripts/sync-assets.cjs` to copy favicon and logos from `assets/` to `public/`.

## Requirements

- **favicon.png** – 1024×1024 recommended (used for native icon generation)
- **logo-192.png**, **logo-512.png** – Generate from 1024×1024 source; place in `public/`
- **logo.png** – In-app logo used for light and dark themes

## Verification

Build or run on Android, iOS, and Web; confirm app name, logo in UI, and icon/favicon in launcher, home screen, browser tab, and PWA.
