/**
 * SettingsScreen Component Tests
 * File: SettingsScreen.test.js
 */
const React = require('react');
const { render } = require('@testing-library/react-native');
const { ThemeProvider } = require('styled-components/native');
const { Text } = require('react-native');
const { useI18n } = require('@hooks');
const lightTheme = require('@theme/light.theme').default || require('@theme/light.theme');

jest.mock('@hooks', () => ({
  useI18n: jest.fn(),
}));

const SettingsScreenWeb = require('@platform/screens/settings/SettingsScreen/SettingsScreen.web').default;
const SettingsScreenAndroid = require('@platform/screens/settings/SettingsScreen/SettingsScreen.android').default;
const SettingsScreenIOS = require('@platform/screens/settings/SettingsScreen/SettingsScreen.ios').default;

const renderWithTheme = (component) => render(
  <ThemeProvider theme={lightTheme}>
    {component}
  </ThemeProvider>
);

const mockT = (key) => {
  const messages = {
    'settings.screen.label': 'Settings screen',
    'settings.screen.title': 'Settings',
    'settings.screen.description': 'Manage setup',
    'settings.screen.helpLabel': 'Open settings guidance',
    'settings.screen.helpTooltip': 'Open setup guidance',
    'settings.screen.helpTitle': 'How to use settings',
    'settings.screen.helpBody': 'Follow this order',
    'settings.screen.helpList.sequence': 'Sequence',
    'settings.screen.helpList.context': 'Context',
    'settings.screen.helpList.access': 'Access',
  };
  return messages[key] || key;
};

describe('SettingsScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    useI18n.mockReturnValue({ t: mockT });
  });

  it('renders web container and children', () => {
    const { getByTestId, getByText } = renderWithTheme(
      <SettingsScreenWeb>
        <Text>Settings content</Text>
      </SettingsScreenWeb>
    );
    expect(getByTestId('settings-screen')).toBeTruthy();
    expect(getByTestId('settings-screen-help-trigger')).toBeTruthy();
    expect(getByText('Settings content')).toBeTruthy();
  });

  it('renders android container and children', () => {
    const { getByTestId, getByText } = renderWithTheme(
      <SettingsScreenAndroid>
        <Text>Settings content</Text>
      </SettingsScreenAndroid>
    );
    expect(getByTestId('settings-screen')).toBeTruthy();
    expect(getByTestId('settings-screen-help-trigger')).toBeTruthy();
    expect(getByText('Settings content')).toBeTruthy();
  });

  it('renders iOS container and children', () => {
    const { getByTestId, getByText } = renderWithTheme(
      <SettingsScreenIOS>
        <Text>Settings content</Text>
      </SettingsScreenIOS>
    );
    expect(getByTestId('settings-screen')).toBeTruthy();
    expect(getByTestId('settings-screen-help-trigger')).toBeTruthy();
    expect(getByText('Settings content')).toBeTruthy();
  });
});
