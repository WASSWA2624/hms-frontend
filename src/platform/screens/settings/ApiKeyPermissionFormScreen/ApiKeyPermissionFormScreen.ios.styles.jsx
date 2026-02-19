/**
 * ApiKeyPermissionFormScreen iOS Styles
 */
import styled from 'styled-components/native';

const StyledContainer = styled.View.withConfig({
  displayName: 'ApiKeyPermissionFormScreen_StyledContainer',
  componentId: 'ApiKeyPermissionFormScreen_StyledContainer',
})`
  flex: 1;
  width: 100%;
  min-height: 100%;
  background-color: ${({ theme }) => theme.colors.background.primary};
`;

const StyledContent = styled.View.withConfig({
  displayName: 'ApiKeyPermissionFormScreen_StyledContent',
  componentId: 'ApiKeyPermissionFormScreen_StyledContent',
})`
  width: 100%;
  flex: 1;
`;

const StyledInlineStates = styled.View.withConfig({
  displayName: 'ApiKeyPermissionFormScreen_StyledInlineStates',
  componentId: 'ApiKeyPermissionFormScreen_StyledInlineStates',
})`
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm}px;
`;

const StyledFormGrid = styled.View.withConfig({
  displayName: 'ApiKeyPermissionFormScreen_StyledFormGrid',
  componentId: 'ApiKeyPermissionFormScreen_StyledFormGrid',
})`
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md}px;
`;

const StyledFieldGroup = styled.View.withConfig({
  displayName: 'ApiKeyPermissionFormScreen_StyledFieldGroup',
  componentId: 'ApiKeyPermissionFormScreen_StyledFieldGroup',
})`
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs}px;
`;

const StyledFullRow = styled.View.withConfig({
  displayName: 'ApiKeyPermissionFormScreen_StyledFullRow',
  componentId: 'ApiKeyPermissionFormScreen_StyledFullRow',
})``;

const StyledHelperStack = styled.View.withConfig({
  displayName: 'ApiKeyPermissionFormScreen_StyledHelperStack',
  componentId: 'ApiKeyPermissionFormScreen_StyledHelperStack',
})`
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm}px;
`;

const StyledActions = styled.View.withConfig({
  displayName: 'ApiKeyPermissionFormScreen_StyledActions',
  componentId: 'ApiKeyPermissionFormScreen_StyledActions',
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
