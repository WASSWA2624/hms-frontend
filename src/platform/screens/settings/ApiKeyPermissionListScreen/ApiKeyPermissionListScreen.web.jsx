/**
 * ApiKeyPermissionListScreen - Web
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
} from './ApiKeyPermissionListScreen.web.styles';
import useApiKeyPermissionListScreen from './useApiKeyPermissionListScreen';

const ApiKeyPermissionListScreenWeb = () => {
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
  } = useApiKeyPermissionListScreen();

  const emptyComponent = (
    <EmptyState
      title={t('apiKeyPermission.list.emptyTitle')}
      description={t('apiKeyPermission.list.emptyMessage')}
      action={
        onAdd ? (
          <StyledAddButton
            type="button"
            onClick={onAdd}
            accessibilityLabel={t('apiKeyPermission.list.addLabel')}
            accessibilityHint={t('apiKeyPermission.list.addHint')}
            testID="api-key-permission-list-empty-add"
          >
            <Icon glyph="+" size="xs" decorative />
            <StyledAddLabel>{t('apiKeyPermission.list.addLabel')}</StyledAddLabel>
          </StyledAddButton>
        ) : undefined
      }
      testID="api-key-permission-list-empty-state"
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
      testID="api-key-permission-list-retry"
    >
      {t('common.retry')}
    </Button>
  ) : undefined;
  const showError = !isLoading && hasError && !isOffline;
  const showOffline = !isLoading && isOffline;
  const showEmpty = !isLoading && items.length === 0;
  const showList = items.length > 0;

  return (
    <StyledContainer role="main" aria-label={t('apiKeyPermission.list.title')}>
      {noticeMessage ? (
        <Snackbar
          visible={Boolean(noticeMessage)}
          message={noticeMessage}
          variant="success"
          position="bottom"
          onDismiss={onDismissNotice}
          testID="api-key-permission-list-notice"
        />
      ) : null}
      <StyledContent>
        <StyledToolbar data-testid="api-key-permission-list-toolbar">
          <StyledSearchSlot>
            <Text variant="h2" accessibilityRole="header" testID="api-key-permission-list-title">
              {t('apiKeyPermission.list.title')}
            </Text>
          </StyledSearchSlot>
          <StyledToolbarActions>
            {onAdd && (
              <StyledAddButton
                type="button"
                onClick={onAdd}
                accessibilityLabel={t('apiKeyPermission.list.addLabel')}
                accessibilityHint={t('apiKeyPermission.list.addHint')}
                testID="api-key-permission-list-add"
              >
                <Icon glyph="+" size="xs" decorative />
                <StyledAddLabel>{t('apiKeyPermission.list.addLabel')}</StyledAddLabel>
              </StyledAddButton>
            )}
          </StyledToolbarActions>
        </StyledToolbar>
        <Card
          variant="outlined"
          accessibilityLabel={t('apiKeyPermission.list.accessibilityLabel')}
          testID="api-key-permission-list-card"
        >
          <StyledListBody role="region" aria-label={t('apiKeyPermission.list.accessibilityLabel')} data-testid="api-key-permission-list">
            <StyledStateStack>
              {showError && (
                <ErrorState
                  size={ErrorStateSizes.SMALL}
                  title={t('listScaffold.errorState.title')}
                  description={errorMessage}
                  action={retryAction}
                  testID="api-key-permission-list-error"
                />
              )}
              {showOffline && (
                <OfflineState
                  size={OfflineStateSizes.SMALL}
                  title={t('shell.banners.offline.title')}
                  description={t('shell.banners.offline.message')}
                  action={retryAction}
                  testID="api-key-permission-list-offline"
                />
              )}
            </StyledStateStack>
            {isLoading && <LoadingSpinner accessibilityLabel={t('common.loading')} testID="api-key-permission-list-loading" />}
            {showEmpty && emptyComponent}
            {showList && (
              <StyledList role="list">
                {items.map((item) => {
                  const apiKeyId = item?.api_key_id ?? '';
                  const permissionId = item?.permission_id ?? '';
                  const title = apiKeyId ? `${t('apiKeyPermission.list.apiKeyLabel')}: ${apiKeyId}` : (item?.id ?? '');
                  const subtitle = permissionId ? `${t('apiKeyPermission.list.permissionLabel')}: ${permissionId}` : '';
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
                            accessibilityLabel={t('apiKeyPermission.list.delete')}
                            accessibilityHint={t('apiKeyPermission.list.deleteHint')}
                            icon={<Icon glyph="✕" size="xs" decorative />}
                            testID={`api-key-permission-delete-${item.id}`}
                          >
                            {t('common.remove')}
                          </Button>
                        )}
                        accessibilityLabel={t('apiKeyPermission.list.itemLabel', { name: title })}
                        testID={`api-key-permission-item-${item.id}`}
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

export default ApiKeyPermissionListScreenWeb;
