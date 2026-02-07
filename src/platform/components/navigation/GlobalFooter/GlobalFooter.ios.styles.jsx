/**
 * GlobalFooter Component Styles - iOS
 * Styled-components for GlobalFooter iOS implementation
 * File: GlobalFooter.ios.styles.jsx
 */
import styled from 'styled-components/native';

const StyledFooter = styled.View.withConfig({
  displayName: 'StyledFooter',
  componentId: 'StyledFooter',
})`
  background-color: ${({ theme }) => theme.colors.background.secondary};
  border-top-width: 1px;
  border-top-color: ${({ theme }) => theme.colors.background.tertiary};
`;

const StyledFooterContent = styled.View.withConfig({
  displayName: 'StyledFooterContent',
  componentId: 'StyledFooterContent',
})`
  padding: ${({ theme, minimal }) => (minimal ? theme.spacing.xs : theme.spacing.md)}px;
  padding-bottom: ${({ theme, bottomInset, minimal }) =>
    (minimal ? theme.spacing.xs : theme.spacing.md) + bottomInset}px;
  row-gap: ${({ theme, minimal }) => (minimal ? 0 : theme.spacing.md)}px;
`;

const StyledFooterRow = styled.View.withConfig({
  displayName: 'StyledFooterRow',
  componentId: 'StyledFooterRow',
})`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  column-gap: ${({ theme }) => theme.spacing.md}px;
  row-gap: ${({ theme }) => theme.spacing.sm}px;
`;

const StyledStatusGroup = styled.View.withConfig({
  displayName: 'StyledStatusGroup',
  componentId: 'StyledStatusGroup',
})`
  flex-direction: row;
  align-items: center;
  flex-wrap: wrap;
  column-gap: ${({ theme }) => theme.spacing.sm}px;
  row-gap: ${({ theme }) => theme.spacing.xs}px;
`;

const StyledStatusBadge = styled.View.withConfig({
  displayName: 'StyledStatusBadge',
  componentId: 'StyledStatusBadge',
})`
  flex-direction: row;
  align-items: center;
  padding: ${({ theme }) => theme.spacing.xs}px ${({ theme }) => theme.spacing.sm}px;
  border-radius: ${({ theme }) => theme.radius.md}px;
  background-color: ${({ theme, tone }) => {
    if (tone === 'success') return theme.colors.success;
    if (tone === 'warning') return theme.colors.warning;
    if (tone === 'error') return theme.colors.error;
    return theme.colors.background.tertiary;
  }};
`;

const StyledEnvironmentInfo = styled.Text.withConfig({
  displayName: 'StyledEnvironmentInfo',
  componentId: 'StyledEnvironmentInfo',
})`
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: ${({ theme }) => theme.typography.fontSize.sm}px;
`;

const StyledLegalLinks = styled.View.withConfig({
  displayName: 'StyledLegalLinks',
  componentId: 'StyledLegalLinks',
})`
  flex-direction: row;
  flex-wrap: wrap;
  column-gap: ${({ theme }) => theme.spacing.md}px;
  row-gap: ${({ theme }) => theme.spacing.sm}px;
  align-items: center;
`;

const StyledLegalButton = styled.Pressable.withConfig({
  displayName: 'StyledLegalButton',
  componentId: 'StyledLegalButton',
})`
  min-height: 44px;
  justify-content: center;
`;

const StyledLegalText = styled.View.withConfig({
  displayName: 'StyledLegalText',
  componentId: 'StyledLegalText',
})`
  min-height: 44px;
  justify-content: center;
`;

const StyledQuickActionsGroup = styled.View.withConfig({
  displayName: 'StyledQuickActionsGroup',
  componentId: 'StyledQuickActionsGroup',
})`
  flex-direction: row;
  flex-wrap: wrap;
  align-items: center;
  column-gap: ${({ theme }) => theme.spacing.xs}px;
  row-gap: ${({ theme }) => theme.spacing.xs}px;
`;

const StyledQuickActionButton = styled.Pressable.withConfig({
  displayName: 'StyledQuickActionButton',
  componentId: 'StyledQuickActionButton',
})`
  flex-direction: row;
  align-items: center;
  column-gap: ${({ theme }) => theme.spacing.xs}px;
  padding: ${({ theme }) => theme.spacing.xs}px ${({ theme }) => theme.spacing.sm}px;
  min-height: 44px;
  border-radius: ${({ theme }) => theme.radius.md}px;
  border-width: 1px;
  border-color: ${({ theme, isPrimary }) =>
    isPrimary ? theme.colors.primary : theme.colors.background.tertiary};
  background-color: ${({ theme, isPrimary }) =>
    isPrimary ? theme.colors.primary : theme.colors.background.primary};
  opacity: ${({ isDisabled }) => (isDisabled ? 0.6 : 1)};
`;

const StyledQuickActionIcon = styled.View.withConfig({
  displayName: 'StyledQuickActionIcon',
  componentId: 'StyledQuickActionIcon',
})`
  align-items: center;
  justify-content: center;
`;

const StyledQuickActionsSlot = styled.View.withConfig({
  displayName: 'StyledQuickActionsSlot',
  componentId: 'StyledQuickActionsSlot',
})`
  width: 100%;
`;

const StyledMinimalRow = styled.View.withConfig({
  displayName: 'StyledMinimalRow',
  componentId: 'StyledMinimalRow',
})`
  flex-direction: row;
  align-items: center;
  justify-content: center;
  flex-wrap: nowrap;
  gap: ${({ theme }) => theme.spacing.xs}px;
`;

const StyledFooterBrand = styled.View.withConfig({
  displayName: 'StyledFooterBrand',
  componentId: 'StyledFooterBrand',
})`
  flex-direction: row;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs}px;
`;

const StyledFooterCopyright = styled.Text.withConfig({
  displayName: 'StyledFooterCopyright',
  componentId: 'StyledFooterCopyright',
})`
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: ${({ theme }) => theme.typography?.fontSize?.xs ?? 12}px;
`;

const StyledFooterLink = styled.Text.withConfig({
  displayName: 'StyledFooterLink',
  componentId: 'StyledFooterLink',
})`
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: ${({ theme }) => theme.typography?.fontSize?.xs ?? 12}px;
`;

const StyledFooterSeparator = styled.Text.withConfig({
  displayName: 'StyledFooterSeparator',
  componentId: 'StyledFooterSeparator',
})`
  color: ${({ theme }) => theme.colors.text.tertiary};
  font-size: ${({ theme }) => theme.typography?.fontSize?.xs ?? 12}px;
`;

export {
  StyledFooter,
  StyledFooterContent,
  StyledFooterRow,
  StyledStatusGroup,
  StyledStatusBadge,
  StyledEnvironmentInfo,
  StyledLegalLinks,
  StyledLegalButton,
  StyledLegalText,
  StyledQuickActionsGroup,
  StyledQuickActionButton,
  StyledQuickActionIcon,
  StyledQuickActionsSlot,
  StyledMinimalRow,
  StyledFooterBrand,
  StyledFooterCopyright,
  StyledFooterLink,
  StyledFooterSeparator,
};
