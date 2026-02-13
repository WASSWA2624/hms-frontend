import styled from 'styled-components/native';

const StyledContainer = styled.View.withConfig({
  displayName: 'SchedulingOverviewScreen_StyledContainer',
  componentId: 'SchedulingOverviewScreen_StyledContainer',
})`
  flex: 1;
  width: 100%;
  background-color: ${({ theme }) => theme.colors.background.primary};
`;

const StyledContent = styled.View.withConfig({
  displayName: 'SchedulingOverviewScreen_StyledContent',
  componentId: 'SchedulingOverviewScreen_StyledContent',
})`
  flex: 1;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.lg}px;
`;

const StyledHeader = styled.View.withConfig({
  displayName: 'SchedulingOverviewScreen_StyledHeader',
  componentId: 'SchedulingOverviewScreen_StyledHeader',
})`
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm}px;
`;

const StyledSection = styled.View.withConfig({
  displayName: 'SchedulingOverviewScreen_StyledSection',
  componentId: 'SchedulingOverviewScreen_StyledSection',
})`
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm}px;
`;

const StyledSectionHeader = styled.View.withConfig({
  displayName: 'SchedulingOverviewScreen_StyledSectionHeader',
  componentId: 'SchedulingOverviewScreen_StyledSectionHeader',
})`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;

const StyledSectionTitle = styled.Text.withConfig({
  displayName: 'SchedulingOverviewScreen_StyledSectionTitle',
  componentId: 'SchedulingOverviewScreen_StyledSectionTitle',
})`
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: ${({ theme }) => theme.typography.fontSize.md}px;
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
`;

const StyledCardGrid = styled.View.withConfig({
  displayName: 'SchedulingOverviewScreen_StyledCardGrid',
  componentId: 'SchedulingOverviewScreen_StyledCardGrid',
})`
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md}px;
`;

const StyledTileTitle = styled.Text.withConfig({
  displayName: 'SchedulingOverviewScreen_StyledTileTitle',
  componentId: 'SchedulingOverviewScreen_StyledTileTitle',
})`
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: ${({ theme }) => theme.typography.fontSize.sm}px;
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
`;

const StyledTileDescription = styled.Text.withConfig({
  displayName: 'SchedulingOverviewScreen_StyledTileDescription',
  componentId: 'SchedulingOverviewScreen_StyledTileDescription',
})`
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: ${({ theme }) => theme.typography.fontSize.xs}px;
`;

const StyledTileAction = styled.Pressable.withConfig({
  displayName: 'SchedulingOverviewScreen_StyledTileAction',
  componentId: 'SchedulingOverviewScreen_StyledTileAction',
})`
  margin-top: ${({ theme }) => theme.spacing.sm}px;
`;

const StyledRecentList = styled.View.withConfig({
  displayName: 'SchedulingOverviewScreen_StyledRecentList',
  componentId: 'SchedulingOverviewScreen_StyledRecentList',
})`
  width: 100%;
`;

const StyledSeparator = styled.View.withConfig({
  displayName: 'SchedulingOverviewScreen_StyledSeparator',
  componentId: 'SchedulingOverviewScreen_StyledSeparator',
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

