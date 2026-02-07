/**
 * WardFormScreen Web Styles
 */
import styled from 'styled-components';

const StyledContainer = styled.main.withConfig({
  displayName: 'WardFormScreen_StyledContainer',
  componentId: 'WardFormScreen_StyledContainer',
})`
  flex: 1;
  width: 100%;
  min-height: 100vh;
  background-color: ${({ theme }) => theme.colors.background.primary};
  padding: ${({ theme }) => theme.spacing.xl}px;
`;

const StyledContent = styled.div.withConfig({
  displayName: 'WardFormScreen_StyledContent',
  componentId: 'WardFormScreen_StyledContent',
})`
  width: 100%;
  max-width: 560px;
  margin-left: auto;
  margin-right: auto;
`;

const StyledSection = styled.section.withConfig({
  displayName: 'WardFormScreen_StyledSection',
  componentId: 'WardFormScreen_StyledSection',
})`
  margin-top: ${({ theme }) => theme.spacing.lg}px;
`;

const StyledActions = styled.div.withConfig({
  displayName: 'WardFormScreen_StyledActions',
  componentId: 'WardFormScreen_StyledActions',
})`
  display: flex;
  gap: ${({ theme }) => theme.spacing.sm}px;
  margin-top: ${({ theme }) => theme.spacing.xl}px;
`;

export { StyledContainer, StyledContent, StyledSection, StyledActions };
