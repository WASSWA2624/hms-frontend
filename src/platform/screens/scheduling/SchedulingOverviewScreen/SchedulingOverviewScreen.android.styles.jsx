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

const StyledHeaderTop = styled.View.withConfig({
  displayName: 'SchedulingOverviewScreen_StyledHeaderTop',
  componentId: 'SchedulingOverviewScreen_StyledHeaderTop',
})`
  flex-direction: row;
  align-items: flex-start;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing.sm}px;
`;

const StyledHeaderCopy = styled.View.withConfig({
  displayName: 'SchedulingOverviewScreen_StyledHeaderCopy',
  componentId: 'SchedulingOverviewScreen_StyledHeaderCopy',
})`
  flex: 1;
  min-width: 0;
  gap: ${({ theme }) => theme.spacing.xs}px;
`;

const StyledHelpButton = styled.Pressable.withConfig({
  displayName: 'SchedulingOverviewScreen_StyledHelpButton',
  componentId: 'SchedulingOverviewScreen_StyledHelpButton',
})`
  min-width: 44px;
  min-height: 44px;
  border-radius: ${({ theme }) => theme.radius.full}px;
  border-width: 1px;
  border-color: ${({ theme }) => theme.colors.background.tertiary};
  background-color: ${({ theme }) => theme.colors.background.secondary};
  align-items: center;
  justify-content: center;
`;

const StyledHelpButtonLabel = styled.Text.withConfig({
  displayName: 'SchedulingOverviewScreen_StyledHelpButtonLabel',
  componentId: 'SchedulingOverviewScreen_StyledHelpButtonLabel',
})`
  color: ${({ theme }) => theme.colors.text.primary};
  font-family: ${({ theme }) => theme.typography.fontFamily.bold};
  font-size: ${({ theme }) => theme.typography.fontSize.md}px;
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
`;

const StyledSummaryList = styled.View.withConfig({
  displayName: 'SchedulingOverviewScreen_StyledSummaryList',
  componentId: 'SchedulingOverviewScreen_StyledSummaryList',
})`
  flex-direction: row;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing.xs}px;
`;

const StyledSummaryChip = styled.View.withConfig({
  displayName: 'SchedulingOverviewScreen_StyledSummaryChip',
  componentId: 'SchedulingOverviewScreen_StyledSummaryChip',
})`
  padding-vertical: ${({ theme }) => theme.spacing.xs}px;
  padding-horizontal: ${({ theme }) => theme.spacing.sm}px;
  border-radius: ${({ theme }) => theme.radius.full}px;
  background-color: ${({ theme }) => theme.colors.background.secondary};
`;

const StyledSummaryText = styled.Text.withConfig({
  displayName: 'SchedulingOverviewScreen_StyledSummaryText',
  componentId: 'SchedulingOverviewScreen_StyledSummaryText',
})`
  color: ${({ theme }) => theme.colors.text.secondary};
  font-family: ${({ theme }) => theme.typography.fontFamily.regular};
  font-size: ${({ theme }) => theme.typography.fontSize.xs}px;
`;

const StyledHelpModalTitle = styled.Text.withConfig({
  displayName: 'SchedulingOverviewScreen_StyledHelpModalTitle',
  componentId: 'SchedulingOverviewScreen_StyledHelpModalTitle',
})`
  color: ${({ theme }) => theme.colors.text.primary};
  font-family: ${({ theme }) => theme.typography.fontFamily.bold};
  font-size: ${({ theme }) => theme.typography.fontSize.md}px;
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  margin-bottom: ${({ theme }) => theme.spacing.sm}px;
`;

const StyledHelpModalBody = styled.Text.withConfig({
  displayName: 'SchedulingOverviewScreen_StyledHelpModalBody',
  componentId: 'SchedulingOverviewScreen_StyledHelpModalBody',
})`
  color: ${({ theme }) => theme.colors.text.secondary};
  font-family: ${({ theme }) => theme.typography.fontFamily.regular};
  font-size: ${({ theme }) => theme.typography.fontSize.sm}px;
  margin-bottom: ${({ theme }) => theme.spacing.sm}px;
`;

const StyledHelpModalItem = styled.Text.withConfig({
  displayName: 'SchedulingOverviewScreen_StyledHelpModalItem',
  componentId: 'SchedulingOverviewScreen_StyledHelpModalItem',
})`
  color: ${({ theme }) => theme.colors.text.primary};
  font-family: ${({ theme }) => theme.typography.fontFamily.regular};
  font-size: ${({ theme }) => theme.typography.fontSize.sm}px;
  margin-bottom: ${({ theme }) => theme.spacing.xs}px;
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
  StyledHeaderCopy,
  StyledHeaderTop,
  StyledHelpButton,
  StyledHelpButtonLabel,
  StyledHelpModalBody,
  StyledHelpModalItem,
  StyledHelpModalTitle,
  StyledRecentList,
  StyledSection,
  StyledSectionHeader,
  StyledSectionTitle,
  StyledSeparator,
  StyledSummaryChip,
  StyledSummaryList,
  StyledSummaryText,
  StyledTileAction,
  StyledTileDescription,
  StyledTileTitle,
};

