/**
 * TenantListScreen iOS Styles
 * File: TenantListScreen.ios.styles.jsx
 */
import styled from 'styled-components/native';
import { ScrollView, View } from 'react-native';

const StyledScrollView = styled(ScrollView).attrs({
  contentContainerStyle: { flexGrow: 1 },
}).withConfig({
  displayName: 'StyledScrollView',
  componentId: 'StyledScrollView',
})`
  flex: 1;
`;

const StyledContainer = styled(View).withConfig({
  displayName: 'StyledContainer',
  componentId: 'StyledContainer',
})`
  flex: 1;
  width: 100%;
  min-height: 100%;
  background-color: ${({ theme }) => theme.colors.background.primary};
  padding: ${({ theme }) => theme.spacing.lg}px;
`;

const StyledContent = styled(View).withConfig({
  displayName: 'StyledContent',
  componentId: 'StyledContent',
})`
  flex: 1;
  width: 100%;
`;

const StyledHeaderRow = styled(View).withConfig({
  displayName: 'StyledHeaderRow',
  componentId: 'StyledHeaderRow',
})`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing.md}px;
  margin-bottom: ${({ theme }) => theme.spacing.md}px;
`;

const StyledList = styled(View).withConfig({
  displayName: 'StyledList',
  componentId: 'StyledList',
})`
  width: 100%;
`;

const StyledSeparator = styled(View).withConfig({
  displayName: 'StyledSeparator',
  componentId: 'StyledSeparator',
})`
  width: 100%;
  height: ${({ theme }) => theme.spacing.sm}px;
`;

export { StyledScrollView, StyledContainer, StyledContent, StyledHeaderRow, StyledList, StyledSeparator };
