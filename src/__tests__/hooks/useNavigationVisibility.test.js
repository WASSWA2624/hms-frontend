/**
 * useNavigationVisibility Hook Tests
 * File: useNavigationVisibility.test.js
 */
import React from 'react';
import { render } from '@testing-library/react-native';
import useNavigationVisibility from '@hooks/useNavigationVisibility';

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

const TestComponent = ({ onResult }) => {
  const result = useNavigationVisibility();
  React.useEffect(() => {
    onResult(result);
  }, [onResult, result]);
  return null;
};

describe('useNavigationVisibility', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    useAuth.mockReturnValue({ isAuthenticated: true });
    useResolvedRoles.mockReturnValue({ roles: ['app_admin'], isResolved: true });
  });

  it('returns visible for authenticated users on unrestricted items', () => {
    let result;
    render(<TestComponent onResult={(value) => (result = value)} />);
    expect(result.isItemVisible({ id: 'home' })).toBe(true);
  });

  it('returns false when not authenticated', () => {
    useAuth.mockReturnValue({ isAuthenticated: false });

    let result;
    render(<TestComponent onResult={(value) => (result = value)} />);
    expect(result.isItemVisible({ id: 'home' })).toBe(false);
  });

  it('shows role-restricted item when roles match (case-insensitive)', () => {
    useResolvedRoles.mockReturnValue({ roles: ['super_admin'], isResolved: true });

    let result;
    render(<TestComponent onResult={(value) => (result = value)} />);
    expect(result.isItemVisible({ id: 'settings-tenants', roles: ['SUPER_ADMIN'] })).toBe(true);
  });

  it('hides role-restricted item when roles do not match', () => {
    useResolvedRoles.mockReturnValue({ roles: ['tenant_admin'], isResolved: true });

    let result;
    render(<TestComponent onResult={(value) => (result = value)} />);
    expect(result.isItemVisible({ id: 'settings-tenants', roles: ['APP_ADMIN'] })).toBe(false);
  });

  it('hides role-restricted item while roles are unresolved', () => {
    useResolvedRoles.mockReturnValue({ roles: [], isResolved: false });

    let result;
    render(<TestComponent onResult={(value) => (result = value)} />);
    expect(result.isItemVisible({ id: 'settings-tenants', roles: ['APP_ADMIN'] })).toBe(false);
    expect(result.isItemVisible({ id: 'dashboard' })).toBe(true);
  });

  it('hides facilities item for non-admin roles and shows for scoped admins', () => {
    let result;
    useResolvedRoles.mockReturnValue({ roles: ['user'], isResolved: true });
    render(<TestComponent onResult={(value) => (result = value)} />);
    expect(
      result.isItemVisible({
        id: 'settings-facilities',
        roles: ['APP_ADMIN', 'SUPER_ADMIN', 'TENANT_ADMIN', 'ADMIN'],
      })
    ).toBe(false);

    useResolvedRoles.mockReturnValue({ roles: ['admin'], isResolved: true });
    render(<TestComponent onResult={(value) => (result = value)} />);
    expect(
      result.isItemVisible({
        id: 'settings-facilities',
        roles: ['APP_ADMIN', 'SUPER_ADMIN', 'TENANT_ADMIN', 'ADMIN'],
      })
    ).toBe(true);
  });
});
