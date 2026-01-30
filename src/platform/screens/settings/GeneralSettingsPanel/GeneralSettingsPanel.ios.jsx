/**
 * GeneralSettingsPanel - iOS
 */
import React from 'react';
import { useI18n } from '@hooks';
import { useDispatch, useSelector } from 'react-redux';
import { Text, Switch } from '@platform/components';
import { ThemeControls, LanguageControls } from '@platform/components';
import { selectFooterVisible } from '@store/selectors';
import { actions as uiActions } from '@store/slices/ui.slice';
import { StyledPanel, StyledSection, StyledControlsRow } from './GeneralSettingsPanel.ios.styles';

const GeneralSettingsPanelIOS = () => {
  const { t } = useI18n();
  const dispatch = useDispatch();
  const footerVisible = useSelector(selectFooterVisible);
  const handleFooterVisibleChange = (value) => dispatch(uiActions.setFooterVisible(value));

  return (
    <StyledPanel testID="general-settings-panel" accessibilityLabel={t('settings.tabs.general')}>
      <StyledSection>
        <Text variant="h2" accessibilityRole="header" testID="general-settings-section-title">
          {t('settings.tabs.general')}
        </Text>
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

export default GeneralSettingsPanelIOS;
