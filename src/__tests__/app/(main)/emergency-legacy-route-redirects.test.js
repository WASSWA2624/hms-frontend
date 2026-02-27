const React = require('react');
const { render } = require('@testing-library/react-native');

const mockLegacyRedirect = jest.fn(({ fallback }) => fallback || null);
const mockScreens = {
  ClinicalResourceListScreen: jest.fn(() => null),
  ClinicalResourceDetailScreen: jest.fn(() => null),
};

const loadRoute = (routePath, isWorkbenchEnabled) => {
  let routeModule;
  jest.isolateModules(() => {
    jest.doMock('@config/feature.flags', () => ({
      EMERGENCY_WORKBENCH_V1: isWorkbenchEnabled,
    }));
    jest.doMock(
      '@navigation/emergencyLegacyRouteRedirect',
      () =>
        (...args) =>
          mockLegacyRedirect(...args)
    );
    jest.doMock('@platform/screens', () => ({
      ClinicalResourceListScreen: (...args) =>
        mockScreens.ClinicalResourceListScreen(...args),
      ClinicalResourceDetailScreen: (...args) =>
        mockScreens.ClinicalResourceDetailScreen(...args),
    }));
    routeModule = require(routePath);
  });
  return routeModule.default;
};

describe('emergency legacy route wrappers', () => {
  beforeEach(() => {
    jest.resetModules();
    jest.clearAllMocks();
  });

  it('routes emergency case list through workbench redirect when flag is enabled', () => {
    const Route = loadRoute(
      '../../../app/(main)/emergency/emergency-cases/index',
      true
    );
    render(React.createElement(Route));
    expect(mockLegacyRedirect).toHaveBeenCalledTimes(1);
    expect(mockLegacyRedirect.mock.calls[0]?.[0]).toMatchObject({
      mode: 'list',
      resource: 'emergency-cases',
      panel: 'queue',
      action: 'open_case_list',
    });
  });

  it('routes ambulance trip detail through resolver redirect when flag is enabled', () => {
    const Route = loadRoute(
      '../../../app/(main)/emergency/ambulance-trips/[id]',
      true
    );
    render(React.createElement(Route));
    expect(mockLegacyRedirect).toHaveBeenCalledTimes(1);
    expect(mockLegacyRedirect.mock.calls[0]?.[0]).toMatchObject({
      mode: 'detail',
      resource: 'ambulance-trips',
      panel: 'trips',
      action: 'manage_trip',
    });
  });

  it('renders legacy resource screen when workbench flag is disabled', () => {
    const Route = loadRoute(
      '../../../app/(main)/emergency/emergency-cases/index',
      false
    );
    render(React.createElement(Route));
    expect(mockScreens.ClinicalResourceListScreen).toHaveBeenCalledTimes(1);
  });
});
