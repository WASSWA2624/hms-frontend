/**
 * DashboardScreen iOS Styles
 * Styled-components for iOS platform
 * File: DashboardScreen.ios.styles.jsx
 */
import styled from 'styled-components/native';
import { ScrollView, View } from 'react-native';

const StyledScrollView = styled(ScrollView).withConfig({
  displayName: 'StyledScrollView',
  componentId: 'DashboardScreen_StyledScrollView',
}).attrs({
  contentContainerStyle: { flexGrow: 1 },
})`
  flex: 1;
`;

const StyledHomeContainer = styled(View).withConfig({
  displayName: 'StyledHomeContainer',
  componentId: 'DashboardScreen_StyledHomeContainer',
})`
  flex: 1;
  width: 100%;
  min-height: 100%;
  background-color: ${({ theme }) => theme.colors.background.primary};
  padding: ${({ theme }) => theme.spacing.lg}px;
`;

const StyledContent = styled(View).withConfig({
  displayName: 'StyledContent',
  componentId: 'DashboardScreen_StyledContent',
})`
  flex: 1;
  width: 100%;
  gap: ${({ theme }) => theme.spacing.lg}px;
`;

const StyledWelcomeSection = styled(View).withConfig({
  displayName: 'StyledWelcomeSection',
  componentId: 'DashboardScreen_StyledWelcomeSection',
})`
  width: 100%;
  gap: ${({ theme }) => theme.spacing.sm}px;
`;

const StyledWelcomeMessage = styled(View).withConfig({
  displayName: 'StyledWelcomeMessage',
  componentId: 'DashboardScreen_StyledWelcomeMessage',
})`
  gap: ${({ theme }) => theme.spacing.xs}px;
`;

const StyledWelcomeMeta = styled(View).withConfig({
  displayName: 'StyledWelcomeMeta',
  componentId: 'DashboardScreen_StyledWelcomeMeta',
})`
  margin-top: ${({ theme }) => theme.spacing.xs}px;
  gap: ${({ theme }) => theme.spacing.xs}px;
`;

const StyledHeroPanel = styled(View).withConfig({
  displayName: 'StyledHeroPanel',
  componentId: 'DashboardScreen_StyledHeroPanel',
})`
  background-color: ${({ theme }) => theme.colors.background.secondary};
  border-radius: ${({ theme }) => theme.radius.lg}px;
  padding: ${({ theme }) => theme.spacing.lg}px;
  border-width: 1px;
  border-color: ${({ theme }) => theme.colors.background.tertiary};
`;

const StyledBadgeRow = styled(View).withConfig({
  displayName: 'StyledBadgeRow',
  componentId: 'DashboardScreen_StyledBadgeRow',
})`
  flex-direction: row;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing.xs}px;
`;

const StyledSection = styled(View).withConfig({
  displayName: 'StyledSection',
  componentId: 'DashboardScreen_StyledSection',
})`
  gap: ${({ theme }) => theme.spacing.sm}px;
`;

const StyledSectionHeader = styled(View).withConfig({
  displayName: 'StyledSectionHeader',
  componentId: 'DashboardScreen_StyledSectionHeader',
})`
  margin-bottom: ${({ theme }) => theme.spacing.md}px;
`;

const StyledSectionTitleGroup = styled(View).withConfig({
  displayName: 'StyledSectionTitleGroup',
  componentId: 'DashboardScreen_StyledSectionTitleGroup',
})`
  margin-bottom: ${({ theme }) => theme.spacing.xs}px;
`;

const StyledSectionMeta = styled(View).withConfig({
  displayName: 'StyledSectionMeta',
  componentId: 'DashboardScreen_StyledSectionMeta',
})`
  margin-top: ${({ theme }) => theme.spacing.xs}px;
`;

const StyledSectionBody = styled(View).withConfig({
  displayName: 'StyledSectionBody',
  componentId: 'DashboardScreen_StyledSectionBody',
})`
  width: 100%;
  gap: ${({ theme }) => theme.spacing.sm}px;
`;

const StyledStatusStrip = styled(View).withConfig({
  displayName: 'StyledStatusStrip',
  componentId: 'DashboardScreen_StyledStatusStrip',
})`
  gap: ${({ theme }) => theme.spacing.sm}px;
`;

const StyledQuickActions = styled(View).withConfig({
  displayName: 'StyledQuickActions',
  componentId: 'DashboardScreen_StyledQuickActions',
})`
  flex-direction: row;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing.sm}px;
`;

const StyledChecklist = styled(View).withConfig({
  displayName: 'StyledChecklist',
  componentId: 'DashboardScreen_StyledChecklist',
})`
  gap: ${({ theme }) => theme.spacing.xs}px;
`;

const StyledChecklistItemContent = styled(View).withConfig({
  displayName: 'StyledChecklistItemContent',
  componentId: 'DashboardScreen_StyledChecklistItemContent',
})`
  flex: 1;
  gap: ${({ theme }) => theme.spacing.xs}px;
`;

const StyledChecklistFooter = styled(View).withConfig({
  displayName: 'StyledChecklistFooter',
  componentId: 'DashboardScreen_StyledChecklistFooter',
})`
  margin-top: ${({ theme }) => theme.spacing.sm}px;
  gap: ${({ theme }) => theme.spacing.sm}px;
`;

const StyledStatGrid = styled(View).withConfig({
  displayName: 'StyledStatGrid',
  componentId: 'DashboardScreen_StyledStatGrid',
})`
  width: 100%;
`;

const StyledValueGrid = styled(View).withConfig({
  displayName: 'StyledValueGrid',
  componentId: 'DashboardScreen_StyledValueGrid',
})`
  gap: ${({ theme }) => theme.spacing.sm}px;
`;

const StyledModuleGrid = styled(View).withConfig({
  displayName: 'StyledModuleGrid',
  componentId: 'DashboardScreen_StyledModuleGrid',
})`
  gap: ${({ theme }) => theme.spacing.md}px;
`;

const StyledPlanRow = styled(View).withConfig({
  displayName: 'StyledPlanRow',
  componentId: 'DashboardScreen_StyledPlanRow',
})`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing.sm}px;
  margin-bottom: ${({ theme }) => theme.spacing.sm}px;
`;

const StyledPlanActions = styled(View).withConfig({
  displayName: 'StyledPlanActions',
  componentId: 'DashboardScreen_StyledPlanActions',
})`
  flex-direction: row;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing.sm}px;
`;

const StyledActivityMeta = styled(View).withConfig({
  displayName: 'StyledActivityMeta',
  componentId: 'DashboardScreen_StyledActivityMeta',
})`
  margin-left: ${({ theme }) => theme.spacing.sm}px;
`;

const StyledHelpGrid = styled(View).withConfig({
  displayName: 'StyledHelpGrid',
  componentId: 'DashboardScreen_StyledHelpGrid',
})`
  gap: ${({ theme }) => theme.spacing.md}px;
`;

const StyledCardWrapper = styled(View).withConfig({
  displayName: 'StyledCardWrapper',
  componentId: 'DashboardScreen_StyledCardWrapper',
})`
  margin-bottom: ${({ theme }) => theme.spacing.md}px;
`;

const StyledStatCardContent = styled(View).withConfig({
  displayName: 'StyledStatCardContent',
  componentId: 'DashboardScreen_StyledStatCardContent',
})`
  width: 100%;
  gap: ${({ theme }) => theme.spacing.sm}px;
`;

const StyledStatValueRow = styled(View).withConfig({
  displayName: 'StyledStatValueRow',
  componentId: 'DashboardScreen_StyledStatValueRow',
})`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  margin-top: ${({ theme }) => theme.spacing.xs}px;
`;

const StyledCapacityList = styled(View).withConfig({
  displayName: 'StyledCapacityList',
  componentId: 'DashboardScreen_StyledCapacityList',
})`
  width: 100%;
`;

const StyledCapacityItem = styled(View).withConfig({
  displayName: 'StyledCapacityItem',
  componentId: 'DashboardScreen_StyledCapacityItem',
})`
  margin-bottom: ${({ theme }) => theme.spacing.md}px;
`;

const StyledCapacityHeader = styled(View).withConfig({
  displayName: 'StyledCapacityHeader',
  componentId: 'DashboardScreen_StyledCapacityHeader',
})`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  margin-bottom: ${({ theme }) => theme.spacing.xs}px;
`;

const StyledSectionGrid = styled(View).withConfig({
  displayName: 'StyledSectionGrid',
  componentId: 'DashboardScreen_StyledSectionGrid',
})`
  width: 100%;
  gap: ${({ theme }) => theme.spacing.md}px;
`;

const StyledCardHeaderContent = styled(View).withConfig({
  displayName: 'StyledCardHeaderContent',
  componentId: 'DashboardScreen_StyledCardHeaderContent',
})`
  width: 100%;
  gap: ${({ theme }) => theme.spacing.xs}px;
`;

const StyledList = styled(View).withConfig({
  displayName: 'StyledList',
  componentId: 'DashboardScreen_StyledList',
})`
  width: 100%;
`;

const StyledListItem = styled(View).withConfig({
  displayName: 'StyledListItem',
  componentId: 'DashboardScreen_StyledListItem',
})`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding-top: ${({ theme }) => theme.spacing.sm}px;
  padding-bottom: ${({ theme }) => theme.spacing.sm}px;
  border-bottom-width: 1px;
  border-bottom-color: ${({ theme }) => theme.colors.background.tertiary};
`;

const StyledListItemContent = styled(View).withConfig({
  displayName: 'StyledListItemContent',
  componentId: 'DashboardScreen_StyledListItemContent',
})`
  flex: 1;
  margin-right: ${({ theme }) => theme.spacing.sm}px;
`;

const StyledListItemMeta = styled(View).withConfig({
  displayName: 'StyledListItemMeta',
  componentId: 'DashboardScreen_StyledListItemMeta',
})`
  margin-top: ${({ theme }) => theme.spacing.xs}px;
`;

const StyledStateWrapper = styled(View).withConfig({
  displayName: 'StyledStateWrapper',
  componentId: 'DashboardScreen_StyledStateWrapper',
})`
  padding-top: ${({ theme }) => theme.spacing.xl}px;
  padding-bottom: ${({ theme }) => theme.spacing.xl}px;
`;

const StyledLoadingGrid = styled(View).withConfig({
  displayName: 'StyledLoadingGrid',
  componentId: 'DashboardScreen_StyledLoadingGrid',
})`
  width: 100%;
`;

const StyledLoadingBlock = styled(View).withConfig({
  displayName: 'StyledLoadingBlock',
  componentId: 'DashboardScreen_StyledLoadingBlock',
})`
  margin-bottom: ${({ theme }) => theme.spacing.md}px;
`;

export {
  StyledScrollView,
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
