/**
 * Theme Provider & Resolver Tests
 * File: index.test.js
 * Step 3.11
 */

const getCjsOrEsmDefault = (mod) => mod?.default ?? mod;

describe('Theme Provider & Resolver (Step 3.11)', () => {
  it('should render theme provider', () => {
    const themeIndex = require('@theme');
    const api = getCjsOrEsmDefault(themeIndex);

    expect(api.ThemeProvider).toBeDefined();
    expect(typeof api.ThemeProvider).toBe('function');
  });

  it('should have theme resolver (getTheme function)', () => {
    const themeIndex = require('@theme');
    const api = getCjsOrEsmDefault(themeIndex);

    expect(api.getTheme).toBeDefined();
    expect(typeof api.getTheme).toBe('function');
  });

  it('should switch themes correctly (light and dark only)', () => {
    const themeIndex = require('@theme');
    const api = getCjsOrEsmDefault(themeIndex);
    const lightTheme = getCjsOrEsmDefault(require('@theme/light.theme'));
    const darkTheme = getCjsOrEsmDefault(require('@theme/dark.theme'));

    expect(api.getTheme('light')).toEqual(lightTheme);
    expect(api.getTheme('dark')).toEqual(darkTheme);
    expect(api.getTheme()).toEqual(lightTheme); // default
    expect(api.getTheme('invalid')).toEqual(lightTheme); // unknown falls back to light
  });

  it('should export light and dark themes only', () => {
    const themeIndex = require('@theme');
    const api = getCjsOrEsmDefault(themeIndex);

    expect(api.lightTheme).toBeDefined();
    expect(api.darkTheme).toBeDefined();
    expect(api.lightTheme.mode).toBe('light');
    expect(api.darkTheme.mode).toBe('dark');
  });
});

