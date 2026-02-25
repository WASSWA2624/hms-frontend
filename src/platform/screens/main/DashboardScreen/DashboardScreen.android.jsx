/**
 * DashboardScreen Component - Android
 * Authenticated dashboard screen for Android platform
 * File: DashboardScreen.android.jsx
 */
import React, { useMemo } from 'react';
import {
  Badge,
  Button,
  Card,
  EmptyState,
  ErrorState,
  OfflineState,
  Select,
  Skeleton,
  Text,
} from '@platform/components';
import { useI18n } from '@hooks';
import {
  StyledScrollView,
  StyledHomeContainer,
  StyledContent,
  StyledSection,
  StyledSectionHeader,
  StyledSectionTitleGroup,
  StyledSectionMeta,
  StyledSectionBody,
  StyledStatCardContent,
  StyledSectionGrid,
  StyledCardHeaderContent,
  StyledList,
  StyledListItem,
  StyledListItemContent,
  StyledListItemMeta,
  StyledWelcomeSection,
  StyledWelcomeMessage,
  StyledWelcomeMeta,
  StyledHeroPanel,
  StyledBadgeRow,
  StyledStatusStrip,
  StyledQuickActions,
  StyledActivityMeta,
  StyledCardWrapper,
  StyledStateWrapper,
  StyledLoadingGrid,
  StyledLoadingBlock,
} from './DashboardScreen.android.styles';
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

const DEFAULT_INTL_LOCALE = 'en-US';

const normalizeIntlLocale = (value) => {
  const normalized = typeof value === 'string' ? value.trim().replace(/_/g, '-') : '';
  if (!normalized) return undefined;
  try {
    const supported = Intl.NumberFormat.supportedLocalesOf([normalized]);
    return supported[0] || undefined;
  } catch {
    return undefined;
  }
};

const createSafeNumberFormatter = (locale, options = undefined) => {
  try {
    return new Intl.NumberFormat(locale, options);
  } catch {
    return new Intl.NumberFormat(DEFAULT_INTL_LOCALE, options);
  }
};

const createSafeDateFormatter = (locale, options = undefined) => {
  try {
    return new Intl.DateTimeFormat(locale, options);
  } catch {
    return new Intl.DateTimeFormat(DEFAULT_INTL_LOCALE, options);
  }
};

const formatDayLabel = (formatter, value) => {
  const parsed = value ? new Date(value) : null;
  if (!parsed || Number.isNaN(parsed.getTime())) return '--';
  return formatter.format(parsed);
};

const DashboardScreenAndroid = () => {
  const { t, locale } = useI18n();
  const {
    state,
    isOffline,
    facilityContext,
    dashboardRole,
    liveDashboard,
    quickActions,
    tenantContext,
    lastUpdated,
    onRetry,
    onQuickAction,
  } = useDashboardScreen();

  const summaryCards = liveDashboard?.summaryCards || [];
  const trendPoints = liveDashboard?.trend?.points || [];
  const distribution = liveDashboard?.distribution || { total: 0, segments: [] };
  const highlightItems = liveDashboard?.highlights || [];
  const queueItems = liveDashboard?.queue || [];
  const alertItems = liveDashboard?.alerts || [];
  const activityItems = liveDashboard?.activity || [];
  const intlLocale = useMemo(() => normalizeIntlLocale(locale), [locale]);

  const numberFormatter = useMemo(() => createSafeNumberFormatter(intlLocale), [intlLocale]);
  const currencyFormatter = useMemo(
    () => createSafeNumberFormatter(intlLocale, { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }),
    [intlLocale]
  );
  const timeFormatter = useMemo(
    () => createSafeDateFormatter(intlLocale, { hour: '2-digit', minute: '2-digit' }),
    [intlLocale]
  );
  const dayFormatter = useMemo(
    () => createSafeDateFormatter(intlLocale, { weekday: 'short' }),
    [intlLocale]
  );

  const formatMetricValue = (item) => {
    if (!item) return '0';
    if (item.format === 'currency') return currencyFormatter.format(item.value || 0);
    if (item.format === 'percent') return `${numberFormatter.format(item.value || 0)}%`;
    if (item.format === 'minutes') return `${numberFormatter.format(item.value || 0)} min`;
    return numberFormatter.format(item.value || 0);
  };

  const distributionTotal = distribution.total
    || distribution.segments.reduce((sum, item) => sum + Number(item.value || 0), 0);

  const isEmpty = (
    summaryCards.length === 0
    && queueItems.length === 0
    && alertItems.length === 0
    && activityItems.length === 0
    && quickActions.length === 0
  );

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
        action={(
          <Button
            onPress={onRetry}
            accessibilityLabel={t('home.states.retryLabel')}
            accessibilityHint={t('home.states.retryHint')}
          >
            {t('common.retry')}
          </Button>
        )}
        testID="dashboard-error-state"
      />
    </StyledStateWrapper>
  );

  const renderTenantContextState = () => (
    <StyledStateWrapper>
      <Card
        header={(
          <StyledCardHeaderContent>
            <Text variant="h3">Tenant context required</Text>
            <Text variant="caption">
              Select a tenant to load role-isolated dashboard data.
            </Text>
          </StyledCardHeaderContent>
        )}
      >
        <StyledSectionBody>
          <Text variant="body">
            This account needs an active tenant context before dashboard data can be shown.
          </Text>
          <Select
            label="Tenant"
            placeholder={tenantContext?.isLoading ? 'Loading tenants...' : 'Select tenant'}
            options={tenantContext?.options || []}
            value={tenantContext?.selectedTenantId || ''}
            onValueChange={tenantContext?.onSelectTenant}
            disabled={tenantContext?.isLoading}
            testID="dashboard-tenant-picker"
          />
        </StyledSectionBody>
      </Card>
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
      <StyledScrollView accessibilityLabel={t('home.title')} testID="dashboard-screen">
        <StyledHomeContainer>
          <StyledContent>{renderLoadingState()}</StyledContent>
        </StyledHomeContainer>
      </StyledScrollView>
    );
  }

  if (state === STATES.ERROR) {
    return (
      <StyledScrollView accessibilityLabel={t('home.title')} testID="dashboard-screen">
        <StyledHomeContainer>
          <StyledContent>{renderErrorState()}</StyledContent>
        </StyledHomeContainer>
      </StyledScrollView>
    );
  }

  if (state === STATES.NEEDS_TENANT_CONTEXT) {
    return (
      <StyledScrollView accessibilityLabel={t('home.title')} testID="dashboard-screen">
        <StyledHomeContainer>
          <StyledContent>{renderTenantContextState()}</StyledContent>
        </StyledHomeContainer>
      </StyledScrollView>
    );
  }

  if (state === STATES.EMPTY || isEmpty) {
    return (
      <StyledScrollView accessibilityLabel={t('home.title')} testID="dashboard-screen">
        <StyledHomeContainer>
          <StyledContent>{renderEmptyState()}</StyledContent>
        </StyledHomeContainer>
      </StyledScrollView>
    );
  }

  return (
    <StyledScrollView accessibilityLabel={t('home.title')} testID="dashboard-screen">
      <StyledHomeContainer>
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
              <StyledStatusStrip>
                {summaryCards.map((item) => (
                  <Card key={item.id}>
                    <StyledStatCardContent>
                      <Text variant="label">{item.label}</Text>
                      <Text variant="h2">{formatMetricValue(item)}</Text>
                    </StyledStatCardContent>
                  </Card>
                ))}
              </StyledStatusStrip>
            </StyledSectionBody>
          </StyledSection>

          <StyledSection>
            <StyledSectionHeader>
              <StyledSectionTitleGroup>
                <Text variant="h2" accessibilityRole="header">
                  Visual Analytics
                </Text>
                <Text variant="caption">Trend and status distribution for quick operational reading.</Text>
              </StyledSectionTitleGroup>
            </StyledSectionHeader>
            <StyledSectionBody>
              <StyledSectionGrid>
                <Card
                  header={(
                    <StyledCardHeaderContent>
                      <Text variant="h3">{liveDashboard?.trend?.title || '7-day trend'}</Text>
                      <Text variant="caption">
                        {liveDashboard?.trend?.subtitle || 'Activity trend for the current role.'}
                      </Text>
                    </StyledCardHeaderContent>
                  )}
                >
                  {trendPoints.length > 0 ? (
                    <StyledList>
                      {trendPoints.map((point) => (
                        <StyledListItem key={point.id}>
                          <StyledListItemContent>
                            <Text variant="body">{formatDayLabel(dayFormatter, point.date)}</Text>
                          </StyledListItemContent>
                          <Badge variant="primary">{numberFormatter.format(point.value || 0)}</Badge>
                        </StyledListItem>
                      ))}
                    </StyledList>
                  ) : (
                    <Text variant="caption">No trend data available yet.</Text>
                  )}
                </Card>

                <Card
                  header={(
                    <StyledCardHeaderContent>
                      <Text variant="h3">{distribution.title || 'Status distribution'}</Text>
                      <Text variant="caption">
                        {distribution.subtitle || 'Current status mix across active records.'}
                      </Text>
                    </StyledCardHeaderContent>
                  )}
                >
                  {distribution.segments.length > 0 ? (
                    <StyledList>
                      {distribution.segments.map((segment) => (
                        <StyledListItem key={segment.id}>
                          <StyledListItemContent>
                            <Text variant="body">{segment.label}</Text>
                          </StyledListItemContent>
                          <Badge variant="primary">
                            {numberFormatter.format(segment.value)} ({formatDistributionValue(segment.value, distributionTotal)})
                          </Badge>
                        </StyledListItem>
                      ))}
                    </StyledList>
                  ) : (
                    <Text variant="caption">No distribution data available yet.</Text>
                  )}
                </Card>
              </StyledSectionGrid>
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
                <StyledStatusStrip>
                  {highlightItems.map((item) => (
                    <Card key={item.id}>
                      <StyledStatCardContent>
                        <Text variant="label">{item.label}</Text>
                        <Text variant="h2">{item.value}</Text>
                        <Text variant="caption">{item.context}</Text>
                      </StyledStatCardContent>
                    </Card>
                  ))}
                </StyledStatusStrip>
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
                  header={(
                    <StyledCardHeaderContent>
                      <Text variant="h3">Work queue</Text>
                      <Text variant="caption">Tasks currently in motion.</Text>
                    </StyledCardHeaderContent>
                  )}
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
                  header={(
                    <StyledCardHeaderContent>
                      <Text variant="h3">Attention alerts</Text>
                      <Text variant="caption">Potential risks and escalation points.</Text>
                    </StyledCardHeaderContent>
                  )}
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
                  header={(
                    <StyledCardHeaderContent>
                      <Text variant="h3">Quick actions</Text>
                      <Text variant="caption">Role-aware shortcuts to common workflows.</Text>
                    </StyledCardHeaderContent>
                  )}
                >
                  <StyledQuickActions>
                    {quickActions.map((item) => (
                      <Button
                        key={item.id}
                        variant={item.isEnabled ? 'outline' : 'surface'}
                        size="small"
                        onPress={() => onQuickAction(item)}
                        disabled={!item.isEnabled}
                        accessibilityHint={!item.isEnabled && item.blockedReasonKey ? t(item.blockedReasonKey) : undefined}
                      >
                        {t(item.labelKey)}
                      </Button>
                    ))}
                  </StyledQuickActions>
                </Card>

                <Card
                  header={(
                    <StyledCardHeaderContent>
                      <Text variant="h3">Recent live activity</Text>
                      <Text variant="caption">Most recent updates from operational data streams.</Text>
                    </StyledCardHeaderContent>
                  )}
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
    </StyledScrollView>
  );
};

export default DashboardScreenAndroid;
