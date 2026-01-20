/**
 * useTabBar Hook
 * Shared logic for TabBar component
 * File: useTabBar.js
 */
import React from 'react';
import { useRouter, usePathname } from 'expo-router';
import { useAuth } from '@hooks';

/**
 * TabBar hook
 * @param {Object} options - Hook options
 * @param {Array} options.items - Tab items
 * @returns {Object} TabBar state and handlers
 */
const useTabBar = ({ items = [] } = {}) => {
  const router = useRouter();
  const pathname = usePathname();
  const { user, isAuthenticated } = useAuth();

  const userRole = user?.role || 'buyer';

  const isTabActive = (item) => {
    if (!item.href) return false;
    return pathname === item.href || pathname.startsWith(item.href + '/');
  };

  const isTabVisible = (item) => {
    // Check role-based visibility
    if (item.roles && item.roles.length > 0) {
      if (!isAuthenticated) return false;
      return item.roles.includes(userRole);
    }
    return true;
  };

  const handleTabPress = (item) => {
    if (item.href) {
      router.push(item.href);
    }
    if (item.onPress) {
      item.onPress(item);
    }
  };

  const filteredItems = React.useMemo(() => {
    return items.filter(isTabVisible);
  }, [items, userRole, isAuthenticated]);

  return {
    userRole,
    isAuthenticated,
    pathname,
    filteredItems,
    isTabActive,
    handleTabPress,
  };
};

export default useTabBar;

