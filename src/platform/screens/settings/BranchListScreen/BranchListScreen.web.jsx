/**
 * BranchListScreen - Web
 * Full UI always renders: title + list area.
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
} from './BranchListScreen.web.styles';
import useBranchListScreen from './useBranchListScreen';

const BranchListScreenWeb = () => {
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
    onBranchPress,
    onDelete,
    onAdd,
  } = useBranchListScreen();

  const emptyComponent = (
    <EmptyState
      title={t('branch.list.emptyTitle')}
      description={t('branch.list.emptyMessage')}
      action={
        onAdd ? (
          <StyledAddButton
            type="button"
            onClick={onAdd}
            accessibilityLabel={t('branch.list.addLabel')}
            accessibilityHint={t('branch.list.addHint')}
            testID="branch-list-empty-add"
          >
            <Icon glyph="+" size="xs" decorative />
            <StyledAddLabel>{t('branch.list.addLabel')}</StyledAddLabel>
          </StyledAddButton>
        ) : undefined
      }
      testID="branch-list-empty-state"
    />
  );
  const retryAction = onRetry ? (
    <Button
      variant="surface"
      size="small"
      onPress={onRetry}
      accessibilityLabel={t('common.retry')}
      accessibilityHint={t('common.retryHint')}
      icon={<Icon glyph="↻" size="xs" decorative />}
      testID="branch-list-retry"
    >
      {t('common.retry')}
    </Button>
  ) : undefined;
  const showError = !isLoading && hasError && !isOffline;
  const showOffline = !isLoading && isOffline;
  const showEmpty = !isLoading && !showError && !showOffline && items.length === 0;
  const showList = items.length > 0;

  return (
    <StyledContainer role="main" aria-label={t('branch.list.title')}>
      {noticeMessage ? (
        <Snackbar
          visible={Boolean(noticeMessage)}
          message={noticeMessage}
          variant="success"
          position="bottom"
          onDismiss={onDismissNotice}
          testID="branch-list-notice"
        />
      ) : null}
      <StyledContent>
        <StyledToolbar data-testid="branch-list-toolbar">
          <StyledSearchSlot>
            <TextField
              value={search}
              onChange={(e) => onSearch(e.target.value)}
              placeholder={t('branch.list.searchPlaceholder')}
              accessibilityLabel={t('branch.list.searchLabel')}
              density="compact"
              type="search"
              testID="branch-list-search"
            />
          </StyledSearchSlot>
          <StyledToolbarActions>
            {onAdd && (
              <StyledAddButton
                type="button"
                onClick={onAdd}
                accessibilityLabel={t('branch.list.addLabel')}
                accessibilityHint={t('branch.list.addHint')}
                testID="branch-list-add"
              >
                <Icon glyph="+" size="xs" decorative />
                <StyledAddLabel>{t('branch.list.addLabel')}</StyledAddLabel>
              </StyledAddButton>
            )}
          </StyledToolbarActions>
        </StyledToolbar>
        <Card
          variant="outlined"
          accessibilityLabel={t('branch.list.accessibilityLabel')}
          testID="branch-list-card"
        >
          <StyledListBody role="region" aria-label={t('branch.list.accessibilityLabel')} data-testid="branch-list">
            <StyledStateStack>
              {showError && (
                <ErrorState
                  size={ErrorStateSizes.SMALL}
                  title={t('listScaffold.errorState.title')}
                  description={errorMessage}
                  action={retryAction}
                  testID="branch-list-error"
                />
              )}
              {showOffline && (
                <OfflineState
                  size={OfflineStateSizes.SMALL}
                  title={t('shell.banners.offline.title')}
                  description={t('shell.banners.offline.message')}
                  action={retryAction}
                  testID="branch-list-offline"
                />
              )}
            </StyledStateStack>
            {isLoading && (
              <LoadingSpinner accessibilityLabel={t('common.loading')} testID="branch-list-loading" />
            )}
            {showEmpty && emptyComponent}
            {showList && (
              <StyledList role="list">
                {items.map((branch) => {
                  const title = branch?.name ?? branch?.id ?? '';
                  const subtitle = branch?.is_active === false
                    ? t('branch.list.statusInactive')
                    : t('branch.list.statusActive');
                  return (
                    <li key={branch.id} role="listitem">
                      <ListItem
                        title={title}
                        subtitle={subtitle}
                        onPress={() => onBranchPress(branch.id)}
                        actions={onDelete ? (
                          <Button
                            variant="surface"
                            size="small"
                            onPress={(e) => onDelete(branch.id, e)}
                            accessibilityLabel={t('branch.list.delete')}
                            accessibilityHint={t('branch.list.deleteHint')}
                            icon={<Icon glyph="✕" size="xs" decorative />}
                            testID={`branch-delete-${branch.id}`}
                          >
                            {t('common.remove')}
                          </Button>
                        ) : undefined}
                        accessibilityLabel={t('branch.list.itemLabel', { name: title })}
                        accessibilityHint={t('branch.list.itemHint', { name: title })}
                        testID={`branch-item-${branch.id}`}
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

export default BranchListScreenWeb;
