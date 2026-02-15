/**
 * useBreadcrumbs Hook
 * Extracts breadcrumb items from current route path with navigation item integration
 * File: useBreadcrumbs.js
 */

import { useMemo } from 'react';
import { usePathname } from 'expo-router';
import { useI18n } from '@hooks';
import { getMenuIconGlyph, getNavItemLabel } from '@config/sideMenu';

/**
 * Find main nav item by exact path.
 * @param {Array} items - Main navigation items (may include children)
 * @param {string} path - Path to match
 * @returns {Object|null} Matching main item or null
 */
const findMainItemByPath = (items, path) => {
  if (!items || !Array.isArray(items)) return null;
  return items.find((item) => (item?.path ?? item?.href) === path) ?? null;
};

/**
 * Find child nav item by exact path.
 * @param {Array} items - Main navigation items with children
 * @param {string} path - Path to match
 * @returns {Object|null} Matching child item or null
 */
const findChildItemByPath = (items, path) => {
  if (!items || !Array.isArray(items)) return null;
  for (const item of items) {
    if (!item?.children?.length) continue;
    const child = item.children.find((childItem) => (childItem?.path ?? childItem?.href) === path);
    if (child) return child;
  }
  return null;
};

/**
 * Formats a segment name into a readable label
 * @param {string} segment - Route segment
 * @param {Function} t - Translation function
 * @returns {string} Formatted label
 */
const formatSegmentLabel = (segment, t) => {
  // Try translation first
  const labelKey = `navigation.breadcrumbs.${segment}`;
  const translatedLabel = t(labelKey);
  if (translatedLabel !== labelKey) {
    return translatedLabel;
  }

  // Try common route name translations
  const commonKey = `navigation.routes.${segment}`;
  const commonTranslated = t(commonKey);
  if (commonTranslated !== commonKey) {
    return commonTranslated;
  }

  // Fallback: format segment (kebab-case to Title Case)
  return segment
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

/**
 * Generates breadcrumb items from pathname with navigation item integration
 * @param {Array} navigationItems - Navigation items from config/sideMenu (e.g. SIDE_MENU_ITEMS)
 * @param {string} itemsI18nPrefix - i18n key prefix for item labels (default navigation.items.main)
 * @returns {Array} Breadcrumb items
 */
const useBreadcrumbs = (navigationItems = [], itemsI18nPrefix = 'navigation.items.main') => {
  // Some tests mock expo-router without usePathname; keep breadcrumb generation resilient.
  const pathname = typeof usePathname === 'function' ? usePathname() : '';
  const { t } = useI18n();

  const breadcrumbItems = useMemo(() => {
    if (!pathname || pathname === '/') {
      return [];
    }

    const segments = pathname.split('/').filter(Boolean);
    if (segments.length === 0) {
      return [];
    }

    const items = [];
    const deepestChild = findChildItemByPath(navigationItems, pathname);

    let currentPath = '';
    segments.forEach((segment, index) => {
      currentPath += `/${segment}`;
      const isLast = index === segments.length - 1;
      const mainItem = index === 0 ? findMainItemByPath(navigationItems, currentPath) : null;
      const childItem = index > 0 ? findChildItemByPath(navigationItems, currentPath) : null;
      const navItem = mainItem ?? childItem;
      const label = (navItem ? (navItem.label ?? getNavItemLabel(t, navItem, itemsI18nPrefix)) : '')
        || formatSegmentLabel(segment, t);
      const iconSource = (index === 0 ? (deepestChild?.icon ?? mainItem?.icon) : childItem?.icon) ?? null;
      const icon = index === 0 && iconSource ? getMenuIconGlyph(iconSource) : null;

      items.push({
        label,
        href: isLast ? null : currentPath,
        icon,
      });
    });

    return items;
  }, [pathname, navigationItems, itemsI18nPrefix, t]);

  return breadcrumbItems;
};

export default useBreadcrumbs;
