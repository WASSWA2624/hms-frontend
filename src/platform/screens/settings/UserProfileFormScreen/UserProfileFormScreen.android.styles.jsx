/**
 * UserProfileFormScreen Android Styles
 */
import styled from 'styled-components/native';

const StyledContainer = styled.View.withConfig({
  displayName: 'UserProfileFormScreen_StyledContainer',
  componentId: 'UserProfileFormScreen_StyledContainer',
})`
  flex: 1;
  width: 100%;
  min-height: 100%;
  background-color: ${({ theme }) => theme.colors.background.primary};
`;

const StyledContent = styled.View.withConfig({
  displayName: 'UserProfileFormScreen_StyledContent',
  componentId: 'UserProfileFormScreen_StyledContent',
})`
  flex: 1;
  width: 100%;
  gap: ${({ theme }) => theme.spacing.lg}px;
`;

const StyledInlineStates = styled.View.withConfig({
  displayName: 'UserProfileFormScreen_StyledInlineStates',
  componentId: 'UserProfileFormScreen_StyledInlineStates',
})`
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm}px;
`;

const StyledFormGrid = styled.View.withConfig({
  displayName: 'UserProfileFormScreen_StyledFormGrid',
  componentId: 'UserProfileFormScreen_StyledFormGrid',
})`
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md}px;
`;

const StyledFieldGroup = styled.View.withConfig({
  displayName: 'UserProfileFormScreen_StyledFieldGroup',
  componentId: 'UserProfileFormScreen_StyledFieldGroup',
})`
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs}px;
`;

const StyledFullRow = styled.View.withConfig({
  displayName: 'UserProfileFormScreen_StyledFullRow',
  componentId: 'UserProfileFormScreen_StyledFullRow',
})`
  width: 100%;
`;

const StyledHelperStack = styled.View.withConfig({
  displayName: 'UserProfileFormScreen_StyledHelperStack',
  componentId: 'UserProfileFormScreen_StyledHelperStack',
})`
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm}px;
`;

const StyledActions = styled.View.withConfig({
  displayName: 'UserProfileFormScreen_StyledActions',
  componentId: 'UserProfileFormScreen_StyledActions',
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
