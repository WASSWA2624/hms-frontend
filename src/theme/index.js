/**
 * Theme Provider & Resolver (light and dark only)
 * File: index.js
 */
import React from 'react';
import { Appearance, Platform } from 'react-native';
import { ThemeProvider as WebThemeProvider } from 'styled-components';
import { ThemeProvider as NativeThemeProvider } from 'styled-components/native';
import lightTheme from './light.theme';
import darkTheme from './dark.theme';

const ThemeProvider = Platform.OS === 'web' ? WebThemeProvider : NativeThemeProvider;

const resolveSystemTheme = () => {
  const systemScheme = Appearance.getColorScheme();
  return systemScheme === 'dark' ? 'dark' : 'light';
};

export function getTheme(mode = 'light') {
  const resolvedMode = mode === 'system' ? resolveSystemTheme() : mode;
  return resolvedMode === 'dark' ? darkTheme : lightTheme;
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

