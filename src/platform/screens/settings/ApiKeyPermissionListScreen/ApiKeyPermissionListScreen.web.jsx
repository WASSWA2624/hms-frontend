/**
 * ApiKeyPermissionListScreen - Web
 * Desktop/tablet renders a customizable table; mobile web renders compact list items.
 */
import React, { useCallback, useMemo, useState } from 'react';
import { useWindowDimensions } from 'react-native';
import {
  Button,
  Card,
  Checkbox,
  DataTable,
  EmptyState,
  ErrorState,
  ErrorStateSizes,
  Icon,
  ListItem,
  LoadingSpinner,
  Modal,
  OfflineState,
  OfflineStateSizes,
  Select,
  Snackbar,
  TextField,
} from '@platform/components';
import { useI18n } from '@hooks';
import {
  StyledActionButton,
  StyledAddButton,
  StyledAddLabel,
  StyledColumnMoveControls,
  StyledColumnRow,
  StyledContainer,
  StyledContent,
  StyledDangerActionButton,
  StyledFilterActions,
  StyledFilterBody,
  StyledFilterButton,
  StyledFilterPanel,
  StyledFilterRow,
  StyledFilterRowActions,
  StyledList,
  StyledListBody,
  StyledMoveButton,
  StyledPagination,
  StyledPaginationActions,
  StyledPaginationControl,
  StyledPaginationControlLabel,
  StyledPaginationInfo,
  StyledPaginationNavButton,
  StyledPaginationSelectSlot,
  StyledRowActions,
  StyledScopeSlot,
  StyledSearchSlot,
  StyledSettingsActions,
  StyledSettingsBody,
  StyledSettingsSection,
  StyledSettingsTitle,
  StyledStateStack,
  StyledTableSettingsButton,
  StyledToolbar,
  StyledToolbarActions,
} from './ApiKeyPermissionListScreen.web.styles';
import useApiKeyPermissionListScreen from './useApiKeyPermissionListScreen';

const TABLE_MODE_BREAKPOINT = 768;
const TABLE_COLUMN_LAYOUT = {
  apiKey: { width: 260, minWidth: 180, align: 'left' },
  permission: { width: 320, minWidth: 220, align: 'left' },
  tenant: { width: 220, minWidth: 180, align: 'left' },
};

const resolveApiKeyPermissionId = (apiKeyPermissionItem) => String(apiKeyPermissionItem?.id ?? '').trim();

const resolveColumnLabel = (t, column) => {
  if (column === 'apiKey') return t('apiKeyPermission.list.columnApiKey');
  if (column === 'permission') return t('apiKeyPermission.list.columnPermission');
  if (column === 'tenant') return t('apiKeyPermission.list.columnTenant');
  return column;
};

const resolveApiKeyPermissionCell = (
  t,
  apiKeyPermissionItem,
  column,
  resolveApiKeyLabel,
  resolvePermissionLabel,
  resolveTenantLabel
) => {
  if (column === 'apiKey') return resolveApiKeyLabel(apiKeyPermissionItem);
  if (column === 'permission') return resolvePermissionLabel(apiKeyPermissionItem);
  if (column === 'tenant') return resolveTenantLabel(apiKeyPermissionItem);
  return t('common.notAvailable');
};

const resolveMobileSubtitle = (
  t,
  apiKeyPermissionItem,
  resolvePermissionLabel,
  resolveTenantLabel
) => {
  const permissionValue = resolvePermissionLabel(apiKeyPermissionItem);
  const tenantValue = resolveTenantLabel(apiKeyPermissionItem);
  const parts = [];

  if (permissionValue && permissionValue !== t('common.notAvailable')) {
    parts.push(`${t('apiKeyPermission.list.permissionLabel')}: ${permissionValue}`);
  }
  if (tenantValue && tenantValue !== t('common.notAvailable')) {
    parts.push(`${t('apiKeyPermission.list.tenantLabel')}: ${tenantValue}`);
  }

  return parts.length > 0 ? parts.join(' - ') : undefined;
};

const ApiKeyPermissionListScreenWeb = () => {
  const { t } = useI18n();
  const { width } = useWindowDimensions();
  const {
    pagedItems,
    totalItems,
    totalPages,
    page,
    pageSize,
    pageSizeOptions,
    density,
    densityOptions,
    search,
    searchScope,
    searchScopeOptions,
    filters,
    filterFieldOptions,
    filterLogic,
    filterLogicOptions,
    canAddFilter,
    hasNoResults,
    hasActiveSearchOrFilter,
    sortField,
    sortDirection,
    columnOrder,
    visibleColumns,
    isTableSettingsOpen,
    isLoading,
    hasError,
    errorMessage,
    isOffline,
    noticeMessage,
    resolveApiKeyLabel,
    resolvePermissionLabel,
    resolveTenantLabel,
    onDismissNotice,
    onRetry,
    onSearch,
    onSearchScopeChange,
    onFilterLogicChange,
    onFilterFieldChange,
    onFilterOperatorChange,
    onFilterValueChange,
    onAddFilter,
    onRemoveFilter,
    onClearSearchAndFilters,
    onSort,
    onPageChange,
    onPageSizeChange,
    onDensityChange,
    onToggleColumnVisibility,
    onMoveColumnLeft,
    onMoveColumnRight,
    onOpenTableSettings,
    onCloseTableSettings,
    onResetTablePreferences,
    resolveFilterOperatorOptions,
    onItemPress,
    onDelete,
    onAdd,
  } = useApiKeyPermissionListScreen();

  const rows = pagedItems;
  const [isFilterPanelCollapsed, setIsFilterPanelCollapsed] = useState(false);
  const isTableMode = Number(width) >= TABLE_MODE_BREAKPOINT;
  const showError = !isLoading && hasError && !isOffline;
  const showOffline = !isLoading && isOffline && rows.length === 0;
  const showOfflineBanner = !isLoading && isOffline && rows.length > 0;
  const showEmpty = !isLoading && !showError && !showOffline && !hasNoResults && totalItems === 0;
  const showList = !isLoading && !showError && !showOffline && rows.length > 0;
  const showDesktopTable = isTableMode && !showError && !showOffline;

  const emptyComponent = (
    <EmptyState
      title={t('apiKeyPermission.list.emptyTitle')}
      description={t('apiKeyPermission.list.emptyMessage')}
      action={
        onAdd ? (
          <StyledAddButton
            type="button"
            onClick={onAdd}
            onPress={onAdd}
            accessibilityLabel={t('apiKeyPermission.list.addLabel')}
            accessibilityHint={t('apiKeyPermission.list.addHint')}
            testID="api-key-permission-list-empty-add"
          >
            <Icon glyph="+" size="xs" decorative />
            <StyledAddLabel>{t('apiKeyPermission.list.addLabel')}</StyledAddLabel>
          </StyledAddButton>
        ) : undefined
      }
      testID="api-key-permission-list-empty-state"
    />
  );

  const noResultsComponent = (
    <EmptyState
      title={t('apiKeyPermission.list.noResultsTitle')}
      description={t('apiKeyPermission.list.noResultsMessage')}
      action={
        <StyledFilterButton
          type="button"
          onClick={onClearSearchAndFilters}
          onPress={onClearSearchAndFilters}
          testID="api-key-permission-list-clear-search"
          data-testid="api-key-permission-list-clear-search"
          aria-label={t('apiKeyPermission.list.clearSearchAndFilters')}
        >
          {t('apiKeyPermission.list.clearSearchAndFilters')}
        </StyledFilterButton>
      }
      testID="api-key-permission-list-no-results"
    />
  );

  const retryAction = onRetry ? (
    <Button
      variant="surface"
      size="small"
      onPress={onRetry}
      accessibilityLabel={t('common.retry')}
      accessibilityHint={t('common.retryHint')}
      testID="api-key-permission-list-retry"
    >
      {t('common.retry')}
    </Button>
  ) : undefined;

  const tableColumns = useMemo(() => visibleColumns.map((column) => {
    const columnLayout = TABLE_COLUMN_LAYOUT[column] || {};
    return {
      id: column,
      label: resolveColumnLabel(t, column),
      sortable: true,
      sortLabel: t('apiKeyPermission.list.sortBy', { field: resolveColumnLabel(t, column) }),
      width: columnLayout.width,
      minWidth: columnLayout.minWidth,
      align: columnLayout.align,
      renderCell: (apiKeyPermissionItem) => resolveApiKeyPermissionCell(
        t,
        apiKeyPermissionItem,
        column,
        resolveApiKeyLabel,
        resolvePermissionLabel,
        resolveTenantLabel
      ),
      getCellTitle: (apiKeyPermissionItem) => resolveApiKeyPermissionCell(
        t,
        apiKeyPermissionItem,
        column,
        resolveApiKeyLabel,
        resolvePermissionLabel,
        resolveTenantLabel
      ),
    };
  }), [visibleColumns, t, resolveApiKeyLabel, resolvePermissionLabel, resolveTenantLabel]);

  const handleTableRowPress = useCallback((apiKeyPermissionItem) => {
    const apiKeyPermissionId = resolveApiKeyPermissionId(apiKeyPermissionItem);
    if (!apiKeyPermissionId) return;
    onItemPress(apiKeyPermissionId);
  }, [onItemPress]);

  const renderTableRowActions = useCallback((apiKeyPermissionItem) => {
    const apiKeyPermissionId = resolveApiKeyPermissionId(apiKeyPermissionItem);
    if (!apiKeyPermissionId) return null;

    return (
      <StyledRowActions>
        <StyledActionButton
          type="button"
          onClick={(event) => {
            event.stopPropagation();
            onItemPress(apiKeyPermissionId);
          }}
          data-testid={`api-key-permission-view-${apiKeyPermissionId}`}
        >
          {t('common.view')}
        </StyledActionButton>

        {onDelete ? (
          <StyledDangerActionButton
            type="button"
            onClick={(event) => onDelete(apiKeyPermissionId, event)}
            data-testid={`api-key-permission-delete-${apiKeyPermissionId}`}
          >
            {t('common.remove')}
          </StyledDangerActionButton>
        ) : null}
      </StyledRowActions>
    );
  }, [onDelete, onItemPress, t]);

  const searchBarSection = (
    <StyledToolbar data-testid="api-key-permission-list-toolbar" testID="api-key-permission-list-toolbar">
      <StyledSearchSlot>
        <TextField
          value={search}
          onChange={(event) => onSearch(event.target.value)}
          placeholder={t('apiKeyPermission.list.searchPlaceholder')}
          accessibilityLabel={t('apiKeyPermission.list.searchLabel')}
          density="compact"
          type="search"
          testID="api-key-permission-list-search"
        />
      </StyledSearchSlot>

      <StyledScopeSlot>
        <Select
          value={searchScope}
          onValueChange={onSearchScopeChange}
          options={searchScopeOptions}
          label={t('apiKeyPermission.list.searchScopeLabel')}
          compact
          testID="api-key-permission-list-search-scope"
        />
      </StyledScopeSlot>

      <StyledToolbarActions>
        {isTableMode ? (
          <StyledTableSettingsButton
            type="button"
            onClick={onOpenTableSettings}
            aria-label={t('apiKeyPermission.list.tableSettings')}
            data-testid="api-key-permission-table-settings"
          >
            {t('apiKeyPermission.list.tableSettings')}
          </StyledTableSettingsButton>
        ) : null}

        {onAdd ? (
          <StyledAddButton
            type="button"
            onClick={onAdd}
            onPress={onAdd}
            accessibilityLabel={t('apiKeyPermission.list.addLabel')}
            accessibilityHint={t('apiKeyPermission.list.addHint')}
            testID="api-key-permission-list-add"
          >
            <Icon glyph="+" size="xs" decorative />
            <StyledAddLabel>{t('apiKeyPermission.list.addLabel')}</StyledAddLabel>
          </StyledAddButton>
        ) : null}
      </StyledToolbarActions>
    </StyledToolbar>
  );

  const filterBarSection = (
    <StyledFilterPanel>
      <StyledFilterButton
        type="button"
        onClick={() => setIsFilterPanelCollapsed((previous) => !previous)}
        data-testid="api-key-permission-filter-toggle"
      >
        {t('common.filters')}
      </StyledFilterButton>

      {!isFilterPanelCollapsed ? (
        <StyledFilterBody data-testid="api-key-permission-filter-body">
          <Select
            value={filterLogic}
            onValueChange={onFilterLogicChange}
            options={filterLogicOptions}
            label={t('apiKeyPermission.list.filterLogicLabel')}
            accessibilityLabel={t('apiKeyPermission.list.filterLogicLabel')}
            compact
            testID="api-key-permission-filter-logic"
          />

          {filters.map((filter, index) => {
            const operatorOptions = resolveFilterOperatorOptions(filter.field);
            return (
              <StyledFilterRow key={filter.id}>
                <Select
                  value={filter.field}
                  onValueChange={(value) => onFilterFieldChange(filter.id, value)}
                  options={filterFieldOptions}
                  label={t('apiKeyPermission.list.filterFieldLabel')}
                  compact
                  testID={`api-key-permission-filter-field-${index}`}
                />

                <Select
                  value={filter.operator}
                  onValueChange={(value) => onFilterOperatorChange(filter.id, value)}
                  options={operatorOptions}
                  label={t('apiKeyPermission.list.filterOperatorLabel')}
                  compact
                  testID={`api-key-permission-filter-operator-${index}`}
                />

                <TextField
                  value={filter.value}
                  onChange={(event) => onFilterValueChange(filter.id, event.target.value)}
                  label={t('apiKeyPermission.list.filterValueLabel')}
                  placeholder={t('apiKeyPermission.list.filterValuePlaceholder')}
                  density="compact"
                  testID={`api-key-permission-filter-value-${index}`}
                />

                <StyledFilterRowActions>
                  <StyledFilterButton
                    type="button"
                    onClick={() => onRemoveFilter(filter.id)}
                    aria-label={t('apiKeyPermission.list.removeFilter')}
                    testID={`api-key-permission-filter-remove-${index}`}
                  >
                    {t('common.remove')}
                  </StyledFilterButton>
                </StyledFilterRowActions>
              </StyledFilterRow>
            );
          })}

          <StyledFilterActions>
            <StyledFilterButton
              type="button"
              onClick={onAddFilter}
              disabled={!canAddFilter}
              testID="api-key-permission-filter-add"
            >
              {t('apiKeyPermission.list.addFilter')}
            </StyledFilterButton>
            <StyledFilterButton
              type="button"
              onClick={onClearSearchAndFilters}
              testID="api-key-permission-filter-clear"
            >
              {t('apiKeyPermission.list.clearSearchAndFilters')}
            </StyledFilterButton>
          </StyledFilterActions>
        </StyledFilterBody>
      ) : null}
    </StyledFilterPanel>
  );

  const tableStatusContent = showEmpty ? emptyComponent : (hasNoResults ? noResultsComponent : null);

  const paginationContent = showList ? (
    <StyledPaginationInfo>
      {t('apiKeyPermission.list.pageSummary', { page, totalPages, total: totalItems })}
    </StyledPaginationInfo>
  ) : null;

  const tableNavigationContent = showList ? (
    <StyledPaginationActions>
      <StyledPaginationNavButton
        type="button"
        onClick={() => onPageChange(page - 1)}
        disabled={page <= 1}
        aria-label={t('common.previous')}
        title={t('common.previous')}
        data-testid="api-key-permission-page-prev"
      >
        {'<'}
      </StyledPaginationNavButton>

      <StyledPaginationControl>
        <StyledPaginationControlLabel>
          {t('apiKeyPermission.list.pageSizeLabel')}
        </StyledPaginationControlLabel>
        <StyledPaginationSelectSlot>
          <Select
            value={String(pageSize)}
            onValueChange={onPageSizeChange}
            options={pageSizeOptions}
            accessibilityLabel={t('apiKeyPermission.list.pageSizeLabel')}
            compact
            testID="api-key-permission-page-size"
          />
        </StyledPaginationSelectSlot>
      </StyledPaginationControl>

      <StyledPaginationControl>
        <StyledPaginationControlLabel>
          {t('apiKeyPermission.list.densityLabel')}
        </StyledPaginationControlLabel>
        <StyledPaginationSelectSlot>
          <Select
            value={density}
            onValueChange={onDensityChange}
            options={densityOptions}
            accessibilityLabel={t('apiKeyPermission.list.densityLabel')}
            compact
            testID="api-key-permission-density"
          />
        </StyledPaginationSelectSlot>
      </StyledPaginationControl>

      <StyledPaginationNavButton
        type="button"
        onClick={() => onPageChange(page + 1)}
        disabled={page >= totalPages}
        aria-label={t('common.next')}
        title={t('common.next')}
        data-testid="api-key-permission-page-next"
      >
        {'>'}
      </StyledPaginationNavButton>
    </StyledPaginationActions>
  ) : null;

  return (
    <StyledContainer role="main" aria-label={t('apiKeyPermission.list.title')}>
      {noticeMessage ? (
        <Snackbar
          visible={Boolean(noticeMessage)}
          message={noticeMessage}
          variant="success"
          position="bottom"
          onDismiss={onDismissNotice}
          testID="api-key-permission-list-notice"
        />
      ) : null}

      <StyledContent>
        {!isTableMode ? searchBarSection : null}
        {!isTableMode ? filterBarSection : null}

        <Card
          variant="outlined"
          accessibilityLabel={t('apiKeyPermission.list.accessibilityLabel')}
          testID="api-key-permission-list-card"
        >
          <StyledListBody
            role="region"
            aria-label={t('apiKeyPermission.list.accessibilityLabel')}
            data-testid="api-key-permission-list"
            testID="api-key-permission-list"
          >
            <StyledStateStack>
              {showError ? (
                <ErrorState
                  size={ErrorStateSizes.SMALL}
                  title={t('listScaffold.errorState.title')}
                  description={errorMessage}
                  action={retryAction}
                  testID="api-key-permission-list-error"
                />
              ) : null}

              {showOffline ? (
                <OfflineState
                  size={OfflineStateSizes.SMALL}
                  title={t('shell.banners.offline.title')}
                  description={t('shell.banners.offline.message')}
                  action={retryAction}
                  testID="api-key-permission-list-offline"
                />
              ) : null}

              {showOfflineBanner ? (
                <OfflineState
                  size={OfflineStateSizes.SMALL}
                  title={t('shell.banners.offline.title')}
                  description={t('shell.banners.offline.message')}
                  action={retryAction}
                  testID="api-key-permission-list-offline-banner"
                />
              ) : null}
            </StyledStateStack>

            {isLoading ? (
              <LoadingSpinner
                accessibilityLabel={t('common.loading')}
                testID="api-key-permission-list-loading"
              />
            ) : null}

            {!isTableMode && showEmpty ? emptyComponent : null}
            {!isTableMode && hasNoResults ? noResultsComponent : null}

            {showDesktopTable ? (
              <DataTable
                columns={tableColumns}
                rows={rows}
                getRowKey={(apiKeyPermissionItem, index) => (
                  resolveApiKeyPermissionId(apiKeyPermissionItem) || `api-key-permission-${index}`
                )}
                rowDensity={density}
                sortField={sortField}
                sortDirection={sortDirection}
                onSort={onSort}
                renderRowActions={renderTableRowActions}
                rowActionsLabel={t('apiKeyPermission.list.columnActions')}
                onRowPress={handleTableRowPress}
                searchBar={searchBarSection}
                filterBar={filterBarSection}
                hasActiveFilters={hasActiveSearchOrFilter}
                statusContent={tableStatusContent}
                pagination={paginationContent}
                tableNavigation={tableNavigationContent}
                showDefaultEmptyRow={false}
                minWidth={900}
                testID="api-key-permission-table"
              />
            ) : null}

            {showList && !isTableMode ? (
              <StyledList role="list">
                {rows.map((apiKeyPermissionItem, index) => {
                  const apiKeyPermissionId = resolveApiKeyPermissionId(apiKeyPermissionItem);
                  const itemKey = apiKeyPermissionId || `api-key-permission-${index}`;
                  const title = resolveApiKeyLabel(apiKeyPermissionItem);
                  const subtitle = resolveMobileSubtitle(
                    t,
                    apiKeyPermissionItem,
                    resolvePermissionLabel,
                    resolveTenantLabel
                  );

                  return (
                    <li key={itemKey} role="listitem">
                      <ListItem
                        title={title}
                        subtitle={subtitle}
                        onPress={apiKeyPermissionId ? () => onItemPress(apiKeyPermissionId) : undefined}
                        actions={onDelete && apiKeyPermissionId ? (
                          <Button
                            variant="surface"
                            size="small"
                            onPress={(event) => onDelete(apiKeyPermissionId, event)}
                            accessibilityLabel={t('apiKeyPermission.list.delete')}
                            accessibilityHint={t('apiKeyPermission.list.deleteHint')}
                            testID={`api-key-permission-delete-${itemKey}`}
                          >
                            {t('common.remove')}
                          </Button>
                        ) : undefined}
                        accessibilityLabel={t('apiKeyPermission.list.itemLabel', { name: title })}
                        testID={`api-key-permission-item-${itemKey}`}
                      />
                    </li>
                  );
                })}
              </StyledList>
            ) : null}

            {!isTableMode && showList ? (
              <StyledPagination>
                <StyledPaginationInfo>
                  {t('apiKeyPermission.list.pageSummary', { page, totalPages, total: totalItems })}
                </StyledPaginationInfo>

                <StyledPaginationActions>
                  <StyledPaginationNavButton
                    type="button"
                    onClick={() => onPageChange(page - 1)}
                    disabled={page <= 1}
                    aria-label={t('common.previous')}
                    title={t('common.previous')}
                    data-testid="api-key-permission-page-prev"
                  >
                    {'<'}
                  </StyledPaginationNavButton>

                  <StyledPaginationControl>
                    <StyledPaginationControlLabel>
                      {t('apiKeyPermission.list.pageSizeLabel')}
                    </StyledPaginationControlLabel>
                    <StyledPaginationSelectSlot>
                      <Select
                        value={String(pageSize)}
                        onValueChange={onPageSizeChange}
                        options={pageSizeOptions}
                        accessibilityLabel={t('apiKeyPermission.list.pageSizeLabel')}
                        compact
                        testID="api-key-permission-page-size"
                      />
                    </StyledPaginationSelectSlot>
                  </StyledPaginationControl>

                  <StyledPaginationControl>
                    <StyledPaginationControlLabel>
                      {t('apiKeyPermission.list.densityLabel')}
                    </StyledPaginationControlLabel>
                    <StyledPaginationSelectSlot>
                      <Select
                        value={density}
                        onValueChange={onDensityChange}
                        options={densityOptions}
                        accessibilityLabel={t('apiKeyPermission.list.densityLabel')}
                        compact
                        testID="api-key-permission-density"
                      />
                    </StyledPaginationSelectSlot>
                  </StyledPaginationControl>

                  <StyledPaginationNavButton
                    type="button"
                    onClick={() => onPageChange(page + 1)}
                    disabled={page >= totalPages}
                    aria-label={t('common.next')}
                    title={t('common.next')}
                    data-testid="api-key-permission-page-next"
                  >
                    {'>'}
                  </StyledPaginationNavButton>
                </StyledPaginationActions>
              </StyledPagination>
            ) : null}
          </StyledListBody>
        </Card>

        <Modal
          visible={Boolean(isTableMode && isTableSettingsOpen)}
          onDismiss={onCloseTableSettings}
          size="small"
          accessibilityLabel={t('apiKeyPermission.list.tableSettings')}
          testID="api-key-permission-table-settings-modal"
        >
          <StyledSettingsBody>
            <StyledSettingsSection>
              <StyledSettingsTitle>{t('apiKeyPermission.list.visibleColumns')}</StyledSettingsTitle>
              {columnOrder.map((column) => (
                <StyledColumnRow key={column}>
                  <Checkbox
                    checked={visibleColumns.includes(column)}
                    onChange={() => onToggleColumnVisibility(column)}
                    label={resolveColumnLabel(t, column)}
                    testID={`api-key-permission-column-visible-${column}`}
                  />

                  <StyledColumnMoveControls>
                    <StyledMoveButton
                      type="button"
                      onClick={() => onMoveColumnLeft(column)}
                      aria-label={t('apiKeyPermission.list.moveColumnLeft', {
                        column: resolveColumnLabel(t, column),
                      })}
                      disabled={columnOrder.indexOf(column) === 0}
                      data-testid={`api-key-permission-column-left-${column}`}
                    >
                      {'<'}
                    </StyledMoveButton>
                    <StyledMoveButton
                      type="button"
                      onClick={() => onMoveColumnRight(column)}
                      aria-label={t('apiKeyPermission.list.moveColumnRight', {
                        column: resolveColumnLabel(t, column),
                      })}
                      disabled={columnOrder.indexOf(column) === columnOrder.length - 1}
                      data-testid={`api-key-permission-column-right-${column}`}
                    >
                      {'>'}
                    </StyledMoveButton>
                  </StyledColumnMoveControls>
                </StyledColumnRow>
              ))}
            </StyledSettingsSection>

            <StyledSettingsActions>
              <StyledFilterButton
                type="button"
                onClick={onResetTablePreferences}
                data-testid="api-key-permission-table-settings-reset"
              >
                {t('apiKeyPermission.list.resetTablePreferences')}
              </StyledFilterButton>
            </StyledSettingsActions>
          </StyledSettingsBody>
        </Modal>
      </StyledContent>
    </StyledContainer>
  );
};

export default ApiKeyPermissionListScreenWeb;