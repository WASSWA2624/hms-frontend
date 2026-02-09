/**
 * ApiKeyListScreen - Web
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
import { StyledContainer, StyledContent, StyledList, StyledListBody } from './ApiKeyListScreen.web.styles';
import useApiKeyListScreen from './useApiKeyListScreen';

const ApiKeyListScreenWeb = () => {
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
  } = useApiKeyListScreen();

  const emptyComponent = (
    <EmptyState
      title={t('apiKey.list.emptyTitle')}
      description={t('apiKey.list.emptyMessage')}
      testID="api-key-list-empty-state"
    />
  );

  return (
    <StyledContainer>
      <StyledContent>
        <Stack direction="horizontal" align="center" justify="space-between" wrap spacing="sm">
          <Text variant="h1" accessibilityRole="header" testID="api-key-list-title">
            {t('apiKey.list.title')}
          </Text>
          {onAdd && (
            <Button
              variant="primary"
              onPress={onAdd}
              accessibilityLabel={t('apiKey.list.addLabel')}
              accessibilityHint={t('apiKey.list.addHint')}
              testID="api-key-list-add"
            >
              {t('apiKey.list.addLabel')}
            </Button>
          )}
        </Stack>
        <StyledListBody role="region" aria-label={t('apiKey.list.accessibilityLabel')} data-testid="api-key-list">
          {isLoading && <LoadingSpinner testID="api-key-list-spinner" />}
          {!isLoading && hasError && (
            <>
              <ErrorState
                title={t('listScaffold.errorState.title')}
                description={errorMessage}
                action={onRetry ? <button type="button" onClick={onRetry} aria-label={t('common.retry')}>{t('common.retry')}</button> : undefined}
                testID="api-key-list-error-state"
              />
              {emptyComponent}
            </>
          )}
          {!isLoading && isOffline && (
            <>
              <OfflineState
                action={onRetry ? <button type="button" onClick={onRetry} aria-label={t('common.retry')}>{t('common.retry')}</button> : undefined}
                testID="api-key-list-offline-state"
              />
              {emptyComponent}
            </>
          )}
          {!isLoading && !hasError && !isOffline && items.length === 0 && emptyComponent}
          {!isLoading && !hasError && !isOffline && items.length > 0 && (
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
                      actions={
                        <Button
                          variant="ghost"
                          size="small"
                          onPress={(e) => onDelete(item.id, e)}
                          accessibilityLabel={t('apiKey.list.delete')}
                          accessibilityHint={t('apiKey.list.deleteHint')}
                          testID={`api-key-delete-${item.id}`}
                        >
                          {t('common.remove')}
                        </Button>
                      }
                      accessibilityLabel={t('apiKey.list.itemLabel', { name: title })}
                      testID={`api-key-item-${item.id}`}
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

export default ApiKeyListScreenWeb;
