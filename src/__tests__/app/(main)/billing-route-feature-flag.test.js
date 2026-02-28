const React = require('react');
const { render } = require('@testing-library/react-native');

const buildMockScreens = () => ({
  ClinicalOverviewScreen: jest.fn(() => null),
  BillingWorkbenchScreen: jest.fn(() => null),
});

const loadBillingIndexRoute = (isWorkbenchEnabled, mockScreens) => {
  let routeModule;
  jest.isolateModules(() => {
    jest.doMock('@config/feature.flags', () => ({
      BILLING_WORKSPACE_V1: isWorkbenchEnabled,
    }));
    jest.doMock('@platform/screens', () => ({
      ClinicalOverviewScreen: (...args) => mockScreens.ClinicalOverviewScreen(...args),
      BillingWorkbenchScreen: (...args) => mockScreens.BillingWorkbenchScreen(...args),
    }));
    routeModule = require('../../../app/(main)/billing/index');
  });
  return routeModule.default;
};

describe('billing index route feature flag', () => {
  beforeEach(() => {
    jest.resetModules();
    jest.clearAllMocks();
  });

  it('renders legacy overview when BILLING_WORKSPACE_V1 is disabled', () => {
    const mockScreens = buildMockScreens();
    const Route = loadBillingIndexRoute(false, mockScreens);

    render(React.createElement(Route));

    expect(mockScreens.ClinicalOverviewScreen).toHaveBeenCalledTimes(1);
    expect(mockScreens.ClinicalOverviewScreen.mock.calls[0]?.[0]).toMatchObject({
      scope: 'billing',
    });
    expect(mockScreens.BillingWorkbenchScreen).not.toHaveBeenCalled();
  });

  it('renders billing workbench when BILLING_WORKSPACE_V1 is enabled', () => {
    const mockScreens = buildMockScreens();
    const Route = loadBillingIndexRoute(true, mockScreens);

    render(React.createElement(Route));

    expect(mockScreens.BillingWorkbenchScreen).toHaveBeenCalledTimes(1);
    expect(mockScreens.ClinicalOverviewScreen).not.toHaveBeenCalled();
  });
});
