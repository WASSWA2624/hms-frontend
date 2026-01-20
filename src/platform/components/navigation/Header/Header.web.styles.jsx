/**
 * Header Component Styles - Web
 * Styled-components for Header web implementation
 * File: Header.web.styles.jsx
 */
import styled from 'styled-components';
import { View, Pressable, TextInput, Text } from 'react-native';

const StyledHeader = styled(View).withConfig({
  displayName: 'StyledHeader',
  componentId: 'StyledHeader',
})`
  background-color: ${({ theme }) => theme.colors.background.primary};
  border-bottom-width: 1px;
  border-bottom-color: ${({ theme }) => theme.colors.background.tertiary};
  padding: ${({ theme }) => theme.spacing.md}px;
  position: sticky;
  top: 0;
  z-index: 1000;
  box-shadow: ${({ theme, variant }) =>
    variant === 'transparent' ? 'none' : `0 2px 4px ${theme.colors.background.tertiary}`};
`;

const StyledHeaderContent = styled(View).withConfig({
  displayName: 'StyledHeaderContent',
  componentId: 'StyledHeaderContent',
})`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  max-width: 1200px;
  width: 100%;
  margin: 0 auto;
  gap: ${({ theme }) => theme.spacing.md}px;
`;

const StyledLogo = styled(Pressable).withConfig({
  displayName: 'StyledLogo',
  componentId: 'StyledLogo',
})`
  padding: ${({ theme }) => theme.spacing.sm}px;
  min-width: 120px;
`;

const StyledSearchContainer = styled(View).withConfig({
  displayName: 'StyledSearchContainer',
  componentId: 'StyledSearchContainer',
})`
  flex: 1;
  max-width: 600px;
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
  border: none;
  outline: none;
  background: transparent;

  &::placeholder {
    color: ${({ theme }) => theme.colors.text.tertiary};
  }

  &:focus {
    outline: none;
  }
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

  &:hover {
    background-color: ${({ theme }) => theme.colors.background.secondary};
  }

  &:active {
    background-color: ${({ theme }) => theme.colors.background.tertiary};
  }
`;

const StyledCartButton = styled(StyledActionButton)`
  position: relative;
`;

const StyledUserMenu = styled(View).withConfig({
  displayName: 'StyledUserMenu',
  componentId: 'StyledUserMenu',
})`
  position: relative;
`;

const StyledUserMenuButton = styled(Pressable).withConfig({
  displayName: 'StyledUserMenuButton',
  componentId: 'StyledUserMenuButton',
})`
  padding: ${({ theme }) => theme.spacing.xs}px;
  border-radius: ${({ theme }) => theme.radius.full}px;
  background-color: transparent;

  &:hover {
    background-color: ${({ theme }) => theme.colors.background.secondary};
  }
`;

const StyledUserMenuDropdown = styled(View).withConfig({
  displayName: 'StyledUserMenuDropdown',
  componentId: 'StyledUserMenuDropdown',
})`
  position: absolute;
  top: calc(100% + ${({ theme }) => theme.spacing.sm}px);
  right: 0;
  background-color: ${({ theme }) => theme.colors.background.primary};
  border-radius: ${({ theme }) => theme.radius.md}px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  min-width: 200px;
  padding: ${({ theme }) => theme.spacing.xs}px;
  z-index: 1001;
  border-width: 1px;
  border-color: ${({ theme }) => theme.colors.background.tertiary};
`;

const StyledUserMenuItem = styled(Pressable).withConfig({
  displayName: 'StyledUserMenuItem',
  componentId: 'StyledUserMenuItem',
})`
  padding: ${({ theme }) => theme.spacing.md}px;
  border-radius: ${({ theme }) => theme.radius.sm}px;

  &:hover {
    background-color: ${({ theme }) => theme.colors.background.secondary};
  }

  &:active {
    background-color: ${({ theme }) => theme.colors.background.tertiary};
  }
`;

const StyledMobileMenuButton = styled(Pressable).withConfig({
  displayName: 'StyledMobileMenuButton',
  componentId: 'StyledMobileMenuButton',
})`
  display: none;
  padding: ${({ theme }) => theme.spacing.sm}px;
  min-width: 44px;
  min-height: 44px;
  align-items: center;
  justify-content: center;
  border-radius: ${({ theme }) => theme.radius.md}px;
  background-color: transparent;

  @media (max-width: 768px) {
    display: flex;
  }

  &:active {
    background-color: ${({ theme }) => theme.colors.background.secondary};
  }
`;

const StyledMobileMenu = styled(View).withConfig({
  displayName: 'StyledMobileMenu',
  componentId: 'StyledMobileMenu',
})`
  display: none;
  flex-direction: column;
  background-color: ${({ theme }) => theme.colors.background.primary};
  border-top-width: 1px;
  border-top-color: ${({ theme }) => theme.colors.background.tertiary};
  padding: ${({ theme }) => theme.spacing.md}px;
  gap: ${({ theme }) => theme.spacing.sm}px;

  @media (max-width: 768px) {
    display: flex;
  }
`;

const StyledMobileMenuItem = styled(Pressable).withConfig({
  displayName: 'StyledMobileMenuItem',
  componentId: 'StyledMobileMenuItem',
})`
  padding: ${({ theme }) => theme.spacing.md}px;
  border-radius: ${({ theme }) => theme.radius.sm}px;

  &:active {
    background-color: ${({ theme }) => theme.colors.background.secondary};
  }
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
  StyledUserMenu,
  StyledUserMenuButton,
  StyledUserMenuDropdown,
  StyledUserMenuItem,
  StyledMobileMenuButton,
  StyledMobileMenu,
  StyledMobileMenuItem,
};

