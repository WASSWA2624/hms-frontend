/**
 * GlobalHeader Component Styles - Web
 * Styled-components for GlobalHeader web implementation
 * File: GlobalHeader.web.styles.jsx
 */
import styled from 'styled-components';

const MIN_TOUCH_TARGET = ({ theme }) => theme.spacing.xxl - theme.spacing.xs;

const StyledHeader = styled.header.withConfig({
  displayName: 'StyledHeader',
  componentId: 'StyledHeader',
})`
  background-color: ${({ theme }) => theme.colors.background.primary};
  border-bottom: 1px solid ${({ theme }) => theme.colors.background.tertiary};
  padding: ${({ theme }) => theme.spacing.xs}px ${({ theme }) => theme.spacing.sm}px;
  min-height: ${({ theme }) => theme.spacing.lg}px;
  position: sticky;
  top: 0;
  z-index: 1000;
  box-shadow: ${({ theme }) => {
    const s = theme.shadows?.sm;
    if (!s) return '0 1px 2px rgba(0, 0, 0, 0.04)';
    return `${s.shadowOffset?.width ?? 0}px ${s.shadowOffset?.height ?? 1}px ${s.shadowRadius ?? 2}px rgba(0, 0, 0, ${s.shadowOpacity ?? 0.1})`;
  }};
  display: flex;
  flex-direction: column;
  justify-content: center;

  @media (min-width: ${({ theme }) => theme.breakpoints.tablet}px) and (max-width: ${({ theme }) => theme.breakpoints.desktop - 1}px) {
    min-height: ${({ theme }) => theme.spacing.lg}px;
    padding: ${({ theme }) => theme.spacing.xs}px ${({ theme }) => theme.spacing.sm}px;
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet - 1}px) {
    min-height: ${({ theme }) => theme.spacing.lg}px;
    padding: ${({ theme }) => theme.spacing.xs}px ${({ theme }) => theme.spacing.sm}px;
  }
`;

const StyledHeaderRow = styled.div.withConfig({
  displayName: 'StyledHeaderRow',
  componentId: 'StyledHeaderRow',
})`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing.sm}px;
  width: 100%;
  flex-wrap: nowrap;
  min-width: 0;

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet - 1}px) {
    gap: ${({ theme }) => theme.spacing.xs}px;
  }
`;

const StyledCenterSlot = styled.div.withConfig({
  displayName: 'StyledCenterSlot',
  componentId: 'StyledCenterSlot',
})`
  display: none;

  @media (min-width: ${({ theme }) => theme.breakpoints.desktop}px) {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    display: inline-flex;
    align-items: center;
    justify-content: center;
    z-index: 1;
  }
`;

const StyledLeadingSlot = styled.div.withConfig({
  displayName: 'StyledLeadingSlot',
  componentId: 'StyledLeadingSlot',
})`
  display: inline-flex;
  align-items: center;
  flex: 0 0 auto;
`;

const StyledTitleGroup = styled.div.withConfig({
  displayName: 'StyledTitleGroup',
  componentId: 'StyledTitleGroup',
})`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm}px;
  flex: 1;
  min-width: 0;
  flex-wrap: nowrap;
  overflow: visible;
`;

const StyledTitleBlock = styled.div.withConfig({
  displayName: 'StyledTitleBlock',
  componentId: 'StyledTitleBlock',
})`
  display: flex;
  flex-direction: column;
  gap: 0;
  min-width: 0;
  overflow: hidden;
`;

const StyledActionsGroup = styled.div.withConfig({
  displayName: 'StyledActionsGroup',
  componentId: 'StyledActionsGroup',
})`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs}px;
  flex-wrap: nowrap;
  flex-shrink: 0;
`;

const StyledUtilityGroup = styled.div.withConfig({
  displayName: 'StyledUtilityGroup',
  componentId: 'StyledUtilityGroup',
})`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs}px;
  flex-wrap: nowrap;
  flex-shrink: 0;
`;

const ACTION_BUTTON_STYLE_PROPS = ['isPrimary', 'isDisabled', 'isCircular'];
const StyledActionButton = styled.button.withConfig({
  displayName: 'StyledActionButton',
  componentId: 'StyledActionButton',
  shouldForwardProp: (prop) => !ACTION_BUTTON_STYLE_PROPS.includes(prop),
})`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing.xs}px;
  padding: 0 ${({ theme }) => theme.spacing.xs}px;
  min-height: ${MIN_TOUCH_TARGET}px;
  min-width: ${MIN_TOUCH_TARGET}px;
  border-radius: ${({ theme, isCircular }) =>
    isCircular ? theme.radius.full : theme.radius.sm}px;
  border: 1px solid
    ${({ theme, isPrimary }) => (isPrimary ? theme.colors.primary : theme.colors.background.tertiary)};
  background-color: ${({ theme, isPrimary }) =>
    isPrimary ? theme.colors.primary : theme.colors.background.secondary};
  color: ${({ theme, isPrimary }) => (isPrimary ? theme.colors.text.inverse : theme.colors.text.secondary)};
  cursor: ${({ isDisabled }) => (isDisabled ? 'not-allowed' : 'pointer')};
  opacity: ${({ isDisabled }) => (isDisabled ? 0.6 : 1)};
  font-size: ${({ theme }) => theme.typography?.fontSize?.xs ?? 12}px;
  transition: background-color 0.2s ease, color 0.15s ease, border-color 0.15s ease, transform 0.1s ease;

  &:hover {
    background-color: ${({ theme, isPrimary }) =>
      isPrimary ? theme.colors.primary : theme.colors.background.tertiary};
    color: ${({ theme, isPrimary }) => (isPrimary ? theme.colors.text.inverse : theme.colors.text.primary)};
  }

  &:active {
    transform: scale(0.97);
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.primary};
    outline-offset: 2px;
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet - 1}px) {
    min-height: ${MIN_TOUCH_TARGET}px;
    min-width: ${MIN_TOUCH_TARGET}px;
    padding: 0 ${({ theme }) => theme.spacing.xs}px;
    font-size: ${({ theme }) => theme.typography?.fontSize?.xs ?? 12}px;
    border-radius: ${({ theme }) => theme.radius?.full ?? 9999}px;
    border: none;

    &:active {
      transform: scale(0.94);
    }
  }
`;

const StyledActionIcon = styled.span.withConfig({
  displayName: 'StyledActionIcon',
  componentId: 'StyledActionIcon',
})`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: inherit;
`;

const StyledBreadcrumbsRow = styled.nav.withConfig({
  displayName: 'StyledBreadcrumbsRow',
  componentId: 'StyledBreadcrumbsRow',
})`
  margin-top: ${({ theme }) => theme.spacing.xs}px;
  padding-top: ${({ theme }) => theme.spacing.xs}px;
  border-top: 1px solid ${({ theme }) => theme.colors.background.tertiary};
  width: 100%;
`;

export {
  StyledHeader,
  StyledHeaderRow,
  StyledLeadingSlot,
  StyledCenterSlot,
  StyledTitleGroup,
  StyledTitleBlock,
  StyledActionsGroup,
  StyledUtilityGroup,
  StyledActionButton,
  StyledActionIcon,
  StyledBreadcrumbsRow,
};
