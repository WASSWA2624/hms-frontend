const React = require('react');
const { fireEvent, render } = require('@testing-library/react-native');

const mockBack = jest.fn();
const mockReplace = jest.fn();
const mockCanGoBack = jest.fn(() => true);

jest.mock('expo-router', () => ({
  useRouter: () => ({
    back: mockBack,
    replace: mockReplace,
    canGoBack: mockCanGoBack,
  }),
}));

jest.mock('@hooks', () => ({
  useI18n: () => ({
    t: (key) => key,
  }),
}));

jest.mock('@platform/components', () => {
  const ReactLocal = require('react');
  const { Pressable, Text: NativeText } = require('react-native');

  return {
    Button: ({ children, onPress, testID }) => (
      <Pressable onPress={onPress} testID={testID}>
        <NativeText>{children}</NativeText>
      </Pressable>
    ),
    Text: ({ children }) => <NativeText>{children}</NativeText>,
  };
});

describe('Public Terms Route', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockCanGoBack.mockReturnValue(true);
  });

  test('renders terms route content and back button', () => {
    const Route = require('../../../app/(public)/terms').default;
    const { getByTestId } = render(<Route />);

    expect(getByTestId('terms-route-scroll')).toBeTruthy();
    expect(getByTestId('terms-route-back')).toBeTruthy();
    expect(getByTestId('terms-route-confirm-read')).toBeTruthy();
  });

  test('uses router.back when history is available', () => {
    const Route = require('../../../app/(public)/terms').default;
    const { getByTestId } = render(<Route />);

    fireEvent.press(getByTestId('terms-route-back'));
    expect(mockBack).toHaveBeenCalled();
    expect(mockReplace).not.toHaveBeenCalled();
  });

  test('falls back to landing when history is unavailable', () => {
    mockCanGoBack.mockReturnValue(false);
    const Route = require('../../../app/(public)/terms').default;
    const { getByTestId } = render(<Route />);

    fireEvent.press(getByTestId('terms-route-back'));
    expect(mockReplace).toHaveBeenCalledWith('/landing');
  });

  test('confirm read action uses same safe navigation behavior', () => {
    mockCanGoBack.mockReturnValue(true);
    const Route = require('../../../app/(public)/terms').default;
    const { getByTestId } = render(<Route />);

    fireEvent.press(getByTestId('terms-route-confirm-read'));
    expect(mockBack).toHaveBeenCalled();
  });
});
