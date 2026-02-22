const { renderHook, act } = require('@testing-library/react-native');

let mockSearchParams = {};
const mockReplace = jest.fn();
const mockPush = jest.fn();

const mockConsentList = jest.fn();
const mockConsentCreate = jest.fn();
const mockConsentUpdate = jest.fn();
const mockConsentRemove = jest.fn();
const mockConsentReset = jest.fn();

const mockTermsList = jest.fn();
const mockTermsCreate = jest.fn();
const mockTermsRemove = jest.fn();
const mockTermsReset = jest.fn();

const mockPatientList = jest.fn();
const mockPatientReset = jest.fn();
const mockUserList = jest.fn();
const mockUserReset = jest.fn();

jest.mock('expo-router', () => ({
  useLocalSearchParams: () => mockSearchParams,
  useRouter: () => ({ replace: mockReplace, push: mockPush }),
}));

jest.mock('@hooks', () => ({
  useConsent: jest.fn(),
  useI18n: jest.fn(() => ({ t: (key, values) => {
    if (key === 'patients.common.form.unnamedPatient') return `Patient ${values?.position || ''}`.trim();
    if (key === 'patients.resources.termsAcceptances.form.unnamedUser') return `User ${values?.position || ''}`.trim();
    return key;
  } })),
  useNetwork: jest.fn(() => ({ isOffline: false })),
  usePatient: jest.fn(),
  usePatientAccess: jest.fn(),
  useTermsAcceptance: jest.fn(),
  useUser: jest.fn(),
}));

const usePatientLegalHubScreen = require('@platform/screens/patients/PatientLegalHubScreen/usePatientLegalHubScreen').default;
const {
  useConsent,
  usePatient,
  usePatientAccess,
  useTermsAcceptance,
  useUser,
} = require('@hooks');

describe('usePatientLegalHubScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockSearchParams = { tab: 'consents' };

    usePatientAccess.mockReturnValue({
      canAccessPatients: true,
      canAccessPatientLegalHub: true,
      canManagePatientRecords: true,
      canDeletePatientRecords: true,
      canManageAllTenants: false,
      tenantId: 'tenant-1',
      isResolved: true,
    });

    useConsent.mockReturnValue({
      list: mockConsentList,
      create: mockConsentCreate,
      update: mockConsentUpdate,
      remove: mockConsentRemove,
      reset: mockConsentReset,
      data: { items: [] },
      isLoading: false,
      errorCode: null,
    });

    useTermsAcceptance.mockReturnValue({
      list: mockTermsList,
      create: mockTermsCreate,
      remove: mockTermsRemove,
      reset: mockTermsReset,
      data: { items: [] },
      isLoading: false,
      errorCode: null,
    });

    usePatient.mockReturnValue({
      list: mockPatientList,
      reset: mockPatientReset,
      data: {
        items: [
          {
            id: 'patient-1',
            first_name: 'Jane',
            last_name: 'Doe',
          },
        ],
      },
      isLoading: false,
      errorCode: null,
    });

    useUser.mockReturnValue({
      list: mockUserList,
      reset: mockUserReset,
      data: {
        items: [
          {
            id: 'user-1',
            first_name: 'Sam',
            last_name: 'Njoroge',
            email: 'sam@example.com',
          },
        ],
      },
      isLoading: false,
      errorCode: null,
    });

    mockTermsCreate.mockResolvedValue({ id: 'terms-1' });
    mockConsentCreate.mockResolvedValue({ id: 'consent-1' });
    mockConsentUpdate.mockResolvedValue({ id: 'consent-1' });
    mockConsentRemove.mockResolvedValue({ id: 'consent-1' });
    mockTermsRemove.mockResolvedValue({ id: 'terms-1' });
  });

  it('loads consent tab by default and fetches patient lookup options', () => {
    const { result } = renderHook(() => usePatientLegalHubScreen());

    expect(result.current.activeTab).toBe('consents');
    expect(mockConsentList).toHaveBeenCalledWith(expect.objectContaining({ tenant_id: 'tenant-1' }));
    expect(mockPatientList).toHaveBeenCalledWith(expect.objectContaining({ tenant_id: 'tenant-1' }));
  });

  it('normalizes invalid tab values to consents route', () => {
    mockSearchParams = { tab: 'bad-tab' };

    renderHook(() => usePatientLegalHubScreen());

    expect(mockReplace).toHaveBeenCalledWith('/patients/legal?tab=consents');
  });

  it('surfaces entitlement blocked state when legal hub is not entitled', () => {
    usePatientAccess.mockReturnValue({
      canAccessPatients: true,
      canAccessPatientLegalHub: false,
      canManagePatientRecords: false,
      canDeletePatientRecords: false,
      canManageAllTenants: false,
      tenantId: 'tenant-1',
      isResolved: true,
    });

    const { result } = renderHook(() => usePatientLegalHubScreen());
    expect(result.current.isEntitlementBlocked).toBe(true);
  });

  it('creates terms acceptance from legal hub inline editor', async () => {
    mockSearchParams = { tab: 'terms' };

    const { result } = renderHook(() => usePatientLegalHubScreen());

    act(() => {
      result.current.onStartCreate();
      result.current.onEditorChange('user_id', 'user-1');
      result.current.onEditorChange('version_label', 'v2.1');
    });

    await act(async () => {
      await result.current.onSubmitEditor();
    });

    expect(mockTermsCreate).toHaveBeenCalledWith({
      user_id: 'user-1',
      version_label: 'v2.1',
    });
  });
});
