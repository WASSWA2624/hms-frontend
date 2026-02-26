const React = require('react');
const { render } = require('@testing-library/react-native');

const buildMockScreens = () => ({
  ClinicalOverviewScreen: jest.fn(() => null),
  IpdWorkbenchScreen: jest.fn(() => null),
});

const loadIpdIndexRoute = (isWorkbenchEnabled, mockScreens) => {
  let routeModule;
  jest.isolateModules(() => {
    jest.doMock('@config/feature.flags', () => ({
      IPD_WORKBENCH_V1: isWorkbenchEnabled,
    }));
    jest.doMock('@platform/screens', () => ({
      ClinicalOverviewScreen: (...args) => mockScreens.ClinicalOverviewScreen(...args),
      IpdWorkbenchScreen: (...args) => mockScreens.IpdWorkbenchScreen(...args),
    }));
    routeModule = require('../../../app/(main)/ipd/index');
  });
  return routeModule.default;
};

describe('IPD index route feature flag', () => {
  beforeEach(() => {
    jest.resetModules();
    jest.clearAllMocks();
  });

  it('renders legacy overview when IPD_WORKBENCH_V1 is disabled', () => {
    const mockScreens = buildMockScreens();
    const Route = loadIpdIndexRoute(false, mockScreens);

    render(React.createElement(Route));

    expect(mockScreens.ClinicalOverviewScreen).toHaveBeenCalledTimes(1);
    expect(mockScreens.ClinicalOverviewScreen.mock.calls[0]?.[0]).toMatchObject({
      scope: 'ipd',
    });
    expect(mockScreens.IpdWorkbenchScreen).not.toHaveBeenCalled();
  });

  it('renders IPD workbench when IPD_WORKBENCH_V1 is enabled', () => {
    const mockScreens = buildMockScreens();
    const Route = loadIpdIndexRoute(true, mockScreens);

    render(React.createElement(Route));

    expect(mockScreens.IpdWorkbenchScreen).toHaveBeenCalledTimes(1);
    expect(mockScreens.ClinicalOverviewScreen).not.toHaveBeenCalled();
  });
});

