/**
 * Permissions Helpers
 * Pure permission checks shared across app layers.
 * File: permissions.js
 */

const normalizePermission = (value) => {
  if (typeof value !== 'string') return null;
  const trimmed = value.trim();
  return trimmed ? trimmed : null;
};

const toPermissionSet = (permissions) => {
  if (!Array.isArray(permissions)) return new Set();
  const normalized = permissions.map(normalizePermission).filter(Boolean);
  return new Set(normalized);
};

const hasPermission = (grantedPermissions, requiredPermission) => {
  const required = normalizePermission(requiredPermission);
  if (!required) return false;
  return toPermissionSet(grantedPermissions).has(required);
};

const hasAnyPermission = (grantedPermissions, requiredPermissions) => {
  if (!Array.isArray(requiredPermissions) || !requiredPermissions.length) {
    return false;
  }
  const grantedSet = toPermissionSet(grantedPermissions);
  return requiredPermissions
    .map(normalizePermission)
    .filter(Boolean)
    .some((required) => grantedSet.has(required));
};

const hasAllPermissions = (grantedPermissions, requiredPermissions) => {
  if (!Array.isArray(requiredPermissions) || !requiredPermissions.length) {
    return true;
  }
  const grantedSet = toPermissionSet(grantedPermissions);
  return requiredPermissions
    .map(normalizePermission)
    .filter(Boolean)
    .every((required) => grantedSet.has(required));
};

export { hasPermission, hasAnyPermission, hasAllPermissions };
