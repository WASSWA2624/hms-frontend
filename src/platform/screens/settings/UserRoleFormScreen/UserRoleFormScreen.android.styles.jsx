/**
 * UserRoleFormScreen Android Styles
 */
import styled from 'styled-components/native';

const StyledContainer = styled.View.withConfig({
  displayName: 'UserRoleFormScreen_StyledContainer',
  componentId: 'UserRoleFormScreen_StyledContainer',
})`
  flex: 1;
  width: 100%;
  min-height: 100%;
  background-color: ${({ theme }) => theme.colors.background.primary};
`;

const StyledContent = styled.View.withConfig({
  displayName: 'UserRoleFormScreen_StyledContent',
  componentId: 'UserRoleFormScreen_StyledContent',
})`
  flex: 1;
  width: 100%;
  gap: ${({ theme }) => theme.spacing.lg}px;
`;

const StyledInlineStates = styled.View.withConfig({
  displayName: 'UserRoleFormScreen_StyledInlineStates',
  componentId: 'UserRoleFormScreen_StyledInlineStates',
})`
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm}px;
`;

const StyledFormGrid = styled.View.withConfig({
  displayName: 'UserRoleFormScreen_StyledFormGrid',
  componentId: 'UserRoleFormScreen_StyledFormGrid',
})`
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md}px;
`;

const StyledFieldGroup = styled.View.withConfig({
  displayName: 'UserRoleFormScreen_StyledFieldGroup',
  componentId: 'UserRoleFormScreen_StyledFieldGroup',
})`
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs}px;
`;

const StyledFullRow = styled.View.withConfig({
  displayName: 'UserRoleFormScreen_StyledFullRow',
  componentId: 'UserRoleFormScreen_StyledFullRow',
})`
  width: 100%;
`;

const StyledHelperStack = styled.View.withConfig({
  displayName: 'UserRoleFormScreen_StyledHelperStack',
  componentId: 'UserRoleFormScreen_StyledHelperStack',
})`
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm}px;
`;

const StyledActions = styled.View.withConfig({
  displayName: 'UserRoleFormScreen_StyledActions',
  componentId: 'UserRoleFormScreen_StyledActions',
})`
  flex-direction: row;
  gap: ${({ theme }) => theme.spacing.sm}px;
  flex-wrap: wrap;
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
