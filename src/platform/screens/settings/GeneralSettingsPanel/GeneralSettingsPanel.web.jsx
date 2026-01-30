/**
 * GeneralSettingsPanel - Web
 * Theme, language, footer visibility. Rendered at /settings (index).
 */
import React from 'react';
import { useI18n } from '@hooks';
import { useDispatch, useSelector } from 'react-redux';
import { Text, Switch } from '@platform/components';
import { ThemeControls, LanguageControls } from '@platform/components';
import { selectFooterVisible } from '@store/selectors';
import { actions as uiActions } from '@store/slices/ui.slice';
import {
  StyledPanel,
  StyledSection,
  StyledSectionTitle,
  StyledControlsRow,
} from './GeneralSettingsPanel.web.styles';

const GeneralSettingsPanelWeb = () => {
  const { t } = useI18n();
  const dispatch = useDispatch();
  const footerVisible = useSelector(selectFooterVisible);
  const handleFooterVisibleChange = (value) => dispatch(uiActions.setFooterVisible(value));

  return (
    <StyledPanel testID="general-settings-panel" role="region" aria-label={t('settings.tabs.general')}>
      <StyledSection>
        <StyledSectionTitle role="heading" aria-level={2} data-testid="general-settings-section-title">
          {t('settings.tabs.general')}
        </StyledSectionTitle>
        <StyledControlsRow>
          <LanguageControls testID="general-language-controls" />
          <ThemeControls testID="general-theme-controls" />
        </StyledControlsRow>
      </StyledSection>
      <StyledSection>
        <Switch
          value={footerVisible}
          onValueChange={handleFooterVisibleChange}
          label={t('settings.footerVisible.label')}
          accessibilityLabel={t('settings.footerVisible.accessibilityLabel')}
          accessibilityHint={t('settings.footerVisible.hint')}
          testID="general-footer-visible-toggle"
        />
      </StyledSection>
    </StyledPanel>
  );
};

export default GeneralSettingsPanelWeb;
