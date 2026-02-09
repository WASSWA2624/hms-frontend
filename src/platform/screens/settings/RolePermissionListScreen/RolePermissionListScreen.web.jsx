/**
 * RolePermissionListScreen - Web
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
import { StyledContainer, StyledContent, StyledList, StyledListBody } from './RolePermissionListScreen.web.styles';
import useRolePermissionListScreen from './useRolePermissionListScreen';

const RolePermissionListScreenWeb = () => {
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
  } = useRolePermissionListScreen();

  const emptyComponent = (
    <EmptyState
      title={t('rolePermission.list.emptyTitle')}
      description={t('rolePermission.list.emptyMessage')}
      testID="role-permission-list-empty-state"
    />
  );

  return (
    <StyledContainer>
      <StyledContent>
        <Stack direction="horizontal" align="center" justify="space-between" wrap spacing="sm">
          <Text variant="h1" accessibilityRole="header" testID="role-permission-list-title">
            {t('rolePermission.list.title')}
          </Text>
          {onAdd && (
            <Button
              variant="primary"
              onPress={onAdd}
              accessibilityLabel={t('rolePermission.list.addLabel')}
              accessibilityHint={t('rolePermission.list.addHint')}
              testID="role-permission-list-add"
            >
              {t('rolePermission.list.addLabel')}
            </Button>
          )}
        </Stack>
        <StyledListBody role="region" aria-label={t('rolePermission.list.accessibilityLabel')} data-testid="role-permission-list">
          {isLoading && <LoadingSpinner testID="role-permission-list-spinner" />}
          {!isLoading && hasError && (
            <>
              <ErrorState
                title={t('listScaffold.errorState.title')}
                description={errorMessage}
                action={onRetry ? <button type="button" onClick={onRetry} aria-label={t('common.retry')}>{t('common.retry')}</button> : undefined}
                testID="role-permission-list-error-state"
              />
              {emptyComponent}
            </>
          )}
          {!isLoading && isOffline && (
            <>
              <OfflineState
                action={onRetry ? <button type="button" onClick={onRetry} aria-label={t('common.retry')}>{t('common.retry')}</button> : undefined}
                testID="role-permission-list-offline-state"
              />
              {emptyComponent}
            </>
          )}
          {!isLoading && !hasError && !isOffline && items.length === 0 && emptyComponent}
          {!isLoading && !hasError && !isOffline && items.length > 0 && (
            <StyledList role="list">
              {items.map((item) => {
                const roleId = item?.role_id ?? '';
                const permissionId = item?.permission_id ?? '';
                const title = roleId ? `${t('rolePermission.list.roleLabel')}: ${roleId}` : (item?.id ?? '');
                const subtitle = permissionId ? `${t('rolePermission.list.permissionLabel')}: ${permissionId}` : '';
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
                          accessibilityLabel={t('rolePermission.list.delete')}
                          accessibilityHint={t('rolePermission.list.deleteHint')}
                          testID={`role-permission-delete-${item.id}`}
                        >
                          {t('common.remove')}
                        </Button>
                      }
                      accessibilityLabel={t('rolePermission.list.itemLabel', { name: title })}
                      testID={`role-permission-item-${item.id}`}
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

export default RolePermissionListScreenWeb;
