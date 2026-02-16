/**
 * DashboardScreen Component - Web
 * Authenticated dashboard screen for Web platform
 * File: DashboardScreen.web.jsx
 */
import React, { useMemo } from 'react';
import {
  Badge,
  Button,
  Card,
  EmptyState,
  ErrorState,
  OfflineState,
  Skeleton,
  Text,
} from '@platform/components';
import { useI18n } from '@hooks';
import {
  StyledHomeContainer,
  StyledContent,
  StyledSection,
  StyledSectionHeader,
  StyledSectionTitleGroup,
  StyledSectionMeta,
  StyledSectionBody,
  StyledHeroPanel,
  StyledWelcomeSection,
  StyledWelcomeMessage,
  StyledWelcomeMeta,
  StyledBadgeRow,
  StyledSummaryGrid,
  StyledStatCardContent,
  StyledStatValueRow,
  StyledAnalyticsGrid,
  StyledTrendChart,
  StyledTrendColumn,
  StyledTrendBarTrack,
  StyledTrendBarFill,
  StyledTrendMeta,
  StyledDonutLayout,
  StyledDonut,
  StyledDonutCenter,
  StyledLegendList,
  StyledLegendItem,
  StyledLegendLabel,
  StyledLegendSwatch,
  StyledHighlightGrid,
  StyledHighlightCard,
  StyledSectionGrid,
  StyledList,
  StyledListItem,
  StyledListItemContent,
  StyledListItemMeta,
  StyledActivityMeta,
  StyledQuickActions,
  StyledCardHeaderContent,
  StyledStateWrapper,
  StyledLoadingGrid,
  StyledLoadingBlock,
  StyledCardWrapper,
} from './DashboardScreen.web.styles';
import useDashboardScreen from './useDashboardScreen';
import { STATES } from './types';

const resolveText = (item, directField, keyField, t) => {
  const directValue = item?.[directField];
  if (typeof directValue === 'string' && directValue.trim()) return directValue;
  const keyValue = item?.[keyField];
  if (typeof keyValue === 'string' && keyValue.trim()) return t(keyValue);
  return '';
};

const formatDistributionValue = (segmentValue, total) => {
  if (!total) return '0%';
  return `${Math.round((segmentValue / total) * 100)}%`;
};

const DashboardScreenWeb = () => {
  const { t, locale } = useI18n();
  const {
    state,
    isOffline,
    facilityContext,
    dashboardRole,
    liveDashboard,
    quickActions,
    workQueue,
    attentionAlerts,
    activityFeed,
    lastUpdated,
    onRetry,
    onQuickAction,
  } = useDashboardScreen();

  const summaryCards = liveDashboard?.summaryCards || [];
  const trendPoints = liveDashboard?.trend?.points || [];
  const distribution = liveDashboard?.distribution || { total: 0, segments: [] };
  const highlightItems = liveDashboard?.highlights || [];
  const queueItems = liveDashboard?.queue?.length ? liveDashboard.queue : workQueue;
  const alertItems = liveDashboard?.alerts?.length ? liveDashboard.alerts : attentionAlerts;
  const activityItems = liveDashboard?.activity?.length ? liveDashboard.activity : activityFeed;

  const numberFormatter = useMemo(() => new Intl.NumberFormat(locale), [locale]);
  const currencyFormatter = useMemo(
    () => new Intl.NumberFormat(locale, { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }),
    [locale]
  );
  const timeFormatter = useMemo(
    () => new Intl.DateTimeFormat(locale, { hour: '2-digit', minute: '2-digit' }),
    [locale]
  );
  const dayFormatter = useMemo(
    () => new Intl.DateTimeFormat(locale, { weekday: 'short' }),
    [locale]
  );

  const formatMetricValue = (item) => {
    if (!item) return '0';
    if (item.format === 'currency') return currencyFormatter.format(item.value || 0);
    if (item.format === 'percent') return `${numberFormatter.format(item.value || 0)}%`;
    if (item.format === 'minutes') return `${numberFormatter.format(item.value || 0)} min`;
    return numberFormatter.format(item.value || 0);
  };

  const trendMax = useMemo(
    () => Math.max(1, ...trendPoints.map((point) => Number(point?.value || 0))),
    [trendPoints]
  );

  const distributionTotal = distribution.total || distribution.segments.reduce((sum, item) => sum + (item.value || 0), 0);

  const donutGradient = useMemo(() => {
    const segments = distribution.segments.filter((item) => item.value > 0);
    if (!segments.length || distributionTotal <= 0) {
      return 'conic-gradient(#cbd5e1 0deg 360deg)';
    }

    let cursor = 0;
    const slices = segments.map((item) => {
      const start = cursor;
      const sweep = (item.value / distributionTotal) * 360;
      cursor += sweep;
      return `${item.color} ${start}deg ${cursor}deg`;
    });
    return `conic-gradient(${slices.join(', ')})`;
  }, [distribution.segments, distributionTotal]);

  const isEmpty =
    summaryCards.length === 0 &&
    queueItems.length === 0 &&
    alertItems.length === 0 &&
    activityItems.length === 0 &&
    quickActions.length === 0;

  const renderLoadingState = () => (
    <StyledStateWrapper>
      <StyledLoadingBlock>
        <Skeleton variant="text" lines={1} width="48%" />
        <Skeleton variant="text" lines={2} />
      </StyledLoadingBlock>
      <StyledLoadingGrid>
        {Array.from({ length: 5 }).map((_, index) => (
          <StyledCardWrapper key={`loading-summary-${index}`}>
            <Skeleton variant="rectangular" height={96} />
          </StyledCardWrapper>
        ))}
      </StyledLoadingGrid>
      <StyledLoadingBlock>
        <Skeleton variant="rectangular" height={280} />
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
          <StyledHeroPanel>
            <StyledWelcomeSection>
              <StyledWelcomeMessage>
                <Text variant="h1" accessibilityRole="header">
                  {t('home.welcome.title', { name: facilityContext.userName })}
                </Text>
                <Text variant="body">
                  {t('home.welcome.subtitle', {
                    role: t(facilityContext.roleKey),
                    facility: facilityContext.facilityName,
                  })}
                </Text>
              </StyledWelcomeMessage>

              <StyledWelcomeMeta>
                <Text variant="body">{dashboardRole?.subtitle}</Text>
                <Text variant="caption">
                  {t('home.welcome.facilityMeta', {
                    facility: facilityContext.facilityName,
                    branch: facilityContext.branchName,
                  })}
                </Text>
                <StyledBadgeRow>
                  <Badge variant={dashboardRole?.badgeVariant || 'primary'}>
                    {dashboardRole?.title || 'Operations'}
                  </Badge>
                  <Badge variant="primary">{t(facilityContext.facilityTypeKey)}</Badge>
                  <Badge variant="success">{t(facilityContext.planStatusKey)}</Badge>
                  <Badge variant="warning">
                    {t(facilityContext.planDetailKey, { count: facilityContext.planDetailValue })}
                  </Badge>
                </StyledBadgeRow>
              </StyledWelcomeMeta>
            </StyledWelcomeSection>
          </StyledHeroPanel>
        </StyledSection>

        <StyledSection>
          <StyledSectionHeader>
            <StyledSectionTitleGroup>
              <Text variant="h2" accessibilityRole="header">
                Live KPI Snapshot
              </Text>
              <Text variant="caption">Updated continuously using real system records.</Text>
            </StyledSectionTitleGroup>
            <StyledSectionMeta>
              <Text variant="caption">
                {t('home.lastUpdated', { time: timeFormatter.format(lastUpdated) })}
              </Text>
            </StyledSectionMeta>
          </StyledSectionHeader>

          <StyledSectionBody>
            <StyledSummaryGrid>
              {summaryCards.map((item) => (
                <Card key={item.id}>
                  <StyledStatCardContent>
                    <Text variant="label">{item.label}</Text>
                    <StyledStatValueRow>
                      <Text variant="h2">{formatMetricValue(item)}</Text>
                    </StyledStatValueRow>
                  </StyledStatCardContent>
                </Card>
              ))}
            </StyledSummaryGrid>
          </StyledSectionBody>
        </StyledSection>

        <StyledSection>
          <StyledSectionHeader>
            <StyledSectionTitleGroup>
              <Text variant="h2" accessibilityRole="header">
                Visual Analytics
              </Text>
              <Text variant="caption">Trend graph and status distribution for quick operational reading.</Text>
            </StyledSectionTitleGroup>
          </StyledSectionHeader>

          <StyledSectionBody>
            <StyledAnalyticsGrid>
              <Card
                header={
                  <StyledCardHeaderContent>
                    <Text variant="h3">{liveDashboard?.trend?.title || '7-day trend'}</Text>
                    <Text variant="caption">
                      {liveDashboard?.trend?.subtitle || 'Activity trend for the current role.'}
                    </Text>
                  </StyledCardHeaderContent>
                }
              >
                {trendPoints.length > 0 ? (
                  <StyledTrendChart>
                    {trendPoints.map((point) => {
                      const height = Math.round((Number(point.value || 0) / trendMax) * 100);
                      return (
                        <StyledTrendColumn key={point.id}>
                          <StyledTrendBarTrack>
                            <StyledTrendBarFill $height={height} />
                          </StyledTrendBarTrack>
                          <StyledTrendMeta>
                            <Text variant="caption">{dayFormatter.format(new Date(point.date))}</Text>
                            <Text variant="caption">{numberFormatter.format(point.value || 0)}</Text>
                          </StyledTrendMeta>
                        </StyledTrendColumn>
                      );
                    })}
                  </StyledTrendChart>
                ) : (
                  <Text variant="caption">No trend data available yet.</Text>
                )}
              </Card>

              <Card
                header={
                  <StyledCardHeaderContent>
                    <Text variant="h3">{distribution.title || 'Status distribution'}</Text>
                    <Text variant="caption">
                      {distribution.subtitle || 'Current status mix across active records.'}
                    </Text>
                  </StyledCardHeaderContent>
                }
              >
                {distribution.segments.length > 0 ? (
                  <StyledDonutLayout>
                    <StyledDonut $gradient={donutGradient} aria-label="Status distribution pie chart">
                      <StyledDonutCenter>
                        <Text variant="caption">{numberFormatter.format(distributionTotal)}</Text>
                      </StyledDonutCenter>
                    </StyledDonut>

                    <StyledLegendList>
                      {distribution.segments.map((segment) => (
                        <StyledLegendItem key={segment.id}>
                          <StyledLegendLabel>
                            <StyledLegendSwatch $color={segment.color} />
                            <Text variant="caption">{segment.label}</Text>
                          </StyledLegendLabel>
                          <Text variant="caption">
                            {numberFormatter.format(segment.value)} ({formatDistributionValue(segment.value, distributionTotal)})
                          </Text>
                        </StyledLegendItem>
                      ))}
                    </StyledLegendList>
                  </StyledDonutLayout>
                ) : (
                  <Text variant="caption">No distribution data available yet.</Text>
                )}
              </Card>
            </StyledAnalyticsGrid>
          </StyledSectionBody>
        </StyledSection>

        {highlightItems.length > 0 && (
          <StyledSection>
            <StyledSectionHeader>
              <StyledSectionTitleGroup>
                <Text variant="h2" accessibilityRole="header">
                  Role Performance Highlights
                </Text>
                <Text variant="caption">Metrics prioritized for your active role.</Text>
              </StyledSectionTitleGroup>
            </StyledSectionHeader>

            <StyledSectionBody>
              <StyledHighlightGrid>
                {highlightItems.map((item) => (
                  <StyledHighlightCard key={item.id}>
                    <Text variant="label">{item.label}</Text>
                    <Text variant="h2">{item.value}</Text>
                    <Text variant="caption">{item.context}</Text>
                  </StyledHighlightCard>
                ))}
              </StyledHighlightGrid>
            </StyledSectionBody>
          </StyledSection>
        )}

        <StyledSection>
          <StyledSectionHeader>
            <StyledSectionTitleGroup>
              <Text variant="h2" accessibilityRole="header">
                Operations Queue
              </Text>
              <Text variant="caption">Current workload and items requiring immediate attention.</Text>
            </StyledSectionTitleGroup>
          </StyledSectionHeader>

          <StyledSectionBody>
            <StyledSectionGrid>
              <Card
                header={
                  <StyledCardHeaderContent>
                    <Text variant="h3">Work queue</Text>
                    <Text variant="caption">Tasks currently in motion.</Text>
                  </StyledCardHeaderContent>
                }
              >
                <StyledList>
                  {queueItems.map((item) => (
                    <StyledListItem key={item.id}>
                      <StyledListItemContent>
                        <Text variant="body">{resolveText(item, 'title', 'titleKey', t)}</Text>
                        <StyledListItemMeta>
                          <Text variant="caption">{resolveText(item, 'meta', 'metaKey', t)}</Text>
                        </StyledListItemMeta>
                      </StyledListItemContent>
                      <Badge variant={item.statusVariant || 'primary'}>
                        {item.statusLabel || resolveText(item, 'statusLabel', 'statusKey', t)}
                      </Badge>
                    </StyledListItem>
                  ))}
                </StyledList>
              </Card>

              <Card
                header={
                  <StyledCardHeaderContent>
                    <Text variant="h3">Attention alerts</Text>
                    <Text variant="caption">Potential risks and escalation points.</Text>
                  </StyledCardHeaderContent>
                }
              >
                <StyledList>
                  {alertItems.map((item) => (
                    <StyledListItem key={item.id}>
                      <StyledListItemContent>
                        <Text variant="body">{resolveText(item, 'title', 'titleKey', t)}</Text>
                        <StyledListItemMeta>
                          <Text variant="caption">{resolveText(item, 'meta', 'metaKey', t)}</Text>
                        </StyledListItemMeta>
                      </StyledListItemContent>
                      <Badge variant={item.severityVariant || 'warning'}>
                        {item.severityLabel || resolveText(item, 'severityLabel', 'severityKey', t)}
                      </Badge>
                    </StyledListItem>
                  ))}
                </StyledList>
              </Card>
            </StyledSectionGrid>
          </StyledSectionBody>
        </StyledSection>

        <StyledSection>
          <StyledSectionHeader>
            <StyledSectionTitleGroup>
              <Text variant="h2" accessibilityRole="header">
                Actions And Activity
              </Text>
              <Text variant="caption">Take action quickly and monitor recent events.</Text>
            </StyledSectionTitleGroup>
          </StyledSectionHeader>

          <StyledSectionBody>
            <StyledSectionGrid>
              <Card
                header={
                  <StyledCardHeaderContent>
                    <Text variant="h3">Quick actions</Text>
                    <Text variant="caption">Role-aware shortcuts to common workflows.</Text>
                  </StyledCardHeaderContent>
                }
              >
                <StyledQuickActions>
                  {quickActions.map((item) => (
                    <Button
                      key={item.id}
                      variant={item.isEnabled ? 'outline' : 'surface'}
                      size="small"
                      onPress={() => onQuickAction(item)}
                      disabled={!item.isEnabled}
                      aria-disabled={!item.isEnabled ? 'true' : undefined}
                      accessibilityHint={!item.isEnabled && item.blockedReasonKey ? t(item.blockedReasonKey) : undefined}
                    >
                      {t(item.labelKey)}
                    </Button>
                  ))}
                </StyledQuickActions>
              </Card>

              <Card
                header={
                  <StyledCardHeaderContent>
                    <Text variant="h3">Recent live activity</Text>
                    <Text variant="caption">Most recent updates from operational data streams.</Text>
                  </StyledCardHeaderContent>
                }
              >
                <StyledList>
                  {activityItems.map((item) => (
                    <StyledListItem key={item.id}>
                      <StyledListItemContent>
                        <Text variant="body">{item.title || resolveText(item, 'title', 'titleKey', t)}</Text>
                        <StyledListItemMeta>
                          <Text variant="caption">{item.meta || resolveText(item, 'meta', 'metaKey', t)}</Text>
                        </StyledListItemMeta>
                      </StyledListItemContent>
                      <StyledActivityMeta>
                        <Text variant="caption">
                          {item.timeLabel || (item.timeKey ? t(item.timeKey) : timeFormatter.format(lastUpdated))}
                        </Text>
                      </StyledActivityMeta>
                    </StyledListItem>
                  ))}
                </StyledList>
              </Card>
            </StyledSectionGrid>
          </StyledSectionBody>
        </StyledSection>
      </StyledContent>
    </StyledHomeContainer>
  );
};

export default DashboardScreenWeb;
