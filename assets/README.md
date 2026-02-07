# App identity assets

Single source of truth for app name and asset paths: `src/config/app-identity.js`.

## Asset layout

| Asset | Location | Usage |
|-------|----------|-------|
| favicon.png | assets/ + public/ | App icon, splash, Android/iOS, web favicon (browser tab) |
| logo-light.png | assets/ + public/ | In-app branding (light theme) |
| logo-dark.png | assets/ + public/ | In-app branding (dark theme) |
| icon-192.png | public/ | PWA add-to-home-screen (192×192) |
| icon-512.png | public/ | PWA add-to-home-screen (512×512) |

## Configuration (app-identity.js)

- **ASSET_ICON** – Expo icon, Android adaptive foreground, iOS icon
- **ASSET_SPLASH** – Native splash screen image
- **PUBLIC_FAVICON** – Web browser tab icon (`/favicon.png`)
- **PUBLIC_ICON_192** – PWA icon (`/icon-192.png`)
- **PUBLIC_ICON_512** – PWA icon (`/icon-512.png`)
- **PUBLIC_APPLE_TOUCH_ICON** – iOS home screen (falls back to icon-192)

## Sync assets to public

Run `node scripts/sync-assets.cjs` to copy favicon and logos from `assets/` to `public/`.

## Requirements

- **favicon.png** – 1024×1024 recommended (used for native icon generation)
- **icon-192.png**, **icon-512.png** – Generate from 1024×1024 source; place in `public/`
- **logo-light.png**, **logo-dark.png** – Theme-aware in-app logos

## Verification

Build or run on Android, iOS, and Web; confirm app name, logo in UI, and icon/favicon in launcher, home screen, browser tab, and PWA.
