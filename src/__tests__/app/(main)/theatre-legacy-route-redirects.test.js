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
      THEATRE_WORKBENCH_V1: isWorkbenchEnabled,
    }));
    jest.doMock(
      '@navigation/theatreLegacyRouteRedirect',
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

describe('theatre legacy route wrappers', () => {
  beforeEach(() => {
    jest.resetModules();
    jest.clearAllMocks();
  });

  it('routes theatre cases list through workbench redirect when flag is enabled', () => {
    const Route = loadRoute(
      '../../../app/(main)/theatre/theatre-cases/index',
      true
    );
    render(React.createElement(Route));
    expect(mockLegacyRedirect).toHaveBeenCalledTimes(1);
    expect(mockLegacyRedirect.mock.calls[0]?.[0]).toMatchObject({
      mode: 'list',
      resource: 'theatre-cases',
      panel: 'snapshot',
      action: 'open_theatre_case_list',
    });
  });

  it('routes anesthesia record detail through resolver redirect when flag is enabled', () => {
    const Route = loadRoute(
      '../../../app/(main)/theatre/anesthesia-records/[id]',
      true
    );
    render(React.createElement(Route));
    expect(mockLegacyRedirect).toHaveBeenCalledTimes(1);
    expect(mockLegacyRedirect.mock.calls[0]?.[0]).toMatchObject({
      mode: 'detail',
      resource: 'anesthesia-records',
      panel: 'anesthesia',
      action: 'open_anesthesia_record',
    });
  });

  it('renders legacy resource screen when workbench flag is disabled', () => {
    const Route = loadRoute(
      '../../../app/(main)/theatre/theatre-cases/index',
      false
    );
    render(React.createElement(Route));
    expect(mockScreens.ClinicalResourceListScreen).toHaveBeenCalledTimes(1);
  });
});
