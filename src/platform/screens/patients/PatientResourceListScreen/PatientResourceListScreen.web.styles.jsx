import styled from 'styled-components';

const getTablet = (theme) => theme.breakpoints?.tablet ?? 768;

const StyledContainer = styled.main.withConfig({
  displayName: 'PatientResourceListScreen_StyledContainer',
  componentId: 'PatientResourceListScreen_StyledContainer',
})`
  display: flex;
  flex-direction: column;
  width: 100%;
  min-height: 100%;
  background-color: ${({ theme }) => theme.colors.background.primary};
`;

const StyledContent = styled.div.withConfig({
  displayName: 'PatientResourceListScreen_StyledContent',
  componentId: 'PatientResourceListScreen_StyledContent',
})`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.lg}px;
`;

const StyledToolbar = styled.div.withConfig({
  displayName: 'PatientResourceListScreen_StyledToolbar',
  componentId: 'PatientResourceListScreen_StyledToolbar',
})`
  display: flex;
  flex-direction: column;
  align-items: stretch;

  @media (min-width: ${({ theme }) => getTablet(theme)}px) {
    flex-direction: row;
    justify-content: flex-end;
  }
`;

const StyledToolbarActions = styled.div.withConfig({
  displayName: 'PatientResourceListScreen_StyledToolbarActions',
  componentId: 'PatientResourceListScreen_StyledToolbarActions',
})`
  display: flex;
  align-items: center;
  justify-content: flex-end;
`;

const StyledAddButton = styled.button.withConfig({
  displayName: 'PatientResourceListScreen_StyledAddButton',
  componentId: 'PatientResourceListScreen_StyledAddButton',
})`
  display: inline-flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs}px;
  padding: ${({ theme }) => theme.spacing.xs}px ${({ theme }) => theme.spacing.sm}px;
  border-radius: ${({ theme }) => theme.radius.sm}px;
  border: 1px solid ${({ theme }) => theme.colors.background.tertiary};
  background-color: ${({ theme }) => theme.colors.background.secondary};
  color: ${({ theme }) => theme.colors.text.primary};
  cursor: pointer;

  &:disabled {
    cursor: not-allowed;
    opacity: 0.65;
  }
`;

const StyledAddLabel = styled.span.withConfig({
  displayName: 'PatientResourceListScreen_StyledAddLabel',
  componentId: 'PatientResourceListScreen_StyledAddLabel',
})`
  font-size: ${({ theme }) => theme.typography.fontSize.xs}px;
  font-family: ${({ theme }) => theme.typography.fontFamily.regular};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
`;

const StyledListBody = styled.div.withConfig({
  displayName: 'PatientResourceListScreen_StyledListBody',
  componentId: 'PatientResourceListScreen_StyledListBody',
})`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md}px;
`;

const StyledStateStack = styled.div.withConfig({
  displayName: 'PatientResourceListScreen_StyledStateStack',
  componentId: 'PatientResourceListScreen_StyledStateStack',
})`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm}px;
`;

const StyledList = styled.ul.withConfig({
  displayName: 'PatientResourceListScreen_StyledList',
  componentId: 'PatientResourceListScreen_StyledList',
})`
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
`;

export {
  StyledAddButton,
  StyledAddLabel,
  StyledContainer,
  StyledContent,
  StyledList,
  StyledListBody,
  StyledStateStack,
  StyledToolbar,
  StyledToolbarActions,
};
