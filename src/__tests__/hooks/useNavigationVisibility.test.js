import React from 'react';
import { render } from '@testing-library/react-native';
import useNavigationVisibility from '@hooks/useNavigationVisibility';
import { MAIN_NAV_ITEMS, PATIENT_MENU_ITEMS } from '@config/sideMenu';

jest.mock('@hooks/useAuth', () => ({
  __esModule: true,
  default: jest.fn(),
}));

jest.mock('@hooks/useResolvedRoles', () => ({
  __esModule: true,
  default: jest.fn(),
}));

jest.mock('@hooks/usePatientAccess', () => ({
  __esModule: true,
  default: jest.fn(),
}));

const useAuth = require('@hooks/useAuth').default;
const useResolvedRoles = require('@hooks/useResolvedRoles').default;
const usePatientAccess = require('@hooks/usePatientAccess').default;

const TestComponent = ({ onResult }) => {
  const result = useNavigationVisibility();
  React.useEffect(() => {
    onResult(result);
  }, [onResult, result]);
  return null;
};

const findMainItem = (id) => MAIN_NAV_ITEMS.find((item) => item.id === id);

describe('useNavigationVisibility', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    useAuth.mockReturnValue({ isAuthenticated: true, user: { tenant_id: 'tenant-1' } });
    useResolvedRoles.mockReturnValue({ roles: ['SUPER_ADMIN'], isResolved: true });
    usePatientAccess.mockReturnValue({
      canAccessPatients: true,
      canAccessPatientLegalHub: true,
    });
  });

  it('returns visible for authenticated users on unrestricted items', () => {
    let result;
    render(<TestComponent onResult={(value) => (result = value)} />);
    expect(result.isItemVisible({ id: 'home' })).toBe(true);
  });

  it('returns false when not authenticated', () => {
    useAuth.mockReturnValue({ isAuthenticated: false, user: null });

    let result;
    render(<TestComponent onResult={(value) => (result = value)} />);
    expect(result.isItemVisible({ id: 'home' })).toBe(false);
  });

  it('normalizes legacy alias roles for visibility checks', () => {
    useResolvedRoles.mockReturnValue({ roles: ['FRONT_DESK'], isResolved: true });

    let result;
    render(<TestComponent onResult={(value) => (result = value)} />);

    const schedulingItem = findMainItem('scheduling');
    expect(result.isItemVisible(schedulingItem)).toBe(true);
  });

  it('hides role-restricted item while roles are unresolved', () => {
    useResolvedRoles.mockReturnValue({ roles: [], isResolved: false });

    let result;
    render(<TestComponent onResult={(value) => (result = value)} />);

    expect(result.isItemVisible(findMainItem('settings'))).toBe(false);
  });

  it('shows LAB_TECH diagnostics domains but hides billing/hr/settings', () => {
    useResolvedRoles.mockReturnValue({ roles: ['LAB_TECH'], isResolved: true });

    let result;
    render(<TestComponent onResult={(value) => (result = value)} />);

    expect(result.isItemVisible(findMainItem('lab'))).toBe(true);
    expect(result.isItemVisible(findMainItem('radiology'))).toBe(true);
    expect(result.isItemVisible(findMainItem('billing'))).toBe(false);
    expect(result.isItemVisible(findMainItem('hr'))).toBe(false);
    expect(result.isItemVisible(findMainItem('settings'))).toBe(false);
  });

  it('shows dashboard/emergency/communications to AMBULANCE_OPERATOR only', () => {
    useResolvedRoles.mockReturnValue({ roles: ['AMBULANCE_OPERATOR'], isResolved: true });

    let result;
    render(<TestComponent onResult={(value) => (result = value)} />);

    expect(result.isItemVisible(findMainItem('dashboard'))).toBe(true);
    expect(result.isItemVisible(findMainItem('emergency'))).toBe(true);
    expect(result.isItemVisible(findMainItem('communications'))).toBe(true);
    expect(result.isItemVisible(findMainItem('billing'))).toBe(false);
    expect(result.isItemVisible(findMainItem('hr'))).toBe(false);
    expect(result.isItemVisible(findMainItem('settings'))).toBe(false);
    expect(result.isItemVisible(findMainItem('lab'))).toBe(false);
    expect(result.isItemVisible(findMainItem('radiology'))).toBe(false);
  });

  it('shows housekeeping to HOUSE_KEEPER but hides biomedical', () => {
    useResolvedRoles.mockReturnValue({ roles: ['HOUSE_KEEPER'], isResolved: true });

    let result;
    render(<TestComponent onResult={(value) => (result = value)} />);

    expect(result.isItemVisible(findMainItem('housekeeping'))).toBe(true);
    expect(result.isItemVisible(findMainItem('biomedical'))).toBe(false);
  });

  it('shows biomedical to BIOMED and hides housekeeping service domain', () => {
    useResolvedRoles.mockReturnValue({ roles: ['BIOMED'], isResolved: true });

    let result;
    render(<TestComponent onResult={(value) => (result = value)} />);

    expect(result.isItemVisible(findMainItem('biomedical'))).toBe(true);
    expect(result.isItemVisible(findMainItem('housekeeping'))).toBe(false);
  });

  it('shows billing to BILLING and hides clinical domain', () => {
    useResolvedRoles.mockReturnValue({ roles: ['BILLING'], isResolved: true });

    let result;
    render(<TestComponent onResult={(value) => (result = value)} />);

    expect(result.isItemVisible(findMainItem('billing'))).toBe(true);
    expect(result.isItemVisible(findMainItem('clinical'))).toBe(false);
  });

  it('shows only patient portal menu items for PATIENT role', () => {
    useAuth.mockReturnValue({ isAuthenticated: true, user: null });
    useResolvedRoles.mockReturnValue({ roles: ['PATIENT'], isResolved: true });

    let result;
    render(<TestComponent onResult={(value) => (result = value)} />);

    expect(result.isItemVisible(findMainItem('dashboard'))).toBe(false);
    expect(result.isItemVisible(PATIENT_MENU_ITEMS[0])).toBe(true);
  });

  it('hides tenant-scoped items when tenant context is missing', () => {
    useAuth.mockReturnValue({ isAuthenticated: true, user: null });
    useResolvedRoles.mockReturnValue({ roles: ['TENANT_ADMIN'], isResolved: true });

    let result;
    render(<TestComponent onResult={(value) => (result = value)} />);

    expect(result.isItemVisible(findMainItem('dashboard'))).toBe(true);
    expect(result.isItemVisible(findMainItem('settings'))).toBe(true);
    expect(result.isItemVisible(findMainItem('emergency'))).toBe(false);
  });
});
