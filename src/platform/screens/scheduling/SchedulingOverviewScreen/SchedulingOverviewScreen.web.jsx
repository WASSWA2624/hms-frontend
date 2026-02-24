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
} from './SchedulingOverviewScreen.web.styles';
import useSchedulingOverviewScreen from './useSchedulingOverviewScreen';

const SchedulingOverviewScreenWeb = () => {
  const { t } = useI18n();
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [isTooltipVisible, setIsTooltipVisible] = useState(false);
  const {
    cards,
    overviewSummary,
    helpContent,
    opdQuickCtaLabel,
    opdQuickCtaHint,
    opdEmphasis,
    recentAppointments,
    showCreateAppointmentAction,
    isLoading,
    hasError,
    errorMessage,
    isOffline,
    onRetry,
    onOpenResource,
    onOpenAppointment,
    onCreateAppointment,
    onOpenOpdWorkbench,
  } = useSchedulingOverviewScreen();

  return (
    <StyledContainer role="main" aria-label={t('scheduling.overview.title')}>
      <StyledContent>
        <StyledHeader>
          <StyledHeaderTop>
            <StyledHeaderCopy>
              <Text variant="h2" accessibilityRole="header">{t('scheduling.overview.title')}</Text>
              <Text variant="body">{t('scheduling.overview.description')}</Text>
            </StyledHeaderCopy>
            <StyledHelpAnchor>
              <StyledHelpButton
                type="button"
                aria-label={helpContent.label}
                aria-describedby="scheduling-overview-help-tooltip"
                testID="scheduling-overview-help-trigger"
                data-testid="scheduling-overview-help-trigger"
                onMouseEnter={() => setIsTooltipVisible(true)}
                onMouseLeave={() => setIsTooltipVisible(false)}
                onFocus={() => setIsTooltipVisible(true)}
                onBlur={() => setIsTooltipVisible(false)}
                onClick={() => setIsHelpOpen(true)}
              >
                <Icon glyph="?" size="xs" decorative />
              </StyledHelpButton>
              <Tooltip
                id="scheduling-overview-help-tooltip"
                visible={isTooltipVisible && !isHelpOpen}
                position="bottom"
                text={helpContent.tooltip}
                testID="scheduling-overview-help-tooltip"
              />
            </StyledHelpAnchor>
          </StyledHeaderTop>

          <StyledSummaryList role="list" aria-label={t('scheduling.overview.summaryTitle')}>
            <StyledSummaryListItem role="listitem">{overviewSummary.scope}</StyledSummaryListItem>
            <StyledSummaryListItem role="listitem">{overviewSummary.access}</StyledSummaryListItem>
            <StyledSummaryListItem role="listitem">{overviewSummary.recentCount}</StyledSummaryListItem>
          </StyledSummaryList>

          <Text variant="caption">{opdEmphasis}</Text>

          <Button
            variant="surface"
            size="small"
            onPress={onOpenOpdWorkbench}
            accessibilityLabel={opdQuickCtaLabel}
            accessibilityHint={opdQuickCtaHint}
            icon={<Icon glyph="+" size="xs" decorative />}
            testID="scheduling-overview-open-opd-workbench"
          >
            {opdQuickCtaLabel}
          </Button>

          {showCreateAppointmentAction ? (
            <Button
              variant="surface"
              size="small"
              onPress={onCreateAppointment}
              accessibilityLabel={t('scheduling.overview.createAppointment')}
              accessibilityHint={t('scheduling.overview.createAppointmentHint')}
              icon={<Icon glyph="+" size="xs" decorative />}
              testID="scheduling-overview-create-appointment"
            >
              {t('scheduling.overview.createAppointment')}
            </Button>
          ) : null}
        </StyledHeader>

        <Modal
          visible={isHelpOpen}
          onDismiss={() => setIsHelpOpen(false)}
          size="small"
          accessibilityLabel={helpContent.title}
          accessibilityHint={helpContent.body}
          testID="scheduling-overview-help-modal"
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
          <LoadingSpinner accessibilityLabel={t('common.loading')} testID="scheduling-overview-loading" />
        ) : null}

        {!isLoading && hasError && !isOffline ? (
          <ErrorState
            size={ErrorStateSizes.SMALL}
            title={t('scheduling.overview.loadErrorTitle')}
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
            testID="scheduling-overview-error"
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
            testID="scheduling-overview-offline"
          />
        ) : null}

        <StyledSection>
          <StyledSectionHeader>
            <StyledSectionTitle>{t('scheduling.overview.resourcesTitle')}</StyledSectionTitle>
          </StyledSectionHeader>
          <StyledCardGrid>
            {cards.map((card) => (
              <Card key={card.id} variant="outlined" accessibilityLabel={card.label} testID={`scheduling-card-${card.id}`}>
                <StyledTileTitle>{card.label}</StyledTileTitle>
                <StyledTileDescription>{card.description}</StyledTileDescription>
                <StyledTileAction
                  type="button"
                  onClick={() => onOpenResource(card.routePath)}
                  aria-label={t('scheduling.overview.openResource', { resource: card.label })}
                >
                  {t('scheduling.overview.openResourceButton')}
                </StyledTileAction>
              </Card>
            ))}
          </StyledCardGrid>
        </StyledSection>

        <StyledSection>
          <StyledSectionHeader>
            <StyledSectionTitle>{t('scheduling.overview.recentAppointmentsTitle')}</StyledSectionTitle>
          </StyledSectionHeader>
          <Card
            variant="outlined"
            accessibilityLabel={t('scheduling.overview.recentAppointmentsTitle')}
            testID="scheduling-overview-recent"
          >
            {recentAppointments.length === 0 ? (
              <EmptyState
                title={t('scheduling.overview.emptyTitle')}
                description={t('scheduling.overview.emptyMessage')}
                testID="scheduling-overview-empty"
              />
            ) : (
              <StyledRecentList role="list">
                {recentAppointments.map((appointment, index) => {
                  return (
                    <li key={appointment.listKey} role="listitem">
                      <ListItem
                        title={appointment.displayName}
                        subtitle={appointment.subtitle}
                        onPress={() => onOpenAppointment(appointment)}
                        accessibilityLabel={t('scheduling.overview.openAppointment', { appointment: appointment.displayName })}
                        testID={`scheduling-overview-item-${index + 1}`}
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

export default SchedulingOverviewScreenWeb;
