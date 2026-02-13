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
  StyledSeparator,
  StyledTileAction,
  StyledTileDescription,
  StyledTileTitle,
} from './ClinicalOverviewScreen.ios.styles';
import useClinicalOverviewScreen from './useClinicalOverviewScreen';

const ClinicalOverviewScreenIOS = () => {
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
    <StyledContainer>
      <StyledContent>
        <StyledHeader>
          <Text variant="h2" accessibilityRole="header">{t('clinical.overview.title')}</Text>
          <Text variant="body">{t('clinical.overview.description')}</Text>
          <Button
            variant="surface"
            size="small"
            onPress={onCreateEncounter}
            disabled={!canCreateClinicalRecords}
            accessibilityLabel={t('clinical.overview.createEncounter')}
            accessibilityHint={
              canCreateClinicalRecords
                ? t('clinical.overview.createEncounterHint')
                : t('clinical.access.createDenied')
            }
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
            action={(
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
            )}
            testID="clinical-overview-error"
          />
        ) : null}

        {!isLoading && isOffline ? (
          <OfflineState
            size={OfflineStateSizes.SMALL}
            title={t('shell.banners.offline.title')}
            description={t('shell.banners.offline.message')}
            action={(
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
            )}
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
                  onPress={() => onOpenResource(card.routePath)}
                  accessibilityLabel={t('clinical.overview.openResource', { resource: card.label })}
                >
                  <Text variant="body">{t('clinical.overview.openResourceButton')}</Text>
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
              <StyledRecentList>
                {recentEncounters.map((encounter, index) => {
                  const title = encounter.patient_id || encounter.id;
                  const subtitle = encounter.status || encounter.started_at || '';
                  return (
                    <React.Fragment key={encounter.id}>
                      <ListItem
                        title={title}
                        subtitle={subtitle}
                        onPress={() => onOpenEncounter(encounter)}
                        accessibilityLabel={t('clinical.overview.openEncounter', { encounter: title })}
                        testID={`clinical-overview-item-${encounter.id}`}
                      />
                      {index < recentEncounters.length - 1 ? <StyledSeparator /> : null}
                    </React.Fragment>
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

export default ClinicalOverviewScreenIOS;
