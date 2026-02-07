/**
 * SettingsScreen - Android
 * Template: sidebar nav + content slot for settings sub-pages.
 */
import React from 'react';
import { useI18n } from '@hooks';
import { StyledContainer } from './SettingsScreen.android.styles';

const SettingsScreenAndroid = ({ children }) => {
  const { t } = useI18n();

  return (
    <StyledContainer testID="settings-screen" accessibilityLabel={t('settings.screen.label')}>
      {children}
    </StyledContainer>
  );
};

export default SettingsScreenAndroid;
