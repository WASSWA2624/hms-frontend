/**
 * ApiKeyListScreen - Web
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
  StyledColumnMoveControls,
  StyledColumnRow,
  StyledContainer,
  StyledContent,
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
} from './ApiKeyListScreen.web.styles';
import useApiKeyListScreen from './useApiKeyListScreen';

const TABLE_MODE_BREAKPOINT = 768;
const TABLE_COLUMN_LAYOUT = {
  name: { width: 300, minWidth: 220, align: 'left' },
  user: { width: 280, minWidth: 200, align: 'left' },
  tenant: { width: 220, minWidth: 180, align: 'left' },
  status: { width: 160, minWidth: 140, align: 'left' },
};

const resolveApiKeyId = (apiKeyItem) => String(apiKeyItem?.id ?? '').trim();

const resolveColumnLabel = (t, column) => {
  if (column === 'name') return t('apiKey.list.columnName');
  if (column === 'user') return t('apiKey.list.columnUser');
  if (column === 'tenant') return t('apiKey.list.columnTenant');
  if (column === 'status') return t('apiKey.list.columnStatus');
  return column;
};

const resolveApiKeyCell = (
  t,
  apiKeyItem,
  column,
  resolveApiKeyName,
  resolveUserLabel,
  resolveTenantLabel,
  resolveStatusLabel
) => {
  if (column === 'name') return resolveApiKeyName(apiKeyItem);
  if (column === 'user') return resolveUserLabel(apiKeyItem);
  if (column === 'tenant') return resolveTenantLabel(apiKeyItem);
  if (column === 'status') return resolveStatusLabel(apiKeyItem);
  return t('common.notAvailable');
};

const resolveMobileSubtitle = (
  t,
  apiKeyItem,
  resolveUserLabel,
  resolveTenantLabel,
  resolveStatusLabel
) => {
  const userValue = resolveUserLabel(apiKeyItem);
  const tenantValue = resolveTenantLabel(apiKeyItem);
  const statusValue = resolveStatusLabel(apiKeyItem);
  const parts = [];

  if (userValue && userValue !== t('common.notAvailable')) {
    parts.push(`${t('apiKey.list.userLabel')}: ${userValue}`);
  }
  if (tenantValue && tenantValue !== t('common.notAvailable')) {
    parts.push(`${t('apiKey.list.tenantLabel')}: ${tenantValue}`);
  }
  if (statusValue && statusValue !== t('common.notAvailable')) {
    parts.push(`${t('apiKey.list.statusLabel')}: ${statusValue}`);
  }

  return parts.length > 0 ? parts.join(' - ') : undefined;
};

const ApiKeyListScreenWeb = () => {
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
    resolveApiKeyName,
    resolveUserLabel,
    resolveTenantLabel,
    resolveStatusLabel,
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
  } = useApiKeyListScreen();

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
      title={t('apiKey.list.emptyTitle')}
      description={t('apiKey.list.emptyMessage')}
      testID="api-key-list-empty-state"
    />
  );

  const noResultsComponent = (
    <EmptyState
      title={t('apiKey.list.noResultsTitle')}
      description={t('apiKey.list.noResultsMessage')}
      action={
        <StyledFilterButton
          type="button"
          onClick={onClearSearchAndFilters}
          onPress={onClearSearchAndFilters}
          testID="api-key-list-clear-search"
          data-testid="api-key-list-clear-search"
          aria-label={t('apiKey.list.clearSearchAndFilters')}
        >
          {t('apiKey.list.clearSearchAndFilters')}
        </StyledFilterButton>
      }
      testID="api-key-list-no-results"
    />
  );

  const retryAction = onRetry ? (
    <Button
      variant="surface"
      size="small"
      onPress={onRetry}
      accessibilityLabel={t('common.retry')}
      accessibilityHint={t('common.retryHint')}
      testID="api-key-list-retry"
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
      sortLabel: t('apiKey.list.sortBy', { field: resolveColumnLabel(t, column) }),
      width: columnLayout.width,
      minWidth: columnLayout.minWidth,
      align: columnLayout.align,
      renderCell: (apiKeyItem) => resolveApiKeyCell(
        t,
        apiKeyItem,
        column,
        resolveApiKeyName,
        resolveUserLabel,
        resolveTenantLabel,
        resolveStatusLabel
      ),
      getCellTitle: (apiKeyItem) => resolveApiKeyCell(
        t,
        apiKeyItem,
        column,
        resolveApiKeyName,
        resolveUserLabel,
        resolveTenantLabel,
        resolveStatusLabel
      ),
    };
  }), [visibleColumns, t, resolveApiKeyName, resolveUserLabel, resolveTenantLabel, resolveStatusLabel]);

  const handleTableRowPress = useCallback((apiKeyItem) => {
    const apiKeyId = resolveApiKeyId(apiKeyItem);
    if (!apiKeyId) return;
    onItemPress(apiKeyId);
  }, [onItemPress]);

  const renderTableRowActions = useCallback((apiKeyItem) => {
    const apiKeyId = resolveApiKeyId(apiKeyItem);
    if (!apiKeyId) return null;

    return (
      <StyledRowActions>
        <StyledActionButton
          type="button"
          onClick={(event) => {
            event.stopPropagation();
            onItemPress(apiKeyId);
          }}
          data-testid={`api-key-view-${apiKeyId}`}
        >
          {t('common.view')}
        </StyledActionButton>
      </StyledRowActions>
    );
  }, [onItemPress, t]);

  const searchBarSection = (
    <StyledToolbar data-testid="api-key-list-toolbar" testID="api-key-list-toolbar">
      <StyledSearchSlot>
        <TextField
          value={search}
          onChange={(event) => onSearch(event.target.value)}
          placeholder={t('apiKey.list.searchPlaceholder')}
          accessibilityLabel={t('apiKey.list.searchLabel')}
          density="compact"
          type="search"
          testID="api-key-list-search"
        />
      </StyledSearchSlot>

      <StyledScopeSlot>
        <Select
          value={searchScope}
          onValueChange={onSearchScopeChange}
          options={searchScopeOptions}
          label={t('apiKey.list.searchScopeLabel')}
          compact
          testID="api-key-list-search-scope"
        />
      </StyledScopeSlot>

      <StyledToolbarActions>
        {isTableMode ? (
          <StyledTableSettingsButton
            type="button"
            onClick={onOpenTableSettings}
            aria-label={t('apiKey.list.tableSettings')}
            data-testid="api-key-table-settings"
          >
            {t('apiKey.list.tableSettings')}
          </StyledTableSettingsButton>
        ) : null}
      </StyledToolbarActions>
    </StyledToolbar>
  );

  const filterBarSection = (
    <StyledFilterPanel>
      <StyledFilterButton
        type="button"
        onClick={() => setIsFilterPanelCollapsed((previous) => !previous)}
        data-testid="api-key-filter-toggle"
      >
        {t('common.filters')}
      </StyledFilterButton>

      {!isFilterPanelCollapsed ? (
        <StyledFilterBody data-testid="api-key-filter-body">
          <Select
            value={filterLogic}
            onValueChange={onFilterLogicChange}
            options={filterLogicOptions}
            label={t('apiKey.list.filterLogicLabel')}
            accessibilityLabel={t('apiKey.list.filterLogicLabel')}
            compact
            testID="api-key-filter-logic"
          />

          {filters.map((filter, index) => {
            const operatorOptions = resolveFilterOperatorOptions(filter.field);
            return (
              <StyledFilterRow key={filter.id}>
                <Select
                  value={filter.field}
                  onValueChange={(value) => onFilterFieldChange(filter.id, value)}
                  options={filterFieldOptions}
                  label={t('apiKey.list.filterFieldLabel')}
                  compact
                  testID={`api-key-filter-field-${index}`}
                />

                <Select
                  value={filter.operator}
                  onValueChange={(value) => onFilterOperatorChange(filter.id, value)}
                  options={operatorOptions}
                  label={t('apiKey.list.filterOperatorLabel')}
                  compact
                  testID={`api-key-filter-operator-${index}`}
                />

                <TextField
                  value={filter.value}
                  onChange={(event) => onFilterValueChange(filter.id, event.target.value)}
                  label={t('apiKey.list.filterValueLabel')}
                  placeholder={t('apiKey.list.filterValuePlaceholder')}
                  density="compact"
                  testID={`api-key-filter-value-${index}`}
                />

                <StyledFilterRowActions>
                  <StyledFilterButton
                    type="button"
                    onClick={() => onRemoveFilter(filter.id)}
                    aria-label={t('apiKey.list.removeFilter')}
                    testID={`api-key-filter-remove-${index}`}
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
              testID="api-key-filter-add"
            >
              {t('apiKey.list.addFilter')}
            </StyledFilterButton>
            <StyledFilterButton
              type="button"
              onClick={onClearSearchAndFilters}
              testID="api-key-filter-clear"
            >
              {t('apiKey.list.clearSearchAndFilters')}
            </StyledFilterButton>
          </StyledFilterActions>
        </StyledFilterBody>
      ) : null}
    </StyledFilterPanel>
  );

  const tableStatusContent = showEmpty ? emptyComponent : (hasNoResults ? noResultsComponent : null);

  const paginationContent = showList ? (
    <StyledPaginationInfo>
      {t('apiKey.list.pageSummary', { page, totalPages, total: totalItems })}
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
        data-testid="api-key-page-prev"
      >
        {'<'}
      </StyledPaginationNavButton>

      <StyledPaginationControl>
        <StyledPaginationControlLabel>
          {t('apiKey.list.pageSizeLabel')}
        </StyledPaginationControlLabel>
        <StyledPaginationSelectSlot>
          <Select
            value={String(pageSize)}
            onValueChange={onPageSizeChange}
            options={pageSizeOptions}
            accessibilityLabel={t('apiKey.list.pageSizeLabel')}
            compact
            testID="api-key-page-size"
          />
        </StyledPaginationSelectSlot>
      </StyledPaginationControl>

      <StyledPaginationControl>
        <StyledPaginationControlLabel>
          {t('apiKey.list.densityLabel')}
        </StyledPaginationControlLabel>
        <StyledPaginationSelectSlot>
          <Select
            value={density}
            onValueChange={onDensityChange}
            options={densityOptions}
            accessibilityLabel={t('apiKey.list.densityLabel')}
            compact
            testID="api-key-density"
          />
        </StyledPaginationSelectSlot>
      </StyledPaginationControl>

      <StyledPaginationNavButton
        type="button"
        onClick={() => onPageChange(page + 1)}
        disabled={page >= totalPages}
        aria-label={t('common.next')}
        title={t('common.next')}
        data-testid="api-key-page-next"
      >
        {'>'}
      </StyledPaginationNavButton>
    </StyledPaginationActions>
  ) : null;

  return (
    <StyledContainer role="main" aria-label={t('apiKey.list.title')}>
      {noticeMessage ? (
        <Snackbar
          visible={Boolean(noticeMessage)}
          message={noticeMessage}
          variant="success"
          position="bottom"
          onDismiss={onDismissNotice}
          testID="api-key-list-notice"
        />
      ) : null}

      <StyledContent>
        {!isTableMode ? searchBarSection : null}
        {!isTableMode ? filterBarSection : null}

        <Card
          variant="outlined"
          accessibilityLabel={t('apiKey.list.accessibilityLabel')}
          testID="api-key-list-card"
        >
          <StyledListBody
            role="region"
            aria-label={t('apiKey.list.accessibilityLabel')}
            data-testid="api-key-list"
            testID="api-key-list"
          >
            <StyledStateStack>
              {showError ? (
                <ErrorState
                  size={ErrorStateSizes.SMALL}
                  title={t('listScaffold.errorState.title')}
                  description={errorMessage}
                  action={retryAction}
                  testID="api-key-list-error"
                />
              ) : null}

              {showOffline ? (
                <OfflineState
                  size={OfflineStateSizes.SMALL}
                  title={t('shell.banners.offline.title')}
                  description={t('shell.banners.offline.message')}
                  action={retryAction}
                  testID="api-key-list-offline"
                />
              ) : null}

              {showOfflineBanner ? (
                <OfflineState
                  size={OfflineStateSizes.SMALL}
                  title={t('shell.banners.offline.title')}
                  description={t('shell.banners.offline.message')}
                  action={retryAction}
                  testID="api-key-list-offline-banner"
                />
              ) : null}
            </StyledStateStack>

            {isLoading ? (
              <LoadingSpinner
                accessibilityLabel={t('common.loading')}
                testID="api-key-list-loading"
              />
            ) : null}

            {!isTableMode && showEmpty ? emptyComponent : null}
            {!isTableMode && hasNoResults ? noResultsComponent : null}

            {showDesktopTable ? (
              <DataTable
                columns={tableColumns}
                rows={rows}
                getRowKey={(apiKeyItem, index) => (
                  resolveApiKeyId(apiKeyItem) || `api-key-${index}`
                )}
                rowDensity={density}
                sortField={sortField}
                sortDirection={sortDirection}
                onSort={onSort}
                renderRowActions={renderTableRowActions}
                rowActionsLabel={t('apiKey.list.columnActions')}
                onRowPress={handleTableRowPress}
                searchBar={searchBarSection}
                filterBar={filterBarSection}
                hasActiveFilters={hasActiveSearchOrFilter}
                statusContent={tableStatusContent}
                pagination={paginationContent}
                tableNavigation={tableNavigationContent}
                showDefaultEmptyRow={false}
                minWidth={920}
                testID="api-key-table"
              />
            ) : null}

            {showList && !isTableMode ? (
              <StyledList role="list">
                {rows.map((apiKeyItem, index) => {
                  const apiKeyId = resolveApiKeyId(apiKeyItem);
                  const itemKey = apiKeyId || `api-key-${index}`;
                  const title = resolveApiKeyName(apiKeyItem);
                  const subtitle = resolveMobileSubtitle(
                    t,
                    apiKeyItem,
                    resolveUserLabel,
                    resolveTenantLabel,
                    resolveStatusLabel
                  );

                  return (
                    <li key={itemKey} role="listitem">
                      <ListItem
                        title={title}
                        subtitle={subtitle}
                        onPress={apiKeyId ? () => onItemPress(apiKeyId) : undefined}
                        accessibilityLabel={t('apiKey.list.itemLabel', { name: title })}
                        testID={`api-key-item-${itemKey}`}
                      />
                    </li>
                  );
                })}
              </StyledList>
            ) : null}

            {!isTableMode && showList ? (
              <StyledPagination>
                <StyledPaginationInfo>
                  {t('apiKey.list.pageSummary', { page, totalPages, total: totalItems })}
                </StyledPaginationInfo>

                <StyledPaginationActions>
                  <StyledPaginationNavButton
                    type="button"
                    onClick={() => onPageChange(page - 1)}
                    disabled={page <= 1}
                    aria-label={t('common.previous')}
                    title={t('common.previous')}
                    data-testid="api-key-page-prev"
                  >
                    {'<'}
                  </StyledPaginationNavButton>

                  <StyledPaginationControl>
                    <StyledPaginationControlLabel>
                      {t('apiKey.list.pageSizeLabel')}
                    </StyledPaginationControlLabel>
                    <StyledPaginationSelectSlot>
                      <Select
                        value={String(pageSize)}
                        onValueChange={onPageSizeChange}
                        options={pageSizeOptions}
                        accessibilityLabel={t('apiKey.list.pageSizeLabel')}
                        compact
                        testID="api-key-page-size"
                      />
                    </StyledPaginationSelectSlot>
                  </StyledPaginationControl>

                  <StyledPaginationControl>
                    <StyledPaginationControlLabel>
                      {t('apiKey.list.densityLabel')}
                    </StyledPaginationControlLabel>
                    <StyledPaginationSelectSlot>
                      <Select
                        value={density}
                        onValueChange={onDensityChange}
                        options={densityOptions}
                        accessibilityLabel={t('apiKey.list.densityLabel')}
                        compact
                        testID="api-key-density"
                      />
                    </StyledPaginationSelectSlot>
                  </StyledPaginationControl>

                  <StyledPaginationNavButton
                    type="button"
                    onClick={() => onPageChange(page + 1)}
                    disabled={page >= totalPages}
                    aria-label={t('common.next')}
                    title={t('common.next')}
                    data-testid="api-key-page-next"
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
          accessibilityLabel={t('apiKey.list.tableSettings')}
          testID="api-key-table-settings-modal"
        >
          <StyledSettingsBody>
            <StyledSettingsSection>
              <StyledSettingsTitle>{t('apiKey.list.visibleColumns')}</StyledSettingsTitle>
              {columnOrder.map((column) => (
                <StyledColumnRow key={column}>
                  <Checkbox
                    checked={visibleColumns.includes(column)}
                    onChange={() => onToggleColumnVisibility(column)}
                    label={resolveColumnLabel(t, column)}
                    testID={`api-key-column-visible-${column}`}
                  />

                  <StyledColumnMoveControls>
                    <StyledMoveButton
                      type="button"
                      onClick={() => onMoveColumnLeft(column)}
                      aria-label={t('apiKey.list.moveColumnLeft', {
                        column: resolveColumnLabel(t, column),
                      })}
                      disabled={columnOrder.indexOf(column) === 0}
                      data-testid={`api-key-column-left-${column}`}
                    >
                      {'<'}
                    </StyledMoveButton>
                    <StyledMoveButton
                      type="button"
                      onClick={() => onMoveColumnRight(column)}
                      aria-label={t('apiKey.list.moveColumnRight', {
                        column: resolveColumnLabel(t, column),
                      })}
                      disabled={columnOrder.indexOf(column) === columnOrder.length - 1}
                      data-testid={`api-key-column-right-${column}`}
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
                data-testid="api-key-table-settings-reset"
              >
                {t('apiKey.list.resetTablePreferences')}
              </StyledFilterButton>
            </StyledSettingsActions>
          </StyledSettingsBody>
        </Modal>
      </StyledContent>
    </StyledContainer>
  );
};

export default ApiKeyListScreenWeb;