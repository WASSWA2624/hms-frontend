/**
 * SettingsScreen - Android
 * Template: sidebar nav + content slot for settings sub-pages.
 */
import React, { useMemo } from 'react';
import { useI18n } from '@hooks';
import {
  StyledContainer,
  StyledSidebar,
  StyledSidebarTitle,
  StyledNavItem,
  StyledNavLink,
  StyledNavLinkText,
  StyledContent,
} from './SettingsScreen.android.styles';
import useSettingsScreen from './useSettingsScreen';

const SettingsScreenAndroid = ({ children }) => {
  const { t } = useI18n();
  const { tabs, onTabChange, currentTabId } = useSettingsScreen();

  const tabItems = useMemo(
    () =>
      tabs.map((tab) => ({
        id: tab.id,
        label: t(`settings.tabs.${tab.id}`),
        testID: tab.testID,
      })),
    [tabs, t]
  );

  return (
    <StyledContainer testID="settings-screen" accessibilityLabel={t('settings.screen.label')}>
      <StyledSidebar accessibilityLabel={t('settings.tabs.accessibilityLabel')}>
        <StyledSidebarTitle>{t('settings.title')}</StyledSidebarTitle>
        {tabItems.map((tab) => (
          <StyledNavItem key={tab.id}>
            <StyledNavLink
              $active={currentTabId === tab.id}
              onPress={() => onTabChange(tab.id)}
              testID={tab.testID}
              accessibilityRole="button"
              accessibilityState={{ selected: currentTabId === tab.id }}
              accessibilityLabel={tab.label}
            >
              <StyledNavLinkText $active={currentTabId === tab.id}>{tab.label}</StyledNavLinkText>
            </StyledNavLink>
          </StyledNavItem>
        ))}
      </StyledSidebar>
      <StyledContent>{children}</StyledContent>
    </StyledContainer>
  );
};

export default SettingsScreenAndroid;
