/**
 * Theme Provider & Resolver
 * File: index.js
 */
import React from 'react';
import { Platform } from 'react-native';
import { ThemeProvider as WebThemeProvider } from 'styled-components';
import { ThemeProvider as NativeThemeProvider } from 'styled-components/native';
import lightTheme from './light.theme';
import darkTheme from './dark.theme';
import highContrastTheme from './high-contrast.theme';

const ThemeProvider = Platform.OS === 'web' ? WebThemeProvider : NativeThemeProvider;

// #region agent log
globalThis.__themeProviderInitCount = (globalThis.__themeProviderInitCount || 0) + 1;
fetch('http://127.0.0.1:7249/ingest/0ca3e34c-db2d-4973-878f-b50eb78eba91',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({sessionId:'debug-session',runId:'pre-fix',hypothesisId:'B',location:'theme/index.js:14',message:'Theme provider resolved',data:{count:globalThis.__themeProviderInitCount,platform:Platform.OS,provider:Platform.OS === 'web' ? 'web' : 'native'},timestamp:Date.now()})}).catch(()=>{});
// #endregion

export function getTheme(mode = 'light') {
  switch (mode) {
    case 'dark':
      return darkTheme;
    case 'high-contrast':
      return highContrastTheme;
    default:
      return lightTheme;
  }
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
export { lightTheme, darkTheme, highContrastTheme };

export default {
  ThemeProvider: ThemeProviderWrapper,
  lightTheme,
  darkTheme,
  highContrastTheme,
  getTheme,
};

