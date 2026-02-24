/**
 * useOpdFlowAccess Hook Tests
 * File: useOpdFlowAccess.test.js
 */
import { renderHook } from '@testing-library/react-native';
import useOpdFlowAccess from '@hooks/useOpdFlowAccess';

jest.mock('@hooks/useScopeAccess', () => ({
  __esModule: true,
  default: jest.fn(),
}));

const useScopeAccess = require('@hooks/useScopeAccess').default;

describe('useOpdFlowAccess', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    useScopeAccess.mockReturnValue({
      roles: ['RECEPTIONIST'],
      canRead: true,
      canManageAllTenants: false,
      tenantId: 'tenant-1',
      facilityId: 'facility-1',
      isResolved: true,
    });
  });

  it('grants all actions to global admins', () => {
    useScopeAccess.mockReturnValue({
      roles: ['SUPER_ADMIN'],
      canRead: true,
      canManageAllTenants: true,
      tenantId: null,
      facilityId: null,
      isResolved: true,
    });

    const { result } = renderHook(() => useOpdFlowAccess());

    expect(result.current.canManageAllTenants).toBe(true);
    expect(result.current.canAccessOpdFlow).toBe(true);
    expect(result.current.canStartFlow).toBe(true);
    expect(result.current.canPayConsultation).toBe(true);
    expect(result.current.canRecordVitals).toBe(true);
    expect(result.current.canAssignDoctor).toBe(true);
    expect(result.current.canDoctorReview).toBe(true);
    expect(result.current.canDisposition).toBe(true);
  });

  it('grants receptionist payment and assignment actions but blocks doctor review', () => {
    const { result } = renderHook(() => useOpdFlowAccess());

    expect(result.current.canAccessOpdFlow).toBe(true);
    expect(result.current.canStartFlow).toBe(true);
    expect(result.current.canPayConsultation).toBe(true);
    expect(result.current.canAssignDoctor).toBe(true);
    expect(result.current.canRecordVitals).toBe(false);
    expect(result.current.canDoctorReview).toBe(false);
    expect(result.current.canDisposition).toBe(false);
  });

  it('grants nurse vitals and assignment actions but blocks payment', () => {
    useScopeAccess.mockReturnValue({
      roles: ['NURSE'],
      canRead: true,
      canManageAllTenants: false,
      tenantId: 'tenant-1',
      facilityId: 'facility-1',
      isResolved: true,
    });

    const { result } = renderHook(() => useOpdFlowAccess());

    expect(result.current.canAccessOpdFlow).toBe(true);
    expect(result.current.canRecordVitals).toBe(true);
    expect(result.current.canAssignDoctor).toBe(true);
    expect(result.current.canPayConsultation).toBe(false);
  });

  it('exposes scoped tenant and facility ids for non-global roles', () => {
    const { result } = renderHook(() => useOpdFlowAccess());

    expect(result.current.canManageAllTenants).toBe(false);
    expect(result.current.tenantId).toBe('tenant-1');
    expect(result.current.facilityId).toBe('facility-1');
    expect(result.current.isResolved).toBe(true);
  });
});