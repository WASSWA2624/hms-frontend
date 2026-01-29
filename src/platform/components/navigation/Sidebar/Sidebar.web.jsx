import React, { useMemo } from 'react';
import { usePathname } from 'expo-router';
import { useI18n } from '@hooks';
import {
  StyledSidebar,
  StyledSidebarContent,
} from './Sidebar.web.styles';
import SidebarItem from '@platform/components/navigation/SidebarItem';
import { SIDE_MENU_ITEMS } from '@config/sideMenu';

const isItemActive = (pathname, href) => {
  if (!href) return false;
  if (pathname === href) return true;
  if (href !== '/' && pathname.startsWith(href + '/')) return true;
  return false;
};

/**
 * Sidebar component for Web
 * Renders nav items with pathname-based active state and localized labels.
 */
const SidebarWeb = ({
  items = SIDE_MENU_ITEMS,
  collapsed = false,
  accessibilityLabel,
  testID,
  className,
  style,
  ...rest
}) => {
  const { t } = useI18n();
  const pathname = usePathname();
  const topLevel = useMemo(() => (Array.isArray(items) ? items : []), [items]);

  return (
    <StyledSidebar
      collapsed={collapsed}
      accessibilityRole="navigation"
      accessibilityLabel={accessibilityLabel || t('navigation.sidebar.title')}
      testID={testID}
      className={className}
      style={style}
      {...rest}
    >
      <StyledSidebarContent>
        {topLevel.map((item) => {
          const href = item.href ?? item.path;
          const label = item.label ?? (item.id ? t(`navigation.items.main.${item.id}`) : '');
          const active = isItemActive(pathname, href);
          return (
            <SidebarItem
              key={item.id}
              item={{ ...item, href, label, path: href }}
              collapsed={collapsed}
              active={active}
            />
          );
        })}
      </StyledSidebarContent>
    </StyledSidebar>
  );
};

export default SidebarWeb;

