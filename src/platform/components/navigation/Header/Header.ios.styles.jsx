/**
 * Header Component Styles - iOS
 * Theme-only; Microsoft Fluent / M365 look
 * File: Header.ios.styles.jsx
 */
import styled from 'styled-components/native';
import { View } from 'react-native';

const StyledHeader = styled(View).withConfig({
  displayName: 'StyledHeader',
  componentId: 'StyledHeader',
})`
  background-color: ${({ theme }) => theme.colors.background.primary};
  border-bottom-width: 1px;
  border-bottom-color: ${({ theme }) => theme.colors.background.tertiary};
  padding: ${({ theme }) => theme.spacing.xs}px ${({ theme }) => theme.spacing.sm}px;
  padding-top: ${({ theme, topInset }) => theme.spacing.xs + (topInset || 0)}px;
  min-height: ${({ theme }) => theme.spacing.xl}px;
  shadow-color: ${({ theme }) => theme.shadows?.sm?.shadowColor ?? '#000'};
  shadow-offset: ${({ theme }) =>
    `${theme.shadows?.sm?.shadowOffset?.width ?? 0}px ${theme.shadows?.sm?.shadowOffset?.height ?? 1}px`};
  shadow-opacity: ${({ theme }) => theme.shadows?.sm?.shadowOpacity ?? 0.1};
  shadow-radius: ${({ theme }) => theme.shadows?.sm?.shadowRadius ?? 2}px;
`;

const StyledHeaderRow = styled(View).withConfig({
  displayName: 'StyledHeaderRow',
  componentId: 'StyledHeaderRow',
})`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing.sm}px;
`;

const StyledLeadingSlot = styled(View).withConfig({
  displayName: 'StyledLeadingSlot',
  componentId: 'StyledLeadingSlot',
})`
  flex-direction: row;
  align-items: center;
`;

const StyledTitleGroup = styled(View).withConfig({
  displayName: 'StyledTitleGroup',
  componentId: 'StyledTitleGroup',
})`
  flex: 1;
  flex-direction: column;
  gap: 0;
  min-width: 0;
`;

const StyledTrailingSlot = styled(View).withConfig({
  displayName: 'StyledTrailingSlot',
  componentId: 'StyledTrailingSlot',
})`
  flex-direction: row;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs}px;
`;

export {
  StyledHeader,
  StyledHeaderRow,
  StyledLeadingSlot,
  StyledTitleGroup,
  StyledTrailingSlot,
};
