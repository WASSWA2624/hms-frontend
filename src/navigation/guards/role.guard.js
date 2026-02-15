/**
 * Role Guard Hook
 * 
 * Checks user roles and redirects if access denied.
 * 
 * @param {Object} options - Configuration options
 * @param {string|string[]} options.requiredRoles - Required role(s) for access
 * @param {string} [options.redirectPath='/dashboard'] - Path to redirect to if access denied
 * @returns {Object} Access state object with { hasAccess, errorCode }
 * 
 * @example
 * const { hasAccess, errorCode } = useRoleGuard({ requiredRoles: 'ADMIN' });
 * const { hasAccess, errorCode } = useRoleGuard({ requiredRoles: ['ADMIN', 'MODERATOR'], redirectPath: '/unauthorized' });
 */

import { useEffect, useRef, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { useRouter } from 'expo-router';

// Error codes
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
  
  // Normalize requiredRoles to array
  const requiredRolesArray = useMemo(() => {
    if (!requiredRoles) {
      return [];
    }
    return (Array.isArray(requiredRoles) ? requiredRoles : [requiredRoles]).filter(Boolean);
  }, [requiredRoles]);
  
  // Check if user has required role(s)
  const hasAccess = useMemo(() => {
    // No required roles means access granted
    if (requiredRolesArray.length === 0) {
      return Boolean(user);
    }

    // No user means no access
    if (!user) {
      return false;
    }
    
    // Get user role (user.role or user.roles array)
    const userRole = user.role || user.role_name;
    const userRoles = user.roles || (userRole ? [userRole] : []);
    
    // Check if user has at least one of the required roles
    const normalizedUserRoles = Array.isArray(userRoles) ? userRoles : [userRoles];
    return requiredRolesArray.some((requiredRole) =>
      normalizedUserRoles.includes(requiredRole)
    );
  }, [user, requiredRolesArray]);
  
  // Determine error code
  const errorCode = useMemo(() => {
    if (requiredRolesArray.length === 0) {
      return user ? null : ROLE_GUARD_ERRORS.NO_USER;
    }
    if (!user) {
      return ROLE_GUARD_ERRORS.NO_USER;
    }
    if (!hasAccess) {
      return ROLE_GUARD_ERRORS.INSUFFICIENT_ROLE;
    }
    return null;
  }, [user, hasAccess, requiredRolesArray]);
  
  // Use ref to track if redirect has been performed to prevent multiple redirects
  const hasRedirected = useRef(false);
  
  useEffect(() => {
    if (!isRehydrated) return;
    if (hasAccess || requiredRolesArray.length === 0) {
      // Reset redirect flag when access granted
      hasRedirected.current = false;
    } else if (!hasRedirected.current) {
      // Only redirect if access denied and haven't redirected yet
      hasRedirected.current = true;
      router.replace(redirectPath);
    }
  }, [hasAccess, isRehydrated, redirectPath, router, requiredRolesArray.length]);
  
  return {
    hasAccess,
    errorCode,
  };
}

