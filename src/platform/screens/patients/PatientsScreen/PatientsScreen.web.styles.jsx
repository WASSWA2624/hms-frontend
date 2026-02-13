import styled from 'styled-components';

const StyledContainer = styled.main.withConfig({
  displayName: 'PatientsScreen_StyledContainer',
  componentId: 'PatientsScreen_StyledContainer',
})`
  display: flex;
  flex-direction: column;
  flex: 1;
  min-height: 100%;
  min-width: 0;
  width: 100%;
  background-color: ${({ theme }) => theme.colors.background.primary};
`;

const StyledContent = styled.div.withConfig({
  displayName: 'PatientsScreen_StyledContent',
  componentId: 'PatientsScreen_StyledContent',
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

export { StyledContainer, StyledContent };
