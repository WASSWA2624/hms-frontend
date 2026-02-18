/**
 * GeneralSettingsPanel - Android
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
  Text,
  ThemeControls,
} from '@platform/components';
import useGeneralSettingsPanel from './useGeneralSettingsPanel';
import {
  StyledPanel,
  StyledSection,
  StyledSectionHeader,
  StyledCard,
  StyledCardHeader,
  StyledCardBody,
  StyledAccessGroupGrid,
  StyledAccessGroupCard,
  StyledAccessGroupTitle,
  StyledAccessLinkList,
  StyledAccessLinkButton,
  StyledAccessLinkButtonLabel,
  StyledStateActionRow,
} from './GeneralSettingsPanel.android.styles';

const GeneralSettingsPanelAndroid = () => {
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
    <StyledPanel testID="general-settings-panel" accessibilityLabel={t('settings.tabs.general')}>
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
                <Text variant="body" color="text.secondary" testID="general-footer-toggle-blocked">
                  {t('settings.general.footer.blockedMessage')}
                </Text>
              ) : null}
            </StyledCard>
          </StyledSection>

          <StyledSection>
            <StyledSectionHeader>
              <Text variant="h2" accessibilityRole="header">
                {t('settings.general.access.title')}
              </Text>
              <Text variant="body" color="text.secondary">
                {t('settings.general.access.description')}
              </Text>
            </StyledSectionHeader>
            {isEmpty ? (
              <EmptyState
                title={t('settings.general.access.emptyTitle')}
                description={t('settings.general.access.empty')}
                testID="general-settings-access-empty"
              />
            ) : (
              <StyledAccessGroupGrid testID="general-settings-access-grid">
                {accessGroups.map((group) => (
                  <StyledAccessGroupCard key={group.id}>
                    <StyledAccessGroupTitle>{t(group.labelKey)}</StyledAccessGroupTitle>
                    <StyledAccessLinkList>
                      {group.tabs.map((tab) => {
                        const isActive = selectedTab === tab.id;
                        return (
                          <StyledAccessLinkButton
                            key={tab.id}
                            onPress={() => onTabChange(tab.id)}
                            accessibilityRole="button"
                            accessibilityState={{ selected: isActive }}
                            accessibilityLabel={t('settings.general.access.openModule', {
                              module: t(tab.label),
                            })}
                            $active={isActive}
                          >
                            <StyledAccessLinkButtonLabel $active={isActive}>
                              {t(tab.label)}
                            </StyledAccessLinkButtonLabel>
                          </StyledAccessLinkButton>
                        );
                      })}
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

export default GeneralSettingsPanelAndroid;
