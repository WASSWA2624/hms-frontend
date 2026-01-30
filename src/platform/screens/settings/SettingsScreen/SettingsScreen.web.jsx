/**
 * SettingsScreen - Web
 * Main settings screen displaying tabs for all settings sub-screens
 * File: SettingsScreen.web.jsx
 *
 * Per platform-ui.mdc: Platform-specific implementations for cross-platform compatibility
 */

import React, { useMemo } from 'react';
import { View } from 'react-native';
import { useRouter, usePathname } from 'expo-router';
import { useI18n } from '@hooks';
import { useDispatch, useSelector } from 'react-redux';
import { Text, Switch } from '@platform/components';
import { ThemeControls, LanguageControls } from '@platform/components';
import { selectFooterVisible } from '@store/selectors';
import { actions as uiActions } from '@store/slices/ui.slice';
import { StyledContainer, StyledContent, StyledTabBar, StyledTabBarContainer } from './SettingsScreen.web.styles';
import useSettingsScreen from './useSettingsScreen';

/**
 * SettingsScreen Web Component
 * Displays a tab-based interface for managing all settings
 */
const SettingsScreenWeb = () => {
  const { t } = useI18n();
  const dispatch = useDispatch();
  const router = useRouter();
  const pathname = usePathname();
  const footerVisible = useSelector(selectFooterVisible);
  const { selectedTab, tabs, onTabChange } = useSettingsScreen();
  const handleFooterVisibleChange = (value) => dispatch(uiActions.setFooterVisible(value));

  // Determine which tab is currently active based on pathname
  const getCurrentTabId = useMemo(() => {
    const parts = pathname.split('/');
    const lastPart = parts[parts.length - 1];
    
    const tabMap = {
      'users': 'user',
      'user-profiles': 'user-profile',
      'roles': 'role',
      'permissions': 'permission',
      'role-permissions': 'role-permission',
      'user-roles': 'user-role',
      'user-sessions': 'user-session',
      'tenants': 'tenant',
      'facilities': 'facility',
      'branches': 'branch',
      'departments': 'department',
      'units': 'unit',
      'rooms': 'room',
      'wards': 'ward',
      'beds': 'bed',
      'addresses': 'address',
      'contacts': 'contact',
      'api-keys': 'api-key',
      'api-key-permissions': 'api-key-permission',
      'user-mfas': 'user-mfa',
      'oauth-accounts': 'oauth-account',
    };
    
    return tabMap[lastPart] || 'tenant';
  }, [pathname]);

  // Define tab items with labels from i18n
  const tabItems = useMemo(() => tabs.map(tab => ({
    id: tab.id,
    label: t(`settings.tabs.${tab.id}`),
    testID: tab.testID,
  })), [tabs, t]);

  const handleTabPress = (tabId) => {
    onTabChange(tabId);
  };

  return (
    <StyledContainer testID="settings-screen" role="main">
      <StyledContent>
        <Text
          variant="h1"
          accessibilityRole="header"
          testID="settings-screen-title"
          style={{ marginBottom: 24 }}
        >
          {t('settings.title')}
        </Text>
        {/* Theme and language moved from sidebar into settings for centralized control */}
        <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 24 }}>
          <LanguageControls testID="settings-language-controls" />
          <ThemeControls testID="settings-theme-controls" />
        </div>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 24 }}>
          <Switch
            value={footerVisible}
            onValueChange={handleFooterVisibleChange}
            label={t('settings.footerVisible.label')}
            accessibilityLabel={t('settings.footerVisible.accessibilityLabel')}
            accessibilityHint={t('settings.footerVisible.hint')}
            testID="settings-footer-visible-toggle"
          />
        </div>
        
        <StyledTabBarContainer testID="settings-tabs-container">
          <StyledTabBar>
            {tabItems.map(tab => (
              <div
                key={tab.id}
                onClick={() => handleTabPress(tab.id)}
                style={{
                  padding: '12px 16px',
                  cursor: 'pointer',
                  borderBottom: getCurrentTabId === tab.id ? '3px solid #0066cc' : '3px solid transparent',
                  color: getCurrentTabId === tab.id ? '#0066cc' : '#666',
                  fontWeight: getCurrentTabId === tab.id ? '600' : '400',
                  transition: 'all 0.3s ease',
                  whiteSpace: 'nowrap',
                  flexShrink: 0,
                }}
                testID={tab.testID}
              >
                {tab.label}
              </div>
            ))}
          </StyledTabBar>
        </StyledTabBarContainer>
      </StyledContent>
    </StyledContainer>
  );
};

export default SettingsScreenWeb;
