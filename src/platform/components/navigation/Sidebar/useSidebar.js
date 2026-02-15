/**
 * useSidebar Hook
 * Shared logic for Sidebar component. Sidebar is populated from MAIN_NAV_ITEMS (tree).
 */
import { useState, useMemo } from 'react';
import { usePathname } from 'expo-router';
import { MAIN_NAV_ITEMS, SIDE_MENU_ITEMS } from '@config/sideMenu';

/**
 * Sidebar hook
 * @param {Object} options - Hook options
 * @param {Array} options.items - Navigation items (default: MAIN_NAV_ITEMS)
 * @param {Function} options.isItemVisible - Function to check item visibility (optional)
 * @returns {Object} Sidebar state and handlers
 */
const useSidebar = ({
  items = MAIN_NAV_ITEMS,
  pathname,
  onItemPress,
  isItemVisible,
} = {}) => {
  const [expandedSections, setExpandedSections] = useState({});
  const currentPathname = usePathname();
  const activePathname = pathname || currentPathname;

  const isItemActive = (item) => {
    const href = item.href ?? item.path;
    if (!href) return false;
    return activePathname === href || activePathname.startsWith(href + '/');
  };

  const toggleSection = (sectionId) => {
    setExpandedSections((prev) => ({ ...prev, [sectionId]: !prev[sectionId] }));
  };

  const handleItemPress = (item) => {
    if (onItemPress) onItemPress(item);
    else if (item.onPress) item.onPress(item);
  };

  const filteredItems = useMemo(
    () =>
      Array.isArray(items)
        ? items.filter((item) => (isItemVisible ? isItemVisible(item) : true))
        : [],
    [items, isItemVisible]
  );

  return {
    pathname: activePathname,
    expandedSections,
    filteredItems,
    isItemActive,
    toggleSection,
    handleItemPress,
  };
};

export default useSidebar;

/** Flat list for legacy consumers; labels via t('navigation.items.main.<id>') in component. */
export const sidebarMenu = SIDE_MENU_ITEMS.map((it) => ({
  id: it.id,
  icon: it.icon,
  href: it.path || it.href,
}));

