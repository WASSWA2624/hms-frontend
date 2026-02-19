/**
 * useDepartmentFormScreen Hook Tests
 */
const { renderHook, act } = require('@testing-library/react-native');
const useDepartmentFormScreen = require('@platform/screens/settings/DepartmentFormScreen/useDepartmentFormScreen').default;

const mockPush = jest.fn();
const mockReplace = jest.fn();
let mockParams = {};

jest.mock('expo-router', () => ({
  useRouter: () => ({ push: mockPush, replace: mockReplace }),
  useLocalSearchParams: () => mockParams,
}));

jest.mock('@hooks', () => ({
  useI18n: jest.fn(() => ({ t: (k) => k })),
  useNetwork: jest.fn(() => ({ isOffline: false })),
  useDepartment: jest.fn(),
  useTenant: jest.fn(),
  useTenantAccess: jest.fn(),
}));

const { useNetwork, useDepartment, useTenant, useTenantAccess } = require('@hooks');

describe('useDepartmentFormScreen', () => {
  const mockGet = jest.fn();
  const mockCreate = jest.fn();
  const mockUpdate = jest.fn();
  const mockReset = jest.fn();
  const mockListTenants = jest.fn();
  const mockResetTenants = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    mockParams = {};
    useNetwork.mockReturnValue({ isOffline: false });
    useTenantAccess.mockReturnValue({
      canAccessTenantSettings: true,
      canManageAllTenants: true,
      tenantId: null,
      isResolved: true,
    });
    useDepartment.mockReturnValue({
      get: mockGet,
      create: mockCreate,
      update: mockUpdate,
      data: null,
      isLoading: false,
      errorCode: null,
      reset: mockReset,
    });
    useTenant.mockReturnValue({
      list: mockListTenants,
      data: { items: [] },
      isLoading: false,
      errorCode: null,
      reset: mockResetTenants,
    });
  });

  it('loads tenant options for global create', () => {
    renderHook(() => useDepartmentFormScreen());
    expect(mockResetTenants).toHaveBeenCalled();
    expect(mockListTenants).toHaveBeenCalledWith({ page: 1, limit: 100 });
    const params = mockListTenants.mock.calls[mockListTenants.mock.calls.length - 1][0];
    expect(typeof params.page).toBe('number');
    expect(typeof params.limit).toBe('number');
    expect(params.limit).toBeLessThanOrEqual(100);
  });

  it('locks tenant for tenant-scoped create and resolves readable tenant label', () => {
    useTenantAccess.mockReturnValue({
      canAccessTenantSettings: true,
      canManageAllTenants: false,
      tenantId: 'tenant-1',
      isResolved: true,
    });
    useTenant.mockReturnValue({
      list: mockListTenants,
      data: { items: [{ id: 'tenant-1', name: 'Tenant 1' }] },
      isLoading: false,
      errorCode: null,
      reset: mockResetTenants,
    });

    const { result } = renderHook(() => useDepartmentFormScreen());

    expect(result.current.isTenantLocked).toBe(true);
    expect(result.current.tenantId).toBe('tenant-1');
    expect(result.current.lockedTenantDisplay).toBe('department.form.currentTenantLabel');
    expect(mockListTenants).not.toHaveBeenCalled();
  });

  it('redirects unauthorized users to settings', () => {
    useTenantAccess.mockReturnValue({
      canAccessTenantSettings: false,
      canManageAllTenants: false,
      tenantId: null,
      isResolved: true,
    });

    renderHook(() => useDepartmentFormScreen());

    expect(mockReplace).toHaveBeenCalledWith('/settings');
  });

  it('redirects tenant-scoped users without tenant context', () => {
    useTenantAccess.mockReturnValue({
      canAccessTenantSettings: true,
      canManageAllTenants: false,
      tenantId: null,
      isResolved: true,
    });

    renderHook(() => useDepartmentFormScreen());

    expect(mockReplace).toHaveBeenCalledWith('/settings');
  });

  it('loads department on edit route', () => {
    mockParams = { id: 'fid-1' };
    renderHook(() => useDepartmentFormScreen());

    expect(mockReset).toHaveBeenCalled();
    expect(mockGet).toHaveBeenCalledWith('fid-1');
  });

  it('redirects tenant-scoped edit when department tenant mismatches', () => {
    mockParams = { id: 'fid-2' };
    useTenantAccess.mockReturnValue({
      canAccessTenantSettings: true,
      canManageAllTenants: false,
      tenantId: 'tenant-1',
      isResolved: true,
    });
    useDepartment.mockReturnValue({
      get: mockGet,
      create: mockCreate,
      update: mockUpdate,
      data: {
        id: 'fid-2',
        tenant_id: 'tenant-2',
        name: 'Branch Department',
        department_type: 'CLINICAL',
        is_active: true,
      },
      isLoading: false,
      errorCode: null,
      reset: mockReset,
    });

    renderHook(() => useDepartmentFormScreen());

    expect(mockReplace).toHaveBeenCalledWith('/settings/departments?notice=accessDenied');
  });

  it('exposes validation errors for required fields', () => {
    const { result } = renderHook(() => useDepartmentFormScreen());

    expect(result.current.nameError).toBe('department.form.nameRequired');
    expect(result.current.typeError).toBe('department.form.typeRequired');
    expect(result.current.tenantError).toBe('department.form.tenantRequired');
    expect(result.current.isSubmitDisabled).toBe(true);
  });

  it('validates max name length and department type enum', () => {
    const { result } = renderHook(() => useDepartmentFormScreen());
    const veryLongName = 'a'.repeat(256);

    act(() => {
      result.current.setName(veryLongName);
      result.current.setDepartmentType('INVALID_TYPE');
      result.current.setTenantId('tenant-1');
    });

    expect(result.current.nameError).toBe('department.form.nameTooLong');
    expect(result.current.typeError).toBe('department.form.typeInvalid');
    expect(result.current.tenantError).toBeNull();
  });

  it('submits create payload with backend-aligned fields', async () => {
    useTenant.mockReturnValue({
      list: mockListTenants,
      data: { items: [{ id: 'tenant-1', name: 'Tenant 1' }] },
      isLoading: false,
      errorCode: null,
      reset: mockResetTenants,
    });
    mockCreate.mockResolvedValue({ id: 'f1' });

    const { result } = renderHook(() => useDepartmentFormScreen());
    act(() => {
      result.current.setTenantId(' tenant-1 ');
      result.current.setName(' Main Department ');
      result.current.setShortName(' CLN ');
      result.current.setDepartmentType('CLINICAL');
      result.current.setIsActive(false);
    });

    await act(async () => {
      await result.current.onSubmit();
    });

    expect(mockCreate).toHaveBeenCalledWith({
      tenant_id: 'tenant-1',
      name: 'Main Department',
      short_name: 'CLN',
      department_type: 'CLINICAL',
      is_active: false,
    });
    expect(mockReplace).toHaveBeenCalledWith('/settings/departments?notice=created');
  });

  it('submits update payload for edit route', async () => {
    mockParams = { id: 'fid-1' };
    mockUpdate.mockResolvedValue({ id: 'fid-1' });

    const { result } = renderHook(() => useDepartmentFormScreen());
    act(() => {
      result.current.setName(' Updated Department ');
      result.current.setShortName(' RAD ');
      result.current.setDepartmentType('DIAGNOSTICS');
      result.current.setIsActive(true);
    });

    await act(async () => {
      await result.current.onSubmit();
    });

    expect(mockUpdate).toHaveBeenCalledWith('fid-1', {
      name: 'Updated Department',
      short_name: 'RAD',
      department_type: 'DIAGNOSTICS',
      is_active: true,
    });
    expect(mockReplace).toHaveBeenCalledWith('/settings/departments?notice=updated');
  });

  it('uses queued notice when offline', async () => {
    useNetwork.mockReturnValue({ isOffline: true });
    useTenant.mockReturnValue({
      list: mockListTenants,
      data: { items: [{ id: 'tenant-1', name: 'Tenant 1' }] },
      isLoading: false,
      errorCode: null,
      reset: mockResetTenants,
    });
    mockCreate.mockResolvedValue({ id: 'f1' });

    const { result } = renderHook(() => useDepartmentFormScreen());
    act(() => {
      result.current.setTenantId('tenant-1');
      result.current.setName('Clinic');
      result.current.setDepartmentType('CLINICAL');
    });

    await act(async () => {
      await result.current.onSubmit();
    });

    expect(mockReplace).toHaveBeenCalledWith('/settings/departments?notice=queued');
  });

  it('does not submit when validation fails', async () => {
    const { result } = renderHook(() => useDepartmentFormScreen());

    await act(async () => {
      await result.current.onSubmit();
    });

    expect(mockCreate).not.toHaveBeenCalled();
  });

  it('hides out-of-scope department data for tenant-scoped admins', () => {
    mockParams = { id: 'fid-1' };
    useTenantAccess.mockReturnValue({
      canAccessTenantSettings: true,
      canManageAllTenants: false,
      tenantId: 'tenant-1',
      isResolved: true,
    });
    useDepartment.mockReturnValue({
      get: mockGet,
      create: mockCreate,
      update: mockUpdate,
      data: { id: 'fid-1', tenant_id: 'tenant-2', name: 'Outside Department', department_type: 'CLINICAL' },
      isLoading: false,
      errorCode: null,
      reset: mockReset,
    });

    const { result } = renderHook(() => useDepartmentFormScreen());

    expect(result.current.department).toBeNull();
    expect(result.current.isSubmitDisabled).toBe(true);
    expect(mockReplace).toHaveBeenCalledWith('/settings/departments?notice=accessDenied');
  });
});
