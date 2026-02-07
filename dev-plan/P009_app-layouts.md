# Phase 9: App Layouts (All Platforms, All Screen Sizes, Microsoft Fluent)

## Purpose
Implement **app layouts and global UI shell** for all route groups. Layouts and all UI in this phase must be implemented for **all platforms** (Android, iOS, Web), **all screen sizes** (mobile, tablet, desktop, large per `src/theme/breakpoints.js`), and must follow **Microsoft Fluent / Microsoft 365 look and feel** per `.cursor/rules/theme-design.mdc`. Every step is atomic, chronological, and follows `.cursor/rules/`.

## Prerequisites
- Phase 8 completed (debug resources)
- Phase 7 completed (app shell, route groups)
- Theme: light/dark only (Phase 3)

## Rule References
- `.cursor/rules/app-router.mdc` (route groups, layout placement)
- `.cursor/rules/platform-ui.mdc` (platform separation, resilience)
- `.cursor/rules/component-structure.mdc` (grouping, barrel, platform files)
- `.cursor/rules/theme-design.mdc` (Microsoft Fluent, tokens, light/dark only)
- `.cursor/rules/accessibility.mdc` (a11y, touch targets)
- `.cursor/rules/testing.mdc` (coverage, platform-specific tests)
- `.cursor/rules/i18n.mdc` (100% i18n for UI text)

## Layout and Component Requirements (Mandatory)
- **Platforms**: Every layout and global UI component must have `.android.jsx`, `.ios.jsx`, `.web.jsx` (and matching `.styles.jsx`) per `component-structure.mdc`.
- **Screen sizes**: Use theme breakpoints (mobile, tablet, desktop, large); responsive behavior at each breakpoint; no magic numbers.
- **Look and feel**: Microsoft Fluent / Microsoft 365 (Fluent blue primary, neutrals, Segoe UI–style typography, 2–4px radius, light elevation). All tokens from theme; no hardcoded colors/spacing.
- **Theme**: Light and dark only; theme controls in shell must switch only between light and dark.

## Steps (Atomic, Chronological)

### Step 9.0: App Identity and Icons (All Platforms)
**Goal**: Configure app name, logo, and all platform-specific icons (Android, iOS, Web favicon and web/tablet icon) so the app presents a consistent identity everywhere.

**Actions**:
1. **App name**: Set display name in `app.config.js` (Expo `name`) and, for web, in `web.name` and `web.shortName`; ensure one source of truth (e.g. env or constant) if names must stay in sync.
2. **Logo**: Provide a canonical logo asset (e.g. under `assets/`); use it in shell/header and anywhere the app brand is shown; theme-aware variant if required (light/dark).
3. **Android**: Configure `android.adaptiveIcon` in `app.config.js` (foreground image, background color); provide correctly sized assets per Expo/Android guidelines (e.g. 1024×1024 foreground).
4. **iOS**: Configure app icon for iPhone and iPad (Expo uses top-level `icon` or `ios.icon` if set); provide required sizes (e.g. 1024×1024) and ensure `supportsTablet` icon is appropriate.
5. **Web**: Set `web.favicon` in `app.config.js`; add PWA/manifest icons as needed (e.g. in `public/manifest.json` or via Expo web config). Ensure favicon and **web tablet icon** (e.g. Apple touch icon or large PWA icon for “add to home screen” / tablet) are set and correctly sized.

**Verification**: Build or run on Android, iOS, and Web; confirm app name, logo in UI, and icon/favicon appear correctly in launcher, home screen, browser tab, and when installed as PWA or on tablet.

**Rule Reference**: `tech-stack.mdc`, `theme-design.mdc` (logo variants if theme-dependent)

---

### Step 9.1: Base Layout Primitives (All Platforms, All Sizes)
**Goal**: Create layout frame components (AppFrame, AuthFrame, MainFrame) with slot conventions (header, footer, content). One component per platform file; styles in platform `.styles.jsx`; Fluent look and feel.

**Actions**:
1. Under `src/platform/layouts/`: create `AppFrame/`, `AuthFrame/`, and `src/platform/layouts/frames/MainFrame/` (or equivalent). Per `component-structure.mdc`, each layout in its own folder with `.android.jsx`, `.ios.jsx`, `.web.jsx`, matching `.styles.jsx`, optional hook (e.g. `useAppFrame.js`, `useMainFrame.js`), `types.js`, `index.js`.
2. Implement frames to be responsive: use theme breakpoints and spacing tokens; test at mobile, tablet, desktop, large.
3. Use only theme tokens; Microsoft Fluent styling (subtle radius, light shadows/borders).
4. Export from `src/platform/layouts/index.js`; wire into route group `_layout.jsx` files (import from `@platform/layouts`).

**Verification**: Frames render on Android, iOS, Web; responsive at all breakpoints; pass a11y and theme checks. Tests per `testing.mdc`.

**Rule Reference**: `component-structure.mdc`, `theme-design.mdc`, `platform-ui.mdc`

---

### Step 9.2: Global Header (All Platforms, All Sizes)
**Goal**: Header component(s) with title, actions, optional breadcrumbs. Platform-separated; responsive; Fluent styling; safe area and a11y.

**Actions**:
1. Create `src/platform/components/navigation/GlobalHeader/` with `.android.jsx`, `.ios.jsx`, `.web.jsx`, matching `.styles.jsx`, `types.js`, `index.js`, and optional `useGlobalHeader.js`. Reuse or align with generic `Header/` under same category if present.
2. Implement for all screen sizes (compact on mobile, full on desktop); use breakpoints and tokens.
3. Integrate into layout slots (e.g. `src/platform/layouts/RouteLayouts/MainRouteLayout/`) and route group layouts; ensure no runtime errors.

**Verification**: Header renders on all platforms and sizes; theme and i18n applied; tests per `testing.mdc`.

**Rule Reference**: `component-structure.mdc`, `theme-design.mdc`, `accessibility.mdc`

---

### Step 9.3: Global Footer (All Platforms, All Sizes)
**Goal**: Footer component(s) for status, legal, quick actions. Platform-separated; responsive; Fluent styling.

**Actions**:
1. Create `src/platform/components/navigation/GlobalFooter/` with `.android.jsx`, `.ios.jsx`, `.web.jsx`, matching `.styles.jsx`, `types.js`, `index.js`, and optional `useGlobalFooter.js`.
2. Integrate into layout slots for auth, main (e.g. MainRouteLayout), and any other route groups. Verify no mounting errors.

**Verification**: Footer renders on all platforms and sizes; tests per `testing.mdc`.

**Rule Reference**: `component-structure.mdc`, `theme-design.mdc`

---

### Step 9.4: Primary Navigation Shell (All Platforms, All Sizes)
**Goal**: Navigation (drawer/tab/rail as appropriate) for main (and patient) route groups. Platform-appropriate patterns; Fluent look and feel; wired to real layouts.

**Actions**:
1. Implement route layouts under `src/platform/layouts/RouteLayouts/`: e.g. `MainRouteLayout/` (main app shell with header, sidebar/tabs, content) and `PatientRouteLayout/` if needed. Use `src/platform/components/navigation/` (TabBar, Sidebar, Breadcrumbs, HamburgerIcon, etc.) per `component-structure.mdc`.
2. Responsive behavior: bottom tabs or drawer on mobile, rail/sidebar on desktop; use theme breakpoints.
3. Wire MainRouteLayout (and PatientRouteLayout) into `(main)/_layout.jsx` (and patient group if any); guards/roles from app state; all routes reachable, no runtime errors.

**Verification**: Navigation works on all platforms and sizes; tests per `testing.mdc`.

**Rule Reference**: `app-router.mdc`, `platform-ui.mdc`, `theme-design.mdc`

---

### Step 9.5: Theme Controls (Light/Dark Only)
**Goal**: UI controls to switch between light and dark theme; wired to theme state; persist preference. No high-contrast or other theme variants.

**Actions**:
1. Create `src/platform/components/navigation/ThemeToggle/` (and optionally `ThemeControls/`) with full platform set; add to shell (e.g. header in MainRouteLayout/HeaderUtility).
2. Wire to Redux (`ui.theme`) and persistence; changing theme updates UI without errors.
3. Per `theme-design.mdc`: only light and dark themes exist.

**Verification**: Theme switch works; preference persists; no hydration/render errors.

**Rule Reference**: `theme-design.mdc`, `bootstrap-config.mdc`

---

### Step 9.6: Language Selection Controls
**Goal**: Language selector in shell; wired to i18n; persist selection; all UI text via i18n.

**Actions**:
1. Create `src/platform/components/navigation/LanguageControls/` with full platform set; add to shell (e.g. header or settings). Wire to `@i18n` (createI18n, setLocale) and persistence (e.g. AsyncStorage key from i18n).
2. Ensure all layout/shell text uses i18n keys (no hardcoded strings).
3. Switching language updates UI without runtime errors.

**Verification**: Language switch works; persistence works; tests per `i18n.mdc` and `testing.mdc`.

**Rule Reference**: `i18n.mdc`, `accessibility.mdc`

---

### Step 9.7: Global Banners and Utilities (All Platforms, All Sizes)
**Goal**: Offline/online banner, maintenance banner, loading overlay, toast/notice surface. Platform-separated where applicable; responsive; Fluent styling.

**Actions**:
1. Implement banner/overlay/toast components per `component-structure.mdc` (e.g. under `feedback/` or `states/`).
2. Integrate into layouts; mount/unmount safely across route groups.
3. Use theme tokens and Fluent look and feel; a11y per `accessibility.mdc`.

**Verification**: Banners and utilities work on all platforms and sizes; no unhandled errors.

**Rule Reference**: `platform-ui.mdc`, `theme-design.mdc`, `errors-logging.mdc`

---

### Step 9.8: Responsive and Fluent Verification
**Goal**: Confirm all layouts and global UI work at every breakpoint and on every platform with Microsoft Fluent look and feel.

**Actions**:
1. Test each layout and global component at mobile (320px+), tablet (768px+), desktop (1024px+), large (1440px+).
2. Test on Android, iOS, Web (or simulators).
3. Verify tokens and styling match Fluent (primary blue, neutrals, typography, radius, elevation).
4. Run full test suite; fix any failures; ensure 100% coverage for new code per `testing.mdc`.

**Verification**: Checklist passed for platforms and breakpoints; tests green; Fluent compliance confirmed.

**Rule Reference**: `theme-design.mdc`, `performance.mdc`, `testing.mdc`

---

## Completion Criteria
- **App identity and icons**: App name, logo, and all platform icons (Android, iOS, Web favicon, web/tablet icon) configured and verified per Step 9.0.
- All layout and global UI components implemented for **all platforms** (Android, iOS, Web) and **all screen sizes** (mobile, tablet, desktop, large).
- **Microsoft Fluent / Microsoft 365** look and feel applied (theme tokens, no hardcoded visuals).
- Theme controls: **light and dark only**.
- All steps executed in order; tests passing; rule compliance verified.

**Next Phase**: `P010_core-features.md`
