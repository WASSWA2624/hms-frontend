import React from 'react';
import { useRouter } from 'expo-router';
import Icon from '@platform/components/display/Icon';
import { getMenuIconGlyph } from '@config/sideMenu';
import { useI18n } from '@hooks';
import { Row, IconWrapper, Label, ExpandButton } from './SidebarItem.web.styles.jsx';

const normalize = (props) => {
  if (props.item) {
    const { path, href, label, icon } = props.item;
    return {
      path: path || href,
      label,
      icon,
      collapsed: props.collapsed,
      active: props.active,
      onClick: props.onClick,
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
    onClick: props.onClick,
    level: props.level,
    hasChildren: props.hasChildren,
    expanded: props.expanded,
    onToggleExpand: props.onToggleExpand,
  };
};

const SidebarItemWeb = (props) => {
  const { t } = useI18n();
  const router = useRouter();
  const { path, label, icon, collapsed, active, onClick, level = 0, hasChildren, expanded, onToggleExpand } = normalize(props);
  const glyph = getMenuIconGlyph(icon);
  const testID = props.testID ?? (props.item?.id ? `sidebar-item-${props.item.id}` : undefined);
  const expandToggleLabel = expanded
    ? t('navigation.sidebar.collapseSectionLabel', { label })
    : t('navigation.sidebar.expandSectionLabel', { label });

  const handleClick = (e) => {
    e?.preventDefault?.();
    if (onClick) onClick();
    else if (path) router.push(path);
  };

  const handleExpandClick = (e) => {
    e?.preventDefault?.();
    e?.stopPropagation?.();
    onToggleExpand?.();
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleClick(e);
    }
  };

  return (
    <Row
      href={path || '#'}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      aria-label={label}
      aria-description={t('navigation.sidebar.itemHint', { label })}
      aria-current={active ? 'page' : undefined}
      aria-expanded={hasChildren ? expanded : undefined}
      title={collapsed ? label : undefined}
      $active={active}
      $collapsed={collapsed}
      $level={level}
      $hasChildren={hasChildren}
      $expanded={expanded}
      data-testid={testID}
    >
      <IconWrapper aria-hidden="true" $active={active} $level={level} $expanded={expanded}>
        <Icon glyph={glyph} size="sm" decorative />
      </IconWrapper>
      <Label $collapsed={collapsed} $active={active} $level={level}>
        {label}
      </Label>
      {hasChildren && !collapsed && (
        <ExpandButton
          type="button"
          aria-label={expandToggleLabel}
          aria-description={t('navigation.sidebar.expandToggleHint', { label })}
          aria-expanded={expanded}
          title={expandToggleLabel}
          onClick={handleExpandClick}
          $expanded={expanded}
        >
          {'\u25BE'}
        </ExpandButton>
      )}
    </Row>
  );
};

export default SidebarItemWeb;
