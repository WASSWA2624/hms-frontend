/**
 * SettingsScreen - Web
 * Container for settings routes (uses AppFrame scroll for uniformity).
 * Per platform-ui.mdc: presentation-only; theme via styles.
 */
import React from 'react';
import { useI18n } from '@hooks';
import { StyledContainer, StyledContent } from './SettingsScreen.web.styles';

const SettingsScreenWeb = ({ children }) => {
  const { t } = useI18n();

  return (
    <StyledContainer
      testID="settings-screen"
      data-testid="settings-screen"
      role="main"
      aria-label={t('settings.screen.label')}
    >
      <StyledContent>{children}</StyledContent>
    </StyledContainer>
  );
};

export default SettingsScreenWeb;
