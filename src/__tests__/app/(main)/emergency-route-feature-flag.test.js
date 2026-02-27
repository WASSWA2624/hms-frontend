const React = require('react');
const { render } = require('@testing-library/react-native');

const buildMockScreens = () => ({
  ClinicalOverviewScreen: jest.fn(() => null),
  EmergencyWorkbenchScreen: jest.fn(() => null),
});

const loadEmergencyIndexRoute = (isWorkbenchEnabled, mockScreens) => {
  let routeModule;
  jest.isolateModules(() => {
    jest.doMock('@config/feature.flags', () => ({
      EMERGENCY_WORKBENCH_V1: isWorkbenchEnabled,
    }));
    jest.doMock('@platform/screens', () => ({
      ClinicalOverviewScreen: (...args) =>
        mockScreens.ClinicalOverviewScreen(...args),
      EmergencyWorkbenchScreen: (...args) =>
        mockScreens.EmergencyWorkbenchScreen(...args),
    }));
    routeModule = require('../../../app/(main)/emergency/index');
  });
  return routeModule.default;
};

describe('emergency index route feature flag', () => {
  beforeEach(() => {
    jest.resetModules();
    jest.clearAllMocks();
  });

  it('renders legacy overview when EMERGENCY_WORKBENCH_V1 is disabled', () => {
    const mockScreens = buildMockScreens();
    const Route = loadEmergencyIndexRoute(false, mockScreens);

    render(React.createElement(Route));

    expect(mockScreens.ClinicalOverviewScreen).toHaveBeenCalledTimes(1);
    expect(mockScreens.ClinicalOverviewScreen.mock.calls[0]?.[0]).toMatchObject(
      {
        scope: 'emergency',
      }
    );
    expect(mockScreens.EmergencyWorkbenchScreen).not.toHaveBeenCalled();
  });

  it('renders emergency workbench when EMERGENCY_WORKBENCH_V1 is enabled', () => {
    const mockScreens = buildMockScreens();
    const Route = loadEmergencyIndexRoute(true, mockScreens);

    render(React.createElement(Route));

    expect(mockScreens.EmergencyWorkbenchScreen).toHaveBeenCalledTimes(1);
    expect(mockScreens.ClinicalOverviewScreen).not.toHaveBeenCalled();
  });
});
