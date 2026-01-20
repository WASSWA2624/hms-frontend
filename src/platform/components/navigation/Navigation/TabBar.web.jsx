/**
 * TabBar Component - Web
 * Bottom navigation bar (typically hidden on web, shown on mobile viewports)
 * File: TabBar.web.jsx
 */
import React from 'react';
import { View, Pressable } from 'react-native';
import Text from '@platform/components/display/Text';
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

/**
 * TabBar component for Web
 * @param {Object} props - TabBar props
 * @param {Array} props.items - Tab items
 * @param {Function} props.onTabPress - Tab press handler
 * @param {string} props.accessibilityLabel - Accessibility label
 * @param {string} props.testID - Test identifier
 * @param {string} props.className - Additional CSS class
 * @param {Object} props.style - Additional styles
 */
const TabBarWeb = ({
  items = [],
  onTabPress,
  accessibilityLabel,
  testID,
  className,
  style,
  ...rest
}) => {
  const { t } = useI18n();
  const { filteredItems, isTabActive, handleTabPress } = useTabBar({ items });

  const handlePress = (item) => {
    if (onTabPress) {
      onTabPress(item);
    } else {
      handleTabPress(item);
    }
  };

  return (
    <StyledTabBar
      accessibilityRole="tablist"
      accessibilityLabel={accessibilityLabel || t('navigation.bottomNavigation')}
      testID={testID}
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
              active={isActive}
              onPress={() => handlePress(item)}
              accessibilityRole="tab"
              accessibilityLabel={item.label}
              accessibilityState={{ selected: isActive }}
              testID={testID ? `${testID}-tab-${item.id}` : undefined}
            >
              <StyledTabItemIcon active={isActive}>{item.icon || '○'}</StyledTabItemIcon>
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

