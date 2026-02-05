/**
 * SettingsScreen Index
 * File: index.js
 *
 * Per component-structure.mdc: Barrel export for platform-specific implementations.
 * Default is platform-resolved so native loads .android/.ios (not .web.styles with withConfig).
 */
export { default } from './SettingsScreen';
export { default as SettingsScreenWeb } from './SettingsScreen.web';
export { default as SettingsScreenAndroid } from './SettingsScreen.android';
export { default as SettingsScreenIOS } from './SettingsScreen.ios';
