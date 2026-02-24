/**
 * Role normalization helpers shared by auth/visibility hooks.
 * File: roleUtils.js
 */
import { normalizeRoleKey as normalizePolicyRoleKey } from '@config/accessPolicy';

const isNonEmptyString = (value) => typeof value === 'string' && value.trim().length > 0;

const extractRoleName = (value) => {
  if (isNonEmptyString(value) || typeof value === 'number') {
    return String(value);
  }
  if (!value || typeof value !== 'object') return null;

  const directFields = ['name', 'role_name', 'roleName', 'authority'];
  for (const field of directFields) {
    const candidate = value[field];
    if (isNonEmptyString(candidate) || typeof candidate === 'number') {
      return String(candidate);
    }
  }

  if (value.role) {
    const nested = extractRoleName(value.role);
    if (nested) return nested;
  }

  return null;
};

const normalizeRoleKey = (role) => normalizePolicyRoleKey(role);

const normalizeRole = (role) => {
  const key = normalizeRoleKey(role);
  return key ? key.toLowerCase() : null;
};

const normalizeRoles = (roles) => {
  if (!roles) return [];
  const list = Array.isArray(roles) ? roles : [roles];
  return [...new Set(list.map(normalizeRole).filter(Boolean))];
};

export { extractRoleName, normalizeRole, normalizeRoleKey, normalizeRoles };