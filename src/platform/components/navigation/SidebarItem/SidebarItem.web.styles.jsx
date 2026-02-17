import styled from 'styled-components';

export const Row = styled.a.withConfig({
  displayName: 'Row',
  componentId: 'Row',
  shouldForwardProp: (prop) =>
    !['$collapsed', '$active', '$level', '$hasChildren', '$expanded'].includes(prop),
})`
  position: relative;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: ${({ $collapsed }) => ($collapsed ? 'center' : 'flex-start')};
  gap: ${({ theme, $collapsed, $level = 0 }) => ($collapsed ? 0 : $level > 0 ? theme.spacing.xs - 1 : theme.spacing.xs)}px;
  min-height: ${({ theme }) => theme.spacing.xxl - theme.spacing.xs}px;
  height: auto;
  min-width: ${({ theme, $collapsed }) => ($collapsed ? `${theme.spacing.xxl - theme.spacing.xs}px` : '0')};
  width: ${({ theme, $collapsed }) => ($collapsed ? `${theme.spacing.xxl - theme.spacing.xs}px` : '100%')};
  max-width: 100%;
  padding: ${({ theme, $collapsed, $level = 0 }) =>
    $collapsed
      ? `0 ${theme.spacing.xs / 2}px`
      : `${$level > 0 ? 1 : 2}px ${$level > 0 ? theme.spacing.xs + 2 : theme.spacing.sm}px ${$level > 0 ? 1 : 2}px ${$level > 0 ? theme.spacing.md + $level * theme.spacing.sm : theme.spacing.sm}px`};
  margin: ${({ theme, $collapsed, $level = 0 }) =>
    $collapsed ? `${theme.spacing.xs / 4}px auto` : $level > 0 ? '0' : `${theme.spacing.xs / 4}px 0`};
  border: 1px solid ${({ theme, $active, $hasChildren, $expanded, $level = 0 }) => {
    if ($level > 0) return 'transparent';
    if ($active || ($hasChildren && $expanded)) return theme.colors.primary;
    return theme.colors.background.tertiary;
  }};
  border-radius: ${({ theme }) => theme.radius.sm}px;
  cursor: pointer;
  text-decoration: none;
  color: ${({ theme, $active }) => ($active ? theme.colors.primary : theme.colors.text.primary)};
  background-color: ${({ theme, $active, $hasChildren, $expanded, $level = 0 }) => {
    if ($level > 0) return $active ? theme.colors.background.secondary : 'transparent';
    if ($active || ($hasChildren && $expanded)) return theme.colors.background.secondary;
    return theme.colors.background.primary;
  }};
  font-size: ${({ theme, $level = 0 }) => ($level > 0 ? (theme.typography?.fontSize?.xs ?? 12) - 1 : (theme.typography?.fontSize?.sm ?? 14) - 1)}px;
  font-weight: ${({ theme, $active, $level = 0 }) =>
    $level > 0
      ? ($active ? theme.typography.fontWeight.medium : theme.typography.fontWeight.normal)
      : ($active ? theme.typography.fontWeight.semibold : theme.typography.fontWeight.medium)};
  box-shadow: none;
  transition: background-color 0.12s ease, color 0.12s ease, border-color 0.12s ease;

  @media (prefers-reduced-motion: reduce) {
    transition: none;
  }

  &:hover {
    background-color: ${({ theme, $active, $level = 0 }) => {
      if ($level > 0) return $active ? theme.colors.background.secondary : theme.colors.background.tertiary;
      return $active ? theme.colors.background.secondary : theme.colors.background.secondary;
    }};
    border-color: ${({ theme, $active, $hasChildren, $expanded, $level = 0 }) => {
      if ($level > 0) return 'transparent';
      if ($active || ($hasChildren && $expanded)) return theme.colors.primary;
      return theme.colors.text.tertiary;
    }};
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.primary};
    outline-offset: 2px;
  }

  &::before {
    content: '';
    position: absolute;
    left: ${({ theme }) => theme.spacing.xs / 2}px;
    top: 50%;
    width: 1px;
    height: 10px;
    transform: translateY(-50%);
    border-radius: ${({ theme }) => theme.radius?.sm ?? 4}px;
    background-color: ${({ theme, $active, $level = 0 }) =>
      $level > 0 ? ($active ? theme.colors.primary : theme.colors.background.tertiary) : 'transparent'};
  }
`;

export const IconWrapper = styled.span.withConfig({
  displayName: 'IconWrapper',
  componentId: 'IconWrapper',
  shouldForwardProp: (prop) => !['$active', '$level', '$expanded'].includes(prop),
})`
  box-sizing: border-box;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: ${({ $level = 0 }) => ($level > 0 ? '12px' : '18px')};
  height: ${({ $level = 0 }) => ($level > 0 ? '12px' : '18px')};
  border-radius: ${({ theme, $level = 0 }) => ($level > 0 ? `${theme.radius?.xs ?? 2}px` : `${theme.radius?.sm ?? 4}px`)};
  border: 1px solid ${({ theme, $active, $expanded, $level = 0 }) => {
    if ($level > 0) return 'transparent';
    if ($active || $expanded) return theme.colors.primary;
    return theme.colors.background.tertiary;
  }};
  background-color: ${({ theme, $active, $level = 0 }) => {
    if ($level > 0) return 'transparent';
    return $active ? theme.colors.background.primary : theme.colors.background.secondary;
  }};
  flex-shrink: 0;
  color: ${({ theme, $active, $expanded, $level = 0 }) => {
    if ($level > 0) return $active ? theme.colors.primary : theme.colors.text.tertiary;
    return $active || $expanded ? theme.colors.primary : theme.colors.text.secondary;
  }};
  transition: border-color 0.15s ease, color 0.15s ease, background-color 0.15s ease;
  @media (prefers-reduced-motion: reduce) {
    transition: none;
  }
`;

export const Label = styled.span.withConfig({
  displayName: 'Label',
  componentId: 'Label',
  shouldForwardProp: (prop) => !['$collapsed', '$active', '$level'].includes(prop),
})`
  margin-left: 0;
  flex: 1;
  min-width: 0;
  font-size: ${({ theme, $level = 0 }) =>
    $level > 0 ? (theme.typography.fontSize.xs - 1) : (theme.typography.fontSize.sm - 1)}px;
  line-height: 1.15;
  letter-spacing: ${({ $level = 0 }) => ($level > 0 ? '0' : '0.1px')};
  font-weight: ${({ theme, $active, $level = 0 }) =>
    $level > 0
      ? ($active ? theme.typography.fontWeight.medium : theme.typography.fontWeight.normal)
      : ($active ? theme.typography.fontWeight.semibold : theme.typography.fontWeight.medium)};
  color: inherit;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  display: ${({ $collapsed }) => ($collapsed ? 'none' : 'inline')};
  @media (max-width: ${({ theme }) => theme.breakpoints?.tablet ?? 768}px) {
    display: inline;
  }
`;

export const ExpandButton = styled.button.withConfig({
  displayName: 'ExpandButton',
  componentId: 'ExpandButton',
  shouldForwardProp: (prop) => prop !== '$expanded',
})`
  box-sizing: border-box;
  margin-left: ${({ theme }) => theme.spacing.xs / 2}px;
  flex-shrink: 0;
  width: ${({ theme }) => theme.spacing.xxl - theme.spacing.xs}px;
  height: ${({ theme }) => theme.spacing.xxl - theme.spacing.xs}px;
  padding: 0;
  border: 1px solid ${({ theme }) => theme.colors.background.tertiary};
  border-radius: ${({ theme }) => theme.radius.sm}px;
  background-color: ${({ theme }) => theme.colors.background.primary};
  color: ${({ theme }) => theme.colors.text.secondary};
  cursor: pointer;
  font-size: ${({ theme }) => theme.typography.fontSize.xs}px;
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  line-height: 1;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  transform: ${({ $expanded }) => ($expanded ? 'rotate(0deg)' : 'rotate(-90deg)')};
  transition: transform 0.2s ease, background-color 0.15s ease, color 0.15s ease, border-color 0.15s ease;
  @media (prefers-reduced-motion: reduce) {
    transition: none;
  }
  &:hover {
    background-color: ${({ theme }) => theme.colors.background.secondary};
    border-color: ${({ theme }) => theme.colors.text.tertiary};
    color: ${({ theme }) => theme.colors.text.primary};
  }
  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.primary};
    outline-offset: 2px;
  }
`;
