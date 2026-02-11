const React = require('react');
const { render, waitFor } = require('@testing-library/react-native');
const { act } = require('react-test-renderer');

const mockPush = jest.fn();
const mockParams = { current: {} };
const mockReadOnboardingEntry = jest.fn();
const mockSaveOnboardingEntry = jest.fn();
const mockMapFacilityToBackendType = jest.fn();
const mockLandingScreen = jest.fn(() => null);

jest.mock('expo-router', () => ({
  useRouter: () => ({ push: mockPush }),
  useLocalSearchParams: () => mockParams.current,
}));

jest.mock('@hooks', () => ({
  useI18n: () => ({ t: (key) => key }),
}));

jest.mock('@navigation/onboardingEntry', () => ({
  mapFacilityToBackendType: (...args) => mockMapFacilityToBackendType(...args),
  readOnboardingEntry: (...args) => mockReadOnboardingEntry(...args),
  resolveFacilitySelection: (value) => {
    const normalized = String(value || '').trim().toLowerCase();
    return ['clinic', 'hospital', 'lab', 'pharmacy', 'emergency'].includes(normalized) ? normalized : null;
  },
  saveOnboardingEntry: (...args) => mockSaveOnboardingEntry(...args),
}));

jest.mock('@platform/screens', () => ({
  LandingScreen: (...args) => mockLandingScreen(...args),
}));

jest.mock('@platform/components', () => {
  const ReactLocal = require('react');
  const { View } = require('react-native');
  return {
    Button: ({ children }) => ReactLocal.createElement(View, null, children),
    ErrorState: ({ title, testID }) => ReactLocal.createElement(View, { testID: testID || title }),
    ErrorStateSizes: { SMALL: 'small' },
    LoadingSpinner: ({ testID }) => ReactLocal.createElement(View, { testID: testID || 'loading-spinner' }),
  };
});

describe('Public Landing Route', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockParams.current = {};
    mockReadOnboardingEntry.mockResolvedValue({ facility_id: 'hospital' });
    mockSaveOnboardingEntry.mockResolvedValue(true);
    mockMapFacilityToBackendType.mockReturnValue('CLINIC');
  });

  test('restores facility selection from persisted state', async () => {
    const Route = require('../../../app/(public)/landing').default;
    render(React.createElement(Route));

    await waitFor(() => {
      expect(mockLandingScreen).toHaveBeenCalled();
    });

    const props = mockLandingScreen.mock.calls.at(-1)[0];
    expect(props.initialFacilityId).toBe('hospital');
    expect(props.embedded).toBe(true);
  });

  test('uses query param selection before persisted state', async () => {
    mockParams.current = { facility: 'lab' };
    const Route = require('../../../app/(public)/landing').default;
    render(React.createElement(Route));

    await waitFor(() => {
      expect(mockLandingScreen).toHaveBeenCalled();
    });

    const props = mockLandingScreen.mock.calls.at(-1)[0];
    expect(props.initialFacilityId).toBe('lab');
    expect(mockReadOnboardingEntry).not.toHaveBeenCalled();
  });

  test('persists selection and navigates to register on continue', async () => {
    const Route = require('../../../app/(public)/landing').default;
    render(React.createElement(Route));

    await waitFor(() => {
      expect(mockLandingScreen).toHaveBeenCalled();
    });

    const props = mockLandingScreen.mock.calls.at(-1)[0];
    await act(async () => {
      await props.onStart('clinic');
    });

    expect(mockSaveOnboardingEntry).toHaveBeenCalledWith('clinic');
    expect(mockMapFacilityToBackendType).toHaveBeenCalledWith('clinic');
    expect(mockPush).toHaveBeenCalledWith({
      pathname: '/register',
      params: {
        facility: 'clinic',
        facility_type: 'CLINIC',
      },
    });
  });
});
