/**
 * useContactFormScreen Hook Tests
 */
const { renderHook, act, waitFor } = require('@testing-library/react-native');
const useContactFormScreen = require('@platform/screens/settings/ContactFormScreen/useContactFormScreen').default;

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
  useContact: jest.fn(),
  useTenant: jest.fn(),
  useTenantAccess: jest.fn(),
}));

const {
  useI18n,
  useNetwork,
  useContact,
  useTenant,
  useTenantAccess,
} = require('@hooks');

describe('useContactFormScreen', () => {
  const mockGet = jest.fn();
  const mockCreate = jest.fn();
  const mockUpdate = jest.fn();
  const mockReset = jest.fn();
  const mockListTenants = jest.fn();
  const mockResetTenants = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    mockParams = {};
    useI18n.mockReturnValue({ t: (k) => k });
    useNetwork.mockReturnValue({ isOffline: false });
    useTenantAccess.mockReturnValue({
      canAccessTenantSettings: true,
      canManageAllTenants: true,
      tenantId: null,
      isResolved: true,
    });
    useContact.mockReturnValue({
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

  it('redirects users without contact access', () => {
    useTenantAccess.mockReturnValue({
      canAccessTenantSettings: false,
      canManageAllTenants: false,
      tenantId: null,
      isResolved: true,
    });

    renderHook(() => useContactFormScreen());

    expect(mockReplace).toHaveBeenCalledWith('/settings');
  });

  it('prefills tenant for tenant-scoped admins', () => {
    useTenantAccess.mockReturnValue({
      canAccessTenantSettings: true,
      canManageAllTenants: false,
      tenantId: 'tenant-1',
      isResolved: true,
    });

    const { result } = renderHook(() => useContactFormScreen());

    expect(result.current.tenantId).toBe('tenant-1');
    expect(result.current.tenantListLoading).toBe(false);
    expect(mockListTenants).not.toHaveBeenCalled();
  });

  it('returns initial state for create', () => {
    const { result } = renderHook(() => useContactFormScreen());
    expect(result.current.isEdit).toBe(false);
    expect(result.current.value).toBe('');
    expect(result.current.contactType).toBe('');
    expect(result.current.isPrimary).toBe(false);
    expect(result.current.tenantId).toBe('');
    expect(result.current.contact).toBeNull();
  });

  it('calls get on mount when editing', () => {
    mockParams = { id: 'cid-1' };
    renderHook(() => useContactFormScreen());
    expect(mockReset).toHaveBeenCalled();
    expect(mockGet).toHaveBeenCalledWith('cid-1');
  });

  it('lists tenants on mount when creating with capped limit', () => {
    renderHook(() => useContactFormScreen());
    expect(mockResetTenants).toHaveBeenCalled();
    expect(mockListTenants).toHaveBeenCalledWith({ page: 1, limit: 100 });
  });

  it('hydrates form state from contact data', () => {
    mockParams = { id: 'cid-1' };
    useContact.mockReturnValue({
      get: mockGet,
      create: mockCreate,
      update: mockUpdate,
      data: {
        value: 'contact@acme.org',
        contact_type: 'EMAIL',
        is_primary: true,
        tenant_id: 't1',
      },
      isLoading: false,
      errorCode: null,
      reset: mockReset,
    });

    const { result } = renderHook(() => useContactFormScreen());
    expect(result.current.value).toBe('contact@acme.org');
    expect(result.current.contactType).toBe('EMAIL');
    expect(result.current.isPrimary).toBe(true);
    expect(result.current.tenantId).toBe('t1');
  });

  it('uses fallback submit error message for unknown error codes', () => {
    useI18n.mockReturnValue({
      t: (k) => (k === 'contact.form.submitErrorMessage' ? 'Fallback message' : k),
    });
    useContact.mockReturnValue({
      get: mockGet,
      create: mockCreate,
      update: mockUpdate,
      data: null,
      isLoading: false,
      errorCode: 'UNKNOWN_ERROR',
      reset: mockReset,
    });

    const { result } = renderHook(() => useContactFormScreen());
    expect(result.current.hasError).toBe(true);
    expect(result.current.errorMessage).toBe('Fallback message');
  });

  it('uses fallback tenant error message for unknown error codes', () => {
    useI18n.mockReturnValue({
      t: (k) => (k === 'contact.form.tenantLoadErrorMessage' ? 'Tenant fallback' : k),
    });
    useTenant.mockReturnValue({
      list: mockListTenants,
      data: { items: [] },
      isLoading: false,
      errorCode: 'UNKNOWN_ERROR',
      reset: mockResetTenants,
    });

    const { result } = renderHook(() => useContactFormScreen());
    expect(result.current.tenantListError).toBe(true);
    expect(result.current.tenantErrorMessage).toBe('Tenant fallback');
  });

  it('submits create payload and navigates on success', async () => {
    mockCreate.mockResolvedValue({ id: 'c1' });
    useTenant.mockReturnValue({
      list: mockListTenants,
      data: { items: [{ id: 't1', name: 'Tenant 1' }] },
      isLoading: false,
      errorCode: null,
      reset: mockResetTenants,
    });

    const { result } = renderHook(() => useContactFormScreen());
    act(() => {
      result.current.setTenantId(' t1 ');
      result.current.setValue(' contact@acme.org ');
      result.current.setContactType(' EMAIL ');
      result.current.setIsPrimary(true);
    });

    await act(async () => {
      await result.current.onSubmit();
    });

    expect(mockCreate).toHaveBeenCalledWith({
      value: 'contact@acme.org',
      contact_type: 'EMAIL',
      is_primary: true,
      tenant_id: 't1',
    });
    expect(mockReplace).toHaveBeenCalledWith('/settings/contacts?notice=created');
  });

  it('submits update payload and navigates on success', async () => {
    mockParams = { id: 'cid-1' };
    mockUpdate.mockResolvedValue({ id: 'cid-1' });

    const { result } = renderHook(() => useContactFormScreen());
    act(() => {
      result.current.setValue('456700123456');
      result.current.setContactType('PHONE');
      result.current.setIsPrimary(false);
    });

    await act(async () => {
      await result.current.onSubmit();
    });

    expect(mockUpdate).toHaveBeenCalledWith('cid-1', {
      value: '456700123456',
      contact_type: 'PHONE',
      is_primary: false,
    });
    expect(mockReplace).toHaveBeenCalledWith('/settings/contacts?notice=updated');
  });

  it('uses queued notice when offline', async () => {
    useNetwork.mockReturnValue({ isOffline: true });
    mockCreate.mockResolvedValue({ id: 'c1' });
    useTenant.mockReturnValue({
      list: mockListTenants,
      data: { items: [{ id: 't1', name: 'Tenant 1' }] },
      isLoading: false,
      errorCode: null,
      reset: mockResetTenants,
    });

    const { result } = renderHook(() => useContactFormScreen());
    act(() => {
      result.current.setTenantId('t1');
      result.current.setValue('contact@acme.org');
      result.current.setContactType('EMAIL');
    });

    await act(async () => {
      await result.current.onSubmit();
    });

    expect(mockReplace).toHaveBeenCalledWith('/settings/contacts?notice=queued');
  });

  it('does not navigate when create returns undefined', async () => {
    mockCreate.mockResolvedValue(undefined);
    useTenant.mockReturnValue({
      list: mockListTenants,
      data: { items: [{ id: 't1', name: 'Tenant 1' }] },
      isLoading: false,
      errorCode: null,
      reset: mockResetTenants,
    });

    const { result } = renderHook(() => useContactFormScreen());
    act(() => {
      result.current.setTenantId('t1');
      result.current.setValue('contact@acme.org');
      result.current.setContactType('EMAIL');
    });

    await act(async () => {
      await result.current.onSubmit();
    });

    expect(mockReplace).not.toHaveBeenCalled();
  });

  it('does not submit when required fields are missing', async () => {
    const { result } = renderHook(() => useContactFormScreen());

    await act(async () => {
      await result.current.onSubmit();
    });

    expect(mockCreate).not.toHaveBeenCalled();
    expect(mockUpdate).not.toHaveBeenCalled();
  });

  it('onCancel navigates back to list', () => {
    const { result } = renderHook(() => useContactFormScreen());
    result.current.onCancel();
    expect(mockPush).toHaveBeenCalledWith('/settings/contacts');
  });

  it('navigation helper routes to tenants module', () => {
    const { result } = renderHook(() => useContactFormScreen());
    result.current.onGoToTenants();
    expect(mockPush).toHaveBeenCalledWith('/settings/tenants');
  });

  it('onRetryTenants reloads tenant list with capped limit', () => {
    const { result } = renderHook(() => useContactFormScreen());
    result.current.onRetryTenants();
    expect(mockResetTenants).toHaveBeenCalled();
    expect(mockListTenants).toHaveBeenCalledWith({ page: 1, limit: 100 });
  });

  it('creates readable tenant display labels from loaded tenant options', () => {
    useTenant.mockReturnValue({
      list: mockListTenants,
      data: { items: [{ id: 't1', name: 'Acme Tenant' }] },
      isLoading: false,
      errorCode: null,
      reset: mockResetTenants,
    });

    const { result } = renderHook(() => useContactFormScreen());
    act(() => {
      result.current.setTenantId('t1');
    });

    expect(result.current.tenantDisplayLabel).toBe('Acme Tenant');
  });
});