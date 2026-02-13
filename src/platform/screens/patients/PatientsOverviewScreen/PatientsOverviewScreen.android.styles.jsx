import styled from 'styled-components/native';

const StyledContainer = styled.View.withConfig({
  displayName: 'PatientsOverviewScreen_StyledContainer',
  componentId: 'PatientsOverviewScreen_StyledContainer',
})`
  flex: 1;
  width: 100%;
  background-color: ${({ theme }) => theme.colors.background.primary};
`;

const StyledContent = styled.View.withConfig({
  displayName: 'PatientsOverviewScreen_StyledContent',
  componentId: 'PatientsOverviewScreen_StyledContent',
})`
  flex: 1;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.lg}px;
`;

const StyledHeader = styled.View.withConfig({
  displayName: 'PatientsOverviewScreen_StyledHeader',
  componentId: 'PatientsOverviewScreen_StyledHeader',
})`
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm}px;
`;

const StyledSection = styled.View.withConfig({
  displayName: 'PatientsOverviewScreen_StyledSection',
  componentId: 'PatientsOverviewScreen_StyledSection',
})`
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm}px;
`;

const StyledSectionHeader = styled.View.withConfig({
  displayName: 'PatientsOverviewScreen_StyledSectionHeader',
  componentId: 'PatientsOverviewScreen_StyledSectionHeader',
})`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;

const StyledSectionTitle = styled.Text.withConfig({
  displayName: 'PatientsOverviewScreen_StyledSectionTitle',
  componentId: 'PatientsOverviewScreen_StyledSectionTitle',
})`
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: ${({ theme }) => theme.typography.fontSize.md}px;
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
`;

const StyledCardGrid = styled.View.withConfig({
  displayName: 'PatientsOverviewScreen_StyledCardGrid',
  componentId: 'PatientsOverviewScreen_StyledCardGrid',
})`
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md}px;
`;

const StyledTileTitle = styled.Text.withConfig({
  displayName: 'PatientsOverviewScreen_StyledTileTitle',
  componentId: 'PatientsOverviewScreen_StyledTileTitle',
})`
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: ${({ theme }) => theme.typography.fontSize.sm}px;
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
`;

const StyledTileDescription = styled.Text.withConfig({
  displayName: 'PatientsOverviewScreen_StyledTileDescription',
  componentId: 'PatientsOverviewScreen_StyledTileDescription',
})`
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: ${({ theme }) => theme.typography.fontSize.xs}px;
`;

const StyledTileAction = styled.Pressable.withConfig({
  displayName: 'PatientsOverviewScreen_StyledTileAction',
  componentId: 'PatientsOverviewScreen_StyledTileAction',
})`
  margin-top: ${({ theme }) => theme.spacing.sm}px;
`;

const StyledRecentList = styled.View.withConfig({
  displayName: 'PatientsOverviewScreen_StyledRecentList',
  componentId: 'PatientsOverviewScreen_StyledRecentList',
})`
  width: 100%;
`;

const StyledSeparator = styled.View.withConfig({
  displayName: 'PatientsOverviewScreen_StyledSeparator',
  componentId: 'PatientsOverviewScreen_StyledSeparator',
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
