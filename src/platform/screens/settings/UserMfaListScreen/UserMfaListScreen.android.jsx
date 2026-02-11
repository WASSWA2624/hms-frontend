/**
 * UserMfaListScreen - Android
 * File: UserMfaListScreen.android.jsx
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
  Text,
} from '@platform/components';
import { useI18n } from '@hooks';
import {
  StyledAddButton,
  StyledAddLabel,
  StyledContainer,
  StyledContent,
  StyledList,
  StyledListBody,
  StyledSearchSlot,
  StyledSeparator,
  StyledStateStack,
  StyledToolbar,
  StyledToolbarActions,
} from './UserMfaListScreen.android.styles';
import useUserMfaListScreen from './useUserMfaListScreen';

const UserMfaListScreenAndroid = () => {
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
    onItemPress,
    onDelete,
    onAdd,
  } = useUserMfaListScreen();

  const emptyComponent = (
    <EmptyState
      title={t('userMfa.list.emptyTitle')}
      description={t('userMfa.list.emptyMessage')}
      action={
        onAdd ? (
          <StyledAddButton
            onPress={onAdd}
            accessibilityRole="button"
            accessibilityLabel={t('userMfa.list.addLabel')}
            accessibilityHint={t('userMfa.list.addHint')}
            testID="user-mfa-list-empty-add"
          >
            <Icon glyph="+" size="xs" decorative />
            <StyledAddLabel>{t('userMfa.list.addLabel')}</StyledAddLabel>
          </StyledAddButton>
        ) : undefined
      }
      testID="user-mfa-list-empty-state"
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
      icon={<Icon glyph="↻" size="xs" decorative />}
      testID="user-mfa-list-retry"
    >
      {t('common.retry')}
    </Button>
  ) : undefined;
  const showError = !isLoading && hasError && !isOffline;
  const showOffline = !isLoading && isOffline;
  const showEmpty = !isLoading && items.length === 0;
  const showList = items.length > 0;

  const renderItem = ({ item }) => {
    const channel = item?.channel ?? '';
    const userId = item?.user_id ?? '';
    const channelKey = channel ? `userMfa.channel.${channel}` : '';
    const channelLabel = channelKey ? t(channelKey) : '';
    const title = channelLabel ? `${t('userMfa.list.channelLabel')}: ${channelLabel}` : (item?.id ?? '');
    const subtitle = userId ? `${t('userMfa.list.userLabel')}: ${userId}` : '';
    return (
      <ListItem
        title={title}
        subtitle={subtitle}
        onPress={() => onItemPress(item.id)}
        actions={(
          <Button
            variant="surface"
            size="small"
            onPress={(e) => onDelete(item.id, e)}
            accessibilityLabel={t('userMfa.list.delete')}
            accessibilityHint={t('userMfa.list.deleteHint')}
            icon={<Icon glyph="✕" size="xs" decorative />}
            testID={`user-mfa-delete-${item.id}`}
          >
            {t('common.remove')}
          </Button>
        )}
        accessibilityLabel={t('userMfa.list.itemLabel', {
          name: title,
        })}
        testID={`user-mfa-item-${item.id}`}
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
          testID="user-mfa-list-notice"
        />
      ) : null}
      <StyledContent>
        <StyledToolbar testID="user-mfa-list-toolbar">
          <StyledSearchSlot>
            <Text variant="h2" accessibilityRole="header" testID="user-mfa-list-title">
              {t('userMfa.list.title')}
            </Text>
          </StyledSearchSlot>
          <StyledToolbarActions>
            {onAdd && (
              <StyledAddButton
                onPress={onAdd}
                accessibilityRole="button"
                accessibilityLabel={t('userMfa.list.addLabel')}
                accessibilityHint={t('userMfa.list.addHint')}
                testID="user-mfa-list-add"
              >
                <Icon glyph="+" size="xs" decorative />
                <StyledAddLabel>{t('userMfa.list.addLabel')}</StyledAddLabel>
              </StyledAddButton>
            )}
          </StyledToolbarActions>
        </StyledToolbar>
        <Card
          variant="outlined"
          accessibilityLabel={t('userMfa.list.accessibilityLabel')}
          testID="user-mfa-list-card"
        >
          <StyledListBody>
            <StyledStateStack>
              {showError && (
                <ErrorState
                  size={ErrorStateSizes.SMALL}
                  title={t('listScaffold.errorState.title')}
                  description={errorMessage}
                  action={retryAction}
                  testID="user-mfa-list-error"
                />
              )}
              {showOffline && (
                <OfflineState
                  size={OfflineStateSizes.SMALL}
                  title={t('shell.banners.offline.title')}
                  description={t('shell.banners.offline.message')}
                  action={retryAction}
                  testID="user-mfa-list-offline"
                />
              )}
            </StyledStateStack>
            {isLoading && (
              <LoadingSpinner accessibilityLabel={t('common.loading')} testID="user-mfa-list-loading" />
            )}
            {showEmpty && emptyComponent}
            {showList ? (
              <StyledList>
                <FlatList
                  data={items}
                  keyExtractor={(item) => item.id}
                  renderItem={renderItem}
                  ItemSeparatorComponent={ItemSeparator}
                  scrollEnabled={false}
                  accessibilityLabel={t('userMfa.list.accessibilityLabel')}
                  testID="user-mfa-list-flatlist"
                />
              </StyledList>
            ) : null}
          </StyledListBody>
        </Card>
      </StyledContent>
    </StyledContainer>
  );
};

export default UserMfaListScreenAndroid;
