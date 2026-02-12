import React from 'react';
import Icon from '@platform/components/display/Icon';
import { getMenuIconGlyph } from '@config/sideMenu';
import { useI18n } from '@hooks';
import { Row, RowPressable, IconBox, Label, ExpandTouch, ExpandChevron } from './SidebarItem.ios.styles.jsx';

const normalize = (props) => {
  if (props.item) {
    const { path, href, label, icon } = props.item;
    return {
      path: path || href,
      label,
      icon,
      collapsed: props.collapsed,
      active: props.active,
      onPress: props.onPress,
      level: props.level,
      hasChildren: props.hasChildren,
      expanded: props.expanded,
      onToggleExpand: props.onToggleExpand,
    };
  }
  return {
    path: props.path || props.href,
    label: props.label,
    icon: props.icon,
    collapsed: props.collapsed,
    active: props.active,
    onPress: props.onPress,
    level: props.level,
    hasChildren: props.hasChildren,
    expanded: props.expanded,
    onToggleExpand: props.onToggleExpand,
  };
};

const SidebarItemIOS = (props) => {
  const { t } = useI18n();
  const { path, label, icon, collapsed, active, onPress, level = 0, hasChildren, expanded, onToggleExpand } = normalize(props);

  const handlePress = () => {
    if (onPress) onPress();
  };

  const testID = props.testID ?? (props.item?.id ? `sidebar-item-${props.item.id}` : undefined);
  return (
    <Row $active={active} $level={level}>
      <RowPressable
        testID={testID}
        onPress={handlePress}
        accessibilityLabel={label}
        accessibilityHint={t('navigation.sidebar.itemHint', { label })}
        accessibilityState={{ selected: !!active }}
      >
        <IconBox>
          <Icon glyph={getMenuIconGlyph(icon)} size="sm" decorative />
        </IconBox>
        <Label $active={active}>{label}</Label>
      </RowPressable>
      {hasChildren && (
        <ExpandTouch
          onPress={() => onToggleExpand?.()}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          accessibilityLabel={
            expanded
              ? t('navigation.sidebar.collapseSectionLabel', { label })
              : t('navigation.sidebar.expandSectionLabel', { label })
          }
          accessibilityHint={t('navigation.sidebar.expandToggleHint', { label })}
          accessibilityRole="button"
          $expanded={expanded}
        >
          <ExpandChevron $expanded={expanded}>▾</ExpandChevron>
        </ExpandTouch>
      )}
    </Row>
  );
};

export default SidebarItemIOS;
