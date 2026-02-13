/**
 * UserProfileListScreen - Web
 * Full UI always renders: toolbar + list area. On error/offline shows inline message + empty list.
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
} from '@platform/components';
import { useI18n } from '@hooks';
import {
  StyledAddButton,
  StyledAddLabel,
  StyledContainer,
  StyledContent,
  StyledList,
  StyledListBody,
  StyledStateStack,
  StyledToolbar,
  StyledToolbarActions,
} from './UserProfileListScreen.web.styles';
import useUserProfileListScreen from './useUserProfileListScreen';

const UserProfileListScreenWeb = () => {
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
  } = useUserProfileListScreen();

  const emptyComponent = (
    <EmptyState
      title={t('userProfile.list.emptyTitle')}
      description={t('userProfile.list.emptyMessage')}
      action={
        onAdd ? (
          <StyledAddButton
            type="button"
            onClick={onAdd}
            accessibilityLabel={t('userProfile.list.addLabel')}
            accessibilityHint={t('userProfile.list.addHint')}
            testID="user-profile-list-empty-add"
          >
            <Icon glyph="+" size="xs" decorative />
            <StyledAddLabel>{t('userProfile.list.addLabel')}</StyledAddLabel>
          </StyledAddButton>
        ) : undefined
      }
      testID="user-profile-list-empty-state"
    />
  );

  return (
    <StyledContainer role="main" aria-label={t('userProfile.list.title')}>
      {noticeMessage ? (
        <Snackbar
          visible={Boolean(noticeMessage)}
          message={noticeMessage}
          variant="success"
          position="bottom"
          onDismiss={onDismissNotice}
          testID="user-profile-list-notice"
        />
      ) : null}
      <StyledContent>
        <StyledToolbar data-testid="user-profile-list-toolbar">
          <StyledToolbarActions>
            {onAdd && (
              <StyledAddButton
                type="button"
                onClick={onAdd}
                accessibilityLabel={t('userProfile.list.addLabel')}
                accessibilityHint={t('userProfile.list.addHint')}
                testID="user-profile-list-add"
              >
                <Icon glyph="+" size="xs" decorative />
                <StyledAddLabel>{t('userProfile.list.addLabel')}</StyledAddLabel>
              </StyledAddButton>
            )}
          </StyledToolbarActions>
        </StyledToolbar>
        <Card
          variant="outlined"
          accessibilityLabel={t('userProfile.list.accessibilityLabel')}
          testID="user-profile-list-card"
        >
          <StyledListBody role="region" aria-label={t('userProfile.list.accessibilityLabel')} data-testid="user-profile-list">
            <StyledStateStack>
              {!isLoading && hasError && !isOffline && (
                <ErrorState
                  size={ErrorStateSizes.SMALL}
                  title={t('listScaffold.errorState.title')}
                  description={errorMessage}
                  action={onRetry ? (
                    <Button
                      variant="surface"
                      size="small"
                      onPress={onRetry}
                      accessibilityLabel={t('common.retry')}
                      accessibilityHint={t('common.retryHint')}
                      icon={<Icon glyph="?" size="xs" decorative />}
                      testID="user-profile-list-retry"
                    >
                      {t('common.retry')}
                    </Button>
                  ) : undefined}
                  testID="user-profile-list-error"
                />
              )}
              {!isLoading && isOffline && (
                <OfflineState
                  size={OfflineStateSizes.SMALL}
                  title={t('shell.banners.offline.title')}
                  description={t('shell.banners.offline.message')}
                  action={onRetry ? (
                    <Button
                      variant="surface"
                      size="small"
                      onPress={onRetry}
                      accessibilityLabel={t('common.retry')}
                      accessibilityHint={t('common.retryHint')}
                      icon={<Icon glyph="?" size="xs" decorative />}
                      testID="user-profile-list-retry"
                    >
                      {t('common.retry')}
                    </Button>
                  ) : undefined}
                  testID="user-profile-list-offline"
                />
              )}
            </StyledStateStack>
            {isLoading && (
              <LoadingSpinner accessibilityLabel={t('common.loading')} testID="user-profile-list-loading" />
            )}
            {!isLoading && items.length === 0 && emptyComponent}
            {items.length > 0 && (
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
                        actions={onDelete ? (
                          <Button
                            variant="surface"
                            size="small"
                            onPress={(e) => onDelete(item.id, e)}
                            accessibilityLabel={t('userProfile.list.delete')}
                            accessibilityHint={t('userProfile.list.deleteHint')}
                            icon={<Icon glyph="?" size="xs" decorative />}
                            testID={`user-profile-delete-${item.id}`}
                          >
                            {t('common.remove')}
                          </Button>
                        ) : undefined}
                        accessibilityLabel={t('userProfile.list.itemLabel', { name: title })}
                        accessibilityHint={t('userProfile.list.itemHint', { name: title })}
                        testID={`user-profile-item-${item.id}`}
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

export default UserProfileListScreenWeb;
