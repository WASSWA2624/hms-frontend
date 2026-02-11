/**
 * ApiKeyListScreen - Web
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
} from './ApiKeyListScreen.web.styles';
import useApiKeyListScreen from './useApiKeyListScreen';

const ApiKeyListScreenWeb = () => {
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
  } = useApiKeyListScreen();

  const emptyComponent = (
    <EmptyState
      title={t('apiKey.list.emptyTitle')}
      description={t('apiKey.list.emptyMessage')}
      action={
        onAdd ? (
          <StyledAddButton
            type="button"
            onClick={onAdd}
            accessibilityLabel={t('apiKey.list.addLabel')}
            accessibilityHint={t('apiKey.list.addHint')}
            testID="api-key-list-empty-add"
          >
            <Icon glyph="+" size="xs" decorative />
            <StyledAddLabel>{t('apiKey.list.addLabel')}</StyledAddLabel>
          </StyledAddButton>
        ) : undefined
      }
      testID="api-key-list-empty-state"
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
      testID="api-key-list-retry"
    >
      {t('common.retry')}
    </Button>
  ) : undefined;
  const showError = !isLoading && hasError && !isOffline;
  const showOffline = !isLoading && isOffline;
  const showEmpty = !isLoading && items.length === 0;
  const showList = items.length > 0;

  return (
    <StyledContainer role="main" aria-label={t('apiKey.list.title')}>
      {noticeMessage ? (
        <Snackbar
          visible={Boolean(noticeMessage)}
          message={noticeMessage}
          variant="success"
          position="bottom"
          onDismiss={onDismissNotice}
          testID="api-key-list-notice"
        />
      ) : null}
      <StyledContent>
        <StyledToolbar data-testid="api-key-list-toolbar">
          <StyledSearchSlot>
            <Text variant="h2" accessibilityRole="header" testID="api-key-list-title">
              {t('apiKey.list.title')}
            </Text>
          </StyledSearchSlot>
          <StyledToolbarActions>
            {onAdd && (
              <StyledAddButton
                type="button"
                onClick={onAdd}
                accessibilityLabel={t('apiKey.list.addLabel')}
                accessibilityHint={t('apiKey.list.addHint')}
                testID="api-key-list-add"
              >
                <Icon glyph="+" size="xs" decorative />
                <StyledAddLabel>{t('apiKey.list.addLabel')}</StyledAddLabel>
              </StyledAddButton>
            )}
          </StyledToolbarActions>
        </StyledToolbar>
        <Card
          variant="outlined"
          accessibilityLabel={t('apiKey.list.accessibilityLabel')}
          testID="api-key-list-card"
        >
          <StyledListBody role="region" aria-label={t('apiKey.list.accessibilityLabel')} data-testid="api-key-list">
            <StyledStateStack>
              {showError && (
                <ErrorState
                  size={ErrorStateSizes.SMALL}
                  title={t('listScaffold.errorState.title')}
                  description={errorMessage}
                  action={retryAction}
                  testID="api-key-list-error"
                />
              )}
              {showOffline && (
                <OfflineState
                  size={OfflineStateSizes.SMALL}
                  title={t('shell.banners.offline.title')}
                  description={t('shell.banners.offline.message')}
                  action={retryAction}
                  testID="api-key-list-offline"
                />
              )}
            </StyledStateStack>
            {isLoading && <LoadingSpinner accessibilityLabel={t('common.loading')} testID="api-key-list-loading" />}
            {showEmpty && emptyComponent}
            {showList && (
              <StyledList role="list">
                {items.map((item) => {
                  const title = item?.name ?? item?.id ?? '';
                  const userId = item?.user_id ?? '';
                  const subtitle = userId ? `${t('apiKey.list.userLabel')}: ${userId}` : '';
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
                            accessibilityLabel={t('apiKey.list.delete')}
                            accessibilityHint={t('apiKey.list.deleteHint')}
                            icon={<Icon glyph="×" size="xs" decorative />}
                            testID={`api-key-delete-${item.id}`}
                          >
                            {t('common.remove')}
                          </Button>
                        )}
                        accessibilityLabel={t('apiKey.list.itemLabel', { name: title })}
                        accessibilityHint={t('apiKey.list.itemHint', { name: title })}
                        testID={`api-key-item-${item.id}`}
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

export default ApiKeyListScreenWeb;
