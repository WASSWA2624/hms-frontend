/**
 * Header Component - Android
 * Generic top navigation header component for Android platform
 * File: Header.android.jsx
 */
import React from 'react';
import { useRouter } from 'expo-router';
import Button from '@platform/components/forms/Button';
import Avatar from '@platform/components/display/Avatar';
import Badge from '@platform/components/display/Badge';
import Text from '@platform/components/display/Text';
import { useI18n } from '@hooks';
import useHeader from './useHeader';
import { VARIANTS } from './types';
import {
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
} from './Header.android.styles';

/**
 * Header component for Android
 * @param {Object} props - Header props
 * @param {string} props.variant - Header variant (default, transparent)
 * @param {string|React.ReactNode} props.logo - Logo content (text or component)
 * @param {Function} props.onSearch - Search handler
 * @param {Function} props.onMenuToggle - Menu toggle handler
 * @param {Function} props.onSearchSubmit - Search submit handler
 * @param {boolean} props.showSearch - Show search bar
 * @param {boolean} props.showCart - Show cart icon
 * @param {string} props.searchPlaceholder - Search input placeholder
 * @param {boolean} props.isAuthenticated - Authentication state
 * @param {Object} props.user - User object
 * @param {number} props.cartItemCount - Cart item count
 * @param {Function} props.onLogoPress - Logo press handler
 * @param {Function} props.onCartPress - Cart press handler
 * @param {Function} props.onUserMenuPress - User menu press handler
 * @param {string} props.accessibilityLabel - Accessibility label
 * @param {string} props.testID - Test identifier
 * @param {Object} props.style - Additional styles
 */
const HeaderAndroid = ({
  variant = VARIANTS.DEFAULT,
  logo,
  onSearch,
  onMenuToggle,
  onSearchSubmit,
  showSearch = true,
  showCart = true,
  searchPlaceholder,
  isAuthenticated = false,
  user,
  cartItemCount = 0,
  onLogoPress,
  onCartPress,
  onUserMenuPress,
  onLogout,
  onNotificationsPress,
  accessibilityLabel,
  testID,
  style,
  ...rest
}) => {
  const { t } = useI18n();
  const router = useRouter();
  const defaultSearchPlaceholder = searchPlaceholder || t('common.searchPlaceholder');
  const {
    searchValue,
    isMenuOpen,
    isSearchFocused,
    handleSearchChange,
    handleMenuToggle,
    setIsSearchFocused,
    setSearchValue,
    setIsMenuOpen,
  } = useHeader({ onSearch, onMenuToggle });

  const handleLogoPress = () => {
    if (onLogoPress) {
      onLogoPress();
    } else {
      router.push('/');
    }
  };

  const handleSearchSubmit = () => {
    if (searchValue.trim()) {
      if (onSearchSubmit) {
        onSearchSubmit(searchValue.trim());
      } else {
        router.push(`/search?q=${encodeURIComponent(searchValue.trim())}`);
      }
      setSearchValue('');
    }
  };

  const handleCartPress = () => {
    if (onCartPress) {
      onCartPress();
    } else {
      router.push('/cart');
    }
  };

  const handleUserMenuPress = () => {
    if (onUserMenuPress) {
      onUserMenuPress();
    } else {
      router.push('/profile');
    }
  };

  const handleNotificationsPress = () => {
    if (onNotificationsPress) {
      onNotificationsPress();
    } else {
      router.push('/notifications');
    }
  };

  return (
    <StyledHeader
      variant={variant}
      accessibilityRole="header"
      accessibilityLabel={accessibilityLabel || t('navigation.header.title')}
      testID={testID}
      style={style}
      {...rest}
    >
      <StyledHeaderContent>
        {/* Logo */}
        <StyledLogo
          onPress={handleLogoPress}
          accessibilityRole="button"
          accessibilityLabel={t('common.goToHome')}
          testID={testID ? `${testID}-logo` : undefined}
        >
          {logo ? (
            typeof logo === 'string' ? (
              <Text variant="h3" color="primary">
                {logo}
              </Text>
            ) : (
              logo
            )
          ) : null}
        </StyledLogo>

        {/* Search Bar */}
        {showSearch && (
          <StyledSearchContainer>
            <StyledSearchIcon>🔍</StyledSearchIcon>
            <StyledSearchInput
              placeholder={defaultSearchPlaceholder}
              value={searchValue}
              onChangeText={handleSearchChange}
              onSubmitEditing={handleSearchSubmit}
              returnKeyType="search"
              onFocus={() => setIsSearchFocused(true)}
              onBlur={() => setIsSearchFocused(false)}
              accessibilityLabel={t('common.search')}
              accessibilityHint={t('navigation.header.searchHint')}
              testID={testID ? `${testID}-search` : undefined}
            />
          </StyledSearchContainer>
        )}

        {/* Actions */}
        <StyledActionsContainer>
          {/* Notifications */}
          {isAuthenticated && (
            <StyledActionButton
              onPress={handleNotificationsPress}
              accessibilityRole="button"
              accessibilityLabel={t('common.viewNotifications')}
              testID={testID ? `${testID}-notifications` : undefined}
            >
              <Text>🔔</Text>
            </StyledActionButton>
          )}

          {/* Cart */}
          {showCart && (
            <StyledCartButton
              onPress={handleCartPress}
              accessibilityRole="button"
              accessibilityLabel={cartItemCount > 0 ? t('navigation.header.cartWithItems', { count: cartItemCount }) : t('navigation.header.cartWithItems_zero')}
              testID={testID ? `${testID}-cart` : undefined}
            >
              <Text>🛒</Text>
              {cartItemCount > 0 && (
                <Badge variant="error" size="small" testID={testID ? `${testID}-cart-badge` : undefined}>
                  {cartItemCount > 99 ? '99+' : cartItemCount}
                </Badge>
              )}
            </StyledCartButton>
          )}

          {/* User Menu */}
          {isAuthenticated ? (
            <StyledUserMenuButton
              onPress={handleUserMenuPress}
              accessibilityRole="button"
              accessibilityLabel={t('common.userMenu')}
              testID={testID ? `${testID}-user-menu` : undefined}
            >
              {user?.avatar || user?.name || user?.email ? (
                <Avatar
                  size="small"
                  source={user?.avatar}
                  name={user?.name || user?.email}
                  testID={testID ? `${testID}-avatar` : undefined}
                />
              ) : (
                <Text>👤</Text>
              )}
            </StyledUserMenuButton>
          ) : (
            <Button
              text={t('navigation.header.signIn')}
              variant="outline"
              size="small"
              onPress={() => router.push('/login')}
              testID={testID ? `${testID}-signin` : undefined}
            />
          )}

          {/* Menu Button */}
          <StyledMobileMenuButton
            onPress={handleMenuToggle}
            accessibilityRole="button"
            accessibilityLabel={t('common.toggleMenu')}
            testID={testID ? `${testID}-menu` : undefined}
          >
            <Text>☰</Text>
          </StyledMobileMenuButton>
        </StyledActionsContainer>
      </StyledHeaderContent>
    </StyledHeader>
  );
};

export default HeaderAndroid;

