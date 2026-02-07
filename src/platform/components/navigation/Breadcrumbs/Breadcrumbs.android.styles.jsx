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
  flex-wrap: wrap;
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
  StyledBreadcrumbItem,
  StyledSeparator,
  StyledLink,
  StyledBreadcrumbText,
  StyledBreadcrumbIcon,
};
