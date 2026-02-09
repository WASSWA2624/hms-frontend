/**
 * UserRoleListScreen - Web
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
import { StyledContainer, StyledContent, StyledList, StyledListBody } from './UserRoleListScreen.web.styles';
import useUserRoleListScreen from './useUserRoleListScreen';

const UserRoleListScreenWeb = () => {
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
  } = useUserRoleListScreen();

  const emptyComponent = (
    <EmptyState
      title={t('userRole.list.emptyTitle')}
      description={t('userRole.list.emptyMessage')}
      testID="user-role-list-empty-state"
    />
  );

  return (
    <StyledContainer>
      <StyledContent>
        <Stack direction="horizontal" align="center" justify="space-between" wrap spacing="sm">
          <Text variant="h1" accessibilityRole="header" testID="user-role-list-title">
            {t('userRole.list.title')}
          </Text>
          {onAdd && (
            <Button
              variant="primary"
              onPress={onAdd}
              accessibilityLabel={t('userRole.list.addLabel')}
              accessibilityHint={t('userRole.list.addHint')}
              testID="user-role-list-add"
            >
              {t('userRole.list.addLabel')}
            </Button>
          )}
        </Stack>
        <StyledListBody role="region" aria-label={t('userRole.list.accessibilityLabel')} data-testid="user-role-list">
          {isLoading && <LoadingSpinner testID="user-role-list-spinner" />}
          {!isLoading && hasError && (
            <>
              <ErrorState
                title={t('listScaffold.errorState.title')}
                description={errorMessage}
                action={onRetry ? <button type="button" onClick={onRetry} aria-label={t('common.retry')}>{t('common.retry')}</button> : undefined}
                testID="user-role-list-error-state"
              />
              {emptyComponent}
            </>
          )}
          {!isLoading && isOffline && (
            <>
              <OfflineState
                action={onRetry ? <button type="button" onClick={onRetry} aria-label={t('common.retry')}>{t('common.retry')}</button> : undefined}
                testID="user-role-list-offline-state"
              />
              {emptyComponent}
            </>
          )}
          {!isLoading && !hasError && !isOffline && items.length === 0 && emptyComponent}
          {!isLoading && !hasError && !isOffline && items.length > 0 && (
            <StyledList role="list">
              {items.map((item) => {
                const userId = item?.user_id ?? '';
                const roleId = item?.role_id ?? '';
                const tenantId = item?.tenant_id ?? '';
                const title = userId ? `${t('userRole.list.userLabel')}: ${userId}` : (item?.id ?? '');
                const subtitle = [
                  roleId ? `${t('userRole.list.roleLabel')}: ${roleId}` : '',
                  tenantId ? `${t('userRole.list.tenantLabel')}: ${tenantId}` : '',
                ].filter(Boolean).join(' • ');
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
                          accessibilityLabel={t('userRole.list.delete')}
                          accessibilityHint={t('userRole.list.deleteHint')}
                          testID={`user-role-delete-${item.id}`}
                        >
                          {t('common.remove')}
                        </Button>
                      }
                      accessibilityLabel={t('userRole.list.itemLabel', { name: title })}
                      testID={`user-role-item-${item.id}`}
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

export default UserRoleListScreenWeb;
