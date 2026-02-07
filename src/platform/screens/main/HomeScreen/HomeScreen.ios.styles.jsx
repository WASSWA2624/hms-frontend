/**
 * DashboardScreen iOS Styles
 * Styled-components for iOS platform
 * File: HomeScreen.ios.styles.jsx
 */
import styled from 'styled-components/native';
import { ScrollView, View } from 'react-native';

const StyledScrollView = styled(ScrollView).attrs({
  contentContainerStyle: { flexGrow: 1 },
}).withConfig({
  displayName: 'StyledScrollView',
  componentId: 'HomeScreen_StyledScrollView',
})`
  flex: 1;
`;

const StyledHomeContainer = styled(View).withConfig({
  displayName: 'StyledHomeContainer',
  componentId: 'HomeScreen_StyledHomeContainer',
})`
  flex: 1;
  width: 100%;
  min-height: 100%;
  background-color: ${({ theme }) => theme.colors.background.primary};
  padding: ${({ theme }) => theme.spacing.lg}px;
`;

const StyledContent = styled(View).withConfig({
  displayName: 'StyledContent',
  componentId: 'HomeScreen_StyledContent',
})`
  flex: 1;
  width: 100%;
`;

const StyledWelcomeSection = styled(View).withConfig({
  displayName: 'StyledWelcomeSection',
  componentId: 'HomeScreen_StyledWelcomeSection',
})`
  width: 100%;
`;

const StyledWelcomeMessage = styled(View).withConfig({
  displayName: 'StyledWelcomeMessage',
  componentId: 'HomeScreen_StyledWelcomeMessage',
})`
  margin-top: ${({ theme }) => theme.spacing.md}px;
`;

const StyledWelcomeMeta = styled(View).withConfig({
  displayName: 'StyledWelcomeMeta',
  componentId: 'HomeScreen_StyledWelcomeMeta',
})`
  margin-top: ${({ theme }) => theme.spacing.xs}px;
`;

const StyledSection = styled(View).withConfig({
  displayName: 'StyledSection',
  componentId: 'HomeScreen_StyledSection',
})`
  margin-top: ${({ theme }) => theme.spacing.xl}px;
`;

const StyledSectionHeader = styled(View).withConfig({
  displayName: 'StyledSectionHeader',
  componentId: 'HomeScreen_StyledSectionHeader',
})`
  margin-bottom: ${({ theme }) => theme.spacing.md}px;
`;

const StyledSectionTitleGroup = styled(View).withConfig({
  displayName: 'StyledSectionTitleGroup',
  componentId: 'HomeScreen_StyledSectionTitleGroup',
})`
  margin-bottom: ${({ theme }) => theme.spacing.xs}px;
`;

const StyledSectionMeta = styled(View).withConfig({
  displayName: 'StyledSectionMeta',
  componentId: 'HomeScreen_StyledSectionMeta',
})`
  margin-top: ${({ theme }) => theme.spacing.xs}px;
`;

const StyledSectionBody = styled(View).withConfig({
  displayName: 'StyledSectionBody',
  componentId: 'HomeScreen_StyledSectionBody',
})`
  width: 100%;
`;

const StyledStatGrid = styled(View).withConfig({
  displayName: 'StyledStatGrid',
  componentId: 'HomeScreen_StyledStatGrid',
})`
  width: 100%;
`;

const StyledCardWrapper = styled(View).withConfig({
  displayName: 'StyledCardWrapper',
  componentId: 'HomeScreen_StyledCardWrapper',
})`
  margin-bottom: ${({ theme }) => theme.spacing.md}px;
`;

const StyledStatCardContent = styled(View).withConfig({
  displayName: 'StyledStatCardContent',
  componentId: 'HomeScreen_StyledStatCardContent',
})`
  width: 100%;
`;

const StyledStatValueRow = styled(View).withConfig({
  displayName: 'StyledStatValueRow',
  componentId: 'HomeScreen_StyledStatValueRow',
})`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  margin-top: ${({ theme }) => theme.spacing.xs}px;
`;

const StyledCapacityList = styled(View).withConfig({
  displayName: 'StyledCapacityList',
  componentId: 'HomeScreen_StyledCapacityList',
})`
  width: 100%;
`;

const StyledCapacityItem = styled(View).withConfig({
  displayName: 'StyledCapacityItem',
  componentId: 'HomeScreen_StyledCapacityItem',
})`
  margin-bottom: ${({ theme }) => theme.spacing.md}px;
`;

const StyledCapacityHeader = styled(View).withConfig({
  displayName: 'StyledCapacityHeader',
  componentId: 'HomeScreen_StyledCapacityHeader',
})`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  margin-bottom: ${({ theme }) => theme.spacing.xs}px;
`;

const StyledSectionGrid = styled(View).withConfig({
  displayName: 'StyledSectionGrid',
  componentId: 'HomeScreen_StyledSectionGrid',
})`
  width: 100%;
`;

const StyledCardHeaderContent = styled(View).withConfig({
  displayName: 'StyledCardHeaderContent',
  componentId: 'HomeScreen_StyledCardHeaderContent',
})`
  width: 100%;
`;

const StyledList = styled(View).withConfig({
  displayName: 'StyledList',
  componentId: 'HomeScreen_StyledList',
})`
  width: 100%;
`;

const StyledListItem = styled(View).withConfig({
  displayName: 'StyledListItem',
  componentId: 'HomeScreen_StyledListItem',
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
  componentId: 'HomeScreen_StyledListItemContent',
})`
  flex: 1;
  margin-right: ${({ theme }) => theme.spacing.sm}px;
`;

const StyledListItemMeta = styled(View).withConfig({
  displayName: 'StyledListItemMeta',
  componentId: 'HomeScreen_StyledListItemMeta',
})`
  margin-top: ${({ theme }) => theme.spacing.xs}px;
`;

const StyledStateWrapper = styled(View).withConfig({
  displayName: 'StyledStateWrapper',
  componentId: 'HomeScreen_StyledStateWrapper',
})`
  padding-top: ${({ theme }) => theme.spacing.xl}px;
  padding-bottom: ${({ theme }) => theme.spacing.xl}px;
`;

const StyledLoadingGrid = styled(View).withConfig({
  displayName: 'StyledLoadingGrid',
  componentId: 'HomeScreen_StyledLoadingGrid',
})`
  width: 100%;
`;

const StyledLoadingBlock = styled(View).withConfig({
  displayName: 'StyledLoadingBlock',
  componentId: 'HomeScreen_StyledLoadingBlock',
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
  StyledSection,
  StyledSectionHeader,
  StyledSectionTitleGroup,
  StyledSectionMeta,
  StyledSectionBody,
  StyledStatGrid,
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

