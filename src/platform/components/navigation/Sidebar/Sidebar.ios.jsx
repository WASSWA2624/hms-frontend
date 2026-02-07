/**
 * Sidebar Component - iOS
 * Mobile navigation drawer (typically used in drawer navigation)
 * File: Sidebar.ios.jsx
 */
import React, { useMemo } from 'react';
import { ScrollView } from 'react-native';
import { usePathname, useRouter } from 'expo-router';
import { useI18n } from '@hooks';
import { sidebarMenu } from '@platform/components/navigation/Sidebar/useSidebar';
import SidebarItem from '@platform/components/navigation/SidebarItem';
import { StyledSidebar, StyledSidebarContent } from './Sidebar.ios.styles';

const isItemActive = (pathname, href) =>
  href && (pathname === href || (href !== '/' && pathname.startsWith(href + '/')));

/**
 * Sidebar component for iOS
 * @param {Array} [props.items] - Navigation items ({ id, href, label, icon }); when omitted uses sidebarMenu
 * @param {Function} [props.isItemVisible] - Filter items
 * @param {string} props.accessibilityLabel
 * @param {string} props.testID
 */
const SidebarIOS = ({ items: itemsProp, isItemVisible, accessibilityLabel, testID, style, ...rest }) => {
  const { t } = useI18n();
  const router = useRouter();
  const pathname = usePathname();
  const items = useMemo(() => {
    const list = Array.isArray(itemsProp) && itemsProp.length > 0
      ? itemsProp
      : sidebarMenu.map((it) => ({ id: it.id, href: it.href, label: t(`navigation.items.main.${it.id}`), icon: it.icon }));
    return isItemVisible ? list.filter(isItemVisible) : list;
  }, [itemsProp, isItemVisible, t]);
  return (
    <StyledSidebar
      accessibilityRole="menu"
      accessibilityLabel={accessibilityLabel || t('navigation.sidebar.title')}
      testID={testID}
      style={style}
      {...rest}
    >
      <ScrollView scrollEnabled showsVerticalScrollIndicator contentContainerStyle={{ paddingBottom: 16 }}>
        <StyledSidebarContent>
          {items.map((item) => {
            const href = item.href ?? item.path;
            const label = item.label ?? t(`navigation.items.main.${item.id}`);
            const icon = item.icon ?? item.id;
            return (
              <SidebarItem
                key={item.id}
                icon={icon}
                label={label}
                path={href}
                collapsed={false}
                active={isItemActive(pathname, href)}
                onPress={() => href && router.push(href)}
              />
            );
          })}
        </StyledSidebarContent>
      </ScrollView>
    </StyledSidebar>
  );
};

export default SidebarIOS;

