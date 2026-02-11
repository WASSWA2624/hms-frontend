/**
 * DashboardScreen Web Styles
 * Styled-components for Web platform
 * File: DashboardScreen.web.styles.jsx
 */
import styled from 'styled-components';

const getTablet = (theme) => theme.breakpoints?.tablet;
const getDesktop = (theme) => theme.breakpoints?.desktop;

const StyledHomeContainer = styled.main.withConfig({
  displayName: 'StyledHomeContainer',
  componentId: 'DashboardScreen_StyledHomeContainer',
})`
  display: flex;
  flex-direction: column;
  width: 100%;
  min-height: 100%;
  background-color: ${({ theme }) => theme.colors.background.primary};
  padding-right: 0;
  box-sizing: border-box;
`;

const StyledContent = styled.div.withConfig({
  displayName: 'StyledContent',
  componentId: 'DashboardScreen_StyledContent',
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

const StyledWelcomeSection = styled.section.withConfig({
  displayName: 'StyledWelcomeSection',
  componentId: 'DashboardScreen_StyledWelcomeSection',
})`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm}px;
`;

const StyledWelcomeMessage = styled.div.withConfig({
  displayName: 'StyledWelcomeMessage',
  componentId: 'DashboardScreen_StyledWelcomeMessage',
})`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs}px;
`;

const StyledWelcomeMeta = styled.div.withConfig({
  displayName: 'StyledWelcomeMeta',
  componentId: 'DashboardScreen_StyledWelcomeMeta',
})`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm}px;
  color: ${({ theme }) => theme.colors.text.secondary};
`;

const StyledHeroPanel = styled.div.withConfig({
  displayName: 'StyledHeroPanel',
  componentId: 'DashboardScreen_StyledHeroPanel',
})`
  background: linear-gradient(135deg, ${({ theme }) => theme.colors.background.primary} 0%, ${({ theme }) => theme.colors.background.secondary} 100%);
  border: 1px solid ${({ theme }) => theme.colors.background.tertiary};
  border-radius: ${({ theme }) => theme.radius.lg}px;
  padding: ${({ theme }) => theme.spacing.lg}px;
`;

const StyledBadgeRow = styled.div.withConfig({
  displayName: 'StyledBadgeRow',
  componentId: 'DashboardScreen_StyledBadgeRow',
})`
  display: flex;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing.xs}px;
`;

const StyledSection = styled.section.withConfig({
  displayName: 'StyledSection',
  componentId: 'DashboardScreen_StyledSection',
})`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm}px;
`;

const StyledSectionHeader = styled.div.withConfig({
  displayName: 'StyledSectionHeader',
  componentId: 'DashboardScreen_StyledSectionHeader',
})`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs}px;

  @media (min-width: ${({ theme }) => getTablet(theme)}px) {
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
  }
`;

const StyledSectionTitleGroup = styled.div.withConfig({
  displayName: 'StyledSectionTitleGroup',
  componentId: 'DashboardScreen_StyledSectionTitleGroup',
})`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs}px;
`;

const StyledSectionMeta = styled.div.withConfig({
  displayName: 'StyledSectionMeta',
  componentId: 'DashboardScreen_StyledSectionMeta',
})`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm}px;
  color: ${({ theme }) => theme.colors.text.secondary};
`;

const StyledSectionBody = styled.div.withConfig({
  displayName: 'StyledSectionBody',
  componentId: 'DashboardScreen_StyledSectionBody',
})`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm}px;
`;

const StyledStatusStrip = styled.div.withConfig({
  displayName: 'StyledStatusStrip',
  componentId: 'DashboardScreen_StyledStatusStrip',
})`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
  gap: ${({ theme }) => theme.spacing.sm}px;
`;

const StyledQuickActions = styled.div.withConfig({
  displayName: 'StyledQuickActions',
  componentId: 'DashboardScreen_StyledQuickActions',
})`
  display: flex;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing.sm}px;
`;

const StyledChecklist = styled.ul.withConfig({
  displayName: 'StyledChecklist',
  componentId: 'DashboardScreen_StyledChecklist',
})`
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
`;

const StyledChecklistItemContent = styled.div.withConfig({
  displayName: 'StyledChecklistItemContent',
  componentId: 'DashboardScreen_StyledChecklistItemContent',
})`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs}px;
  min-width: 0;
`;

const StyledChecklistFooter = styled.div.withConfig({
  displayName: 'StyledChecklistFooter',
  componentId: 'DashboardScreen_StyledChecklistFooter',
})`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm}px;
  margin-top: ${({ theme }) => theme.spacing.sm}px;
`;

const StyledStatGrid = styled.div.withConfig({
  displayName: 'StyledStatGrid',
  componentId: 'DashboardScreen_StyledStatGrid',
})`
  display: grid;
  grid-template-columns: 1fr;
  gap: ${({ theme }) => theme.spacing.sm}px;

  @media (min-width: ${({ theme }) => getTablet(theme)}px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  @media (min-width: ${({ theme }) => getDesktop(theme)}px) {
    grid-template-columns: repeat(4, minmax(0, 1fr));
  }
`;

const StyledValueGrid = styled.div.withConfig({
  displayName: 'StyledValueGrid',
  componentId: 'DashboardScreen_StyledValueGrid',
})`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: ${({ theme }) => theme.spacing.sm}px;
`;

const StyledModuleGrid = styled.div.withConfig({
  displayName: 'StyledModuleGrid',
  componentId: 'DashboardScreen_StyledModuleGrid',
})`
  display: grid;
  grid-template-columns: 1fr;
  gap: ${({ theme }) => theme.spacing.md}px;

  @media (min-width: ${({ theme }) => getTablet(theme)}px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  @media (min-width: ${({ theme }) => getDesktop(theme)}px) {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
`;

const StyledPlanRow = styled.div.withConfig({
  displayName: 'StyledPlanRow',
  componentId: 'DashboardScreen_StyledPlanRow',
})`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing.md}px;
  margin-bottom: ${({ theme }) => theme.spacing.sm}px;
`;

const StyledPlanActions = styled.div.withConfig({
  displayName: 'StyledPlanActions',
  componentId: 'DashboardScreen_StyledPlanActions',
})`
  display: flex;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing.sm}px;
`;

const StyledActivityMeta = styled.div.withConfig({
  displayName: 'StyledActivityMeta',
  componentId: 'DashboardScreen_StyledActivityMeta',
})`
  color: ${({ theme }) => theme.colors.text.secondary};
`;

const StyledHelpGrid = styled.div.withConfig({
  displayName: 'StyledHelpGrid',
  componentId: 'DashboardScreen_StyledHelpGrid',
})`
  display: grid;
  grid-template-columns: 1fr;
  gap: ${({ theme }) => theme.spacing.md}px;

  @media (min-width: ${({ theme }) => getTablet(theme)}px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
`;

const StyledCardWrapper = styled.div.withConfig({
  displayName: 'StyledCardWrapper',
  componentId: 'DashboardScreen_StyledCardWrapper',
})`
  height: 100%;
`;

const StyledStatCardContent = styled.div.withConfig({
  displayName: 'StyledStatCardContent',
  componentId: 'DashboardScreen_StyledStatCardContent',
})`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm}px;
`;

const StyledStatValueRow = styled.div.withConfig({
  displayName: 'StyledStatValueRow',
  componentId: 'DashboardScreen_StyledStatValueRow',
})`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing.sm}px;
`;

const StyledCapacityList = styled.div.withConfig({
  displayName: 'StyledCapacityList',
  componentId: 'DashboardScreen_StyledCapacityList',
})`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm}px;
`;

const StyledCapacityItem = styled.div.withConfig({
  displayName: 'StyledCapacityItem',
  componentId: 'DashboardScreen_StyledCapacityItem',
})`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs}px;
`;

const StyledCapacityHeader = styled.div.withConfig({
  displayName: 'StyledCapacityHeader',
  componentId: 'DashboardScreen_StyledCapacityHeader',
})`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing.sm}px;
`;

const StyledSectionGrid = styled.div.withConfig({
  displayName: 'StyledSectionGrid',
  componentId: 'DashboardScreen_StyledSectionGrid',
})`
  display: grid;
  grid-template-columns: 1fr;
  gap: ${({ theme }) => theme.spacing.md}px;

  @media (min-width: ${({ theme }) => getDesktop(theme)}px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
`;

const StyledCardHeaderContent = styled.div.withConfig({
  displayName: 'StyledCardHeaderContent',
  componentId: 'DashboardScreen_StyledCardHeaderContent',
})`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs}px;
`;

const StyledList = styled.ul.withConfig({
  displayName: 'StyledList',
  componentId: 'DashboardScreen_StyledList',
})`
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
`;

const StyledListItem = styled.li.withConfig({
  displayName: 'StyledListItem',
  componentId: 'DashboardScreen_StyledListItem',
})`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing.sm}px;
  padding: ${({ theme }) => theme.spacing.xs}px 0;
  border-bottom: 1px solid ${({ theme }) => theme.colors.background.tertiary};

  &:last-child {
    border-bottom: none;
  }
`;

const StyledListItemContent = styled.div.withConfig({
  displayName: 'StyledListItemContent',
  componentId: 'DashboardScreen_StyledListItemContent',
})`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs}px;
  min-width: 0;
`;

const StyledListItemMeta = styled.div.withConfig({
  displayName: 'StyledListItemMeta',
  componentId: 'DashboardScreen_StyledListItemMeta',
})`
  color: ${({ theme }) => theme.colors.text.secondary};
`;

const StyledStateWrapper = styled.div.withConfig({
  displayName: 'StyledStateWrapper',
  componentId: 'DashboardScreen_StyledStateWrapper',
})`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: ${({ theme }) => theme.spacing.xl}px 0;
`;

const StyledLoadingGrid = styled.div.withConfig({
  displayName: 'StyledLoadingGrid',
  componentId: 'DashboardScreen_StyledLoadingGrid',
})`
  display: grid;
  grid-template-columns: 1fr;
  gap: ${({ theme }) => theme.spacing.md}px;

  @media (min-width: ${({ theme }) => getTablet(theme)}px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  @media (min-width: ${({ theme }) => getDesktop(theme)}px) {
    grid-template-columns: repeat(4, minmax(0, 1fr));
  }
`;

const StyledLoadingBlock = styled.div.withConfig({
  displayName: 'StyledLoadingBlock',
  componentId: 'DashboardScreen_StyledLoadingBlock',
})`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm}px;
`;

export {
  StyledHomeContainer,
  StyledContent,
  StyledWelcomeSection,
  StyledWelcomeMessage,
  StyledWelcomeMeta,
  StyledHeroPanel,
  StyledBadgeRow,
  StyledSection,
  StyledSectionHeader,
  StyledSectionTitleGroup,
  StyledSectionMeta,
  StyledSectionBody,
  StyledStatusStrip,
  StyledQuickActions,
  StyledChecklist,
  StyledChecklistItemContent,
  StyledChecklistFooter,
  StyledStatGrid,
  StyledValueGrid,
  StyledModuleGrid,
  StyledPlanRow,
  StyledPlanActions,
  StyledActivityMeta,
  StyledHelpGrid,
  StyledCardWrapper,
  StyledStatCardContent,
  StyledStatValueRow,
  StyledCapacityList,
  StyledCapacityItem,
  StyledCapacityHeader,
  StyledSectionGrid,
  StyledCardHeaderContent,
  StyledList,
  StyledListItem,
  StyledListItemContent,
  StyledListItemMeta,
  StyledStateWrapper,
  StyledLoadingGrid,
  StyledLoadingBlock,
};
