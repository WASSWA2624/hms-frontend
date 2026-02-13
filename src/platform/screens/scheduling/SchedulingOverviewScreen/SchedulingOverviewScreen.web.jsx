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
} from './SchedulingOverviewScreen.web.styles';
import useSchedulingOverviewScreen from './useSchedulingOverviewScreen';

const SchedulingOverviewScreenWeb = () => {
  const { t } = useI18n();
  const {
    cards,
    recentAppointments,
    canCreateSchedulingRecords,
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
    <StyledContainer role="main" aria-label={t('scheduling.overview.title')}>
      <StyledContent>
        <StyledHeader>
          <Text variant="h2" accessibilityRole="header">{t('scheduling.overview.title')}</Text>
          <Text variant="body">{t('scheduling.overview.description')}</Text>
          <Button
            variant="surface"
            size="small"
            onPress={onCreateAppointment}
            disabled={!canCreateSchedulingRecords}
            aria-disabled={!canCreateSchedulingRecords}
            title={!canCreateSchedulingRecords ? t('scheduling.access.createDenied') : undefined}
            accessibilityLabel={t('scheduling.overview.createAppointment')}
            accessibilityHint={t('scheduling.overview.createAppointmentHint')}
            icon={<Icon glyph="+" size="xs" decorative />}
            testID="scheduling-overview-create-appointment"
          >
            {t('scheduling.overview.createAppointment')}
          </Button>
        </StyledHeader>

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
                {recentAppointments.map((appointment) => {
                  const title = appointment.reason || appointment.id;
                  const subtitle = appointment.status || appointment.scheduled_start || '';
                  return (
                    <li key={appointment.id} role="listitem">
                      <ListItem
                        title={title}
                        subtitle={subtitle}
                        onPress={() => onOpenAppointment(appointment)}
                        accessibilityLabel={t('scheduling.overview.openAppointment', { appointment: title })}
                        testID={`scheduling-overview-item-${appointment.id}`}
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
