/**
 * WardListScreen - Web
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
  TextField,
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
} from './WardListScreen.web.styles';
import useWardListScreen from './useWardListScreen';

const WardListScreenWeb = () => {
  const { t } = useI18n();
  const {
    items,
    search,
    isLoading,
    hasError,
    errorMessage,
    isOffline,
    noticeMessage,
    onDismissNotice,
    onRetry,
    onSearch,
    onWardPress,
    onDelete,
    onAdd,
  } = useWardListScreen();

  const emptyComponent = (
    <EmptyState
      title={t('ward.list.emptyTitle')}
      description={t('ward.list.emptyMessage')}
      action={
        onAdd ? (
          <StyledAddButton
            type="button"
            onClick={onAdd}
            accessibilityLabel={t('ward.list.addLabel')}
            accessibilityHint={t('ward.list.addHint')}
            testID="ward-list-empty-add"
          >
            <Icon glyph="+" size="xs" decorative />
            <StyledAddLabel>{t('ward.list.addLabel')}</StyledAddLabel>
          </StyledAddButton>
        ) : undefined
      }
      testID="ward-list-empty-state"
    />
  );

  const retryAction = onRetry ? (
    <Button
      variant="surface"
      size="small"
      onPress={onRetry}
      accessibilityLabel={t('common.retry')}
      accessibilityHint={t('common.retryHint')}
      icon={<Icon glyph="?" size="xs" decorative />}
      testID="ward-list-retry"
    >
      {t('common.retry')}
    </Button>
  ) : undefined;
  const showError = !isLoading && hasError && !isOffline;
  const showOffline = !isLoading && isOffline;
  const showEmpty = !isLoading && items.length === 0;
  const showList = items.length > 0;

  return (
    <StyledContainer role="main" aria-label={t('ward.list.title')}>
      {noticeMessage ? (
        <Snackbar
          visible={Boolean(noticeMessage)}
          message={noticeMessage}
          variant="success"
          position="bottom"
          onDismiss={onDismissNotice}
          testID="ward-list-notice"
        />
      ) : null}
      <StyledContent>
        <StyledToolbar data-testid="ward-list-toolbar">
          <StyledSearchSlot>
            <TextField
              value={search}
              onChange={(e) => onSearch(e.target.value)}
              placeholder={t('ward.list.searchPlaceholder')}
              accessibilityLabel={t('ward.list.searchLabel')}
              density="compact"
              type="search"
              testID="ward-list-search"
            />
          </StyledSearchSlot>
          <StyledToolbarActions>
            {onAdd && (
              <StyledAddButton
                type="button"
                onClick={onAdd}
                accessibilityLabel={t('ward.list.addLabel')}
                accessibilityHint={t('ward.list.addHint')}
                testID="ward-list-add"
              >
                <Icon glyph="+" size="xs" decorative />
                <StyledAddLabel>{t('ward.list.addLabel')}</StyledAddLabel>
              </StyledAddButton>
            )}
          </StyledToolbarActions>
        </StyledToolbar>
        <Card
          variant="outlined"
          accessibilityLabel={t('ward.list.accessibilityLabel')}
          testID="ward-list-card"
        >
          <StyledListBody role="region" aria-label={t('ward.list.accessibilityLabel')} data-testid="ward-list">
            <StyledStateStack>
              {showError && (
                <ErrorState
                  size={ErrorStateSizes.SMALL}
                  title={t('listScaffold.errorState.title')}
                  description={errorMessage}
                  action={retryAction}
                  testID="ward-list-error"
                />
              )}
              {showOffline && (
                <OfflineState
                  size={OfflineStateSizes.SMALL}
                  title={t('shell.banners.offline.title')}
                  description={t('shell.banners.offline.message')}
                  action={retryAction}
                  testID="ward-list-offline"
                />
              )}
            </StyledStateStack>
            {isLoading && (
              <LoadingSpinner accessibilityLabel={t('common.loading')} testID="ward-list-loading" />
            )}
            {showEmpty && emptyComponent}
            {showList && (
              <StyledList role="list">
                {items.map((ward) => {
                  const title = ward?.name ?? ward?.id ?? '';
                  const subtitle = ward?.ward_type ? `${t('ward.list.typeLabel')}: ${ward.ward_type}` : '';
                  return (
                    <li key={ward.id} role="listitem">
                      <ListItem
                        title={title}
                        subtitle={subtitle}
                        onPress={() => onWardPress(ward.id)}
                        actions={(
                          <Button
                            variant="surface"
                            size="small"
                            onPress={(e) => onDelete(ward.id, e)}
                            accessibilityLabel={t('ward.list.delete')}
                            accessibilityHint={t('ward.list.deleteHint')}
                            icon={<Icon glyph="?" size="xs" decorative />}
                            testID={`ward-delete-${ward.id}`}
                          >
                            {t('common.remove')}
                          </Button>
                        )}
                        accessibilityLabel={t('ward.list.itemLabel', { name: title })}
                        accessibilityHint={t('ward.list.itemHint', { name: title })}
                        testID={`ward-item-${ward.id}`}
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

export default WardListScreenWeb;
