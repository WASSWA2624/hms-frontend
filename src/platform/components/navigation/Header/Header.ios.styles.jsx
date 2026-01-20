/**
 * Header Component Styles - iOS
 * Styled-components for Header iOS implementation
 * File: Header.ios.styles.jsx
 */
import styled from 'styled-components/native';
import { View, Pressable, TextInput, Text } from 'react-native';

const StyledHeader = styled(View).withConfig({
  displayName: 'StyledHeader',
  componentId: 'StyledHeader',
})`
  background-color: ${({ theme }) => theme.colors.background.primary};
  border-bottom-width: 1px;
  border-bottom-color: ${({ theme }) => theme.colors.background.tertiary};
  padding: ${({ theme }) => theme.spacing.md}px;
  shadow-color: #000;
  shadow-offset: 0px 2px;
  shadow-opacity: 0.1;
  shadow-radius: 4px;
`;

const StyledHeaderContent = styled(View).withConfig({
  displayName: 'StyledHeaderContent',
  componentId: 'StyledHeaderContent',
})`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing.sm}px;
`;

const StyledLogo = styled(Pressable).withConfig({
  displayName: 'StyledLogo',
  componentId: 'StyledLogo',
})`
  padding: ${({ theme }) => theme.spacing.sm}px;
  min-width: 100px;
`;

const StyledSearchContainer = styled(View).withConfig({
  displayName: 'StyledSearchContainer',
  componentId: 'StyledSearchContainer',
})`
  flex: 1;
  flex-direction: row;
  align-items: center;
  background-color: ${({ theme }) => theme.colors.background.secondary};
  border-radius: ${({ theme }) => theme.radius.md}px;
  padding: ${({ theme }) => theme.spacing.sm}px ${({ theme }) => theme.spacing.md}px;
  gap: ${({ theme }) => theme.spacing.sm}px;
  border-width: 1px;
  border-color: ${({ theme }) => theme.colors.background.tertiary};
`;

const StyledSearchIcon = styled(Text).withConfig({
  displayName: 'StyledSearchIcon',
  componentId: 'StyledSearchIcon',
})`
  font-size: 16px;
  color: ${({ theme }) => theme.colors.text.tertiary};
`;

const StyledSearchInput = styled(TextInput).withConfig({
  displayName: 'StyledSearchInput',
  componentId: 'StyledSearchInput',
})`
  flex: 1;
  font-size: ${({ theme }) => theme.typography.fontSize.md}px;
  color: ${({ theme }) => theme.colors.text.primary};
  padding: ${({ theme }) => theme.spacing.xs}px;
`;

const StyledActionsContainer = styled(View).withConfig({
  displayName: 'StyledActionsContainer',
  componentId: 'StyledActionsContainer',
})`
  flex-direction: row;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm}px;
`;

const StyledActionButton = styled(Pressable).withConfig({
  displayName: 'StyledActionButton',
  componentId: 'StyledActionButton',
})`
  padding: ${({ theme }) => theme.spacing.sm}px;
  min-width: 44px;
  min-height: 44px;
  align-items: center;
  justify-content: center;
  border-radius: ${({ theme }) => theme.radius.md}px;
  background-color: transparent;
`;

const StyledCartButton = styled(StyledActionButton)`
  position: relative;
`;

const StyledUserMenuButton = styled(Pressable).withConfig({
  displayName: 'StyledUserMenuButton',
  componentId: 'StyledUserMenuButton',
})`
  padding: ${({ theme }) => theme.spacing.xs}px;
  border-radius: ${({ theme }) => theme.radius.full}px;
  background-color: transparent;
`;

const StyledMobileMenuButton = styled(Pressable).withConfig({
  displayName: 'StyledMobileMenuButton',
  componentId: 'StyledMobileMenuButton',
})`
  padding: ${({ theme }) => theme.spacing.sm}px;
  min-width: 44px;
  min-height: 44px;
  align-items: center;
  justify-content: center;
  border-radius: ${({ theme }) => theme.radius.md}px;
  background-color: transparent;
`;

export {
  StyledHeader,
  StyledHeaderContent,
  StyledLogo,
  StyledSearchContainer,
  StyledSearchInput,
  StyledSearchIcon,
  StyledActionsContainer,
  StyledActionButton,
  StyledCartButton,
  StyledUserMenuButton,
  StyledMobileMenuButton,
};

