/**
 * UserSessionListScreen - Android
 * File: UserSessionListScreen.android.jsx
 */
import React from 'react';
import { FlatList, View } from 'react-native';
import {
  Button,
  Card,
  EmptyState,
  ErrorState,
  ErrorStateSizes,
  ListItem,
  LoadingSpinner,
  OfflineState,
  OfflineStateSizes,
  Snackbar,
  Text,
} from '@platform/components';
import { useI18n } from '@hooks';
import {
  StyledContainer,
  StyledContent,
  StyledList,
  StyledListBody,
  StyledStateStack,
} from './UserSessionListScreen.android.styles';
import useUserSessionListScreen from './useUserSessionListScreen';

const UserSessionListScreenAndroid = () => {
  const { t, locale } = useI18n();
  const {
    items,
    isLoading,
    hasError,
    errorMessage,
    isOffline,
    noticeMessage,
    onDismissNotice,
    onRetry,
    onSessionPress,
    onRevoke,
  } = useUserSessionListScreen();

  const emptyComponent = (
    <EmptyState
      title={t('userSession.list.emptyTitle')}
      description={t('userSession.list.emptyMessage')}
      testID="user-session-list-empty-state"
    />
  );

  const ItemSeparator = () => <View style={{ height: 8 }} />;

  const renderItem = ({ item: session }) => {
    const title = session?.user?.email ?? session?.id ?? '';
    const subtitle = session?.created_at
      ? new Date(session.created_at).toLocaleString(locale)
      : '';
    return (
      <ListItem
        title={title}
        subtitle={subtitle}
        onPress={() => onSessionPress(session.id)}
        actions={
          session.revoked_at ? null : (
            <Button
              variant="surface"
              size="small"
              onPress={(e) => onRevoke(session.id, e)}
              accessibilityLabel={t('userSession.list.revoke')}
              accessibilityHint={t('userSession.list.revokeHint')}
              testID={`user-session-revoke-${session.id}`}
            >
              {t('common.remove')}
            </Button>
          )
        }
        accessibilityLabel={t('userSession.list.itemLabel', { email: title })}
        testID={`user-session-item-${session.id}`}
      />
    );
  };

  const retryAction = onRetry ? (
    <Button
      variant="surface"
      size="small"
      onPress={onRetry}
      accessibilityLabel={t('common.retry')}
      accessibilityHint={t('common.retryHint')}
      testID="user-session-list-retry"
    >
      {t('common.retry')}
    </Button>
  ) : undefined;
  const showError = !isLoading && hasError && !isOffline;
  const showOffline = !isLoading && isOffline;
  const showEmpty = !isLoading && items.length === 0;
  const showList = items.length > 0;

  return (
    <StyledContainer>
      {noticeMessage ? (
        <Snackbar
          visible={Boolean(noticeMessage)}
          message={noticeMessage}
          variant="success"
          position="bottom"
          onDismiss={onDismissNotice}
          testID="user-session-list-notice"
        />
      ) : null}
      <StyledContent>
        <Text
          variant="h1"
          accessibilityRole="header"
          testID="user-session-list-title"
        >
          {t('userSession.list.title')}
        </Text>
        <Card
          variant="outlined"
          accessibilityLabel={t('userSession.list.accessibilityLabel')}
          testID="user-session-list-card"
        >
          <StyledListBody
            accessibilityLabel={t('userSession.list.accessibilityLabel')}
            testID="user-session-list"
          >
            <StyledStateStack>
              {showError && (
                <ErrorState
                  size={ErrorStateSizes.SMALL}
                  title={t('listScaffold.errorState.title')}
                  description={errorMessage}
                  action={retryAction}
                  testID="user-session-list-error"
                />
              )}
              {showOffline && (
                <OfflineState
                  size={OfflineStateSizes.SMALL}
                  title={t('shell.banners.offline.title')}
                  description={t('shell.banners.offline.message')}
                  action={retryAction}
                  testID="user-session-list-offline"
                />
              )}
            </StyledStateStack>
            {isLoading ? (
              <LoadingSpinner
                accessibilityLabel={t('common.loading')}
                testID="user-session-list-loading"
              />
            ) : null}
            {showEmpty ? emptyComponent : null}
            {showList ? (
              <StyledList>
                <FlatList
                  data={items}
                  keyExtractor={(s) => s.id}
                  renderItem={renderItem}
                  ItemSeparatorComponent={ItemSeparator}
                  scrollEnabled={false}
                  accessibilityLabel={t('userSession.list.accessibilityLabel')}
                  testID="user-session-list-flatlist"
                />
              </StyledList>
            ) : null}
          </StyledListBody>
        </Card>
      </StyledContent>
    </StyledContainer>
  );
};

export default UserSessionListScreenAndroid;
