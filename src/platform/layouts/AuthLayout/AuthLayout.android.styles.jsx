/**
 * AuthLayout Android Styles
 * Styled-components for Android platform
 * File: AuthLayout.android.styles.jsx
 */

import styled from 'styled-components/native';
import { ScrollView, KeyboardAvoidingView } from 'react-native';

const StyledContainer = styled.View.withConfig({
  displayName: 'StyledContainer',
  componentId: 'StyledContainer',
})`
  flex: 1;
  background-color: ${({ theme }) => `${theme.colors.primary}14`};
  align-items: center;
  padding-horizontal: ${({ theme }) => theme.spacing.md}px;
  padding-top: ${({ theme, topInset = 0 }) => theme.spacing.sm + topInset}px;
  padding-bottom: ${({ theme, bottomInset = 0 }) => theme.spacing.sm + bottomInset}px;
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
  border-radius: ${({ theme }) => theme.radius.md}px;
  padding: ${({ theme }) => theme.spacing.md}px;
  border-width: 1px;
  border-color: ${({ theme }) => theme.colors.background.tertiary};
  shadow-color: ${({ theme }) => theme.shadows.md.shadowColor};
  shadow-offset: ${({ theme }) => `${theme.shadows.md.shadowOffset.width}px ${theme.shadows.md.shadowOffset.height}px`};
  shadow-opacity: ${({ theme }) => theme.shadows.md.shadowOpacity};
  shadow-radius: ${({ theme }) => theme.shadows.md.shadowRadius * 2}px;
  elevation: ${({ theme }) => theme.shadows.md.elevation + 2};
  overflow: hidden;
`;

const StyledBranding = styled.View.withConfig({
  displayName: 'StyledBranding',
  componentId: 'StyledBranding',
})`
  width: 100%;
  align-items: center;
  margin-top: -${({ theme }) => theme.spacing.md}px;
  margin-left: -${({ theme }) => theme.spacing.md}px;
  margin-right: -${({ theme }) => theme.spacing.md}px;
  margin-bottom: ${({ theme, $withScreenHeader }) =>
    ($withScreenHeader ? theme.spacing.xs / 2 : theme.spacing.sm)}px;
  padding-vertical: ${({ theme }) => theme.spacing.sm}px;
  padding-horizontal: ${({ theme }) => theme.spacing.md}px;
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
  background-color: ${({ theme }) => `${theme.colors.primary}14`};
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

const StyledScreenHeader = styled.View.withConfig({
  displayName: 'StyledScreenHeader',
  componentId: 'StyledScreenHeader',
})`
  width: 100%;
  flex-shrink: 0;
  gap: ${({ theme }) => theme.spacing.xs / 2}px;
  padding: ${({ theme }) => theme.spacing.xs / 2}px ${({ theme }) => theme.spacing.xs}px;
  margin-bottom: ${({ theme }) => theme.spacing.xs}px;
  border-width: 1px;
  border-color: ${({ theme }) => `${theme.colors.primary}33`};
  border-top-left-radius: ${({ theme }) => theme.radius.md}px;
  border-top-right-radius: ${({ theme }) => theme.radius.md}px;
  border-bottom-left-radius: 0;
  border-bottom-right-radius: 0;
  background-color: ${({ theme }) => theme.colors.background.secondary};
  shadow-color: #08224a;
  shadow-offset: 0px 2px;
  shadow-opacity: 0.08;
  shadow-radius: 6px;
  elevation: 2;
`;

const StyledScreenHeaderRow = styled.View.withConfig({
  displayName: 'StyledScreenHeaderRow',
  componentId: 'StyledScreenHeaderRow',
})`
  width: 100%;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing.xs}px;
`;

const StyledScreenHeaderCopy = styled.View.withConfig({
  displayName: 'StyledScreenHeaderCopy',
  componentId: 'StyledScreenHeaderCopy',
})`
  flex: 1;
  min-width: 0;
  overflow: hidden;
`;

const StyledScrollView = styled(ScrollView)
  .withConfig({
    displayName: 'StyledScrollView',
    componentId: 'StyledScrollView',
  })
  .attrs(({ theme }) => ({
    contentContainerStyle: {
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
  margin-top: ${({ theme }) => theme.spacing.md}px;
  align-items: center;
`;

export {
  StyledContainer,
  StyledKeyboardAvoidingView,
  StyledScrollView,
  StyledCard,
  StyledBranding,
  StyledBrandHeader,
  StyledBrandLogoShell,
  StyledBrandName,
  StyledScreenHeader,
  StyledScreenHeaderRow,
  StyledScreenHeaderCopy,
  StyledContent,
  StyledHelpLinks,
};
