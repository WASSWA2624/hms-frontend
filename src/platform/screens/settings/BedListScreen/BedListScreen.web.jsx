/**
 * BedListScreen - Web
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
} from './BedListScreen.web.styles';
import useBedListScreen from './useBedListScreen';

const BedListScreenWeb = () => {
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
    onBedPress,
    onDelete,
    onAdd,
  } = useBedListScreen();

  const emptyComponent = (
    <EmptyState
      title={t('bed.list.emptyTitle')}
      description={t('bed.list.emptyMessage')}
      action={
        onAdd ? (
          <StyledAddButton
            type="button"
            onClick={onAdd}
            accessibilityLabel={t('bed.list.addLabel')}
            accessibilityHint={t('bed.list.addHint')}
            testID="bed-list-empty-add"
          >
            <Icon glyph="+" size="xs" decorative />
            <StyledAddLabel>{t('bed.list.addLabel')}</StyledAddLabel>
          </StyledAddButton>
        ) : undefined
      }
      testID="bed-list-empty-state"
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
      testID="bed-list-retry"
    >
      {t('common.retry')}
    </Button>
  ) : undefined;
  const showError = !isLoading && hasError && !isOffline;
  const showOffline = !isLoading && isOffline;
  const showEmpty = !isLoading && items.length === 0;
  const showList = items.length > 0;

  return (
    <StyledContainer role="main" aria-label={t('bed.list.title')}>
      {noticeMessage ? (
        <Snackbar
          visible={Boolean(noticeMessage)}
          message={noticeMessage}
          variant="success"
          position="bottom"
          onDismiss={onDismissNotice}
          testID="bed-list-notice"
        />
      ) : null}
      <StyledContent>
        <StyledToolbar data-testid="bed-list-toolbar">
          <StyledSearchSlot>
            <TextField
              value={search}
              onChange={(e) => onSearch(e.target.value)}
              placeholder={t('bed.list.searchPlaceholder')}
              accessibilityLabel={t('bed.list.searchLabel')}
              density="compact"
              type="search"
              testID="bed-list-search"
            />
          </StyledSearchSlot>
          <StyledToolbarActions>
            {onAdd && (
              <StyledAddButton
                type="button"
                onClick={onAdd}
                accessibilityLabel={t('bed.list.addLabel')}
                accessibilityHint={t('bed.list.addHint')}
                testID="bed-list-add"
              >
                <Icon glyph="+" size="xs" decorative />
                <StyledAddLabel>{t('bed.list.addLabel')}</StyledAddLabel>
              </StyledAddButton>
            )}
          </StyledToolbarActions>
        </StyledToolbar>
        <Card
          variant="outlined"
          accessibilityLabel={t('bed.list.accessibilityLabel')}
          testID="bed-list-card"
        >
          <StyledListBody role="region" aria-label={t('bed.list.accessibilityLabel')} data-testid="bed-list">
            <StyledStateStack>
              {showError && (
                <ErrorState
                  size={ErrorStateSizes.SMALL}
                  title={t('listScaffold.errorState.title')}
                  description={errorMessage}
                  action={retryAction}
                  testID="bed-list-error"
                />
              )}
              {showOffline && (
                <OfflineState
                  size={OfflineStateSizes.SMALL}
                  title={t('shell.banners.offline.title')}
                  description={t('shell.banners.offline.message')}
                  action={retryAction}
                  testID="bed-list-offline"
                />
              )}
            </StyledStateStack>
            {isLoading && (
              <LoadingSpinner accessibilityLabel={t('common.loading')} testID="bed-list-loading" />
            )}
            {showEmpty && emptyComponent}
            {showList && (
              <StyledList role="list">
                {items.map((bed) => {
                  const title = bed?.label ?? bed?.id ?? '';
                  const subtitle = bed?.status ? `${t('bed.list.statusLabel')}: ${bed.status}` : '';
                  return (
                    <li key={bed.id} role="listitem">
                      <ListItem
                        title={title}
                        subtitle={subtitle}
                        onPress={() => onBedPress(bed.id)}
                        actions={(
                          <Button
                            variant="surface"
                            size="small"
                            onPress={(e) => onDelete(bed.id, e)}
                            accessibilityLabel={t('bed.list.delete')}
                            accessibilityHint={t('bed.list.deleteHint')}
                            icon={<Icon glyph="?" size="xs" decorative />}
                            testID={`bed-delete-${bed.id}`}
                          >
                            {t('common.remove')}
                          </Button>
                        )}
                        accessibilityLabel={t('bed.list.itemLabel', { name: title })}
                        accessibilityHint={t('bed.list.itemHint', { name: title })}
                        testID={`bed-item-${bed.id}`}
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

export default BedListScreenWeb;
