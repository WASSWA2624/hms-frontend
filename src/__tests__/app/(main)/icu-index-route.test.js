const React = require('react');
const { render } = require('@testing-library/react-native');

describe('ICU index route', () => {
  beforeEach(() => {
    jest.resetModules();
    jest.clearAllMocks();
  });

  it('renders ICU workbench when ICU_WORKBENCH_V1 is enabled', () => {
    const mockScreens = {
      ClinicalOverviewScreen: jest.fn(() => null),
      IcuWorkbenchScreen: jest.fn(() => null),
    };

    jest.doMock('@config/feature.flags', () => ({
      ICU_WORKBENCH_V1: true,
    }));
    jest.doMock('@platform/screens', () => ({
      ClinicalOverviewScreen: (...args) =>
        mockScreens.ClinicalOverviewScreen(...args),
      IcuWorkbenchScreen: (...args) => mockScreens.IcuWorkbenchScreen(...args),
    }));

    const routeModule = require('../../../app/(main)/icu/index');
    render(React.createElement(routeModule.default));

    expect(mockScreens.IcuWorkbenchScreen).toHaveBeenCalledTimes(1);
    expect(mockScreens.ClinicalOverviewScreen).not.toHaveBeenCalled();
  });

  it('renders ICU overview when ICU_WORKBENCH_V1 is disabled', () => {
    const mockScreens = {
      ClinicalOverviewScreen: jest.fn(() => null),
      IcuWorkbenchScreen: jest.fn(() => null),
    };

    jest.doMock('@config/feature.flags', () => ({
      ICU_WORKBENCH_V1: false,
    }));
    jest.doMock('@platform/screens', () => ({
      ClinicalOverviewScreen: (...args) =>
        mockScreens.ClinicalOverviewScreen(...args),
      IcuWorkbenchScreen: (...args) => mockScreens.IcuWorkbenchScreen(...args),
    }));

    const routeModule = require('../../../app/(main)/icu/index');
    render(React.createElement(routeModule.default));

    expect(mockScreens.ClinicalOverviewScreen).toHaveBeenCalledTimes(1);
    expect(mockScreens.ClinicalOverviewScreen.mock.calls[0]?.[0]).toMatchObject(
      { scope: 'icu' }
    );
    expect(mockScreens.IcuWorkbenchScreen).not.toHaveBeenCalled();
  });
});
