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

const StyledModuleNavigation = styled.View.withConfig({
  displayName: 'PatientsScreen_StyledModuleNavigation',
  componentId: 'PatientsScreen_StyledModuleNavigation',
})`
  padding: ${({ theme }) => theme.spacing.sm}px ${({ theme }) => theme.spacing.md}px;
  border-bottom-width: 1px;
  border-bottom-color: ${({ theme }) => theme.colors.border.light};
`;

const StyledModuleNavigationRail = styled.View.withConfig({
  displayName: 'PatientsScreen_StyledModuleNavigationRail',
  componentId: 'PatientsScreen_StyledModuleNavigationRail',
})`
  flex-direction: row;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing.sm}px;
`;

export {
  StyledContainer,
  StyledContent,
  StyledModuleNavigation,
  StyledModuleNavigationRail,
};
