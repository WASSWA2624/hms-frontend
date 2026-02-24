/**
 * useOpdFlowAccess Hook Tests
 * File: useOpdFlowAccess.test.js
 */
import { renderHook } from '@testing-library/react-native';
import useOpdFlowAccess from '@hooks/useOpdFlowAccess';

jest.mock('@hooks/useAuth', () => ({
  __esModule: true,
  default: jest.fn(),
}));

jest.mock('@hooks/useResolvedRoles', () => ({
  __esModule: true,
  default: jest.fn(),
}));

const useAuth = require('@hooks/useAuth').default;
const useResolvedRoles = require('@hooks/useResolvedRoles').default;

describe('useOpdFlowAccess', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    useAuth.mockReturnValue({
      user: { tenant_id: 'tenant-1', facility_id: 'facility-1' },
    });
    useResolvedRoles.mockReturnValue({
      roles: ['RECEPTIONIST'],
      isResolved: true,
    });
  });

  it('grants all actions to global admins', () => {
    useResolvedRoles.mockReturnValue({
      roles: ['APP_ADMIN'],
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
    useResolvedRoles.mockReturnValue({
      roles: ['NURSE'],
      isResolved: true,
    });
    const { result } = renderHook(() => useOpdFlowAccess());

    expect(result.current.canAccessOpdFlow).toBe(true);
    expect(result.current.canRecordVitals).toBe(true);
    expect(result.current.canAssignDoctor).toBe(true);
    expect(result.current.canPayConsultation).toBe(false);
  });

  it('resolves scoped tenant and facility ids for non-global roles', () => {
    useAuth.mockReturnValue({
      user: {
        tenant: { id: 'tenant-2' },
        facility: { id: 'facility-2' },
      },
    });
    const { result } = renderHook(() => useOpdFlowAccess());

    expect(result.current.canManageAllTenants).toBe(false);
    expect(result.current.tenantId).toBe('tenant-2');
    expect(result.current.facilityId).toBe('facility-2');
    expect(result.current.isResolved).toBe(true);
  });
});
