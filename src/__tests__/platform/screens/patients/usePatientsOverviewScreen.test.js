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
  usePatient: jest.fn(),
  usePatientAccess: jest.fn(),
}));

const usePatientsOverviewScreen = require('@platform/screens/patients/PatientsOverviewScreen/usePatientsOverviewScreen').default;
const { useI18n, useNetwork, usePatient, usePatientAccess } = require('@hooks');

const translationMap = {
  'patients.overview.unnamedPatient': 'Patient record {{position}}',
  'patients.overview.unknownDemographics': 'Profile details pending',
  'patients.overview.scopeSummaryAllTenants': 'Scope: all authorized tenants',
  'patients.overview.scopeSummaryFacility': 'Scope: current tenant and facility',
  'patients.overview.scopeSummaryTenant': 'Scope: current tenant only',
  'patients.overview.accessSummaryReadWrite': 'Access: read and register patients',
  'patients.overview.accessSummaryReadOnly': 'Access: read-only patient workspace',
  'patients.overview.recentPatientsCount': 'Recent records shown: {{count}}',
  'patients.overview.helpLabel': 'Open patient registry guidance',
  'patients.overview.helpTooltip': 'Open guidance for patient overview, permissions, and recovery.',
  'patients.overview.helpTitle': 'How to use patient registry home',
  'patients.overview.helpBody': 'Help body',
  'patients.overview.helpItems.scope': 'Scope item',
  'patients.overview.helpItems.sequence': 'Sequence item',
  'patients.overview.helpItems.access': 'Access item',
  'patients.overview.helpItems.recovery': 'Recovery item',
  'patients.overview.quickPaths.directoryTitle': 'Patient directory',
  'patients.overview.quickPaths.directoryDescription': 'Search and open patient workspaces.',
  'patients.overview.quickPaths.legalTitle': 'Legal hub',
  'patients.overview.quickPaths.legalDescription': 'Manage global consent and terms operations.',
};

const mockTranslate = (key, values = {}) => {
  const template = translationMap[key] || key;
  return template.replace(/\{\{(\w+)\}\}/g, (_match, token) => String(values[token] ?? ''));
};

describe('usePatientsOverviewScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    useI18n.mockReturnValue({ t: mockTranslate });
    useNetwork.mockReturnValue({ isOffline: false });
    usePatientAccess.mockReturnValue({
      canAccessPatients: true,
      canCreatePatientRecords: true,
      canManageAllTenants: true,
      tenantId: null,
      facilityId: null,
      isResolved: true,
    });
    usePatient.mockReturnValue({
      list: mockList,
      data: { items: [] },
      isLoading: false,
      errorCode: null,
      reset: mockReset,
    });
  });

  it('requests overview patients with numeric bounded pagination params', () => {
    renderHook(() => usePatientsOverviewScreen());

    expect(mockReset).toHaveBeenCalledTimes(1);
    expect(mockList).toHaveBeenCalledTimes(1);
    const params = mockList.mock.calls[0][0];
    expect(params).toEqual({ page: 1, limit: 20 });
    expect(typeof params.page).toBe('number');
    expect(typeof params.limit).toBe('number');
    expect(params.limit).toBeLessThanOrEqual(100);
  });

  it('includes tenant scope when user cannot manage all tenants', () => {
    usePatientAccess.mockReturnValue({
      canAccessPatients: true,
      canCreatePatientRecords: true,
      canManageAllTenants: false,
      tenantId: 'tenant-12',
      facilityId: null,
      isResolved: true,
    });

    renderHook(() => usePatientsOverviewScreen());

    expect(mockList).toHaveBeenCalledWith({ page: 1, limit: 20, tenant_id: 'tenant-12' });
  });

  it('includes facility scope for scoped users and reflects facility summary copy', () => {
    usePatientAccess.mockReturnValue({
      canAccessPatients: true,
      canCreatePatientRecords: true,
      canManageAllTenants: false,
      tenantId: 'tenant-12',
      facilityId: 'facility-22',
      isResolved: true,
    });

    const { result } = renderHook(() => usePatientsOverviewScreen());

    expect(mockList).toHaveBeenCalledWith({
      page: 1,
      limit: 20,
      tenant_id: 'tenant-12',
      facility_id: 'facility-22',
    });
    expect(result.current.overviewSummary.scope).toBe('Scope: current tenant and facility');
  });

  it('does not load list data before access resolution', () => {
    usePatientAccess.mockReturnValue({
      canAccessPatients: true,
      canCreatePatientRecords: true,
      canManageAllTenants: true,
      tenantId: null,
      facilityId: null,
      isResolved: false,
    });

    renderHook(() => usePatientsOverviewScreen());

    expect(mockList).not.toHaveBeenCalled();
    expect(mockReset).not.toHaveBeenCalled();
  });

  it('uses a human-readable fallback name instead of exposing raw patient ids', () => {
    const technicalId = '4be31f2a-6ef0-4ce0-a3fe-3f15cc6efea2';
    usePatient.mockReturnValue({
      list: mockList,
      data: {
        items: [
          {
            id: technicalId,
            first_name: '',
            last_name: '',
            gender: '',
            date_of_birth: '',
            created_at: '2026-02-18T08:10:00.000Z',
          },
        ],
      },
      isLoading: false,
      errorCode: null,
      reset: mockReset,
    });

    const { result } = renderHook(() => usePatientsOverviewScreen());
    const firstRecentPatient = result.current.recentPatients[0];

    expect(firstRecentPatient.displayName).toBe('Patient record 1');
    expect(firstRecentPatient.displayName).not.toContain(technicalId);
    expect(firstRecentPatient.subtitle).toBe('Profile details pending');
  });

  it('maps patient contact labels from available contact fields', () => {
    usePatient.mockReturnValue({
      list: mockList,
      data: {
        items: [
          {
            id: 'patient-44',
            first_name: 'Jane',
            last_name: 'Doe',
            phone_number: '+256700000010',
            created_at: '2026-02-20T08:10:00.000Z',
            updated_at: '2026-02-22T08:10:00.000Z',
          },
        ],
      },
      isLoading: false,
      errorCode: null,
      reset: mockReset,
    });

    const { result } = renderHook(() => usePatientsOverviewScreen());
    expect(result.current.recentPatients[0].contactLabel).toBe('+256700000010');
  });

  it('blocks register navigation when the user is read-only', () => {
    usePatientAccess.mockReturnValue({
      canAccessPatients: true,
      canCreatePatientRecords: false,
      canManageAllTenants: true,
      tenantId: null,
      facilityId: null,
      isResolved: true,
    });

    const { result } = renderHook(() => usePatientsOverviewScreen());
    expect(result.current.showRegisterPatientAction).toBe(false);

    act(() => {
      result.current.onRegisterPatient();
    });

    expect(mockPush).not.toHaveBeenCalledWith('/patients/patients/create');
  });

  it('navigates to patient details with patient context when opening a recent patient', () => {
    const { result } = renderHook(() => usePatientsOverviewScreen());

    act(() => {
      result.current.onOpenPatient('patient-55');
    });

    expect(mockPush).toHaveBeenCalledWith('/patients/patients/patient-55');
  });

  it('returns two quick-path cards for directory and legal hub', () => {
    const { result } = renderHook(() => usePatientsOverviewScreen());

    expect(result.current.cards).toEqual([
      expect.objectContaining({
        id: 'directory',
        routePath: '/patients/patients',
      }),
      expect.objectContaining({
        id: 'legal',
        routePath: '/patients/legal',
      }),
    ]);
  });

  it('redirects to dashboard when route access is denied', () => {
    usePatientAccess.mockReturnValue({
      canAccessPatients: false,
      canCreatePatientRecords: false,
      canManageAllTenants: false,
      tenantId: null,
      facilityId: null,
      isResolved: true,
    });

    renderHook(() => usePatientsOverviewScreen());
    expect(mockReplace).toHaveBeenCalledWith('/dashboard');
  });
});
