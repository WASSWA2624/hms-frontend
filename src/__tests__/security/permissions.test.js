/**
 * Permissions Helpers Tests
 * File: permissions.test.js
 */
const {
  permissions,
  hasPermission,
  hasAnyPermission,
  hasAllPermissions,
} = require('@security');

describe('Permission Helpers', () => {
  const granted = ['tenant.read', 'tenant.write', ' user.manage '];

  it('exports helpers from namespace and named security barrel exports', () => {
    expect(typeof permissions.hasPermission).toBe('function');
    expect(typeof hasPermission).toBe('function');
    expect(typeof hasAnyPermission).toBe('function');
    expect(typeof hasAllPermissions).toBe('function');
  });

  it('checks single permission with trimming support', () => {
    expect(hasPermission(granted, 'tenant.read')).toBe(true);
    expect(hasPermission(granted, 'user.manage')).toBe(true);
    expect(hasPermission(granted, 'tenant.delete')).toBe(false);
  });

  it('checks any-permission behavior and ignores invalid values', () => {
    expect(hasAnyPermission(granted, ['tenant.delete', 'tenant.write'])).toBe(
      true
    );
    expect(hasAnyPermission(granted, ['tenant.delete', '', null])).toBe(false);
  });

  it('checks all-permission behavior with sane empty requirement handling', () => {
    expect(hasAllPermissions(granted, ['tenant.read', 'tenant.write'])).toBe(
      true
    );
    expect(hasAllPermissions(granted, ['tenant.read', 'tenant.delete'])).toBe(
      false
    );
    expect(hasAllPermissions(granted, [])).toBe(true);
  });
});
