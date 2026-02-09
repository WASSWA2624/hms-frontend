/**
 * OauthAccountListScreen - Web
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
import { StyledContainer, StyledContent, StyledList, StyledListBody } from './OauthAccountListScreen.web.styles';
import useOauthAccountListScreen from './useOauthAccountListScreen';

const OauthAccountListScreenWeb = () => {
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
  } = useOauthAccountListScreen();

  const emptyComponent = (
    <EmptyState
      title={t('oauthAccount.list.emptyTitle')}
      description={t('oauthAccount.list.emptyMessage')}
      testID="oauth-account-list-empty-state"
    />
  );

  return (
    <StyledContainer>
      <StyledContent>
        <Stack direction="horizontal" align="center" justify="space-between" wrap spacing="sm">
          <Text
            variant="h1"
            accessibilityRole="header"
            testID="oauth-account-list-title"
          >
            {t('oauthAccount.list.title')}
          </Text>
          {onAdd && (
            <Button
              variant="primary"
              onPress={onAdd}
              accessibilityLabel={t('oauthAccount.list.addLabel')}
              accessibilityHint={t('oauthAccount.list.addHint')}
              testID="oauth-account-list-add"
            >
              {t('oauthAccount.list.addLabel')}
            </Button>
          )}
        </Stack>
        <StyledListBody role="region" aria-label={t('oauthAccount.list.accessibilityLabel')} data-testid="oauth-account-list">
          {isLoading && (
            <LoadingSpinner testID="oauth-account-list-spinner" />
          )}
          {!isLoading && hasError && (
            <>
              <ErrorState
                title={t('listScaffold.errorState.title')}
                description={errorMessage}
                action={
                  onRetry ? (
                    <button type="button" onClick={onRetry} aria-label={t('common.retry')}>
                      {t('common.retry')}
                    </button>
                  ) : undefined
                }
                testID="oauth-account-list-error-state"
              />
              {emptyComponent}
            </>
          )}
          {!isLoading && isOffline && (
            <>
              <OfflineState
                action={
                  onRetry ? (
                    <button type="button" onClick={onRetry} aria-label={t('common.retry')}>
                      {t('common.retry')}
                    </button>
                  ) : undefined
                }
                testID="oauth-account-list-offline-state"
              />
              {emptyComponent}
            </>
          )}
          {!isLoading && !hasError && !isOffline && items.length === 0 && emptyComponent}
          {!isLoading && !hasError && !isOffline && items.length > 0 && (
            <StyledList role="list">
              {items.map((item) => {
                const provider = item?.provider ?? '';
                const userId = item?.user_id ?? '';
                const title = provider ? `${t('oauthAccount.list.providerLabel')}: ${provider}` : (item?.id ?? '');
                const subtitle = userId ? `${t('oauthAccount.list.userLabel')}: ${userId}` : '';
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
                          accessibilityLabel={t('oauthAccount.list.delete')}
                          accessibilityHint={t('oauthAccount.list.deleteHint')}
                          testID={`oauth-account-delete-${item.id}`}
                        >
                          {t('common.remove')}
                        </Button>
                      }
                      accessibilityLabel={t('oauthAccount.list.itemLabel', { name: title })}
                      testID={`oauth-account-item-${item.id}`}
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

export default OauthAccountListScreenWeb;
