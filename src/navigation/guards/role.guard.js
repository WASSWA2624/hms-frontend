/**
 * Role Guard Hook
 * 
 * Checks user roles and redirects if access denied.
 * 
 * @param {Object} options - Configuration options
 * @param {string|string[]} options.requiredRoles - Required role(s) for access
 * @param {string} [options.redirectPath='/home'] - Path to redirect to if access denied
 * @returns {Object} Access state object with { hasAccess, errorCode }
 * 
 * @example
 * const { hasAccess, errorCode } = useRoleGuard({ requiredRoles: 'ADMIN' });
 * const { hasAccess, errorCode } = useRoleGuard({ requiredRoles: ['ADMIN', 'MODERATOR'], redirectPath: '/unauthorized' });
 */

import { useEffect, useRef, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { useRouter } from 'expo-router';
import { selectUser } from '@store/selectors';

// Error codes
export const ROLE_GUARD_ERRORS = {
  NO_USER: 'NO_USER',
  NO_ROLE: 'NO_ROLE',
  INSUFFICIENT_ROLE: 'INSUFFICIENT_ROLE',
};

export function useRoleGuard(options) {
  const { requiredRoles, redirectPath = '/home' } = options || {};
  
  const router = useRouter();
  const user = useSelector(selectUser);
  
  // Normalize requiredRoles to array
  const requiredRolesArray = useMemo(() => {
    if (!requiredRoles) {
      return [];
    }
    return Array.isArray(requiredRoles) ? requiredRoles : [requiredRoles];
  }, [requiredRoles]);
  
  // Check if user has required role(s)
  const hasAccess = useMemo(() => {
    // No user means no access
    if (!user) {
      return false;
    }
    
    // No required roles means access granted
    if (requiredRolesArray.length === 0) {
      return true;
    }
    
    // Get user role (user.role or user.roles array)
    const userRole = user.role;
    const userRoles = user.roles || (userRole ? [userRole] : []);
    
    // Check if user has at least one of the required roles
    const normalizedUserRoles = Array.isArray(userRoles) ? userRoles : [userRoles];
    return requiredRolesArray.some((requiredRole) =>
      normalizedUserRoles.includes(requiredRole)
    );
  }, [user, requiredRolesArray]);
  
  // Determine error code
  const errorCode = useMemo(() => {
    if (!user) {
      return ROLE_GUARD_ERRORS.NO_USER;
    }
    if (!hasAccess && requiredRolesArray.length > 0) {
      return ROLE_GUARD_ERRORS.INSUFFICIENT_ROLE;
    }
    return null;
  }, [user, hasAccess, requiredRolesArray]);
  
  // Use ref to track if redirect has been performed to prevent multiple redirects
  const hasRedirected = useRef(false);
  
  useEffect(() => {
    if (hasAccess) {
      // Reset redirect flag when access granted
      hasRedirected.current = false;
    } else if (!hasRedirected.current && requiredRolesArray.length > 0) {
      // Only redirect if access denied and haven't redirected yet
      hasRedirected.current = true;
      router.replace(redirectPath);
    }
  }, [hasAccess, redirectPath, router, requiredRolesArray.length]);
  
  return {
    hasAccess,
    errorCode,
  };
}

