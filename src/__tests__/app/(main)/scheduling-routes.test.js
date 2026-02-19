const React = require('react');
const { render } = require('@testing-library/react-native');

const mockScreens = {
  SchedulingScreen: jest.fn(() => null),
  SchedulingOverviewScreen: jest.fn(() => null),
  SchedulingResourceListScreen: jest.fn(() => null),
  SchedulingResourceDetailScreen: jest.fn(() => null),
  SchedulingResourceFormScreen: jest.fn(() => null),
  NotFoundScreen: jest.fn(() => null),
};
const mockSlot = jest.fn(() => null);
const mockUsePathname = jest.fn(() => '/scheduling');
const mockReplace = jest.fn();
const mockUseSchedulingAccess = jest.fn(() => ({
  canAccessScheduling: true,
  canManageAllTenants: true,
  tenantId: null,
  isResolved: true,
}));
const mockLoadingSpinner = jest.fn(() => null);

jest.mock('expo-router', () => ({
  Slot: (props) => mockSlot(props),
  usePathname: () => mockUsePathname(),
  useRouter: () => ({ replace: mockReplace }),
}));

jest.mock('@hooks', () => ({
  useI18n: () => ({ t: (key) => key }),
  useSchedulingAccess: (...args) => mockUseSchedulingAccess(...args),
}));

jest.mock('@platform/components', () => ({
  LoadingSpinner: (...args) => mockLoadingSpinner(...args),
}));

jest.mock('@platform/screens', () => ({
  SchedulingScreen: (...args) => mockScreens.SchedulingScreen(...args),
  SchedulingOverviewScreen: (...args) => mockScreens.SchedulingOverviewScreen(...args),
  SchedulingResourceListScreen: (...args) => mockScreens.SchedulingResourceListScreen(...args),
  SchedulingResourceDetailScreen: (...args) => mockScreens.SchedulingResourceDetailScreen(...args),
  SchedulingResourceFormScreen: (...args) => mockScreens.SchedulingResourceFormScreen(...args),
  NotFoundScreen: (...args) => mockScreens.NotFoundScreen(...args),
}));

const RESOURCES_WITH_EDIT = [
  'appointments',
  'appointment-participants',
  'appointment-reminders',
  'provider-schedules',
  'availability-slots',
  'visit-queues',
];

const buildRouteCases = (resourceId) => {
  const basePath = `../../../app/(main)/scheduling/${resourceId}`;
  return [
    {
      routePath: `${basePath}/index`,
      screenKey: 'SchedulingResourceListScreen',
      expectedProps: { resourceId },
    },
    {
      routePath: `${basePath}/create`,
      screenKey: 'SchedulingResourceFormScreen',
      expectedProps: { resourceId },
    },
    {
      routePath: `${basePath}/[id]`,
      screenKey: 'SchedulingResourceDetailScreen',
      expectedProps: { resourceId },
    },
    {
      routePath: `${basePath}/[id]/edit`,
      screenKey: 'SchedulingResourceFormScreen',
      expectedProps: { resourceId },
    },
  ];
};

const SCHEDULING_ROUTE_CASES = [
  {
    routePath: '../../../app/(main)/scheduling/index',
    screenKey: 'SchedulingOverviewScreen',
  },
  {
    routePath: '../../../app/(main)/scheduling/[...missing]',
    screenKey: 'NotFoundScreen',
  },
  ...RESOURCES_WITH_EDIT.flatMap((resourceId) => buildRouteCases(resourceId)),
];

describe('Tier 5 Scheduling Routes', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUsePathname.mockReturnValue('/scheduling');
    mockUseSchedulingAccess.mockReturnValue({
      canAccessScheduling: true,
      canManageAllTenants: true,
      tenantId: null,
      isResolved: true,
    });
    mockScreens.SchedulingScreen.mockImplementation(({ children }) => children || null);
  });

  test.each(SCHEDULING_ROUTE_CASES)('$routePath renders $screenKey', ({ routePath, screenKey, expectedProps }) => {
    const routeModule = require(routePath);
    expect(routeModule.default).toBeDefined();
    expect(typeof routeModule.default).toBe('function');

    render(React.createElement(routeModule.default));
    expect(mockScreens[screenKey]).toHaveBeenCalledTimes(1);

    if (expectedProps) {
      const calledProps = mockScreens[screenKey].mock.calls[0]?.[0] || {};
      expect(calledProps).toMatchObject(expectedProps);
    }
  });

  test('scheduling layout renders SchedulingScreen and Slot when access is allowed', () => {
    mockUsePathname.mockReturnValue('/scheduling');
    mockUseSchedulingAccess.mockReturnValue({
      canAccessScheduling: true,
      canManageAllTenants: false,
      tenantId: 'tenant-1',
      isResolved: true,
    });

    const layoutModule = require('../../../app/(main)/scheduling/_layout');
    render(React.createElement(layoutModule.default));

    expect(mockScreens.SchedulingScreen).toHaveBeenCalledTimes(1);
    expect(mockSlot).toHaveBeenCalledTimes(1);
    expect(mockLoadingSpinner).not.toHaveBeenCalled();
    expect(mockReplace).not.toHaveBeenCalled();
  });

  test('scheduling layout shows loading spinner while access state is resolving', () => {
    mockUseSchedulingAccess.mockReturnValue({
      canAccessScheduling: false,
      canManageAllTenants: false,
      tenantId: null,
      isResolved: false,
    });

    const layoutModule = require('../../../app/(main)/scheduling/_layout');
    render(React.createElement(layoutModule.default));

    expect(mockScreens.SchedulingScreen).toHaveBeenCalledTimes(1);
    expect(mockLoadingSpinner).toHaveBeenCalledTimes(1);
    expect(mockSlot).not.toHaveBeenCalled();
    expect(mockReplace).not.toHaveBeenCalled();
  });

  test('scheduling layout redirects to dashboard when user lacks scheduling access', () => {
    mockUseSchedulingAccess.mockReturnValue({
      canAccessScheduling: false,
      canManageAllTenants: true,
      tenantId: null,
      isResolved: true,
    });

    const layoutModule = require('../../../app/(main)/scheduling/_layout');
    render(React.createElement(layoutModule.default));

    expect(mockReplace).toHaveBeenCalledWith('/dashboard');
    expect(mockScreens.SchedulingScreen).not.toHaveBeenCalled();
    expect(mockSlot).not.toHaveBeenCalled();
  });

  test('scheduling layout redirects to dashboard for scoped users without tenant context (read-only denied path)', () => {
    mockUseSchedulingAccess.mockReturnValue({
      canAccessScheduling: true,
      canManageAllTenants: false,
      tenantId: null,
      isResolved: true,
    });

    const layoutModule = require('../../../app/(main)/scheduling/_layout');
    render(React.createElement(layoutModule.default));

    expect(mockReplace).toHaveBeenCalledWith('/dashboard');
    expect(mockScreens.SchedulingScreen).not.toHaveBeenCalled();
    expect(mockSlot).not.toHaveBeenCalled();
  });
});
