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

export const StyledHeader = styled.View.withConfig({
  displayName: 'StyledHeader',
  componentId: 'SettingsScreen_StyledHeader',
})`
  flex-direction: row;
  align-items: flex-start;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing.sm}px;
  padding-vertical: ${({ theme }) => theme.spacing.sm}px;
`;

export const StyledHeaderCopy = styled.View.withConfig({
  displayName: 'StyledHeaderCopy',
  componentId: 'SettingsScreen_StyledHeaderCopy',
})`
  flex: 1;
  min-width: 0;
  gap: ${({ theme }) => theme.spacing.xs}px;
`;

export const StyledTitle = styled.Text.withConfig({
  displayName: 'StyledTitle',
  componentId: 'SettingsScreen_StyledTitle',
})`
  color: ${({ theme }) => theme.colors.text.primary};
  font-family: ${({ theme }) => theme.typography.fontFamily.bold};
  font-size: ${({ theme }) => theme.typography.fontSize.lg}px;
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
`;

export const StyledDescription = styled.Text.withConfig({
  displayName: 'StyledDescription',
  componentId: 'SettingsScreen_StyledDescription',
})`
  color: ${({ theme }) => theme.colors.text.secondary};
  font-family: ${({ theme }) => theme.typography.fontFamily.regular};
  font-size: ${({ theme }) => theme.typography.fontSize.sm}px;
  font-weight: ${({ theme }) => theme.typography.fontWeight.normal};
`;

export const StyledHelpButton = styled.Pressable.withConfig({
  displayName: 'StyledHelpButton',
  componentId: 'SettingsScreen_StyledHelpButton',
})`
  min-width: 36px;
  min-height: 36px;
  border-radius: ${({ theme }) => theme.radius.full}px;
  border-width: 1px;
  border-color: ${({ theme }) => theme.colors.background.tertiary};
  background-color: ${({ theme }) => theme.colors.background.secondary};
  align-items: center;
  justify-content: center;
`;

export const StyledHelpButtonLabel = styled.Text.withConfig({
  displayName: 'StyledHelpButtonLabel',
  componentId: 'SettingsScreen_StyledHelpButtonLabel',
})`
  color: ${({ theme }) => theme.colors.text.primary};
  font-family: ${({ theme }) => theme.typography.fontFamily.bold};
  font-size: ${({ theme }) => theme.typography.fontSize.md}px;
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
`;

export const StyledHelpModalTitle = styled.Text.withConfig({
  displayName: 'StyledHelpModalTitle',
  componentId: 'SettingsScreen_StyledHelpModalTitle',
})`
  color: ${({ theme }) => theme.colors.text.primary};
  font-family: ${({ theme }) => theme.typography.fontFamily.bold};
  font-size: ${({ theme }) => theme.typography.fontSize.md}px;
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  margin-bottom: ${({ theme }) => theme.spacing.sm}px;
`;

export const StyledHelpModalBody = styled.Text.withConfig({
  displayName: 'StyledHelpModalBody',
  componentId: 'SettingsScreen_StyledHelpModalBody',
})`
  color: ${({ theme }) => theme.colors.text.secondary};
  font-family: ${({ theme }) => theme.typography.fontFamily.regular};
  font-size: ${({ theme }) => theme.typography.fontSize.sm}px;
  margin-bottom: ${({ theme }) => theme.spacing.sm}px;
`;

export const StyledHelpModalItem = styled.Text.withConfig({
  displayName: 'StyledHelpModalItem',
  componentId: 'SettingsScreen_StyledHelpModalItem',
})`
  color: ${({ theme }) => theme.colors.text.primary};
  font-family: ${({ theme }) => theme.typography.fontFamily.regular};
  font-size: ${({ theme }) => theme.typography.fontSize.sm}px;
  margin-bottom: ${({ theme }) => theme.spacing.xs}px;
`;
