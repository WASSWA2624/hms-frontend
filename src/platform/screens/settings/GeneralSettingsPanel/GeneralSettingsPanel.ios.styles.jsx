/**
 * GeneralSettingsPanel iOS Styles
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

export const StyledAccessGroupGrid = styled.View.withConfig({
  displayName: 'StyledAccessGroupGrid',
  componentId: 'GeneralSettingsPanel_StyledAccessGroupGrid',
})`
  gap: ${({ theme }) => theme.spacing.md}px;
`;

export const StyledAccessGroupCard = styled.View.withConfig({
  displayName: 'StyledAccessGroupCard',
  componentId: 'GeneralSettingsPanel_StyledAccessGroupCard',
})`
  padding: ${({ theme }) => theme.spacing.md}px;
  border-radius: ${({ theme }) => theme.radius.md}px;
  border-width: 1px;
  border-color: ${({ theme }) => theme.colors.border.light};
  background-color: ${({ theme }) => theme.colors.background.secondary};
  gap: ${({ theme }) => theme.spacing.sm}px;
`;

export const StyledAccessGroupTitle = styled.Text.withConfig({
  displayName: 'StyledAccessGroupTitle',
  componentId: 'GeneralSettingsPanel_StyledAccessGroupTitle',
})`
  color: ${({ theme }) => theme.colors.text.primary};
  font-family: ${({ theme }) => theme.typography.fontFamily.bold};
  font-size: ${({ theme }) => theme.typography.fontSize.md}px;
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
`;

export const StyledAccessLinkList = styled.View.withConfig({
  displayName: 'StyledAccessLinkList',
  componentId: 'GeneralSettingsPanel_StyledAccessLinkList',
})`
  flex-direction: row;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing.xs}px;
`;

export const StyledAccessLinkButton = styled.Pressable.withConfig({
  displayName: 'StyledAccessLinkButton',
  componentId: 'GeneralSettingsPanel_StyledAccessLinkButton',
})`
  min-height: 44px;
  min-width: 132px;
  padding-horizontal: ${({ theme }) => theme.spacing.sm}px;
  border-radius: ${({ theme }) => theme.radius.sm}px;
  border-width: 1px;
  border-color: ${({ theme, $active }) =>
    $active ? theme.colors.border.strong : theme.colors.border.light};
  background-color: ${({ theme, $active }) =>
    $active ? theme.colors.background.primary : theme.colors.background.surface};
  align-items: center;
  justify-content: center;
`;

export const StyledAccessLinkButtonLabel = styled.Text.withConfig({
  displayName: 'StyledAccessLinkButtonLabel',
  componentId: 'GeneralSettingsPanel_StyledAccessLinkButtonLabel',
})`
  color: ${({ theme }) => theme.colors.text.primary};
  font-family: ${({ theme, $active }) =>
    $active ? theme.typography.fontFamily.bold : theme.typography.fontFamily.regular};
  font-size: ${({ theme }) => theme.typography.fontSize.sm}px;
  font-weight: ${({ theme, $active }) =>
    $active ? theme.typography.fontWeight.semibold : theme.typography.fontWeight.normal};
`;

export const StyledStateActionRow = styled.View.withConfig({
  displayName: 'StyledStateActionRow',
  componentId: 'GeneralSettingsPanel_StyledStateActionRow',
})`
  flex-direction: row;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing.sm}px;
  align-items: center;
`;
