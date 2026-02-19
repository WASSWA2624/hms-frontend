/**
 * useDepartmentDetailScreen Hook Tests
 */
const { renderHook, act } = require('@testing-library/react-native');
const useDepartmentDetailScreen = require('@platform/screens/settings/DepartmentDetailScreen/useDepartmentDetailScreen').default;

const mockPush = jest.fn();
const mockReplace = jest.fn();
let mockParams = { id: 'fid-1' };

jest.mock('@hooks', () => ({
  useI18n: jest.fn(() => ({ t: (k) => k })),
  useNetwork: jest.fn(() => ({ isOffline: false })),
  useDepartment: jest.fn(),
  useTenantAccess: jest.fn(),
}));

jest.mock('@utils', () => {
  const actual = jest.requireActual('@utils');
  return {
    ...actual,
    confirmAction: jest.fn(() => true),
  };
});

jest.mock('expo-router', () => ({
  useRouter: () => ({ push: mockPush, replace: mockReplace }),
  useLocalSearchParams: () => mockParams,
}));

const { useDepartment, useNetwork, useTenantAccess } = require('@hooks');
const { confirmAction } = require('@utils');

describe('useDepartmentDetailScreen', () => {
  const mockGet = jest.fn();
  const mockRemove = jest.fn();
  const mockReset = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    mockParams = { id: 'fid-1' };
    useNetwork.mockReturnValue({ isOffline: false });
    useTenantAccess.mockReturnValue({
      canAccessTenantSettings: true,
      canManageAllTenants: true,
      tenantId: null,
      isResolved: true,
    });
    useDepartment.mockReturnValue({
      get: mockGet,
      remove: mockRemove,
      data: { id: 'fid-1', tenant_id: 'tenant-1', name: 'Test Department' },
      isLoading: false,
      errorCode: null,
      reset: mockReset,
    });
  });

  it('loads department and exposes edit/delete handlers for global admins', () => {
    const { result } = renderHook(() => useDepartmentDetailScreen());

    expect(mockReset).toHaveBeenCalled();
    expect(mockGet).toHaveBeenCalledWith('fid-1');
    expect(typeof result.current.onEdit).toBe('function');
    expect(typeof result.current.onDelete).toBe('function');
  });

  it('redirects unauthorized users to settings', () => {
    useTenantAccess.mockReturnValue({
      canAccessTenantSettings: false,
      canManageAllTenants: false,
      tenantId: null,
      isResolved: true,
    });

    const { result } = renderHook(() => useDepartmentDetailScreen());

    expect(mockReplace).toHaveBeenCalledWith('/settings');
    expect(result.current.onEdit).toBeUndefined();
    expect(result.current.onDelete).toBeUndefined();
  });

  it('redirects tenant-scoped users without tenant id', () => {
    useTenantAccess.mockReturnValue({
      canAccessTenantSettings: true,
      canManageAllTenants: false,
      tenantId: null,
      isResolved: true,
    });

    renderHook(() => useDepartmentDetailScreen());

    expect(mockReplace).toHaveBeenCalledWith('/settings');
  });

  it('redirects tenant-scoped users when department belongs to another tenant', () => {
    useTenantAccess.mockReturnValue({
      canAccessTenantSettings: true,
      canManageAllTenants: false,
      tenantId: 'tenant-1',
      isResolved: true,
    });
    useDepartment.mockReturnValue({
      get: mockGet,
      remove: mockRemove,
      data: { id: 'fid-1', tenant_id: 'tenant-2', name: 'Other Tenant Department' },
      isLoading: false,
      errorCode: null,
      reset: mockReset,
    });

    const { result } = renderHook(() => useDepartmentDetailScreen());

    expect(mockReplace).toHaveBeenCalledWith('/settings/departments?notice=accessDenied');
    expect(result.current.department).toBeNull();
    expect(result.current.onEdit).toBeUndefined();
    expect(result.current.onDelete).toBeUndefined();
  });

  it('deletes and redirects with notice', async () => {
    mockRemove.mockResolvedValue({ id: 'fid-1' });
    const { result } = renderHook(() => useDepartmentDetailScreen());

    await act(async () => {
      await result.current.onDelete();
    });

    expect(mockRemove).toHaveBeenCalledWith('fid-1');
    expect(mockPush).toHaveBeenCalledWith('/settings/departments?notice=deleted');
  });

  it('deletes with queued notice when offline', async () => {
    useNetwork.mockReturnValue({ isOffline: true });
    mockRemove.mockResolvedValue({ id: 'fid-1' });
    const { result } = renderHook(() => useDepartmentDetailScreen());

    await act(async () => {
      await result.current.onDelete();
    });

    expect(mockPush).toHaveBeenCalledWith('/settings/departments?notice=queued');
  });

  it('does not delete when confirmation is cancelled', async () => {
    confirmAction.mockReturnValueOnce(false);
    const { result } = renderHook(() => useDepartmentDetailScreen());

    await act(async () => {
      await result.current.onDelete();
    });

    expect(mockRemove).not.toHaveBeenCalled();
  });
});
