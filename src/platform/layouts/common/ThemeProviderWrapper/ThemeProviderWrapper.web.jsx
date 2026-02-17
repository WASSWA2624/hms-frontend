import React from 'react';
import { createGlobalStyle } from 'styled-components';
import ThemeProviderWrapper from './ThemeProviderWrapper.jsx';

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

const ThemeProviderWrapperWeb = ({ children }) => {
  return (
    <ThemeProviderWrapper>
      <GlobalStyle />
      {children}
    </ThemeProviderWrapper>
  );
};

export default ThemeProviderWrapperWeb;
