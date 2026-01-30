/**
 * useBreadcrumbs Hook
 * Extracts breadcrumb items from current route path with navigation item integration
 * File: useBreadcrumbs.js
 */

import { useMemo } from 'react';
import { usePathname } from 'expo-router';
import { useI18n } from '@hooks';
import { getMenuIconGlyph } from '@config/sideMenu';

/**
 * Finds a navigation item matching path (items from config/sideMenu: id, path, icon).
 * @param {Array} items - Navigation items (flat list with path or href)
 * @param {string} path - Path to match
 * @returns {Object|null} Matching item or null
 */
const findNavigationItem = (items, path) => {
  if (!items || !Array.isArray(items)) return null;
  const routePath = (item) => item.href ?? item.path;
  for (const item of items) {
    const r = routePath(item);
    if (!r) continue;
    if (r === path) return item;
    if (path.startsWith(r + '/')) return item;
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
  const pathname = usePathname();
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
    items.push({ label: t('app.name'), href: '/', icon: '🏠' });

    let currentPath = '';
    segments.forEach((segment, index) => {
      currentPath += `/${segment}`;
      const isLast = index === segments.length - 1;
      const navItem = findNavigationItem(navigationItems, currentPath);
      const label = (navItem?.label ?? (navItem?.id ? t(`${itemsI18nPrefix}.${navItem.id}`) : '')) || formatSegmentLabel(segment, t);
      const icon = navItem?.icon ? getMenuIconGlyph(navItem.icon) : null;

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
