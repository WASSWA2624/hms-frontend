import React, { useRef, useState } from 'react';
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
  Tooltip,
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
  StyledHelpAnchor,
  StyledHelpButton,
  StyledHelpChecklist,
  StyledHelpItem,
  StyledHelpModalBody,
  StyledHelpModalTitle,
  StyledSection,
  StyledSectionHeader,
  StyledSectionTitle,
  StyledSummaryList,
  StyledSummaryListItem,
  StyledTileAction,
  StyledTileDescription,
  StyledTileTitle,
} from './PatientsOverviewScreen.web.styles';
import usePatientsOverviewScreen from './usePatientsOverviewScreen';

const PatientsOverviewScreenWeb = () => {
  const { t } = useI18n();
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [isTooltipVisible, setIsTooltipVisible] = useState(false);
  const helpButtonRef = useRef(null);
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
    onEditPatient,
    onDeletePatient,
    onRegisterPatient,
  } = usePatientsOverviewScreen();

  return (
    <StyledContainer role="main" aria-label={t('patients.overview.title')}>
      <StyledContent>
        <StyledHeader>
          <StyledHeaderTop>
            <StyledHeaderCopy>
              <Text variant="h2" accessibilityRole="header">{t('patients.overview.title')}</Text>
              <Text variant="body">{t('patients.overview.description')}</Text>
            </StyledHeaderCopy>
            <StyledHelpAnchor>
              <StyledHelpButton
                ref={helpButtonRef}
                type="button"
                aria-label={helpContent.label}
                aria-describedby="patients-overview-help-tooltip"
                testID="patients-overview-help-trigger"
                data-testid="patients-overview-help-trigger"
                onMouseEnter={() => setIsTooltipVisible(true)}
                onMouseLeave={() => setIsTooltipVisible(false)}
                onFocus={() => setIsTooltipVisible(true)}
                onBlur={() => setIsTooltipVisible(false)}
                onClick={() => setIsHelpOpen(true)}
              >
                <Icon glyph="?" size="xs" decorative />
              </StyledHelpButton>
              <Tooltip
                id="patients-overview-help-tooltip"
                visible={isTooltipVisible && !isHelpOpen}
                position="bottom"
                text={helpContent.tooltip}
                anchorRef={helpButtonRef}
                testID="patients-overview-help-tooltip"
              />
            </StyledHelpAnchor>
          </StyledHeaderTop>

          <StyledSummaryList role="list" aria-label={t('patients.overview.summaryTitle')}>
            <StyledSummaryListItem role="listitem">{overviewSummary.scope}</StyledSummaryListItem>
            <StyledSummaryListItem role="listitem">{overviewSummary.access}</StyledSummaryListItem>
            <StyledSummaryListItem role="listitem">{overviewSummary.recentCount}</StyledSummaryListItem>
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
          <StyledHelpChecklist>
            {helpContent.items.map((item) => (
              <StyledHelpItem key={item}>{item}</StyledHelpItem>
            ))}
          </StyledHelpChecklist>
        </Modal>

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
            <StyledSectionTitle>{t('patients.overview.quickPathsTitle')}</StyledSectionTitle>
          </StyledSectionHeader>
          <StyledCardGrid>
            {cards.map((card) => (
              <Card key={card.id} variant="outlined" accessibilityLabel={card.label} testID={`patients-card-${card.id}`}>
                <StyledTileTitle>{card.label}</StyledTileTitle>
                <StyledTileDescription>{card.description}</StyledTileDescription>
                {(() => {
                  const actionLabel = card.id === 'legal'
                    ? t('patients.overview.openLegalHub')
                    : t('patients.overview.openDirectory');
                  return (
                <StyledTileAction
                  type="button"
                  onClick={() => onOpenResource(card.routePath)}
                  aria-label={actionLabel}
                >
                      {actionLabel}
                </StyledTileAction>
                  );
                })()}
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
              <PatientListCards
                items={recentPatients}
                onOpenPatient={onOpenPatient}
                onEditPatient={onEditPatient}
                onDeletePatient={onDeletePatient}
                patientLabel={t('patients.directory.columns.patient')}
                patientIdLabel={t('patients.directory.columns.patientId')}
                tenantLabel={t('patients.directory.columns.tenant')}
                facilityLabel={t('patients.directory.columns.facility')}
                actionsLabel={t('patients.common.list.columnActions')}
                openButtonLabel={t('patients.directory.openWorkspace')}
                editButtonLabel={t('common.edit')}
                deleteButtonLabel={t('common.delete')}
                resolveOpenAccessibilityLabel={(patient) =>
                  t('patients.overview.openPatient', { patient: patient.displayName })
                }
                resolveEditAccessibilityLabel={(patient) =>
                  t('patients.directory.actions.editHint', {
                    patient: patient?.displayName || t('patients.directory.columns.patient'),
                  })
                }
                resolveDeleteAccessibilityLabel={(patient) =>
                  t('patients.directory.actions.deleteHint', {
                    patient: patient?.displayName || t('patients.directory.columns.patient'),
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

export default PatientsOverviewScreenWeb;

