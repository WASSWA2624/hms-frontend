/**
 * SystemBanner Android Styles
 * Styled-components for Android platform
 * File: SystemBanner.android.styles.jsx
 */
import styled from 'styled-components/native';
import { Pressable } from 'react-native';
import { BANNER_VARIANTS } from '@utils/shellBanners';

const getVariantColors = (variant, theme) => {
  const colors = theme?.colors || {};
  const surface = colors.background?.secondary || '#F5F5F7';
  const maintenance = colors.status?.error || {
    background: colors.error || '#FFEBEE',
    text: '#C62828',
  };
  if (variant === BANNER_VARIANTS.MAINTENANCE) {
    return {
      background: maintenance.background,
      text: maintenance.text,
      border: colors.error || '#FF3B30',
      accent: null,
    };
  }
  if (variant === BANNER_VARIANTS.LOW_QUALITY || variant === BANNER_VARIANTS.OFFLINE) {
    return {
      background: surface,
      text: colors.text?.primary || colors.textPrimary || '#1f2937',
      border: 'transparent',
      accent: colors.warning || '#FF9500',
    };
  }
  if (variant === BANNER_VARIANTS.ONLINE) {
    return {
      background: colors.success || '#34C759',
      text: colors.onPrimary || colors.text?.inverse || '#FFFFFF',
      border: colors.success || '#34C759',
      accent: null,
    };
  }
  return {
    background: colors.primary || '#0078D4',
    text: colors.onPrimary || colors.text?.inverse || '#FFFFFF',
    border: colors.primary || '#0078D4',
    accent: null,
  };
};

const StyledBanner = styled.View.withConfig({
  displayName: 'StyledBanner',
  componentId: 'StyledBanner',
})`
  width: 100%;
  border-width: 1px;
  border-color: ${({ variant, theme }) => getVariantColors(variant, theme).border};
  border-left-width: ${({ variant, theme }) => (getVariantColors(variant, theme).accent ? 4 : 1)}px;
  border-left-color: ${({ variant, theme }) => getVariantColors(variant, theme).accent || getVariantColors(variant, theme).border};
  border-radius: ${({ theme }) => theme.radius.lg || theme.radius.md}px;
  background-color: ${({ variant, theme }) => getVariantColors(variant, theme).background};
  padding-vertical: ${({ theme }) => theme.spacing.md}px;
  padding-horizontal: ${({ theme }) => theme.spacing.lg}px;
  min-height: ${({ theme }) => theme.spacing.xl + theme.spacing.sm}px;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;

const StyledContent = styled.View.withConfig({
  displayName: 'StyledContent',
  componentId: 'StyledContent',
})`
  flex: 1;
`;

const StyledTitle = styled.Text.withConfig({
  displayName: 'StyledTitle',
  componentId: 'StyledTitle',
})`
  color: ${({ variant, theme }) => getVariantColors(variant, theme).text};
  font-family: ${({ theme }) => theme.typography.fontFamily.medium};
  font-size: ${({ theme }) => theme.typography.fontSize.md}px;
  font-weight: ${({ theme }) => theme.typography.fontWeight.semiBold};
`;

const StyledMessage = styled.Text.withConfig({
  displayName: 'StyledMessage',
  componentId: 'StyledMessage',
})`
  color: ${({ variant, theme }) => getVariantColors(variant, theme).text};
  font-family: ${({ theme }) => theme.typography.fontFamily.regular};
  font-size: ${({ theme }) => theme.typography.fontSize.sm}px;
  font-weight: ${({ theme }) => theme.typography.fontWeight.regular};
  margin-top: ${({ theme }) => theme.spacing.xs}px;
`;

const StyledActions = styled.View.withConfig({
  displayName: 'StyledActions',
  componentId: 'StyledActions',
})`
  flex-direction: row;
  align-items: center;
  margin-left: ${({ theme }) => theme.spacing.sm}px;
`;

const StyledActionButton = styled(Pressable).withConfig({
  displayName: 'StyledActionButton',
  componentId: 'StyledActionButton',
})`
  padding-vertical: ${({ theme }) => theme.spacing.xs}px;
  padding-horizontal: ${({ theme }) => theme.spacing.sm}px;
  border-width: 1px;
  border-color: ${({ variant, theme }) => getVariantColors(variant, theme).text};
  border-radius: ${({ theme }) => theme.radius.sm}px;
  margin-right: ${({ theme }) => theme.spacing.sm}px;
  min-height: ${({ theme }) => theme.spacing.xl}px;
  justify-content: center;
`;

const StyledDismissButton = styled(Pressable).withConfig({
  displayName: 'StyledDismissButton',
  componentId: 'StyledDismissButton',
})`
  padding-vertical: ${({ theme }) => theme.spacing.xs}px;
  padding-horizontal: ${({ theme }) => theme.spacing.sm}px;
  min-height: ${({ theme }) => theme.spacing.xl}px;
  justify-content: center;
`;

const StyledActionText = styled.Text.withConfig({
  displayName: 'StyledActionText',
  componentId: 'StyledActionText',
})`
  color: ${({ variant, theme }) => getVariantColors(variant, theme).text};
  font-family: ${({ theme }) => theme.typography.fontFamily.medium};
  font-size: ${({ theme }) => theme.typography.fontSize.sm}px;
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
`;

export {
  StyledActions,
  StyledActionButton,
  StyledActionText,
  StyledBanner,
  StyledContent,
  StyledDismissButton,
  StyledMessage,
  StyledTitle,
};
