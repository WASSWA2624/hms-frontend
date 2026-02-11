/**
 * DashboardScreen Component - iOS
 * Authenticated dashboard screen for iOS platform
 * File: DashboardScreen.ios.jsx
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
  StyledScrollView,
  StyledHomeContainer,
  StyledContent,
  StyledSection,
  StyledSectionHeader,
  StyledSectionTitleGroup,
  StyledSectionMeta,
  StyledSectionBody,
  StyledStatCardContent,
  StyledStatValueRow,
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
  StyledChecklist,
  StyledChecklistItemContent,
  StyledChecklistFooter,
  StyledValueGrid,
  StyledModuleGrid,
  StyledPlanRow,
  StyledPlanActions,
  StyledActivityMeta,
  StyledHelpGrid,
  StyledStateWrapper,
  StyledLoadingGrid,
  StyledLoadingBlock,
} from './DashboardScreen.ios.styles';

// 5. Component-specific hook (relative import)
import useDashboardScreen from './useDashboardScreen';

// 6. Types and constants (relative import)
import { STATES } from './types';

const getDeltaConfig = (delta) => {
  if (delta > 0) return { variant: 'success', key: 'home.valueProof.deltaUp' };
  if (delta < 0) return { variant: 'warning', key: 'home.valueProof.deltaDown' };
  return { variant: 'primary', key: 'home.valueProof.deltaNeutral' };
};

/**
 * DashboardScreen component for iOS
 * @param {Object} props - DashboardScreen props
 */
const DashboardScreenIOS = () => {
  const { t, locale } = useI18n();
  const {
    state,
    isOffline,
    facilityContext,
    smartStatusStrip,
    onboardingChecklist,
    quickActions,
    workQueue,
    attentionAlerts,
    valueProofs,
    insights,
    moduleDiscovery,
    usagePlan,
    activityFeed,
    helpResources,
    lastUpdated,
    onRetry,
  } = useDashboardScreen();

  const numberFormatter = useMemo(() => new Intl.NumberFormat(locale), [locale]);
  const currencyFormatter = useMemo(
    () => new Intl.NumberFormat(locale, { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }),
    [locale]
  );
  const timeFormatter = useMemo(
    () => new Intl.DateTimeFormat(locale, { hour: '2-digit', minute: '2-digit' }),
    [locale]
  );
  const formatNumber = (value) => numberFormatter.format(value);
  const formatTime = (value) => timeFormatter.format(value);
  const formatStatusValue = (item) =>
    item.format === 'currency' ? currencyFormatter.format(item.value) : formatNumber(item.value);
  const formatProofValue = (item) => {
    if (item.format === 'currency') return currencyFormatter.format(item.value);
    if (item.format === 'percent') return `${formatNumber(item.value)}%`;
    if (item.format === 'minutes') return t('home.valueProof.minutes', { value: formatNumber(item.value) });
    return formatNumber(item.value);
  };

  const isEmpty =
    smartStatusStrip.length === 0 &&
    onboardingChecklist.length === 0 &&
    quickActions.length === 0 &&
    workQueue.length === 0 &&
    attentionAlerts.length === 0 &&
    valueProofs.length === 0 &&
    insights.length === 0 &&
    moduleDiscovery.length === 0 &&
    activityFeed.length === 0 &&
    helpResources.length === 0;

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

  if (state === STATES.EMPTY || isEmpty) {
    return (
      <StyledScrollView accessibilityLabel={t('home.title')} testID="dashboard-screen">
        <StyledHomeContainer>
          <StyledContent>{renderEmptyState()}</StyledContent>
        </StyledHomeContainer>
      </StyledScrollView>
    );
  }

  const completedSteps = onboardingChecklist.filter((item) => item.completed).length;
  const totalSteps = onboardingChecklist.length;
  const checklistProgress = totalSteps > 0 ? Math.round((completedSteps / totalSteps) * 100) : 0;
  const nextStep = onboardingChecklist.find((item) => !item.completed);

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
                  <Text variant="caption">
                    {t('home.welcome.facilityMeta', {
                      facility: facilityContext.facilityName,
                      branch: facilityContext.branchName,
                    })}
                  </Text>
                  <StyledBadgeRow>
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
                  {t('home.statusStrip.title')}
                </Text>
                <Text variant="caption">{t('home.statusStrip.subtitle')}</Text>
              </StyledSectionTitleGroup>
              <StyledSectionMeta>
                <Text variant="caption">{t('home.lastUpdated', { time: formatTime(lastUpdated) })}</Text>
              </StyledSectionMeta>
            </StyledSectionHeader>
            <StyledSectionBody>
              <StyledStatusStrip>
                {smartStatusStrip.map((item) => (
                  <Card key={item.id}>
                    <StyledStatCardContent>
                      <Text variant="label">{t(item.labelKey)}</Text>
                      <Text variant="h2">{formatStatusValue(item)}</Text>
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
                  {t('home.startHere.title')}
                </Text>
                <Text variant="caption">{t('home.startHere.subtitle')}</Text>
              </StyledSectionTitleGroup>
            </StyledSectionHeader>
            <StyledSectionBody>
              <Card
                header={
                  <StyledCardHeaderContent>
                    <Text variant="h3">{t('home.startHere.progressTitle')}</Text>
                    <Text variant="caption">{t('home.startHere.progressSubtitle')}</Text>
                  </StyledCardHeaderContent>
                }
              >
                <StyledChecklist>
                  {onboardingChecklist.map((item) => (
                    <StyledListItem key={item.id}>
                      <StyledChecklistItemContent>
                        <Text variant="body">{t(item.titleKey)}</Text>
                        <StyledListItemMeta>
                          <Text variant="caption">{t(item.metaKey)}</Text>
                        </StyledListItemMeta>
                      </StyledChecklistItemContent>
                      <Badge variant={item.completed ? 'success' : 'warning'}>
                        {t(item.completed ? 'home.startHere.status.done' : 'home.startHere.status.pending')}
                      </Badge>
                    </StyledListItem>
                  ))}
                </StyledChecklist>
                <StyledChecklistFooter>
                  <Text variant="caption">
                    {t('home.startHere.progressLabel', { value: checklistProgress })}
                  </Text>
                  <ProgressBar
                    value={checklistProgress}
                    variant={checklistProgress >= 80 ? 'success' : 'primary'}
                    accessibilityLabel={t('home.startHere.progressLabel', { value: checklistProgress })}
                  />
                  <Text variant="caption">
                    {nextStep
                      ? t('home.startHere.nextBest', { step: t(nextStep.titleKey) })
                      : t('home.startHere.complete')}
                  </Text>
                  <Button variant="primary" size="small">
                    {t('home.startHere.cta')}
                  </Button>
                </StyledChecklistFooter>
              </Card>
            </StyledSectionBody>
          </StyledSection>

          <StyledSection>
            <StyledSectionHeader>
              <StyledSectionTitleGroup>
                <Text variant="h2" accessibilityRole="header">
                  {t('home.quickActions.title')}
                </Text>
                <Text variant="caption">{t('home.quickActions.subtitle')}</Text>
              </StyledSectionTitleGroup>
            </StyledSectionHeader>
            <StyledSectionBody>
              <StyledQuickActions>
                {quickActions.map((item) => (
                  <Button key={item.id} variant="outline" size="small">
                    {t(item.labelKey)}
                  </Button>
                ))}
              </StyledQuickActions>
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
                      <Text variant="h3">{t('home.workQueue.title')}</Text>
                      <Text variant="caption">{t('home.workQueue.subtitle')}</Text>
                    </StyledCardHeaderContent>
                  }
                >
                  <StyledList>
                    {workQueue.map((item) => (
                      <StyledListItem key={item.id}>
                        <StyledListItemContent>
                          <Text variant="body">{t(item.titleKey)}</Text>
                          <StyledListItemMeta>
                            <Text variant="caption">{t(item.metaKey)}</Text>
                          </StyledListItemMeta>
                        </StyledListItemContent>
                        <Badge variant={item.statusVariant}>{t(item.statusKey)}</Badge>
                      </StyledListItem>
                    ))}
                  </StyledList>
                </Card>

                <Card
                  header={
                    <StyledCardHeaderContent>
                      <Text variant="h3">{t('home.attention.title')}</Text>
                      <Text variant="caption">{t('home.attention.subtitle')}</Text>
                    </StyledCardHeaderContent>
                  }
                >
                  <StyledList>
                    {attentionAlerts.map((item) => (
                      <StyledListItem key={item.id}>
                        <StyledListItemContent>
                          <Text variant="body">{t(item.titleKey)}</Text>
                          <StyledListItemMeta>
                            <Text variant="caption">{t(item.metaKey)}</Text>
                          </StyledListItemMeta>
                        </StyledListItemContent>
                        <Badge variant={item.severityVariant}>{t(item.severityKey)}</Badge>
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
                  {t('home.valueProof.title')}
                </Text>
                <Text variant="caption">{t('home.valueProof.subtitle')}</Text>
              </StyledSectionTitleGroup>
            </StyledSectionHeader>
            <StyledSectionBody>
              <StyledValueGrid>
                {valueProofs.map((item) => {
                  const deltaConfig = item.delta != null ? getDeltaConfig(item.delta) : null;
                  return (
                    <Card key={item.id}>
                      <StyledStatCardContent>
                        <Text variant="label">{t(item.labelKey)}</Text>
                        <StyledStatValueRow>
                          <Text variant="h2">{formatProofValue(item)}</Text>
                          {deltaConfig ? (
                            <Badge variant={deltaConfig.variant}>
                              {t(deltaConfig.key, { value: Math.abs(item.delta) })}
                            </Badge>
                          ) : null}
                        </StyledStatValueRow>
                        <Text variant="caption">{t(item.comparisonKey)}</Text>
                      </StyledStatCardContent>
                    </Card>
                  );
                })}
              </StyledValueGrid>
            </StyledSectionBody>
          </StyledSection>

          <StyledSection>
            <StyledSectionHeader>
              <StyledSectionTitleGroup>
                <Text variant="h2" accessibilityRole="header">
                  {t('home.insights.title')}
                </Text>
                <Text variant="caption">{t('home.insights.subtitle')}</Text>
              </StyledSectionTitleGroup>
            </StyledSectionHeader>
            <StyledSectionBody>
              <Card>
                <StyledList>
                  {insights.map((item) => (
                    <StyledListItem key={item.id}>
                      <StyledListItemContent>
                        <Text variant="body">{t(item.titleKey)}</Text>
                        <StyledListItemMeta>
                          <Text variant="caption">{t(item.metaKey)}</Text>
                        </StyledListItemMeta>
                      </StyledListItemContent>
                      <Badge variant={item.variant}>{t('home.insights.badge')}</Badge>
                    </StyledListItem>
                  ))}
                </StyledList>
              </Card>
            </StyledSectionBody>
          </StyledSection>

          <StyledSection>
            <StyledSectionHeader>
              <StyledSectionTitleGroup>
                <Text variant="h2" accessibilityRole="header">
                  {t('home.modules.title')}
                </Text>
                <Text variant="caption">{t('home.modules.subtitle')}</Text>
              </StyledSectionTitleGroup>
            </StyledSectionHeader>
            <StyledSectionBody>
              <StyledModuleGrid>
                {moduleDiscovery.map((module) => (
                  <Card
                    key={module.id}
                    header={
                      <StyledCardHeaderContent>
                        <Text variant="h3">{t(module.titleKey)}</Text>
                        <Text variant="caption">{t(module.whoKey)}</Text>
                      </StyledCardHeaderContent>
                    }
                    footer={
                      <Button variant="secondary" size="small">
                        {t(module.ctaKey)}
                      </Button>
                    }
                  >
                    <Text variant="body">{t(module.benefitKey)}</Text>
                  </Card>
                ))}
              </StyledModuleGrid>
            </StyledSectionBody>
          </StyledSection>

          <StyledSection>
            <StyledSectionHeader>
              <StyledSectionTitleGroup>
                <Text variant="h2" accessibilityRole="header">
                  {t(usagePlan.titleKey)}
                </Text>
                <Text variant="caption">{t(usagePlan.subtitleKey)}</Text>
              </StyledSectionTitleGroup>
            </StyledSectionHeader>
            <StyledSectionBody>
              <Card>
                <StyledPlanRow>
                  <Text variant="body">{t(usagePlan.statusKey)}</Text>
                  <Badge variant="warning">{t(usagePlan.detailKey, { count: usagePlan.detailValue })}</Badge>
                </StyledPlanRow>
                <StyledPlanRow>
                  <Text variant="body">{t(usagePlan.usageKey, { count: usagePlan.usageValue })}</Text>
                  <Text variant="caption">{t(usagePlan.limitKey)}</Text>
                </StyledPlanRow>
                <StyledPlanActions>
                  <Button variant="primary" size="small">
                    {t(usagePlan.upgradeCtaKey)}
                  </Button>
                  <Button variant="text" size="small">
                    {t(usagePlan.compareCtaKey)}
                  </Button>
                </StyledPlanActions>
              </Card>
            </StyledSectionBody>
          </StyledSection>

          <StyledSection>
            <StyledSectionHeader>
              <StyledSectionTitleGroup>
                <Text variant="h2" accessibilityRole="header">
                  {t('home.activity.title')}
                </Text>
                <Text variant="caption">{t('home.activity.subtitle')}</Text>
              </StyledSectionTitleGroup>
            </StyledSectionHeader>
            <StyledSectionBody>
              <Card>
                <StyledList>
                  {activityFeed.map((item) => (
                    <StyledListItem key={item.id}>
                      <StyledListItemContent>
                        <Text variant="body">{t(item.titleKey)}</Text>
                        <StyledListItemMeta>
                          <Text variant="caption">{t(item.metaKey)}</Text>
                        </StyledListItemMeta>
                      </StyledListItemContent>
                      <StyledActivityMeta>
                        <Text variant="caption">{t(item.timeKey)}</Text>
                      </StyledActivityMeta>
                    </StyledListItem>
                  ))}
                </StyledList>
              </Card>
            </StyledSectionBody>
          </StyledSection>

          <StyledSection>
            <StyledSectionHeader>
              <StyledSectionTitleGroup>
                <Text variant="h2" accessibilityRole="header">
                  {t('home.help.title')}
                </Text>
                <Text variant="caption">{t('home.help.subtitle')}</Text>
              </StyledSectionTitleGroup>
            </StyledSectionHeader>
            <StyledSectionBody>
              <StyledHelpGrid>
                {helpResources.map((item) => (
                  <Card
                    key={item.id}
                    header={
                      <StyledCardHeaderContent>
                        <Text variant="h3">{t(item.titleKey)}</Text>
                        <Text variant="caption">{t(item.metaKey)}</Text>
                      </StyledCardHeaderContent>
                    }
                    footer={
                      <Button variant="text" size="small">
                        {t(item.ctaKey)}
                      </Button>
                    }
                  />
                ))}
              </StyledHelpGrid>
            </StyledSectionBody>
          </StyledSection>
        </StyledContent>
      </StyledHomeContainer>
    </StyledScrollView>
  );
};

export default DashboardScreenIOS;
