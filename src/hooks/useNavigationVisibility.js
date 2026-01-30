/**
 * useNavigationVisibility Hook
 * Auth-based visibility for nav items (used with items from config/sideMenu).
 * File: useNavigationVisibility.js
 */
import { useCallback } from 'react';
import useAuth from '@hooks/useAuth';

/**
 * @returns {Object} isItemVisible(item) - true when authenticated and item is truthy
 */
const useNavigationVisibility = () => {
  const { isAuthenticated } = useAuth();
  const isItemVisible = useCallback(
    (item) => Boolean(item && isAuthenticated),
    [isAuthenticated]
  );
  return { isItemVisible };
};

export default useNavigationVisibility;
