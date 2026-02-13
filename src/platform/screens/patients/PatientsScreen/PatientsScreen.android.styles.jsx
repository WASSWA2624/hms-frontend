import styled from 'styled-components/native';

const StyledContainer = styled.View.withConfig({
  displayName: 'PatientsScreen_StyledContainer',
  componentId: 'PatientsScreen_StyledContainer',
})`
  flex: 1;
  flex-direction: column;
  background-color: ${({ theme }) => theme.colors.background.primary};
`;

const StyledContent = styled.View.withConfig({
  displayName: 'PatientsScreen_StyledContent',
  componentId: 'PatientsScreen_StyledContent',
})`
  flex: 1;
  min-width: 0;
`;

export { StyledContainer, StyledContent };
