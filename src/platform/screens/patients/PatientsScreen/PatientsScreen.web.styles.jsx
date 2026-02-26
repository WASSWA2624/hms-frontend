import styled from 'styled-components';

const StyledContainer = styled.main.withConfig({
  displayName: 'PatientsScreen_StyledContainer',
  componentId: 'PatientsScreen_StyledContainer',
})`
  display: flex;
  flex-direction: column;
  flex: 1;
  min-height: 0;
  min-width: 0;
  height: 100%;
  width: 100%;
  overflow: hidden;
  background-color: ${({ theme }) => theme.colors.background.primary};
`;

const StyledContent = styled.div.withConfig({
  displayName: 'PatientsScreen_StyledContent',
  componentId: 'PatientsScreen_StyledContent',
})`
  flex: 1;
  min-height: 0;
  width: 100%;
  max-width: 1240px;
  margin-left: auto;
  margin-right: auto;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  overflow-x: hidden;
  scrollbar-gutter: stable;
  padding: ${({ theme }) => theme.spacing.sm}px ${({ theme }) => theme.spacing.md}px
    ${({ theme }) => theme.spacing.lg}px;
  gap: ${({ theme }) => theme.spacing.lg}px;
`;

const StyledModuleNavigation = styled.div.withConfig({
  displayName: 'PatientsScreen_StyledModuleNavigation',
  componentId: 'PatientsScreen_StyledModuleNavigation',
})`
  width: 100%;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border.light};
  padding: ${({ theme }) => theme.spacing.sm}px ${({ theme }) => theme.spacing.md}px;
  display: flex;
  justify-content: center;
`;

const StyledModuleNavigationRail = styled.div.withConfig({
  displayName: 'PatientsScreen_StyledModuleNavigationRail',
  componentId: 'PatientsScreen_StyledModuleNavigationRail',
})`
  width: 100%;
  max-width: 1240px;
  display: flex;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing.sm}px;
`;

export {
  StyledContainer,
  StyledContent,
  StyledModuleNavigation,
  StyledModuleNavigationRail,
};
