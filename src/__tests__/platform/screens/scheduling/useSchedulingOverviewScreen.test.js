const { renderHook, act } = require('@testing-library/react-native');

const mockPush = jest.fn();
const mockReplace = jest.fn();
const mockList = jest.fn();
const mockReset = jest.fn();

jest.mock('expo-router', () => ({
  useRouter: () => ({
    push: mockPush,
    replace: mockReplace,
  }),
}));

jest.mock('@hooks', () => ({
  useI18n: jest.fn(),
  useNetwork: jest.fn(),
  useAppointment: jest.fn(),
  useSchedulingAccess: jest.fn(),
}));

const useSchedulingOverviewScreen = require('@platform/screens/scheduling/SchedulingOverviewScreen/useSchedulingOverviewScreen').default;
const { useI18n, useNetwork, useAppointment, useSchedulingAccess } = require('@hooks');

const translationMap = {
  'scheduling.overview.unnamedAppointment': 'Appointment record {{position}}',
  'scheduling.overview.unknownSchedule': 'Schedule details pending',
  'scheduling.overview.scopeSummaryAllTenants': 'Scope: all authorized tenants',
  'scheduling.overview.scopeSummaryTenant': 'Scope: current tenant only',
  'scheduling.overview.accessSummaryReadWrite': 'Access: read and manage scheduling records',
  'scheduling.overview.accessSummaryReadOnly': 'Access: read-only scheduling workspace',
  'scheduling.overview.recentAppointmentsCount': 'Recent appointments shown: {{count}}',
  'scheduling.overview.helpLabel': 'Open scheduling guidance',
  'scheduling.overview.helpTooltip': 'Open guidance',
  'scheduling.overview.helpTitle': 'How to use scheduling home',
  'scheduling.overview.helpBody': 'Help body',
  'scheduling.overview.helpItems.scope': 'Scope item',
  'scheduling.overview.helpItems.sequence': 'Sequence item',
  'scheduling.overview.helpItems.access': 'Access item',
  'scheduling.overview.helpItems.recovery': 'Recovery item',
  'scheduling.overview.appointmentForPatient': 'Appointment for {{patient}}',
};

const mockTranslate = (key, values = {}) => {
  const template = translationMap[key] || key;
  return template.replace(/\{\{(\w+)\}\}/g, (_match, token) => String(values[token] ?? ''));
};

describe('useSchedulingOverviewScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    useI18n.mockReturnValue({ t: mockTranslate });
    useNetwork.mockReturnValue({ isOffline: false });
    useSchedulingAccess.mockReturnValue({
      canAccessScheduling: true,
      canCreateSchedulingRecords: true,
      canManageAllTenants: true,
      tenantId: null,
      facilityId: null,
      isResolved: true,
    });
    useAppointment.mockReturnValue({
      list: mockList,
      data: { items: [] },
      isLoading: false,
      errorCode: null,
      reset: mockReset,
    });
  });

  it('requests overview appointments with numeric bounded pagination params', () => {
    renderHook(() => useSchedulingOverviewScreen());

    expect(mockReset).toHaveBeenCalledTimes(1);
    expect(mockList).toHaveBeenCalledTimes(1);
    const params = mockList.mock.calls[0][0];
    expect(params).toEqual({ page: 1, limit: 20 });
    expect(typeof params.page).toBe('number');
    expect(typeof params.limit).toBe('number');
    expect(params.limit).toBeLessThanOrEqual(100);
  });

  it('places OPD workbench card first in scheduling resources', () => {
    const { result } = renderHook(() => useSchedulingOverviewScreen());
    expect(result.current.cards[0]?.id).toBe('opd-flows');
    expect(result.current.cards[0]?.routePath).toBe('/clinical');
  });

  it('includes tenant and facility scope when user cannot manage all tenants', () => {
    useSchedulingAccess.mockReturnValue({
      canAccessScheduling: true,
      canCreateSchedulingRecords: true,
      canManageAllTenants: false,
      tenantId: 'tenant-12',
      facilityId: 'facility-99',
      isResolved: true,
    });

    renderHook(() => useSchedulingOverviewScreen());

    expect(mockList).toHaveBeenCalledWith({
      page: 1,
      limit: 20,
      tenant_id: 'tenant-12',
      facility_id: 'facility-99',
    });
  });

  it('does not load list data before access resolution', () => {
    useSchedulingAccess.mockReturnValue({
      canAccessScheduling: true,
      canCreateSchedulingRecords: true,
      canManageAllTenants: true,
      tenantId: null,
      facilityId: null,
      isResolved: false,
    });

    renderHook(() => useSchedulingOverviewScreen());

    expect(mockList).not.toHaveBeenCalled();
    expect(mockReset).not.toHaveBeenCalled();
  });

  it('uses a human-readable fallback name instead of exposing raw appointment ids', () => {
    const technicalId = '4be31f2a-6ef0-4ce0-a3fe-3f15cc6efea2';
    useAppointment.mockReturnValue({
      list: mockList,
      data: {
        items: [
          {
            id: technicalId,
            reason: '',
            status: '',
            created_at: '2026-02-18T08:10:00.000Z',
          },
        ],
      },
      isLoading: false,
      errorCode: null,
      reset: mockReset,
    });

    const { result } = renderHook(() => useSchedulingOverviewScreen());
    const firstRecentAppointment = result.current.recentAppointments[0];

    expect(firstRecentAppointment.displayName).toBe('Appointment record 1');
    expect(firstRecentAppointment.displayName).not.toContain(technicalId);
    expect(firstRecentAppointment.subtitle).toBe('Schedule details pending');
  });

  it('blocks create navigation when the user is read-only', () => {
    useSchedulingAccess.mockReturnValue({
      canAccessScheduling: true,
      canCreateSchedulingRecords: false,
      canManageAllTenants: true,
      tenantId: null,
      facilityId: null,
      isResolved: true,
    });

    const { result } = renderHook(() => useSchedulingOverviewScreen());
    expect(result.current.showCreateAppointmentAction).toBe(false);

    act(() => {
      result.current.onCreateAppointment();
    });

    expect(mockPush).not.toHaveBeenCalledWith('/scheduling/appointments/create');
  });

  it('navigates to appointment details with scheduling context when opening a recent appointment', () => {
    const { result } = renderHook(() => useSchedulingOverviewScreen());

    act(() => {
      result.current.onOpenAppointment({
        id: 'appointment-55',
        patient_id: 'patient-5',
        provider_user_id: 'provider-7',
      });
    });

    expect(mockPush).toHaveBeenCalledWith(
      '/scheduling/appointments/appointment-55?patientId=patient-5&providerUserId=provider-7&appointmentId=appointment-55'
    );
  });

  it('redirects to dashboard when route access is denied', () => {
    useSchedulingAccess.mockReturnValue({
      canAccessScheduling: false,
      canCreateSchedulingRecords: false,
      canManageAllTenants: false,
      tenantId: null,
      facilityId: null,
      isResolved: true,
    });

    renderHook(() => useSchedulingOverviewScreen());
    expect(mockReplace).toHaveBeenCalledWith('/dashboard');
  });

  it('navigates to OPD workbench from quick CTA handler', () => {
    const { result } = renderHook(() => useSchedulingOverviewScreen());

    act(() => {
      result.current.onOpenOpdWorkbench();
    });

    expect(mockPush).toHaveBeenCalledWith('/clinical');
  });

  it('navigates to due reminders quick action', () => {
    const { result } = renderHook(() => useSchedulingOverviewScreen());

    act(() => {
      result.current.onOpenDueReminders();
    });

    expect(mockPush).toHaveBeenCalledWith('/scheduling/appointment-reminders?reminderBoard=DUE');
  });

  it('navigates to active queues quick action', () => {
    const { result } = renderHook(() => useSchedulingOverviewScreen());

    act(() => {
      result.current.onOpenActiveQueues();
    });

    expect(mockPush).toHaveBeenCalledWith('/scheduling/visit-queues?status=IN_PROGRESS');
  });
});
