const React = require('react');
const { render } = require('@testing-library/react-native');

const buildMockScreens = () => ({
  ClinicalOverviewScreen: jest.fn(() => null),
  PharmacyWorkbenchScreen: jest.fn(() => null),
});

const loadRoute = (routePath, isWorkspaceEnabled, mockScreens) => {
  let routeModule;
  jest.isolateModules(() => {
    jest.doMock('@config/feature.flags', () => ({
      PHARMACY_WORKSPACE_V1: isWorkspaceEnabled,
    }));
    jest.doMock('@platform/screens', () => ({
      ClinicalOverviewScreen: (...args) => mockScreens.ClinicalOverviewScreen(...args),
      PharmacyWorkbenchScreen: (...args) => mockScreens.PharmacyWorkbenchScreen(...args),
    }));
    routeModule = require(routePath);
  });
  return routeModule.default;
};

describe('Pharmacy and Inventory index route feature flag', () => {
  beforeEach(() => {
    jest.resetModules();
    jest.clearAllMocks();
  });

  it('renders legacy pharmacy overview when PHARMACY_WORKSPACE_V1 is disabled', () => {
    const mockScreens = buildMockScreens();
    const Route = loadRoute('../../../app/(main)/pharmacy/index', false, mockScreens);

    render(React.createElement(Route));

    expect(mockScreens.ClinicalOverviewScreen).toHaveBeenCalledTimes(1);
    expect(mockScreens.ClinicalOverviewScreen.mock.calls[0]?.[0]).toMatchObject({
      scope: 'pharmacy',
    });
    expect(mockScreens.PharmacyWorkbenchScreen).not.toHaveBeenCalled();
  });

  it('renders pharmacy workbench when PHARMACY_WORKSPACE_V1 is enabled', () => {
    const mockScreens = buildMockScreens();
    const Route = loadRoute('../../../app/(main)/pharmacy/index', true, mockScreens);

    render(React.createElement(Route));

    expect(mockScreens.PharmacyWorkbenchScreen).toHaveBeenCalledTimes(1);
    expect(mockScreens.PharmacyWorkbenchScreen.mock.calls[0]?.[0] || {}).toEqual({});
    expect(mockScreens.ClinicalOverviewScreen).not.toHaveBeenCalled();
  });

  it('renders legacy inventory overview when PHARMACY_WORKSPACE_V1 is disabled', () => {
    const mockScreens = buildMockScreens();
    const Route = loadRoute('../../../app/(main)/inventory/index', false, mockScreens);

    render(React.createElement(Route));

    expect(mockScreens.ClinicalOverviewScreen).toHaveBeenCalledTimes(1);
    expect(mockScreens.ClinicalOverviewScreen.mock.calls[0]?.[0]).toMatchObject({
      scope: 'inventory',
    });
    expect(mockScreens.PharmacyWorkbenchScreen).not.toHaveBeenCalled();
  });

  it('renders inventory panel of pharmacy workbench when PHARMACY_WORKSPACE_V1 is enabled', () => {
    const mockScreens = buildMockScreens();
    const Route = loadRoute('../../../app/(main)/inventory/index', true, mockScreens);

    render(React.createElement(Route));

    expect(mockScreens.PharmacyWorkbenchScreen).toHaveBeenCalledTimes(1);
    expect(mockScreens.PharmacyWorkbenchScreen.mock.calls[0]?.[0]).toMatchObject({
      defaultPanel: 'inventory',
    });
    expect(mockScreens.ClinicalOverviewScreen).not.toHaveBeenCalled();
  });
});
