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
import {
  StyledPanel,
  StyledHeader,
  StyledSection,
  StyledSectionHeader,
  StyledCard,
  StyledCardHeader,
  StyledCardBody,
} from './GeneralSettingsPanel.ios.styles';

const GeneralSettingsPanelIOS = () => {
  const { t } = useI18n();
  const dispatch = useDispatch();
  const footerVisible = useSelector(selectFooterVisible);
  const handleFooterVisibleChange = (value) => dispatch(uiActions.setFooterVisible(value));

  return (
    <StyledPanel testID="general-settings-panel" accessibilityLabel={t('settings.tabs.general')}>
      <StyledHeader>
        <Text variant="h1" accessibilityRole="header">
          {t('settings.general.title')}
        </Text>
        <Text variant="body" color="text.secondary">
          {t('settings.general.description')}
        </Text>
      </StyledHeader>

      <StyledSection>
        <StyledSectionHeader>
          <Text variant="h2" accessibilityRole="header" testID="general-settings-section-title">
            {t('settings.general.appearance.title')}
          </Text>
          <Text variant="body" color="text.secondary">
            {t('settings.general.appearance.description')}
          </Text>
        </StyledSectionHeader>
        <StyledCard>
          <StyledCardHeader>
            <Text variant="h3">{t('settings.general.language.title')}</Text>
            <Text variant="body" color="text.secondary">
              {t('settings.general.language.description')}
            </Text>
          </StyledCardHeader>
          <StyledCardBody>
            <LanguageControls testID="general-language-controls" />
          </StyledCardBody>
        </StyledCard>
        <StyledCard>
          <StyledCardHeader>
            <Text variant="h3">{t('settings.general.theme.title')}</Text>
            <Text variant="body" color="text.secondary">
              {t('settings.general.theme.description')}
            </Text>
          </StyledCardHeader>
          <StyledCardBody>
            <ThemeControls testID="general-theme-controls" />
          </StyledCardBody>
        </StyledCard>
      </StyledSection>

      <StyledSection>
        <StyledSectionHeader>
          <Text variant="h2" accessibilityRole="header">
            {t('settings.general.layout.title')}
          </Text>
          <Text variant="body" color="text.secondary">
            {t('settings.general.layout.description')}
          </Text>
        </StyledSectionHeader>
        <StyledCard>
          <StyledCardHeader>
            <Text variant="h3">{t('settings.general.footer.title')}</Text>
            <Text variant="body" color="text.secondary">
              {t('settings.general.footer.description')}
            </Text>
          </StyledCardHeader>
          <StyledCardBody>
            <Switch
              value={footerVisible}
              onValueChange={handleFooterVisibleChange}
              label={t('settings.footerVisible.label')}
              accessibilityLabel={t('settings.footerVisible.accessibilityLabel')}
              accessibilityHint={t('settings.footerVisible.hint')}
              testID="general-footer-visible-toggle"
            />
          </StyledCardBody>
        </StyledCard>
      </StyledSection>
    </StyledPanel>
  );
};

export default GeneralSettingsPanelIOS;
