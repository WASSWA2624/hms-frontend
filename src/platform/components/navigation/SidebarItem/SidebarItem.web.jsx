import React from 'react';
import { useRouter } from 'expo-router';
import Icon from '@platform/components/display/Icon';
import { Row, IconWrapper, Label } from './SidebarItem.web.styles.jsx';

const ICON_GLYPHS = {
  H: '🏠',
  Home: '🏠',
  Cog: '⚙',
  Building: '🏢',
  Users: '👥',
  MapPin: '📍',
  Layers: '📚',
  Grid: '▦',
  Square: '□',
  Heart: '❤',
  Phone: '📞',
  User: '👤',
  UserCheck: '✓',
  Shield: '🛡',
  Lock: '🔒',
  LockOpen: '🔓',
  UserShield: '👤',
  Clock: '🕐',
  Key: '🔑',
  KeyOff: '🔑',
  Smartphone: '📱',
  LogIn: '🔐',
};

const normalize = (props) => {
  if (props.item) {
    const { path, href, label, icon } = props.item;
    return { path: path || href, label, icon, collapsed: props.collapsed, active: props.active, onClick: props.onClick };
  }
  return {
    path: props.path || props.href,
    label: props.label,
    icon: props.icon,
    collapsed: props.collapsed,
    active: props.active,
    onClick: props.onClick,
  };
};

const SidebarItemWeb = (props) => {
  const router = useRouter();
  const { path, label, icon, collapsed, active, onClick } = normalize(props);
  const glyph = icon ? (ICON_GLYPHS[icon] ?? '•') : '•';
  const handleClick = (e) => {
    e?.preventDefault?.();
    if (onClick) onClick();
    else if (path) router.push(path);
  };
  return (
    <Row
      href={path || '#'}
      onClick={handleClick}
      aria-label={label}
      aria-current={active ? 'page' : undefined}
      $active={active}
    >
      <IconWrapper aria-hidden>
        <Icon glyph={glyph} size="sm" decorative />
      </IconWrapper>
      <Label collapsed={collapsed} $active={active}>
        {label}
      </Label>
    </Row>
  );
};

export default SidebarItemWeb;
