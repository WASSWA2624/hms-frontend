import React from 'react';
import { ThemeProvider as BaseThemeProvider } from '@theme';
import { useTheme } from '@hooks';

const ThemeProviderWrapper = ({ children }) => {
  const theme = useTheme();
  return <BaseThemeProvider theme={theme}>{children}</BaseThemeProvider>;
};

export default ThemeProviderWrapper;
