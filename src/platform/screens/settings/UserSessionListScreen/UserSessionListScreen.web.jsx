/**
 * UserSessionListScreen - Web
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
} from './UserSessionListScreen.web.styles';
import useUserSessionListScreen from './useUserSessionListScreen';

const TABLE_MODE_BREAKPOINT = 768;
const TABLE_COLUMN_LAYOUT = {
  session: { width: 300, minWidth: 220, align: 'left' },
  status: { width: 160, minWidth: 140, align: 'left' },
  started: { width: 200, minWidth: 160, align: 'left' },
  expires: { width: 200, minWidth: 160, align: 'left' },
};

const resolveSessionId = (sessionItem) => String(sessionItem?.id ?? '').trim();

const resolveColumnLabel = (t, column) => {
  if (column === 'session') return t('userSession.list.columnSession');
  if (column === 'status') return t('userSession.list.columnStatus');
  if (column === 'started') return t('userSession.list.columnStarted');
  if (column === 'expires') return t('userSession.list.columnExpires');
  return column;
};

const resolveSessionCell = (
  t,
  sessionItem,
  column,
  locale,
  resolveSessionLabel,
  resolveStatusLabel
) => {
  if (column === 'session') return resolveSessionLabel(sessionItem);
  if (column === 'status') return resolveStatusLabel(sessionItem);
  if (column === 'started') return formatDateTime(sessionItem?.created_at, locale) || t('common.notAvailable');
  if (column === 'expires') return formatDateTime(sessionItem?.expires_at, locale) || t('common.notAvailable');
  return t('common.notAvailable');
};

const resolveMobileSubtitle = (
  t,
  locale,
  sessionItem,
  resolveStatusLabel
) => {
  const statusValue = resolveStatusLabel(sessionItem);
  const startedValue = formatDateTime(sessionItem?.created_at, locale);
  const parts = [];

  if (statusValue && statusValue !== t('common.notAvailable')) {
    parts.push(`${t('userSession.list.statusLabel')}: ${statusValue}`);
  }
  if (startedValue) {
    parts.push(`${t('userSession.list.startedLabel')}: ${startedValue}`);
  }

  return parts.length > 0 ? parts.join(' - ') : undefined;
};

const UserSessionListScreenWeb = () => {
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
    resolveSessionLabel,
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
  } = useUserSessionListScreen();

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
      title={t('userSession.list.emptyTitle')}
      description={t('userSession.list.emptyMessage')}
      testID="user-session-list-empty-state"
    />
  );

  const noResultsComponent = (
    <EmptyState
      title={t('userSession.list.noResultsTitle')}
      description={t('userSession.list.noResultsMessage')}
      action={
        <StyledFilterButton
          type="button"
          onClick={onClearSearchAndFilters}
          onPress={onClearSearchAndFilters}
          testID="user-session-list-clear-search"
          data-testid="user-session-list-clear-search"
          aria-label={t('userSession.list.clearSearchAndFilters')}
        >
          {t('userSession.list.clearSearchAndFilters')}
        </StyledFilterButton>
      }
      testID="user-session-list-no-results"
    />
  );

  const retryAction = onRetry ? (
    <Button
      variant="surface"
      size="small"
      onPress={onRetry}
      accessibilityLabel={t('common.retry')}
      accessibilityHint={t('common.retryHint')}
      testID="user-session-list-retry"
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
      sortLabel: t('userSession.list.sortBy', { field: resolveColumnLabel(t, column) }),
      width: columnLayout.width,
      minWidth: columnLayout.minWidth,
      align: columnLayout.align,
      renderCell: (sessionItem) => resolveSessionCell(
        t,
        sessionItem,
        column,
        locale,
        resolveSessionLabel,
        resolveStatusLabel
      ),
      getCellTitle: (sessionItem) => resolveSessionCell(
        t,
        sessionItem,
        column,
        locale,
        resolveSessionLabel,
        resolveStatusLabel
      ),
    };
  }), [visibleColumns, t, locale, resolveSessionLabel, resolveStatusLabel]);

  const handleTableRowPress = useCallback((sessionItem) => {
    const sessionId = resolveSessionId(sessionItem);
    if (!sessionId) return;
    onItemPress(sessionId);
  }, [onItemPress]);

  const renderTableRowActions = useCallback((sessionItem) => {
    const sessionId = resolveSessionId(sessionItem);
    if (!sessionId) return null;

    return (
      <StyledRowActions>
        <StyledActionButton
          type="button"
          onClick={(event) => {
            event.stopPropagation();
            onItemPress(sessionId);
          }}
          data-testid={`user-session-view-${sessionId}`}
        >
          {t('common.view')}
        </StyledActionButton>
      </StyledRowActions>
    );
  }, [onItemPress, t]);

  const searchBarSection = (
    <StyledToolbar data-testid="user-session-list-toolbar" testID="user-session-list-toolbar">
      <StyledSearchSlot>
        <TextField
          value={search}
          onChange={(event) => onSearch(event.target.value)}
          placeholder={t('userSession.list.searchPlaceholder')}
          accessibilityLabel={t('userSession.list.searchLabel')}
          density="compact"
          type="search"
          testID="user-session-list-search"
        />
      </StyledSearchSlot>

      <StyledScopeSlot>
        <Select
          value={searchScope}
          onValueChange={onSearchScopeChange}
          options={searchScopeOptions}
          label={t('userSession.list.searchScopeLabel')}
          compact
          testID="user-session-list-search-scope"
        />
      </StyledScopeSlot>

      <StyledToolbarActions>
        {isTableMode ? (
          <StyledTableSettingsButton
            type="button"
            onClick={onOpenTableSettings}
            aria-label={t('userSession.list.tableSettings')}
            data-testid="user-session-table-settings"
          >
            {t('userSession.list.tableSettings')}
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
        data-testid="user-session-filter-toggle"
      >
        {t('common.filters')}
      </StyledFilterButton>

      {!isFilterPanelCollapsed ? (
        <StyledFilterBody data-testid="user-session-filter-body">
          <Select
            value={filterLogic}
            onValueChange={onFilterLogicChange}
            options={filterLogicOptions}
            label={t('userSession.list.filterLogicLabel')}
            accessibilityLabel={t('userSession.list.filterLogicLabel')}
            compact
            testID="user-session-filter-logic"
          />

          {filters.map((filter, index) => {
            const operatorOptions = resolveFilterOperatorOptions(filter.field);
            return (
              <StyledFilterRow key={filter.id}>
                <Select
                  value={filter.field}
                  onValueChange={(value) => onFilterFieldChange(filter.id, value)}
                  options={filterFieldOptions}
                  label={t('userSession.list.filterFieldLabel')}
                  compact
                  testID={`user-session-filter-field-${index}`}
                />

                <Select
                  value={filter.operator}
                  onValueChange={(value) => onFilterOperatorChange(filter.id, value)}
                  options={operatorOptions}
                  label={t('userSession.list.filterOperatorLabel')}
                  compact
                  testID={`user-session-filter-operator-${index}`}
                />

                <TextField
                  value={filter.value}
                  onChange={(event) => onFilterValueChange(filter.id, event.target.value)}
                  label={t('userSession.list.filterValueLabel')}
                  placeholder={t('userSession.list.filterValuePlaceholder')}
                  density="compact"
                  testID={`user-session-filter-value-${index}`}
                />

                <StyledFilterRowActions>
                  <StyledFilterButton
                    type="button"
                    onClick={() => onRemoveFilter(filter.id)}
                    aria-label={t('userSession.list.removeFilter')}
                    testID={`user-session-filter-remove-${index}`}
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
              testID="user-session-filter-add"
            >
              {t('userSession.list.addFilter')}
            </StyledFilterButton>
            <StyledFilterButton
              type="button"
              onClick={onClearSearchAndFilters}
              testID="user-session-filter-clear"
            >
              {t('userSession.list.clearSearchAndFilters')}
            </StyledFilterButton>
          </StyledFilterActions>
        </StyledFilterBody>
      ) : null}
    </StyledFilterPanel>
  );

  const tableStatusContent = showEmpty ? emptyComponent : (hasNoResults ? noResultsComponent : null);

  const paginationContent = showList ? (
    <StyledPaginationInfo>
      {t('userSession.list.pageSummary', { page, totalPages, total: totalItems })}
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
        data-testid="user-session-page-prev"
      >
        {'<'}
      </StyledPaginationNavButton>

      <StyledPaginationControl>
        <StyledPaginationControlLabel>
          {t('userSession.list.pageSizeLabel')}
        </StyledPaginationControlLabel>
        <StyledPaginationSelectSlot>
          <Select
            value={String(pageSize)}
            onValueChange={onPageSizeChange}
            options={pageSizeOptions}
            accessibilityLabel={t('userSession.list.pageSizeLabel')}
            compact
            testID="user-session-page-size"
          />
        </StyledPaginationSelectSlot>
      </StyledPaginationControl>

      <StyledPaginationControl>
        <StyledPaginationControlLabel>
          {t('userSession.list.densityLabel')}
        </StyledPaginationControlLabel>
        <StyledPaginationSelectSlot>
          <Select
            value={density}
            onValueChange={onDensityChange}
            options={densityOptions}
            accessibilityLabel={t('userSession.list.densityLabel')}
            compact
            testID="user-session-density"
          />
        </StyledPaginationSelectSlot>
      </StyledPaginationControl>

      <StyledPaginationNavButton
        type="button"
        onClick={() => onPageChange(page + 1)}
        disabled={page >= totalPages}
        aria-label={t('common.next')}
        title={t('common.next')}
        data-testid="user-session-page-next"
      >
        {'>'}
      </StyledPaginationNavButton>
    </StyledPaginationActions>
  ) : null;

  return (
    <StyledContainer role="main" aria-label={t('userSession.list.title')}>
      {noticeMessage ? (
        <Snackbar
          visible={Boolean(noticeMessage)}
          message={noticeMessage}
          variant="success"
          position="bottom"
          onDismiss={onDismissNotice}
          testID="user-session-list-notice"
        />
      ) : null}

      <StyledContent>
        {!isTableMode ? searchBarSection : null}
        {!isTableMode ? filterBarSection : null}

        <Card
          variant="outlined"
          accessibilityLabel={t('userSession.list.accessibilityLabel')}
          testID="user-session-list-card"
        >
          <StyledListBody
            role="region"
            aria-label={t('userSession.list.accessibilityLabel')}
            data-testid="user-session-list"
            testID="user-session-list"
          >
            <StyledStateStack>
              {showError ? (
                <ErrorState
                  size={ErrorStateSizes.SMALL}
                  title={t('listScaffold.errorState.title')}
                  description={errorMessage}
                  action={retryAction}
                  testID="user-session-list-error"
                />
              ) : null}

              {showOffline ? (
                <OfflineState
                  size={OfflineStateSizes.SMALL}
                  title={t('shell.banners.offline.title')}
                  description={t('shell.banners.offline.message')}
                  action={retryAction}
                  testID="user-session-list-offline"
                />
              ) : null}

              {showOfflineBanner ? (
                <OfflineState
                  size={OfflineStateSizes.SMALL}
                  title={t('shell.banners.offline.title')}
                  description={t('shell.banners.offline.message')}
                  action={retryAction}
                  testID="user-session-list-offline-banner"
                />
              ) : null}
            </StyledStateStack>

            {isLoading ? (
              <LoadingSpinner
                accessibilityLabel={t('common.loading')}
                testID="user-session-list-loading"
              />
            ) : null}

            {!isTableMode && showEmpty ? emptyComponent : null}
            {!isTableMode && hasNoResults ? noResultsComponent : null}

            {showDesktopTable ? (
              <DataTable
                columns={tableColumns}
                rows={rows}
                getRowKey={(sessionItem, index) => (
                  resolveSessionId(sessionItem) || `user-session-${index}`
                )}
                rowDensity={density}
                sortField={sortField}
                sortDirection={sortDirection}
                onSort={onSort}
                renderRowActions={renderTableRowActions}
                rowActionsLabel={t('userSession.list.columnActions')}
                onRowPress={handleTableRowPress}
                searchBar={searchBarSection}
                filterBar={filterBarSection}
                hasActiveFilters={hasActiveSearchOrFilter}
                statusContent={tableStatusContent}
                pagination={paginationContent}
                tableNavigation={tableNavigationContent}
                showDefaultEmptyRow={false}
                minWidth={920}
                testID="user-session-table"
              />
            ) : null}

            {showList && !isTableMode ? (
              <StyledList role="list">
                {rows.map((sessionItem, index) => {
                  const sessionId = resolveSessionId(sessionItem);
                  const itemKey = sessionId || `user-session-${index}`;
                  const title = resolveSessionLabel(sessionItem);
                  const subtitle = resolveMobileSubtitle(
                    t,
                    locale,
                    sessionItem,
                    resolveStatusLabel
                  );

                  return (
                    <li key={itemKey} role="listitem">
                      <ListItem
                        title={title}
                        subtitle={subtitle}
                        onPress={sessionId ? () => onItemPress(sessionId) : undefined}
                        accessibilityLabel={t('userSession.list.itemLabel', { name: title })}
                        testID={`user-session-item-${itemKey}`}
                      />
                    </li>
                  );
                })}
              </StyledList>
            ) : null}

            {!isTableMode && showList ? (
              <StyledPagination>
                <StyledPaginationInfo>
                  {t('userSession.list.pageSummary', { page, totalPages, total: totalItems })}
                </StyledPaginationInfo>

                <StyledPaginationActions>
                  <StyledPaginationNavButton
                    type="button"
                    onClick={() => onPageChange(page - 1)}
                    disabled={page <= 1}
                    aria-label={t('common.previous')}
                    title={t('common.previous')}
                    data-testid="user-session-page-prev"
                  >
                    {'<'}
                  </StyledPaginationNavButton>

                  <StyledPaginationControl>
                    <StyledPaginationControlLabel>
                      {t('userSession.list.pageSizeLabel')}
                    </StyledPaginationControlLabel>
                    <StyledPaginationSelectSlot>
                      <Select
                        value={String(pageSize)}
                        onValueChange={onPageSizeChange}
                        options={pageSizeOptions}
                        accessibilityLabel={t('userSession.list.pageSizeLabel')}
                        compact
                        testID="user-session-page-size"
                      />
                    </StyledPaginationSelectSlot>
                  </StyledPaginationControl>

                  <StyledPaginationControl>
                    <StyledPaginationControlLabel>
                      {t('userSession.list.densityLabel')}
                    </StyledPaginationControlLabel>
                    <StyledPaginationSelectSlot>
                      <Select
                        value={density}
                        onValueChange={onDensityChange}
                        options={densityOptions}
                        accessibilityLabel={t('userSession.list.densityLabel')}
                        compact
                        testID="user-session-density"
                      />
                    </StyledPaginationSelectSlot>
                  </StyledPaginationControl>

                  <StyledPaginationNavButton
                    type="button"
                    onClick={() => onPageChange(page + 1)}
                    disabled={page >= totalPages}
                    aria-label={t('common.next')}
                    title={t('common.next')}
                    data-testid="user-session-page-next"
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
          accessibilityLabel={t('userSession.list.tableSettings')}
          testID="user-session-table-settings-modal"
        >
          <StyledSettingsBody>
            <StyledSettingsSection>
              <StyledSettingsTitle>{t('userSession.list.visibleColumns')}</StyledSettingsTitle>
              {columnOrder.map((column) => (
                <StyledColumnRow key={column}>
                  <Checkbox
                    checked={visibleColumns.includes(column)}
                    onChange={() => onToggleColumnVisibility(column)}
                    label={resolveColumnLabel(t, column)}
                    testID={`user-session-column-visible-${column}`}
                  />

                  <StyledColumnMoveControls>
                    <StyledMoveButton
                      type="button"
                      onClick={() => onMoveColumnLeft(column)}
                      aria-label={t('userSession.list.moveColumnLeft', {
                        column: resolveColumnLabel(t, column),
                      })}
                      disabled={columnOrder.indexOf(column) === 0}
                      data-testid={`user-session-column-left-${column}`}
                    >
                      {'<'}
                    </StyledMoveButton>
                    <StyledMoveButton
                      type="button"
                      onClick={() => onMoveColumnRight(column)}
                      aria-label={t('userSession.list.moveColumnRight', {
                        column: resolveColumnLabel(t, column),
                      })}
                      disabled={columnOrder.indexOf(column) === columnOrder.length - 1}
                      data-testid={`user-session-column-right-${column}`}
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
                data-testid="user-session-table-settings-reset"
              >
                {t('userSession.list.resetTablePreferences')}
              </StyledFilterButton>
            </StyledSettingsActions>
          </StyledSettingsBody>
        </Modal>
      </StyledContent>
    </StyledContainer>
  );
};

export default UserSessionListScreenWeb;


