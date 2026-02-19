import styled from 'styled-components';

const getTablet = (theme) => theme.breakpoints?.tablet ?? 768;

const StyledContainer = styled.main.withConfig({
  displayName: 'SchedulingOverviewScreen_StyledContainer',
  componentId: 'SchedulingOverviewScreen_StyledContainer',
})`
  display: flex;
  flex-direction: column;
  width: 100%;
  min-height: 100%;
  background-color: ${({ theme }) => theme.colors.background.primary};
`;

const StyledContent = styled.div.withConfig({
  displayName: 'SchedulingOverviewScreen_StyledContent',
  componentId: 'SchedulingOverviewScreen_StyledContent',
})`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.lg}px;
`;

const StyledHeader = styled.section.withConfig({
  displayName: 'SchedulingOverviewScreen_StyledHeader',
  componentId: 'SchedulingOverviewScreen_StyledHeader',
})`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm}px;
`;

const StyledHeaderTop = styled.div.withConfig({
  displayName: 'SchedulingOverviewScreen_StyledHeaderTop',
  componentId: 'SchedulingOverviewScreen_StyledHeaderTop',
})`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing.md}px;
`;

const StyledHeaderCopy = styled.div.withConfig({
  displayName: 'SchedulingOverviewScreen_StyledHeaderCopy',
  componentId: 'SchedulingOverviewScreen_StyledHeaderCopy',
})`
  display: flex;
  flex: 1;
  min-width: 0;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs}px;
`;

const StyledHelpAnchor = styled.div.withConfig({
  displayName: 'SchedulingOverviewScreen_StyledHelpAnchor',
  componentId: 'SchedulingOverviewScreen_StyledHelpAnchor',
})`
  position: relative;
  display: inline-flex;
`;

const StyledHelpButton = styled.button.withConfig({
  displayName: 'SchedulingOverviewScreen_StyledHelpButton',
  componentId: 'SchedulingOverviewScreen_StyledHelpButton',
})`
  min-width: 44px;
  min-height: 44px;
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

const StyledSummaryList = styled.ul.withConfig({
  displayName: 'SchedulingOverviewScreen_StyledSummaryList',
  componentId: 'SchedulingOverviewScreen_StyledSummaryList',
})`
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing.xs}px;
`;

const StyledSummaryListItem = styled.li.withConfig({
  displayName: 'SchedulingOverviewScreen_StyledSummaryListItem',
  componentId: 'SchedulingOverviewScreen_StyledSummaryListItem',
})`
  padding: ${({ theme }) => theme.spacing.xs}px ${({ theme }) => theme.spacing.sm}px;
  border-radius: ${({ theme }) => theme.radius.full}px;
  background-color: ${({ theme }) => theme.colors.background.secondary};
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: ${({ theme }) => theme.typography.fontSize.xs}px;
  font-family: ${({ theme }) => theme.typography.fontFamily.regular};
`;

const StyledHelpModalTitle = styled.h2.withConfig({
  displayName: 'SchedulingOverviewScreen_StyledHelpModalTitle',
  componentId: 'SchedulingOverviewScreen_StyledHelpModalTitle',
})`
  margin: 0;
  color: ${({ theme }) => theme.colors.text.primary};
  font-family: ${({ theme }) => theme.typography.fontFamily.bold};
  font-size: ${({ theme }) => theme.typography.fontSize.md}px;
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
`;

const StyledHelpModalBody = styled.p.withConfig({
  displayName: 'SchedulingOverviewScreen_StyledHelpModalBody',
  componentId: 'SchedulingOverviewScreen_StyledHelpModalBody',
})`
  margin: 0;
  color: ${({ theme }) => theme.colors.text.secondary};
  font-family: ${({ theme }) => theme.typography.fontFamily.regular};
  font-size: ${({ theme }) => theme.typography.fontSize.sm}px;
  line-height: ${({ theme }) => theme.typography.fontSize.sm * theme.typography.lineHeight.normal}px;
`;

const StyledHelpChecklist = styled.ul.withConfig({
  displayName: 'SchedulingOverviewScreen_StyledHelpChecklist',
  componentId: 'SchedulingOverviewScreen_StyledHelpChecklist',
})`
  margin: 0;
  padding-left: ${({ theme }) => theme.spacing.lg}px;
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs}px;
`;

const StyledHelpItem = styled.li.withConfig({
  displayName: 'SchedulingOverviewScreen_StyledHelpItem',
  componentId: 'SchedulingOverviewScreen_StyledHelpItem',
})`
  color: ${({ theme }) => theme.colors.text.primary};
  font-family: ${({ theme }) => theme.typography.fontFamily.regular};
  font-size: ${({ theme }) => theme.typography.fontSize.sm}px;
  line-height: ${({ theme }) => theme.typography.fontSize.sm * theme.typography.lineHeight.normal}px;
`;

const StyledSection = styled.section.withConfig({
  displayName: 'SchedulingOverviewScreen_StyledSection',
  componentId: 'SchedulingOverviewScreen_StyledSection',
})`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm}px;
`;

const StyledSectionHeader = styled.div.withConfig({
  displayName: 'SchedulingOverviewScreen_StyledSectionHeader',
  componentId: 'SchedulingOverviewScreen_StyledSectionHeader',
})`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const StyledSectionTitle = styled.h2.withConfig({
  displayName: 'SchedulingOverviewScreen_StyledSectionTitle',
  componentId: 'SchedulingOverviewScreen_StyledSectionTitle',
})`
  margin: 0;
  font-size: ${({ theme }) => theme.typography.fontSize.md}px;
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  color: ${({ theme }) => theme.colors.text.primary};
`;

const StyledCardGrid = styled.div.withConfig({
  displayName: 'SchedulingOverviewScreen_StyledCardGrid',
  componentId: 'SchedulingOverviewScreen_StyledCardGrid',
})`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: ${({ theme }) => theme.spacing.md}px;

  @media (max-width: ${({ theme }) => getTablet(theme)}px) {
    grid-template-columns: 1fr;
  }
`;

const StyledTileTitle = styled.p.withConfig({
  displayName: 'SchedulingOverviewScreen_StyledTileTitle',
  componentId: 'SchedulingOverviewScreen_StyledTileTitle',
})`
  margin: 0;
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: ${({ theme }) => theme.typography.fontSize.sm}px;
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
`;

const StyledTileDescription = styled.p.withConfig({
  displayName: 'SchedulingOverviewScreen_StyledTileDescription',
  componentId: 'SchedulingOverviewScreen_StyledTileDescription',
})`
  margin: 0;
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: ${({ theme }) => theme.typography.fontSize.xs}px;
`;

const StyledTileAction = styled.button.withConfig({
  displayName: 'SchedulingOverviewScreen_StyledTileAction',
  componentId: 'SchedulingOverviewScreen_StyledTileAction',
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
  displayName: 'SchedulingOverviewScreen_StyledRecentList',
  componentId: 'SchedulingOverviewScreen_StyledRecentList',
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
  StyledHeaderCopy,
  StyledHeaderTop,
  StyledHelpAnchor,
  StyledHelpButton,
  StyledHelpChecklist,
  StyledHelpItem,
  StyledHelpModalBody,
  StyledHelpModalTitle,
  StyledRecentList,
  StyledSection,
  StyledSectionHeader,
  StyledSectionTitle,
  StyledSummaryList,
  StyledSummaryListItem,
  StyledTileAction,
  StyledTileDescription,
  StyledTileTitle,
};

