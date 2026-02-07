/**
 * MobileSidebar Styles - iOS
 * File: MobileSidebar/MobileSidebar.ios.styles.jsx
 */
import styled from 'styled-components/native';
import { View, Pressable, Text } from 'react-native';

const StyledMobileSidebarWrap = styled(View).withConfig({
  displayName: 'StyledMobileSidebarWrap',
  componentId: 'StyledMobileSidebarWrap',
})`
  flex: 1;
  flex-direction: row;
`;

const StyledMobileSidebarPanel = styled(View).withConfig({
  displayName: 'StyledMobileSidebarPanel',
  componentId: 'StyledMobileSidebarPanel',
})`
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 280px;
  max-width: 85%;
  background-color: ${({ theme }) => theme.colors.background.primary};
  flex-direction: column;
  elevation: 8;
  shadow-color: #000;
  shadow-offset: 2px 0;
  shadow-opacity: 0.2;
  shadow-radius: 8px;
`;

const StyledMobileSidebarBackdrop = styled(Pressable).withConfig({
  displayName: 'StyledMobileSidebarBackdrop',
  componentId: 'StyledMobileSidebarBackdrop',
})`
  flex: 1;
  background-color: ${({ theme }) => theme.colors.overlay?.backdrop ?? 'rgba(0,0,0,0.4)'};
`;

const StyledMobileSidebarHeader = styled(View).withConfig({
  displayName: 'StyledMobileSidebarHeader',
  componentId: 'StyledMobileSidebarHeader',
})`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: ${({ theme }) => theme.spacing.md}px;
  border-bottom-width: 1px;
  border-bottom-color: ${({ theme }) => theme.colors.background.tertiary};
`;

const StyledMobileSidebarHeaderBrand = styled(View).withConfig({
  displayName: 'StyledMobileSidebarHeaderBrand',
  componentId: 'StyledMobileSidebarHeaderBrand',
})`
  flex: 1;
  min-width: 0;
  margin-right: ${({ theme }) => theme.spacing.sm}px;
`;

const StyledMobileSidebarContent = styled(View).withConfig({
  displayName: 'StyledMobileSidebarContent',
  componentId: 'StyledMobileSidebarContent',
})`
  flex: 1;
  min-height: 0;
`;

const StyledMobileCloseButton = styled(Pressable).withConfig({
  displayName: 'StyledMobileCloseButton',
  componentId: 'StyledMobileCloseButton',
})`
  min-width: 44px;
  min-height: 44px;
  border-radius: ${({ theme }) => theme.radius.md}px;
  border-width: 1px;
  border-color: ${({ theme }) => theme.colors.background.tertiary};
  background-color: ${({ theme }) => theme.colors.background.secondary};
  align-items: center;
  justify-content: center;
`;

const StyledMobileCloseButtonText = styled(Text).withConfig({
  displayName: 'StyledMobileCloseButtonText',
  componentId: 'StyledMobileCloseButtonText',
})`
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: ${({ theme }) => theme.typography?.fontSize?.md ?? 16}px;
  font-weight: ${({ theme }) => theme.typography?.fontWeight?.semibold ?? 600};
`;

export {
  StyledMobileSidebarWrap,
  StyledMobileSidebarPanel,
  StyledMobileSidebarBackdrop,
  StyledMobileSidebarHeader,
  StyledMobileSidebarHeaderBrand,
  StyledMobileSidebarContent,
  StyledMobileCloseButton,
  StyledMobileCloseButtonText,
};
