/**
 * DepartmentFormScreen Web Styles
 * File: DepartmentFormScreen.web.styles.jsx
 */
import styled from 'styled-components';

const getTablet = (theme) => theme.breakpoints?.tablet ?? 768;

const StyledContainer = styled.main.withConfig({
  displayName: 'DepartmentFormScreen_StyledContainer',
  componentId: 'DepartmentFormScreen_StyledContainer',
})`
  display: flex;
  flex-direction: column;
  width: 100%;
  min-height: 100%;
  background-color: ${({ theme }) => theme.colors.background.primary};
  padding: 0;
  box-sizing: border-box;
`;

const StyledContent = styled.div.withConfig({
  displayName: 'DepartmentFormScreen_StyledContent',
  componentId: 'DepartmentFormScreen_StyledContent',
})`
  flex: 1;
  width: 100%;
  max-width: 100%;
  margin-left: auto;
  margin-right: auto;
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md}px;
`;

const StyledInlineStates = styled.div.withConfig({
  displayName: 'DepartmentFormScreen_StyledInlineStates',
  componentId: 'DepartmentFormScreen_StyledInlineStates',
})`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm}px;
`;

const StyledFormGrid = styled.div.withConfig({
  displayName: 'DepartmentFormScreen_StyledFormGrid',
  componentId: 'DepartmentFormScreen_StyledFormGrid',
})`
  display: grid;
  grid-template-columns: 1fr;
  gap: ${({ theme }) => theme.spacing.md}px;

  @media (min-width: ${({ theme }) => getTablet(theme)}px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
`;

const StyledFieldGroup = styled.div.withConfig({
  displayName: 'DepartmentFormScreen_StyledFieldGroup',
  componentId: 'DepartmentFormScreen_StyledFieldGroup',
})`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs}px;
`;

const StyledFullRow = styled.div.withConfig({
  displayName: 'DepartmentFormScreen_StyledFullRow',
  componentId: 'DepartmentFormScreen_StyledFullRow',
})`
  grid-column: 1 / -1;
`;

const StyledHelperStack = styled.div.withConfig({
  displayName: 'DepartmentFormScreen_StyledHelperStack',
  componentId: 'DepartmentFormScreen_StyledHelperStack',
})`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm}px;
`;

const StyledActions = styled.div.withConfig({
  displayName: 'DepartmentFormScreen_StyledActions',
  componentId: 'DepartmentFormScreen_StyledActions',
})`
  display: flex;
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
