/**
 * SettingsScreen Android Styles
 * Per component-structure.mdc: withConfig displayName + componentId
 */
import styled from 'styled-components/native';

export const StyledContainer = styled.View.withConfig({
  displayName: 'StyledContainer',
  componentId: 'SettingsScreen_StyledContainer',
})`
  flex: 1;
  flex-direction: column;
  background-color: ${({ theme }) => theme.colors.background.primary};
`;

export const StyledContent = styled.View.withConfig({
  displayName: 'StyledContent',
  componentId: 'SettingsScreen_StyledContent',
})`
  flex: 1;
  min-width: 0;
`;
