/**
 * GeneralSettingsPanel - Web
 * Theme, language, footer visibility. Rendered at /settings (index).
 */
import React from 'react';
import { useI18n } from '@hooks';
import {
  Button,
  EmptyState,
  ErrorState,
  ErrorStateSizes,
  Icon,
  LanguageControls,
  LoadingSpinner,
  OfflineState,
  OfflineStateSizes,
  Switch,
  ThemeControls,
} from '@platform/components';
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
  StyledAccessGroupGrid,
  StyledAccessGroupCard,
  StyledAccessGroupTitle,
  StyledAccessLinkList,
  StyledAccessLinkButton,
  StyledStateActionRow,
} from './GeneralSettingsPanel.web.styles';

const GeneralSettingsPanelWeb = () => {
  const { t } = useI18n();
  const {
    footerVisible,
    canManagePreferences,
    accessGroups,
    selectedTab,
    onTabChange,
    isLoading,
    isOffline,
    hasError,
    isEmpty,
    errorMessageKey,
    onRetry,
    onNavigateDashboard,
    onFooterVisibleChange,
  } = useGeneralSettingsPanel();

  const retryAction = (
    <Button
      variant="surface"
      size="small"
      onPress={onRetry}
      accessibilityLabel={t('common.retry')}
      accessibilityHint={t('common.retryHint')}
      icon={<Icon glyph="?" size="xs" decorative />}
      testID="general-settings-retry"
    >
      {t('common.retry')}
    </Button>
  );

  const goToDashboardAction = (
    <Button
      variant="surface"
      size="small"
      onPress={onNavigateDashboard}
      accessibilityLabel={t('settings.general.errors.goToDashboard')}
      accessibilityHint={t('settings.general.errors.goToDashboardHint')}
      icon={<Icon glyph="home-outline" size="xs" decorative />}
      testID="general-settings-go-dashboard"
    >
      {t('settings.general.errors.goToDashboard')}
    </Button>
  );

  return (
    <StyledPanel testID="general-settings-panel" role="region" aria-label={t('settings.tabs.general')}>
      <StyledHeader>
        <StyledHeaderTitle>{t('settings.general.title')}</StyledHeaderTitle>
        <StyledHeaderSubtitle>{t('settings.general.description')}</StyledHeaderSubtitle>
      </StyledHeader>

      {isLoading ? (
        <LoadingSpinner testID="general-settings-loading" accessibilityLabel={t('common.loading')} />
      ) : null}

      {!isLoading && hasError ? (
        <ErrorState
          size={ErrorStateSizes.SMALL}
          title={t('settings.general.errors.title')}
          description={t(errorMessageKey)}
          action={<StyledStateActionRow>{goToDashboardAction}</StyledStateActionRow>}
          testID="general-settings-error"
        />
      ) : null}

      {!isLoading && !hasError && isOffline ? (
        <OfflineState
          size={OfflineStateSizes.SMALL}
          title={t('settings.general.offline.title')}
          description={t('settings.general.offline.description')}
          action={<StyledStateActionRow>{retryAction}</StyledStateActionRow>}
          testID="general-settings-offline"
        />
      ) : null}

      {!isLoading && !hasError ? (
        <>
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
                  disabled={!canManagePreferences}
                  onValueChange={onFooterVisibleChange}
                  label={t('settings.footerVisible.label')}
                  accessibilityLabel={t('settings.footerVisible.accessibilityLabel')}
                  accessibilityHint={
                    canManagePreferences
                      ? t('settings.footerVisible.hint')
                      : t('settings.general.footer.blockedHint')
                  }
                  testID="general-footer-visible-toggle"
                />
              </StyledCardBody>
              {!canManagePreferences ? (
                <StyledSectionDescription data-testid="general-footer-toggle-blocked">
                  {t('settings.general.footer.blockedMessage')}
                </StyledSectionDescription>
              ) : null}
            </StyledCard>
          </StyledSection>

          <StyledSection>
            <StyledSectionHeader>
              <StyledSectionTitle role="heading" aria-level={2}>
                {t('settings.general.access.title')}
              </StyledSectionTitle>
              <StyledSectionDescription>{t('settings.general.access.description')}</StyledSectionDescription>
            </StyledSectionHeader>
            {isEmpty ? (
              <EmptyState
                title={t('settings.general.access.emptyTitle')}
                description={t('settings.general.access.empty')}
                testID="general-settings-access-empty"
              />
            ) : (
              <StyledAccessGroupGrid data-testid="general-settings-access-grid">
                {accessGroups.map((group) => (
                  <StyledAccessGroupCard key={group.id}>
                    <StyledAccessGroupTitle>{t(group.labelKey)}</StyledAccessGroupTitle>
                    <StyledAccessLinkList>
                      {group.tabs.map((tab) => (
                        <StyledAccessLinkButton
                          key={tab.id}
                          type="button"
                          onClick={() => onTabChange(tab.id)}
                          aria-label={t('settings.general.access.openModule', { module: t(tab.label) })}
                          aria-current={selectedTab === tab.id ? 'page' : undefined}
                          $active={selectedTab === tab.id}
                        >
                          {t(tab.label)}
                        </StyledAccessLinkButton>
                      ))}
                    </StyledAccessLinkList>
                  </StyledAccessGroupCard>
                ))}
              </StyledAccessGroupGrid>
            )}
          </StyledSection>
        </>
      ) : null}
    </StyledPanel>
  );
};

export default GeneralSettingsPanelWeb;
