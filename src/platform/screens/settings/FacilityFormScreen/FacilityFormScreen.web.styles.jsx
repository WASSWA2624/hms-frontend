/**
 * FacilityFormScreen Web Styles
 * File: FacilityFormScreen.web.styles.jsx
 */
import styled from 'styled-components';

const getTablet = (theme) => theme.breakpoints?.tablet ?? 768;

const StyledContainer = styled.main.withConfig({
  displayName: 'FacilityFormScreen_StyledContainer',
  componentId: 'FacilityFormScreen_StyledContainer',
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
  displayName: 'FacilityFormScreen_StyledContent',
  componentId: 'FacilityFormScreen_StyledContent',
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
  displayName: 'FacilityFormScreen_StyledInlineStates',
  componentId: 'FacilityFormScreen_StyledInlineStates',
})`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm}px;
`;

const StyledFormGrid = styled.div.withConfig({
  displayName: 'FacilityFormScreen_StyledFormGrid',
  componentId: 'FacilityFormScreen_StyledFormGrid',
})`
  display: grid;
  grid-template-columns: 1fr;
  gap: ${({ theme }) => theme.spacing.md}px;

  @media (min-width: ${({ theme }) => getTablet(theme)}px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
`;

const StyledFieldGroup = styled.div.withConfig({
  displayName: 'FacilityFormScreen_StyledFieldGroup',
  componentId: 'FacilityFormScreen_StyledFieldGroup',
})`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs}px;
`;

const StyledFullRow = styled.div.withConfig({
  displayName: 'FacilityFormScreen_StyledFullRow',
  componentId: 'FacilityFormScreen_StyledFullRow',
})`
  grid-column: 1 / -1;
`;

const StyledHelperStack = styled.div.withConfig({
  displayName: 'FacilityFormScreen_StyledHelperStack',
  componentId: 'FacilityFormScreen_StyledHelperStack',
})`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm}px;
`;

const StyledActions = styled.div.withConfig({
  displayName: 'FacilityFormScreen_StyledActions',
  componentId: 'FacilityFormScreen_StyledActions',
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
