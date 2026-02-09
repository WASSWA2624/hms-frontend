/**
 * ApiKeyPermissionListScreen - Web
 * Full UI always renders: title + list area. On error/offline shows inline message + empty list.
 */
import React from 'react';
import {
  Button,
  EmptyState,
  ErrorState,
  ListItem,
  LoadingSpinner,
  OfflineState,
  Stack,
  Text,
} from '@platform/components';
import { useI18n } from '@hooks';
import { StyledContainer, StyledContent, StyledList, StyledListBody } from './ApiKeyPermissionListScreen.web.styles';
import useApiKeyPermissionListScreen from './useApiKeyPermissionListScreen';

const ApiKeyPermissionListScreenWeb = () => {
  const { t } = useI18n();
  const {
    items,
    isLoading,
    hasError,
    errorMessage,
    isOffline,
    onRetry,
    onItemPress,
    onDelete,
    onAdd,
  } = useApiKeyPermissionListScreen();

  const emptyComponent = (
    <EmptyState
      title={t('apiKeyPermission.list.emptyTitle')}
      description={t('apiKeyPermission.list.emptyMessage')}
      testID="api-key-permission-list-empty-state"
    />
  );

  return (
    <StyledContainer>
      <StyledContent>
        <Stack direction="horizontal" align="center" justify="space-between" wrap spacing="sm">
          <Text variant="h1" accessibilityRole="header" testID="api-key-permission-list-title">
            {t('apiKeyPermission.list.title')}
          </Text>
          {onAdd && (
            <Button
              variant="primary"
              onPress={onAdd}
              accessibilityLabel={t('apiKeyPermission.list.addLabel')}
              accessibilityHint={t('apiKeyPermission.list.addHint')}
              testID="api-key-permission-list-add"
            >
              {t('apiKeyPermission.list.addLabel')}
            </Button>
          )}
        </Stack>
        <StyledListBody role="region" aria-label={t('apiKeyPermission.list.accessibilityLabel')} data-testid="api-key-permission-list">
          {isLoading && <LoadingSpinner testID="api-key-permission-list-spinner" />}
          {!isLoading && hasError && (
            <>
              <ErrorState
                title={t('listScaffold.errorState.title')}
                description={errorMessage}
                action={onRetry ? <button type="button" onClick={onRetry} aria-label={t('common.retry')}>{t('common.retry')}</button> : undefined}
                testID="api-key-permission-list-error-state"
              />
              {emptyComponent}
            </>
          )}
          {!isLoading && isOffline && (
            <>
              <OfflineState
                action={onRetry ? <button type="button" onClick={onRetry} aria-label={t('common.retry')}>{t('common.retry')}</button> : undefined}
                testID="api-key-permission-list-offline-state"
              />
              {emptyComponent}
            </>
          )}
          {!isLoading && !hasError && !isOffline && items.length === 0 && emptyComponent}
          {!isLoading && !hasError && !isOffline && items.length > 0 && (
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
                      actions={
                        <Button
                          variant="ghost"
                          size="small"
                          onPress={(e) => onDelete(item.id, e)}
                          accessibilityLabel={t('apiKeyPermission.list.delete')}
                          accessibilityHint={t('apiKeyPermission.list.deleteHint')}
                          testID={`api-key-permission-delete-${item.id}`}
                        >
                          {t('common.remove')}
                        </Button>
                      }
                      accessibilityLabel={t('apiKeyPermission.list.itemLabel', { name: title })}
                      testID={`api-key-permission-item-${item.id}`}
                    />
                  </li>
                );
              })}
            </StyledList>
          )}
        </StyledListBody>
      </StyledContent>
    </StyledContainer>
  );
};

export default ApiKeyPermissionListScreenWeb;
