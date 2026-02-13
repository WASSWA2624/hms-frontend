import styled from 'styled-components/native';

const StyledContainer = styled.View.withConfig({
  displayName: 'ClinicalOverviewScreen_StyledContainer',
  componentId: 'ClinicalOverviewScreen_StyledContainer',
})`
  flex: 1;
  width: 100%;
  background-color: ${({ theme }) => theme.colors.background.primary};
`;

const StyledContent = styled.View.withConfig({
  displayName: 'ClinicalOverviewScreen_StyledContent',
  componentId: 'ClinicalOverviewScreen_StyledContent',
})`
  flex: 1;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.lg}px;
`;

const StyledHeader = styled.View.withConfig({
  displayName: 'ClinicalOverviewScreen_StyledHeader',
  componentId: 'ClinicalOverviewScreen_StyledHeader',
})`
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm}px;
`;

const StyledSection = styled.View.withConfig({
  displayName: 'ClinicalOverviewScreen_StyledSection',
  componentId: 'ClinicalOverviewScreen_StyledSection',
})`
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm}px;
`;

const StyledSectionHeader = styled.View.withConfig({
  displayName: 'ClinicalOverviewScreen_StyledSectionHeader',
  componentId: 'ClinicalOverviewScreen_StyledSectionHeader',
})`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;

const StyledSectionTitle = styled.Text.withConfig({
  displayName: 'ClinicalOverviewScreen_StyledSectionTitle',
  componentId: 'ClinicalOverviewScreen_StyledSectionTitle',
})`
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: ${({ theme }) => theme.typography.fontSize.md}px;
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
`;

const StyledCardGrid = styled.View.withConfig({
  displayName: 'ClinicalOverviewScreen_StyledCardGrid',
  componentId: 'ClinicalOverviewScreen_StyledCardGrid',
})`
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md}px;
`;

const StyledTileTitle = styled.Text.withConfig({
  displayName: 'ClinicalOverviewScreen_StyledTileTitle',
  componentId: 'ClinicalOverviewScreen_StyledTileTitle',
})`
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: ${({ theme }) => theme.typography.fontSize.sm}px;
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
`;

const StyledTileDescription = styled.Text.withConfig({
  displayName: 'ClinicalOverviewScreen_StyledTileDescription',
  componentId: 'ClinicalOverviewScreen_StyledTileDescription',
})`
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: ${({ theme }) => theme.typography.fontSize.xs}px;
`;

const StyledTileAction = styled.Pressable.withConfig({
  displayName: 'ClinicalOverviewScreen_StyledTileAction',
  componentId: 'ClinicalOverviewScreen_StyledTileAction',
})`
  margin-top: ${({ theme }) => theme.spacing.sm}px;
`;

const StyledRecentList = styled.View.withConfig({
  displayName: 'ClinicalOverviewScreen_StyledRecentList',
  componentId: 'ClinicalOverviewScreen_StyledRecentList',
})`
  width: 100%;
`;

const StyledSeparator = styled.View.withConfig({
  displayName: 'ClinicalOverviewScreen_StyledSeparator',
  componentId: 'ClinicalOverviewScreen_StyledSeparator',
})`
  width: 100%;
  height: ${({ theme }) => theme.spacing.sm}px;
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
  StyledSeparator,
  StyledTileAction,
  StyledTileDescription,
  StyledTileTitle,
};

