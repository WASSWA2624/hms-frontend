/**
 * Role Guard Hook
 *
 * Checks user roles and redirects if access denied.
 *
 * @param {Object} options - Configuration options
 * @param {string|string[]} options.requiredRoles - Required role(s) for access
 * @param {string} [options.redirectPath='/dashboard'] - Path to redirect to if access denied
 * @returns {Object} Access state object with { hasAccess, errorCode }
 */

import { useEffect, useMemo, useRef } from 'react';
import { useSelector } from 'react-redux';
import { useRouter } from 'expo-router';
import { resolveCanonicalRoles } from '@config/accessPolicy';

export const ROLE_GUARD_ERRORS = {
  NO_USER: 'NO_USER',
  NO_ROLE: 'NO_ROLE',
  INSUFFICIENT_ROLE: 'INSUFFICIENT_ROLE',
};

export function useRoleGuard(options) {
  const { requiredRoles, redirectPath = '/dashboard' } = options || {};

  const router = useRouter();
  const user = useSelector((state) => state?.auth?.user || state?.ui?.user || null);
  const isRehydrated = useSelector((state) => Boolean(state?._persist?.rehydrated));

  const requiredRolesArray = useMemo(() => {
    if (!requiredRoles) return [];
    return resolveCanonicalRoles(Array.isArray(requiredRoles) ? requiredRoles : [requiredRoles]);
  }, [requiredRoles]);

  const normalizedUserRoles = useMemo(() => {
    if (!user) return [];
    return resolveCanonicalRoles([
      ...(Array.isArray(user?.roles) ? user.roles : user?.roles ? [user.roles] : []),
      user?.role,
      user?.role_name,
    ]);
  }, [user]);

  const hasAccess = useMemo(() => {
    if (requiredRolesArray.length === 0) {
      return Boolean(user);
    }

    if (!user) {
      return false;
    }

    return requiredRolesArray.some((requiredRole) =>
      normalizedUserRoles.includes(requiredRole)
    );
  }, [normalizedUserRoles, requiredRolesArray, user]);

  const errorCode = useMemo(() => {
    if (requiredRolesArray.length === 0) {
      return user ? null : ROLE_GUARD_ERRORS.NO_USER;
    }
    if (!user) {
      return ROLE_GUARD_ERRORS.NO_USER;
    }
    if (normalizedUserRoles.length === 0) {
      return ROLE_GUARD_ERRORS.NO_ROLE;
    }
    if (!hasAccess) {
      return ROLE_GUARD_ERRORS.INSUFFICIENT_ROLE;
    }
    return null;
  }, [hasAccess, normalizedUserRoles.length, requiredRolesArray.length, user]);

  const hasRedirected = useRef(false);

  useEffect(() => {
    if (!isRehydrated) return;
    if (hasAccess || requiredRolesArray.length === 0) {
      hasRedirected.current = false;
      return;
    }
    if (hasRedirected.current) return;
    hasRedirected.current = true;
    router.replace(redirectPath);
  }, [hasAccess, isRehydrated, redirectPath, requiredRolesArray.length, router]);

  return {
    hasAccess,
    errorCode,
  };
}