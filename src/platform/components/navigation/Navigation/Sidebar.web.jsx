/**
 * Sidebar Component - Web
 * Desktop navigation sidebar with collapsible sections
 * File: Sidebar.web.jsx
 */
import React from 'react';
import { View, Pressable } from 'react-native';
import Text from '@platform/components/display/Text';
import Badge from '@platform/components/display/Badge';
import Divider from '@platform/components/layout/Divider';
import { useI18n } from '@hooks';
import useSidebar from './useSidebar';
import {
  StyledSidebar,
  StyledSidebarContent,
  StyledNavSection,
  StyledNavSectionHeader,
  StyledNavSectionTitle,
  StyledNavItem,
  StyledNavItemContent,
  StyledNavItemIcon,
  StyledNavItemLabel,
  StyledNavItemBadge,
  StyledNavItemChildren,
  StyledExpandIcon,
} from './Sidebar.web.styles';

/**
 * Sidebar component for Web
 * @param {Object} props - Sidebar props
 * @param {Array} props.items - Navigation items
 * @param {boolean} props.collapsed - Collapsed state
 * @param {Function} props.onItemPress - Item press handler
 * @param {string} props.accessibilityLabel - Accessibility label
 * @param {string} props.testID - Test identifier
 * @param {string} props.className - Additional CSS class
 * @param {Object} props.style - Additional styles
 */
const SidebarWeb = ({
  items = [],
  collapsed = false,
  onItemPress,
  accessibilityLabel,
  testID,
  className,
  style,
  ...rest
}) => {
  const { t } = useI18n();
  const { filteredItems, expandedSections, isItemActive, toggleSection, handleItemPress } = useSidebar({
    items,
  });

  const handlePress = (item) => {
    if (onItemPress) {
      onItemPress(item);
    } else {
      handleItemPress(item);
    }
  };

  const renderNavItem = (item, level = 0) => {
    const hasChildren = item.children && item.children.length > 0;
    const isActive = isItemActive(item);
    const isExpanded = expandedSections[item.id] || false;

    return (
      <React.Fragment key={item.id}>
        <StyledNavItem
          level={level}
          active={isActive}
          onPress={() => {
            if (hasChildren) {
              toggleSection(item.id);
            } else {
              handlePress(item);
            }
          }}
          accessibilityRole="button"
          accessibilityLabel={item.label}
          accessibilityState={{ selected: isActive }}
          testID={testID ? `${testID}-item-${item.id}` : undefined}
        >
          <StyledNavItemContent>
            {item.icon && <StyledNavItemIcon>{item.icon}</StyledNavItemIcon>}
            {!collapsed && (
              <>
                <StyledNavItemLabel active={isActive}>{item.label}</StyledNavItemLabel>
                {item.badge && (
                  <StyledNavItemBadge>
                    <Badge variant="primary" size="small">
                      {item.badgeCount || ''}
                    </Badge>
                  </StyledNavItemBadge>
                )}
                {hasChildren && (
                  <StyledExpandIcon expanded={isExpanded}>▼</StyledExpandIcon>
                )}
              </>
            )}
          </StyledNavItemContent>
        </StyledNavItem>
        {hasChildren && isExpanded && !collapsed && (
          <StyledNavItemChildren>
            {item.children.map((child) => renderNavItem(child, level + 1))}
          </StyledNavItemChildren>
        )}
      </React.Fragment>
    );
  };

  const groupedItems = React.useMemo(() => {
    const groups = {};
    filteredItems.forEach((item) => {
      const group = item.group || 'main';
      if (!groups[group]) {
        groups[group] = [];
      }
      groups[group].push(item);
    });
    return groups;
  }, [filteredItems]);

  return (
    <StyledSidebar
      collapsed={collapsed}
      accessibilityRole="navigation"
      accessibilityLabel={accessibilityLabel || t('navigation.mainNavigation')}
      testID={testID}
      className={className}
      style={style}
      {...rest}
    >
      <StyledSidebarContent>
        {Object.entries(groupedItems).map(([groupName, groupItems]) => (
          <StyledNavSection key={groupName}>
            {!collapsed && groupName !== 'main' && (
              <StyledNavSectionHeader>
                <StyledNavSectionTitle>{groupName}</StyledNavSectionTitle>
              </StyledNavSectionHeader>
            )}
            {groupItems.map((item) => renderNavItem(item))}
            {groupName !== 'main' && <Divider />}
          </StyledNavSection>
        ))}
      </StyledSidebarContent>
    </StyledSidebar>
  );
};

export default SidebarWeb;

