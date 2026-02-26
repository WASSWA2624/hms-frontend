/**
 * useDashboardScreen Hook Tests
 * File: useDashboardScreen.test.js
 */
const React = require('react');
const TestRenderer = require('react-test-renderer');

const mockLoadCurrentUser = jest.fn();
const mockLogout = jest.fn();
const mockIsItemVisible = jest.fn(() => true);
const mockGetDashboardSummary = jest.fn();
const mockListTenants = jest.fn();
const mockRouter = {
  replace: jest.fn(),
  push: jest.fn(),
};
let mockAuthState;

jest.mock('expo-router', () => ({
  useRouter: jest.fn(() => mockRouter),
}));

jest.mock('@hooks', () => ({
  useAuth: jest.fn(() => mockAuthState),
  useNavigationVisibility: jest.fn(() => ({
    isItemVisible: mockIsItemVisible,
  })),
  useNetwork: jest.fn(() => ({
    isOffline: false,
  })),
}));

jest.mock('@navigation/registrationContext', () => ({
  readRegistrationContext: jest.fn(async () => ({
    tenant_name: 'Main Tenant',
    facility_type: 'HOSPITAL',
    tenant_id: '',
    facility_id: '770e8400-e29b-41d4-a716-446655440000',
  })),
}));

jest.mock('@features/tenant', () => ({
  listTenants: (...args) => mockListTenants(...args),
}));

jest.mock('@features/dashboard-widget', () => ({
  getDashboardSummary: (...args) => mockGetDashboardSummary(...args),
}));

const useDashboardScreen = require('@platform/screens/main/DashboardScreen/useDashboardScreen').default;
const { STATES } = require('@platform/screens/main/DashboardScreen/types');

jest.setTimeout(15000);

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

const flushHook = async () => {
  await act(async () => {
    await Promise.resolve();
    await Promise.resolve();
  });
};

const createSummaryPayload = (overrides = {}) => ({
  roleProfile: { id: 'tenant_admin', role: 'TENANT_ADMIN', pack: 'admin' },
  summaryCards: [{ id: 'patients_today', label: 'Patients today', value: 8 }],
  trend: {
    title: '7-day trend',
    subtitle: 'Trend',
    points: [{ id: 'day-1', date: '2026-02-24', value: 4 }],
  },
  distribution: {
    title: 'Status distribution',
    subtitle: 'Distribution',
    total: 2,
    segments: [{ id: 'open', label: 'Open', value: 2, color: '#2563eb' }],
  },
  highlights: [{ id: 'h1', label: 'Live', value: '8', context: 'Primary metric' }],
  queue: [{ id: 'q1', title: 'Queue', meta: '2 items', statusLabel: 'Now', statusVariant: 'warning' }],
  alerts: [{ id: 'a1', title: 'Alert', meta: '1 signal', severityLabel: 'Watch', severityVariant: 'error' }],
  activity: [{ id: 'ac1', title: 'Activity', meta: 'Updated', timeLabel: '1m ago' }],
  hasLiveData: true,
  generatedAt: '2026-02-24T00:00:00.000Z',
  scope: {
    tenant_id: '660e8400-e29b-41d4-a716-446655440000',
    facility_id: '770e8400-e29b-41d4-a716-446655440000',
    branch_id: null,
    days: 7,
  },
  ...overrides,
});

describe('useDashboardScreen Hook', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockRouter.replace.mockReset();
    mockRouter.push.mockReset();

    mockAuthState = {
      user: {
        id: 'user-1',
        role: 'TENANT_ADMIN',
        roles: [{ role: { name: 'TENANT_ADMIN' } }],
        tenant_id: '660e8400-e29b-41d4-a716-446655440000',
        facility_id: '770e8400-e29b-41d4-a716-446655440000',
        facility: { facility_type: 'HOSPITAL', name: 'CityCare Hospital' },
        tenant: { name: 'Main Tenant' },
        profile: { first_name: 'Amina', last_name: 'Diallo' },
      },
      isAuthenticated: true,
      loadCurrentUser: mockLoadCurrentUser,
      logout: mockLogout,
    };

    mockLoadCurrentUser.mockResolvedValue({
      meta: { requestStatus: 'fulfilled' },
      payload: mockAuthState.user,
    });
    mockGetDashboardSummary.mockResolvedValue(createSummaryPayload());
    mockListTenants.mockResolvedValue([
      { id: 'tenant-1', name: 'Tenant One' },
      { id: 'tenant-2', name: 'Tenant Two' },
    ]);
  });

  it('returns normalized dashboard summary contract', async () => {
    const { result, unmount } = renderHook(() => useDashboardScreen());

    await flushHook();

    expect(result.current.state).toBe(STATES.IDLE);
    expect(result.current.liveDashboard).toEqual(
      expect.objectContaining({
        summaryCards: expect.any(Array),
        trend: expect.any(Object),
        distribution: expect.any(Object),
        highlights: expect.any(Array),
        queue: expect.any(Array),
        alerts: expect.any(Array),
        activity: expect.any(Array),
      })
    );
    expect(mockGetDashboardSummary).toHaveBeenCalledWith({ days: 7 });
    unmount();
  });

  it('enters tenant-context state for super admin without tenant scope', async () => {
    mockAuthState = {
      ...mockAuthState,
      user: {
        ...mockAuthState.user,
        role: 'SUPER_ADMIN',
        roles: [{ role: { name: 'SUPER_ADMIN' } }],
        tenant_id: null,
      },
    };

    const { result, unmount } = renderHook(() => useDashboardScreen());

    await flushHook();

    expect(result.current.state).toBe(STATES.NEEDS_TENANT_CONTEXT);
    expect(result.current.tenantContext.options).toEqual([
      { label: 'Tenant One', value: 'tenant-1' },
      { label: 'Tenant Two', value: 'tenant-2' },
    ]);
    expect(mockGetDashboardSummary).not.toHaveBeenCalled();
    unmount();
  });

  it('fetches summary with tenant_id when tenant is selected', async () => {
    mockAuthState = {
      ...mockAuthState,
      user: {
        ...mockAuthState.user,
        role: 'SUPER_ADMIN',
        roles: [{ role: { name: 'SUPER_ADMIN' } }],
        tenant_id: null,
      },
    };

    const { result, unmount } = renderHook(() => useDashboardScreen());
    await flushHook();

    await act(async () => {
      result.current.tenantContext.onSelectTenant('tenant-1');
      await Promise.resolve();
      await Promise.resolve();
    });

    expect(mockGetDashboardSummary).toHaveBeenCalledWith(
      expect.objectContaining({ tenant_id: 'tenant-1', days: 7 })
    );
    unmount();
  });

  it('keeps tenant-context state when summary returns 422', async () => {
    mockAuthState = {
      ...mockAuthState,
      user: {
        ...mockAuthState.user,
        role: 'SUPER_ADMIN',
        roles: [{ role: { name: 'SUPER_ADMIN' } }],
        tenant_id: null,
      },
    };

    mockGetDashboardSummary.mockRejectedValue({
      status: 422,
      statusCode: 422,
      message: 'errors.validation.field.required',
    });

    const { result, unmount } = renderHook(() => useDashboardScreen());
    await flushHook();

    await act(async () => {
      result.current.tenantContext.onSelectTenant('tenant-1');
      await Promise.resolve();
      await Promise.resolve();
    });

    expect(result.current.state).toBe(STATES.NEEDS_TENANT_CONTEXT);
    unmount();
  });

  it('exposes workbench IPD admit quick-action path when workbench flag is enabled', async () => {
    const { result, unmount } = renderHook(() => useDashboardScreen());

    await flushHook();

    const admitAction = result.current.quickActions.find((item) => item.id === 'admit');
    expect(admitAction).toBeDefined();
    expect(admitAction.path).toBe('/ipd?action=start_admission');
    unmount();
  });
});
