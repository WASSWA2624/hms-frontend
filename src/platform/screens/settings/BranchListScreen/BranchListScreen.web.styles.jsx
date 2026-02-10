/**
 * BranchListScreen Web Styles
 * File: BranchListScreen.web.styles.jsx
 */
import styled from 'styled-components';

const getTablet = (theme) => theme.breakpoints?.tablet ?? 768;

const StyledContainer = styled.main.withConfig({
  displayName: 'StyledContainer',
  componentId: 'StyledContainer',
})`
  display: flex;
  flex-direction: column;
  width: 100%;
  min-height: 100%;
  background-color: ${({ theme }) => theme.colors.background.primary};
  padding: 0;
  box-sizing: border-box;
`;

const StyledContent = styled.div.withConfig({
  displayName: 'StyledContent',
  componentId: 'StyledContent',
})`
  flex: 1;
  width: 100%;
  max-width: 100%;
  margin-left: auto;
  margin-right: auto;
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.lg}px;
`;

const StyledToolbar = styled.div.withConfig({
  displayName: 'StyledToolbar',
  componentId: 'StyledToolbar',
})`
  display: flex;
  flex-direction: column;
  align-items: stretch;
  gap: ${({ theme }) => theme.spacing.sm}px;

  @media (min-width: ${({ theme }) => getTablet(theme)}px) {
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
  }
`;

const StyledSearchSlot = styled.div.withConfig({
  displayName: 'StyledSearchSlot',
  componentId: 'StyledSearchSlot',
})`
  flex: 1;
  min-width: 0;
`;

const StyledToolbarActions = styled.div.withConfig({
  displayName: 'StyledToolbarActions',
  componentId: 'StyledToolbarActions',
})`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: ${({ theme }) => theme.spacing.sm}px;
  flex-wrap: wrap;
`;

const StyledAddButton = styled.button.withConfig({
  displayName: 'StyledAddButton',
  componentId: 'StyledAddButton',
})`
  display: inline-flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs}px;
  padding: ${({ theme }) => theme.spacing.xs}px ${({ theme }) => theme.spacing.sm}px;
  min-height: 32px;
  border-radius: ${({ theme }) => theme.radius.sm}px;
  border: 1px solid ${({ theme }) => theme.colors.background.tertiary};
  background-color: ${({ theme }) => theme.colors.background.secondary};
  color: ${({ theme }) => theme.colors.text.primary};
  cursor: pointer;

  &:hover {
    background-color: ${({ theme }) => theme.colors.background.tertiary};
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.primary};
    outline-offset: 2px;
  }
`;

const StyledAddLabel = styled.span.withConfig({
  displayName: 'StyledAddLabel',
  componentId: 'StyledAddLabel',
})`
  font-family: ${({ theme }) => theme.typography.fontFamily.regular};
  font-size: ${({ theme }) => theme.typography.fontSize.xs}px;
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  line-height: ${({ theme }) => theme.typography.fontSize.xs * theme.typography.lineHeight.normal}px;
  color: ${({ theme }) => theme.colors.text.primary};
`;

const StyledListBody = styled.div.withConfig({
  displayName: 'StyledListBody',
  componentId: 'StyledListBody',
})`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md}px;
  width: 100%;
`;

const StyledStateStack = styled.div.withConfig({
  displayName: 'StyledStateStack',
  componentId: 'StyledStateStack',
})`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm}px;
`;

const StyledList = styled.ul.withConfig({
  displayName: 'StyledList',
  componentId: 'StyledList',
})`
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
`;

export {
  StyledContainer,
  StyledContent,
  StyledToolbar,
  StyledSearchSlot,
  StyledToolbarActions,
  StyledAddButton,
  StyledAddLabel,
  StyledListBody,
  StyledStateStack,
  StyledList,
};
