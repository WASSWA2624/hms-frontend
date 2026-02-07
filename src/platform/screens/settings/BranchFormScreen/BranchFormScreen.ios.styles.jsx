/**
 * BranchFormScreen iOS Styles
 */
import styled from 'styled-components/native';

const StyledContainer = styled.View.withConfig({
  displayName: 'BranchFormScreen_StyledContainer',
  componentId: 'BranchFormScreen_StyledContainer',
})`
  flex: 1;
  width: 100%;
  min-height: 100%;
  background-color: ${({ theme }) => theme.colors.background.primary};
  padding: ${({ theme }) => theme.spacing.xl}px;
`;

const StyledContent = styled.View.withConfig({
  displayName: 'BranchFormScreen_StyledContent',
  componentId: 'BranchFormScreen_StyledContent',
})`
  width: 100%;
  max-width: 600px;
  align-self: center;
`;

const StyledSection = styled.View.withConfig({
  displayName: 'BranchFormScreen_StyledSection',
  componentId: 'BranchFormScreen_StyledSection',
})`
  margin-top: ${({ theme }) => theme.spacing.lg}px;
`;

const StyledActions = styled.View.withConfig({
  displayName: 'BranchFormScreen_StyledActions',
  componentId: 'BranchFormScreen_StyledActions',
})`
  flex-direction: row;
  gap: ${({ theme }) => theme.spacing.sm}px;
  margin-top: ${({ theme }) => theme.spacing.xl}px;
`;

export { StyledContainer, StyledContent, StyledSection, StyledActions };
