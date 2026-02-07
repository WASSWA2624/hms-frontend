/**
 * Sidebar - Web
 * MAIN_NAV_ITEMS; one section expanded at a time; section header sticks at top while nested scrolls.
 * theme-design.mdc, accessibility.mdc (44px targets, focus).
 */
import React, { useMemo, useCallback, useState } from 'react';
import { usePathname, useRouter } from 'expo-router';
import { useI18n } from '@hooks';
import {
  StyledSidebar,
  StyledSidebarContent,
  StyledSidebarSection,
  StyledSidebarSectionHeader,
  StyledNavItemChildren,
} from './Sidebar.web.styles';
import SidebarItem from '@platform/components/navigation/SidebarItem';
import { MAIN_NAV_ITEMS, getNavItemLabel } from '@config/sideMenu';

const isItemActive = (pathname, href) => {
  if (!href) return false;
  if (pathname === href) return true;
  if (href !== '/' && pathname.startsWith(href + '/')) return true;
  return false;
};

const hasActiveChild = (pathname, children) => {
  if (!pathname || !children || children.length === 0) return false;
  return children.some((c) => isItemActive(pathname, c.path));
};

const SidebarWeb = ({
  items = MAIN_NAV_ITEMS,
  itemsI18nPrefix = 'navigation.items.main',
  collapsed = false,
  onItemPress,
  isItemVisible,
  accessibilityLabel,
  testID,
  className,
  style,
  ...rest
}) => {
  const { t } = useI18n();
  const pathname = usePathname();
  const router = useRouter();
  const [expandedId, setExpandedId] = useState(() => null);

  const tree = useMemo(() => {
    const list = Array.isArray(items) ? items : [];
    return list.filter((item) => (isItemVisible ? isItemVisible(item) : true));
  }, [items, isItemVisible]);

  const expandedIdResolved = useMemo(() => {
    if (expandedId !== null && expandedId !== undefined) return expandedId;
    const withActive = tree.find((i) => i.children && hasActiveChild(pathname, i.children));
    return withActive ? withActive.id : null;
  }, [tree, pathname, expandedId]);

  const toggleSection = useCallback((itemId) => {
    setExpandedId((prev) => (prev === itemId ? null : itemId));
  }, []);

  const handleItemClick = useCallback(
    (item, href) => {
      if (onItemPress) onItemPress(item, href);
      else if (href) router.push(href);
    },
    [onItemPress, router]
  );

  const renderChildItem = useCallback(
    (child, itemsI18nPrefixKey) => {
      const href = child.path;
      const label = getNavItemLabel(t, child, itemsI18nPrefixKey);
      const active = isItemActive(pathname, href);
      return (
        <SidebarItem
          key={child.id}
          item={{ ...child, href, label, path: href }}
          collapsed={collapsed}
          active={active}
          level={1}
          testID={testID ? `sidebar-item-${child.id}` : undefined}
          onClick={() => handleItemClick(child, href)}
          onPress={() => handleItemClick(child, href)}
        />
      );
    },
    [pathname, collapsed, testID, handleItemClick, t, itemsI18nPrefix]
  );

  return (
    <StyledSidebar
      collapsed={collapsed}
      role="navigation"
      aria-label={accessibilityLabel || t('navigation.sidebar.title')}
      data-testid={testID}
      className={className}
      style={style}
      {...rest}
    >
      <StyledSidebarContent $collapsed={collapsed}>
        {tree.map((item) => {
          const href = item.href ?? item.path;
          const label = item.label ?? getNavItemLabel(t, item, itemsI18nPrefix);
          const active = isItemActive(pathname, href);
          const hasChildren = item.children != null && item.children.length > 0;
          const expanded = hasChildren && expandedIdResolved === item.id;

          return (
            <StyledSidebarSection key={item.id}>
              <StyledSidebarSectionHeader>
                <SidebarItem
                  item={{ ...item, href, label, path: href }}
                  collapsed={collapsed}
                  active={active}
                  testID={testID ? `sidebar-item-${item.id}` : undefined}
                  onClick={() => handleItemClick(item, href)}
                  onPress={() => handleItemClick(item, href)}
                  level={0}
                  hasChildren={hasChildren}
                  expanded={expanded}
                  onToggleExpand={hasChildren ? () => toggleSection(item.id) : undefined}
                />
              </StyledSidebarSectionHeader>
              {hasChildren && expanded && !collapsed && (
                <StyledNavItemChildren>
                  {item.children.map((child) => renderChildItem(child, itemsI18nPrefix))}
                </StyledNavItemChildren>
              )}
            </StyledSidebarSection>
          );
        })}
      </StyledSidebarContent>
    </StyledSidebar>
  );
};

export default SidebarWeb;
