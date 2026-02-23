/**
 * Breadcrumbs Web Styles
 * Semantic HTML only (theme-design.mdc, component-structure.mdc)
 * File: Breadcrumbs.web.styles.jsx
 */
import styled, { css } from 'styled-components';

const navConfig = { displayName: 'StyledBreadcrumbs', componentId: 'StyledBreadcrumbs' };
const StyledBreadcrumbs = styled.nav.withConfig({
  ...navConfig,
  shouldForwardProp: (prop) => prop !== 'testID',
})`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing.md}px;
  width: 100%;
  min-width: 0;
  flex-wrap: wrap;

  @media (max-width: ${({ theme }) => (theme.breakpoints?.tablet || 768) - 1}px) {
    align-items: flex-start;
    gap: ${({ theme }) => theme.spacing.xs}px;
  }
`;

const StyledBreadcrumbsList = styled.div.withConfig({
  displayName: 'StyledBreadcrumbsList',
  componentId: 'StyledBreadcrumbsList',
})`
  display: flex;
  flex-direction: row;
  align-items: center;
  flex-wrap: nowrap;
  gap: ${({ theme }) => theme.spacing.xs / 2}px;
  padding: 0;
  min-width: 0;
  flex: 1 1 auto;

  @media (max-width: ${({ theme }) => theme.breakpoints?.tablet || 768}px) {
    padding: 0;
    gap: ${({ theme }) => theme.spacing.xs / 2}px;
  }
`;

const StyledBreadcrumbsActions = styled.div.withConfig({
  displayName: 'StyledBreadcrumbsActions',
  componentId: 'StyledBreadcrumbsActions',
})`
  display: flex;
  gap: ${({ theme }) => theme.spacing.xs}px;
  align-items: center;
  justify-content: flex-end;
  flex-shrink: 0;

  @media (max-width: ${({ theme }) => (theme.breakpoints?.tablet || 768) - 1}px) {
    width: 100%;
    justify-content: flex-start;
    flex-wrap: wrap;
  }
`;

const StyledBackButton = styled.button.withConfig({
  displayName: 'StyledBackButton',
  componentId: 'StyledBackButton',
})`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing.xs}px;
  padding: ${({ theme }) => theme.spacing.xs}px ${({ theme }) => theme.spacing.sm}px;
  min-width: ${({ theme }) => theme.spacing.xxl - theme.spacing.xs}px;
  min-height: ${({ theme }) => theme.spacing.xxl - theme.spacing.xs}px;
  border-radius: ${({ theme }) => theme.radius.sm}px;
  border: 1px solid ${({ theme }) => theme.colors.background.tertiary};
  background-color: ${({ theme }) => theme.colors.background.secondary};
  color: ${({ theme }) => theme.colors.text.primary};
  cursor: ${({ disabled }) => (disabled ? 'not-allowed' : 'pointer')};
  opacity: ${({ disabled }) => (disabled ? 0.5 : 1)};

  &:hover {
    ${({ disabled, theme }) => (disabled ? '' : `background-color: ${theme.colors.background.tertiary};`)}
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.primary};
    outline-offset: 2px;
  }
`;

const StyledBackLabel = styled.span.withConfig({
  displayName: 'StyledBackLabel',
  componentId: 'StyledBackLabel',
})`
  font-family: ${({ theme }) => theme.typography.fontFamily.regular};
  font-size: ${({ theme }) => theme.typography.fontSize.xs}px;
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  line-height: ${({ theme }) => theme.typography.fontSize.xs * theme.typography.lineHeight.normal}px;
  color: ${({ theme }) => theme.colors.text.primary};
`;

const StyledBreadcrumbItem = styled.span.withConfig({
  displayName: 'StyledBreadcrumbItem',
  componentId: 'StyledBreadcrumbItem',
})`
  display: inline-flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs}px;
  white-space: nowrap;
  max-width: 200px;
  min-width: 0;

  & > *:last-child {
    font-family: ${({ theme }) => theme.typography.fontFamily.regular};
    font-size: ${({ theme }) => theme.typography.fontSize.xs}px;
    font-weight: ${({ $isLast }) => ($isLast ? 600 : 400)};
    line-height: ${({ theme }) => theme.typography.fontSize.xs * theme.typography.lineHeight.normal}px;
    color: ${({ $isLast, theme }) => ($isLast ? theme.colors.text.primary : theme.colors.text.secondary)};
    overflow: hidden;
    text-overflow: ellipsis;
    flex-shrink: 1;
    min-width: 0;
  }

  @media (max-width: ${({ theme }) => theme.breakpoints?.tablet || 768}px) {
    max-width: 120px;

    & > *:last-child {
      font-size: ${({ theme }) => theme.typography.fontSize.xs}px;
    }
  }
`;

const StyledSeparator = styled.span.withConfig({
  displayName: 'StyledSeparator',
  componentId: 'StyledSeparator',
})`
  font-family: ${({ theme }) => theme.typography.fontFamily.regular};
  font-size: ${({ theme }) => theme.typography.fontSize.xs}px;
  color: ${({ theme }) => theme.colors.text.tertiary};
  margin: 0 ${({ theme }) => theme.spacing.xs / 2}px;
  user-select: none;

  @media (max-width: ${({ theme }) => theme.breakpoints?.tablet || 768}px) {
    font-size: ${({ theme }) => theme.typography.fontSize.xs}px;
    margin: 0 ${({ theme }) => theme.spacing.xs / 2}px;
  }
`;

const linkButtonStyles = css`
  display: inline-flex;
  align-items: center;
  justify-content: flex-start;
  gap: ${({ theme }) => theme.spacing.xs / 2}px;
  cursor: pointer;
  padding: ${({ theme }) => theme.spacing.xs}px ${({ theme }) => theme.spacing.sm}px;
  min-height: ${({ theme }) => theme.spacing.xxl - theme.spacing.xs}px;
  border-radius: ${({ theme }) => theme.radius.sm}px;
  transition: background-color 0.15s ease, color 0.15s ease;
  white-space: nowrap;
  max-width: 200px;
  min-width: 0;
  font-family: inherit;
  border: none;
  background: transparent;
  text-decoration: none;

  & > *:last-child {
    font-family: ${({ theme }) => theme.typography.fontFamily.regular};
    font-size: ${({ theme }) => theme.typography.fontSize.xs}px;
    font-weight: 400;
    line-height: ${({ theme }) => theme.typography.fontSize.xs * theme.typography.lineHeight.normal}px;
    color: ${({ theme }) => theme.colors.primary};
    overflow: hidden;
    text-overflow: ellipsis;
    flex-shrink: 1;
    min-width: 0;
  }

  &:hover {
    background-color: ${({ theme }) => theme.colors.background.secondary};
  }

  &:active {
    background-color: ${({ theme }) => theme.colors.background.tertiary};
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.primary};
    outline-offset: 2px;
    border-radius: ${({ theme }) => theme.radius.sm}px;
  }

  @media (max-width: ${({ theme }) => theme.breakpoints?.tablet || 768}px) {
    max-width: 120px;
    padding: ${({ theme }) => theme.spacing.xs}px;

    & > *:last-child {
      font-size: ${({ theme }) => theme.typography.fontSize.xs}px;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    transition: none;
  }
`;

const StyledBreadcrumbLink = styled.a.withConfig({
  displayName: 'StyledBreadcrumbLink',
  componentId: 'StyledBreadcrumbLink',
  shouldForwardProp: (prop) => prop !== 'testID',
})`
  ${linkButtonStyles}
`;

const StyledBreadcrumbButton = styled.button.withConfig({
  displayName: 'StyledBreadcrumbButton',
  componentId: 'StyledBreadcrumbButton',
  shouldForwardProp: (prop) => prop !== 'testID',
})`
  ${linkButtonStyles}
`;

const StyledBreadcrumbIcon = styled.span.withConfig({
  displayName: 'StyledBreadcrumbIcon',
  componentId: 'StyledBreadcrumbIcon',
})`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  opacity: 0.7;
`;

const StyledBreadcrumbEllipsis = styled.span.withConfig({
  displayName: 'StyledBreadcrumbEllipsis',
  componentId: 'StyledBreadcrumbEllipsis',
})`
  font-family: ${({ theme }) => theme.typography.fontFamily.regular};
  font-size: ${({ theme }) => theme.typography.fontSize.xs}px;
  color: ${({ theme }) => theme.colors.text.tertiary};
  user-select: none;
  padding: 0;

  @media (max-width: ${({ theme }) => theme.breakpoints?.tablet || 768}px) {
    font-size: ${({ theme }) => theme.typography.fontSize.xs}px;
    padding: 0;
  }
`;

export {
  StyledBreadcrumbs,
  StyledBreadcrumbsList,
  StyledBreadcrumbsActions,
  StyledBackButton,
  StyledBackLabel,
  StyledBreadcrumbItem,
  StyledSeparator,
  StyledBreadcrumbLink,
  StyledBreadcrumbButton,
  StyledBreadcrumbIcon,
  StyledBreadcrumbEllipsis,
};
