/**
 * LandingScreen iOS Styles
 * File: LandingScreen.ios.styles.jsx
 */

import styled from 'styled-components/native';
import { View, ScrollView, Pressable } from 'react-native';

const StyledContainer = styled(View).withConfig({
  displayName: 'StyledContainer',
  componentId: 'StyledContainer',
})`
  flex: 1;
  background-color: ${({ theme }) => theme.colors.background.primary};
`;

const StyledScroll = styled(ScrollView).withConfig({
  displayName: 'StyledScroll',
  componentId: 'StyledScroll',
}).attrs(({ theme }) => ({
  contentContainerStyle: {
    flexGrow: 1,
    paddingHorizontal: theme.spacing.lg,
    paddingTop: theme.spacing.xl,
    paddingBottom: theme.spacing.xl,
  },
}))`
  flex: 1;
`;

const StyledContent = styled(View).withConfig({
  displayName: 'StyledContent',
  componentId: 'StyledContent',
})`
  flex: 1;
`;

const StyledHero = styled(View).withConfig({
  displayName: 'StyledHero',
  componentId: 'StyledHero',
})`
  margin-bottom: ${({ theme }) => theme.spacing.lg}px;
`;

const StyledSection = styled(View).withConfig({
  displayName: 'StyledSection',
  componentId: 'StyledSection',
})`
  margin-bottom: ${({ theme }) => theme.spacing.lg}px;
`;

const StyledOptionsList = styled(View).withConfig({
  displayName: 'StyledOptionsList',
  componentId: 'StyledOptionsList',
})`
  margin-top: ${({ theme }) => theme.spacing.sm}px;
`;

const StyledOptionButton = styled(Pressable).withConfig({
  displayName: 'StyledOptionButton',
  componentId: 'StyledOptionButton',
  shouldForwardProp: (prop) => prop !== '$selected',
})`
  min-height: 44px;
  padding: ${({ theme }) => theme.spacing.sm}px ${({ theme }) => theme.spacing.md}px;
  border-radius: ${({ theme }) => theme.radius?.sm ?? 4}px;
  border-width: 1px;
  border-color: ${({ theme, $selected }) =>
    ($selected ? theme.colors.primary : theme.colors.background.tertiary)};
  background-color: ${({ theme, $selected }) =>
    ($selected ? theme.colors.background.secondary : theme.colors.background.primary)};
  flex-direction: row;
  align-items: center;
  margin-bottom: ${({ theme }) => theme.spacing.sm}px;
`;

const StyledOptionIndicator = styled(View).withConfig({
  displayName: 'StyledOptionIndicator',
  componentId: 'StyledOptionIndicator',
  shouldForwardProp: (prop) => prop !== '$selected',
})`
  width: ${({ theme }) => theme.spacing.sm + theme.spacing.xs}px;
  height: ${({ theme }) => theme.spacing.sm + theme.spacing.xs}px;
  border-radius: ${({ theme }) => theme.radius?.full ?? 9999}px;
  border-width: 2px;
  border-color: ${({ theme, $selected }) =>
    ($selected ? theme.colors.primary : theme.colors.background.tertiary)};
  background-color: ${({ theme, $selected }) =>
    ($selected ? theme.colors.primary : 'transparent')};
  margin-right: ${({ theme }) => theme.spacing.sm}px;
`;

const StyledHelperText = styled(View).withConfig({
  displayName: 'StyledHelperText',
  componentId: 'StyledHelperText',
})`
  margin-top: ${({ theme }) => theme.spacing.xs}px;
`;

const StyledCTA = styled(View).withConfig({
  displayName: 'StyledCTA',
  componentId: 'StyledCTA',
})`
  margin-bottom: ${({ theme }) => theme.spacing.lg}px;
`;

const StyledChecklist = styled(View).withConfig({
  displayName: 'StyledChecklist',
  componentId: 'StyledChecklist',
})`
  margin-top: ${({ theme }) => theme.spacing.sm}px;
`;

const StyledChecklistItem = styled(View).withConfig({
  displayName: 'StyledChecklistItem',
  componentId: 'StyledChecklistItem',
})`
  flex-direction: row;
  align-items: flex-start;
  margin-bottom: ${({ theme }) => theme.spacing.xs}px;
`;

const StyledChecklistBullet = styled(View).withConfig({
  displayName: 'StyledChecklistBullet',
  componentId: 'StyledChecklistBullet',
})`
  width: ${({ theme }) => theme.spacing.xs}px;
  height: ${({ theme }) => theme.spacing.xs}px;
  border-radius: ${({ theme }) => theme.radius?.full ?? 9999}px;
  background-color: ${({ theme }) => theme.colors.primary};
  margin-top: ${({ theme }) => theme.spacing.xs / 2}px;
  margin-right: ${({ theme }) => theme.spacing.xs}px;
`;

export {
  StyledContainer,
  StyledScroll,
  StyledContent,
  StyledHero,
  StyledSection,
  StyledOptionsList,
  StyledOptionButton,
  StyledOptionIndicator,
  StyledHelperText,
  StyledCTA,
  StyledChecklist,
  StyledChecklistItem,
  StyledChecklistBullet,
};
