import React from 'react';
import { Text } from 'react-native';
import { render } from '@testing-library/react-native';
import fs from 'fs';
import path from 'path';

const mockUseTheme = jest.fn();
const mockThemeProvider = jest.fn(({ children }) => <>{children}</>);

jest.mock('@hooks', () => ({
  useTheme: () => mockUseTheme(),
}));

jest.mock('@theme', () => ({
  ThemeProvider: (props) => mockThemeProvider(props),
}));

import ThemeProviderWrapper from '@platform/layouts/common/ThemeProviderWrapper/ThemeProviderWrapper';
import FaviconHead from '@platform/layouts/common/FaviconHead/FaviconHead';
import {
  getRootLayoutBackgroundColor,
  getRootLayoutIndicatorColor,
} from '@platform/layouts/common/RootLayoutStyles/RootLayoutStyles.styles';

describe('Layout common utilities', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('provides a shared ThemeProviderWrapper component file', () => {
    const filePath = path.join(
      process.cwd(),
      'src',
      'platform',
      'layouts',
      'common',
      'ThemeProviderWrapper',
      'ThemeProviderWrapper.jsx'
    );
    expect(fs.existsSync(filePath)).toBe(true);
  });

  it('resolves theme through useTheme and passes it to ThemeProvider', () => {
    const themeObject = {
      colors: {
        primary: '#0078D4',
        background: {
          primary: '#FFFFFF',
        },
      },
    };
    mockUseTheme.mockReturnValue(themeObject);

    const { getByText } = render(
      <ThemeProviderWrapper>
        <Text>Wrapped Content</Text>
      </ThemeProviderWrapper>
    );

    expect(getByText('Wrapped Content')).toBeTruthy();
    expect(mockThemeProvider).toHaveBeenCalledTimes(1);
    expect(mockThemeProvider.mock.calls[0][0].theme).toBe(themeObject);
  });

  it('keeps explicit Android and iOS ThemeProviderWrapper entry files', () => {
    // eslint-disable-next-line import/no-unresolved
    const ThemeProviderWrapperAndroid = require('@platform/layouts/common/ThemeProviderWrapper/ThemeProviderWrapper.android').default;
    // eslint-disable-next-line import/no-unresolved
    const ThemeProviderWrapperIOS = require('@platform/layouts/common/ThemeProviderWrapper/ThemeProviderWrapper.ios').default;

    mockUseTheme.mockReturnValue({
      colors: {
        primary: '#0078D4',
        background: { primary: '#FFFFFF' },
      },
    });

    const androidRender = render(
      <ThemeProviderWrapperAndroid>
        <Text>Android Wrapper</Text>
      </ThemeProviderWrapperAndroid>
    );
    expect(androidRender.getByText('Android Wrapper')).toBeTruthy();

    const iosRender = render(
      <ThemeProviderWrapperIOS>
        <Text>iOS Wrapper</Text>
      </ThemeProviderWrapperIOS>
    );
    expect(iosRender.getByText('iOS Wrapper')).toBeTruthy();
  });

  it('provides shared and platform no-op FaviconHead implementations for native', () => {
    // eslint-disable-next-line import/no-unresolved
    const FaviconHeadAndroid = require('@platform/layouts/common/FaviconHead/FaviconHead.android').default;
    // eslint-disable-next-line import/no-unresolved
    const FaviconHeadIOS = require('@platform/layouts/common/FaviconHead/FaviconHead.ios').default;

    expect(render(<FaviconHead />).toJSON()).toBeNull();
    expect(render(<FaviconHeadAndroid />).toJSON()).toBeNull();
    expect(render(<FaviconHeadIOS />).toJSON()).toBeNull();
  });

  it('uses shared root layout style token helpers', () => {
    const theme = {
      colors: {
        primary: '#0078D4',
        background: {
          primary: '#FFFFFF',
        },
      },
    };

    expect(getRootLayoutBackgroundColor(theme)).toBe('#FFFFFF');
    expect(getRootLayoutIndicatorColor(theme)).toBe('#0078D4');
  });
});
