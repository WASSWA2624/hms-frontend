/**
 * ThemeControls Component Tests
 * Theme toggle (light/dark)
 */
import React from 'react';
import { fireEvent, render } from '@testing-library/react-native';
import { ThemeProvider as WebThemeProvider } from 'styled-components';
import { ThemeProvider as NativeThemeProvider } from 'styled-components/native';
import ThemeControlsWeb from '@platform/components/navigation/ThemeControls/ThemeControls.web';
import ThemeControlsAndroid from '@platform/components/navigation/ThemeControls/ThemeControls.android';
import ThemeControlsIOS from '@platform/components/navigation/ThemeControls/ThemeControls.ios';
import lightTheme from '@theme/light.theme';
import { THEME_MODES } from '@platform/components/navigation/ThemeControls/types';

const mockSetTheme = jest.fn();
jest.mock('@hooks', () => ({
  useI18n: () => ({
    t: (key) => key,
    locale: 'en',
  }),
}));

jest.mock('@platform/components/navigation/ThemeControls/useThemeControls', () => ({
  __esModule: true,
  default: () => ({
    theme: 'light',
    setTheme: mockSetTheme,
  }),
}));

describe('ThemeControls Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders Web variant with theme toggle (single icon at current mode)', () => {
    const { getByLabelText } = render(
      <WebThemeProvider theme={lightTheme}>
        <ThemeControlsWeb testID="web-theme-controls" />
      </WebThemeProvider>
    );
    expect(getByLabelText('settings.theme.options.light')).toBeTruthy();
  });

  it('calls setTheme when Web toggle clicked (light -> dark)', () => {
    const { getByLabelText } = render(
      <WebThemeProvider theme={lightTheme}>
        <ThemeControlsWeb testID="web-theme-controls" />
      </WebThemeProvider>
    );
    fireEvent.press(getByLabelText('settings.theme.options.light'));
    expect(mockSetTheme).toHaveBeenCalledWith(THEME_MODES.DARK);
  });

  it('renders Android variant with theme toggle (single icon at current mode)', () => {
    const { getByLabelText } = render(
      <NativeThemeProvider theme={lightTheme}>
        <ThemeControlsAndroid testID="android-theme-controls" />
      </NativeThemeProvider>
    );
    expect(getByLabelText('settings.theme.options.light')).toBeTruthy();
  });

  it('calls setTheme when Android toggle pressed (light -> dark)', () => {
    const { getByLabelText } = render(
      <NativeThemeProvider theme={lightTheme}>
        <ThemeControlsAndroid testID="android-theme-controls" />
      </NativeThemeProvider>
    );
    fireEvent.press(getByLabelText('settings.theme.options.light'));
    expect(mockSetTheme).toHaveBeenCalledWith(THEME_MODES.DARK);
  });

  it('renders iOS variant with theme toggle (single icon at current mode)', () => {
    const { getByLabelText } = render(
      <NativeThemeProvider theme={lightTheme}>
        <ThemeControlsIOS testID="ios-theme-controls" />
      </NativeThemeProvider>
    );
    expect(getByLabelText('settings.theme.options.light')).toBeTruthy();
  });

  it('calls setTheme when iOS toggle pressed (light -> dark)', () => {
    const { getByLabelText } = render(
      <NativeThemeProvider theme={lightTheme}>
        <ThemeControlsIOS testID="ios-theme-controls" />
      </NativeThemeProvider>
    );
    fireEvent.press(getByLabelText('settings.theme.options.light'));
    expect(mockSetTheme).toHaveBeenCalledWith(THEME_MODES.DARK);
  });
});
