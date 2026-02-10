/**
 * SettingsScreen Web Styles
 * Align with AppFrame scroll: no internal scroll container.
 */
import styled from 'styled-components';

export const StyledContainer = styled.main.withConfig({
  displayName: 'StyledContainer',
  componentId: 'SettingsScreen_StyledContainer',
})`
  display: flex;
  flex-direction: column;
  flex: 1;
  min-height: 100%;
  min-width: 0;
  width: 100%;
  background-color: ${({ theme }) => theme.colors.background.primary};
`;

export const StyledContent = styled.div.withConfig({
  displayName: 'StyledContent',
  componentId: 'SettingsScreen_StyledContent',
})`
  flex: 1;
  width: 100%;
  max-width: 100%;
  margin-left: auto;
  margin-right: auto;
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.lg}px;
`;
