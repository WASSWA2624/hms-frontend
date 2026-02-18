/**
 * FacilitySelectionScreen Web Styles
 */
import styled from 'styled-components';

const StyledContainer = styled.section.withConfig({
  displayName: 'StyledContainer',
  componentId: 'FacilitySelectionScreen_StyledContainer',
})`
  width: 100%;
  max-width: ${({ theme }) => theme.spacing.xxl * 16}px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md}px;
`;

const StyledSummary = styled.div.withConfig({
  displayName: 'StyledSummary',
  componentId: 'FacilitySelectionScreen_StyledSummary',
})`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs}px;
  padding: ${({ theme }) => theme.spacing.sm}px;
  border-radius: ${({ theme }) => theme.radius.md}px;
  background-color: ${({ theme }) => theme.colors.surface.secondary};
`;

const StyledForm = styled.form.withConfig({
  displayName: 'StyledForm',
  componentId: 'FacilitySelectionScreen_StyledForm',
})`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm}px;
`;

const StyledField = styled.div.withConfig({
  displayName: 'StyledField',
  componentId: 'FacilitySelectionScreen_StyledField',
})`
  width: 100%;
`;

const StyledActions = styled.div.withConfig({
  displayName: 'StyledActions',
  componentId: 'FacilitySelectionScreen_StyledActions',
})`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs}px;
  margin-top: ${({ theme }) => theme.spacing.xs}px;
`;

const StyledStatus = styled.div.withConfig({
  displayName: 'StyledStatus',
  componentId: 'FacilitySelectionScreen_StyledStatus',
})`
  margin-top: ${({ theme }) => theme.spacing.xs}px;
`;

export {
  StyledActions,
  StyledContainer,
  StyledField,
  StyledForm,
  StyledStatus,
  StyledSummary,
};
