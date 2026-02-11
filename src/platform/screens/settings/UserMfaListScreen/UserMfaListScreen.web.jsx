/**
 * UserMfaListScreen - Web
 * Full UI always renders: title + list area. On error/offline shows inline message + empty list.
 */
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
  StyledStateStack,
  StyledToolbar,
  StyledToolbarActions,
} from './UserMfaListScreen.web.styles';
import useUserMfaListScreen from './useUserMfaListScreen';

const UserMfaListScreenWeb = () => {
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
            type="button"
            onClick={onAdd}
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

  return (
    <StyledContainer role="main" aria-label={t('userMfa.list.title')}>
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
        <StyledToolbar data-testid="user-mfa-list-toolbar">
          <StyledSearchSlot>
            <Text variant="h2" accessibilityRole="header" testID="user-mfa-list-title">
              {t('userMfa.list.title')}
            </Text>
          </StyledSearchSlot>
          <StyledToolbarActions>
            {onAdd && (
              <StyledAddButton
                type="button"
                onClick={onAdd}
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
          <StyledListBody role="region" aria-label={t('userMfa.list.accessibilityLabel')} data-testid="user-mfa-list">
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
            {showList && (
              <StyledList role="list">
                {items.map((item) => {
                  const channel = item?.channel ?? '';
                  const userId = item?.user_id ?? '';
                  const channelKey = channel ? `userMfa.channel.${channel}` : '';
                  const channelLabel = channelKey ? t(channelKey) : '';
                  const title = channelLabel
                    ? `${t('userMfa.list.channelLabel')}: ${channelLabel}`
                    : (item?.id ?? '');
                  const subtitle = userId ? `${t('userMfa.list.userLabel')}: ${userId}` : '';
                  return (
                    <li key={item.id} role="listitem">
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
                        accessibilityLabel={t('userMfa.list.itemLabel', { name: title })}
                        testID={`user-mfa-item-${item.id}`}
                      />
                    </li>
                  );
                })}
              </StyledList>
            )}
          </StyledListBody>
        </Card>
      </StyledContent>
    </StyledContainer>
  );
};

export default UserMfaListScreenWeb;
