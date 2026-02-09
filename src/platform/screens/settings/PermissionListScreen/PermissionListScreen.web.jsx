/**
 * PermissionListScreen - Web
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
import { StyledContainer, StyledContent, StyledList, StyledListBody } from './PermissionListScreen.web.styles';
import usePermissionListScreen from './usePermissionListScreen';

const PermissionListScreenWeb = () => {
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
  } = usePermissionListScreen();

  const emptyComponent = (
    <EmptyState
      title={t('permission.list.emptyTitle')}
      description={t('permission.list.emptyMessage')}
      testID="permission-list-empty-state"
    />
  );

  return (
    <StyledContainer>
      <StyledContent>
        <Stack direction="horizontal" align="center" justify="space-between" wrap spacing="sm">
          <Text variant="h1" accessibilityRole="header" testID="permission-list-title">
            {t('permission.list.title')}
          </Text>
          {onAdd && (
            <Button
              variant="primary"
              onPress={onAdd}
              accessibilityLabel={t('permission.list.addLabel')}
              accessibilityHint={t('permission.list.addHint')}
              testID="permission-list-add"
            >
              {t('permission.list.addLabel')}
            </Button>
          )}
        </Stack>
        <StyledListBody role="region" aria-label={t('permission.list.accessibilityLabel')} data-testid="permission-list">
          {isLoading && <LoadingSpinner testID="permission-list-spinner" />}
          {!isLoading && hasError && (
            <>
              <ErrorState
                title={t('listScaffold.errorState.title')}
                description={errorMessage}
                action={onRetry ? <button type="button" onClick={onRetry} aria-label={t('common.retry')}>{t('common.retry')}</button> : undefined}
                testID="permission-list-error-state"
              />
              {emptyComponent}
            </>
          )}
          {!isLoading && isOffline && (
            <>
              <OfflineState
                action={onRetry ? <button type="button" onClick={onRetry} aria-label={t('common.retry')}>{t('common.retry')}</button> : undefined}
                testID="permission-list-offline-state"
              />
              {emptyComponent}
            </>
          )}
          {!isLoading && !hasError && !isOffline && items.length === 0 && emptyComponent}
          {!isLoading && !hasError && !isOffline && items.length > 0 && (
            <StyledList role="list">
              {items.map((item) => {
                const title = item?.name ?? item?.id ?? '';
                const subtitle = item?.description ?? '';
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
                          accessibilityLabel={t('permission.list.delete')}
                          accessibilityHint={t('permission.list.deleteHint')}
                          testID={`permission-delete-${item.id}`}
                        >
                          {t('common.remove')}
                        </Button>
                      }
                      accessibilityLabel={t('permission.list.itemLabel', { name: title })}
                      testID={`permission-item-${item.id}`}
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

export default PermissionListScreenWeb;
