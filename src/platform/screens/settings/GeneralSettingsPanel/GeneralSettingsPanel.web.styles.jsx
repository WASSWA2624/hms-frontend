/**
 * GeneralSettingsPanel Web Styles
 * Per theme-design.mdc: styled-components (web), semantic HTML
 */
import styled from 'styled-components';

export const StyledPanel = styled.main.withConfig({
  displayName: 'StyledPanel',
  componentId: 'GeneralSettingsPanel_StyledPanel',
})`
  flex: 1;
  min-width: 0;
  padding: ${({ theme }) => theme?.spacing?.lg ?? 24}px;
  background-color: ${({ theme }) => theme?.colors?.background?.primary ?? '#ffffff'};
`;

export const StyledSection = styled.section.withConfig({
  displayName: 'StyledSection',
  componentId: 'GeneralSettingsPanel_StyledSection',
})`
  margin-bottom: ${({ theme }) => theme?.spacing?.xl ?? 32}px;
`;

export const StyledSectionTitle = styled.h2.withConfig({
  displayName: 'StyledSectionTitle',
  componentId: 'GeneralSettingsPanel_StyledSectionTitle',
})`
  margin: 0 0 ${({ theme }) => theme?.spacing?.md ?? 16}px 0;
  font-size: inherit;
  font-weight: 600;
  color: ${({ theme }) => theme?.colors?.text?.primary ?? '#000'};
`;

export const StyledControlsRow = styled.div.withConfig({
  displayName: 'StyledControlsRow',
  componentId: 'GeneralSettingsPanel_StyledControlsRow',
})`
  display: flex;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme?.spacing?.lg ?? 24}px;
  align-items: flex-start;
`;
