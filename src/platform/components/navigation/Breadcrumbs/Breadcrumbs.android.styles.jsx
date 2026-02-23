/**
 * Breadcrumbs Android Styles
 * Styled-components for Android platform
 * File: Breadcrumbs.android.styles.jsx
 */
import styled from 'styled-components/native';
import { View, Text, Pressable } from 'react-native';

const StyledBreadcrumbs = styled(View).withConfig({
  displayName: 'StyledBreadcrumbs',
  componentId: 'StyledBreadcrumbs',
})`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  width: 100%;
`;

const StyledBreadcrumbsList = styled(View).withConfig({
  displayName: 'StyledBreadcrumbsList',
  componentId: 'StyledBreadcrumbsList',
})`
  flex-direction: row;
  align-items: center;
  flex-wrap: wrap;
  flex: 1;
`;

const StyledBreadcrumbsActions = styled(View).withConfig({
  displayName: 'StyledBreadcrumbsActions',
  componentId: 'StyledBreadcrumbsActions',
})`
  flex-direction: row;
  gap: ${({ theme }) => theme.spacing.xs}px;
  align-items: center;
  justify-content: flex-end;
`;

const StyledBackButton = styled(Pressable).withConfig({
  displayName: 'StyledBackButton',
  componentId: 'StyledBackButton',
})`
  flex-direction: row;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing.xs}px;
  padding-vertical: ${({ theme }) => theme.spacing.xs}px;
  padding-horizontal: ${({ theme }) => theme.spacing.sm}px;
  min-height: ${({ theme }) => theme.spacing.xxl - theme.spacing.xs}px;
  min-width: ${({ theme }) => theme.spacing.xxl - theme.spacing.xs}px;
  border-radius: ${({ theme }) => theme.radius.sm}px;
  border-width: 1px;
  border-color: ${({ theme }) => theme.colors.background.tertiary};
  background-color: ${({ theme }) => theme.colors.background.secondary};
  opacity: ${({ disabled }) => (disabled ? 0.5 : 1)};
`;

const StyledBackLabel = styled(Text).withConfig({
  displayName: 'StyledBackLabel',
  componentId: 'StyledBackLabel',
})`
  font-family: ${({ theme }) => theme.typography.fontFamily.regular};
  font-size: ${({ theme }) => theme.typography.fontSize.xs}px;
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  color: ${({ theme }) => theme.colors.text.primary};
`;

const StyledBreadcrumbItem = styled(View).withConfig({
  displayName: 'StyledBreadcrumbItem',
  componentId: 'StyledBreadcrumbItem',
})`
  flex-direction: row;
  align-items: center;
`;

const StyledSeparator = styled(Text).withConfig({
  displayName: 'StyledSeparator',
  componentId: 'StyledSeparator',
})`
  font-family: ${({ theme }) => theme.typography.fontFamily.regular};
  font-size: ${({ theme }) => theme.typography.fontSize.xs}px;
  color: ${({ theme }) => theme.colors.text.tertiary};
  margin-horizontal: ${({ theme }) => theme.spacing.xs / 2}px;
`;

const StyledLink = styled(Pressable).withConfig({
  displayName: 'StyledLink',
  componentId: 'StyledLink',
})`
  flex-direction: row;
  align-items: center;
  min-height: ${({ theme }) => theme.spacing.xxl - theme.spacing.xs}px;
  padding-horizontal: ${({ theme }) => theme.spacing.xs}px;
`;

const StyledBreadcrumbText = styled(Text).withConfig({
  displayName: 'StyledBreadcrumbText',
  componentId: 'StyledBreadcrumbText',
})`
  font-family: ${({ theme }) => theme.typography.fontFamily.regular};
  font-size: ${({ theme }) => theme.typography.fontSize.xs}px;
  font-weight: ${({ isLast }) => (isLast ? 600 : 400)};
  line-height: ${({ theme }) => theme.typography.fontSize.xs * theme.typography.lineHeight.normal}px;
  color: ${({ isLast, isLink, theme }) => (
    isLink ? theme.colors.primary : (isLast ? theme.colors.text.primary : theme.colors.text.secondary)
  )};
`;

const StyledBreadcrumbIcon = styled(View).withConfig({
  displayName: 'StyledBreadcrumbIcon',
  componentId: 'StyledBreadcrumbIcon',
})`
  margin-right: ${({ theme }) => theme.spacing.xs / 2}px;
  opacity: 0.7;
`;

export {
  StyledBreadcrumbs,
  StyledBreadcrumbsList,
  StyledBreadcrumbsActions,
  StyledBackButton,
  StyledBackLabel,
  StyledBreadcrumbItem,
  StyledSeparator,
  StyledLink,
  StyledBreadcrumbText,
  StyledBreadcrumbIcon,
};
