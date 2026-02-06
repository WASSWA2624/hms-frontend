/**
 * ThemeProviderWrapper – Native (iOS/Android)
 * No createGlobalStyle (not available in styled-components/native).
 */
import React from 'react';
import { useSelector } from 'react-redux';
import { ThemeProvider as BaseThemeProvider } from '@theme';
import { selectTheme } from '@store/selectors';

const ThemeProviderWrapper = ({ children }) => {
  const themeMode = useSelector(selectTheme);
  const mode = themeMode === 'dark' ? 'dark' : 'light';
  return <BaseThemeProvider theme={mode}>{children}</BaseThemeProvider>;
};

export default ThemeProviderWrapper;
