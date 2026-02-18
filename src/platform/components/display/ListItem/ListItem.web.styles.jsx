/**
 * ListItem Web Styles
 * Styled-components for Web platform
 * File: ListItem.web.styles.jsx
 */
import styled from 'styled-components';
import { View, Pressable } from 'react-native';
import Text from '@platform/components/display/Text';

const hexToRgba = (hexColor, alpha) => {
  if (typeof hexColor !== 'string' || !hexColor.startsWith('#')) return hexColor;

  const normalized = hexColor.slice(1);
  const safeHex = normalized.length === 3
    ? normalized.split('').map((char) => `${char}${char}`).join('')
    : normalized;

  if (safeHex.length !== 6) return hexColor;

  const red = Number.parseInt(safeHex.slice(0, 2), 16);
  const green = Number.parseInt(safeHex.slice(2, 4), 16);
  const blue = Number.parseInt(safeHex.slice(4, 6), 16);
  return `rgba(${red}, ${green}, ${blue}, ${alpha})`;
};

const resolveActionColor = (theme, actionType) => {
  if (actionType === 'delete') return theme.colors.error;
  if (actionType === 'edit') return theme.colors.warning;
  return theme.colors.primary;
};

const StyledListItem = styled(Pressable).withConfig({
  displayName: 'StyledListItem',
  shouldForwardProp: (prop) => !['$density'].includes(prop),
})`
  display: flex;
  flex-direction: row;
  align-items: center;
  padding-horizontal: ${({ theme, $density }) => ($density === 'compact' ? theme.spacing.sm : theme.spacing.lg)}px;
  padding-vertical: ${({ theme, $density }) => ($density === 'compact' ? theme.spacing.xs : theme.spacing.md)}px;
  border-bottom-width: 1px;
  border-bottom-color: ${({ theme }) => theme.colors.background.tertiary};
  cursor: ${({ disabled }) => (disabled ? 'default' : 'pointer')};

  &:hover {
    ${({ disabled, theme }) => {
      if (disabled) return '';
      return `background-color: ${theme.colors.background.secondary};`;
    }}
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.primary};
    outline-offset: -2px;
  }

  &:last-child {
    border-bottom-width: 0;
  }
`;

const StyledListItemContent = styled(View).withConfig({
  displayName: 'StyledListItemContent',
  shouldForwardProp: (prop) => !['$hasAvatar', '$density'].includes(prop),
})`
  flex: 1;
  flex-direction: column;
  margin-left: ${({ theme, $hasAvatar }) => ($hasAvatar ? theme.spacing.md : 0)}px;
  gap: ${({ theme, $density }) => ($density === 'compact' ? theme.spacing.xs : theme.spacing.sm)}px;
`;

const StyledTitleRow = styled(View).withConfig({
  displayName: 'StyledTitleRow',
})`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing.sm}px;
`;

const StyledBadgeSlot = styled(View).withConfig({
  displayName: 'StyledBadgeSlot',
})`
  display: flex;
  flex-shrink: 0;
`;

const StyledTitle = styled(Text).withConfig({
  displayName: 'StyledTitle',
})`
  font-weight: 600;
`;

const StyledSubtitle = styled(Text).withConfig({
  displayName: 'StyledSubtitle',
})`
  color: ${({ theme }) => theme.colors.text.tertiary};
`;

const StyledListItemActions = styled(View).withConfig({
  displayName: 'StyledListItemActions',
})`
  display: flex;
  flex-direction: row;
  align-items: center;
  flex-wrap: nowrap;
  justify-content: flex-end;
  margin-left: ${({ theme }) => theme.spacing.md}px;
`;

const StyledActionSlot = styled(View).withConfig({
  displayName: 'StyledActionSlot',
})`
  margin-left: ${({ theme }) => theme.spacing.xs}px;
`;

const StyledActionButton = styled(Pressable).withConfig({
  displayName: 'StyledActionButton',
  shouldForwardProp: (prop) => !['$actionType', '$showLabel'].includes(prop),
})`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  min-height: 30px;
  min-width: ${({ $showLabel }) => ($showLabel ? 'auto' : '30px')};
  padding-left: ${({ theme, $showLabel }) => ($showLabel ? theme.spacing.sm : theme.spacing.xs)}px;
  padding-right: ${({ theme, $showLabel }) => ($showLabel ? theme.spacing.sm : theme.spacing.xs)}px;
  padding-top: ${({ theme }) => theme.spacing.xs}px;
  padding-bottom: ${({ theme }) => theme.spacing.xs}px;
  border-width: 1px;
  border-style: solid;
  border-color: ${({ theme, $actionType }) => resolveActionColor(theme, $actionType)};
  border-radius: ${({ theme }) => theme.radius.sm}px;
  background-color: ${({ theme, $actionType }) => hexToRgba(resolveActionColor(theme, $actionType), 0.12)};
  cursor: ${({ disabled }) => (disabled ? 'default' : 'pointer')};

  &:hover {
    ${({ disabled, theme, $actionType }) => {
      if (disabled) return '';
      const color = resolveActionColor(theme, $actionType);
      return `background-color: ${hexToRgba(color, 0.18)};`;
    }}
  }

  &:focus-visible {
    outline: 2px solid ${({ theme, $actionType }) => resolveActionColor(theme, $actionType)};
    outline-offset: 1px;
  }
`;

const StyledActionButtonLabel = styled(Text).withConfig({
  displayName: 'StyledActionButtonLabel',
  shouldForwardProp: (prop) => !['$actionType'].includes(prop),
})`
  margin-left: ${({ theme }) => theme.spacing.xs}px;
  font-weight: 600;
  color: ${({ theme, $actionType }) => resolveActionColor(theme, $actionType)};
`;

export {
  StyledListItem,
  StyledListItemContent,
  StyledTitleRow,
  StyledBadgeSlot,
  StyledListItemActions,
  StyledActionSlot,
  StyledActionButton,
  StyledActionButtonLabel,
  StyledTitle,
  StyledSubtitle,
};


