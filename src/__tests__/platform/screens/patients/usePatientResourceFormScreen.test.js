const { act, renderHook, waitFor } = require('@testing-library/react-native');

const mockPush = jest.fn();
const mockReplace = jest.fn();
let mockParams = {};
let mockCrudData = null;

const mockGet = jest.fn();
const mockCreate = jest.fn();
const mockUpdate = jest.fn();
const mockResetCrud = jest.fn();
const mockListPatients = jest.fn();
const mockResetPatients = jest.fn();
const mockListTenants = jest.fn();
const mockResetTenants = jest.fn();
const mockListFacilities = jest.fn();
const mockResetFacilities = jest.fn();
const mockListUsers = jest.fn();
const mockResetUsers = jest.fn();

jest.mock('expo-router', () => ({
  useRouter: () => ({ push: mockPush, replace: mockReplace }),
  useLocalSearchParams: () => mockParams,
}));

jest.mock('@hooks', () => ({
  useI18n: jest.fn(() => ({
    t: (key, values) => {
      if (values && typeof values === 'object' && Object.prototype.hasOwnProperty.call(values, 'position')) {
        return `${key}-${values.position}`;
      }
      return key;
    },
  })),
  useNetwork: jest.fn(() => ({ isOffline: false })),
  usePatient: jest.fn(),
  useTenant: jest.fn(),
  useFacility: jest.fn(),
  usePatientAccess: jest.fn(),
  useUser: jest.fn(),
}));

jest.mock('@platform/screens/patients/usePatientResourceCrud', () => ({
  __esModule: true,
  default: jest.fn(),
}));

const usePatientResourceFormScreen = require('@platform/screens/patients/PatientResourceFormScreen/usePatientResourceFormScreen').default;
const usePatientResourceCrud = require('@platform/screens/patients/usePatientResourceCrud').default;
const {
  usePatient,
  useTenant,
  useFacility,
  usePatientAccess,
  useUser,
} = require('@hooks');

describe('usePatientResourceFormScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockParams = {};
    mockCrudData = null;

    usePatientAccess.mockReturnValue({
      canAccessPatients: true,
      canCreatePatientRecords: true,
      canEditPatientRecords: true,
      canManageAllTenants: true,
      tenantId: null,
      facilityId: null,
      isResolved: true,
    });

    usePatient.mockReturnValue({
      list: mockListPatients,
      data: { items: [] },
      isLoading: false,
      errorCode: null,
      reset: mockResetPatients,
    });

    useTenant.mockReturnValue({
      list: mockListTenants,
      data: { items: [{ id: 'tenant-a', name: 'North Tenant' }] },
      isLoading: false,
      errorCode: null,
      reset: mockResetTenants,
    });

    useFacility.mockReturnValue({
      list: mockListFacilities,
      data: { items: [{ id: 'facility-1', name: 'Main Facility' }] },
      isLoading: false,
      errorCode: null,
      reset: mockResetFacilities,
    });
    useUser.mockReturnValue({
      list: mockListUsers,
      data: { items: [{ id: 'user-1', first_name: 'Grace', last_name: 'Akinyi', email: 'grace@example.com' }] },
      isLoading: false,
      errorCode: null,
      reset: mockResetUsers,
    });

    usePatientResourceCrud.mockImplementation(() => ({
      get: mockGet,
      create: mockCreate,
      update: mockUpdate,
      data: mockCrudData,
      isLoading: false,
      errorCode: null,
      reset: mockResetCrud,
    }));
  });

  it('hides tenant and facility fields when pre-known context values exist', async () => {
    usePatientAccess.mockReturnValue({
      canAccessPatients: true,
      canCreatePatientRecords: true,
      canEditPatientRecords: true,
      canManageAllTenants: true,
      tenantId: 'tenant-context',
      facilityId: 'facility-context',
      isResolved: true,
    });

    const { result } = renderHook(() => usePatientResourceFormScreen('patients'));

    await waitFor(() => {
      expect(result.current.values.tenant_id).toBe('tenant-context');
    });

    expect(result.current.showTenantField).toBe(false);
    expect(result.current.visibleFields.some((field) => field.name === 'facility_id')).toBe(false);
    expect(mockListTenants).not.toHaveBeenCalled();
    expect(mockListFacilities).not.toHaveBeenCalled();
  });

  it('uses tenant and facility selectors backed by lookup options', async () => {
    const { result } = renderHook(() => usePatientResourceFormScreen('patients'));

    await waitFor(() => {
      expect(mockListTenants).toHaveBeenCalledWith({ page: 1, limit: 100 });
    });

    act(() => {
      result.current.setFieldValue('tenant_id', 'tenant-a');
    });

    await waitFor(() => {
      expect(mockListFacilities).toHaveBeenCalledWith({
        page: 1,
        limit: 100,
        tenant_id: 'tenant-a',
      });
    });

    const facilityField = result.current.visibleFields.find((field) => field.name === 'facility_id');
    expect(result.current.showTenantField).toBe(true);
    expect(result.current.tenantOptions.length).toBeGreaterThan(0);
    expect(facilityField).toBeTruthy();
    expect(facilityField.type).toBe('select');
    expect(facilityField.options[0]).toMatchObject({
      value: 'facility-1',
      label: 'Main Facility',
    });
  });

  it('keeps create and edit core writable fields aligned for patients form', async () => {
    usePatientAccess.mockReturnValue({
      canAccessPatients: true,
      canCreatePatientRecords: true,
      canEditPatientRecords: true,
      canManageAllTenants: false,
      tenantId: 'tenant-1',
      facilityId: null,
      isResolved: true,
    });

    const createHook = renderHook(() => usePatientResourceFormScreen('patients'));
    const createFields = createHook.result.current.visibleFields.map((field) => field.name);

    mockParams = { id: 'patient-1' };
    mockCrudData = {
      id: 'patient-1',
      tenant_id: 'tenant-1',
      first_name: 'Jane',
      last_name: 'Doe',
      facility_id: 'facility-1',
      is_active: true,
    };

    const editHook = renderHook(() => usePatientResourceFormScreen('patients'));

    await waitFor(() => {
      expect(editHook.result.current.isEdit).toBe(true);
    });

    const editFields = editHook.result.current.visibleFields.map((field) => field.name);
    expect(editFields).toEqual(createFields);
  });

  it('redirects create route to access denied notice for read-only users', async () => {
    usePatientAccess.mockReturnValue({
      canAccessPatients: true,
      canCreatePatientRecords: false,
      canEditPatientRecords: false,
      canManageAllTenants: false,
      tenantId: 'tenant-1',
      facilityId: null,
      isResolved: true,
    });

    renderHook(() => usePatientResourceFormScreen('patients'));

    await waitFor(() => {
      expect(mockReplace).toHaveBeenCalledWith('/patients/patients?notice=accessDenied');
    });
  });

  it('redirects edit route to access denied notice when edit permission is missing', async () => {
    mockParams = { id: 'patient-1' };
    usePatientAccess.mockReturnValue({
      canAccessPatients: true,
      canCreatePatientRecords: true,
      canEditPatientRecords: false,
      canManageAllTenants: false,
      tenantId: 'tenant-1',
      facilityId: null,
      isResolved: true,
    });

    renderHook(() => usePatientResourceFormScreen('patients'));

    await waitFor(() => {
      expect(mockReplace).toHaveBeenCalledWith('/patients/patients?notice=accessDenied');
    });
  });

  it('hides tenant selector on edit and does not send tenant_id in update payload', async () => {
    mockParams = { id: 'patient-1' };
    mockCrudData = {
      id: 'patient-1',
      tenant_id: 'tenant-edit',
      first_name: 'Jane',
      last_name: 'Doe',
      facility_id: 'facility-1',
      gender: 'FEMALE',
      is_active: true,
    };
    mockUpdate.mockResolvedValue({ id: 'patient-1' });

    const { result } = renderHook(() => usePatientResourceFormScreen('patients'));

    await waitFor(() => {
      expect(result.current.values.tenant_id).toBe('tenant-edit');
    });

    expect(result.current.showTenantField).toBe(false);

    await act(async () => {
      await result.current.onSubmit();
    });

    expect(mockUpdate).toHaveBeenCalledTimes(1);
    const payload = mockUpdate.mock.calls[0][1];
    expect(payload).not.toHaveProperty('tenant_id');
  });

  it('hides patient selector when patient context is preselected for patient identifiers', async () => {
    mockParams = { patientId: 'patient-context-id' };
    usePatientAccess.mockReturnValue({
      canAccessPatients: true,
      canCreatePatientRecords: true,
      canEditPatientRecords: true,
      canManageAllTenants: false,
      tenantId: 'tenant-1',
      facilityId: null,
      isResolved: true,
    });

    const { result } = renderHook(() => usePatientResourceFormScreen('patient-identifiers'));

    await waitFor(() => {
      expect(result.current.values.patient_id).toBe('patient-context-id');
    });

    expect(result.current.showPatientField).toBe(false);
    expect(mockListPatients).not.toHaveBeenCalled();
  });

  it('hides patient selector on edit for patient identifiers', async () => {
    mockParams = { id: 'identifier-1' };
    mockCrudData = {
      id: 'identifier-1',
      tenant_id: 'tenant-1',
      patient_id: 'patient-1',
      identifier_type: 'MRN',
      identifier_value: 'MRN-22',
      is_primary: true,
    };
    mockUpdate.mockResolvedValue({ id: 'identifier-1' });

    const { result } = renderHook(() => usePatientResourceFormScreen('patient-identifiers'));

    await waitFor(() => {
      expect(result.current.values.patient_id).toBe('patient-1');
    });

    expect(result.current.showPatientField).toBe(false);

    await act(async () => {
      await result.current.onSubmit();
    });

    expect(mockUpdate).toHaveBeenCalledTimes(1);
    const payload = mockUpdate.mock.calls[0][1];
    expect(payload).not.toHaveProperty('patient_id');
  });

  it('hides patient selector when patient context is preselected for patient allergies', async () => {
    mockParams = { patientId: 'patient-context-id' };
    usePatientAccess.mockReturnValue({
      canAccessPatients: true,
      canCreatePatientRecords: true,
      canEditPatientRecords: true,
      canManageAllTenants: false,
      tenantId: 'tenant-1',
      facilityId: null,
      isResolved: true,
    });

    const { result } = renderHook(() => usePatientResourceFormScreen('patient-allergies'));

    await waitFor(() => {
      expect(result.current.values.patient_id).toBe('patient-context-id');
    });

    expect(result.current.showPatientField).toBe(false);
    expect(mockListPatients).not.toHaveBeenCalled();
  });

  it('hides patient selector on edit for patient allergies', async () => {
    mockParams = { id: 'allergy-1' };
    mockCrudData = {
      id: 'allergy-1',
      tenant_id: 'tenant-1',
      patient_id: 'patient-1',
      allergen: 'Peanuts',
      severity: 'SEVERE',
      reaction: 'Hives',
      notes: 'Carries epipen',
    };
    mockUpdate.mockResolvedValue({ id: 'allergy-1' });

    const { result } = renderHook(() => usePatientResourceFormScreen('patient-allergies'));

    await waitFor(() => {
      expect(result.current.values.patient_id).toBe('patient-1');
    });

    expect(result.current.showPatientField).toBe(false);

    await act(async () => {
      await result.current.onSubmit();
    });

    expect(mockUpdate).toHaveBeenCalledTimes(1);
    const payload = mockUpdate.mock.calls[0][1];
    expect(payload).not.toHaveProperty('patient_id');
  });

  it('hides patient selector when patient context is preselected for patient medical histories', async () => {
    mockParams = { patientId: 'patient-context-id' };
    usePatientAccess.mockReturnValue({
      canAccessPatients: true,
      canCreatePatientRecords: true,
      canEditPatientRecords: true,
      canManageAllTenants: false,
      tenantId: 'tenant-1',
      facilityId: null,
      isResolved: true,
    });

    const { result } = renderHook(() => usePatientResourceFormScreen('patient-medical-histories'));

    await waitFor(() => {
      expect(result.current.values.patient_id).toBe('patient-context-id');
    });

    expect(result.current.showPatientField).toBe(false);
    expect(mockListPatients).not.toHaveBeenCalled();
  });

  it('hides patient selector on edit for patient medical histories', async () => {
    mockParams = { id: 'history-1' };
    mockCrudData = {
      id: 'history-1',
      tenant_id: 'tenant-1',
      patient_id: 'patient-1',
      condition: 'Asthma',
      diagnosis_date: '2024-03-10T00:00:00.000Z',
      notes: 'Follow-up yearly',
    };
    mockUpdate.mockResolvedValue({ id: 'history-1' });

    const { result } = renderHook(() => usePatientResourceFormScreen('patient-medical-histories'));

    await waitFor(() => {
      expect(result.current.values.patient_id).toBe('patient-1');
    });

    expect(result.current.showPatientField).toBe(false);

    await act(async () => {
      await result.current.onSubmit();
    });

    expect(mockUpdate).toHaveBeenCalledTimes(1);
    const payload = mockUpdate.mock.calls[0][1];
    expect(payload).not.toHaveProperty('patient_id');
  });

  it('hides patient selector when patient context is preselected for patient documents', async () => {
    mockParams = { patientId: 'patient-context-id' };
    usePatientAccess.mockReturnValue({
      canAccessPatients: true,
      canCreatePatientRecords: true,
      canEditPatientRecords: true,
      canManageAllTenants: false,
      tenantId: 'tenant-1',
      facilityId: null,
      isResolved: true,
    });

    const { result } = renderHook(() => usePatientResourceFormScreen('patient-documents'));

    await waitFor(() => {
      expect(result.current.values.patient_id).toBe('patient-context-id');
    });

    expect(result.current.showPatientField).toBe(false);
    expect(mockListPatients).not.toHaveBeenCalled();
  });

  it('hides patient selector on edit for patient documents', async () => {
    mockParams = { id: 'document-1' };
    mockCrudData = {
      id: 'document-1',
      tenant_id: 'tenant-1',
      patient_id: 'patient-1',
      document_type: 'LAB_RESULT',
      storage_key: 'docs/lab-result-1',
      file_name: 'lab-result.pdf',
      content_type: 'application/pdf',
    };
    mockUpdate.mockResolvedValue({ id: 'document-1' });

    const { result } = renderHook(() => usePatientResourceFormScreen('patient-documents'));

    await waitFor(() => {
      expect(result.current.values.patient_id).toBe('patient-1');
    });

    expect(result.current.showPatientField).toBe(false);

    await act(async () => {
      await result.current.onSubmit();
    });

    expect(mockUpdate).toHaveBeenCalledTimes(1);
    const payload = mockUpdate.mock.calls[0][1];
    expect(payload).not.toHaveProperty('patient_id');
  });

  it('hides patient selector when patient context is preselected for consents', async () => {
    mockParams = { patientId: 'patient-context-id' };
    usePatientAccess.mockReturnValue({
      canAccessPatients: true,
      canCreatePatientRecords: true,
      canEditPatientRecords: true,
      canManageAllTenants: false,
      tenantId: 'tenant-1',
      facilityId: null,
      isResolved: true,
    });

    const { result } = renderHook(() => usePatientResourceFormScreen('consents'));

    await waitFor(() => {
      expect(result.current.values.patient_id).toBe('patient-context-id');
    });

    expect(result.current.showPatientField).toBe(false);
    expect(mockListPatients).not.toHaveBeenCalled();
  });

  it('hides patient selector on edit for consents', async () => {
    mockParams = { id: 'consent-1' };
    mockCrudData = {
      id: 'consent-1',
      tenant_id: 'tenant-1',
      patient_id: 'patient-1',
      consent_type: 'TREATMENT',
      status: 'GRANTED',
      granted_at: '2024-05-01T00:00:00.000Z',
      revoked_at: null,
    };
    mockUpdate.mockResolvedValue({ id: 'consent-1' });

    const { result } = renderHook(() => usePatientResourceFormScreen('consents'));

    await waitFor(() => {
      expect(result.current.values.patient_id).toBe('patient-1');
    });

    expect(result.current.showPatientField).toBe(false);

    await act(async () => {
      await result.current.onSubmit();
    });

    expect(mockUpdate).toHaveBeenCalledTimes(1);
    const payload = mockUpdate.mock.calls[0][1];
    expect(payload).not.toHaveProperty('patient_id');
  });

  it('keeps create and edit writable fields aligned for consents form', async () => {
    usePatientAccess.mockReturnValue({
      canAccessPatients: true,
      canCreatePatientRecords: true,
      canEditPatientRecords: true,
      canManageAllTenants: false,
      tenantId: 'tenant-1',
      facilityId: null,
      isResolved: true,
    });

    const createHook = renderHook(() => usePatientResourceFormScreen('consents'));
    const createFields = createHook.result.current.visibleFields
      .map((field) => field.name)
      .filter((name) => name !== 'patient_id');

    mockParams = { id: 'consent-2' };
    mockCrudData = {
      id: 'consent-2',
      tenant_id: 'tenant-1',
      patient_id: 'patient-2',
      consent_type: 'RESEARCH',
      status: 'PENDING',
      granted_at: '2024-07-01T00:00:00.000Z',
      revoked_at: null,
    };

    const editHook = renderHook(() => usePatientResourceFormScreen('consents'));
    await waitFor(() => {
      expect(editHook.result.current.isEdit).toBe(true);
    });

    const editFields = editHook.result.current.visibleFields
      .map((field) => field.name)
      .filter((name) => name !== 'patient_id');
    expect(editFields).toEqual(createFields);
  });

  it('redirects consents create route to access denied notice for read-only users', async () => {
    usePatientAccess.mockReturnValue({
      canAccessPatients: true,
      canCreatePatientRecords: false,
      canEditPatientRecords: false,
      canManageAllTenants: false,
      tenantId: 'tenant-1',
      facilityId: null,
      isResolved: true,
    });

    renderHook(() => usePatientResourceFormScreen('consents'));

    await waitFor(() => {
      expect(mockReplace).toHaveBeenCalledWith('/patients/consents?notice=accessDenied');
    });
  });

  it('uses user selector options for terms-acceptances and loads users by tenant scope', async () => {
    usePatientAccess.mockReturnValue({
      canAccessPatients: true,
      canCreatePatientRecords: true,
      canEditPatientRecords: true,
      canManageAllTenants: false,
      tenantId: 'tenant-1',
      facilityId: null,
      isResolved: true,
    });

    const { result } = renderHook(() => usePatientResourceFormScreen('terms-acceptances'));

    await waitFor(() => {
      expect(mockListUsers).toHaveBeenCalledWith({
        page: 1,
        limit: 100,
        tenant_id: 'tenant-1',
      });
    });

    const userField = result.current.visibleFields.find((field) => field.name === 'user_id');
    expect(userField).toBeTruthy();
    expect(userField.type).toBe('select');
    expect(userField.options[0]).toMatchObject({
      value: 'user-1',
      label: 'Grace Akinyi',
    });
  });

  it('blocks terms-acceptances create when tenant has no users', async () => {
    usePatientAccess.mockReturnValue({
      canAccessPatients: true,
      canCreatePatientRecords: true,
      canEditPatientRecords: true,
      canManageAllTenants: false,
      tenantId: 'tenant-1',
      facilityId: null,
      isResolved: true,
    });
    useUser.mockReturnValue({
      list: mockListUsers,
      data: { items: [] },
      isLoading: false,
      errorCode: null,
      reset: mockResetUsers,
    });

    const { result } = renderHook(() => usePatientResourceFormScreen('terms-acceptances'));

    await waitFor(() => {
      expect(mockListUsers).toHaveBeenCalled();
    });

    expect(result.current.hasUsers).toBe(false);
    expect(result.current.isCreateBlocked).toBe(true);
    expect(result.current.isSubmitDisabled).toBe(true);
  });

  it('redirects terms-acceptances create route to access denied notice for read-only users', async () => {
    usePatientAccess.mockReturnValue({
      canAccessPatients: true,
      canCreatePatientRecords: false,
      canEditPatientRecords: false,
      canManageAllTenants: false,
      tenantId: 'tenant-1',
      facilityId: null,
      isResolved: true,
    });

    renderHook(() => usePatientResourceFormScreen('terms-acceptances'));

    await waitFor(() => {
      expect(mockReplace).toHaveBeenCalledWith('/patients/terms-acceptances?notice=accessDenied');
    });
  });
});
