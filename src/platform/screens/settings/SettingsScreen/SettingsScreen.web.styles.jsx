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

export const StyledHeader = styled.section.withConfig({
  displayName: 'StyledHeader',
  componentId: 'SettingsScreen_StyledHeader',
})`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing.md}px;
  padding: ${({ theme }) => theme.spacing.sm}px 0;
`;

export const StyledHeaderCopy = styled.div.withConfig({
  displayName: 'StyledHeaderCopy',
  componentId: 'SettingsScreen_StyledHeaderCopy',
})`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs}px;
  min-width: 0;
`;

export const StyledTitle = styled.h1.withConfig({
  displayName: 'StyledTitle',
  componentId: 'SettingsScreen_StyledTitle',
})`
  margin: 0;
  color: ${({ theme }) => theme.colors.text.primary};
  font-family: ${({ theme }) => theme.typography.fontFamily.bold};
  font-size: ${({ theme }) => theme.typography.fontSize.lg}px;
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  line-height: ${({ theme }) => theme.typography.fontSize.lg * theme.typography.lineHeight.tight}px;
`;

export const StyledDescription = styled.p.withConfig({
  displayName: 'StyledDescription',
  componentId: 'SettingsScreen_StyledDescription',
})`
  margin: 0;
  color: ${({ theme }) => theme.colors.text.secondary};
  font-family: ${({ theme }) => theme.typography.fontFamily.regular};
  font-size: ${({ theme }) => theme.typography.fontSize.sm}px;
  font-weight: ${({ theme }) => theme.typography.fontWeight.normal};
  line-height: ${({ theme }) => theme.typography.fontSize.sm * theme.typography.lineHeight.normal}px;
`;

export const StyledHelpAnchor = styled.div.withConfig({
  displayName: 'StyledHelpAnchor',
  componentId: 'SettingsScreen_StyledHelpAnchor',
})`
  position: relative;
  display: inline-flex;
`;

export const StyledHelpButton = styled.button.withConfig({
  displayName: 'StyledHelpButton',
  componentId: 'SettingsScreen_StyledHelpButton',
})`
  min-width: 36px;
  min-height: 36px;
  border-radius: ${({ theme }) => theme.radius.full}px;
  border: 1px solid ${({ theme }) => theme.colors.background.tertiary};
  background-color: ${({ theme }) => theme.colors.background.secondary};
  color: ${({ theme }) => theme.colors.text.primary};
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;

  &:hover {
    background-color: ${({ theme }) => theme.colors.background.tertiary};
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.primary};
    outline-offset: 2px;
  }
`;

export const StyledHelpModalTitle = styled.h2.withConfig({
  displayName: 'StyledHelpModalTitle',
  componentId: 'SettingsScreen_StyledHelpModalTitle',
})`
  margin: 0;
  color: ${({ theme }) => theme.colors.text.primary};
  font-family: ${({ theme }) => theme.typography.fontFamily.bold};
  font-size: ${({ theme }) => theme.typography.fontSize.md}px;
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
`;

export const StyledHelpModalBody = styled.p.withConfig({
  displayName: 'StyledHelpModalBody',
  componentId: 'SettingsScreen_StyledHelpModalBody',
})`
  margin: 0;
  color: ${({ theme }) => theme.colors.text.secondary};
  font-family: ${({ theme }) => theme.typography.fontFamily.regular};
  font-size: ${({ theme }) => theme.typography.fontSize.sm}px;
  line-height: ${({ theme }) => theme.typography.fontSize.sm * theme.typography.lineHeight.normal}px;
`;

export const StyledHelpChecklist = styled.ul.withConfig({
  displayName: 'StyledHelpChecklist',
  componentId: 'SettingsScreen_StyledHelpChecklist',
})`
  margin: 0;
  padding-left: ${({ theme }) => theme.spacing.lg}px;
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs}px;
`;

export const StyledHelpItem = styled.li.withConfig({
  displayName: 'StyledHelpItem',
  componentId: 'SettingsScreen_StyledHelpItem',
})`
  color: ${({ theme }) => theme.colors.text.primary};
  font-family: ${({ theme }) => theme.typography.fontFamily.regular};
  font-size: ${({ theme }) => theme.typography.fontSize.sm}px;
  line-height: ${({ theme }) => theme.typography.fontSize.sm * theme.typography.lineHeight.normal}px;
`;
