/**
 * ListItem iOS Styles
 * Styled-components for iOS platform
 * File: ListItem.ios.styles.jsx
 */
import styled from 'styled-components/native';
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

const resolveThemeColor = (theme, token, fallback) => {
  if (typeof token !== 'string') return fallback;
  const value = token.trim();
  if (!value) return fallback;

  const fromPath = value
    .split('.')
    .reduce((accumulator, key) => (accumulator ? accumulator[key] : undefined), theme.colors);
  if (typeof fromPath === 'string') return fromPath;

  const fromTopLevel = theme.colors[value];
  if (typeof fromTopLevel === 'string') return fromTopLevel;

  return value;
};

const resolveActionColor = (theme, actionType, tone) => {
  if (tone) return resolveThemeColor(theme, tone, theme.colors.primary);
  if (actionType === 'delete') return theme.colors.error;
  if (actionType === 'edit') return theme.colors.warning;
  if (actionType === 'more') return theme.colors.text.tertiary;
  return theme.colors.primary;
};

const resolveStatusColor = (theme, tone) => {
  if (tone) return resolveThemeColor(theme, tone, theme.colors.success);
  return theme.colors.success;
};

const resolveLeadingColor = (theme, tone) => resolveThemeColor(theme, tone, theme.colors.primary);

const StyledListItem = styled.Pressable.withConfig({
  displayName: 'StyledListItem',
  shouldForwardProp: (prop) => !['$density', '$isWide'].includes(prop),
})`
  flex-direction: row;
  align-items: flex-start;
  padding-horizontal: ${({ theme, $density, $isWide }) => {
    if ($isWide) return theme.spacing.lg;
    return $density === 'compact' ? theme.spacing.sm : theme.spacing.md;
  }}px;
  padding-vertical: ${({ theme, $density, $isWide }) => {
    if ($isWide) return theme.spacing.md;
    return $density === 'compact' ? theme.spacing.sm : theme.spacing.md;
  }}px;
  border-width: 1px;
  border-color: ${({ theme }) => theme.colors.border.light};
  border-radius: ${({ theme, $isWide }) => ($isWide ? theme.radius.xl : theme.radius.lg)}px;
  background-color: ${({ theme }) => theme.colors.background.primary};
  shadow-color: ${({ theme }) => theme.shadows.sm.shadowColor};
  shadow-offset: ${({ theme }) => theme.shadows.sm.shadowOffset.width}px ${({ theme }) => theme.shadows.sm.shadowOffset.height}px;
  shadow-opacity: ${({ theme }) => theme.shadows.sm.shadowOpacity};
  shadow-radius: ${({ theme }) => theme.shadows.sm.shadowRadius}px;
  elevation: ${({ theme }) => theme.shadows.sm.elevation};
`;

const StyledLeadingSlot = styled.View.withConfig({
  displayName: 'StyledLeadingSlot',
  shouldForwardProp: (prop) => !['$isWide'].includes(prop),
})`
  margin-right: ${({ theme, $isWide }) => ($isWide ? theme.spacing.lg : theme.spacing.md)}px;
  padding-top: ${({ theme, $isWide }) => ($isWide ? 0 : theme.spacing.xs)}px;
`;

const StyledLeadingSurface = styled.View.withConfig({
  displayName: 'StyledLeadingSurface',
  shouldForwardProp: (prop) => !['$tone', '$backgroundTone', '$backgroundColor', '$density', '$isWide'].includes(prop),
})`
  width: ${({ $density, $isWide }) => ($isWide ? 56 : ($density === 'compact' ? 40 : 48))}px;
  height: ${({ $density, $isWide }) => ($isWide ? 56 : ($density === 'compact' ? 40 : 48))}px;
  border-radius: ${({ theme, $isWide }) => ($isWide ? theme.radius.xl : theme.radius.lg)}px;
  border-width: 1px;
  border-color: ${({ theme, $tone }) => hexToRgba(resolveLeadingColor(theme, $tone), 0.25)};
  background-color: ${({ theme, $tone, $backgroundTone, $backgroundColor }) => {
    const color = resolveThemeColor(
      theme,
      $backgroundColor || $backgroundTone || $tone,
      theme.colors.primary
    );
    return $backgroundColor ? color : hexToRgba(color, 0.14);
  }};
  align-items: center;
  justify-content: center;
`;

const StyledListItemContent = styled.View.withConfig({
  displayName: 'StyledListItemContent',
  shouldForwardProp: (prop) => !['$hasAvatar', '$density', '$isWide'].includes(prop),
})`
  flex: 1;
  flex-direction: column;
  min-width: 0px;
  margin-left: ${({ theme, $hasAvatar }) => ($hasAvatar ? theme.spacing.md : 0)}px;
`;

const StyledTopRow = styled.View.withConfig({
  displayName: 'StyledTopRow',
  shouldForwardProp: (prop) => !['$isWide'].includes(prop),
})`
  flex-direction: row;
  align-items: flex-start;
`;

const StyledHeaderContent = styled.View.withConfig({
  displayName: 'StyledHeaderContent',
  shouldForwardProp: (prop) => !['$isWide'].includes(prop),
})`
  flex: 1;
  min-width: 0px;
`;

const StyledTitleRow = styled.View.withConfig({
  displayName: 'StyledTitleRow',
})`
  width: 100%;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
`;

const StyledBadgeSlot = styled.View.withConfig({
  displayName: 'StyledBadgeSlot',
})`
  margin-left: ${({ theme }) => theme.spacing.sm}px;
  flex-shrink: 0;
`;

const StyledListItemActions = styled.View.withConfig({
  displayName: 'StyledListItemActions',
  shouldForwardProp: (prop) => !['$isWide', '$placement'].includes(prop),
})`
  flex-direction: row;
  align-items: center;
  flex-wrap: nowrap;
  justify-content: ${({ $isWide, $placement }) => (($isWide || $placement === 'top') ? 'flex-end' : 'flex-start')};
  margin-left: ${({ theme, $isWide, $placement }) => {
    if ($isWide) return theme.spacing.md;
    if ($placement === 'mobile') return 0;
    return theme.spacing.sm;
  }}px;
  margin-top: ${({ theme, $isWide, $placement }) => ((!$isWide && $placement === 'mobile') ? theme.spacing.xs : 0)}px;
  width: ${({ $isWide, $placement }) => ((!$isWide && $placement === 'mobile') ? '100%' : 'auto')};
  flex-shrink: 0;
`;

const StyledActionSlot = styled.View.withConfig({
  displayName: 'StyledActionSlot',
  shouldForwardProp: (prop) => !['$separatorBefore', '$isWide'].includes(prop),
})`
  margin-left: ${({ theme, $separatorBefore, $isWide }) => {
    if ($separatorBefore && $isWide) return theme.spacing.sm;
    return theme.spacing.xs;
  }}px;
  padding-left: ${({ theme, $separatorBefore, $isWide }) => (($separatorBefore && $isWide) ? theme.spacing.sm : 0)}px;
  border-left-width: ${({ $separatorBefore, $isWide }) => (($separatorBefore && $isWide) ? 1 : 0)}px;
  border-left-color: ${({ theme }) => theme.colors.border.light};
`;

const StyledActionButton = styled.Pressable.withConfig({
  displayName: 'StyledActionButton',
  shouldForwardProp: (prop) => !['$actionType', '$showLabel', '$tone', '$isWide'].includes(prop),
})`
  flex-direction: row;
  align-items: center;
  justify-content: center;
  min-height: 30px;
  min-width: ${({ $showLabel, $isWide }) => {
    if ($showLabel) return 'auto';
    return $isWide ? '28px' : '30px';
  }};
  padding-horizontal: ${({ theme, $showLabel, $isWide }) => {
    if ($isWide) return theme.spacing.xs;
    return $showLabel ? theme.spacing.sm : theme.spacing.xs;
  }}px;
  padding-vertical: ${({ theme }) => theme.spacing.xs}px;
  border-width: ${({ $isWide }) => ($isWide ? 0 : 1)}px;
  border-color: ${({ theme, $actionType, $tone, $isWide }) => {
    if ($isWide) return 'transparent';
    return hexToRgba(resolveActionColor(theme, $actionType, $tone), 0.3);
  }};
  border-radius: ${({ theme }) => theme.radius.full}px;
  background-color: ${({ theme, $actionType, $tone, $showLabel, $isWide }) => {
    if ($isWide) return 'transparent';
    const base = resolveActionColor(theme, $actionType, $tone);
    return hexToRgba(base, $showLabel ? 0.14 : 0.1);
  }};
  opacity: ${({ disabled }) => (disabled ? 0.5 : 1)};
`;

const StyledActionButtonLabel = styled(Text).withConfig({
  displayName: 'StyledActionButtonLabel',
  shouldForwardProp: (prop) => !['$actionType', '$tone'].includes(prop),
})`
  margin-left: ${({ theme }) => theme.spacing.xs}px;
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  color: ${({ theme, $actionType, $tone }) => resolveActionColor(theme, $actionType, $tone)};
`;

const StyledTitle = styled(Text).withConfig({
  displayName: 'StyledTitle',
})`
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  color: ${({ theme }) => theme.colors.text.primary};
  flex-shrink: 1;
`;

const StyledSubtitle = styled(Text).withConfig({
  displayName: 'StyledSubtitle',
  shouldForwardProp: (prop) => !['$isInline'].includes(prop),
})`
  margin-top: ${({ theme, $isInline }) => ($isInline ? 0 : theme.spacing.xs)}px;
  color: ${({ theme }) => theme.colors.text.secondary};
  flex-shrink: 1;
`;

const StyledMetaRow = styled.View.withConfig({
  displayName: 'StyledMetaRow',
  shouldForwardProp: (prop) => !['$withDivider', '$isWide'].includes(prop),
})`
  margin-top: ${({ theme, $isWide }) => ($isWide ? theme.spacing.xs : theme.spacing.sm)}px;
  padding-top: ${({ theme, $isWide }) => ($isWide ? 0 : theme.spacing.sm)}px;
  border-top-width: ${({ $withDivider }) => ($withDivider ? 1 : 0)}px;
  border-top-color: ${({ theme }) => theme.colors.border.light};
  flex-direction: row;
  align-items: center;
  flex-wrap: ${({ $isWide }) => ($isWide ? 'nowrap' : 'wrap')};
`;

const StyledMetaItem = styled.View.withConfig({
  displayName: 'StyledMetaItem',
  shouldForwardProp: (prop) => !['$isWide', '$isSubtitle', '$isFirst'].includes(prop),
})`
  flex-direction: row;
  align-items: center;
  margin-right: ${({ theme, $isWide, $isSubtitle }) => {
    if ($isWide && $isSubtitle) return theme.spacing.lg;
    if ($isWide) return theme.spacing.md;
    return theme.spacing.md;
  }}px;
  margin-bottom: 2px;
  flex-shrink: ${({ $isSubtitle }) => ($isSubtitle ? 1 : 0)};
  min-width: ${({ $isSubtitle }) => ($isSubtitle ? 0 : 'auto')};
`;

const StyledMetaIconSlot = styled.View.withConfig({
  displayName: 'StyledMetaIconSlot',
})`
  margin-right: ${({ theme }) => theme.spacing.xs}px;
`;

const StyledMetaText = styled(Text).withConfig({
  displayName: 'StyledMetaText',
  shouldForwardProp: (prop) => !['$tone'].includes(prop),
})`
  color: ${({ theme, $tone }) => resolveThemeColor(theme, $tone || 'text.secondary', theme.colors.text.secondary)};
`;

const StyledStatusSlot = styled.View.withConfig({
  displayName: 'StyledStatusSlot',
  shouldForwardProp: (prop) => !['$isWide'].includes(prop),
})`
  margin-left: auto;
  flex-direction: row;
  align-items: center;
  margin-bottom: 2px;
  flex-shrink: 0;
`;

const StyledStatusDot = styled.View.withConfig({
  displayName: 'StyledStatusDot',
  shouldForwardProp: (prop) => !['$tone'].includes(prop),
})`
  width: 9px;
  height: 9px;
  border-radius: 999px;
  margin-right: ${({ theme }) => theme.spacing.sm}px;
  background-color: ${({ theme, $tone }) => resolveStatusColor(theme, $tone)};
`;

const StyledStatusLabel = styled(Text).withConfig({
  displayName: 'StyledStatusLabel',
  shouldForwardProp: (prop) => !['$tone'].includes(prop),
})`
  color: ${({ theme, $tone }) => resolveStatusColor(theme, $tone)};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
`;

export {
  StyledListItem,
  StyledLeadingSlot,
  StyledLeadingSurface,
  StyledListItemContent,
  StyledTopRow,
  StyledHeaderContent,
  StyledTitleRow,
  StyledBadgeSlot,
  StyledListItemActions,
  StyledActionSlot,
  StyledActionButton,
  StyledActionButtonLabel,
  StyledTitle,
  StyledSubtitle,
  StyledMetaRow,
  StyledMetaItem,
  StyledMetaIconSlot,
  StyledMetaText,
  StyledStatusSlot,
  StyledStatusDot,
  StyledStatusLabel,
};
