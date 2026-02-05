/**
 * ThemeProviderWrapper – Web
 * Uses createGlobalStyle (web-only). Native uses ThemeProviderWrapper.native.jsx.
 */
import React from 'react';
import { useSelector } from 'react-redux';
import { createGlobalStyle } from 'styled-components';
import { ThemeProvider as BaseThemeProvider } from '@theme';
import { selectTheme } from '@store/selectors';

const GlobalStyle = createGlobalStyle`
  html, body {
    margin: 0;
    padding: 0;
    width: 100%;
    max-width: 100%;
    overflow-x: hidden;
  }
  #root, [data-reactroot] {
    margin: 0;
    padding: 0;
    width: 100%;
    max-width: 100%;
  }
`;

const ThemeProviderWrapper = ({ children }) => {
  const themeMode = useSelector(selectTheme);
  return (
    <BaseThemeProvider theme={themeMode}>
      <GlobalStyle />
      {children}
    </BaseThemeProvider>
  );
};

export default ThemeProviderWrapper;
