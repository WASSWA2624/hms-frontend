/**
 * FacilitySelectionScreen iOS Styles
 */
import styled from 'styled-components/native';

const StyledContainer = styled.View.withConfig({
  displayName: 'StyledContainer',
  componentId: 'FacilitySelectionScreenIOS_StyledContainer',
})`
  width: 100%;
  max-width: ${({ theme }) => theme.spacing.xxl * 16}px;
  align-self: center;
`;

const StyledSummary = styled.View.withConfig({
  displayName: 'StyledSummary',
  componentId: 'FacilitySelectionScreenIOS_StyledSummary',
})`
  padding: ${({ theme }) => theme.spacing.sm}px;
  border-radius: ${({ theme }) => theme.borderRadius.md}px;
  background-color: ${({ theme }) => theme.colors.surface.secondary};
  margin-bottom: ${({ theme }) => theme.spacing.sm}px;
`;

const StyledForm = styled.View.withConfig({
  displayName: 'StyledForm',
  componentId: 'FacilitySelectionScreenIOS_StyledForm',
})`
  width: 100%;
`;

const StyledField = styled.View.withConfig({
  displayName: 'StyledField',
  componentId: 'FacilitySelectionScreenIOS_StyledField',
})`
  margin-bottom: ${({ theme }) => theme.spacing.sm}px;
`;

const StyledActions = styled.View.withConfig({
  displayName: 'StyledActions',
  componentId: 'FacilitySelectionScreenIOS_StyledActions',
})`
  margin-top: ${({ theme }) => theme.spacing.xs}px;
`;

const StyledStatus = styled.View.withConfig({
  displayName: 'StyledStatus',
  componentId: 'FacilitySelectionScreenIOS_StyledStatus',
})`
  margin-top: ${({ theme }) => theme.spacing.sm}px;
`;

export {
  StyledActions,
  StyledContainer,
  StyledField,
  StyledForm,
  StyledStatus,
  StyledSummary,
};

