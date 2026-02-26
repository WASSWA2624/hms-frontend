const React = require('react');
const { render } = require('@testing-library/react-native');

const buildMockScreens = () => ({
  ClinicalOverviewScreen: jest.fn(() => null),
  TheatreWorkbenchScreen: jest.fn(() => null),
});

const loadTheatreIndexRoute = (isWorkbenchEnabled, mockScreens) => {
  let routeModule;
  jest.isolateModules(() => {
    jest.doMock('@config/feature.flags', () => ({
      THEATRE_WORKBENCH_V1: isWorkbenchEnabled,
    }));
    jest.doMock('@platform/screens', () => ({
      ClinicalOverviewScreen: (...args) =>
        mockScreens.ClinicalOverviewScreen(...args),
      TheatreWorkbenchScreen: (...args) =>
        mockScreens.TheatreWorkbenchScreen(...args),
    }));
    routeModule = require('../../../app/(main)/theatre/index');
  });
  return routeModule.default;
};

describe('theatre index route feature flag', () => {
  beforeEach(() => {
    jest.resetModules();
    jest.clearAllMocks();
  });

  it('renders legacy overview when THEATRE_WORKBENCH_V1 is disabled', () => {
    const mockScreens = buildMockScreens();
    const Route = loadTheatreIndexRoute(false, mockScreens);

    render(React.createElement(Route));

    expect(mockScreens.ClinicalOverviewScreen).toHaveBeenCalledTimes(1);
    expect(mockScreens.ClinicalOverviewScreen.mock.calls[0]?.[0]).toMatchObject(
      {
        scope: 'theatre',
      }
    );
    expect(mockScreens.TheatreWorkbenchScreen).not.toHaveBeenCalled();
  });

  it('renders theatre workbench when THEATRE_WORKBENCH_V1 is enabled', () => {
    const mockScreens = buildMockScreens();
    const Route = loadTheatreIndexRoute(true, mockScreens);

    render(React.createElement(Route));

    expect(mockScreens.TheatreWorkbenchScreen).toHaveBeenCalledTimes(1);
    expect(mockScreens.ClinicalOverviewScreen).not.toHaveBeenCalled();
  });
});
