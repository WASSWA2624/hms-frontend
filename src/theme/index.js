/**
 * Theme Provider & Resolver (light and dark only)
 * File: index.js
 */
import React from 'react';
import { Platform } from 'react-native';
import { ThemeProvider as WebThemeProvider } from 'styled-components';
import { ThemeProvider as NativeThemeProvider } from 'styled-components/native';
import lightTheme from './light.theme';
import darkTheme from './dark.theme';

/** Light and dark only per theme-design.mdc. */
export function getTheme(mode = 'light') {
  return mode === 'dark' ? darkTheme : lightTheme;
}

const resolveThemeObject = (theme) => {
  if (theme && typeof theme === 'object') return theme;
  if (typeof theme === 'string') return getTheme(theme);
  return getTheme('light');
};

export function ThemeProviderWrapper({ children, theme = 'light' }) {
  const themeObj = resolveThemeObject(theme);
  if (Platform.OS === 'web') {
    return (
      <WebThemeProvider theme={themeObj}>
        <NativeThemeProvider theme={themeObj}>
          {children}
        </NativeThemeProvider>
      </WebThemeProvider>
    );
  }

  return (
    <NativeThemeProvider theme={themeObj}>
      {children}
    </NativeThemeProvider>
  );
}

export { ThemeProviderWrapper as ThemeProvider };
export { lightTheme, darkTheme };

export default {
  ThemeProvider: ThemeProviderWrapper,
  lightTheme,
  darkTheme,
  getTheme,
};

