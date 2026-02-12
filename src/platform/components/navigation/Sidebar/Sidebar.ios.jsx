/**
 * Sidebar - iOS
 * MAIN_NAV_ITEMS; one section expanded; sticky section headers (SectionList).
 * Theme tokens; 44px targets (accessibility.mdc).
 */
import React, { useMemo, useCallback, useState } from 'react';
import { usePathname, useRouter } from 'expo-router';
import { useI18n } from '@hooks';
import { MAIN_NAV_ITEMS, getNavItemLabel } from '@config/sideMenu';
import SidebarItem from '@platform/components/navigation/SidebarItem';
import { StyledSectionList, StyledSidebar, StyledSectionHeaderWrap } from './Sidebar.ios.styles';

const isItemActive = (pathname, href) =>
  href && (pathname === href || (href !== '/' && pathname.startsWith(href + '/')));
const hasActiveChild = (pathname, children) =>
  pathname && children && children.length > 0 && children.some((c) => isItemActive(pathname, c.path));

const SidebarIOS = ({
  items: itemsProp,
  isItemVisible,
  onItemPress,
  accessibilityLabel,
  testID,
  style,
  ...rest
}) => {
  const { t } = useI18n();
  const router = useRouter();
  const pathname = usePathname();
  const [expandedId, setExpandedId] = useState(null);

  const handleItemPress = useCallback(
    (item, href) => {
      if (onItemPress) onItemPress(item, href);
      else if (href) router.push(href);
    },
    [onItemPress, router]
  );

  const tree = useMemo(() => {
    const list =
      Array.isArray(itemsProp) && itemsProp.length > 0
        ? itemsProp
        : MAIN_NAV_ITEMS.map((it) => ({
            ...it,
            href: it.path,
            label: getNavItemLabel(t, it),
            icon: it.icon,
          }));
    return list
      .map((item) => ({
        ...item,
        children: Array.isArray(item.children)
          ? (isItemVisible ? item.children.filter((child) => isItemVisible(child)) : item.children)
          : item.children,
      }))
      .filter((item) => (isItemVisible ? isItemVisible(item) : true));
  }, [itemsProp, isItemVisible, t]);

  const expandedIdResolved = useMemo(() => {
    if (expandedId !== null && expandedId !== undefined) return expandedId;
    const withActive = tree.find((i) => i.children && hasActiveChild(pathname, i.children));
    return withActive ? withActive.id : null;
  }, [tree, pathname, expandedId]);

  const sections = useMemo(
    () =>
      tree.map((item) => ({
        key: item.id,
        id: item.id,
        item,
        data:
          expandedIdResolved === item.id && item.children && item.children.length > 0
            ? item.children
            : [],
      })),
    [tree, expandedIdResolved]
  );

  const toggleSection = useCallback((id) => {
    setExpandedId((prev) => (prev === id ? null : id));
  }, []);

  const renderSectionHeader = useCallback(
    ({ section }) => {
      const { item } = section;
      const href = item.href ?? item.path;
      const label = item.label ?? getNavItemLabel(t, item);
      const active = isItemActive(pathname, href);
      const hasChildren = item.children != null && item.children.length > 0;
      const expanded = expandedIdResolved === item.id;

      return (
        <StyledSectionHeaderWrap pointerEvents="box-none">
          <SidebarItem
            item={{ ...item, href, label, path: href }}
            icon={item.icon}
            label={label}
            path={href}
            collapsed={false}
            active={active}
            level={0}
            hasChildren={hasChildren}
            expanded={expanded}
            onToggleExpand={hasChildren ? () => toggleSection(item.id) : undefined}
            onPress={() => handleItemPress(item, href)}
            testID={testID ? `sidebar-item-${item.id}` : undefined}
          />
        </StyledSectionHeaderWrap>
      );
    },
    [pathname, expandedIdResolved, toggleSection, handleItemPress, t, testID]
  );

  const renderItem = useCallback(
    ({ item: child }) => {
      const href = child.path;
      const label = getNavItemLabel(t, child);
      const active = isItemActive(pathname, href);
      return (
        <SidebarItem
          item={{ ...child, href, label, path: href }}
          icon={child.icon}
          label={label}
          path={href}
          collapsed={false}
          active={active}
          level={1}
          onPress={() => handleItemPress(child, href)}
          testID={testID ? `sidebar-item-${child.id}` : undefined}
        />
      );
    },
    [pathname, t, handleItemPress, testID]
  );

  const keyExtractor = useCallback((child) => child.id, []);

  return (
    <StyledSidebar
      accessibilityRole="menu"
      accessibilityLabel={accessibilityLabel || t('navigation.sidebar.title')}
      testID={testID}
      style={style}
      {...rest}
    >
      <StyledSectionList
        sections={sections}
        keyExtractor={keyExtractor}
        renderSectionHeader={renderSectionHeader}
        renderItem={renderItem}
        stickySectionHeadersEnabled
        scrollEnabled
        showsVerticalScrollIndicator
        keyboardShouldPersistTaps="handled"
      />
    </StyledSidebar>
  );
};

export default SidebarIOS;
