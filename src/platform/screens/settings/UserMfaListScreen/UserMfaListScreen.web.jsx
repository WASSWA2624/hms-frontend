/**
 * UserMfaListScreen - Web
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
import { StyledContainer, StyledContent, StyledList, StyledListBody } from './UserMfaListScreen.web.styles';
import useUserMfaListScreen from './useUserMfaListScreen';

const UserMfaListScreenWeb = () => {
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
  } = useUserMfaListScreen();

  const emptyComponent = (
    <EmptyState
      title={t('userMfa.list.emptyTitle')}
      description={t('userMfa.list.emptyMessage')}
      testID="user-mfa-list-empty-state"
    />
  );

  return (
    <StyledContainer>
      <StyledContent>
        <Stack direction="horizontal" align="center" justify="space-between" wrap spacing="sm">
          <Text variant="h1" accessibilityRole="header" testID="user-mfa-list-title">
            {t('userMfa.list.title')}
          </Text>
          {onAdd && (
            <Button
              variant="primary"
              onPress={onAdd}
              accessibilityLabel={t('userMfa.list.addLabel')}
              accessibilityHint={t('userMfa.list.addHint')}
              testID="user-mfa-list-add"
            >
              {t('userMfa.list.addLabel')}
            </Button>
          )}
        </Stack>
        <StyledListBody role="region" aria-label={t('userMfa.list.accessibilityLabel')} data-testid="user-mfa-list">
          {isLoading && <LoadingSpinner testID="user-mfa-list-spinner" />}
          {!isLoading && hasError && (
            <>
              <ErrorState
                title={t('listScaffold.errorState.title')}
                description={errorMessage}
                action={onRetry ? <button type="button" onClick={onRetry} aria-label={t('common.retry')}>{t('common.retry')}</button> : undefined}
                testID="user-mfa-list-error-state"
              />
              {emptyComponent}
            </>
          )}
          {!isLoading && isOffline && (
            <>
              <OfflineState
                action={onRetry ? <button type="button" onClick={onRetry} aria-label={t('common.retry')}>{t('common.retry')}</button> : undefined}
                testID="user-mfa-list-offline-state"
              />
              {emptyComponent}
            </>
          )}
          {!isLoading && !hasError && !isOffline && items.length === 0 && emptyComponent}
          {!isLoading && !hasError && !isOffline && items.length > 0 && (
            <StyledList role="list">
              {items.map((item) => {
                const channel = item?.channel ?? '';
                const userId = item?.user_id ?? '';
                const title = channel ? `${t('userMfa.list.channelLabel')}: ${channel}` : (item?.id ?? '');
                const subtitle = userId ? `${t('userMfa.list.userLabel')}: ${userId}` : '';
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
                          accessibilityLabel={t('userMfa.list.delete')}
                          accessibilityHint={t('userMfa.list.deleteHint')}
                          testID={`user-mfa-delete-${item.id}`}
                        >
                          {t('common.remove')}
                        </Button>
                      }
                      accessibilityLabel={t('userMfa.list.itemLabel', { name: title })}
                      testID={`user-mfa-item-${item.id}`}
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

export default UserMfaListScreenWeb;
