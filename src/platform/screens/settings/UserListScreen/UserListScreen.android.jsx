/**
 * UserListScreen - Android
 * File: UserListScreen.android.jsx
 */
import React from 'react';
import { FlatList } from 'react-native';
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
  Snackbar,
} from '@platform/components';
import { useI18n } from '@hooks';
import {
  StyledAddButton,
  StyledAddLabel,
  StyledContainer,
  StyledContent,
  StyledList,
  StyledListBody,
  StyledSeparator,
  StyledStateStack,
  StyledToolbar,
  StyledToolbarActions,
} from './UserListScreen.android.styles';
import useUserListScreen from './useUserListScreen';

const resolveStatusLabel = (t, value) => {
  if (!value) return '';
  const key = `user.status.${value}`;
  const resolved = t(key);
  return resolved === key ? value : resolved;
};

const UserListScreenAndroid = () => {
  const { t } = useI18n();
  const {
    items,
    isLoading,
    hasError,
    errorMessage,
    isOffline,
    noticeMessage,
    onDismissNotice,
    onRetry,
    onUserPress,
    onDelete,
    onAdd,
  } = useUserListScreen();

  const emptyComponent = (
    <EmptyState
      title={t('user.list.emptyTitle')}
      description={t('user.list.emptyMessage')}
      action={
        onAdd ? (
          <StyledAddButton
            onPress={onAdd}
            accessibilityRole="button"
            accessibilityLabel={t('user.list.addLabel')}
            accessibilityHint={t('user.list.addHint')}
            testID="user-list-empty-add"
          >
            <Icon glyph="+" size="xs" decorative />
            <StyledAddLabel>{t('user.list.addLabel')}</StyledAddLabel>
          </StyledAddButton>
        ) : undefined
      }
      testID="user-list-empty-state"
    />
  );

  const ItemSeparator = () => <StyledSeparator />;
  const retryAction = onRetry ? (
    <Button
      variant="surface"
      size="small"
      onPress={onRetry}
      accessibilityLabel={t('common.retry')}
      accessibilityHint={t('common.retryHint')}
      icon={<Icon glyph="?" size="xs" decorative />}
      testID="user-list-retry"
    >
      {t('common.retry')}
    </Button>
  ) : undefined;
  const showError = !isLoading && hasError && !isOffline;
  const showOffline = !isLoading && isOffline;
  const showEmpty = !isLoading && items.length === 0;
  const showList = items.length > 0;

  const renderItem = ({ item: user }) => {
    const title = user?.email ?? user?.phone ?? user?.id ?? '';
    const statusLabel = resolveStatusLabel(t, user?.status);
    const subtitle = statusLabel ? `${t('user.list.statusLabel')}: ${statusLabel}` : '';
    return (
      <ListItem
        title={title}
        subtitle={subtitle}
        onPress={() => onUserPress(user.id)}
        actions={(
          <Button
            variant="surface"
            size="small"
            onPress={(e) => onDelete(user.id, e)}
            accessibilityLabel={t('user.list.delete')}
            accessibilityHint={t('user.list.deleteHint')}
            icon={<Icon glyph="?" size="xs" decorative />}
            testID={`user-delete-${user.id}`}
          >
            {t('common.remove')}
          </Button>
        )}
        accessibilityLabel={t('user.list.itemLabel', {
          name: title,
        })}
        accessibilityHint={t('user.list.itemHint', { name: title })}
        testID={`user-item-${user.id}`}
      />
    );
  };

  return (
    <StyledContainer>
      {noticeMessage ? (
        <Snackbar
          visible={Boolean(noticeMessage)}
          message={noticeMessage}
          variant="success"
          position="bottom"
          onDismiss={onDismissNotice}
          testID="user-list-notice"
        />
      ) : null}
      <StyledContent>
        <StyledToolbar testID="user-list-toolbar">
          <StyledToolbarActions>
            {onAdd && (
              <StyledAddButton
                onPress={onAdd}
                accessibilityRole="button"
                accessibilityLabel={t('user.list.addLabel')}
                accessibilityHint={t('user.list.addHint')}
                testID="user-list-add"
              >
                <Icon glyph="+" size="xs" decorative />
                <StyledAddLabel>{t('user.list.addLabel')}</StyledAddLabel>
              </StyledAddButton>
            )}
          </StyledToolbarActions>
        </StyledToolbar>
        <Card
          variant="outlined"
          accessibilityLabel={t('user.list.accessibilityLabel')}
          testID="user-list-card"
        >
          <StyledListBody>
            <StyledStateStack>
              {showError && (
                <ErrorState
                  size={ErrorStateSizes.SMALL}
                  title={t('listScaffold.errorState.title')}
                  description={errorMessage}
                  action={retryAction}
                  testID="user-list-error"
                />
              )}
              {showOffline && (
                <OfflineState
                  size={OfflineStateSizes.SMALL}
                  title={t('shell.banners.offline.title')}
                  description={t('shell.banners.offline.message')}
                  action={retryAction}
                  testID="user-list-offline"
                />
              )}
            </StyledStateStack>
            {isLoading && (
              <LoadingSpinner accessibilityLabel={t('common.loading')} testID="user-list-loading" />
            )}
            {showEmpty && emptyComponent}
            {showList ? (
              <StyledList>
                <FlatList
                  data={items}
                  keyExtractor={(user) => user.id}
                  renderItem={renderItem}
                  ItemSeparatorComponent={ItemSeparator}
                  scrollEnabled={false}
                  accessibilityLabel={t('user.list.accessibilityLabel')}
                  testID="user-list-flatlist"
                />
              </StyledList>
            ) : null}
          </StyledListBody>
        </Card>
      </StyledContent>
    </StyledContainer>
  );
};

export default UserListScreenAndroid;
