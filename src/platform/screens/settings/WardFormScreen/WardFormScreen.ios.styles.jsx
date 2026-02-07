/**
 * WardFormScreen iOS Styles
 */
import styled from 'styled-components/native';

const StyledContainer = styled.View.withConfig({
  displayName: 'WardFormScreen_StyledContainer',
  componentId: 'WardFormScreen_StyledContainer',
})`
  flex: 1;
  width: 100%;
  min-height: 100%;
  background-color: ${({ theme }) => theme.colors.background.primary};
  padding: ${({ theme }) => theme.spacing.xl}px;
`;

const StyledContent = styled.View.withConfig({
  displayName: 'WardFormScreen_StyledContent',
  componentId: 'WardFormScreen_StyledContent',
})`
  width: 100%;
  max-width: 600px;
  align-self: center;
`;

const StyledSection = styled.View.withConfig({
  displayName: 'WardFormScreen_StyledSection',
  componentId: 'WardFormScreen_StyledSection',
})`
  margin-top: ${({ theme }) => theme.spacing.lg}px;
`;

const StyledActions = styled.View.withConfig({
  displayName: 'WardFormScreen_StyledActions',
  componentId: 'WardFormScreen_StyledActions',
})`
  flex-direction: row;
  gap: ${({ theme }) => theme.spacing.sm}px;
  margin-top: ${({ theme }) => theme.spacing.xl}px;
`;

export { StyledContainer, StyledContent, StyledSection, StyledActions };
