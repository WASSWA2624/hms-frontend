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

const ThemeProvider = Platform.OS === 'web' ? WebThemeProvider : NativeThemeProvider;

/** Light and dark only per theme-design.mdc. */
export function getTheme(mode = 'light') {
  return mode === 'dark' ? darkTheme : lightTheme;
}

export function ThemeProviderWrapper({ children, theme = 'light' }) {
  const themeObj = getTheme(theme);
  return (
    <ThemeProvider theme={themeObj}>
      {children}
    </ThemeProvider>
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

