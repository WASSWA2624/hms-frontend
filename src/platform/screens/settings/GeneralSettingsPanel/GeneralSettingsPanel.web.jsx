/**
 * GeneralSettingsPanel - Web
 * Theme, language, footer visibility. Rendered at /settings (index).
 */
import React from 'react';
import { useI18n } from '@hooks';
import { Switch } from '@platform/components';
import { ThemeControls, LanguageControls } from '@platform/components';
import useGeneralSettingsPanel from './useGeneralSettingsPanel';
import {
  StyledPanel,
  StyledHeader,
  StyledHeaderTitle,
  StyledHeaderSubtitle,
  StyledSection,
  StyledSectionHeader,
  StyledSectionTitle,
  StyledSectionDescription,
  StyledCardGrid,
  StyledCard,
  StyledCardHeader,
  StyledCardTitle,
  StyledCardDescription,
  StyledCardBody,
} from './GeneralSettingsPanel.web.styles';

const GeneralSettingsPanelWeb = () => {
  const { t } = useI18n();
  const { footerVisible, onFooterVisibleChange } = useGeneralSettingsPanel();

  return (
    <StyledPanel testID="general-settings-panel" role="region" aria-label={t('settings.tabs.general')}>
      <StyledHeader>
        <StyledHeaderTitle>{t('settings.general.title')}</StyledHeaderTitle>
        <StyledHeaderSubtitle>{t('settings.general.description')}</StyledHeaderSubtitle>
      </StyledHeader>

      <StyledSection>
        <StyledSectionHeader>
          <StyledSectionTitle role="heading" aria-level={2} data-testid="general-settings-section-title">
            {t('settings.general.appearance.title')}
          </StyledSectionTitle>
          <StyledSectionDescription>{t('settings.general.appearance.description')}</StyledSectionDescription>
        </StyledSectionHeader>
        <StyledCardGrid>
          <StyledCard>
            <StyledCardHeader>
              <StyledCardTitle>{t('settings.general.language.title')}</StyledCardTitle>
              <StyledCardDescription>{t('settings.general.language.description')}</StyledCardDescription>
            </StyledCardHeader>
            <StyledCardBody>
              <LanguageControls testID="general-language-controls" />
            </StyledCardBody>
          </StyledCard>
          <StyledCard>
            <StyledCardHeader>
              <StyledCardTitle>{t('settings.general.theme.title')}</StyledCardTitle>
              <StyledCardDescription>{t('settings.general.theme.description')}</StyledCardDescription>
            </StyledCardHeader>
            <StyledCardBody>
              <ThemeControls testID="general-theme-controls" />
            </StyledCardBody>
          </StyledCard>
        </StyledCardGrid>
      </StyledSection>

      <StyledSection>
        <StyledSectionHeader>
          <StyledSectionTitle role="heading" aria-level={2}>
            {t('settings.general.layout.title')}
          </StyledSectionTitle>
          <StyledSectionDescription>{t('settings.general.layout.description')}</StyledSectionDescription>
        </StyledSectionHeader>
        <StyledCard>
          <StyledCardHeader>
            <StyledCardTitle>{t('settings.general.footer.title')}</StyledCardTitle>
            <StyledCardDescription>{t('settings.general.footer.description')}</StyledCardDescription>
          </StyledCardHeader>
          <StyledCardBody>
            <Switch
              value={footerVisible}
              onValueChange={onFooterVisibleChange}
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

export default GeneralSettingsPanelWeb;
