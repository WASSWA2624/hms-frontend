const React = require('react');
const { render, fireEvent, act } = require('@testing-library/react-native');
const { ThemeProvider } = require('styled-components/native');
const lightTheme = require('@theme/light.theme').default || require('@theme/light.theme');

const GlobalSmartDateField = require('@platform/components/forms/GlobalSmartDateField').default;

const renderWithTheme = (component) => render(
  <ThemeProvider theme={lightTheme}>
    {component}
  </ThemeProvider>
);

describe('GlobalSmartDateField', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  it('normalizes and emits a date-only value', () => {
    const onValueChange = jest.fn();
    const onChangeText = jest.fn();
    const onChange = jest.fn();

    const { getByTestId } = renderWithTheme(
      <GlobalSmartDateField
        value="2026-02-23T09:30:00.000Z"
        onValueChange={onValueChange}
        onChangeText={onChangeText}
        onChange={onChange}
        testID="global-smart-date-field"
      />
    );

    fireEvent.changeText(getByTestId('global-smart-date-field'), '2026-03-01');
    act(() => {
      jest.advanceTimersByTime(350);
    });

    expect(onValueChange).toHaveBeenCalledWith('2026-03-01');
    expect(onChangeText).toHaveBeenCalledWith('2026-03-01');
    expect(onChange).toHaveBeenCalledWith(
      expect.objectContaining({
        target: { value: '2026-03-01' },
      })
    );
  });
});
