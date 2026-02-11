/**
 * RolePermissionFormScreen iOS Styles
 */
import styled from 'styled-components/native';

const StyledContainer = styled.View.withConfig({
  displayName: 'RolePermissionFormScreen_StyledContainer',
  componentId: 'RolePermissionFormScreen_StyledContainer',
})`
  flex: 1;
  width: 100%;
  min-height: 100%;
  background-color: ${({ theme }) => theme.colors.background.primary};
`;

const StyledContent = styled.View.withConfig({
  displayName: 'RolePermissionFormScreen_StyledContent',
  componentId: 'RolePermissionFormScreen_StyledContent',
})`
  width: 100%;
  flex: 1;
`;

const StyledInlineStates = styled.View.withConfig({
  displayName: 'RolePermissionFormScreen_StyledInlineStates',
  componentId: 'RolePermissionFormScreen_StyledInlineStates',
})`
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm}px;
`;

const StyledFormGrid = styled.View.withConfig({
  displayName: 'RolePermissionFormScreen_StyledFormGrid',
  componentId: 'RolePermissionFormScreen_StyledFormGrid',
})`
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md}px;
`;

const StyledFieldGroup = styled.View.withConfig({
  displayName: 'RolePermissionFormScreen_StyledFieldGroup',
  componentId: 'RolePermissionFormScreen_StyledFieldGroup',
})`
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs}px;
`;

const StyledFullRow = styled.View.withConfig({
  displayName: 'RolePermissionFormScreen_StyledFullRow',
  componentId: 'RolePermissionFormScreen_StyledFullRow',
})``;

const StyledHelperStack = styled.View.withConfig({
  displayName: 'RolePermissionFormScreen_StyledHelperStack',
  componentId: 'RolePermissionFormScreen_StyledHelperStack',
})`
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm}px;
`;

const StyledActions = styled.View.withConfig({
  displayName: 'RolePermissionFormScreen_StyledActions',
  componentId: 'RolePermissionFormScreen_StyledActions',
})`
  flex-direction: row;
  align-items: center;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing.sm}px;
`;

export {
  StyledContainer,
  StyledContent,
  StyledInlineStates,
  StyledFormGrid,
  StyledFieldGroup,
  StyledFullRow,
  StyledHelperStack,
  StyledActions,
};
