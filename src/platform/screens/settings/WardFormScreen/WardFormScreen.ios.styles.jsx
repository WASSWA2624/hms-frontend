/**
 * WardFormScreen iOS Styles
 */
import styled from 'styled-components/native';

const StyledContainer = styled.View.withConfig({
  displayName: 'WardFormScreen_StyledContainer',
  componentId: 'WardFormScreen_StyledContainer',
})`
  flex: 1;
  width: 100%;
  min-height: 100%;
  background-color: ${({ theme }) => theme.colors.background.primary};
`;

const StyledContent = styled.View.withConfig({
  displayName: 'WardFormScreen_StyledContent',
  componentId: 'WardFormScreen_StyledContent',
})`
  flex: 1;
  width: 100%;
  gap: ${({ theme }) => theme.spacing.md}px;
`;

const StyledInlineStates = styled.View.withConfig({
  displayName: 'WardFormScreen_StyledInlineStates',
  componentId: 'WardFormScreen_StyledInlineStates',
})`
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm}px;
`;

const StyledFormGrid = styled.View.withConfig({
  displayName: 'WardFormScreen_StyledFormGrid',
  componentId: 'WardFormScreen_StyledFormGrid',
})`
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md}px;
`;

const StyledFieldGroup = styled.View.withConfig({
  displayName: 'WardFormScreen_StyledFieldGroup',
  componentId: 'WardFormScreen_StyledFieldGroup',
})`
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs}px;
`;

const StyledFullRow = styled.View.withConfig({
  displayName: 'WardFormScreen_StyledFullRow',
  componentId: 'WardFormScreen_StyledFullRow',
})``;

const StyledHelperStack = styled.View.withConfig({
  displayName: 'WardFormScreen_StyledHelperStack',
  componentId: 'WardFormScreen_StyledHelperStack',
})`
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm}px;
`;

const StyledActions = styled.View.withConfig({
  displayName: 'WardFormScreen_StyledActions',
  componentId: 'WardFormScreen_StyledActions',
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
