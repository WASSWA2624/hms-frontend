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

const StyledHeaderTop = styled.View.withConfig({
  displayName: 'PatientsOverviewScreen_StyledHeaderTop',
  componentId: 'PatientsOverviewScreen_StyledHeaderTop',
})`
  flex-direction: row;
  align-items: flex-start;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing.sm}px;
`;

const StyledHeaderCopy = styled.View.withConfig({
  displayName: 'PatientsOverviewScreen_StyledHeaderCopy',
  componentId: 'PatientsOverviewScreen_StyledHeaderCopy',
})`
  flex: 1;
  min-width: 0;
  gap: ${({ theme }) => theme.spacing.xs}px;
`;

const StyledHelpButton = styled.Pressable.withConfig({
  displayName: 'PatientsOverviewScreen_StyledHelpButton',
  componentId: 'PatientsOverviewScreen_StyledHelpButton',
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
  displayName: 'PatientsOverviewScreen_StyledHelpButtonLabel',
  componentId: 'PatientsOverviewScreen_StyledHelpButtonLabel',
})`
  color: ${({ theme }) => theme.colors.text.primary};
  font-family: ${({ theme }) => theme.typography.fontFamily.bold};
  font-size: ${({ theme }) => theme.typography.fontSize.md}px;
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
`;

const StyledSummaryList = styled.View.withConfig({
  displayName: 'PatientsOverviewScreen_StyledSummaryList',
  componentId: 'PatientsOverviewScreen_StyledSummaryList',
})`
  flex-direction: row;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing.xs}px;
`;

const StyledSummaryChip = styled.View.withConfig({
  displayName: 'PatientsOverviewScreen_StyledSummaryChip',
  componentId: 'PatientsOverviewScreen_StyledSummaryChip',
})`
  padding-vertical: ${({ theme }) => theme.spacing.xs}px;
  padding-horizontal: ${({ theme }) => theme.spacing.sm}px;
  border-radius: ${({ theme }) => theme.radius.full}px;
  background-color: ${({ theme }) => theme.colors.background.secondary};
`;

const StyledSummaryText = styled.Text.withConfig({
  displayName: 'PatientsOverviewScreen_StyledSummaryText',
  componentId: 'PatientsOverviewScreen_StyledSummaryText',
})`
  color: ${({ theme }) => theme.colors.text.secondary};
  font-family: ${({ theme }) => theme.typography.fontFamily.regular};
  font-size: ${({ theme }) => theme.typography.fontSize.xs}px;
`;

const StyledHelpModalTitle = styled.Text.withConfig({
  displayName: 'PatientsOverviewScreen_StyledHelpModalTitle',
  componentId: 'PatientsOverviewScreen_StyledHelpModalTitle',
})`
  color: ${({ theme }) => theme.colors.text.primary};
  font-family: ${({ theme }) => theme.typography.fontFamily.bold};
  font-size: ${({ theme }) => theme.typography.fontSize.md}px;
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  margin-bottom: ${({ theme }) => theme.spacing.sm}px;
`;

const StyledHelpModalBody = styled.Text.withConfig({
  displayName: 'PatientsOverviewScreen_StyledHelpModalBody',
  componentId: 'PatientsOverviewScreen_StyledHelpModalBody',
})`
  color: ${({ theme }) => theme.colors.text.secondary};
  font-family: ${({ theme }) => theme.typography.fontFamily.regular};
  font-size: ${({ theme }) => theme.typography.fontSize.sm}px;
  margin-bottom: ${({ theme }) => theme.spacing.sm}px;
`;

const StyledHelpModalItem = styled.Text.withConfig({
  displayName: 'PatientsOverviewScreen_StyledHelpModalItem',
  componentId: 'PatientsOverviewScreen_StyledHelpModalItem',
})`
  color: ${({ theme }) => theme.colors.text.primary};
  font-family: ${({ theme }) => theme.typography.fontFamily.regular};
  font-size: ${({ theme }) => theme.typography.fontSize.sm}px;
  margin-bottom: ${({ theme }) => theme.spacing.xs}px;
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
