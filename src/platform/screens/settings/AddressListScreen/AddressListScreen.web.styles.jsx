/**
 * AddressListScreen Web Styles
 * File: AddressListScreen.web.styles.jsx
 */
import styled from 'styled-components';

const getTablet = (theme) => theme.breakpoints?.tablet ?? 768;

const StyledContainer = styled.main.withConfig({
  displayName: 'AddressListScreen_StyledContainer',
  componentId: 'AddressListScreen_StyledContainer',
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
  displayName: 'AddressListScreen_StyledContent',
  componentId: 'AddressListScreen_StyledContent',
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
  displayName: 'AddressListScreen_StyledToolbar',
  componentId: 'AddressListScreen_StyledToolbar',
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
  displayName: 'AddressListScreen_StyledSearchSlot',
  componentId: 'AddressListScreen_StyledSearchSlot',
})`
  flex: 1;
  min-width: 0;
`;

const StyledToolbarActions = styled.div.withConfig({
  displayName: 'AddressListScreen_StyledToolbarActions',
  componentId: 'AddressListScreen_StyledToolbarActions',
})`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing.sm}px;
`;

const StyledAddButton = styled.button.withConfig({
  displayName: 'AddressListScreen_StyledAddButton',
  componentId: 'AddressListScreen_StyledAddButton',
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
  displayName: 'AddressListScreen_StyledAddLabel',
  componentId: 'AddressListScreen_StyledAddLabel',
})`
  font-size: ${({ theme }) => theme.typography.fontSize.xs}px;
  font-family: ${({ theme }) => theme.typography.fontFamily.regular};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  line-height: ${({ theme }) => theme.typography.fontSize.xs * theme.typography.lineHeight.normal}px;
  color: ${({ theme }) => theme.colors.text.primary};
`;

const StyledListBody = styled.div.withConfig({
  displayName: 'AddressListScreen_StyledListBody',
  componentId: 'AddressListScreen_StyledListBody',
})`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md}px;
  width: 100%;
`;

const StyledStateStack = styled.div.withConfig({
  displayName: 'AddressListScreen_StyledStateStack',
  componentId: 'AddressListScreen_StyledStateStack',
})`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm}px;
`;

const StyledList = styled.ul.withConfig({
  displayName: 'AddressListScreen_StyledList',
  componentId: 'AddressListScreen_StyledList',
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
