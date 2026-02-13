import styled from 'styled-components';

const getTablet = (theme) => theme.breakpoints?.tablet ?? 768;

const StyledContainer = styled.main.withConfig({
  displayName: 'ClinicalOverviewScreen_StyledContainer',
  componentId: 'ClinicalOverviewScreen_StyledContainer',
})`
  display: flex;
  flex-direction: column;
  width: 100%;
  min-height: 100%;
  background-color: ${({ theme }) => theme.colors.background.primary};
`;

const StyledContent = styled.div.withConfig({
  displayName: 'ClinicalOverviewScreen_StyledContent',
  componentId: 'ClinicalOverviewScreen_StyledContent',
})`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.lg}px;
`;

const StyledHeader = styled.section.withConfig({
  displayName: 'ClinicalOverviewScreen_StyledHeader',
  componentId: 'ClinicalOverviewScreen_StyledHeader',
})`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm}px;
`;

const StyledSection = styled.section.withConfig({
  displayName: 'ClinicalOverviewScreen_StyledSection',
  componentId: 'ClinicalOverviewScreen_StyledSection',
})`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm}px;
`;

const StyledSectionHeader = styled.div.withConfig({
  displayName: 'ClinicalOverviewScreen_StyledSectionHeader',
  componentId: 'ClinicalOverviewScreen_StyledSectionHeader',
})`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const StyledSectionTitle = styled.h2.withConfig({
  displayName: 'ClinicalOverviewScreen_StyledSectionTitle',
  componentId: 'ClinicalOverviewScreen_StyledSectionTitle',
})`
  margin: 0;
  font-size: ${({ theme }) => theme.typography.fontSize.md}px;
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  color: ${({ theme }) => theme.colors.text.primary};
`;

const StyledCardGrid = styled.div.withConfig({
  displayName: 'ClinicalOverviewScreen_StyledCardGrid',
  componentId: 'ClinicalOverviewScreen_StyledCardGrid',
})`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: ${({ theme }) => theme.spacing.md}px;

  @media (max-width: ${({ theme }) => getTablet(theme)}px) {
    grid-template-columns: 1fr;
  }
`;

const StyledTileTitle = styled.p.withConfig({
  displayName: 'ClinicalOverviewScreen_StyledTileTitle',
  componentId: 'ClinicalOverviewScreen_StyledTileTitle',
})`
  margin: 0;
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: ${({ theme }) => theme.typography.fontSize.sm}px;
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
`;

const StyledTileDescription = styled.p.withConfig({
  displayName: 'ClinicalOverviewScreen_StyledTileDescription',
  componentId: 'ClinicalOverviewScreen_StyledTileDescription',
})`
  margin: 0;
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: ${({ theme }) => theme.typography.fontSize.xs}px;
`;

const StyledTileAction = styled.button.withConfig({
  displayName: 'ClinicalOverviewScreen_StyledTileAction',
  componentId: 'ClinicalOverviewScreen_StyledTileAction',
})`
  margin-top: ${({ theme }) => theme.spacing.sm}px;
  border: none;
  background: transparent;
  color: ${({ theme }) => theme.colors.primary};
  cursor: pointer;
  text-align: left;
  padding: 0;
`;

const StyledRecentList = styled.ul.withConfig({
  displayName: 'ClinicalOverviewScreen_StyledRecentList',
  componentId: 'ClinicalOverviewScreen_StyledRecentList',
})`
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
`;

export {
  StyledCardGrid,
  StyledContainer,
  StyledContent,
  StyledHeader,
  StyledRecentList,
  StyledSection,
  StyledSectionHeader,
  StyledSectionTitle,
  StyledTileAction,
  StyledTileDescription,
  StyledTileTitle,
};

