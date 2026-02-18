/**
 * SettingsScreen Component Tests
 * File: SettingsScreen.test.js
 */
const React = require('react');
const { fireEvent, render } = require('@testing-library/react-native');
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

const mockT = (key, values = {}) => {
  const messages = {
    'settings.screen.label': 'Settings screen',
    'settings.screen.title': 'Settings',
    'settings.screen.description': 'Manage setup',
    'settings.screen.helpLabel': 'Open settings guidance',
    'settings.screen.helpLabelForModule': 'Open {{module}} guidance',
    'settings.screen.helpTooltip': 'Open setup guidance',
    'settings.screen.helpTooltipForModule': 'Open setup guidance for {{module}}',
    'settings.screen.helpTitle': 'How to use settings',
    'settings.screen.helpTitleForModule': 'How to use {{module}}',
    'settings.screen.helpBody': 'Follow this order',
    'settings.screen.helpBodyForModule': 'Use this checklist for {{module}}',
    'settings.screen.moduleDescription': 'Manage {{module}} setup',
    'settings.screen.helpList.sequence': 'Sequence',
    'settings.screen.helpList.context': 'Context',
    'settings.screen.helpList.access': 'Access',
    'settings.screen.helpList.moduleReview': 'Review {{module}}',
    'settings.screen.helpList.moduleActions': 'Act in {{module}}',
    'settings.screen.helpList.moduleAccess': 'Access {{module}}',
    'settings.general.title': 'General settings',
    'settings.general.description': 'General description',
    'settings.tabs.tenant': 'Tenants',
  };
  const template = messages[key] || key;
  return template.replace(/\{\{(\w+)\}\}/g, (_match, token) => values[token] ?? '');
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

  it('renders route-specific title and guidance copy when screenKey is provided', () => {
    const { getByText } = renderWithTheme(
      <SettingsScreenWeb screenKey="tenant">
        <Text>Settings content</Text>
      </SettingsScreenWeb>
    );
    expect(getByText('Tenants')).toBeTruthy();
    expect(getByText('Manage Tenants setup')).toBeTruthy();
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

  it('opens the android help modal when the help trigger is pressed', () => {
    const { getByTestId, queryByTestId } = renderWithTheme(
      <SettingsScreenAndroid>
        <Text>Settings content</Text>
      </SettingsScreenAndroid>
    );

    expect(queryByTestId('settings-screen-help-modal')).toBeNull();
    fireEvent.press(getByTestId('settings-screen-help-trigger'));
    expect(getByTestId('settings-screen-help-modal')).toBeTruthy();
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

  it('opens the iOS help modal when the help trigger is pressed', () => {
    const { getByTestId, queryByTestId } = renderWithTheme(
      <SettingsScreenIOS>
        <Text>Settings content</Text>
      </SettingsScreenIOS>
    );

    expect(queryByTestId('settings-screen-help-modal')).toBeNull();
    fireEvent.press(getByTestId('settings-screen-help-trigger'));
    expect(getByTestId('settings-screen-help-modal')).toBeTruthy();
  });
});
