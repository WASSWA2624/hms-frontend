# Phase 0: Project Setup & Initialization

## Purpose
Initialize the Expo React Native project with correct structure, dependencies, and configuration. Follows rules defined in `.cursor/rules/`.

## Prerequisites
- Node.js >= 20.0.0
- npm or yarn
- Expo CLI installed globally or via npx
- Git repository initialized

## Steps

### Step 0.1: Initialize Expo Project
**Goal**: Create Expo project with App Router support

**Actions**:
1. From the **frontend app root** (e.g. `hms-frontend/`), run: `npx create-expo-app@latest . --template blank`
2. Ensure Expo SDK ~54.0.0 (per `.cursor/rules/tech-stack.mdc`)
3. Verify `app.config.js` exists

**Verification**:
- `package.json` exists with Expo dependencies
- `app.config.js` exists
- `index.js` entry point exists

**Rule Reference**: `.cursor/rules/tech-stack.mdc`

---

### Step 0.2: Install Redux Toolkit Stack
**Goal**: Install Redux Toolkit and related state management dependencies

**Actions**:
1. Install Redux Toolkit stack:
   ```bash
   npm install @reduxjs/toolkit@^2.11.2 react-redux@^9.2.0 redux-persist@^6.0.0
   ```

**Verification**:
- `@reduxjs/toolkit`, `react-redux`, `redux-persist` in `package.json` with correct versions
- No peer dependency warnings

**Rule Reference**: `.cursor/rules/tech-stack.mdc`, `.cursor/rules/dependency-policy.mdc`

---

### Step 0.3: Install Styled Components
**Goal**: Install styled-components for theming

**Actions**:
1. Install styled-components:
   ```bash
   npm install styled-components@^6.1.19
   ```

**Verification**:
- `styled-components` in `package.json` with correct version
- No peer dependency warnings

**Rule Reference**: `.cursor/rules/tech-stack.mdc`, `.cursor/rules/dependency-policy.mdc`

---

### Step 0.4: Install Validation Library
**Goal**: Install Zod for validation

**Actions**:
1. Install validation:
   ```bash
   npm install zod@^4.2.1
   ```

**Verification**:
- `zod` in `package.json` with correct version
- No peer dependency warnings

**Rule Reference**: `.cursor/rules/tech-stack.mdc`, `.cursor/rules/dependency-policy.mdc`

---

### Step 0.5: Install Testing Dependencies
**Goal**: Install Jest and testing libraries

**Actions**:
1. Install testing:
   ```bash
   npm install --save-dev jest@^29.7.0 jest-expo@^54.0.0 @testing-library/react-native@^13.3.3 @testing-library/jest-native@^5.4.3 react-test-renderer@19.1.0
   ```

**Verification**:
- All testing packages in `package.json` with correct versions
- No peer dependency warnings

**Rule Reference**: `.cursor/rules/tech-stack.mdc`, `.cursor/rules/testing.mdc`, `.cursor/rules/dependency-policy.mdc`

---

### Step 0.6: Install i18n Dependencies
**Goal**: Install internationalization dependencies

**Actions**:
1. Install i18n:
   ```bash
   npm install expo-localization@^17.0.8
   ```

**Verification**:
- `expo-localization` in `package.json` with correct version
- No peer dependency warnings

**Rule Reference**: `.cursor/rules/tech-stack.mdc`, `.cursor/rules/i18n.mdc`, `.cursor/rules/dependency-policy.mdc`

---

### Step 0.7: Install Storage Dependencies
**Goal**: Install AsyncStorage and SecureStore

**Actions**:
1. Install storage dependencies:
   ```bash
   npm install @react-native-async-storage/async-storage@2.2.0 expo-secure-store@~15.0.8
   ```

**Verification**:
- `@react-native-async-storage/async-storage` and `expo-secure-store` in `package.json` with correct versions
- No peer dependency warnings

**Rule Reference**: `.cursor/rules/tech-stack.mdc`, `.cursor/rules/dependency-policy.mdc`

---

### Step 0.8: Install Network Detection
**Goal**: Install NetInfo for network connectivity

**Actions**:
1. Install network detection:
   ```bash
   npm install @react-native-community/netinfo@11.4.1
   ```

**Verification**:
- `@react-native-community/netinfo` in `package.json` with correct version
- No peer dependency warnings

**Rule Reference**: `.cursor/rules/tech-stack.mdc`, `.cursor/rules/offline-sync.mdc`, `.cursor/rules/dependency-policy.mdc`

---

### Step 0.9: Install Expo Modules
**Goal**: Install required Expo modules

**Actions**:
1. Install Expo modules:
   ```bash
   npm install expo-constants@~18.0.12 expo-linking@~8.0.11 expo-status-bar@~3.0.9
   ```

**Verification**:
- All Expo modules in `package.json` with correct versions
- No peer dependency warnings

**Rule Reference**: `.cursor/rules/tech-stack.mdc`, `.cursor/rules/dependency-policy.mdc`

---

### Step 0.10: Install React Native Core Dependencies
**Goal**: Install React Native navigation and safe area dependencies

**Actions**:
1. Install React Native core dependencies:
   ```bash
   npm install react-native-safe-area-context@~5.6.0 react-native-screens@~4.16.0 react-native-web@^0.21.0
   ```

**Verification**:
- All React Native packages in `package.json` with correct versions
- No peer dependency warnings

**Rule Reference**: `.cursor/rules/tech-stack.mdc`, `.cursor/rules/dependency-policy.mdc`

---

### Step 0.11: Install PWA Dependencies
**Goal**: Install PWA dependencies for web platform

**Actions**:
1. Install PWA dependencies (for web):
   ```bash
   npm install --save-dev workbox-webpack-plugin@^7.4.0
   ```

**Verification**:
- `workbox-webpack-plugin` in `package.json` with correct version
- No peer dependency warnings

**Rule Reference**: `.cursor/rules/tech-stack.mdc`, `.cursor/rules/dependency-policy.mdc`

---

### Step 0.12: Install Linting Dependencies
**Goal**: Install ESLint and Prettier

**Actions**:
1. Install linting:
   ```bash
   npm install --save-dev eslint@^9.39.2 eslint-config-expo@^10.0.0 prettier@^3.7.4 eslint-config-prettier@^10.1.8
   ```

**Verification**:
- All linting packages in `package.json` with correct versions
- No peer dependency warnings

**Rule Reference**: `.cursor/rules/tech-stack.mdc`, `.cursor/rules/coding-conventions.mdc`, `.cursor/rules/dependency-policy.mdc`

---

### Step 0.13: Verify All Dependencies
**Goal**: Verify all dependencies are correctly installed and compatible

**Actions**:
1. Verify `package.json` contains all required dependencies with correct versions
2. Verify `package-lock.json` is committed
3. Verify no TypeScript dependencies are installed
4. Verify React 19.1.0, React Native 0.81.5, Expo SDK ~54.0.0
5. Verify all dependencies match versions in `.cursor/rules/tech-stack.mdc`
6. **Compatibility testing** (per `.cursor/rules/dependency-policy.mdc`):
   - No peer dependency warnings during installation
   - All platforms build successfully (Android, iOS, Web)
   - No runtime errors on app startup

**Verification**:
- All packages in `package.json` with correct versions
- `package-lock.json` committed
- No TypeScript dependencies
- React 19.1.0, React Native 0.81.5, Expo SDK ~54.0.0
- All dependencies match versions in `.cursor/rules/tech-stack.mdc`
- **Compatibility testing completed** (see `.cursor/rules/dependency-policy.mdc` for requirements)
  - No peer dependency warnings
  - All platforms build successfully (Android, iOS, Web)
  - No runtime errors on app startup

**Rule Reference**: `.cursor/rules/tech-stack.mdc`, `.cursor/rules/dependency-policy.mdc`

---

### Step 0.14: Create Project Structure
**Goal**: Create all required folders

**Actions**:
1. Create `src/` directory
2. Create all required folders (empty) per `.cursor/rules/project-structure.mdc`:
   ```
   src/
   ├── app/
   ├── platform/
   │   ├── components/
   │   ├── screens/
   │   └── layouts/
   ├── theme/
   │   └── tokens/
   ├── store/
   │   ├── slices/
   │   └── selectors/
   ├── features/
   ├── services/
   │   ├── api/
   │   ├── storage/
   │   └── analytics/
   ├── offline/
   ├── workers/
   ├── security/
   ├── navigation/
   │   └── guards/
   ├── hooks/
   ├── utils/
   ├── bootstrap/
   ├── config/
   ├── i18n/
   ├── accessibility/
   ├── errors/
   ├── logging/
   ├── flags/
   └── __tests__/
       ├── components/
       ├── screens/
       ├── features/
       └── utils/
   ```

**Verification**:
- All folders exist
- Structure matches `.cursor/rules/project-structure.mdc`

---

### Step 0.15: Configure Babel with Aliases
**Goal**: Set up absolute imports via aliases

**Actions**:
1. Install `babel-plugin-module-resolver`:
   ```bash
   npm install --save-dev babel-plugin-module-resolver@^5.0.2
   ```
2. Create/update `babel.config.js`:
   ```javascript
   module.exports = function (api) {
     api.cache(true);
     return {
       presets: ['babel-preset-expo'],
       plugins: [
         [
           'module-resolver',
           {
             root: ['./src'],
             alias: {
               '@': './src',
               '@app': './src/app',
               '@platform': './src/platform',
               '@theme': './src/theme',
               '@store': './src/store',
               '@features': './src/features',
               '@services': './src/services',
               '@offline': './src/offline',
               '@security': './src/security',
               '@hooks': './src/hooks',
               '@utils': './src/utils',
               '@config': './src/config',
               '@i18n': './src/i18n',
               '@errors': './src/errors',
               '@logging': './src/logging',
               '@bootstrap': './src/bootstrap',
               '@navigation': './src/navigation',
               '@debug': './src/debug',
             },
           },
         ],
       ],
     };
   };
   ```

**Verification**:
- `babel.config.js` exists; aliases include `@debug` (`.cursor/rules/coding-conventions.mdc`)

---

### Step 0.16: Create Debug Folder Structure and npm Scripts
**Goal**: Set up debug resources per `.cursor/rules/debug.mdc` (log capture, scripts; dev-only).

**Actions**:
1. Create at project root: `debug/` with `.gitkeep` and `README.md` (log file reference and commands). Ensure `.gitignore` includes `debug/*.log`.
2. Create `scripts/debug/` for ESM scripts (`.mjs`). Scripts write to root `debug/` (expo, android, ios, web log files per `debug.mdc`).
3. Add to `package.json` scripts: `debug:expo`, `debug:android`, `debug:ios`, `debug:web`, `debug:all` (see `.cursor/rules/debug.mdc`).
4. Create `src/debug/` for in-app debug code (web console logger implemented in Phase 8).

**Verification**:
- `debug/`, `scripts/debug/`, `src/debug/` exist; npm run debug:* scripts defined.

**Rule Reference**: `.cursor/rules/debug.mdc`, `.cursor/rules/project-structure.mdc`

---

### Step 0.17: Configure Metro Bundler
**Goal**: Configure Metro for optimal bundling

**Actions**:
1. Create `metro.config.js`:
   ```javascript
   const { getDefaultConfig } = require('expo/metro-config');

   const config = getDefaultConfig(__dirname);

   module.exports = config;
   ```

**Verification**:
- `metro.config.js` exists
- Metro starts without errors

---

### Step 0.19: Configure ESLint & Prettier
**Goal**: Set up linting and formatting

**Actions**:
1. Create `eslint.config.js` (ESLint v9 flat config):
   ```javascript
   const { defineConfig } = require('eslint/config');

   const globals = require('globals');

   const coreConfig = require('eslint-config-expo/flat/utils/core');
   const expoConfig = require('eslint-config-expo/flat/utils/expo');
   const reactConfig = require('eslint-config-expo/flat/utils/react');
   const { jsExtensions } = require('eslint-config-expo/flat/utils/extensions');
   const eslintConfigPrettier = require('eslint-config-prettier/flat');

   module.exports = defineConfig([
     // NOTE: We intentionally do NOT include eslint-config-expo's typescript flat config
     // because this project forbids TypeScript (and does not install `typescript`).
     ...coreConfig,
     ...reactConfig,
     ...expoConfig,
     {
       settings: {
         'import/extensions': jsExtensions,
         'import/resolver': {
           node: { extensions: jsExtensions },
         },
       },
       languageOptions: {
         globals: {
           ...globals.browser,
           __DEV__: 'readonly',
         },
       },
     },
     // Keep formatting conflicts disabled; Prettier is run separately (no eslint-plugin-prettier).
     eslintConfigPrettier,
     {
       rules: {
         'no-console': ['warn', { allow: ['warn', 'error'] }],
         'react/no-unescaped-entities': 'off',
       },
     },
   ]);
   ```
2. Create `.prettierrc`:
   ```json
   {
     "semi": true,
     "singleQuote": true,
     "tabWidth": 2,
     "trailingComma": "es5"
   }
   ```
3. Create `.prettierignore`:
   ```
   node_modules/
   .expo/
   dist/
   build/
   ```

**Verification**:
- ESLint runs without errors
- Prettier formats correctly
- No TypeScript rules

---

### Step 0.20: Configure Jest
**Goal**: Set up testing framework

**Actions**:
1. Create `jest.config.js`:
   ```javascript
   module.exports = {
     preset: 'jest-expo',
     setupFiles: ['<rootDir>/jest.setup.js'],
     transformIgnorePatterns: [
       'node_modules/(?!((jest-)?react-native|@react-native(-community)?)|expo(nent)?|@expo(nent)?/.*|@expo-google-fonts/.*|react-navigation|@react-navigation/.*|@unimodules/.*|unimodules|sentry-expo|native-base|react-native-svg)',
     ],
     testMatch: ['**/__tests__/**/*.test.js'],
     collectCoverageFrom: [
       'src/**/*.{js,jsx}',
       '!src/**/*.test.{js,jsx}',
       '!src/**/index.{js,jsx}',
     ],
     passWithNoTests: true,
   };
   ```
2. Update `package.json` scripts:
   ```json
   {
     "scripts": {
       "test": "jest",
       "test:watch": "jest --watch",
       "test:coverage": "jest --coverage"
     }
   }
   ```

**Verification**:
- Jest runs without errors
- Test files are detected

**Rule Reference**: `.cursor/rules/testing.mdc`

---

### Step 0.21: Create .gitignore
**Goal**: Exclude unnecessary files from version control

**Actions**:
1. Create `.gitignore`:
   ```
   # Dependencies
   node_modules/
   # NOTE: lockfiles MUST be committed for reproducible builds (see `.cursor/rules/tech-stack.mdc`)

   # Expo
   .expo/
   dist/
   web-build/

   # Environment
   .env
   .env.local

   # IDE
   .vscode/
   .idea/
   *.swp
   *.swo

   # OS
   .DS_Store
   Thumbs.db

   # Logs (debug/*.log per .cursor/rules/debug.mdc)
   *.log
   debug/*.log
   npm-debug.log*

   # Testing
   coverage/
   ```

**Verification**:
- `.gitignore` exists
- Sensitive files excluded
- Reminder: env files are ignored, but **do not put secrets in client env/config** (see `.cursor/rules/security.mdc` and `.cursor/rules/bootstrap-config.mdc`).

---

### Step 0.22: Verify Setup
**Goal**: Ensure project is ready for development

**Actions**:
1. Run `npm install`
2. Run `npx expo start` (should start without errors)
3. Run `npm test` (should pass with no tests)
4. Verify folder structure matches `.cursor/rules/project-structure.mdc`

**Verification Checklist**:
- ✅ All dependencies installed
- ✅ Expo starts successfully
- ✅ Jest runs successfully
- ✅ Folder structure correct
- ✅ Babel aliases configured
- ✅ ESLint/Prettier configured
- ✅ No TypeScript files
- ✅ `.gitignore` in place
- ✅ **Compatibility testing completed** (see `.cursor/rules/dependency-policy.mdc`):
  - ✅ No peer dependency warnings during installation
  - ✅ All platforms build successfully (Android, iOS, Web)
  - ✅ No runtime errors on app startup
  - ✅ Metro bundler works without errors

---

## Completion Criteria
- Project initialized with Expo
- All dependencies installed
- Folder structure created
- Build tools configured
- Testing framework ready
- Ready to proceed to Phase 1

**Next Phase**: `P001_foundation.md`

