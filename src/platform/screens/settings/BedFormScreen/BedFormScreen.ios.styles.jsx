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
  padding: ${({ theme }) => theme.spacing.xl}px;
`;

const StyledContent = styled.View.withConfig({
  displayName: 'BedFormScreen_StyledContent',
  componentId: 'BedFormScreen_StyledContent',
})`
  width: 100%;
  max-width: 600px;
  align-self: center;
`;

const StyledSection = styled.View.withConfig({
  displayName: 'BedFormScreen_StyledSection',
  componentId: 'BedFormScreen_StyledSection',
})`
  margin-top: ${({ theme }) => theme.spacing.lg}px;
`;

const StyledActions = styled.View.withConfig({
  displayName: 'BedFormScreen_StyledActions',
  componentId: 'BedFormScreen_StyledActions',
})`
  flex-direction: row;
  gap: ${({ theme }) => theme.spacing.sm}px;
  margin-top: ${({ theme }) => theme.spacing.xl}px;
`;

export { StyledContainer, StyledContent, StyledSection, StyledActions };
