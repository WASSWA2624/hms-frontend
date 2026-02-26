import React, { useState } from 'react';
import {
  Button,
  Card,
  EmptyState,
  ErrorState,
  ErrorStateSizes,
  Icon,
  LoadingSpinner,
  Modal,
  OfflineState,
  OfflineStateSizes,
  Text,
} from '@platform/components';
import { useI18n } from '@hooks';
import PatientListCards from '../components/PatientListCards';
import {
  StyledCardGrid,
  StyledContainer,
  StyledContent,
  StyledHeader,
  StyledHeaderCopy,
  StyledHeaderTop,
  StyledHelpButton,
  StyledHelpButtonLabel,
  StyledHelpModalBody,
  StyledHelpModalItem,
  StyledHelpModalTitle,
  StyledSection,
  StyledSectionHeader,
  StyledSectionTitle,
  StyledSummaryChip,
  StyledSummaryList,
  StyledSummaryText,
  StyledTileAction,
  StyledTileDescription,
  StyledTileTitle,
} from './PatientsOverviewScreen.styles';
import usePatientsOverviewScreen from './usePatientsOverviewScreen';

const PatientsOverviewScreen = () => {
  const { t } = useI18n();
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const {
    cards,
    overviewSummary,
    helpContent,
    recentPatients,
    showRegisterPatientAction,
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
          <StyledHeaderTop>
            <StyledHeaderCopy>
              <Text variant="h2" accessibilityRole="header">
                {t('patients.overview.title')}
              </Text>
              <Text variant="body">{t('patients.overview.description')}</Text>
            </StyledHeaderCopy>
            <StyledHelpButton
              accessibilityRole="button"
              accessibilityLabel={helpContent.label}
              accessibilityHint={helpContent.tooltip}
              testID="patients-overview-help-trigger"
              onPress={() => setIsHelpOpen(true)}
            >
              <StyledHelpButtonLabel>?</StyledHelpButtonLabel>
            </StyledHelpButton>
          </StyledHeaderTop>

          <StyledSummaryList
            accessibilityLabel={t('patients.overview.summaryTitle')}
          >
            <StyledSummaryChip>
              <StyledSummaryText>{overviewSummary.scope}</StyledSummaryText>
            </StyledSummaryChip>
            <StyledSummaryChip>
              <StyledSummaryText>{overviewSummary.access}</StyledSummaryText>
            </StyledSummaryChip>
            <StyledSummaryChip>
              <StyledSummaryText>
                {overviewSummary.recentCount}
              </StyledSummaryText>
            </StyledSummaryChip>
          </StyledSummaryList>

          {showRegisterPatientAction ? (
            <Button
              variant="surface"
              size="medium"
              onPress={onRegisterPatient}
              accessibilityLabel={t('patients.overview.registerPatient')}
              accessibilityHint={t('patients.overview.registerPatientHint')}
              icon={<Icon glyph="+" size="xs" decorative />}
              testID="patients-overview-register"
            >
              {t('patients.overview.registerPatient')}
            </Button>
          ) : null}
        </StyledHeader>

        <Modal
          visible={isHelpOpen}
          onDismiss={() => setIsHelpOpen(false)}
          size="medium"
          accessibilityLabel={helpContent.title}
          accessibilityHint={helpContent.body}
          testID="patients-overview-help-modal"
        >
          <StyledHelpModalTitle>{helpContent.title}</StyledHelpModalTitle>
          <StyledHelpModalBody>{helpContent.body}</StyledHelpModalBody>
          {helpContent.items.map((item) => (
            <StyledHelpModalItem key={item}>{`- ${item}`}</StyledHelpModalItem>
          ))}
        </Modal>

        {isLoading ? (
          <LoadingSpinner
            accessibilityLabel={t('common.loading')}
            testID="patients-overview-loading"
          />
        ) : null}

        {!isLoading && hasError && !isOffline ? (
          <ErrorState
            size={ErrorStateSizes.SMALL}
            title={t('patients.overview.loadErrorTitle')}
            description={errorMessage}
            action={
              <Button
                variant="surface"
                size="medium"
                onPress={onRetry}
                accessibilityLabel={t('common.retry')}
                accessibilityHint={t('common.retryHint')}
                icon={<Icon glyph={'\u21bb'} size="xs" decorative />}
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
                size="medium"
                onPress={onRetry}
                accessibilityLabel={t('common.retry')}
                accessibilityHint={t('common.retryHint')}
                icon={<Icon glyph={'\u21bb'} size="xs" decorative />}
              >
                {t('common.retry')}
              </Button>
            }
            testID="patients-overview-offline"
          />
        ) : null}

        <StyledSection>
          <StyledSectionHeader>
            <StyledSectionTitle>
              {t('patients.overview.quickPathsTitle')}
            </StyledSectionTitle>
          </StyledSectionHeader>
          <StyledCardGrid>
            {cards.map((card) => {
              const actionLabel =
                card.id === 'legal'
                  ? t('patients.overview.openLegalHub')
                  : t('patients.overview.openDirectory');
              return (
                <Card
                  key={card.id}
                  variant="outlined"
                  accessibilityLabel={card.label}
                  testID={`patients-card-${card.id}`}
                >
                  <StyledTileTitle>{card.label}</StyledTileTitle>
                  <StyledTileDescription>
                    {card.description}
                  </StyledTileDescription>
                  <StyledTileAction
                    onPress={() => onOpenResource(card.routePath)}
                    accessibilityLabel={actionLabel}
                  >
                    <Text variant="body">{actionLabel}</Text>
                  </StyledTileAction>
                </Card>
              );
            })}
          </StyledCardGrid>
        </StyledSection>

        <StyledSection>
          <StyledSectionHeader>
            <StyledSectionTitle>
              {t('patients.overview.recentPatientsTitle')}
            </StyledSectionTitle>
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
              <PatientListCards
                items={recentPatients}
                onOpenPatient={onOpenPatient}
                patientLabel={t('patients.directory.columns.patient')}
                patientIdLabel={t('patients.directory.columns.patientId')}
                tenantLabel={t('patients.directory.columns.tenant')}
                facilityLabel={t('patients.directory.columns.facility')}
                contactLabel={t('patients.directory.contactLabel')}
                resolveOpenAccessibilityLabel={(patient) =>
                  t('patients.overview.openPatient', {
                    patient: patient.displayName,
                  })
                }
                testIdPrefix="patients-overview-item-"
              />
            )}
          </Card>
        </StyledSection>
      </StyledContent>
    </StyledContainer>
  );
};

export default PatientsOverviewScreen;
