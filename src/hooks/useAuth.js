/**
 * useAuth Hook
 * Provides minimal auth state from Redux for UI guards/navigation.
 * File: useAuth.js
 */
import { useCallback, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectIsAuthenticated, selectUser } from '@store/selectors';
import { actions as authActions } from '@store/slices/auth.slice';

const normalizeRole = (role) => {
  if (!role) return null;
  return String(role).trim().toLowerCase();
};

const normalizeRoles = (roles) => {
  if (!roles) return [];
  const list = Array.isArray(roles) ? roles : [roles];
  return list.map(normalizeRole).filter(Boolean);
};

/**
 * useAuth hook
 * @returns {Object} auth state and normalized roles
 */
const useAuth = () => {
  const dispatch = useDispatch();
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const user = useSelector(selectUser);

  const roles = useMemo(() => {
    const userRoles = user?.roles || user?.role || [];
    return normalizeRoles(userRoles);
  }, [user]);

  return {
    isAuthenticated: Boolean(isAuthenticated),
    user: user || null,
    roles,
    role: roles[0] || null,
    login: useCallback((payload) => dispatch(authActions.login(payload)), [dispatch]),
    register: useCallback((payload) => dispatch(authActions.register(payload)), [dispatch]),
    logout: useCallback(() => dispatch(authActions.logout()), [dispatch]),
    refreshSession: useCallback(() => dispatch(authActions.refreshSession()), [dispatch]),
    loadCurrentUser: useCallback(() => dispatch(authActions.loadCurrentUser()), [dispatch]),
  };
};

export default useAuth;
