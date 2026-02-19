/**
 * WardListScreen - Web
 * Desktop/tablet renders a customizable table; mobile web renders compact cards.
 */
import React, { useCallback, useEffect, useMemo, useState } from 'react';
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
  StyledBulkActions,
  StyledBulkBar,
  StyledBulkInfo,
  StyledColumnMoveControls,
  StyledColumnRow,
  StyledContainer,
  StyledContent,
  StyledDangerActionButton,
  StyledControlLabel,
  StyledFilterActions,
  StyledFilterBody,
  StyledFilterButton,
  StyledFilterHeader,
  StyledFilterPanel,
  StyledFilterRowActions,
  StyledFilterRow,
  StyledFilterChevron,
  StyledFilterTitle,
  StyledFilterToggleButton,
  StyledListBody,
  StyledMobileList,
  StyledPrimaryCellText,
  StyledMoveButton,
  StyledPagination,
  StyledPaginationActions,
  StyledPaginationControl,
  StyledPaginationControlLabel,
  StyledPaginationInfo,
  StyledPaginationNavButton,
  StyledPaginationSelectSlot,
  StyledRowActions,
  StyledCodeCellText,
  StyledScopeSlot,
  StyledSearchSlot,
  StyledSettingsActions,
  StyledSettingsBody,
  StyledSettingsSection,
  StyledSettingsTitle,
  StyledStateStack,
  StyledStatusBadge,
  StyledTableSettingsButton,
  StyledToolbar,
  StyledToolbarActions,
} from './WardListScreen.web.styles';
import useWardListScreen from './useWardListScreen';

const resolveColumnLabel = (t, column) => {
  if (column === 'name') return t('ward.list.columnName');
  if (column === 'tenant') return t('ward.list.columnTenant');
  if (column === 'facility') return t('ward.list.columnFacility');
  if (column === 'type') return t('ward.list.columnType');
  if (column === 'active') return t('ward.list.columnActive');
  return column;
};

const TABLE_COLUMN_LAYOUT = {
  name: { width: 260, minWidth: 220, align: 'left' },
  tenant: { width: 210, minWidth: 170, align: 'left' },
  facility: { width: 200, minWidth: 170, align: 'left' },
  type: { width: 180, minWidth: 150, align: 'left' },
  active: { width: 130, minWidth: 112, align: 'center', truncate: false },
};

const resolveActiveMeta = (t, activeValue) => {
  if (activeValue === 'active') {
    return { label: t('common.on'), tone: 'success' };
  }
  if (activeValue === 'inactive') {
    return { label: t('common.off'), tone: 'warning' };
  }
  return { label: t('common.notAvailable'), tone: 'warning' };
};

const resolveMobileSubtitle = (t, tenant, facility, wardType) => {
  const available = [tenant, facility, wardType].filter((value) => (
    value && value !== t('common.notAvailable')
  ));
  if (available.length === 0) return undefined;
  if (available.length === 3) {
    return t('ward.list.contextValue', {
      tenant: available[0],
      facility: available[1],
      type: available[2],
    });
  }
  if (available.length === 2) {
    return t('ward.list.partialContextValue', {
      first: available[0],
      second: available[1],
    });
  }
  if (available.length === 1) return available[0];
  return undefined;
};

const WardListScreenWeb = () => {
  const { t } = useI18n();
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
    sortField,
    sortDirection,
    columnOrder,
    visibleColumns,
    selectedWardIds,
    allPageSelected,
    isTableMode,
    isTableSettingsOpen,
    isLoading,
    hasError,
    errorMessage,
    isOffline,
    noticeMessage,
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
    onToggleWardSelection,
    onTogglePageSelection,
    onClearSelection,
    onBulkDelete,
    resolveFilterOperatorOptions,
    resolveWardNameText,
    resolveWardTenantText,
    resolveWardFacilityText,
    resolveWardTypeText,
    resolveWardActiveText,
    onWardPress,
    onEdit,
    onDelete,
    onAdd,
  } = useWardListScreen();

  const rows = pagedItems;
  const [isFilterPanelCollapsed, setIsFilterPanelCollapsed] = useState(() => isTableMode);

  useEffect(() => {
    if (isTableMode) {
      setIsFilterPanelCollapsed(true);
    }
  }, [isTableMode]);

  const showError = !isLoading && hasError && !isOffline;
  const showOffline = !isLoading && isOffline && rows.length === 0;
  const showOfflineBanner = !isLoading && isOffline && rows.length > 0;
  const showEmpty = !isLoading && !showError && !showOffline && !hasNoResults && totalItems === 0;
  const showList = !isLoading && !showError && !showOffline && rows.length > 0;
  const showDesktopTable = isTableMode && !showError && !showOffline;

  const emptyComponent = (
    <EmptyState
      title={t('ward.list.emptyTitle')}
      description={t('ward.list.emptyMessage')}
      action={
        onAdd ? (
          <StyledAddButton
            type="button"
            onClick={onAdd}
            onPress={onAdd}
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

  const noResultsComponent = (
    <EmptyState
      title={t('ward.list.noResultsTitle')}
      description={t('ward.list.noResultsMessage')}
      action={
        <StyledFilterButton
          type="button"
          onClick={onClearSearchAndFilters}
          testID="ward-list-clear-search"
          aria-label={t('ward.list.clearSearchAndFilters')}
        >
          {t('ward.list.clearSearchAndFilters')}
        </StyledFilterButton>
      }
      testID="ward-list-no-results"
    />
  );

  const retryAction = onRetry ? (
    <Button
      variant="surface"
      size="small"
      onPress={onRetry}
      accessibilityLabel={t('common.retry')}
      accessibilityHint={t('common.retryHint')}
      testID="ward-list-retry"
    >
      {t('common.retry')}
    </Button>
  ) : undefined;

  const tableColumns = useMemo(
    () => visibleColumns.map((column) => {
      const columnLayout = TABLE_COLUMN_LAYOUT[column] || {};

      return {
        id: column,
        label: resolveColumnLabel(t, column),
        sortable: true,
        sortLabel: t('ward.list.sortBy', { field: resolveColumnLabel(t, column) }),
        width: columnLayout.width,
        minWidth: columnLayout.minWidth,
        align: columnLayout.align,
        truncate: columnLayout.truncate,
        renderCell: (ward) => {
          if (column === 'name') {
            return <StyledPrimaryCellText>{resolveWardNameText(ward)}</StyledPrimaryCellText>;
          }
          if (column === 'tenant') {
            return <StyledCodeCellText>{resolveWardTenantText(ward)}</StyledCodeCellText>;
          }
          if (column === 'facility') {
            return <StyledCodeCellText>{resolveWardFacilityText(ward)}</StyledCodeCellText>;
          }
          if (column === 'type') {
            return <StyledCodeCellText>{resolveWardTypeText(ward)}</StyledCodeCellText>;
          }
          if (column === 'active') {
            const activeMeta = resolveActiveMeta(t, resolveWardActiveText(ward));
            return <StyledStatusBadge $tone={activeMeta.tone}>{activeMeta.label}</StyledStatusBadge>;
          }
          return t('common.notAvailable');
        },
        getCellTitle: (ward) => {
          let value = '';
          if (column === 'name') value = resolveWardNameText(ward);
          else if (column === 'tenant') value = resolveWardTenantText(ward);
          else if (column === 'facility') value = resolveWardFacilityText(ward);
          else if (column === 'type') value = resolveWardTypeText(ward);
          else if (column === 'active') value = resolveActiveMeta(t, resolveWardActiveText(ward)).label;
          return typeof value === 'string' ? value : undefined;
        },
      };
    }),
    [
      visibleColumns,
      t,
      resolveWardNameText,
      resolveWardTenantText,
      resolveWardFacilityText,
      resolveWardTypeText,
      resolveWardActiveText,
    ]
  );

  const tableSelection = useMemo(() => {
    if (!onBulkDelete) return undefined;
    return {
      enabled: true,
      allSelected: allPageSelected,
      onToggleAll: (checked) => onTogglePageSelection(Boolean(checked)),
      isRowSelected: (ward) => Boolean(ward?.id) && selectedWardIds.includes(ward.id),
      onToggleRow: (ward) => onToggleWardSelection(ward?.id),
      selectAllLabel: t('ward.list.selectPage'),
      selectRowLabel: (ward) => t('ward.list.selectWard', {
        name: resolveWardNameText(ward),
      }),
      headerCheckboxTestId: 'ward-select-page',
      rowCheckboxTestIdPrefix: 'ward-select',
    };
  }, [
    onBulkDelete,
    allPageSelected,
    onTogglePageSelection,
    selectedWardIds,
    onToggleWardSelection,
    t,
    resolveWardNameText,
  ]);

  const handleTableRowPress = useCallback((ward) => {
    if (!ward?.id) return;
    onWardPress(ward.id);
  }, [onWardPress]);

  const renderTableRowActions = useCallback((ward) => {
    const wardId = ward?.id;
    if (!wardId) return null;

    return (
      <StyledRowActions>
        <StyledActionButton
          type="button"
          onClick={(event) => {
            event.stopPropagation();
            onWardPress(wardId);
          }}
          data-testid={`ward-view-${wardId}`}
        >
          {t('ward.list.view')}
        </StyledActionButton>

        {onEdit ? (
          <StyledActionButton
            type="button"
            onClick={(event) => onEdit(wardId, event)}
            data-testid={`ward-edit-${wardId}`}
          >
            {t('ward.list.edit')}
          </StyledActionButton>
        ) : null}

        {onDelete ? (
          <StyledDangerActionButton
            type="button"
            onClick={(event) => onDelete(wardId, event)}
            data-testid={`ward-delete-${wardId}`}
          >
            {t('common.remove')}
          </StyledDangerActionButton>
        ) : null}
      </StyledRowActions>
    );
  }, [onWardPress, onEdit, onDelete, t]);

  const searchBarSection = (
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

      <StyledScopeSlot>
        <StyledControlLabel>{t('ward.list.searchScopeLabel')}</StyledControlLabel>
        <Select
          value={searchScope}
          onValueChange={onSearchScopeChange}
          options={searchScopeOptions}
          accessibilityLabel={t('ward.list.searchScopeLabel')}
          compact
          testID="ward-list-search-scope"
        />
      </StyledScopeSlot>

      <StyledToolbarActions>
        {isTableMode ? (
          <StyledTableSettingsButton
            type="button"
            onClick={onOpenTableSettings}
            aria-label={t('ward.list.tableSettings')}
            data-testid="ward-table-settings"
          >
            {t('ward.list.tableSettings')}
          </StyledTableSettingsButton>
        ) : null}

        {onAdd ? (
          <StyledAddButton
            type="button"
            onClick={onAdd}
            onPress={onAdd}
            accessibilityLabel={t('ward.list.addLabel')}
            accessibilityHint={t('ward.list.addHint')}
            testID="ward-list-add"
          >
            <Icon glyph="+" size="xs" decorative />
            <StyledAddLabel>{t('ward.list.addLabel')}</StyledAddLabel>
          </StyledAddButton>
        ) : null}
      </StyledToolbarActions>
    </StyledToolbar>
  );

  const filterBarSection = (
    <StyledFilterPanel>
      <StyledFilterHeader>
        <StyledFilterTitle>{t('common.filters')}</StyledFilterTitle>
        <StyledFilterToggleButton
          type="button"
          onClick={() => setIsFilterPanelCollapsed((previous) => !previous)}
          aria-label={isFilterPanelCollapsed
            ? t('shell.sidebar.expandSectionLabel', { label: t('common.filters') })
            : t('shell.sidebar.collapseSectionLabel', { label: t('common.filters') })}
          title={isFilterPanelCollapsed
            ? t('shell.sidebar.expandSectionLabel', { label: t('common.filters') })
            : t('shell.sidebar.collapseSectionLabel', { label: t('common.filters') })}
          data-testid="ward-filter-toggle"
        >
          <StyledFilterChevron $collapsed={isFilterPanelCollapsed} aria-hidden="true">
            {'\u25BE'}
          </StyledFilterChevron>
        </StyledFilterToggleButton>
      </StyledFilterHeader>

      {!isFilterPanelCollapsed ? (
        <StyledFilterBody data-testid="ward-filter-body">
          <Select
            value={filterLogic}
            onValueChange={onFilterLogicChange}
            options={filterLogicOptions}
            label={t('ward.list.filterLogicLabel')}
            accessibilityLabel={t('ward.list.filterLogicLabel')}
            compact
            testID="ward-filter-logic"
          />

          {filters.map((filter, index) => {
            const operatorOptions = resolveFilterOperatorOptions(filter.field);
            return (
              <StyledFilterRow key={filter.id}>
                <Select
                  value={filter.field}
                  onValueChange={(value) => onFilterFieldChange(filter.id, value)}
                  options={filterFieldOptions}
                  label={t('ward.list.filterFieldLabel')}
                  compact
                  testID={`ward-filter-field-${index}`}
                />

                <Select
                  value={filter.operator}
                  onValueChange={(value) => onFilterOperatorChange(filter.id, value)}
                  options={operatorOptions}
                  label={t('ward.list.filterOperatorLabel')}
                  compact
                  testID={`ward-filter-operator-${index}`}
                />

                <TextField
                  value={filter.value}
                  onChange={(event) => onFilterValueChange(filter.id, event.target.value)}
                  label={t('ward.list.filterValueLabel')}
                  placeholder={t('ward.list.filterValuePlaceholder')}
                  density="compact"
                  testID={`ward-filter-value-${index}`}
                />

                <StyledFilterRowActions>
                  <StyledFilterButton
                    type="button"
                    onClick={() => onRemoveFilter(filter.id)}
                    aria-label={t('ward.list.removeFilter')}
                    testID={`ward-filter-remove-${index}`}
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
              testID="ward-filter-add"
            >
              {t('ward.list.addFilter')}
            </StyledFilterButton>
            <StyledFilterButton
              type="button"
              onClick={onClearSearchAndFilters}
              testID="ward-filter-clear"
            >
              {t('ward.list.clearSearchAndFilters')}
            </StyledFilterButton>
          </StyledFilterActions>
        </StyledFilterBody>
      ) : null}
    </StyledFilterPanel>
  );

  const bulkActionsBar = onBulkDelete && selectedWardIds.length > 0 ? (
    <StyledBulkBar data-testid="ward-bulk-bar">
      <StyledBulkInfo>
        {t('ward.list.bulkSelectedCount', { count: selectedWardIds.length })}
      </StyledBulkInfo>
      <StyledBulkActions>
        <StyledActionButton
          type="button"
          onClick={onClearSelection}
          data-testid="ward-bulk-clear"
        >
          {t('ward.list.clearSelection')}
        </StyledActionButton>
        <StyledDangerActionButton
          type="button"
          onClick={onBulkDelete}
          data-testid="ward-bulk-delete"
        >
          {t('ward.list.bulkDelete')}
        </StyledDangerActionButton>
      </StyledBulkActions>
    </StyledBulkBar>
  ) : null;

  const tableStatusContent = showEmpty ? emptyComponent : (hasNoResults ? noResultsComponent : null);

  const paginationContent = showList ? (
    <StyledPaginationInfo>
      {t('ward.list.pageSummary', { page, totalPages, total: totalItems })}
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
        data-testid="ward-page-prev"
      >
        {'<'}
      </StyledPaginationNavButton>

      <StyledPaginationControl>
        <StyledPaginationControlLabel>
          {t('ward.list.pageSizeLabel')}
        </StyledPaginationControlLabel>
        <StyledPaginationSelectSlot>
          <Select
            value={String(pageSize)}
            onValueChange={onPageSizeChange}
            options={pageSizeOptions}
            accessibilityLabel={t('ward.list.pageSizeLabel')}
            compact
            testID="ward-page-size"
          />
        </StyledPaginationSelectSlot>
      </StyledPaginationControl>

      <StyledPaginationControl>
        <StyledPaginationControlLabel>
          {t('ward.list.densityLabel')}
        </StyledPaginationControlLabel>
        <StyledPaginationSelectSlot>
          <Select
            value={density}
            onValueChange={onDensityChange}
            options={densityOptions}
            accessibilityLabel={t('ward.list.densityLabel')}
            compact
            testID="ward-density"
          />
        </StyledPaginationSelectSlot>
      </StyledPaginationControl>

      <StyledPaginationNavButton
        type="button"
        onClick={() => onPageChange(page + 1)}
        disabled={page >= totalPages}
        aria-label={t('common.next')}
        title={t('common.next')}
        data-testid="ward-page-next"
      >
        {'>'}
      </StyledPaginationNavButton>
    </StyledPaginationActions>
  ) : null;

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
        {!isTableMode ? searchBarSection : null}
        {!isTableMode ? filterBarSection : null}
        {!isTableMode ? bulkActionsBar : null}

        <Card
          variant="outlined"
          accessibilityLabel={t('ward.list.accessibilityLabel')}
          testID="ward-list-card"
        >
          <StyledListBody
            role="region"
            aria-label={t('ward.list.accessibilityLabel')}
            data-testid="ward-list"
            testID="ward-list"
          >
            <StyledStateStack>
              {showError ? (
                <ErrorState
                  size={ErrorStateSizes.SMALL}
                  title={t('listScaffold.errorState.title')}
                  description={errorMessage}
                  action={retryAction}
                  testID="ward-list-error"
                />
              ) : null}

              {showOffline ? (
                <OfflineState
                  size={OfflineStateSizes.SMALL}
                  title={t('shell.banners.offline.title')}
                  description={t('shell.banners.offline.message')}
                  action={retryAction}
                  testID="ward-list-offline"
                />
              ) : null}

              {showOfflineBanner ? (
                <OfflineState
                  size={OfflineStateSizes.SMALL}
                  title={t('shell.banners.offline.title')}
                  description={t('shell.banners.offline.message')}
                  action={retryAction}
                  testID="ward-list-offline-banner"
                />
              ) : null}
            </StyledStateStack>

            {isLoading ? (
              <LoadingSpinner accessibilityLabel={t('common.loading')} testID="ward-list-loading" />
            ) : null}

            {!isTableMode && showEmpty ? emptyComponent : null}
            {!isTableMode && hasNoResults ? noResultsComponent : null}

            {showDesktopTable ? (
              <DataTable
                columns={tableColumns}
                rows={rows}
                getRowKey={(ward, index) => ward?.id ?? `ward-${index}`}
                rowDensity={density}
                sortField={sortField}
                sortDirection={sortDirection}
                onSort={onSort}
                selection={tableSelection}
                renderRowActions={renderTableRowActions}
                rowActionsLabel={t('ward.list.columnActions')}
                onRowPress={handleTableRowPress}
                virtualization={{
                  enabled: true,
                  threshold: 80,
                  rowHeight: density === 'comfortable' ? 48 : 40,
                  maxHeight: 560,
                  overscan: 10,
                }}
                searchBar={searchBarSection}
                filterBar={filterBarSection}
                bulkActionsBar={bulkActionsBar}
                statusContent={tableStatusContent}
                pagination={paginationContent}
                tableNavigation={tableNavigationContent}
                showDefaultEmptyRow={false}
                minWidth={980}
                testID="ward-table"
              />
            ) : null}

            {showList && !isTableMode ? (
              <StyledMobileList role="list">
                {rows.map((ward, index) => {
                  const title = resolveWardNameText(ward);
                  const leadingGlyph = String(title || 'R').charAt(0).toUpperCase();
                  const wardId = ward?.id;
                  const itemKey = wardId ?? `ward-${index}`;
                  const activeMeta = resolveActiveMeta(t, resolveWardActiveText(ward));
                  const tenant = resolveWardTenantText(ward);
                  const facility = resolveWardFacilityText(ward);
                  const wardType = resolveWardTypeText(ward);
                  return (
                    <li key={itemKey} role="listitem">
                      <ListItem
                        leading={{ glyph: leadingGlyph, tone: 'inverse', backgroundTone: 'primary' }}
                        title={title}
                        subtitle={resolveMobileSubtitle(t, tenant, facility, wardType)}
                        metadata={[]}
                        status={{
                          label: activeMeta.label,
                          tone: activeMeta.tone,
                          showDot: true,
                          accessibilityLabel: t('ward.list.activeLabel'),
                        }}
                        density="compact"
                        onPress={wardId ? () => onWardPress(wardId) : undefined}
                        onView={wardId ? () => onWardPress(wardId) : undefined}
                        onEdit={onEdit && wardId ? (event) => onEdit(wardId, event) : undefined}
                        onDelete={onDelete && wardId ? (event) => onDelete(wardId, event) : undefined}
                        viewLabel={t('ward.list.view')}
                        viewHint={t('ward.list.viewHint')}
                        editLabel={t('ward.list.edit')}
                        editHint={t('ward.list.editHint')}
                        deleteLabel={t('common.remove')}
                        deleteHint={t('ward.list.deleteHint')}
                        onMore={wardId ? () => onWardPress(wardId) : undefined}
                        moreLabel={t('common.more')}
                        moreHint={t('ward.list.viewHint')}
                        viewTestID={`ward-view-${itemKey}`}
                        editTestID={`ward-edit-${itemKey}`}
                        deleteTestID={`ward-delete-${itemKey}`}
                        moreTestID={`ward-more-${itemKey}`}
                        accessibilityLabel={t('ward.list.itemLabel', { name: title })}
                        accessibilityHint={t('ward.list.itemHint', { name: title })}
                        testID={`ward-item-${itemKey}`}
                      />
                    </li>
                  );
                })}
              </StyledMobileList>
            ) : null}

            {!isTableMode && showList ? (
              <StyledPagination>
                <StyledPaginationInfo>
                  {t('ward.list.pageSummary', { page, totalPages, total: totalItems })}
                </StyledPaginationInfo>

                <StyledPaginationActions>
                  <StyledPaginationNavButton
                    type="button"
                    onClick={() => onPageChange(page - 1)}
                    disabled={page <= 1}
                    aria-label={t('common.previous')}
                    title={t('common.previous')}
                    data-testid="ward-page-prev"
                  >
                    {'<'}
                  </StyledPaginationNavButton>

                  <StyledPaginationControl>
                    <StyledPaginationControlLabel>
                      {t('ward.list.pageSizeLabel')}
                    </StyledPaginationControlLabel>
                    <StyledPaginationSelectSlot>
                      <Select
                        value={String(pageSize)}
                        onValueChange={onPageSizeChange}
                        options={pageSizeOptions}
                        accessibilityLabel={t('ward.list.pageSizeLabel')}
                        compact
                        testID="ward-page-size"
                      />
                    </StyledPaginationSelectSlot>
                  </StyledPaginationControl>

                  <StyledPaginationControl>
                    <StyledPaginationControlLabel>
                      {t('ward.list.densityLabel')}
                    </StyledPaginationControlLabel>
                    <StyledPaginationSelectSlot>
                      <Select
                        value={density}
                        onValueChange={onDensityChange}
                        options={densityOptions}
                        accessibilityLabel={t('ward.list.densityLabel')}
                        compact
                        testID="ward-density"
                      />
                    </StyledPaginationSelectSlot>
                  </StyledPaginationControl>

                  <StyledPaginationNavButton
                    type="button"
                    onClick={() => onPageChange(page + 1)}
                    disabled={page >= totalPages}
                    aria-label={t('common.next')}
                    title={t('common.next')}
                    data-testid="ward-page-next"
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
          accessibilityLabel={t('ward.list.tableSettings')}
          testID="ward-table-settings-modal"
        >
          <StyledSettingsBody>
            <StyledSettingsSection>
              <StyledSettingsTitle>{t('ward.list.visibleColumns')}</StyledSettingsTitle>
              {columnOrder.map((column) => (
                <StyledColumnRow key={column}>
                  <Checkbox
                    checked={visibleColumns.includes(column)}
                    onChange={() => onToggleColumnVisibility(column)}
                    label={resolveColumnLabel(t, column)}
                    testID={`ward-column-visible-${column}`}
                  />

                  <StyledColumnMoveControls>
                    <StyledMoveButton
                      type="button"
                      onClick={() => onMoveColumnLeft(column)}
                      aria-label={t('ward.list.moveColumnLeft', {
                        column: resolveColumnLabel(t, column),
                      })}
                      disabled={columnOrder.indexOf(column) === 0}
                      data-testid={`ward-column-left-${column}`}
                    >
                      {'<'}
                    </StyledMoveButton>
                    <StyledMoveButton
                      type="button"
                      onClick={() => onMoveColumnRight(column)}
                      aria-label={t('ward.list.moveColumnRight', {
                        column: resolveColumnLabel(t, column),
                      })}
                      disabled={columnOrder.indexOf(column) === columnOrder.length - 1}
                      data-testid={`ward-column-right-${column}`}
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
                data-testid="ward-table-settings-reset"
              >
                {t('ward.list.resetTablePreferences')}
              </StyledFilterButton>
            </StyledSettingsActions>
          </StyledSettingsBody>
        </Modal>
      </StyledContent>
    </StyledContainer>
  );
};

export default WardListScreenWeb;







