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
      IPD_WORKBENCH_V1: isWorkbenchEnabled,
    }));
    jest.doMock('@navigation/ipdLegacyRouteRedirect', () => (...args) => mockLegacyRedirect(...args));
    jest.doMock('@platform/screens', () => ({
      ClinicalResourceListScreen: (...args) => mockScreens.ClinicalResourceListScreen(...args),
      ClinicalResourceDetailScreen: (...args) => mockScreens.ClinicalResourceDetailScreen(...args),
    }));
    routeModule = require(routePath);
  });
  return routeModule.default;
};

describe('IPD legacy route wrappers', () => {
  beforeEach(() => {
    jest.resetModules();
    jest.clearAllMocks();
  });

  it('routes admissions list through workbench redirect when flag is enabled', () => {
    const Route = loadRoute('../../../app/(main)/ipd/admissions/index', true);
    render(React.createElement(Route));
    expect(mockLegacyRedirect).toHaveBeenCalledTimes(1);
    expect(mockLegacyRedirect.mock.calls[0]?.[0]).toMatchObject({
      mode: 'list',
      resource: 'admissions',
      panel: 'snapshot',
    });
  });

  it('routes admissions detail through resolver redirect when flag is enabled', () => {
    const Route = loadRoute('../../../app/(main)/ipd/admissions/[id]', true);
    render(React.createElement(Route));
    expect(mockLegacyRedirect).toHaveBeenCalledTimes(1);
    expect(mockLegacyRedirect.mock.calls[0]?.[0]).toMatchObject({
      mode: 'detail',
      resource: 'admissions',
      panel: 'snapshot',
      action: 'open_admission',
    });
  });

  it('renders legacy resource screen when workbench flag is disabled', () => {
    const Route = loadRoute('../../../app/(main)/ipd/admissions/index', false);
    render(React.createElement(Route));
    expect(mockScreens.ClinicalResourceListScreen).toHaveBeenCalledTimes(1);
  });
});
