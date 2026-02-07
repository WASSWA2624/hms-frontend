/**
 * DashboardScreen Component - Web
 * Authenticated dashboard screen for Web platform
 * File: HomeScreen.web.jsx
 */
// 1. External dependencies
import React, { useMemo } from 'react';

// 2. Platform components (from barrel file)
import {
  Badge,
  Button,
  Card,
  EmptyState,
  ErrorState,
  OfflineState,
  ProgressBar,
  Skeleton,
  Text,
} from '@platform/components';

// 3. Hooks and utilities (absolute imports via aliases)
import { useI18n } from '@hooks';

// 4. Styles (relative import - platform-specific)
import {
  StyledHomeContainer,
  StyledContent,
  StyledSection,
  StyledSectionHeader,
  StyledSectionTitleGroup,
  StyledSectionMeta,
  StyledSectionBody,
  StyledStatGrid,
  StyledCardWrapper,
  StyledStatCardContent,
  StyledStatValueRow,
  StyledCapacityList,
  StyledCapacityItem,
  StyledCapacityHeader,
  StyledSectionGrid,
  StyledCardHeaderContent,
  StyledList,
  StyledListItem,
  StyledListItemContent,
  StyledListItemMeta,
  StyledStateWrapper,
  StyledLoadingGrid,
  StyledLoadingBlock,
} from './HomeScreen.web.styles';

// 5. Component-specific hook (relative import)
import useDashboardScreen from './useDashboardScreen';

// 6. Types and constants (relative import)
import { STATES } from './types';

const getDeltaConfig = (delta) => {
  if (delta > 0) return { variant: 'success', key: 'home.summary.deltaUp' };
  if (delta < 0) return { variant: 'warning', key: 'home.summary.deltaDown' };
  return { variant: 'primary', key: 'home.summary.deltaNeutral' };
};

/**
 * DashboardScreen component for Web
 * @param {Object} props - DashboardScreen props
 */
const DashboardScreenWeb = () => {
  const { t, locale } = useI18n();
  const { state, isOffline, summaryCards, capacityStats, appointments, alerts, onRetry } =
    useDashboardScreen();

  const numberFormatter = useMemo(() => new Intl.NumberFormat(locale), [locale]);
  const formatNumber = (value) => numberFormatter.format(value);
  const formatPercent = (used, total) => Math.round((used / total) * 100);

  const isEmpty =
    summaryCards.length === 0 &&
    capacityStats.length === 0 &&
    appointments.length === 0 &&
    alerts.length === 0;

  const renderLoadingState = () => (
    <StyledStateWrapper>
      <StyledLoadingBlock>
        <Skeleton variant="text" lines={1} width="50%" />
        <Skeleton variant="text" lines={2} />
      </StyledLoadingBlock>
      <StyledLoadingGrid>
        {Array.from({ length: 4 }).map((_, index) => (
          <StyledCardWrapper key={`loading-card-${index}`}>
            <Skeleton variant="rectangular" height={96} />
          </StyledCardWrapper>
        ))}
      </StyledLoadingGrid>
      <StyledLoadingBlock>
        <Skeleton variant="rectangular" height={180} />
      </StyledLoadingBlock>
      <StyledLoadingBlock>
        <Skeleton variant="rectangular" height={240} />
      </StyledLoadingBlock>
    </StyledStateWrapper>
  );

  const renderErrorState = () => (
    <StyledStateWrapper>
      <ErrorState
        title={t('home.states.errorTitle')}
        description={t('home.states.errorMessage')}
        action={
          <Button
            onPress={onRetry}
            accessibilityLabel={t('home.states.retryLabel')}
            accessibilityHint={t('home.states.retryHint')}
          >
            {t('common.retry')}
          </Button>
        }
        testID="dashboard-error-state"
      />
    </StyledStateWrapper>
  );

  const renderEmptyState = () => (
    <StyledStateWrapper>
      <EmptyState
        title={t('home.states.emptyTitle')}
        description={t('home.states.emptyMessage')}
        testID="dashboard-empty-state"
      />
    </StyledStateWrapper>
  );

  if (state === STATES.LOADING) {
    return (
      <StyledHomeContainer role="main" aria-label={t('home.title')} data-testid="dashboard-screen">
        <StyledContent>{renderLoadingState()}</StyledContent>
      </StyledHomeContainer>
    );
  }

  if (state === STATES.ERROR) {
    return (
      <StyledHomeContainer role="main" aria-label={t('home.title')} data-testid="dashboard-screen">
        <StyledContent>{renderErrorState()}</StyledContent>
      </StyledHomeContainer>
    );
  }

  if (state === STATES.EMPTY || isEmpty) {
    return (
      <StyledHomeContainer role="main" aria-label={t('home.title')} data-testid="dashboard-screen">
        <StyledContent>{renderEmptyState()}</StyledContent>
      </StyledHomeContainer>
    );
  }

  return (
    <StyledHomeContainer role="main" aria-label={t('home.title')} data-testid="dashboard-screen">
      <StyledContent>
        {isOffline && (
          <StyledSection>
            <OfflineState
              title={t('home.states.offlineTitle')}
              description={t('home.states.offlineMessage')}
              testID="dashboard-offline-state"
            />
          </StyledSection>
        )}

        <StyledSection>
          <StyledSectionHeader>
            <StyledSectionTitleGroup>
              <Text variant="h2" accessibilityRole="header">
                {t('home.summary.title')}
              </Text>
              <Text variant="caption">{t('home.summary.subtitle')}</Text>
            </StyledSectionTitleGroup>
            <StyledSectionMeta>
              <Text variant="caption">{t('home.summary.meta')}</Text>
            </StyledSectionMeta>
          </StyledSectionHeader>
          <StyledSectionBody>
            <StyledStatGrid>
              {summaryCards.map((card) => {
                const deltaConfig = getDeltaConfig(card.delta);
                return (
                  <StyledCardWrapper key={card.id}>
                    <Card>
                      <StyledStatCardContent>
                        <Text variant="label">{t(card.labelKey)}</Text>
                        <StyledStatValueRow>
                          <Text variant="h2">{formatNumber(card.value)}</Text>
                          <Badge
                            variant={deltaConfig.variant}
                            accessibilityLabel={t(deltaConfig.key, { value: Math.abs(card.delta) })}
                          >
                            {t(deltaConfig.key, { value: Math.abs(card.delta) })}
                          </Badge>
                        </StyledStatValueRow>
                      </StyledStatCardContent>
                    </Card>
                  </StyledCardWrapper>
                );
              })}
            </StyledStatGrid>
          </StyledSectionBody>
        </StyledSection>

        <StyledSection>
          <StyledSectionHeader>
            <StyledSectionTitleGroup>
              <Text variant="h2" accessibilityRole="header">
                {t('home.capacity.title')}
              </Text>
              <Text variant="caption">{t('home.capacity.subtitle')}</Text>
            </StyledSectionTitleGroup>
          </StyledSectionHeader>
          <StyledSectionBody>
            <Card>
              <StyledCapacityList>
                {capacityStats.map((stat) => {
                  const percent = formatPercent(stat.used, stat.total);
                  return (
                    <StyledCapacityItem key={stat.id}>
                      <StyledCapacityHeader>
                        <Text variant="body">{t(stat.labelKey)}</Text>
                        <Text variant="caption">
                          {t('home.capacity.ratio', {
                            used: formatNumber(stat.used),
                            total: formatNumber(stat.total),
                          })}
                        </Text>
                      </StyledCapacityHeader>
                      <ProgressBar
                        value={percent}
                        variant={stat.variant}
                        accessibilityLabel={t('home.capacity.progress', {
                          label: t(stat.labelKey),
                          value: percent,
                        })}
                      />
                    </StyledCapacityItem>
                  );
                })}
              </StyledCapacityList>
            </Card>
          </StyledSectionBody>
        </StyledSection>

        <StyledSection>
          <StyledSectionHeader>
            <StyledSectionTitleGroup>
              <Text variant="h2" accessibilityRole="header">
                {t('home.operations.title')}
              </Text>
              <Text variant="caption">{t('home.operations.subtitle')}</Text>
            </StyledSectionTitleGroup>
          </StyledSectionHeader>
          <StyledSectionBody>
            <StyledSectionGrid>
              <Card
                header={
                  <StyledCardHeaderContent>
                    <Text variant="h3">{t('home.appointments.title')}</Text>
                    <Text variant="caption">{t('home.appointments.subtitle')}</Text>
                  </StyledCardHeaderContent>
                }
              >
                {appointments.length === 0 ? (
                  <Text variant="caption">{t('home.appointments.empty')}</Text>
                ) : (
                  <StyledList>
                    {appointments.map((item) => (
                      <StyledListItem key={item.id}>
                        <StyledListItemContent>
                          <Text variant="body">{t(item.titleKey)}</Text>
                          <StyledListItemMeta>
                            <Text variant="caption">{t(item.metaKey)}</Text>
                          </StyledListItemMeta>
                        </StyledListItemContent>
                        <Badge
                          variant={item.statusVariant}
                          accessibilityLabel={t(item.statusKey)}
                        >
                          {t(item.statusKey)}
                        </Badge>
                      </StyledListItem>
                    ))}
                  </StyledList>
                )}
              </Card>

              <Card
                header={
                  <StyledCardHeaderContent>
                    <Text variant="h3">{t('home.alerts.title')}</Text>
                    <Text variant="caption">{t('home.alerts.subtitle')}</Text>
                  </StyledCardHeaderContent>
                }
              >
                {alerts.length === 0 ? (
                  <Text variant="caption">{t('home.alerts.empty')}</Text>
                ) : (
                  <StyledList>
                    {alerts.map((item) => (
                      <StyledListItem key={item.id}>
                        <StyledListItemContent>
                          <Text variant="body">{t(item.titleKey)}</Text>
                          <StyledListItemMeta>
                            <Text variant="caption">{t(item.metaKey)}</Text>
                          </StyledListItemMeta>
                        </StyledListItemContent>
                        <Badge
                          variant={item.severityVariant}
                          accessibilityLabel={t(item.severityKey)}
                        >
                          {t(item.severityKey)}
                        </Badge>
                      </StyledListItem>
                    ))}
                  </StyledList>
                )}
              </Card>
            </StyledSectionGrid>
          </StyledSectionBody>
        </StyledSection>
      </StyledContent>
    </StyledHomeContainer>
  );
};

export default DashboardScreenWeb;

