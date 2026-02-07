/**
 * BranchFormScreen Web Styles
 */
import styled from 'styled-components';

const StyledContainer = styled.main.withConfig({
  displayName: 'BranchFormScreen_StyledContainer',
  componentId: 'BranchFormScreen_StyledContainer',
})`
  flex: 1;
  width: 100%;
  min-height: 100vh;
  background-color: ${({ theme }) => theme.colors.background.primary};
  padding: ${({ theme }) => theme.spacing.xl}px;
`;

const StyledContent = styled.div.withConfig({
  displayName: 'BranchFormScreen_StyledContent',
  componentId: 'BranchFormScreen_StyledContent',
})`
  width: 100%;
  max-width: 560px;
  margin-left: auto;
  margin-right: auto;
`;

const StyledSection = styled.section.withConfig({
  displayName: 'BranchFormScreen_StyledSection',
  componentId: 'BranchFormScreen_StyledSection',
})`
  margin-top: ${({ theme }) => theme.spacing.lg}px;
`;

const StyledActions = styled.div.withConfig({
  displayName: 'BranchFormScreen_StyledActions',
  componentId: 'BranchFormScreen_StyledActions',
})`
  display: flex;
  gap: ${({ theme }) => theme.spacing.sm}px;
  margin-top: ${({ theme }) => theme.spacing.xl}px;
`;

export { StyledContainer, StyledContent, StyledSection, StyledActions };
