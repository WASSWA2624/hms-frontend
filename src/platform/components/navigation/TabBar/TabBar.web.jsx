/**
 * TabBar Component - Web
 * Bottom navigation bar (typically hidden on web, shown on mobile viewports)
 * File: TabBar.web.jsx
 */
import React from 'react';
import { useRouter } from 'expo-router';
import Badge from '@platform/components/display/Badge';
import { useI18n } from '@hooks';
import useTabBar from './useTabBar';
import {
  StyledTabBar,
  StyledTabBarContent,
  StyledTabItem,
  StyledTabItemIcon,
  StyledTabItemLabel,
  StyledTabItemBadge,
} from './TabBar.web.styles';

const DEFAULT_TAB_ICON = 'o';

/**
 * TabBar component for Web
 * @param {Object} props - TabBar props
 * @param {Array} props.items - Tab items
 * @param {Function} props.onTabPress - Tab press handler
 * @param {Function} props.isTabVisible - Function to check tab visibility
 * @param {string} props.accessibilityLabel - Accessibility label
 * @param {string} props.testID - Test identifier
 * @param {string} props.className - Additional CSS class
 * @param {Object} props.style - Additional styles
 */
const TabBarWeb = ({
  items = [],
  onTabPress,
  isTabVisible,
  accessibilityLabel,
  testID,
  className,
  style,
  ...rest
}) => {
  const { t } = useI18n();
  const router = useRouter();
  const {
    filteredItems,
    isTabActive,
    handleTabPress: hookHandleTabPress,
  } = useTabBar({
    items,
    onTabPress: onTabPress || ((item) => {
      if (item.href) {
        router.push(item.href);
      } else if (item.onPress) {
        // istanbul ignore next - Unreachable through normal usage (handlePress checks item.onPress first)
        // This branch exists for completeness but is intentionally optimized away in handlePress
        item.onPress(item);
      }
    }),
    isTabVisible,
  });

  const handlePress = (item) => {
    if (onTabPress) {
      onTabPress(item);
    } else if (item.onPress) {
      item.onPress(item);
    } else {
      hookHandleTabPress(item);
    }
  };

  return (
    <StyledTabBar
      role="tablist"
      aria-label={accessibilityLabel || t('navigation.tabBar.title')}
      data-testid={testID}
      className={className}
      style={style}
      {...rest}
    >
      <StyledTabBarContent>
        {filteredItems.map((item) => {
          const isActive = isTabActive(item);
          return (
            <StyledTabItem
              key={item.id}
              type="button"
              active={isActive}
              onClick={() => handlePress(item)}
              role="tab"
              aria-label={item.label}
              aria-selected={isActive}
              data-testid={testID ? `${testID}-tab-${item.id}` : undefined}
            >
              <StyledTabItemIcon active={isActive}>{item.icon || DEFAULT_TAB_ICON}</StyledTabItemIcon>
              <StyledTabItemLabel active={isActive}>{item.label}</StyledTabItemLabel>
              {item.badge && item.badgeCount > 0 && (
                <StyledTabItemBadge>
                  <Badge variant="error" size="small">
                    {item.badgeCount > 99 ? '99+' : item.badgeCount}
                  </Badge>
                </StyledTabItemBadge>
              )}
            </StyledTabItem>
          );
        })}
      </StyledTabBarContent>
    </StyledTabBar>
  );
};

export default TabBarWeb;

