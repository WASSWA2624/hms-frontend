const React = require('react');
const { render } = require('@testing-library/react-native');

const mockScreens = {
  SchedulingOverviewScreen: jest.fn(() => null),
  SchedulingResourceListScreen: jest.fn(() => null),
  SchedulingResourceDetailScreen: jest.fn(() => null),
  SchedulingResourceFormScreen: jest.fn(() => null),
};

jest.mock('@platform/screens', () => ({
  SchedulingOverviewScreen: (...args) => mockScreens.SchedulingOverviewScreen(...args),
  SchedulingResourceListScreen: (...args) => mockScreens.SchedulingResourceListScreen(...args),
  SchedulingResourceDetailScreen: (...args) => mockScreens.SchedulingResourceDetailScreen(...args),
  SchedulingResourceFormScreen: (...args) => mockScreens.SchedulingResourceFormScreen(...args),
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
  ...RESOURCES_WITH_EDIT.flatMap((resourceId) => buildRouteCases(resourceId)),
];

describe('Tier 5 Scheduling Routes', () => {
  beforeEach(() => {
    jest.clearAllMocks();
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
});
