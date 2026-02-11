/**
 * UserMfaFormScreen iOS Styles
 */
import styled from 'styled-components/native';

const StyledContainer = styled.View.withConfig({
  displayName: 'UserMfaFormScreen_StyledContainer',
  componentId: 'UserMfaFormScreen_StyledContainer',
})`
  flex: 1;
  width: 100%;
  min-height: 100%;
  background-color: ${({ theme }) => theme.colors.background.primary};
`;

const StyledContent = styled.View.withConfig({
  displayName: 'UserMfaFormScreen_StyledContent',
  componentId: 'UserMfaFormScreen_StyledContent',
})`
  flex: 1;
  width: 100%;
  gap: ${({ theme }) => theme.spacing.lg}px;
`;

const StyledInlineStates = styled.View.withConfig({
  displayName: 'UserMfaFormScreen_StyledInlineStates',
  componentId: 'UserMfaFormScreen_StyledInlineStates',
})`
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm}px;
`;

const StyledFormGrid = styled.View.withConfig({
  displayName: 'UserMfaFormScreen_StyledFormGrid',
  componentId: 'UserMfaFormScreen_StyledFormGrid',
})`
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md}px;
`;

const StyledFieldGroup = styled.View.withConfig({
  displayName: 'UserMfaFormScreen_StyledFieldGroup',
  componentId: 'UserMfaFormScreen_StyledFieldGroup',
})`
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs}px;
`;

const StyledFullRow = styled.View.withConfig({
  displayName: 'UserMfaFormScreen_StyledFullRow',
  componentId: 'UserMfaFormScreen_StyledFullRow',
})``;

const StyledHelperStack = styled.View.withConfig({
  displayName: 'UserMfaFormScreen_StyledHelperStack',
  componentId: 'UserMfaFormScreen_StyledHelperStack',
})`
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm}px;
`;

const StyledActions = styled.View.withConfig({
  displayName: 'UserMfaFormScreen_StyledActions',
  componentId: 'UserMfaFormScreen_StyledActions',
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
