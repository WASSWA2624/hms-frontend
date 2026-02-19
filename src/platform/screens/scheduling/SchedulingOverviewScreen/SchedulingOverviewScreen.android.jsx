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
} from '@platform/components';
import { useI18n } from '@hooks';
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
  StyledRecentList,
  StyledSection,
  StyledSectionHeader,
  StyledSectionTitle,
  StyledSeparator,
  StyledSummaryChip,
  StyledSummaryList,
  StyledSummaryText,
  StyledTileAction,
  StyledTileDescription,
  StyledTileTitle,
} from './SchedulingOverviewScreen.android.styles';
import useSchedulingOverviewScreen from './useSchedulingOverviewScreen';

const SchedulingOverviewScreenAndroid = () => {
  const { t } = useI18n();
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const {
    cards,
    overviewSummary,
    helpContent,
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
  } = useSchedulingOverviewScreen();

  return (
    <StyledContainer>
      <StyledContent>
        <StyledHeader>
          <StyledHeaderTop>
            <StyledHeaderCopy>
              <Text variant="h2" accessibilityRole="header">{t('scheduling.overview.title')}</Text>
              <Text variant="body">{t('scheduling.overview.description')}</Text>
            </StyledHeaderCopy>
            <StyledHelpButton
              accessibilityRole="button"
              accessibilityLabel={helpContent.label}
              accessibilityHint={helpContent.tooltip}
              testID="scheduling-overview-help-trigger"
              onPress={() => setIsHelpOpen(true)}
            >
              <StyledHelpButtonLabel>?</StyledHelpButtonLabel>
            </StyledHelpButton>
          </StyledHeaderTop>

          <StyledSummaryList accessibilityLabel={t('scheduling.overview.summaryTitle')}>
            <StyledSummaryChip>
              <StyledSummaryText>{overviewSummary.scope}</StyledSummaryText>
            </StyledSummaryChip>
            <StyledSummaryChip>
              <StyledSummaryText>{overviewSummary.access}</StyledSummaryText>
            </StyledSummaryChip>
            <StyledSummaryChip>
              <StyledSummaryText>{overviewSummary.recentCount}</StyledSummaryText>
            </StyledSummaryChip>
          </StyledSummaryList>

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
          {helpContent.items.map((item) => (
            <StyledHelpModalItem key={item}>{`- ${item}`}</StyledHelpModalItem>
          ))}
        </Modal>

        {isLoading ? (
          <LoadingSpinner accessibilityLabel={t('common.loading')} testID="scheduling-overview-loading" />
        ) : null}

        {!isLoading && hasError && !isOffline ? (
          <ErrorState
            size={ErrorStateSizes.SMALL}
            title={t('scheduling.overview.loadErrorTitle')}
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
            testID="scheduling-overview-error"
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
                  onPress={() => onOpenResource(card.routePath)}
                  accessibilityLabel={t('scheduling.overview.openResource', { resource: card.label })}
                >
                  <Text variant="body">{t('scheduling.overview.openResourceButton')}</Text>
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
              <StyledRecentList>
                {recentAppointments.map((appointment, index) => {
                  return (
                    <React.Fragment key={appointment.listKey}>
                      <ListItem
                        title={appointment.displayName}
                        subtitle={appointment.subtitle}
                        onPress={() => onOpenAppointment(appointment)}
                        accessibilityLabel={t('scheduling.overview.openAppointment', { appointment: appointment.displayName })}
                        testID={`scheduling-overview-item-${index + 1}`}
                      />
                      {index < recentAppointments.length - 1 ? <StyledSeparator /> : null}
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

export default SchedulingOverviewScreenAndroid;
