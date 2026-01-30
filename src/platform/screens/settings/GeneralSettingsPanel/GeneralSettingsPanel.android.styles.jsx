/**
 * GeneralSettingsPanel Android Styles
 */
import styled from 'styled-components/native';

export const StyledPanel = styled.View.withConfig({
  displayName: 'StyledPanel',
  componentId: 'GeneralSettingsPanel_StyledPanel',
})`
  flex: 1;
  padding: ${({ theme }) => theme.spacing.lg}px;
  background-color: ${({ theme }) => theme.colors.background.primary};
`;

export const StyledSection = styled.View.withConfig({
  displayName: 'StyledSection',
  componentId: 'GeneralSettingsPanel_StyledSection',
})`
  margin-bottom: ${({ theme }) => theme.spacing.xl}px;
`;

export const StyledControlsRow = styled.View.withConfig({
  displayName: 'StyledControlsRow',
  componentId: 'GeneralSettingsPanel_StyledControlsRow',
})`
  flex-direction: row;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing.lg}px;
  margin-top: ${({ theme }) => theme.spacing.md}px;
  align-items: flex-start;
`;
