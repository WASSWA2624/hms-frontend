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

export const StyledHeader = styled.View.withConfig({
  displayName: 'StyledHeader',
  componentId: 'GeneralSettingsPanel_StyledHeader',
})`
  margin-bottom: ${({ theme }) => theme.spacing.xl}px;
`;

export const StyledSection = styled.View.withConfig({
  displayName: 'StyledSection',
  componentId: 'GeneralSettingsPanel_StyledSection',
})`
  margin-bottom: ${({ theme }) => theme.spacing.xl}px;
`;

export const StyledSectionHeader = styled.View.withConfig({
  displayName: 'StyledSectionHeader',
  componentId: 'GeneralSettingsPanel_StyledSectionHeader',
})`
  margin-bottom: ${({ theme }) => theme.spacing.md}px;
`;

export const StyledCard = styled.View.withConfig({
  displayName: 'StyledCard',
  componentId: 'GeneralSettingsPanel_StyledCard',
})`
  padding: ${({ theme }) => theme.spacing.lg}px;
  border-radius: ${({ theme }) => theme.radius.md}px;
  border-width: 1px;
  border-color: ${({ theme }) => theme.colors.border.light};
  background-color: ${({ theme }) => theme.colors.background.secondary};
  margin-bottom: ${({ theme }) => theme.spacing.md}px;
`;

export const StyledCardHeader = styled.View.withConfig({
  displayName: 'StyledCardHeader',
  componentId: 'GeneralSettingsPanel_StyledCardHeader',
})`
  margin-bottom: ${({ theme }) => theme.spacing.md}px;
`;

export const StyledCardBody = styled.View.withConfig({
  displayName: 'StyledCardBody',
  componentId: 'GeneralSettingsPanel_StyledCardBody',
})`
  flex-direction: row;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing.md}px;
  align-items: flex-start;
`;
