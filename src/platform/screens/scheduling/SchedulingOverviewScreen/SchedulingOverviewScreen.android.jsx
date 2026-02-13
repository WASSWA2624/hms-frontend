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
} from './SchedulingOverviewScreen.android.styles';
import useSchedulingOverviewScreen from './useSchedulingOverviewScreen';

const SchedulingOverviewScreenAndroid = () => {
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
    <StyledContainer>
      <StyledContent>
        <StyledHeader>
          <Text variant="h2" accessibilityRole="header">{t('scheduling.overview.title')}</Text>
          <Text variant="body">{t('scheduling.overview.description')}</Text>
          <Button
            variant="surface"
            size="small"
            onPress={onCreateAppointment}
            disabled={!canCreateSchedulingRecords}
            accessibilityLabel={t('scheduling.overview.createAppointment')}
            accessibilityHint={
              canCreateSchedulingRecords
                ? t('scheduling.overview.createAppointmentHint')
                : t('scheduling.access.createDenied')
            }
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
                  const title = appointment.reason || appointment.id;
                  const subtitle = appointment.status || appointment.scheduled_start || '';
                  return (
                    <React.Fragment key={appointment.id}>
                      <ListItem
                        title={title}
                        subtitle={subtitle}
                        onPress={() => onOpenAppointment(appointment)}
                        accessibilityLabel={t('scheduling.overview.openAppointment', { appointment: title })}
                        testID={`scheduling-overview-item-${appointment.id}`}
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
