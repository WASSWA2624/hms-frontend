import React, { useState } from 'react';
import {
  Button,
  Card,
  EmptyState,
  ErrorState,
  ErrorStateSizes,
  Icon,
  ListItem,
  LoadingSpinner,
  Modal,
  OfflineState,
  OfflineStateSizes,
  Text,
  Tooltip,
} from '@platform/components';
import { useI18n } from '@hooks';
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
  StyledRecentList,
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
              size="small"
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
          size="small"
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
              <StyledRecentList role="list">
                {recentPatients.map((patient, index) => {
                  return (
                    <li key={patient.listKey} role="listitem">
                      <ListItem
                        title={patient.displayName}
                        subtitle={patient.subtitle}
                        onPress={() => onOpenPatient(patient.id)}
                        accessibilityLabel={t('patients.overview.openPatient', { patient: patient.displayName })}
                        testID={`patients-overview-item-${index + 1}`}
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

export default PatientsOverviewScreenWeb;
