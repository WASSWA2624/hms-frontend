const React = require('react');
const { render, fireEvent, act } = require('@testing-library/react-native');
const { ThemeProvider } = require('styled-components/native');
const lightTheme = require('@theme/light.theme').default || require('@theme/light.theme');

jest.mock('@hooks', () => ({
  useI18n: () => ({ t: (key) => key }),
}));

const GlobalDateRangeField = require('@platform/components/forms/GlobalDateRangeField').default;

const renderWithTheme = (component) => render(
  <ThemeProvider theme={lightTheme}>
    {component}
  </ThemeProvider>
);

describe('GlobalDateRangeField', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  it('renders date range controls and emits change events', () => {
    const onFromChange = jest.fn();
    const onToChange = jest.fn();
    const onPresetChange = jest.fn();
    const onClear = jest.fn();

    const { getByTestId } = renderWithTheme(
      <GlobalDateRangeField
        label="Created range"
        presetLabel="Quick range"
        fromLabel="From"
        toLabel="To"
        preset="CUSTOM"
        fromValue=""
        toValue=""
        onFromChange={onFromChange}
        onToChange={onToChange}
        onPresetChange={onPresetChange}
        onClear={onClear}
        testID="global-date-range"
      />
    );

    fireEvent.changeText(getByTestId('global-date-range-from'), '2026-01-01');
    fireEvent.changeText(getByTestId('global-date-range-to'), '2026-01-31');
    act(() => {
      jest.advanceTimersByTime(350);
    });
    fireEvent.press(getByTestId('global-date-range-clear'));

    expect(onFromChange).toHaveBeenCalledWith('2026-01-01');
    expect(onToChange).toHaveBeenCalledWith('2026-01-31');
    expect(onClear).toHaveBeenCalledTimes(1);
    expect(getByTestId('global-date-range-preset')).toBeTruthy();
  });
});
