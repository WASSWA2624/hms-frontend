/**
 * SettingsScreen - Web
 * Template: tablet/desktop = resizable sidebar + content; mobile = drawer nav + full-width content.
 * Per platform-ui.mdc: presentation-only; theme via styles.
 */
import React from 'react';
import { useI18n } from '@hooks';
import {
  StyledContainer,
  StyledContent,
} from './SettingsScreen.web.styles';

const SettingsScreenWeb = ({ children }) => {
  const { t } = useI18n();

  return (
    <StyledContainer testID="settings-screen" role="main" aria-label={t('settings.screen.label')}>
      <StyledContent>{children}</StyledContent>
    </StyledContainer>
  );
};

export default SettingsScreenWeb;
