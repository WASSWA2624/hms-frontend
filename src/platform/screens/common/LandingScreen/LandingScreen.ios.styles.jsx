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
    paddingTop: theme.spacing.md,
    paddingBottom: theme.spacing.lg,
  },
}))`
  flex: 1;
`;

const StyledContent = styled(View).withConfig({
  displayName: 'StyledContent',
  componentId: 'StyledContent',
})`
  width: 100%;
  max-width: 980px;
  align-self: center;
`;

const StyledEmbeddedContent = styled(View).withConfig({
  displayName: 'StyledEmbeddedContent',
  componentId: 'StyledEmbeddedContent',
})`
  width: 100%;
  padding-horizontal: ${({ theme }) => theme.spacing.lg}px;
  padding-top: ${({ theme }) => theme.spacing.xs}px;
  padding-bottom: ${({ theme }) => theme.spacing.xs}px;
`;

const StyledSection = styled(View).withConfig({
  displayName: 'StyledSection',
  componentId: 'StyledSection',
})`
  margin-bottom: ${({ theme }) => theme.spacing.sm}px;
  padding: ${({ theme }) => theme.spacing.sm}px;
  border-radius: ${({ theme }) => theme.radius?.md ?? 10}px;
  border-width: 1px;
  border-color: ${({ theme }) => theme.colors.background.tertiary};
  background-color: ${({ theme }) => theme.colors.background.primary};
`;

const StyledOptionsList = styled(View).withConfig({
  displayName: 'StyledOptionsList',
  componentId: 'StyledOptionsList',
})`
  margin-top: ${({ theme }) => theme.spacing.xs}px;
`;

const StyledOptionButton = styled(Pressable).withConfig({
  displayName: 'StyledOptionButton',
  componentId: 'StyledOptionButton',
  shouldForwardProp: (prop) => prop !== '$selected',
})`
  min-height: 52px;
  padding: ${({ theme }) => theme.spacing.xs}px ${({ theme }) => theme.spacing.md}px;
  border-radius: ${({ theme }) => theme.radius?.sm ?? 8}px;
  border-width: 1px;
  border-color: ${({ theme, $selected }) =>
    ($selected ? theme.colors.primary : theme.colors.background.tertiary)};
  background-color: ${({ theme, $selected }) =>
    ($selected ? theme.colors.background.secondary : theme.colors.background.primary)};
  flex-direction: row;
  align-items: center;
  margin-bottom: ${({ theme }) => theme.spacing.xs}px;
  shadow-color: #08224a;
  shadow-offset: 0px 1px;
  shadow-opacity: ${({ $selected }) => ($selected ? 0.14 : 0.08)};
  shadow-radius: ${({ $selected }) => ($selected ? 6 : 4)}px;
  elevation: ${({ $selected }) => ($selected ? 4 : 2)};
`;

const StyledOptionIcon = styled(View).withConfig({
  displayName: 'StyledOptionIcon',
  componentId: 'StyledOptionIcon',
})`
  width: 24px;
  height: 24px;
  border-radius: ${({ theme }) => theme.radius?.full ?? 9999}px;
  align-items: center;
  justify-content: center;
  margin-right: ${({ theme }) => theme.spacing.xs}px;
  border-width: 1px;
  border-color: ${({ theme }) => `${theme.colors.primary}4a`};
  background-color: ${({ theme }) => `${theme.colors.primary}14`};
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
  margin-top: ${({ theme }) => theme.spacing.xs}px;
  margin-bottom: ${({ theme }) => theme.spacing.sm}px;
  padding-top: ${({ theme }) => theme.spacing.sm}px;
  border-top-width: 1px;
  border-top-color: ${({ theme }) => theme.colors.background.tertiary};
`;

const StyledCTAProceedAction = styled(View).withConfig({
  displayName: 'StyledCTAProceedAction',
  componentId: 'StyledCTAProceedAction',
})`
  width: 100%;
`;

export {
  StyledContainer,
  StyledScroll,
  StyledContent,
  StyledEmbeddedContent,
  StyledSection,
  StyledOptionsList,
  StyledOptionButton,
  StyledOptionIcon,
  StyledOptionIndicator,
  StyledHelperText,
  StyledCTA,
  StyledCTAProceedAction,
};
