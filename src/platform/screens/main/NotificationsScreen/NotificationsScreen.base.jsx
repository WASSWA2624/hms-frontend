/**
 * NotificationsScreen component (shared)
 * Dedicated notifications center for authenticated users.
 * File: NotificationsScreen.base.jsx
 */

import React from 'react';
import {
  Badge,
  Button,
  Card,
  EmptyState,
  ErrorState,
  Screen,
  Skeleton,
  Text,
} from '@platform/components';
import {
  StyledActionButtonWrap,
  StyledActionsRow,
  StyledCardBadgeWrap,
  StyledCardButtons,
  StyledCardContent,
  StyledCardFooter,
  StyledCardHeaderGroup,
  StyledCardHeaderRow,
  StyledCardMessage,
  StyledCardWrap,
  StyledHeader,
  StyledHeaderSubtitle,
  StyledHeaderTopRow,
  StyledList,
  StyledRefreshError,
  StyledScreenContainer,
  StyledSkeletonBlock,
  StyledStateContainer,
} from './NotificationsScreen.styles';
import useNotificationsScreen from './useNotificationsScreen';

const NotificationsScreenBase = () => {
  const {
    t,
    screenState,
    activeFilter,
    filteredItems,
    totalCount,
    unreadCount,
    isRefreshing,
    hasRefreshError,
    setActiveFilter,
    onOpenNotification,
    onToggleReadState,
    onRefresh,
    isItemBusy,
    FILTERS,
    SCREEN_STATES,
  } = useNotificationsScreen();

  const filterDefinitions = [
    { id: FILTERS.ALL, label: t('navigation.notifications.screen.filters.all') },
    { id: FILTERS.UNREAD, label: t('navigation.notifications.screen.filters.unread') },
    { id: FILTERS.READ, label: t('navigation.notifications.screen.filters.read') },
  ];

  const renderLoadingState = () => (
    <StyledStateContainer>
      <StyledSkeletonBlock>
        <Skeleton variant="text" lines={2} width="65%" />
      </StyledSkeletonBlock>
      <StyledSkeletonBlock>
        <Skeleton variant="rectangular" height={140} />
      </StyledSkeletonBlock>
      <StyledSkeletonBlock>
        <Skeleton variant="rectangular" height={140} />
      </StyledSkeletonBlock>
      <StyledSkeletonBlock>
        <Skeleton variant="rectangular" height={140} />
      </StyledSkeletonBlock>
    </StyledStateContainer>
  );

  const renderErrorState = () => (
    <StyledStateContainer>
      <ErrorState
        title={t('navigation.notifications.screen.states.errorTitle')}
        description={t('navigation.notifications.screen.states.errorDescription')}
        action={
          <Button onPress={onRefresh} accessibilityLabel={t('common.retryHint')}>
            {t('common.retry')}
          </Button>
        }
        testID="notifications-screen-error"
      />
    </StyledStateContainer>
  );

  const renderEmptyState = () => (
    <StyledStateContainer>
      <EmptyState
        title={t('navigation.notifications.screen.states.emptyTitle')}
        description={t('navigation.notifications.screen.states.emptyDescription')}
        testID="notifications-screen-empty"
      />
    </StyledStateContainer>
  );

  return (
    <Screen
      scroll
      onRefresh={onRefresh}
      refreshing={isRefreshing}
      accessibilityLabel={t('navigation.notifications.screen.title')}
      testID="notifications-screen"
    >
      <StyledScreenContainer>
        <StyledHeader>
          <StyledHeaderTopRow>
            <Text variant="h2" accessibilityRole="header">
              {t('navigation.notifications.screen.title')}
            </Text>
            <Button
              variant="outline"
              size="small"
              onPress={onRefresh}
              disabled={isRefreshing}
              accessibilityLabel={t('navigation.notifications.screen.refresh')}
              testID="notifications-screen-refresh"
            >
              {isRefreshing
                ? t('navigation.notifications.screen.refreshing')
                : t('navigation.notifications.screen.refresh')}
            </Button>
          </StyledHeaderTopRow>

          <StyledHeaderSubtitle>
            <Text variant="caption">
              {t('navigation.notifications.screen.summary', {
                total: totalCount,
                unread: unreadCount,
              })}
            </Text>
          </StyledHeaderSubtitle>

          {hasRefreshError ? (
            <StyledRefreshError>
              <Text variant="caption">
                {t('navigation.notifications.screen.refreshError')}
              </Text>
            </StyledRefreshError>
          ) : null}
        </StyledHeader>

        <StyledActionsRow>
          {filterDefinitions.map((filter) => (
            <StyledActionButtonWrap key={filter.id}>
              <Button
                size="small"
                variant={activeFilter === filter.id ? 'primary' : 'outline'}
                onPress={() => setActiveFilter(filter.id)}
                accessibilityLabel={filter.label}
                testID={`notifications-screen-filter-${filter.id}`}
              >
                {filter.label}
              </Button>
            </StyledActionButtonWrap>
          ))}
        </StyledActionsRow>

        {screenState === SCREEN_STATES.LOADING && totalCount === 0 ? renderLoadingState() : null}
        {screenState === SCREEN_STATES.ERROR && totalCount === 0 ? renderErrorState() : null}
        {screenState !== SCREEN_STATES.ERROR &&
        screenState !== SCREEN_STATES.LOADING &&
        filteredItems.length === 0
          ? renderEmptyState()
          : null}

        {filteredItems.length > 0 ? (
          <StyledList>
            {filteredItems.map((item) => {
              const isBusy = isItemBusy(item.id);
              const markReadLabel = item.requiresAttention
                ? item.unread
                  ? t('navigation.notifications.screen.markAttended')
                  : t('navigation.notifications.screen.markUnattended')
                : item.unread
                  ? t('navigation.notifications.screen.markRead')
                  : t('navigation.notifications.screen.markUnread');
              return (
                <StyledCardWrap key={item.id}>
                  <Card>
                    <StyledCardHeaderRow>
                      <StyledCardHeaderGroup>
                        <StyledCardBadgeWrap>
                          <Badge variant={item.typeVariant}>{item.typeLabel}</Badge>
                        </StyledCardBadgeWrap>
                        <StyledCardBadgeWrap>
                          <Badge variant={item.unread ? 'warning' : 'success'}>
                            {item.unread
                              ? t('navigation.notifications.screen.badges.unread')
                              : t('navigation.notifications.screen.badges.read')}
                          </Badge>
                        </StyledCardBadgeWrap>
                        {item.requiresAttention && item.unread ? (
                          <StyledCardBadgeWrap>
                            <Badge variant="error">
                              {t('navigation.notifications.screen.badges.attentionRequired')}
                            </Badge>
                          </StyledCardBadgeWrap>
                        ) : null}
                      </StyledCardHeaderGroup>
                    </StyledCardHeaderRow>

                    <StyledCardContent>
                      <Text variant="label">{item.title}</Text>
                      <StyledCardMessage>
                        <Text variant="body">{item.message || item.meta}</Text>
                      </StyledCardMessage>
                    </StyledCardContent>

                    <StyledCardFooter>
                      <Text variant="caption">{item.timestampLabel}</Text>
                      <StyledCardButtons>
                        <StyledActionButtonWrap>
                          <Button
                            size="small"
                            variant="outline"
                            onPress={() => onOpenNotification(item)}
                            disabled={isBusy}
                            accessibilityLabel={t('navigation.notifications.screen.openAction')}
                            testID={`notifications-screen-open-${item.id}`}
                          >
                            {t('navigation.notifications.screen.openAction')}
                          </Button>
                        </StyledActionButtonWrap>
                        <StyledActionButtonWrap>
                          <Button
                            size="small"
                            variant="text"
                            onPress={() => onToggleReadState(item)}
                            disabled={isBusy}
                            accessibilityLabel={markReadLabel}
                            testID={`notifications-screen-toggle-read-${item.id}`}
                          >
                            {markReadLabel}
                          </Button>
                        </StyledActionButtonWrap>
                      </StyledCardButtons>
                    </StyledCardFooter>
                  </Card>
                </StyledCardWrap>
              );
            })}
          </StyledList>
        ) : null}
      </StyledScreenContainer>
    </Screen>
  );
};

export default NotificationsScreenBase;
