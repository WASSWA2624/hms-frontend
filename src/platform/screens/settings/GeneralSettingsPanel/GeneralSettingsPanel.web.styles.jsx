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

export const StyledHeader = styled.header.withConfig({
  displayName: 'StyledHeader',
  componentId: 'GeneralSettingsPanel_StyledHeader',
})`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme?.spacing?.xs ?? 8}px;
  margin-bottom: ${({ theme }) => theme?.spacing?.xl ?? 32}px;
`;

export const StyledHeaderTitle = styled.h1.withConfig({
  displayName: 'StyledHeaderTitle',
  componentId: 'GeneralSettingsPanel_StyledHeaderTitle',
})`
  margin: 0;
  font-size: ${({ theme }) => theme?.typography?.fontSize?.xl ?? 24}px;
  font-weight: ${({ theme }) => theme?.typography?.fontWeight?.semibold ?? 600};
  color: ${({ theme }) => theme?.colors?.text?.primary ?? '#000'};
`;

export const StyledHeaderSubtitle = styled.p.withConfig({
  displayName: 'StyledHeaderSubtitle',
  componentId: 'GeneralSettingsPanel_StyledHeaderSubtitle',
})`
  margin: 0;
  font-size: ${({ theme }) => theme?.typography?.fontSize?.sm ?? 14}px;
  color: ${({ theme }) => theme?.colors?.text?.secondary ?? '#3c3c43'};
`;

export const StyledSection = styled.section.withConfig({
  displayName: 'StyledSection',
  componentId: 'GeneralSettingsPanel_StyledSection',
})`
  margin-bottom: ${({ theme }) => theme?.spacing?.xl ?? 32}px;
`;

export const StyledSectionHeader = styled.div.withConfig({
  displayName: 'StyledSectionHeader',
  componentId: 'GeneralSettingsPanel_StyledSectionHeader',
})`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme?.spacing?.xs ?? 8}px;
  margin-bottom: ${({ theme }) => theme?.spacing?.md ?? 16}px;
`;

export const StyledSectionTitle = styled.h2.withConfig({
  displayName: 'StyledSectionTitle',
  componentId: 'GeneralSettingsPanel_StyledSectionTitle',
})`
  margin: 0;
  font-size: ${({ theme }) => theme?.typography?.fontSize?.md ?? 16}px;
  font-weight: ${({ theme }) => theme?.typography?.fontWeight?.semibold ?? 600};
  color: ${({ theme }) => theme?.colors?.text?.primary ?? '#000'};
`;

export const StyledSectionDescription = styled.p.withConfig({
  displayName: 'StyledSectionDescription',
  componentId: 'GeneralSettingsPanel_StyledSectionDescription',
})`
  margin: 0;
  font-size: ${({ theme }) => theme?.typography?.fontSize?.sm ?? 14}px;
  color: ${({ theme }) => theme?.colors?.text?.secondary ?? '#3c3c43'};
`;

export const StyledCardGrid = styled.div.withConfig({
  displayName: 'StyledCardGrid',
  componentId: 'GeneralSettingsPanel_StyledCardGrid',
})`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: ${({ theme }) => theme?.spacing?.lg ?? 24}px;
`;

export const StyledCard = styled.div.withConfig({
  displayName: 'StyledCard',
  componentId: 'GeneralSettingsPanel_StyledCard',
})`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme?.spacing?.md ?? 16}px;
  padding: ${({ theme }) => theme?.spacing?.lg ?? 24}px;
  border-radius: ${({ theme }) => theme?.radius?.md ?? 8}px;
  border: 1px solid ${({ theme }) => theme?.colors?.border?.light ?? '#e5e5ea'};
  background-color: ${({ theme }) => theme?.colors?.background?.secondary ?? '#f2f2f7'};
  box-shadow: ${({ theme }) => {
    const s = theme?.shadows?.xs;
    return s ? `${s.shadowOffset?.width ?? 0}px ${s.shadowOffset?.height ?? 1}px ${s.shadowRadius ?? 2}px rgba(0,0,0,${s.shadowOpacity ?? 0.06})` : '0 1px 2px rgba(0,0,0,0.06)';
  }};
`;

export const StyledCardHeader = styled.div.withConfig({
  displayName: 'StyledCardHeader',
  componentId: 'GeneralSettingsPanel_StyledCardHeader',
})`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme?.spacing?.xs ?? 8}px;
`;

export const StyledCardTitle = styled.h3.withConfig({
  displayName: 'StyledCardTitle',
  componentId: 'GeneralSettingsPanel_StyledCardTitle',
})`
  margin: 0;
  font-size: ${({ theme }) => theme?.typography?.fontSize?.md ?? 16}px;
  font-weight: ${({ theme }) => theme?.typography?.fontWeight?.semibold ?? 600};
  color: ${({ theme }) => theme?.colors?.text?.primary ?? '#000'};
`;

export const StyledCardDescription = styled.p.withConfig({
  displayName: 'StyledCardDescription',
  componentId: 'GeneralSettingsPanel_StyledCardDescription',
})`
  margin: 0;
  font-size: ${({ theme }) => theme?.typography?.fontSize?.sm ?? 14}px;
  color: ${({ theme }) => theme?.colors?.text?.secondary ?? '#3c3c43'};
`;

export const StyledCardBody = styled.div.withConfig({
  displayName: 'StyledCardBody',
  componentId: 'GeneralSettingsPanel_StyledCardBody',
})`
  display: flex;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme?.spacing?.md ?? 16}px;
  align-items: flex-start;
`;

export const StyledAccessGroupGrid = styled.div.withConfig({
  displayName: 'StyledAccessGroupGrid',
  componentId: 'GeneralSettingsPanel_StyledAccessGroupGrid',
})`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: ${({ theme }) => theme?.spacing?.md ?? 16}px;
`;

export const StyledAccessGroupCard = styled.div.withConfig({
  displayName: 'StyledAccessGroupCard',
  componentId: 'GeneralSettingsPanel_StyledAccessGroupCard',
})`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme?.spacing?.sm ?? 12}px;
  padding: ${({ theme }) => theme?.spacing?.md ?? 16}px;
  border: 1px solid ${({ theme }) => theme?.colors?.border?.light ?? '#e5e5ea'};
  border-radius: ${({ theme }) => theme?.radius?.md ?? 8}px;
  background-color: ${({ theme }) => theme?.colors?.background?.secondary ?? '#f2f2f7'};
`;

export const StyledAccessGroupTitle = styled.h3.withConfig({
  displayName: 'StyledAccessGroupTitle',
  componentId: 'GeneralSettingsPanel_StyledAccessGroupTitle',
})`
  margin: 0;
  font-size: ${({ theme }) => theme?.typography?.fontSize?.md ?? 16}px;
  font-weight: ${({ theme }) => theme?.typography?.fontWeight?.semibold ?? 600};
  color: ${({ theme }) => theme?.colors?.text?.primary ?? '#000'};
`;

export const StyledAccessLinkList = styled.div.withConfig({
  displayName: 'StyledAccessLinkList',
  componentId: 'GeneralSettingsPanel_StyledAccessLinkList',
})`
  display: flex;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme?.spacing?.xs ?? 8}px;
`;

export const StyledAccessLinkButton = styled.button.withConfig({
  displayName: 'StyledAccessLinkButton',
  componentId: 'GeneralSettingsPanel_StyledAccessLinkButton',
})`
  border: 1px solid ${({ theme, $active }) =>
    $active ? theme?.colors?.border?.strong ?? '#0078d4' : theme?.colors?.border?.light ?? '#d1d1d6'};
  background-color: ${({ theme, $active }) =>
    $active ? theme?.colors?.background?.primary ?? '#fff' : theme?.colors?.background?.surface ?? '#fff'};
  color: ${({ theme }) => theme?.colors?.text?.primary ?? '#000'};
  border-radius: ${({ theme }) => theme?.radius?.sm ?? 6}px;
  padding: ${({ theme }) => (theme?.spacing?.xs ?? 8) / 1.5}px ${({ theme }) => theme?.spacing?.sm ?? 12}px;
  font-size: ${({ theme }) => theme?.typography?.fontSize?.sm ?? 14}px;
  line-height: 1.3;
  cursor: pointer;

  &:hover {
    border-color: ${({ theme }) => theme?.colors?.border?.strong ?? '#0078d4'};
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme?.colors?.border?.strong ?? '#0078d4'};
    outline-offset: 1px;
  }
`;
