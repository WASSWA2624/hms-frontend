/**
 * NotificationsScreen styles
 * Shared styled components for NotificationsScreen.
 * File: NotificationsScreen.styles.jsx
 */

import styled from 'styled-components';
import { View } from 'react-native';

const StyledScreenContainer = styled(View).withConfig({
  displayName: 'StyledScreenContainer',
})`
  width: 100%;
  max-width: 1080px;
  align-self: center;
  padding-top: ${({ theme }) => theme.spacing.md}px;
  padding-bottom: ${({ theme }) => theme.spacing.xl}px;
`;

const StyledHeader = styled(View).withConfig({
  displayName: 'StyledHeader',
})`
  margin-bottom: ${({ theme }) => theme.spacing.md}px;
`;

const StyledHeaderTopRow = styled(View).withConfig({
  displayName: 'StyledHeaderTopRow',
})`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
`;

const StyledHeaderSubtitle = styled(View).withConfig({
  displayName: 'StyledHeaderSubtitle',
})`
  margin-top: ${({ theme }) => theme.spacing.xs}px;
`;

const StyledActionsRow = styled(View).withConfig({
  displayName: 'StyledActionsRow',
})`
  margin-top: ${({ theme }) => theme.spacing.md}px;
  flex-direction: row;
  align-items: center;
  flex-wrap: wrap;
`;

const StyledActionButtonWrap = styled(View).withConfig({
  displayName: 'StyledActionButtonWrap',
})`
  margin-right: ${({ theme }) => theme.spacing.sm}px;
  margin-bottom: ${({ theme }) => theme.spacing.sm}px;
`;

const StyledList = styled(View).withConfig({
  displayName: 'StyledList',
})`
  width: 100%;
`;

const StyledCardWrap = styled(View).withConfig({
  displayName: 'StyledCardWrap',
})`
  margin-bottom: ${({ theme }) => theme.spacing.md}px;
`;

const StyledCardHeaderRow = styled(View).withConfig({
  displayName: 'StyledCardHeaderRow',
})`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
`;

const StyledCardHeaderGroup = styled(View).withConfig({
  displayName: 'StyledCardHeaderGroup',
})`
  flex-direction: row;
  align-items: center;
  flex-wrap: wrap;
`;

const StyledCardBadgeWrap = styled(View).withConfig({
  displayName: 'StyledCardBadgeWrap',
})`
  margin-right: ${({ theme }) => theme.spacing.xs}px;
  margin-bottom: ${({ theme }) => theme.spacing.xs}px;
`;

const StyledCardContent = styled(View).withConfig({
  displayName: 'StyledCardContent',
})`
  margin-top: ${({ theme }) => theme.spacing.sm}px;
`;

const StyledCardMessage = styled(View).withConfig({
  displayName: 'StyledCardMessage',
})`
  margin-top: ${({ theme }) => theme.spacing.xs}px;
`;

const StyledCardFooter = styled(View).withConfig({
  displayName: 'StyledCardFooter',
})`
  margin-top: ${({ theme }) => theme.spacing.sm}px;
`;

const StyledCardButtons = styled(View).withConfig({
  displayName: 'StyledCardButtons',
})`
  margin-top: ${({ theme }) => theme.spacing.sm}px;
  flex-direction: row;
  align-items: center;
  flex-wrap: wrap;
`;

const StyledStateContainer = styled(View).withConfig({
  displayName: 'StyledStateContainer',
})`
  margin-top: ${({ theme }) => theme.spacing.lg}px;
`;

const StyledSkeletonBlock = styled(View).withConfig({
  displayName: 'StyledSkeletonBlock',
})`
  margin-bottom: ${({ theme }) => theme.spacing.md}px;
`;

const StyledRefreshError = styled(View).withConfig({
  displayName: 'StyledRefreshError',
})`
  margin-top: ${({ theme }) => theme.spacing.xs}px;
`;

export {
  StyledActionButtonWrap,
  StyledActionsRow,
  StyledCardBadgeWrap,
  StyledCardButtons,
  StyledCardContent,
  StyledCardFooter,
  StyledCardHeaderGroup,
  StyledCardHeaderRow,
  StyledCardMessage,
  StyledCardWrap,
  StyledHeader,
  StyledHeaderSubtitle,
  StyledHeaderTopRow,
  StyledList,
  StyledRefreshError,
  StyledScreenContainer,
  StyledSkeletonBlock,
  StyledStateContainer,
};
