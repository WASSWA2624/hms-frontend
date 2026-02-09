/**
 * RolePermissionFormScreen Web Styles
 */
import styled from 'styled-components';

const StyledContainer = styled.main.withConfig({
  displayName: 'RolePermissionFormScreen_StyledContainer',
  componentId: 'RolePermissionFormScreen_StyledContainer',
})`
  flex: 1;
  width: 100%;
  min-height: 100vh;
  background-color: ${({ theme }) => theme.colors.background.primary};
  padding: ${({ theme }) => theme.spacing.xl}px;
`;

const StyledContent = styled.div.withConfig({
  displayName: 'RolePermissionFormScreen_StyledContent',
  componentId: 'RolePermissionFormScreen_StyledContent',
})`
  width: 100%;
  max-width: 560px;
  margin-left: auto;
  margin-right: auto;
`;

const StyledSection = styled.section.withConfig({
  displayName: 'RolePermissionFormScreen_StyledSection',
  componentId: 'RolePermissionFormScreen_StyledSection',
})`
  margin-top: ${({ theme }) => theme.spacing.lg}px;
`;

const StyledActions = styled.div.withConfig({
  displayName: 'RolePermissionFormScreen_StyledActions',
  componentId: 'RolePermissionFormScreen_StyledActions',
})`
  display: flex;
  gap: ${({ theme }) => theme.spacing.sm}px;
  margin-top: ${({ theme }) => theme.spacing.xl}px;
`;

export { StyledContainer, StyledContent, StyledSection, StyledActions };
