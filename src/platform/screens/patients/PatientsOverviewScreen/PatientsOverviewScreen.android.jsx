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
} from './PatientsOverviewScreen.android.styles';
import usePatientsOverviewScreen from './usePatientsOverviewScreen';

const PatientsOverviewScreenAndroid = () => {
  const { t } = useI18n();
  const {
    cards,
    recentPatients,
    canCreatePatientRecords,
    isLoading,
    hasError,
    errorMessage,
    isOffline,
    onRetry,
    onOpenResource,
    onOpenPatient,
    onRegisterPatient,
  } = usePatientsOverviewScreen();

  return (
    <StyledContainer>
      <StyledContent>
        <StyledHeader>
          <Text variant="h2" accessibilityRole="header">{t('patients.overview.title')}</Text>
          <Text variant="body">{t('patients.overview.description')}</Text>
          <Button
            variant="surface"
            size="small"
            onPress={onRegisterPatient}
            disabled={!canCreatePatientRecords}
            accessibilityLabel={t('patients.overview.registerPatient')}
            accessibilityHint={t('patients.overview.registerPatientHint')}
            icon={<Icon glyph="+" size="xs" decorative />}
            testID="patients-overview-register"
          >
            {t('patients.overview.registerPatient')}
          </Button>
        </StyledHeader>

        {isLoading ? (
          <LoadingSpinner accessibilityLabel={t('common.loading')} testID="patients-overview-loading" />
        ) : null}

        {!isLoading && hasError && !isOffline ? (
          <ErrorState
            size={ErrorStateSizes.SMALL}
            title={t('patients.overview.loadErrorTitle')}
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
            testID="patients-overview-error"
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
            testID="patients-overview-offline"
          />
        ) : null}

        <StyledSection>
          <StyledSectionHeader>
            <StyledSectionTitle>{t('patients.overview.resourcesTitle')}</StyledSectionTitle>
          </StyledSectionHeader>
          <StyledCardGrid>
            {cards.map((card) => (
              <Card key={card.id} variant="outlined" accessibilityLabel={card.label} testID={`patients-card-${card.id}`}>
                <StyledTileTitle>{card.label}</StyledTileTitle>
                <StyledTileDescription>{card.description}</StyledTileDescription>
                <StyledTileAction
                  onPress={() => onOpenResource(card.routePath)}
                  accessibilityLabel={t('patients.overview.openResource', { resource: card.label })}
                >
                  <Text variant="body">{t('patients.overview.openResourceButton')}</Text>
                </StyledTileAction>
              </Card>
            ))}
          </StyledCardGrid>
        </StyledSection>

        <StyledSection>
          <StyledSectionHeader>
            <StyledSectionTitle>{t('patients.overview.recentPatientsTitle')}</StyledSectionTitle>
          </StyledSectionHeader>
          <Card
            variant="outlined"
            accessibilityLabel={t('patients.overview.recentPatientsTitle')}
            testID="patients-overview-recent"
          >
            {recentPatients.length === 0 ? (
              <EmptyState
                title={t('patients.overview.emptyTitle')}
                description={t('patients.overview.emptyMessage')}
                testID="patients-overview-empty"
              />
            ) : (
              <StyledRecentList>
                {recentPatients.map((patient, index) => {
                  const fullName = `${patient.first_name || ''} ${patient.last_name || ''}`.trim() || patient.id;
                  return (
                    <React.Fragment key={patient.id}>
                      <ListItem
                        title={fullName}
                        subtitle={patient.gender || patient.date_of_birth || ''}
                        onPress={() => onOpenPatient(patient.id)}
                        accessibilityLabel={t('patients.overview.openPatient', { patient: fullName })}
                        testID={`patients-overview-item-${patient.id}`}
                      />
                      {index < recentPatients.length - 1 ? <StyledSeparator /> : null}
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

export default PatientsOverviewScreenAndroid;
