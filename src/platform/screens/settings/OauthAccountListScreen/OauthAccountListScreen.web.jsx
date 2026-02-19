/**
 * OauthAccountListScreen - Web
 * Desktop/tablet renders a customizable table; mobile web renders compact list items.
 */
import React, { useCallback, useEffect, useMemo, useState } from 'react';
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
import { formatDateTime } from '@utils';
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
} from './OauthAccountListScreen.web.styles';
import useOauthAccountListScreen from './useOauthAccountListScreen';

const TABLE_MODE_BREAKPOINT = 768;
const TABLE_COLUMN_LAYOUT = {
  provider: { width: 240, minWidth: 180, align: 'left' },
  user: { width: 280, minWidth: 200, align: 'left' },
  providerUser: { width: 260, minWidth: 200, align: 'left' },
  expires: { width: 220, minWidth: 180, align: 'left' },
};

const resolveOauthAccountId = (oauthAccountItem) => String(oauthAccountItem?.id ?? '').trim();

const resolveColumnLabel = (t, column) => {
  if (column === 'provider') return t('oauthAccount.list.columnProvider');
  if (column === 'user') return t('oauthAccount.list.columnUser');
  if (column === 'providerUser') return t('oauthAccount.list.columnProviderUser');
  if (column === 'expires') return t('oauthAccount.list.columnExpires');
  return column;
};

const resolveOauthAccountCell = (
  t,
  oauthAccountItem,
  column,
  locale,
  resolveProviderLabel,
  resolveUserLabel,
  resolveProviderUserLabel
) => {
  if (column === 'provider') return resolveProviderLabel(oauthAccountItem);
  if (column === 'user') return resolveUserLabel(oauthAccountItem);
  if (column === 'providerUser') return resolveProviderUserLabel(oauthAccountItem);
  if (column === 'expires') return formatDateTime(oauthAccountItem?.expires_at, locale) || t('common.notAvailable');
  return t('common.notAvailable');
};

const resolveMobileSubtitle = (
  t,
  locale,
  oauthAccountItem,
  resolveUserLabel,
  resolveProviderUserLabel
) => {
  const userValue = resolveUserLabel(oauthAccountItem);
  const providerUserValue = resolveProviderUserLabel(oauthAccountItem);
  const expiresValue = formatDateTime(oauthAccountItem?.expires_at, locale);
  const parts = [];

  if (userValue && userValue !== t('common.notAvailable')) {
    parts.push(`${t('oauthAccount.list.userLabel')}: ${userValue}`);
  }
  if (providerUserValue && providerUserValue !== t('common.notAvailable')) {
    parts.push(`${t('oauthAccount.list.providerUserLabel')}: ${providerUserValue}`);
  }
  if (expiresValue) {
    parts.push(`${t('oauthAccount.list.expiresLabel')}: ${expiresValue}`);
  }

  return parts.length > 0 ? parts.join(' - ') : undefined;
};

const OauthAccountListScreenWeb = () => {
  const { t, locale } = useI18n();
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
    resolveProviderLabel,
    resolveUserLabel,
    resolveProviderUserLabel,
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
  } = useOauthAccountListScreen();

  const isTableMode = Number(width) >= TABLE_MODE_BREAKPOINT;
  const rows = pagedItems;
  const [isFilterPanelCollapsed, setIsFilterPanelCollapsed] = useState(() => isTableMode);

  useEffect(() => {
    setIsFilterPanelCollapsed(Boolean(isTableMode));
  }, [isTableMode]);

  const showError = !isLoading && hasError && !isOffline;
  const showOffline = !isLoading && isOffline && rows.length === 0;
  const showOfflineBanner = !isLoading && isOffline && rows.length > 0;
  const showEmpty = !isLoading && !showError && !showOffline && !hasNoResults && totalItems === 0;
  const showList = !isLoading && !showError && !showOffline && rows.length > 0;
  const showDesktopTable = isTableMode && !showError && !showOffline;

  const emptyComponent = (
    <EmptyState
      title={t('oauthAccount.list.emptyTitle')}
      description={t('oauthAccount.list.emptyMessage')}
      action={
        onAdd ? (
          <StyledAddButton
            type="button"
            onClick={onAdd}
            onPress={onAdd}
            accessibilityLabel={t('oauthAccount.list.addLabel')}
            accessibilityHint={t('oauthAccount.list.addHint')}
            testID="oauth-account-list-empty-add"
          >
            <Icon glyph="+" size="xs" decorative />
            <StyledAddLabel>{t('oauthAccount.list.addLabel')}</StyledAddLabel>
          </StyledAddButton>
        ) : undefined
      }
      testID="oauth-account-list-empty-state"
    />
  );

  const noResultsComponent = (
    <EmptyState
      title={t('oauthAccount.list.noResultsTitle')}
      description={t('oauthAccount.list.noResultsMessage')}
      action={
        <StyledFilterButton
          type="button"
          onClick={onClearSearchAndFilters}
          onPress={onClearSearchAndFilters}
          testID="oauth-account-list-clear-search"
          data-testid="oauth-account-list-clear-search"
          aria-label={t('oauthAccount.list.clearSearchAndFilters')}
        >
          {t('oauthAccount.list.clearSearchAndFilters')}
        </StyledFilterButton>
      }
      testID="oauth-account-list-no-results"
    />
  );

  const retryAction = onRetry ? (
    <Button
      variant="surface"
      size="small"
      onPress={onRetry}
      accessibilityLabel={t('common.retry')}
      accessibilityHint={t('common.retryHint')}
      testID="oauth-account-list-retry"
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
      sortLabel: t('oauthAccount.list.sortBy', { field: resolveColumnLabel(t, column) }),
      width: columnLayout.width,
      minWidth: columnLayout.minWidth,
      align: columnLayout.align,
      renderCell: (oauthAccountItem) => resolveOauthAccountCell(
        t,
        oauthAccountItem,
        column,
        locale,
        resolveProviderLabel,
        resolveUserLabel,
        resolveProviderUserLabel
      ),
      getCellTitle: (oauthAccountItem) => resolveOauthAccountCell(
        t,
        oauthAccountItem,
        column,
        locale,
        resolveProviderLabel,
        resolveUserLabel,
        resolveProviderUserLabel
      ),
    };
  }), [visibleColumns, t, locale, resolveProviderLabel, resolveUserLabel, resolveProviderUserLabel]);

  const handleTableRowPress = useCallback((oauthAccountItem) => {
    const oauthAccountId = resolveOauthAccountId(oauthAccountItem);
    if (!oauthAccountId) return;
    onItemPress(oauthAccountId);
  }, [onItemPress]);

  const renderTableRowActions = useCallback((oauthAccountItem) => {
    const oauthAccountId = resolveOauthAccountId(oauthAccountItem);
    if (!oauthAccountId) return null;

    return (
      <StyledRowActions>
        <StyledActionButton
          type="button"
          onClick={(event) => {
            event.stopPropagation();
            onItemPress(oauthAccountId);
          }}
          data-testid={`oauth-account-view-${oauthAccountId}`}
        >
          {t('common.view')}
        </StyledActionButton>

        {onDelete ? (
          <StyledDangerActionButton
            type="button"
            onClick={(event) => onDelete(oauthAccountId, event)}
            data-testid={`oauth-account-delete-${oauthAccountId}`}
          >
            {t('common.remove')}
          </StyledDangerActionButton>
        ) : null}
      </StyledRowActions>
    );
  }, [onDelete, onItemPress, t]);

  const searchBarSection = (
    <StyledToolbar data-testid="oauth-account-list-toolbar" testID="oauth-account-list-toolbar">
      <StyledSearchSlot>
        <TextField
          value={search}
          onChange={(event) => onSearch(event.target.value)}
          placeholder={t('oauthAccount.list.searchPlaceholder')}
          accessibilityLabel={t('oauthAccount.list.searchLabel')}
          density="compact"
          type="search"
          testID="oauth-account-list-search"
        />
      </StyledSearchSlot>

      <StyledScopeSlot>
        <Select
          value={searchScope}
          onValueChange={onSearchScopeChange}
          options={searchScopeOptions}
          label={t('oauthAccount.list.searchScopeLabel')}
          compact
          testID="oauth-account-list-search-scope"
        />
      </StyledScopeSlot>

      <StyledToolbarActions>
        {isTableMode ? (
          <StyledTableSettingsButton
            type="button"
            onClick={onOpenTableSettings}
            aria-label={t('oauthAccount.list.tableSettings')}
            data-testid="oauth-account-table-settings"
          >
            {t('oauthAccount.list.tableSettings')}
          </StyledTableSettingsButton>
        ) : null}

        {onAdd ? (
          <StyledAddButton
            type="button"
            onClick={onAdd}
            onPress={onAdd}
            accessibilityLabel={t('oauthAccount.list.addLabel')}
            accessibilityHint={t('oauthAccount.list.addHint')}
            testID="oauth-account-list-add"
          >
            <Icon glyph="+" size="xs" decorative />
            <StyledAddLabel>{t('oauthAccount.list.addLabel')}</StyledAddLabel>
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
        data-testid="oauth-account-filter-toggle"
      >
        {t('common.filters')}
      </StyledFilterButton>

      {!isFilterPanelCollapsed ? (
        <StyledFilterBody data-testid="oauth-account-filter-body">
          <Select
            value={filterLogic}
            onValueChange={onFilterLogicChange}
            options={filterLogicOptions}
            label={t('oauthAccount.list.filterLogicLabel')}
            accessibilityLabel={t('oauthAccount.list.filterLogicLabel')}
            compact
            testID="oauth-account-filter-logic"
          />

          {filters.map((filter, index) => {
            const operatorOptions = resolveFilterOperatorOptions(filter.field);
            return (
              <StyledFilterRow key={filter.id}>
                <Select
                  value={filter.field}
                  onValueChange={(value) => onFilterFieldChange(filter.id, value)}
                  options={filterFieldOptions}
                  label={t('oauthAccount.list.filterFieldLabel')}
                  compact
                  testID={`oauth-account-filter-field-${index}`}
                />

                <Select
                  value={filter.operator}
                  onValueChange={(value) => onFilterOperatorChange(filter.id, value)}
                  options={operatorOptions}
                  label={t('oauthAccount.list.filterOperatorLabel')}
                  compact
                  testID={`oauth-account-filter-operator-${index}`}
                />

                <TextField
                  value={filter.value}
                  onChange={(event) => onFilterValueChange(filter.id, event.target.value)}
                  label={t('oauthAccount.list.filterValueLabel')}
                  placeholder={t('oauthAccount.list.filterValuePlaceholder')}
                  density="compact"
                  testID={`oauth-account-filter-value-${index}`}
                />

                <StyledFilterRowActions>
                  <StyledFilterButton
                    type="button"
                    onClick={() => onRemoveFilter(filter.id)}
                    aria-label={t('oauthAccount.list.removeFilter')}
                    testID={`oauth-account-filter-remove-${index}`}
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
              testID="oauth-account-filter-add"
            >
              {t('oauthAccount.list.addFilter')}
            </StyledFilterButton>
            <StyledFilterButton
              type="button"
              onClick={onClearSearchAndFilters}
              testID="oauth-account-filter-clear"
            >
              {t('oauthAccount.list.clearSearchAndFilters')}
            </StyledFilterButton>
          </StyledFilterActions>
        </StyledFilterBody>
      ) : null}
    </StyledFilterPanel>
  );

  const tableStatusContent = showEmpty ? emptyComponent : (hasNoResults ? noResultsComponent : null);

  const paginationContent = showList ? (
    <StyledPaginationInfo>
      {t('oauthAccount.list.pageSummary', { page, totalPages, total: totalItems })}
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
        data-testid="oauth-account-page-prev"
      >
        {'<'}
      </StyledPaginationNavButton>

      <StyledPaginationControl>
        <StyledPaginationControlLabel>
          {t('oauthAccount.list.pageSizeLabel')}
        </StyledPaginationControlLabel>
        <StyledPaginationSelectSlot>
          <Select
            value={String(pageSize)}
            onValueChange={onPageSizeChange}
            options={pageSizeOptions}
            accessibilityLabel={t('oauthAccount.list.pageSizeLabel')}
            compact
            testID="oauth-account-page-size"
          />
        </StyledPaginationSelectSlot>
      </StyledPaginationControl>

      <StyledPaginationControl>
        <StyledPaginationControlLabel>
          {t('oauthAccount.list.densityLabel')}
        </StyledPaginationControlLabel>
        <StyledPaginationSelectSlot>
          <Select
            value={density}
            onValueChange={onDensityChange}
            options={densityOptions}
            accessibilityLabel={t('oauthAccount.list.densityLabel')}
            compact
            testID="oauth-account-density"
          />
        </StyledPaginationSelectSlot>
      </StyledPaginationControl>

      <StyledPaginationNavButton
        type="button"
        onClick={() => onPageChange(page + 1)}
        disabled={page >= totalPages}
        aria-label={t('common.next')}
        title={t('common.next')}
        data-testid="oauth-account-page-next"
      >
        {'>'}
      </StyledPaginationNavButton>
    </StyledPaginationActions>
  ) : null;

  return (
    <StyledContainer role="main" aria-label={t('oauthAccount.list.title')}>
      {noticeMessage ? (
        <Snackbar
          visible={Boolean(noticeMessage)}
          message={noticeMessage}
          variant="success"
          position="bottom"
          onDismiss={onDismissNotice}
          testID="oauth-account-list-notice"
        />
      ) : null}

      <StyledContent>
        {!isTableMode ? searchBarSection : null}
        {!isTableMode ? filterBarSection : null}

        <Card
          variant="outlined"
          accessibilityLabel={t('oauthAccount.list.accessibilityLabel')}
          testID="oauth-account-list-card"
        >
          <StyledListBody
            role="region"
            aria-label={t('oauthAccount.list.accessibilityLabel')}
            data-testid="oauth-account-list"
            testID="oauth-account-list"
          >
            <StyledStateStack>
              {showError ? (
                <ErrorState
                  size={ErrorStateSizes.SMALL}
                  title={t('listScaffold.errorState.title')}
                  description={errorMessage}
                  action={retryAction}
                  testID="oauth-account-list-error"
                />
              ) : null}

              {showOffline ? (
                <OfflineState
                  size={OfflineStateSizes.SMALL}
                  title={t('shell.banners.offline.title')}
                  description={t('shell.banners.offline.message')}
                  action={retryAction}
                  testID="oauth-account-list-offline"
                />
              ) : null}

              {showOfflineBanner ? (
                <OfflineState
                  size={OfflineStateSizes.SMALL}
                  title={t('shell.banners.offline.title')}
                  description={t('shell.banners.offline.message')}
                  action={retryAction}
                  testID="oauth-account-list-offline-banner"
                />
              ) : null}
            </StyledStateStack>

            {isLoading ? (
              <LoadingSpinner
                accessibilityLabel={t('common.loading')}
                testID="oauth-account-list-loading"
              />
            ) : null}

            {!isTableMode && showEmpty ? emptyComponent : null}
            {!isTableMode && hasNoResults ? noResultsComponent : null}

            {showDesktopTable ? (
              <DataTable
                columns={tableColumns}
                rows={rows}
                getRowKey={(oauthAccountItem, index) => (
                  resolveOauthAccountId(oauthAccountItem) || `oauth-account-${index}`
                )}
                rowDensity={density}
                sortField={sortField}
                sortDirection={sortDirection}
                onSort={onSort}
                renderRowActions={renderTableRowActions}
                rowActionsLabel={t('oauthAccount.list.columnActions')}
                onRowPress={handleTableRowPress}
                searchBar={searchBarSection}
                filterBar={filterBarSection}
                hasActiveFilters={hasActiveSearchOrFilter}
                statusContent={tableStatusContent}
                pagination={paginationContent}
                tableNavigation={tableNavigationContent}
                showDefaultEmptyRow={false}
                minWidth={940}
                testID="oauth-account-table"
              />
            ) : null}

            {showList && !isTableMode ? (
              <StyledList role="list">
                {rows.map((oauthAccountItem, index) => {
                  const oauthAccountId = resolveOauthAccountId(oauthAccountItem);
                  const itemKey = oauthAccountId || `oauth-account-${index}`;
                  const title = resolveProviderLabel(oauthAccountItem);
                  const subtitle = resolveMobileSubtitle(
                    t,
                    locale,
                    oauthAccountItem,
                    resolveUserLabel,
                    resolveProviderUserLabel
                  );

                  return (
                    <li key={itemKey} role="listitem">
                      <ListItem
                        title={title}
                        subtitle={subtitle}
                        onPress={oauthAccountId ? () => onItemPress(oauthAccountId) : undefined}
                        actions={onDelete && oauthAccountId ? (
                          <Button
                            variant="surface"
                            size="small"
                            onPress={(event) => onDelete(oauthAccountId, event)}
                            accessibilityLabel={t('oauthAccount.list.delete')}
                            accessibilityHint={t('oauthAccount.list.deleteHint')}
                            testID={`oauth-account-delete-${itemKey}`}
                          >
                            {t('common.remove')}
                          </Button>
                        ) : undefined}
                        accessibilityLabel={t('oauthAccount.list.itemLabel', { name: title })}
                        testID={`oauth-account-item-${itemKey}`}
                      />
                    </li>
                  );
                })}
              </StyledList>
            ) : null}

            {!isTableMode && showList ? (
              <StyledPagination>
                <StyledPaginationInfo>
                  {t('oauthAccount.list.pageSummary', { page, totalPages, total: totalItems })}
                </StyledPaginationInfo>

                <StyledPaginationActions>
                  <StyledPaginationNavButton
                    type="button"
                    onClick={() => onPageChange(page - 1)}
                    disabled={page <= 1}
                    aria-label={t('common.previous')}
                    title={t('common.previous')}
                    data-testid="oauth-account-page-prev"
                  >
                    {'<'}
                  </StyledPaginationNavButton>

                  <StyledPaginationControl>
                    <StyledPaginationControlLabel>
                      {t('oauthAccount.list.pageSizeLabel')}
                    </StyledPaginationControlLabel>
                    <StyledPaginationSelectSlot>
                      <Select
                        value={String(pageSize)}
                        onValueChange={onPageSizeChange}
                        options={pageSizeOptions}
                        accessibilityLabel={t('oauthAccount.list.pageSizeLabel')}
                        compact
                        testID="oauth-account-page-size"
                      />
                    </StyledPaginationSelectSlot>
                  </StyledPaginationControl>

                  <StyledPaginationControl>
                    <StyledPaginationControlLabel>
                      {t('oauthAccount.list.densityLabel')}
                    </StyledPaginationControlLabel>
                    <StyledPaginationSelectSlot>
                      <Select
                        value={density}
                        onValueChange={onDensityChange}
                        options={densityOptions}
                        accessibilityLabel={t('oauthAccount.list.densityLabel')}
                        compact
                        testID="oauth-account-density"
                      />
                    </StyledPaginationSelectSlot>
                  </StyledPaginationControl>

                  <StyledPaginationNavButton
                    type="button"
                    onClick={() => onPageChange(page + 1)}
                    disabled={page >= totalPages}
                    aria-label={t('common.next')}
                    title={t('common.next')}
                    data-testid="oauth-account-page-next"
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
          accessibilityLabel={t('oauthAccount.list.tableSettings')}
          testID="oauth-account-table-settings-modal"
        >
          <StyledSettingsBody>
            <StyledSettingsSection>
              <StyledSettingsTitle>{t('oauthAccount.list.visibleColumns')}</StyledSettingsTitle>
              {columnOrder.map((column) => (
                <StyledColumnRow key={column}>
                  <Checkbox
                    checked={visibleColumns.includes(column)}
                    onChange={() => onToggleColumnVisibility(column)}
                    label={resolveColumnLabel(t, column)}
                    testID={`oauth-account-column-visible-${column}`}
                  />

                  <StyledColumnMoveControls>
                    <StyledMoveButton
                      type="button"
                      onClick={() => onMoveColumnLeft(column)}
                      aria-label={t('oauthAccount.list.moveColumnLeft', {
                        column: resolveColumnLabel(t, column),
                      })}
                      disabled={columnOrder.indexOf(column) === 0}
                      data-testid={`oauth-account-column-left-${column}`}
                    >
                      {'<'}
                    </StyledMoveButton>
                    <StyledMoveButton
                      type="button"
                      onClick={() => onMoveColumnRight(column)}
                      aria-label={t('oauthAccount.list.moveColumnRight', {
                        column: resolveColumnLabel(t, column),
                      })}
                      disabled={columnOrder.indexOf(column) === columnOrder.length - 1}
                      data-testid={`oauth-account-column-right-${column}`}
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
                data-testid="oauth-account-table-settings-reset"
              >
                {t('oauthAccount.list.resetTablePreferences')}
              </StyledFilterButton>
            </StyledSettingsActions>
          </StyledSettingsBody>
        </Modal>
      </StyledContent>
    </StyledContainer>
  );
};

export default OauthAccountListScreenWeb;

