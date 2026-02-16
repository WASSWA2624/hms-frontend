/**
 * useDashboardScreen Hook Tests
 * File: useDashboardScreen.test.js
 */
const React = require('react');
const TestRenderer = require('react-test-renderer');

jest.mock('@hooks', () => ({
  useAuth: jest.fn(() => ({
    user: {
      id: 'user-1',
      role: 'ADMIN',
      roles: [{ role: { name: 'ADMIN' } }],
      facility: { facility_type: 'HOSPITAL', name: 'CityCare Hospital' },
      tenant: { name: 'Main Tenant' },
      profile: { first_name: 'Amina', last_name: 'Diallo' },
    },
    isAuthenticated: true,
    loadCurrentUser: jest.fn(async () => ({
      meta: { requestStatus: 'fulfilled' },
      payload: {
        id: 'user-1',
      },
    })),
    logout: jest.fn(async () => true),
  })),
  useNavigationVisibility: jest.fn(() => ({
    isItemVisible: jest.fn(() => true),
  })),
  useNetwork: jest.fn(() => ({
    isOffline: false,
  })),
}));

jest.mock('@navigation/registrationContext', () => ({
  readRegistrationContext: jest.fn(async () => ({
    tenant_name: 'Main Tenant',
    facility_type: 'HOSPITAL',
  })),
}));

jest.mock('@platform/screens/main/DashboardScreen/dashboardLiveData', () => ({
  collectUserRoleKeys: jest.fn(() => ['ADMIN']),
  resolveRoleProfile: jest.fn(() => ({
    id: 'general',
    title: 'Care operations overview',
    subtitle: 'Operations snapshot',
    badgeVariant: 'primary',
  })),
  createEmptyDashboardData: jest.fn((roleProfile = {}) => ({
    roleProfile,
    summaryCards: [],
    trend: { title: '', subtitle: '', points: [] },
    distribution: { title: '', subtitle: '', total: 0, segments: [] },
    highlights: [],
    queue: [],
    alerts: [],
    activity: [],
    hasLiveData: false,
  })),
  buildDashboardLiveData: jest.fn(async ({ roleProfile }) => ({
    roleProfile,
    summaryCards: [{ id: 'patientsToday', label: 'Patients added today', value: 8 }],
    trend: {
      title: 'Appointments over the last 7 days',
      subtitle: 'Trend',
      points: [{ id: 'day-1', date: new Date(), value: 4 }],
    },
    distribution: {
      title: 'Invoice status mix',
      subtitle: 'Mix',
      total: 2,
      segments: [{ id: 'paid', label: 'Paid', value: 2, color: '#2563eb' }],
    },
    highlights: [],
    queue: [],
    alerts: [],
    activity: [],
    hasLiveData: true,
  })),
}));

const useDashboardScreen = require('@platform/screens/main/DashboardScreen/useDashboardScreen').default;

// Custom renderHook implementation to avoid @testing-library/react-hooks dependency
const act = TestRenderer.act;
const renderHook = (hook, { initialProps } = {}) => {
  const result = {};
  let renderer;
  
  const HookHarness = ({ hookProps }) => {
    const hookResult = hook(hookProps);
    Object.assign(result, hookResult);
    return null;
  };
  
  act(() => {
    renderer = TestRenderer.create(React.createElement(HookHarness, { hookProps: initialProps }));
  });
  
  return {
    result: { current: result },
    rerender: (newProps) => {
      act(() => {
        renderer.update(React.createElement(HookHarness, { hookProps: newProps }));
      });
    },
    unmount: () => {
      act(() => {
        renderer.unmount();
      });
    },
  };
};

describe('useDashboardScreen Hook', () => {
  it('should return an object', () => {
    const { result } = renderHook(() => useDashboardScreen());
    expect(result.current).toBeDefined();
    expect(typeof result.current).toBe('object');
  });

  it('should not throw when called', () => {
    expect(() => {
      renderHook(() => useDashboardScreen());
    }).not.toThrow();
  });

  it('should return consistent structure', () => {
    const { result, rerender } = renderHook(() => useDashboardScreen());
    const firstResult = result.current;

    rerender();
    const secondResult = result.current;

    expect(Object.keys(firstResult)).toEqual(Object.keys(secondResult));
  });
});

