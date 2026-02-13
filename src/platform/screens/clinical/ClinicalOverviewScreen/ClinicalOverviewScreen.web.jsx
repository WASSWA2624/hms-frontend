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

const ClinicalOverviewScreenWeb = () => {
  const { t } = useI18n();
  const {
    cards,
    recentEncounters,
    canCreateClinicalRecords,
    isLoading,
    hasError,
    errorMessage,
    isOffline,
    onRetry,
    onOpenResource,
    onOpenEncounter,
    onCreateEncounter,
  } = useClinicalOverviewScreen();

  return (
    <StyledContainer role="main" aria-label={t('clinical.overview.title')}>
      <StyledContent>
        <StyledHeader>
          <Text variant="h2" accessibilityRole="header">{t('clinical.overview.title')}</Text>
          <Text variant="body">{t('clinical.overview.description')}</Text>
          <Button
            variant="surface"
            size="small"
            onPress={onCreateEncounter}
            disabled={!canCreateClinicalRecords}
            aria-disabled={!canCreateClinicalRecords}
            title={!canCreateClinicalRecords ? t('clinical.access.createDenied') : undefined}
            accessibilityLabel={t('clinical.overview.createEncounter')}
            accessibilityHint={t('clinical.overview.createEncounterHint')}
            icon={<Icon glyph="+" size="xs" decorative />}
            testID="clinical-overview-create-encounter"
          >
            {t('clinical.overview.createEncounter')}
          </Button>
        </StyledHeader>

        {isLoading ? (
          <LoadingSpinner accessibilityLabel={t('common.loading')} testID="clinical-overview-loading" />
        ) : null}

        {!isLoading && hasError && !isOffline ? (
          <ErrorState
            size={ErrorStateSizes.SMALL}
            title={t('clinical.overview.loadErrorTitle')}
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
            testID="clinical-overview-error"
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
            testID="clinical-overview-offline"
          />
        ) : null}

        <StyledSection>
          <StyledSectionHeader>
            <StyledSectionTitle>{t('clinical.overview.resourcesTitle')}</StyledSectionTitle>
          </StyledSectionHeader>
          <StyledCardGrid>
            {cards.map((card) => (
              <Card key={card.id} variant="outlined" accessibilityLabel={card.label} testID={`clinical-card-${card.id}`}>
                <StyledTileTitle>{card.label}</StyledTileTitle>
                <StyledTileDescription>{card.description}</StyledTileDescription>
                <StyledTileAction
                  type="button"
                  onClick={() => onOpenResource(card.routePath)}
                  aria-label={t('clinical.overview.openResource', { resource: card.label })}
                >
                  {t('clinical.overview.openResourceButton')}
                </StyledTileAction>
              </Card>
            ))}
          </StyledCardGrid>
        </StyledSection>

        <StyledSection>
          <StyledSectionHeader>
            <StyledSectionTitle>{t('clinical.overview.recentEncountersTitle')}</StyledSectionTitle>
          </StyledSectionHeader>
          <Card
            variant="outlined"
            accessibilityLabel={t('clinical.overview.recentEncountersTitle')}
            testID="clinical-overview-recent"
          >
            {recentEncounters.length === 0 ? (
              <EmptyState
                title={t('clinical.overview.emptyTitle')}
                description={t('clinical.overview.emptyMessage')}
                testID="clinical-overview-empty"
              />
            ) : (
              <StyledRecentList role="list">
                {recentEncounters.map((encounter) => {
                  const title = encounter.patient_id || encounter.id;
                  const subtitle = encounter.status || encounter.started_at || '';
                  return (
                    <li key={encounter.id} role="listitem">
                      <ListItem
                        title={title}
                        subtitle={subtitle}
                        onPress={() => onOpenEncounter(encounter)}
                        accessibilityLabel={t('clinical.overview.openEncounter', { encounter: title })}
                        testID={`clinical-overview-item-${encounter.id}`}
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
