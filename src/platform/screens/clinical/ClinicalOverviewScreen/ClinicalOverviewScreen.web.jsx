import React from 'react';
import {
  Button,
  Card,
  EmptyState,
  ErrorState,
  ErrorStateSizes,
  Icon,
  ListItem,
  LoadingSpinner,
  OfflineState,
  OfflineStateSizes,
  Text,
} from '@platform/components';
import { useI18n } from '@hooks';
import {
  StyledCardGrid,
  StyledContainer,
  StyledContent,
  StyledHeader,
  StyledRecentList,
  StyledSection,
  StyledSectionHeader,
  StyledSectionTitle,
  StyledTileAction,
  StyledTileDescription,
  StyledTileTitle,
} from './ClinicalOverviewScreen.web.styles';
import useClinicalOverviewScreen from './useClinicalOverviewScreen';

const ClinicalOverviewScreenWeb = ({ scope = 'clinical' }) => {
  const { t } = useI18n();
  const {
    i18nRoot,
    cards,
    recentItems,
    canCreateClinicalRecords,
    isLoading,
    hasError,
    errorMessage,
    isOffline,
    onRetry,
    onOpenResource,
    onOpenRecentItem,
    onCreatePrimary,
  } = useClinicalOverviewScreen(scope);

  const titleKey = `${i18nRoot}.overview.title`;
  const descriptionKey = `${i18nRoot}.overview.description`;
  const createKey = `${i18nRoot}.overview.createPrimary`;
  const createHintKey = `${i18nRoot}.overview.createPrimaryHint`;
  const loadErrorTitleKey = `${i18nRoot}.overview.loadErrorTitle`;
  const resourcesTitleKey = `${i18nRoot}.overview.resourcesTitle`;
  const openResourceKey = `${i18nRoot}.overview.openResource`;
  const openResourceButtonKey = `${i18nRoot}.overview.openResourceButton`;
  const recentTitleKey = `${i18nRoot}.overview.recentPrimaryTitle`;
  const emptyTitleKey = `${i18nRoot}.overview.emptyTitle`;
  const emptyMessageKey = `${i18nRoot}.overview.emptyMessage`;
  const openItemKey = `${i18nRoot}.overview.openPrimaryItem`;

  return (
    <StyledContainer role="main" aria-label={t(titleKey)}>
      <StyledContent>
        <StyledHeader>
          <Text variant="h2" accessibilityRole="header">{t(titleKey)}</Text>
          <Text variant="body">{t(descriptionKey)}</Text>
          <Button
            variant="surface"
            size="small"
            onPress={onCreatePrimary}
            disabled={!canCreateClinicalRecords}
            aria-disabled={!canCreateClinicalRecords}
            title={!canCreateClinicalRecords ? t('clinical.access.createDenied') : undefined}
            accessibilityLabel={t(createKey)}
            accessibilityHint={t(createHintKey)}
            icon={<Icon glyph="+" size="xs" decorative />}
            testID={`${scope}-overview-create-primary`}
          >
            {t(createKey)}
          </Button>
        </StyledHeader>

        {isLoading ? (
          <LoadingSpinner accessibilityLabel={t('common.loading')} testID={`${scope}-overview-loading`} />
        ) : null}

        {!isLoading && hasError && !isOffline ? (
          <ErrorState
            size={ErrorStateSizes.SMALL}
            title={t(loadErrorTitleKey)}
            description={errorMessage}
            action={
              <Button
                variant="surface"
                size="small"
                onPress={onRetry}
                accessibilityLabel={t('common.retry')}
                accessibilityHint={t('common.retryHint')}
                icon={<Icon glyph="?" size="xs" decorative />}
              >
                {t('common.retry')}
              </Button>
            }
            testID={`${scope}-overview-error`}
          />
        ) : null}

        {!isLoading && isOffline ? (
          <OfflineState
            size={OfflineStateSizes.SMALL}
            title={t('shell.banners.offline.title')}
            description={t('shell.banners.offline.message')}
            action={
              <Button
                variant="surface"
                size="small"
                onPress={onRetry}
                accessibilityLabel={t('common.retry')}
                accessibilityHint={t('common.retryHint')}
                icon={<Icon glyph="?" size="xs" decorative />}
              >
                {t('common.retry')}
              </Button>
            }
            testID={`${scope}-overview-offline`}
          />
        ) : null}

        <StyledSection>
          <StyledSectionHeader>
            <StyledSectionTitle>{t(resourcesTitleKey)}</StyledSectionTitle>
          </StyledSectionHeader>
          <StyledCardGrid>
            {cards.map((card) => (
              <Card key={card.id} variant="outlined" accessibilityLabel={card.label} testID={`${scope}-card-${card.id}`}>
                <StyledTileTitle>{card.label}</StyledTileTitle>
                <StyledTileDescription>{card.description}</StyledTileDescription>
                <StyledTileAction
                  type="button"
                  onClick={() => onOpenResource(card.routePath)}
                  aria-label={t(openResourceKey, { resource: card.label })}
                >
                  {t(openResourceButtonKey)}
                </StyledTileAction>
              </Card>
            ))}
          </StyledCardGrid>
        </StyledSection>

        <StyledSection>
          <StyledSectionHeader>
            <StyledSectionTitle>{t(recentTitleKey)}</StyledSectionTitle>
          </StyledSectionHeader>
          <Card
            variant="outlined"
            accessibilityLabel={t(recentTitleKey)}
            testID={`${scope}-overview-recent`}
          >
            {recentItems.length === 0 ? (
              <EmptyState
                title={t(emptyTitleKey)}
                description={t(emptyMessageKey)}
                testID={`${scope}-overview-empty`}
              />
            ) : (
              <StyledRecentList role="list">
                {recentItems.map((item) => {
                  const title = item.patient_id || item.identifier || item.id;
                  const subtitle = item.status || item.started_at || item.scheduled_at || '';
                  return (
                    <li key={item.id} role="listitem">
                      <ListItem
                        title={title}
                        subtitle={subtitle}
                        onPress={() => onOpenRecentItem(item)}
                        accessibilityLabel={t(openItemKey, { item: title })}
                        testID={`${scope}-overview-item-${item.id}`}
                      />
                    </li>
                  );
                })}
              </StyledRecentList>
            )}
          </Card>
        </StyledSection>
      </StyledContent>
    </StyledContainer>
  );
};

export default ClinicalOverviewScreenWeb;
