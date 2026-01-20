/**
 * useSidebar Hook
 * Shared logic for Sidebar component
 * File: useSidebar.js
 */
import React from 'react';
import { useRouter, usePathname } from 'expo-router';
import { useAuth } from '@hooks';

/**
 * Sidebar hook
 * @param {Object} options - Hook options
 * @param {Array} options.items - Navigation items
 * @returns {Object} Sidebar state and handlers
 */
const useSidebar = ({ items = [] } = {}) => {
  const router = useRouter();
  const pathname = usePathname();
  const { user, isAuthenticated } = useAuth();
  const [expandedSections, setExpandedSections] = React.useState({});

  const userRole = user?.role || 'buyer';

  const isItemActive = (item) => {
    if (!item.href) return false;
    return pathname === item.href || pathname.startsWith(item.href + '/');
  };

  const isItemVisible = (item) => {
    // Check role-based visibility
    if (item.roles && item.roles.length > 0) {
      if (!isAuthenticated) return false;
      return item.roles.includes(userRole);
    }
    return true;
  };

  const toggleSection = (sectionId) => {
    setExpandedSections((prev) => ({
      ...prev,
      [sectionId]: !prev[sectionId],
    }));
  };

  const handleItemPress = (item) => {
    if (item.href) {
      router.push(item.href);
    }
    if (item.onPress) {
      item.onPress(item);
    }
  };

  const filteredItems = React.useMemo(() => {
    return items.filter(isItemVisible);
  }, [items, userRole, isAuthenticated]);

  return {
    userRole,
    isAuthenticated,
    pathname,
    expandedSections,
    filteredItems,
    isItemActive,
    toggleSection,
    handleItemPress,
  };
};

export default useSidebar;

