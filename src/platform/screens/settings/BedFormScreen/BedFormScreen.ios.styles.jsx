/**
 * BedFormScreen iOS Styles
 */
import styled from 'styled-components/native';

const StyledContainer = styled.View.withConfig({
  displayName: 'BedFormScreen_StyledContainer',
  componentId: 'BedFormScreen_StyledContainer',
})`
  flex: 1;
  width: 100%;
  min-height: 100%;
  background-color: ${({ theme }) => theme.colors.background.primary};
`;

const StyledContent = styled.View.withConfig({
  displayName: 'BedFormScreen_StyledContent',
  componentId: 'BedFormScreen_StyledContent',
})`
  flex: 1;
  width: 100%;
  gap: ${({ theme }) => theme.spacing.md}px;
`;

const StyledInlineStates = styled.View.withConfig({
  displayName: 'BedFormScreen_StyledInlineStates',
  componentId: 'BedFormScreen_StyledInlineStates',
})`
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm}px;
`;

const StyledFormGrid = styled.View.withConfig({
  displayName: 'BedFormScreen_StyledFormGrid',
  componentId: 'BedFormScreen_StyledFormGrid',
})`
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md}px;
`;

const StyledFieldGroup = styled.View.withConfig({
  displayName: 'BedFormScreen_StyledFieldGroup',
  componentId: 'BedFormScreen_StyledFieldGroup',
})`
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs}px;
`;

const StyledFullRow = styled.View.withConfig({
  displayName: 'BedFormScreen_StyledFullRow',
  componentId: 'BedFormScreen_StyledFullRow',
})``;

const StyledHelperStack = styled.View.withConfig({
  displayName: 'BedFormScreen_StyledHelperStack',
  componentId: 'BedFormScreen_StyledHelperStack',
})`
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm}px;
`;

const StyledActions = styled.View.withConfig({
  displayName: 'BedFormScreen_StyledActions',
  componentId: 'BedFormScreen_StyledActions',
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
