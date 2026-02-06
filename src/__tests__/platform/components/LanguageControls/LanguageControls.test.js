/**
 * LanguageControls Component Tests
 * Flag button with language list
 */
import React from 'react';
import { fireEvent, render } from '@testing-library/react-native';
import { ThemeProvider as WebThemeProvider } from 'styled-components';
import { ThemeProvider as NativeThemeProvider } from 'styled-components/native';
import LanguageControlsWeb from '@platform/components/navigation/LanguageControls/LanguageControls.web';
import LanguageControlsAndroid from '@platform/components/navigation/LanguageControls/LanguageControls.android';
import LanguageControlsIOS from '@platform/components/navigation/LanguageControls/LanguageControls.ios';
import lightTheme from '@theme/light.theme';

const mockSetLocale = jest.fn();
jest.mock('@hooks', () => ({
  useI18n: () => ({
    t: (key) => key,
    locale: 'en',
  }),
}));

jest.mock('@platform/components/navigation/LanguageControls/useLanguageControls', () => ({
  __esModule: true,
  default: () => ({
    locale: 'en',
    options: [{ label: 'English', value: 'en' }],
    setLocale: mockSetLocale,
  }),
}));

describe('LanguageControls Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders Web variant with flag trigger', () => {
    const { getByLabelText } = render(
      <WebThemeProvider theme={lightTheme}>
        <LanguageControlsWeb testID="web-language-controls" />
      </WebThemeProvider>
    );
    expect(getByLabelText('settings.language.accessibilityLabel')).toBeTruthy();
  });

  it('renders Android variant with flag trigger', () => {
    const { getByLabelText } = render(
      <NativeThemeProvider theme={lightTheme}>
        <LanguageControlsAndroid testID="android-language-controls" />
      </NativeThemeProvider>
    );
    expect(getByLabelText('settings.language.accessibilityLabel')).toBeTruthy();
  });

  it('shows modal when flag pressed on Android', () => {
    const { getByLabelText, getByText } = render(
      <NativeThemeProvider theme={lightTheme}>
        <LanguageControlsAndroid testID="android-language-controls" />
      </NativeThemeProvider>
    );
    fireEvent.press(getByLabelText('settings.language.accessibilityLabel'));
    expect(getByText('English')).toBeTruthy();
  });

  it('renders iOS variant with flag trigger', () => {
    const { getByLabelText } = render(
      <NativeThemeProvider theme={lightTheme}>
        <LanguageControlsIOS testID="ios-language-controls" />
      </NativeThemeProvider>
    );
    expect(getByLabelText('settings.language.accessibilityLabel')).toBeTruthy();
  });

  it('shows modal when flag pressed on iOS', () => {
    const { getByLabelText, getByText } = render(
      <NativeThemeProvider theme={lightTheme}>
        <LanguageControlsIOS testID="ios-language-controls" />
      </NativeThemeProvider>
    );
    fireEvent.press(getByLabelText('settings.language.accessibilityLabel'));
    expect(getByText('English')).toBeTruthy();
  });
});
