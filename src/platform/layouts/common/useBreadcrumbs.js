/**
 * useBreadcrumbs Hook
 * Extracts breadcrumb items from current route path with navigation item integration
 * File: useBreadcrumbs.js
 */

import { useEffect, useMemo, useState } from 'react';
import { usePathname } from 'expo-router';
import { useI18n } from '@hooks';
import { getMenuIconGlyph, getNavItemLabel } from '@config/sideMenu';
import { getPatient } from '@features/patient';
import { getOpdFlow } from '@features/opd-flow';

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

const resolvePathSegments = (pathname) => String(pathname || '').split('/').filter(Boolean);

const resolvePatientRouteIdFromPath = (pathname) => {
  const segments = resolvePathSegments(pathname);
  const [moduleSegment, resourceSegment, candidateId] = segments;
  if (moduleSegment !== 'patients' || resourceSegment !== 'patients') return null;
  if (!candidateId || candidateId === 'create') return null;
  return candidateId;
};

const resolveOpdFlowRouteIdFromPath = (pathname) => {
  const segments = resolvePathSegments(pathname);
  const [moduleSegment, resourceSegment, candidateId] = segments;
  if (moduleSegment !== 'scheduling' || resourceSegment !== 'opd-flows') return null;
  if (!candidateId) return null;
  return candidateId;
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
  const [patientBreadcrumbLabel, setPatientBreadcrumbLabel] = useState('');
  const [opdFlowBreadcrumbLabel, setOpdFlowBreadcrumbLabel] = useState('');
  const patientRouteId = useMemo(() => resolvePatientRouteIdFromPath(pathname), [pathname]);
  const opdFlowRouteId = useMemo(() => resolveOpdFlowRouteIdFromPath(pathname), [pathname]);

  useEffect(() => {
    let isActive = true;

    if (!patientRouteId) {
      setPatientBreadcrumbLabel('');
      return undefined;
    }

    const loadPatientBreadcrumbLabel = async () => {
      try {
        const patient = await getPatient(patientRouteId);
        const humanFriendlyId = String(patient?.human_friendly_id || '').trim();
        if (!isActive) return;
        setPatientBreadcrumbLabel(humanFriendlyId);
      } catch {
        if (!isActive) return;
        setPatientBreadcrumbLabel('');
      }
    };

    loadPatientBreadcrumbLabel();

    return () => {
      isActive = false;
    };
  }, [patientRouteId]);

  useEffect(() => {
    let isActive = true;

    if (!opdFlowRouteId) {
      setOpdFlowBreadcrumbLabel('');
      return undefined;
    }

    const loadOpdFlowBreadcrumbLabel = async () => {
      try {
        const snapshot = await getOpdFlow(opdFlowRouteId);
        const encounterHumanFriendlyId = String(snapshot?.encounter?.human_friendly_id || '').trim();
        if (!isActive) return;
        setOpdFlowBreadcrumbLabel(encounterHumanFriendlyId);
      } catch {
        if (!isActive) return;
        setOpdFlowBreadcrumbLabel('');
      }
    };

    loadOpdFlowBreadcrumbLabel();

    return () => {
      isActive = false;
    };
  }, [opdFlowRouteId]);

  const breadcrumbItems = useMemo(() => {
    if (!pathname || pathname === '/') {
      return [];
    }

    const segments = resolvePathSegments(pathname);
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
      const isPatientRecordSegment = (
        index === 2
        && segments[0] === 'patients'
        && segments[1] === 'patients'
        && segment === patientRouteId
      );
      const isOpdFlowRecordSegment = (
        index === 2
        && segments[0] === 'scheduling'
        && segments[1] === 'opd-flows'
        && segment === opdFlowRouteId
      );
      const resolvedPatientLabel = isPatientRecordSegment
        ? (patientBreadcrumbLabel || t('common.loading'))
        : '';
      const resolvedOpdFlowLabel = isOpdFlowRecordSegment
        ? (opdFlowBreadcrumbLabel || t('common.loading'))
        : '';
      const label = (navItem ? (navItem.label ?? getNavItemLabel(t, navItem, itemsI18nPrefix)) : '')
        || resolvedPatientLabel
        || resolvedOpdFlowLabel
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
  }, [
    pathname,
    navigationItems,
    itemsI18nPrefix,
    patientBreadcrumbLabel,
    patientRouteId,
    opdFlowBreadcrumbLabel,
    opdFlowRouteId,
    t
  ]);

  return breadcrumbItems;
};

export default useBreadcrumbs;
