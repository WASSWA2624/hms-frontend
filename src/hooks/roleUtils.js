/**
 * Role normalization helpers shared by auth/visibility hooks.
 * File: roleUtils.js
 */

const isNonEmptyString = (value) => typeof value === 'string' && value.trim().length > 0;

const extractRoleName = (value) => {
  if (isNonEmptyString(value) || typeof value === 'number') {
    return String(value);
  }
  if (!value || typeof value !== 'object') return null;

  const directFields = ['name', 'role_name', 'roleName', 'authority'];
  for (const field of directFields) {
    const candidate = value[field];
    if (isNonEmptyString(candidate)) return candidate;
  }

  if (value.role) {
    const nested = extractRoleName(value.role);
    if (nested) return nested;
  }

  return null;
};

const normalizeRole = (role) => {
  const name = extractRoleName(role);
  return name ? name.trim().toLowerCase() : null;
};

const normalizeRoleKey = (role) => {
  const name = extractRoleName(role);
  return name ? name.trim().toUpperCase() : null;
};

const normalizeRoles = (roles) => {
  if (!roles) return [];
  const list = Array.isArray(roles) ? roles : [roles];
  return [...new Set(list.map(normalizeRole).filter(Boolean))];
};

export { extractRoleName, normalizeRole, normalizeRoleKey, normalizeRoles };

