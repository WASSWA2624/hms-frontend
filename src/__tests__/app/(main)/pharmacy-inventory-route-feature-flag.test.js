const React = require('react');
const { render } = require('@testing-library/react-native');

const buildMockScreens = () => ({
  ClinicalOverviewScreen: jest.fn(() => null),
  PharmacyWorkbenchScreen: jest.fn(() => null),
});
const mockRedirect = jest.fn(() => null);

const loadPharmacyRoute = (isWorkspaceEnabled, mockScreens) => {
  let routeModule;
  jest.isolateModules(() => {
    jest.doMock('expo-router', () => ({
      Redirect: (...args) => mockRedirect(...args),
    }));
    jest.doMock('@config/feature.flags', () => ({
      PHARMACY_WORKSPACE_V1: isWorkspaceEnabled,
    }));
    jest.doMock('@platform/screens', () => ({
      ClinicalOverviewScreen: (...args) => mockScreens.ClinicalOverviewScreen(...args),
      PharmacyWorkbenchScreen: (...args) => mockScreens.PharmacyWorkbenchScreen(...args),
    }));
    routeModule = require('../../../app/(main)/pharmacy/index');
  });
  return routeModule.default;
};

const loadInventoryRoute = () => {
  let routeModule;
  jest.isolateModules(() => {
    jest.doMock('expo-router', () => ({
      Redirect: (...args) => mockRedirect(...args),
    }));
    routeModule = require('../../../app/(main)/inventory/index');
  });
  return routeModule.default;
};

describe('Pharmacy and Inventory index routes', () => {
  beforeEach(() => {
    jest.resetModules();
    jest.clearAllMocks();
  });

  it('renders legacy pharmacy overview when PHARMACY_WORKSPACE_V1 is disabled', () => {
    const mockScreens = buildMockScreens();
    const Route = loadPharmacyRoute(false, mockScreens);

    render(React.createElement(Route));

    expect(mockScreens.ClinicalOverviewScreen).toHaveBeenCalledTimes(1);
    expect(mockScreens.ClinicalOverviewScreen.mock.calls[0]?.[0]).toMatchObject({
      scope: 'pharmacy',
    });
    expect(mockScreens.PharmacyWorkbenchScreen).not.toHaveBeenCalled();
  });

  it('renders pharmacy workbench when PHARMACY_WORKSPACE_V1 is enabled', () => {
    const mockScreens = buildMockScreens();
    const Route = loadPharmacyRoute(true, mockScreens);

    render(React.createElement(Route));

    expect(mockScreens.PharmacyWorkbenchScreen).toHaveBeenCalledTimes(1);
    expect(mockScreens.PharmacyWorkbenchScreen.mock.calls[0]?.[0] || {}).toEqual({});
    expect(mockScreens.ClinicalOverviewScreen).not.toHaveBeenCalled();
  });

  it('redirects inventory index to pharmacy inventory panel', () => {
    const Route = loadInventoryRoute();

    render(React.createElement(Route));

    expect(mockRedirect).toHaveBeenCalledTimes(1);
    expect(mockRedirect.mock.calls[0]?.[0]).toMatchObject({
      href: '/pharmacy?panel=inventory',
    });
  });
});
