/**
 * UnitListScreen - Web
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
import { humanizeIdentifier } from '@utils';
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
} from './UnitListScreen.web.styles';
import useUnitListScreen from './useUnitListScreen';

const resolveUnitTitle = (t, Unit) => {
  const name = humanizeIdentifier(Unit?.name);
  if (name) return String(name).trim();
  return t('unit.list.unnamed');
};

const resolveUnitTenantLabel = (t, Unit) => {
  const value = humanizeIdentifier(
    Unit?.tenant_name
    ?? Unit?.tenant?.name
    ?? Unit?.tenant_label
  );
  if (value) return String(value).trim();
  return t('common.notAvailable');
};

const resolveUnitFacilityLabel = (t, Unit) => {
  const value = humanizeIdentifier(
    Unit?.facility_name
    ?? Unit?.facility?.name
    ?? Unit?.facility_label
  );
  if (value) return String(value).trim();
  return t('common.notAvailable');
};

const resolveUnitDepartmentLabel = (t, Unit) => {
  const value = humanizeIdentifier(
    Unit?.department_name
    ?? Unit?.department?.name
    ?? Unit?.department_label
  );
  if (value) return String(value).trim();
  return t('common.notAvailable');
};

const resolveColumnLabel = (t, column) => {
  if (column === 'name') return t('unit.list.columnName');
  if (column === 'tenant') return t('unit.list.columnTenant');
  if (column === 'facility') return t('unit.list.columnFacility');
  if (column === 'department') return t('unit.list.columnDepartment');
  if (column === 'status') return t('unit.list.columnStatus');
  return column;
};

const TABLE_COLUMN_LAYOUT = {
  name: { width: 240, minWidth: 200, align: 'left' },
  tenant: { width: 210, minWidth: 170, align: 'left' },
  facility: { width: 210, minWidth: 170, align: 'left' },
  department: { width: 210, minWidth: 170, align: 'left' },
  status: { width: 130, minWidth: 112, align: 'center', truncate: false },
};

const resolveUnitCell = (t, Unit, column) => {
  if (column === 'name') return resolveUnitTitle(t, Unit);
  if (column === 'tenant') return resolveUnitTenantLabel(t, Unit);
  if (column === 'facility') return resolveUnitFacilityLabel(t, Unit);
  if (column === 'department') return resolveUnitDepartmentLabel(t, Unit);
  if (column === 'status') {
    const isActive = Boolean(Unit?.is_active);
    return {
      label: isActive ? t('unit.list.statusActive') : t('unit.list.statusInactive'),
      tone: isActive ? 'success' : 'warning',
    };
  }
  return t('common.notAvailable');
};

const resolveMobileSubtitle = (t, Unit) => {
  const tenant = resolveUnitTenantLabel(t, Unit);
  const facility = resolveUnitFacilityLabel(t, Unit);
  const department = resolveUnitDepartmentLabel(t, Unit);

  if (
    tenant !== t('common.notAvailable')
    && facility !== t('common.notAvailable')
    && department !== t('common.notAvailable')
  ) {
    return t('unit.list.contextValue', { tenant, facility, department });
  }
  if (facility !== t('common.notAvailable') && department !== t('common.notAvailable')) {
    return t('unit.list.facilityDepartmentValue', { facility, department });
  }
  if (tenant !== t('common.notAvailable') && facility !== t('common.notAvailable')) {
    return t('unit.list.tenantFacilityValue', { tenant, facility });
  }
  if (tenant !== t('common.notAvailable') && department !== t('common.notAvailable')) {
    return t('unit.list.tenantDepartmentValue', { tenant, department });
  }
  if (department !== t('common.notAvailable')) {
    return t('unit.list.departmentValue', { department });
  }
  if (facility !== t('common.notAvailable')) {
    return t('unit.list.facilityValue', { facility });
  }
  if (tenant !== t('common.notAvailable')) {
    return t('unit.list.tenantValue', { tenant });
  }
  return undefined;
};

const UnitListScreenWeb = () => {
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
    selectedUnitIds,
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
    onToggleUnitSelection,
    onTogglePageSelection,
    onClearSelection,
    onBulkDelete,
    resolveFilterOperatorOptions,
    onUnitPress,
    onEdit,
    onDelete,
    onAdd,
  } = useUnitListScreen();

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
      title={t('unit.list.emptyTitle')}
      description={t('unit.list.emptyMessage')}
      action={
        onAdd ? (
          <StyledAddButton
            type="button"
            onClick={onAdd}
            onPress={onAdd}
            accessibilityLabel={t('unit.list.addLabel')}
            accessibilityHint={t('unit.list.addHint')}
            testID="unit-list-empty-add"
          >
            <Icon glyph="+" size="xs" decorative />
            <StyledAddLabel>{t('unit.list.addLabel')}</StyledAddLabel>
          </StyledAddButton>
        ) : undefined
      }
      testID="unit-list-empty-state"
    />
  );

  const noResultsComponent = (
    <EmptyState
      title={t('unit.list.noResultsTitle')}
      description={t('unit.list.noResultsMessage')}
      action={
        <StyledFilterButton
          type="button"
          onClick={onClearSearchAndFilters}
          testID="unit-list-clear-search"
          aria-label={t('unit.list.clearSearchAndFilters')}
        >
          {t('unit.list.clearSearchAndFilters')}
        </StyledFilterButton>
      }
      testID="unit-list-no-results"
    />
  );

  const retryAction = onRetry ? (
    <Button
      variant="surface"
      size="small"
      onPress={onRetry}
      accessibilityLabel={t('common.retry')}
      accessibilityHint={t('common.retryHint')}
      testID="unit-list-retry"
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
        sortLabel: t('unit.list.sortBy', { field: resolveColumnLabel(t, column) }),
        width: columnLayout.width,
        minWidth: columnLayout.minWidth,
        align: columnLayout.align,
        truncate: columnLayout.truncate,
        renderCell: (Unit) => {
          const value = resolveUnitCell(t, Unit, column);
          if (column === 'status' && value && typeof value === 'object') {
            return <StyledStatusBadge $tone={value.tone}>{value.label}</StyledStatusBadge>;
          }
          if (column === 'name') {
            return <StyledPrimaryCellText>{value}</StyledPrimaryCellText>;
          }
          if (column === 'tenant' || column === 'facility' || column === 'department') {
            return <StyledCodeCellText>{value}</StyledCodeCellText>;
          }
          return value;
        },
        getCellTitle: (Unit) => {
          const value = resolveUnitCell(t, Unit, column);
          return typeof value === 'string' ? value : undefined;
        },
      };
    }),
    [visibleColumns, t]
  );

  const tableSelection = useMemo(() => {
    if (!onBulkDelete) return undefined;
    return {
      enabled: true,
      allSelected: allPageSelected,
      onToggleAll: (checked) => onTogglePageSelection(Boolean(checked)),
      isRowSelected: (Unit) => Boolean(Unit?.id) && selectedUnitIds.includes(Unit.id),
      onToggleRow: (Unit) => onToggleUnitSelection(Unit?.id),
      selectAllLabel: t('unit.list.selectPage'),
      selectRowLabel: (Unit) => t('unit.list.selectUnit', {
        name: resolveUnitTitle(t, Unit),
      }),
      headerCheckboxTestId: 'unit-select-page',
      rowCheckboxTestIdPrefix: 'unit-select',
    };
  }, [
    onBulkDelete,
    allPageSelected,
    onTogglePageSelection,
    selectedUnitIds,
    onToggleUnitSelection,
    t,
  ]);

  const handleTableRowPress = useCallback((Unit) => {
    if (!Unit?.id) return;
    onUnitPress(Unit.id);
  }, [onUnitPress]);

  const renderTableRowActions = useCallback((Unit) => {
    const UnitId = Unit?.id;
    if (!UnitId) return null;

    return (
      <StyledRowActions>
        <StyledActionButton
          type="button"
          onClick={(event) => {
            event.stopPropagation();
            onUnitPress(UnitId);
          }}
          data-testid={`unit-view-${UnitId}`}
        >
          {t('unit.list.view')}
        </StyledActionButton>

        {onEdit ? (
          <StyledActionButton
            type="button"
            onClick={(event) => onEdit(UnitId, event)}
            data-testid={`unit-edit-${UnitId}`}
          >
            {t('unit.list.edit')}
          </StyledActionButton>
        ) : null}

        {onDelete ? (
          <StyledDangerActionButton
            type="button"
            onClick={(event) => onDelete(UnitId, event)}
            data-testid={`unit-delete-${UnitId}`}
          >
            {t('common.remove')}
          </StyledDangerActionButton>
        ) : null}
      </StyledRowActions>
    );
  }, [onUnitPress, onEdit, onDelete, t]);

  const searchBarSection = (
    <StyledToolbar data-testid="unit-list-toolbar">
      <StyledSearchSlot>
        <TextField
          value={search}
          onChange={(e) => onSearch(e.target.value)}
          placeholder={t('unit.list.searchPlaceholder')}
          accessibilityLabel={t('unit.list.searchLabel')}
          density="compact"
          type="search"
          testID="unit-list-search"
        />
      </StyledSearchSlot>

      <StyledScopeSlot>
        <StyledControlLabel>{t('unit.list.searchScopeLabel')}</StyledControlLabel>
        <Select
          value={searchScope}
          onValueChange={onSearchScopeChange}
          options={searchScopeOptions}
          accessibilityLabel={t('unit.list.searchScopeLabel')}
          compact
          testID="unit-list-search-scope"
        />
      </StyledScopeSlot>

      <StyledToolbarActions>
        {isTableMode ? (
          <StyledTableSettingsButton
            type="button"
            onClick={onOpenTableSettings}
            aria-label={t('unit.list.tableSettings')}
            data-testid="unit-table-settings"
          >
            {t('unit.list.tableSettings')}
          </StyledTableSettingsButton>
        ) : null}

        {onAdd ? (
          <StyledAddButton
            type="button"
            onClick={onAdd}
            onPress={onAdd}
            accessibilityLabel={t('unit.list.addLabel')}
            accessibilityHint={t('unit.list.addHint')}
            testID="unit-list-add"
          >
            <Icon glyph="+" size="xs" decorative />
            <StyledAddLabel>{t('unit.list.addLabel')}</StyledAddLabel>
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
          data-testid="unit-filter-toggle"
        >
          <StyledFilterChevron $collapsed={isFilterPanelCollapsed} aria-hidden="true">
            {'\u25BE'}
          </StyledFilterChevron>
        </StyledFilterToggleButton>
      </StyledFilterHeader>

      {!isFilterPanelCollapsed ? (
        <StyledFilterBody data-testid="unit-filter-body">
          <Select
            value={filterLogic}
            onValueChange={onFilterLogicChange}
            options={filterLogicOptions}
            label={t('unit.list.filterLogicLabel')}
            accessibilityLabel={t('unit.list.filterLogicLabel')}
            compact
            testID="unit-filter-logic"
          />

          {filters.map((filter, index) => {
            const operatorOptions = resolveFilterOperatorOptions(filter.field);
            const isStatusFilter = filter.field === 'status';
            return (
              <StyledFilterRow key={filter.id}>
                <Select
                  value={filter.field}
                  onValueChange={(value) => onFilterFieldChange(filter.id, value)}
                  options={filterFieldOptions}
                  label={t('unit.list.filterFieldLabel')}
                  compact
                  testID={`unit-filter-field-${index}`}
                />

                <Select
                  value={filter.operator}
                  onValueChange={(value) => onFilterOperatorChange(filter.id, value)}
                  options={operatorOptions}
                  label={t('unit.list.filterOperatorLabel')}
                  compact
                  testID={`unit-filter-operator-${index}`}
                />

                {isStatusFilter ? (
                  <Select
                    value={filter.value || 'active'}
                    onValueChange={(value) => onFilterValueChange(filter.id, value)}
                    options={[
                      { value: 'active', label: t('unit.list.statusActive') },
                      { value: 'inactive', label: t('unit.list.statusInactive') },
                    ]}
                    label={t('unit.list.filterValueLabel')}
                    compact
                    testID={`unit-filter-value-${index}`}
                  />
                ) : (
                  <TextField
                    value={filter.value}
                    onChange={(event) => onFilterValueChange(filter.id, event.target.value)}
                    label={t('unit.list.filterValueLabel')}
                    placeholder={t('unit.list.filterValuePlaceholder')}
                    density="compact"
                    testID={`unit-filter-value-${index}`}
                  />
                )}

                <StyledFilterRowActions>
                  <StyledFilterButton
                    type="button"
                    onClick={() => onRemoveFilter(filter.id)}
                    aria-label={t('unit.list.removeFilter')}
                    testID={`unit-filter-remove-${index}`}
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
              testID="unit-filter-add"
            >
              {t('unit.list.addFilter')}
            </StyledFilterButton>
            <StyledFilterButton
              type="button"
              onClick={onClearSearchAndFilters}
              testID="unit-filter-clear"
            >
              {t('unit.list.clearSearchAndFilters')}
            </StyledFilterButton>
          </StyledFilterActions>
        </StyledFilterBody>
      ) : null}
    </StyledFilterPanel>
  );

  const bulkActionsBar = onBulkDelete && selectedUnitIds.length > 0 ? (
    <StyledBulkBar data-testid="unit-bulk-bar">
      <StyledBulkInfo>
        {t('unit.list.bulkSelectedCount', { count: selectedUnitIds.length })}
      </StyledBulkInfo>
      <StyledBulkActions>
        <StyledActionButton
          type="button"
          onClick={onClearSelection}
          data-testid="unit-bulk-clear"
        >
          {t('unit.list.clearSelection')}
        </StyledActionButton>
        <StyledDangerActionButton
          type="button"
          onClick={onBulkDelete}
          data-testid="unit-bulk-delete"
        >
          {t('unit.list.bulkDelete')}
        </StyledDangerActionButton>
      </StyledBulkActions>
    </StyledBulkBar>
  ) : null;

  const tableStatusContent = showEmpty ? emptyComponent : (hasNoResults ? noResultsComponent : null);

  const paginationContent = showList ? (
    <StyledPaginationInfo>
      {t('unit.list.pageSummary', { page, totalPages, total: totalItems })}
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
        data-testid="unit-page-prev"
      >
        {'<'}
      </StyledPaginationNavButton>

      <StyledPaginationControl>
        <StyledPaginationControlLabel>
          {t('unit.list.pageSizeLabel')}
        </StyledPaginationControlLabel>
        <StyledPaginationSelectSlot>
          <Select
            value={String(pageSize)}
            onValueChange={onPageSizeChange}
            options={pageSizeOptions}
            accessibilityLabel={t('unit.list.pageSizeLabel')}
            compact
            testID="unit-page-size"
          />
        </StyledPaginationSelectSlot>
      </StyledPaginationControl>

      <StyledPaginationControl>
        <StyledPaginationControlLabel>
          {t('unit.list.densityLabel')}
        </StyledPaginationControlLabel>
        <StyledPaginationSelectSlot>
          <Select
            value={density}
            onValueChange={onDensityChange}
            options={densityOptions}
            accessibilityLabel={t('unit.list.densityLabel')}
            compact
            testID="unit-density"
          />
        </StyledPaginationSelectSlot>
      </StyledPaginationControl>

      <StyledPaginationNavButton
        type="button"
        onClick={() => onPageChange(page + 1)}
        disabled={page >= totalPages}
        aria-label={t('common.next')}
        title={t('common.next')}
        data-testid="unit-page-next"
      >
        {'>'}
      </StyledPaginationNavButton>
    </StyledPaginationActions>
  ) : null;

  return (
    <StyledContainer role="main" aria-label={t('unit.list.title')}>
      {noticeMessage ? (
        <Snackbar
          visible={Boolean(noticeMessage)}
          message={noticeMessage}
          variant="success"
          position="bottom"
          onDismiss={onDismissNotice}
          testID="unit-list-notice"
        />
      ) : null}

      <StyledContent>
        {!isTableMode ? searchBarSection : null}
        {!isTableMode ? filterBarSection : null}
        {!isTableMode ? bulkActionsBar : null}

        <Card
          variant="outlined"
          accessibilityLabel={t('unit.list.accessibilityLabel')}
          testID="unit-list-card"
        >
          <StyledListBody
            role="region"
            aria-label={t('unit.list.accessibilityLabel')}
            data-testid="unit-list"
            testID="unit-list"
          >
            <StyledStateStack>
              {showError ? (
                <ErrorState
                  size={ErrorStateSizes.SMALL}
                  title={t('listScaffold.errorState.title')}
                  description={errorMessage}
                  action={retryAction}
                  testID="unit-list-error"
                />
              ) : null}

              {showOffline ? (
                <OfflineState
                  size={OfflineStateSizes.SMALL}
                  title={t('shell.banners.offline.title')}
                  description={t('shell.banners.offline.message')}
                  action={retryAction}
                  testID="unit-list-offline"
                />
              ) : null}

              {showOfflineBanner ? (
                <OfflineState
                  size={OfflineStateSizes.SMALL}
                  title={t('shell.banners.offline.title')}
                  description={t('shell.banners.offline.message')}
                  action={retryAction}
                  testID="unit-list-offline-banner"
                />
              ) : null}
            </StyledStateStack>

            {isLoading ? (
              <LoadingSpinner accessibilityLabel={t('common.loading')} testID="unit-list-loading" />
            ) : null}

            {!isTableMode && showEmpty ? emptyComponent : null}
            {!isTableMode && hasNoResults ? noResultsComponent : null}

            {showDesktopTable ? (
              <DataTable
                columns={tableColumns}
                rows={rows}
                getRowKey={(Unit, index) => Unit?.id ?? `unit-${index}`}
                rowDensity={density}
                sortField={sortField}
                sortDirection={sortDirection}
                onSort={onSort}
                selection={tableSelection}
                renderRowActions={renderTableRowActions}
                rowActionsLabel={t('unit.list.columnActions')}
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
                testID="unit-table"
              />
            ) : null}

            {showList && !isTableMode ? (
              <StyledMobileList role="list">
                {rows.map((Unit, index) => {
                  const title = resolveUnitTitle(t, Unit);
                  const leadingGlyph = String(title || 'U').charAt(0).toUpperCase();
                  const UnitId = Unit?.id;
                  const itemKey = UnitId ?? `unit-${index}`;
                  const statusLabel = Unit?.is_active
                    ? t('unit.list.statusActive')
                    : t('unit.list.statusInactive');
                  const statusTone = Unit?.is_active ? 'success' : 'warning';
                  return (
                    <li key={itemKey} role="listitem">
                      <ListItem
                        leading={{ glyph: leadingGlyph, tone: 'inverse', backgroundTone: 'primary' }}
                        title={title}
                        subtitle={resolveMobileSubtitle(t, Unit)}
                        metadata={[]}
                        status={{
                          label: statusLabel,
                          tone: statusTone,
                          showDot: true,
                          accessibilityLabel: t('unit.list.statusLabel'),
                        }}
                        density="compact"
                        onPress={UnitId ? () => onUnitPress(UnitId) : undefined}
                        onView={UnitId ? () => onUnitPress(UnitId) : undefined}
                        onEdit={onEdit && UnitId ? (event) => onEdit(UnitId, event) : undefined}
                        onDelete={onDelete && UnitId ? (event) => onDelete(UnitId, event) : undefined}
                        viewLabel={t('unit.list.view')}
                        viewHint={t('unit.list.viewHint')}
                        editLabel={t('unit.list.edit')}
                        editHint={t('unit.list.editHint')}
                        deleteLabel={t('common.remove')}
                        deleteHint={t('unit.list.deleteHint')}
                        onMore={UnitId ? () => onUnitPress(UnitId) : undefined}
                        moreLabel={t('common.more')}
                        moreHint={t('unit.list.viewHint')}
                        viewTestID={`unit-view-${itemKey}`}
                        editTestID={`unit-edit-${itemKey}`}
                        deleteTestID={`unit-delete-${itemKey}`}
                        moreTestID={`unit-more-${itemKey}`}
                        accessibilityLabel={t('unit.list.itemLabel', { name: title })}
                        accessibilityHint={t('unit.list.itemHint', { name: title })}
                        testID={`unit-item-${itemKey}`}
                      />
                    </li>
                  );
                })}
              </StyledMobileList>
            ) : null}

            {!isTableMode && showList ? (
              <StyledPagination>
                <StyledPaginationInfo>
                  {t('unit.list.pageSummary', { page, totalPages, total: totalItems })}
                </StyledPaginationInfo>

                <StyledPaginationActions>
                  <StyledPaginationNavButton
                    type="button"
                    onClick={() => onPageChange(page - 1)}
                    disabled={page <= 1}
                    aria-label={t('common.previous')}
                    title={t('common.previous')}
                    data-testid="unit-page-prev"
                  >
                    {'<'}
                  </StyledPaginationNavButton>

                  <StyledPaginationControl>
                    <StyledPaginationControlLabel>
                      {t('unit.list.pageSizeLabel')}
                    </StyledPaginationControlLabel>
                    <StyledPaginationSelectSlot>
                      <Select
                        value={String(pageSize)}
                        onValueChange={onPageSizeChange}
                        options={pageSizeOptions}
                        accessibilityLabel={t('unit.list.pageSizeLabel')}
                        compact
                        testID="unit-page-size"
                      />
                    </StyledPaginationSelectSlot>
                  </StyledPaginationControl>

                  <StyledPaginationControl>
                    <StyledPaginationControlLabel>
                      {t('unit.list.densityLabel')}
                    </StyledPaginationControlLabel>
                    <StyledPaginationSelectSlot>
                      <Select
                        value={density}
                        onValueChange={onDensityChange}
                        options={densityOptions}
                        accessibilityLabel={t('unit.list.densityLabel')}
                        compact
                        testID="unit-density"
                      />
                    </StyledPaginationSelectSlot>
                  </StyledPaginationControl>

                  <StyledPaginationNavButton
                    type="button"
                    onClick={() => onPageChange(page + 1)}
                    disabled={page >= totalPages}
                    aria-label={t('common.next')}
                    title={t('common.next')}
                    data-testid="unit-page-next"
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
          accessibilityLabel={t('unit.list.tableSettings')}
          testID="unit-table-settings-modal"
        >
          <StyledSettingsBody>
            <StyledSettingsSection>
              <StyledSettingsTitle>{t('unit.list.visibleColumns')}</StyledSettingsTitle>
              {columnOrder.map((column) => (
                <StyledColumnRow key={column}>
                  <Checkbox
                    checked={visibleColumns.includes(column)}
                    onChange={() => onToggleColumnVisibility(column)}
                    label={resolveColumnLabel(t, column)}
                    testID={`unit-column-visible-${column}`}
                  />

                  <StyledColumnMoveControls>
                    <StyledMoveButton
                      type="button"
                      onClick={() => onMoveColumnLeft(column)}
                      aria-label={t('unit.list.moveColumnLeft', {
                        column: resolveColumnLabel(t, column),
                      })}
                      disabled={columnOrder.indexOf(column) === 0}
                      data-testid={`unit-column-left-${column}`}
                    >
                      {'<'}
                    </StyledMoveButton>
                    <StyledMoveButton
                      type="button"
                      onClick={() => onMoveColumnRight(column)}
                      aria-label={t('unit.list.moveColumnRight', {
                        column: resolveColumnLabel(t, column),
                      })}
                      disabled={columnOrder.indexOf(column) === columnOrder.length - 1}
                      data-testid={`unit-column-right-${column}`}
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
                data-testid="unit-table-settings-reset"
              >
                {t('unit.list.resetTablePreferences')}
              </StyledFilterButton>
            </StyledSettingsActions>
          </StyledSettingsBody>
        </Modal>
      </StyledContent>
    </StyledContainer>
  );
};

export default UnitListScreenWeb;


