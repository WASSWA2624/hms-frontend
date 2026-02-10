/**
 * DepartmentFormScreen Android Styles
 */
import styled from 'styled-components/native';

const StyledContainer = styled.View.withConfig({
  displayName: 'DepartmentFormScreen_StyledContainer',
  componentId: 'DepartmentFormScreen_StyledContainer',
})`
  flex: 1;
  width: 100%;
  min-height: 100%;
  background-color: ${({ theme }) => theme.colors.background.primary};
`;

const StyledContent = styled.View.withConfig({
  displayName: 'DepartmentFormScreen_StyledContent',
  componentId: 'DepartmentFormScreen_StyledContent',
})`
  flex: 1;
  width: 100%;
  gap: ${({ theme }) => theme.spacing.md}px;
`;

const StyledInlineStates = styled.View.withConfig({
  displayName: 'DepartmentFormScreen_StyledInlineStates',
  componentId: 'DepartmentFormScreen_StyledInlineStates',
})`
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm}px;
`;

const StyledFormGrid = styled.View.withConfig({
  displayName: 'DepartmentFormScreen_StyledFormGrid',
  componentId: 'DepartmentFormScreen_StyledFormGrid',
})`
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md}px;
`;

const StyledFieldGroup = styled.View.withConfig({
  displayName: 'DepartmentFormScreen_StyledFieldGroup',
  componentId: 'DepartmentFormScreen_StyledFieldGroup',
})`
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs}px;
`;

const StyledFullRow = styled.View.withConfig({
  displayName: 'DepartmentFormScreen_StyledFullRow',
  componentId: 'DepartmentFormScreen_StyledFullRow',
})``;

const StyledActions = styled.View.withConfig({
  displayName: 'DepartmentFormScreen_StyledActions',
  componentId: 'DepartmentFormScreen_StyledActions',
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
  StyledActions,
};
