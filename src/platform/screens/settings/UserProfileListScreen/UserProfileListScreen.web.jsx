/**
 * UserProfileListScreen - Web
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
import { StyledContainer, StyledContent, StyledList, StyledListBody } from './UserProfileListScreen.web.styles';
import useUserProfileListScreen from './useUserProfileListScreen';

const UserProfileListScreenWeb = () => {
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
  } = useUserProfileListScreen();

  const emptyComponent = (
    <EmptyState
      title={t('userProfile.list.emptyTitle')}
      description={t('userProfile.list.emptyMessage')}
      testID="user-profile-list-empty-state"
    />
  );

  return (
    <StyledContainer>
      <StyledContent>
        <Stack direction="horizontal" align="center" justify="space-between" wrap spacing="sm">
          <Text variant="h1" accessibilityRole="header" testID="user-profile-list-title">
            {t('userProfile.list.title')}
          </Text>
          {onAdd && (
            <Button
              variant="primary"
              onPress={onAdd}
              accessibilityLabel={t('userProfile.list.addLabel')}
              accessibilityHint={t('userProfile.list.addHint')}
              testID="user-profile-list-add"
            >
              {t('userProfile.list.addLabel')}
            </Button>
          )}
        </Stack>
        <StyledListBody role="region" aria-label={t('userProfile.list.accessibilityLabel')} data-testid="user-profile-list">
          {isLoading && <LoadingSpinner testID="user-profile-list-spinner" />}
          {!isLoading && hasError && (
            <>
              <ErrorState
                title={t('listScaffold.errorState.title')}
                description={errorMessage}
                action={onRetry ? <button type="button" onClick={onRetry} aria-label={t('common.retry')}>{t('common.retry')}</button> : undefined}
                testID="user-profile-list-error-state"
              />
              {emptyComponent}
            </>
          )}
          {!isLoading && isOffline && (
            <>
              <OfflineState
                action={onRetry ? <button type="button" onClick={onRetry} aria-label={t('common.retry')}>{t('common.retry')}</button> : undefined}
                testID="user-profile-list-offline-state"
              />
              {emptyComponent}
            </>
          )}
          {!isLoading && !hasError && !isOffline && items.length === 0 && emptyComponent}
          {!isLoading && !hasError && !isOffline && items.length > 0 && (
            <StyledList role="list">
              {items.map((item) => {
                const fullName = [item?.first_name, item?.middle_name, item?.last_name].filter(Boolean).join(' ');
                const title = fullName || item?.user_id || item?.id || '';
                const subtitle = item?.user_id ? `${t('userProfile.list.userLabel')}: ${item.user_id}` : '';
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
                          accessibilityLabel={t('userProfile.list.delete')}
                          accessibilityHint={t('userProfile.list.deleteHint')}
                          testID={`user-profile-delete-${item.id}`}
                        >
                          {t('common.remove')}
                        </Button>
                      }
                      accessibilityLabel={t('userProfile.list.itemLabel', { name: title })}
                      testID={`user-profile-item-${item.id}`}
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

export default UserProfileListScreenWeb;
