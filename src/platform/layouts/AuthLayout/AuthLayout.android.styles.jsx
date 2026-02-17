/**
 * AuthLayout Android Styles
 * Styled-components for Android platform
 * File: AuthLayout.android.styles.jsx
 */

import styled from 'styled-components/native';
import { ScrollView, KeyboardAvoidingView } from 'react-native';
import Text from '@platform/components/display/Text';

const StyledContainer = styled.View.withConfig({
  displayName: 'StyledContainer',
  componentId: 'StyledContainer',
})`
  flex: 1;
  background-color: ${({ theme }) => theme.colors.background.secondary};
  align-items: center;
  padding-horizontal: ${({ theme }) => theme.spacing.md}px;
  padding-top: ${({ theme, topInset = 0 }) => theme.spacing.sm + topInset}px;
  padding-bottom: ${({ theme, bottomInset = 0 }) => theme.spacing.sm + bottomInset}px;
`;

const StyledBanner = styled.View.withConfig({
  displayName: 'StyledBanner',
  componentId: 'StyledBanner',
})`
  width: 100%;
  margin-bottom: ${({ theme }) => theme.spacing.sm}px;
`;

const StyledKeyboardAvoidingView = styled(KeyboardAvoidingView).withConfig({
  displayName: 'StyledKeyboardAvoidingView',
  componentId: 'StyledKeyboardAvoidingView',
})`
  flex: 1;
  width: 100%;
  align-items: center;
`;

const StyledCard = styled.View.withConfig({
  displayName: 'StyledCard',
  componentId: 'StyledCard',
})`
  flex: 1;
  width: 100%;
  max-width: ${({ theme }) => theme.spacing.xxl * 20}px;
  background-color: ${({ theme }) => theme.colors.background.primary};
  border-radius: ${({ theme }) => theme.radius.lg}px;
  padding: ${({ theme }) => theme.spacing.lg}px;
  border-width: 1px;
  border-color: ${({ theme }) => theme.colors.background.tertiary};
  shadow-color: ${({ theme }) => theme.shadows.md.shadowColor};
  shadow-offset: ${({ theme }) =>
    `${theme.shadows.md.shadowOffset.width}px ${theme.shadows.md.shadowOffset.height}px`};
  shadow-opacity: ${({ theme }) => theme.shadows.md.shadowOpacity};
  shadow-radius: ${({ theme }) => theme.shadows.md.shadowRadius * 2}px;
  elevation: ${({ theme }) => theme.shadows.md.elevation};
  overflow: hidden;
`;

const StyledBranding = styled.View.withConfig({
  displayName: 'StyledBranding',
  componentId: 'StyledBranding',
  shouldForwardProp: (prop) => prop !== '$withScreenHeader',
})`
  width: 100%;
  margin-top: -${({ theme }) => theme.spacing.lg}px;
  margin-left: -${({ theme }) => theme.spacing.lg}px;
  margin-right: -${({ theme }) => theme.spacing.lg}px;
  margin-bottom: ${({ theme, $withScreenHeader }) =>
    ($withScreenHeader ? theme.spacing.xs : theme.spacing.sm)}px;
  padding-vertical: ${({ theme }) => theme.spacing.sm}px;
  padding-horizontal: ${({ theme }) => theme.spacing.lg}px;
  background-color: ${({ theme }) => theme.colors.background.secondary};
  border-bottom-width: 1px;
  border-bottom-color: ${({ theme }) => `${theme.colors.primary}33`};
`;

const StyledBrandHeader = styled.View.withConfig({
  displayName: 'StyledBrandHeader',
  componentId: 'StyledBrandHeader',
})`
  width: 100%;
  flex-direction: row;
  align-items: center;
  justify-content: center;
`;

const StyledBrandLogoShell = styled.View.withConfig({
  displayName: 'StyledBrandLogoShell',
  componentId: 'StyledBrandLogoShell',
})`
  width: ${({ theme }) => theme.spacing.xxl + theme.spacing.xs}px;
  height: ${({ theme }) => theme.spacing.xxl + theme.spacing.xs}px;
  align-items: center;
  justify-content: center;
  border-radius: ${({ theme }) => theme.radius.md}px;
  border-width: 1px;
  border-color: ${({ theme }) => `${theme.colors.primary}66`};
  background-color: ${({ theme }) => theme.colors.background.primary};
`;

const StyledBrandName = styled.View.withConfig({
  displayName: 'StyledBrandName',
  componentId: 'StyledBrandName',
})`
  margin-left: ${({ theme }) => theme.spacing.xs}px;
  min-width: 0;
  flex-shrink: 1;
  max-width: 78%;
`;

const StyledSupplementalBranding = styled.View.withConfig({
  displayName: 'StyledSupplementalBranding',
  componentId: 'StyledSupplementalBranding',
})`
  width: 100%;
  margin-top: ${({ theme }) => theme.spacing.sm}px;
`;

const StyledScreenHeader = styled.View.withConfig({
  displayName: 'StyledScreenHeader',
  componentId: 'StyledScreenHeader',
})`
  width: 100%;
  flex-shrink: 0;
  padding: ${({ theme }) => theme.spacing.sm}px;
  margin-bottom: ${({ theme }) => theme.spacing.sm}px;
  border-width: 1px;
  border-color: ${({ theme }) => `${theme.colors.primary}33`};
  border-radius: ${({ theme }) => theme.radius.sm}px;
  background-color: ${({ theme }) => theme.colors.background.secondary};
`;

const StyledScreenHeaderRow = styled.View.withConfig({
  displayName: 'StyledScreenHeaderRow',
  componentId: 'StyledScreenHeaderRow',
})`
  width: 100%;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  margin-bottom: ${({ theme }) => theme.spacing.xs}px;
`;

const StyledScreenHeaderCopy = styled.View.withConfig({
  displayName: 'StyledScreenHeaderCopy',
  componentId: 'StyledScreenHeaderCopy',
})`
  flex: 1;
  min-width: 0;
  margin-right: ${({ theme }) => theme.spacing.xs}px;
`;

const StyledScreenHeaderTitleText = styled(Text).attrs({
  variant: 'label',
  color: 'primary',
})`
  text-transform: uppercase;
  letter-spacing: ${({ theme }) => theme.spacing.xs / 4}px;
`;

const StyledScreenHeaderSubtitleText = styled(Text).attrs({
  variant: 'body',
  color: 'text.secondary',
})``;

const StyledScrollView = styled(ScrollView)
  .withConfig({
    displayName: 'StyledScrollView',
    componentId: 'StyledScrollView',
  })
  .attrs(({ theme }) => ({
    contentContainerStyle: {
      flexGrow: 1,
      width: '100%',
      alignItems: 'stretch',
      paddingBottom: theme?.spacing?.sm ?? 8,
    },
  }))`
  flex: 1;
  width: 100%;
`;

const StyledContent = StyledScrollView;

const StyledHelpLinks = styled.View.withConfig({
  displayName: 'StyledHelpLinks',
  componentId: 'StyledHelpLinks',
})`
  margin-top: ${({ theme }) => theme.spacing.sm}px;
  align-items: center;
`;

export {
  StyledBanner,
  StyledContainer,
  StyledKeyboardAvoidingView,
  StyledScrollView,
  StyledCard,
  StyledBranding,
  StyledBrandHeader,
  StyledBrandLogoShell,
  StyledBrandName,
  StyledSupplementalBranding,
  StyledScreenHeader,
  StyledScreenHeaderRow,
  StyledScreenHeaderCopy,
  StyledScreenHeaderTitleText,
  StyledScreenHeaderSubtitleText,
  StyledContent,
  StyledHelpLinks,
};
