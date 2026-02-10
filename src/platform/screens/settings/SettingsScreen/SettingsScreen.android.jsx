/**
 * SettingsScreen - Android
 * Container for settings routes (uses AppFrame scroll for uniformity).
 */
import React from 'react';
import { useI18n } from '@hooks';
import { StyledContainer, StyledContent } from './SettingsScreen.android.styles';

const SettingsScreenAndroid = ({ children }) => {
  const { t } = useI18n();

  return (
    <StyledContainer testID="settings-screen" accessibilityLabel={t('settings.screen.label')}>
      <StyledContent>{children}</StyledContent>
    </StyledContainer>
  );
};

export default SettingsScreenAndroid;
