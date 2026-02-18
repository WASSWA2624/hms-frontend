/**
 * RoleListScreen - Web
 * Desktop/tablet renders DataTable; mobile web renders compact list items.
 */
import React, { useCallback, useMemo } from 'react';
import { useWindowDimensions } from 'react-native';
import {
  Button,
  Card,
  DataTable,
  EmptyState,
  ErrorState,
  ErrorStateSizes,
  Icon,
  ListItem,
  LoadingSpinner,
  OfflineState,
  OfflineStateSizes,
  Select,
  Snackbar,
  TextField,
} from '@platform/components';
import { useI18n } from '@hooks';
import { humanizeIdentifier } from '@utils';
import {
  StyledActionButton,
  StyledAddButton,
  StyledAddLabel,
  StyledContainer,
  StyledContent,
  StyledDangerActionButton,
  StyledList,
  StyledListBody,
  StyledRowActions,
  StyledScopeSlot,
  StyledSearchSlot,
  StyledStateStack,
  StyledToolbar,
  StyledToolbarActions,
} from './RoleListScreen.web.styles';
import useRoleListScreen from './useRoleListScreen';

const TABLE_MODE_BREAKPOINT = 768;

const resolveRoleId = (roleItem) => String(roleItem?.id ?? '').trim();

const resolveRoleName = (t, roleItem) => (
  humanizeIdentifier(roleItem?.name) || t('role.list.unnamedRole')
);

const resolveRoleDescription = (t, roleItem) => (
  humanizeIdentifier(roleItem?.description) || t('common.notAvailable')
);

const RoleListScreenWeb = () => {
  const { t } = useI18n();
  const { width } = useWindowDimensions();
  const {
    items,
    search,
    searchScope,
    searchScopeOptions,
    sortField,
    sortDirection,
    hasNoResults,
    isLoading,
    hasError,
    errorMessage,
    isOffline,
    noticeMessage,
    onDismissNotice,
    onRetry,
    onSearch,
    onSearchScopeChange,
    onClearSearchAndFilters,
    onSort,
    onItemPress,
    onDelete,
    onAdd,
  } = useRoleListScreen();

  const isTableMode = Number(width) >= TABLE_MODE_BREAKPOINT;
  const showError = !isLoading && hasError && !isOffline;
  const showOffline = !isLoading && isOffline && items.length === 0;
  const showOfflineBanner = !isLoading && isOffline && items.length > 0;
  const showNoResults = !isLoading && !showError && !showOffline && hasNoResults;
  const showEmpty = !isLoading && !showError && !showOffline && !showNoResults && items.length === 0;
  const showList = items.length > 0;
  const showDesktopTable = isTableMode && !showError && !showOffline;

  const emptyComponent = (
    <EmptyState
      title={t('role.list.emptyTitle')}
      description={t('role.list.emptyMessage')}
      action={
        onAdd ? (
          <StyledAddButton
            type="button"
            onClick={onAdd}
            accessibilityLabel={t('role.list.addLabel')}
            accessibilityHint={t('role.list.addHint')}
            testID="role-list-empty-add"
          >
            <Icon glyph="+" size="xs" decorative />
            <StyledAddLabel>{t('role.list.addLabel')}</StyledAddLabel>
          </StyledAddButton>
        ) : undefined
      }
      testID="role-list-empty-state"
    />
  );

  const noResultsComponent = (
    <EmptyState
      title={t('role.list.noResultsTitle')}
      description={t('role.list.noResultsMessage')}
      action={
        <StyledActionButton
          type="button"
          onClick={onClearSearchAndFilters}
          data-testid="role-list-clear-search"
        >
          {t('role.list.clearSearchAndFilters')}
        </StyledActionButton>
      }
      testID="role-list-no-results"
    />
  );

  const retryAction = onRetry ? (
    <Button
      variant="surface"
      size="small"
      onPress={onRetry}
      accessibilityLabel={t('common.retry')}
      accessibilityHint={t('common.retryHint')}
      testID="role-list-retry"
    >
      {t('common.retry')}
    </Button>
  ) : undefined;

  const tableColumns = useMemo(() => ([
    {
      id: 'name',
      label: t('role.list.columnName'),
      sortable: true,
      sortLabel: t('role.list.sortBy', { field: t('role.list.columnName') }),
      width: 240,
      minWidth: 200,
      align: 'left',
      renderCell: (roleItem) => resolveRoleName(t, roleItem),
      getCellTitle: (roleItem) => resolveRoleName(t, roleItem),
    },
    {
      id: 'description',
      label: t('role.list.columnDescription'),
      sortable: true,
      sortLabel: t('role.list.sortBy', { field: t('role.list.columnDescription') }),
      width: 340,
      minWidth: 240,
      align: 'left',
      renderCell: (roleItem) => resolveRoleDescription(t, roleItem),
      getCellTitle: (roleItem) => resolveRoleDescription(t, roleItem),
    },
  ]), [t]);

  const handleTableRowPress = useCallback((roleItem) => {
    const roleId = resolveRoleId(roleItem);
    if (!roleId) return;
    onItemPress(roleId);
  }, [onItemPress]);

  const renderTableRowActions = useCallback((roleItem) => {
    const roleId = resolveRoleId(roleItem);
    if (!roleId) return null;

    return (
      <StyledRowActions>
        <StyledActionButton
          type="button"
          onClick={(event) => {
            event.stopPropagation();
            onItemPress(roleId);
          }}
          data-testid={`role-view-${roleId}`}
        >
          {t('common.view')}
        </StyledActionButton>
        {onDelete ? (
          <StyledDangerActionButton
            type="button"
            onClick={(event) => onDelete(roleId, event)}
            data-testid={`role-delete-${roleId}`}
          >
            {t('common.remove')}
          </StyledDangerActionButton>
        ) : null}
      </StyledRowActions>
    );
  }, [onDelete, onItemPress, t]);

  const toolbarSection = (
    <StyledToolbar data-testid="role-list-toolbar">
      <StyledSearchSlot>
        <TextField
          value={search}
          onChange={(event) => onSearch(event.target.value)}
          placeholder={t('role.list.searchPlaceholder')}
          accessibilityLabel={t('role.list.searchLabel')}
          density="compact"
          type="search"
          testID="role-list-search"
        />
      </StyledSearchSlot>
      <StyledScopeSlot>
        <Select
          value={searchScope}
          onValueChange={onSearchScopeChange}
          options={searchScopeOptions}
          label={t('role.list.searchScopeLabel')}
          compact
          testID="role-list-search-scope"
        />
      </StyledScopeSlot>
      <StyledToolbarActions>
        {onAdd && (
          <StyledAddButton
            type="button"
            onClick={onAdd}
            accessibilityLabel={t('role.list.addLabel')}
            accessibilityHint={t('role.list.addHint')}
            testID="role-list-add"
          >
            <Icon glyph="+" size="xs" decorative />
            <StyledAddLabel>{t('role.list.addLabel')}</StyledAddLabel>
          </StyledAddButton>
        )}
      </StyledToolbarActions>
    </StyledToolbar>
  );

  return (
    <StyledContainer role="main" aria-label={t('role.list.title')}>
      {noticeMessage ? (
        <Snackbar
          visible={Boolean(noticeMessage)}
          message={noticeMessage}
          variant="success"
          position="bottom"
          onDismiss={onDismissNotice}
          testID="role-list-notice"
        />
      ) : null}
      <StyledContent>
        {toolbarSection}
        <Card
          variant="outlined"
          accessibilityLabel={t('role.list.accessibilityLabel')}
          testID="role-list-card"
        >
          <StyledListBody role="region" aria-label={t('role.list.accessibilityLabel')} data-testid="role-list">
            <StyledStateStack>
              {showError && (
                <ErrorState
                  size={ErrorStateSizes.SMALL}
                  title={t('listScaffold.errorState.title')}
                  description={errorMessage}
                  action={retryAction}
                  testID="role-list-error"
                />
              )}
              {showOffline && (
                <OfflineState
                  size={OfflineStateSizes.SMALL}
                  title={t('shell.banners.offline.title')}
                  description={t('shell.banners.offline.message')}
                  action={retryAction}
                  testID="role-list-offline"
                />
              )}
              {showOfflineBanner && (
                <OfflineState
                  size={OfflineStateSizes.SMALL}
                  title={t('shell.banners.offline.title')}
                  description={t('shell.banners.offline.message')}
                  action={retryAction}
                  testID="role-list-offline-banner"
                />
              )}
            </StyledStateStack>

            {isLoading && (
              <LoadingSpinner accessibilityLabel={t('common.loading')} testID="role-list-loading" />
            )}

            {showDesktopTable ? (
              <DataTable
                columns={tableColumns}
                rows={items}
                getRowKey={(roleItem, index) => resolveRoleId(roleItem) || `role-${index}`}
                sortField={sortField}
                sortDirection={sortDirection}
                onSort={onSort}
                renderRowActions={renderTableRowActions}
                rowActionsLabel={t('role.list.columnActions')}
                onRowPress={handleTableRowPress}
                showDefaultEmptyRow={false}
                statusContent={showEmpty ? emptyComponent : (showNoResults ? noResultsComponent : null)}
                minWidth={760}
                testID="role-table"
              />
            ) : null}

            {!isTableMode && showEmpty ? emptyComponent : null}
            {!isTableMode && showNoResults ? noResultsComponent : null}

            {!isTableMode && showList ? (
              <StyledList role="list">
                {items.map((roleItem, index) => {
                  const roleId = resolveRoleId(roleItem);
                  const itemKey = roleId || `role-${index}`;
                  const title = resolveRoleName(t, roleItem);
                  const description = humanizeIdentifier(roleItem?.description);
                  return (
                    <li key={itemKey} role="listitem">
                      <ListItem
                        title={title}
                        subtitle={description || undefined}
                        onPress={roleId ? () => onItemPress(roleId) : undefined}
                        actions={onDelete && roleId ? (
                          <Button
                            variant="surface"
                            size="small"
                            onPress={(event) => onDelete(roleId, event)}
                            accessibilityLabel={t('role.list.delete')}
                            accessibilityHint={t('role.list.deleteHint')}
                            testID={`role-delete-${itemKey}`}
                          >
                            {t('common.remove')}
                          </Button>
                        ) : undefined}
                        accessibilityLabel={t('role.list.itemLabel', { name: title })}
                        testID={`role-item-${itemKey}`}
                      />
                    </li>
                  );
                })}
              </StyledList>
            ) : null}
          </StyledListBody>
        </Card>
      </StyledContent>
    </StyledContainer>
  );
};

export default RoleListScreenWeb;
