/**
 * DepartmentListScreen - Web
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
} from './DepartmentListScreen.web.styles';
import useDepartmentListScreen from './useDepartmentListScreen';

const resolveDepartmentTitle = (t, department) => {
  const name = humanizeIdentifier(department?.name);
  if (name) return String(name).trim();
  return t('department.list.unnamed');
};

const resolveDepartmentTypeValue = (department) => String(department?.department_type ?? '').trim();
const resolveDepartmentShortName = (department) => String(department?.short_name ?? '').trim();

const resolveDepartmentTypeLabel = (t, department) => {
  const value = resolveDepartmentTypeValue(department);
  if (!value) return '';
  const key = `department.form.type${value}`;
  const resolved = t(key);
  return resolved === key ? value : resolved;
};

const resolveColumnLabel = (t, column) => {
  if (column === 'name') return t('department.list.columnName');
  if (column === 'shortName') return t('department.list.columnShortName');
  if (column === 'type') return t('department.list.columnType');
  if (column === 'status') return t('department.list.columnStatus');
  return column;
};

const TABLE_COLUMN_LAYOUT = {
  name: { width: 240, minWidth: 200, align: 'left' },
  shortName: { width: 150, minWidth: 130, align: 'left' },
  type: { width: 200, minWidth: 170, align: 'left' },
  status: { width: 130, minWidth: 112, align: 'center', truncate: false },
};

const resolveDepartmentCell = (t, department, column) => {
  if (column === 'name') return resolveDepartmentTitle(t, department);
  if (column === 'shortName') return resolveDepartmentShortName(department) || t('common.notAvailable');
  if (column === 'type') return resolveDepartmentTypeLabel(t, department) || t('common.notAvailable');
  if (column === 'status') {
    const isActive = Boolean(department?.is_active);
    return {
      label: isActive ? t('department.list.statusActive') : t('department.list.statusInactive'),
      tone: isActive ? 'success' : 'warning',
    };
  }
  return t('common.notAvailable');
};

const resolveDepartmentSubtitle = (t, department) => {
  const shortName = resolveDepartmentShortName(department);
  const typeLabel = resolveDepartmentTypeLabel(t, department);
  if (shortName && typeLabel) {
    return t('department.list.subtitleTypeAndShort', { type: typeLabel, shortName });
  }
  if (shortName) return t('department.list.shortNameValue', { shortName });
  if (typeLabel) return t('department.list.typeValue', { type: typeLabel });
  return undefined;
};

const DepartmentListScreenWeb = () => {
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
    selectedDepartmentIds,
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
    onToggleDepartmentSelection,
    onTogglePageSelection,
    onClearSelection,
    onBulkDelete,
    resolveFilterOperatorOptions,
    onDepartmentPress,
    onEdit,
    onDelete,
    onAdd,
  } = useDepartmentListScreen();

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
      title={t('department.list.emptyTitle')}
      description={t('department.list.emptyMessage')}
      action={
        onAdd ? (
          <StyledAddButton
            type="button"
            onClick={onAdd}
            onPress={onAdd}
            accessibilityLabel={t('department.list.addLabel')}
            accessibilityHint={t('department.list.addHint')}
            testID="department-list-empty-add"
          >
            <Icon glyph="+" size="xs" decorative />
            <StyledAddLabel>{t('department.list.addLabel')}</StyledAddLabel>
          </StyledAddButton>
        ) : undefined
      }
      testID="department-list-empty-state"
    />
  );

  const noResultsComponent = (
    <EmptyState
      title={t('department.list.noResultsTitle')}
      description={t('department.list.noResultsMessage')}
      action={
        <StyledFilterButton
          type="button"
          onClick={onClearSearchAndFilters}
          testID="department-list-clear-search"
          aria-label={t('department.list.clearSearchAndFilters')}
        >
          {t('department.list.clearSearchAndFilters')}
        </StyledFilterButton>
      }
      testID="department-list-no-results"
    />
  );

  const retryAction = onRetry ? (
    <Button
      variant="surface"
      size="small"
      onPress={onRetry}
      accessibilityLabel={t('common.retry')}
      accessibilityHint={t('common.retryHint')}
      testID="department-list-retry"
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
        sortLabel: t('department.list.sortBy', { field: resolveColumnLabel(t, column) }),
        width: columnLayout.width,
        minWidth: columnLayout.minWidth,
        align: columnLayout.align,
        truncate: columnLayout.truncate,
        renderCell: (department) => {
          const value = resolveDepartmentCell(t, department, column);
          if (column === 'status' && value && typeof value === 'object') {
            return <StyledStatusBadge $tone={value.tone}>{value.label}</StyledStatusBadge>;
          }
          if (column === 'name') {
            return <StyledPrimaryCellText>{value}</StyledPrimaryCellText>;
          }
          if (column === 'shortName') {
            return <StyledCodeCellText>{value}</StyledCodeCellText>;
          }
          if (column === 'type') {
            return <StyledCodeCellText>{value}</StyledCodeCellText>;
          }
          return value;
        },
        getCellTitle: (department) => {
          const value = resolveDepartmentCell(t, department, column);
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
      isRowSelected: (department) => Boolean(department?.id) && selectedDepartmentIds.includes(department.id),
      onToggleRow: (department) => onToggleDepartmentSelection(department?.id),
      selectAllLabel: t('department.list.selectPage'),
      selectRowLabel: (department) => t('department.list.selectDepartment', {
        name: resolveDepartmentTitle(t, department),
      }),
      headerCheckboxTestId: 'department-select-page',
      rowCheckboxTestIdPrefix: 'department-select',
    };
  }, [
    onBulkDelete,
    allPageSelected,
    onTogglePageSelection,
    selectedDepartmentIds,
    onToggleDepartmentSelection,
    t,
  ]);

  const handleTableRowPress = useCallback((department) => {
    if (!department?.id) return;
    onDepartmentPress(department.id);
  }, [onDepartmentPress]);

  const renderTableRowActions = useCallback((department) => {
    const departmentId = department?.id;
    if (!departmentId) return null;

    return (
      <StyledRowActions>
        <StyledActionButton
          type="button"
          onClick={(event) => {
            event.stopPropagation();
            onDepartmentPress(departmentId);
          }}
          data-testid={`department-view-${departmentId}`}
        >
          {t('department.list.view')}
        </StyledActionButton>

        {onEdit ? (
          <StyledActionButton
            type="button"
            onClick={(event) => onEdit(departmentId, event)}
            data-testid={`department-edit-${departmentId}`}
          >
            {t('department.list.edit')}
          </StyledActionButton>
        ) : null}

        {onDelete ? (
          <StyledDangerActionButton
            type="button"
            onClick={(event) => onDelete(departmentId, event)}
            data-testid={`department-delete-${departmentId}`}
          >
            {t('common.remove')}
          </StyledDangerActionButton>
        ) : null}
      </StyledRowActions>
    );
  }, [onDepartmentPress, onEdit, onDelete, t]);

  const searchBarSection = (
    <StyledToolbar data-testid="department-list-toolbar">
      <StyledSearchSlot>
        <TextField
          value={search}
          onChange={(e) => onSearch(e.target.value)}
          placeholder={t('department.list.searchPlaceholder')}
          accessibilityLabel={t('department.list.searchLabel')}
          density="compact"
          type="search"
          testID="department-list-search"
        />
      </StyledSearchSlot>

      <StyledScopeSlot>
        <StyledControlLabel>{t('department.list.searchScopeLabel')}</StyledControlLabel>
        <Select
          value={searchScope}
          onValueChange={onSearchScopeChange}
          options={searchScopeOptions}
          accessibilityLabel={t('department.list.searchScopeLabel')}
          compact
          testID="department-list-search-scope"
        />
      </StyledScopeSlot>

      <StyledToolbarActions>
        {isTableMode ? (
          <StyledTableSettingsButton
            type="button"
            onClick={onOpenTableSettings}
            aria-label={t('department.list.tableSettings')}
            data-testid="department-table-settings"
          >
            {t('department.list.tableSettings')}
          </StyledTableSettingsButton>
        ) : null}

        {onAdd ? (
          <StyledAddButton
            type="button"
            onClick={onAdd}
            onPress={onAdd}
            accessibilityLabel={t('department.list.addLabel')}
            accessibilityHint={t('department.list.addHint')}
            testID="department-list-add"
          >
            <Icon glyph="+" size="xs" decorative />
            <StyledAddLabel>{t('department.list.addLabel')}</StyledAddLabel>
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
          data-testid="department-filter-toggle"
        >
          <StyledFilterChevron $collapsed={isFilterPanelCollapsed} aria-hidden="true">
            {'\u25BE'}
          </StyledFilterChevron>
        </StyledFilterToggleButton>
      </StyledFilterHeader>

      {!isFilterPanelCollapsed ? (
        <StyledFilterBody data-testid="department-filter-body">
          <Select
            value={filterLogic}
            onValueChange={onFilterLogicChange}
            options={filterLogicOptions}
            label={t('department.list.filterLogicLabel')}
            accessibilityLabel={t('department.list.filterLogicLabel')}
            compact
            testID="department-filter-logic"
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
                  label={t('department.list.filterFieldLabel')}
                  compact
                  testID={`department-filter-field-${index}`}
                />

                <Select
                  value={filter.operator}
                  onValueChange={(value) => onFilterOperatorChange(filter.id, value)}
                  options={operatorOptions}
                  label={t('department.list.filterOperatorLabel')}
                  compact
                  testID={`department-filter-operator-${index}`}
                />

                {isStatusFilter ? (
                  <Select
                    value={filter.value || 'active'}
                    onValueChange={(value) => onFilterValueChange(filter.id, value)}
                    options={[
                      { value: 'active', label: t('department.list.statusActive') },
                      { value: 'inactive', label: t('department.list.statusInactive') },
                    ]}
                    label={t('department.list.filterValueLabel')}
                    compact
                    testID={`department-filter-value-${index}`}
                  />
                ) : (
                  <TextField
                    value={filter.value}
                    onChange={(event) => onFilterValueChange(filter.id, event.target.value)}
                    label={t('department.list.filterValueLabel')}
                    placeholder={t('department.list.filterValuePlaceholder')}
                    density="compact"
                    testID={`department-filter-value-${index}`}
                  />
                )}

                <StyledFilterRowActions>
                  <StyledFilterButton
                    type="button"
                    onClick={() => onRemoveFilter(filter.id)}
                    aria-label={t('department.list.removeFilter')}
                    testID={`department-filter-remove-${index}`}
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
              testID="department-filter-add"
            >
              {t('department.list.addFilter')}
            </StyledFilterButton>
            <StyledFilterButton
              type="button"
              onClick={onClearSearchAndFilters}
              testID="department-filter-clear"
            >
              {t('department.list.clearSearchAndFilters')}
            </StyledFilterButton>
          </StyledFilterActions>
        </StyledFilterBody>
      ) : null}
    </StyledFilterPanel>
  );

  const bulkActionsBar = onBulkDelete && selectedDepartmentIds.length > 0 ? (
    <StyledBulkBar data-testid="department-bulk-bar">
      <StyledBulkInfo>
        {t('department.list.bulkSelectedCount', { count: selectedDepartmentIds.length })}
      </StyledBulkInfo>
      <StyledBulkActions>
        <StyledActionButton
          type="button"
          onClick={onClearSelection}
          data-testid="department-bulk-clear"
        >
          {t('department.list.clearSelection')}
        </StyledActionButton>
        <StyledDangerActionButton
          type="button"
          onClick={onBulkDelete}
          data-testid="department-bulk-delete"
        >
          {t('department.list.bulkDelete')}
        </StyledDangerActionButton>
      </StyledBulkActions>
    </StyledBulkBar>
  ) : null;

  const tableStatusContent = showEmpty ? emptyComponent : (hasNoResults ? noResultsComponent : null);

  const paginationContent = showList ? (
    <StyledPaginationInfo>
      {t('department.list.pageSummary', { page, totalPages, total: totalItems })}
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
        data-testid="department-page-prev"
      >
        {'<'}
      </StyledPaginationNavButton>

      <StyledPaginationControl>
        <StyledPaginationControlLabel>
          {t('department.list.pageSizeLabel')}
        </StyledPaginationControlLabel>
        <StyledPaginationSelectSlot>
          <Select
            value={String(pageSize)}
            onValueChange={onPageSizeChange}
            options={pageSizeOptions}
            accessibilityLabel={t('department.list.pageSizeLabel')}
            compact
            testID="department-page-size"
          />
        </StyledPaginationSelectSlot>
      </StyledPaginationControl>

      <StyledPaginationControl>
        <StyledPaginationControlLabel>
          {t('department.list.densityLabel')}
        </StyledPaginationControlLabel>
        <StyledPaginationSelectSlot>
          <Select
            value={density}
            onValueChange={onDensityChange}
            options={densityOptions}
            accessibilityLabel={t('department.list.densityLabel')}
            compact
            testID="department-density"
          />
        </StyledPaginationSelectSlot>
      </StyledPaginationControl>

      <StyledPaginationNavButton
        type="button"
        onClick={() => onPageChange(page + 1)}
        disabled={page >= totalPages}
        aria-label={t('common.next')}
        title={t('common.next')}
        data-testid="department-page-next"
      >
        {'>'}
      </StyledPaginationNavButton>
    </StyledPaginationActions>
  ) : null;

  return (
    <StyledContainer role="main" aria-label={t('department.list.title')}>
      {noticeMessage ? (
        <Snackbar
          visible={Boolean(noticeMessage)}
          message={noticeMessage}
          variant="success"
          position="bottom"
          onDismiss={onDismissNotice}
          testID="department-list-notice"
        />
      ) : null}

      <StyledContent>
        {!isTableMode ? searchBarSection : null}
        {!isTableMode ? filterBarSection : null}
        {!isTableMode ? bulkActionsBar : null}

        <Card
          variant="outlined"
          accessibilityLabel={t('department.list.accessibilityLabel')}
          testID="department-list-card"
        >
          <StyledListBody
            role="region"
            aria-label={t('department.list.accessibilityLabel')}
            data-testid="department-list"
            testID="department-list"
          >
            <StyledStateStack>
              {showError ? (
                <ErrorState
                  size={ErrorStateSizes.SMALL}
                  title={t('listScaffold.errorState.title')}
                  description={errorMessage}
                  action={retryAction}
                  testID="department-list-error"
                />
              ) : null}

              {showOffline ? (
                <OfflineState
                  size={OfflineStateSizes.SMALL}
                  title={t('shell.banners.offline.title')}
                  description={t('shell.banners.offline.message')}
                  action={retryAction}
                  testID="department-list-offline"
                />
              ) : null}

              {showOfflineBanner ? (
                <OfflineState
                  size={OfflineStateSizes.SMALL}
                  title={t('shell.banners.offline.title')}
                  description={t('shell.banners.offline.message')}
                  action={retryAction}
                  testID="department-list-offline-banner"
                />
              ) : null}
            </StyledStateStack>

            {isLoading ? (
              <LoadingSpinner accessibilityLabel={t('common.loading')} testID="department-list-loading" />
            ) : null}

            {!isTableMode && showEmpty ? emptyComponent : null}
            {!isTableMode && hasNoResults ? noResultsComponent : null}

            {showDesktopTable ? (
              <DataTable
                columns={tableColumns}
                rows={rows}
                getRowKey={(department, index) => department?.id ?? `department-${index}`}
                rowDensity={density}
                sortField={sortField}
                sortDirection={sortDirection}
                onSort={onSort}
                selection={tableSelection}
                renderRowActions={renderTableRowActions}
                rowActionsLabel={t('department.list.columnActions')}
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
                testID="department-table"
              />
            ) : null}

            {showList && !isTableMode ? (
              <StyledMobileList role="list">
                {rows.map((department, index) => {
                  const title = resolveDepartmentTitle(t, department);
                  const leadingGlyph = String(title || 'D').charAt(0).toUpperCase();
                  const departmentId = department?.id;
                  const itemKey = departmentId ?? `department-${index}`;
                  const statusLabel = department?.is_active
                    ? t('department.list.statusActive')
                    : t('department.list.statusInactive');
                  const statusTone = department?.is_active ? 'success' : 'warning';
                  return (
                    <li key={itemKey} role="listitem">
                      <ListItem
                        leading={{ glyph: leadingGlyph, tone: 'inverse', backgroundTone: 'primary' }}
                        title={title}
                        subtitle={resolveDepartmentSubtitle(t, department)}
                        metadata={[]}
                        status={{
                          label: statusLabel,
                          tone: statusTone,
                          showDot: true,
                          accessibilityLabel: t('department.list.statusLabel'),
                        }}
                        density="compact"
                        onPress={departmentId ? () => onDepartmentPress(departmentId) : undefined}
                        onView={departmentId ? () => onDepartmentPress(departmentId) : undefined}
                        onEdit={onEdit && departmentId ? (event) => onEdit(departmentId, event) : undefined}
                        onDelete={onDelete && departmentId ? (event) => onDelete(departmentId, event) : undefined}
                        viewLabel={t('department.list.view')}
                        viewHint={t('department.list.viewHint')}
                        editLabel={t('department.list.edit')}
                        editHint={t('department.list.editHint')}
                        deleteLabel={t('common.remove')}
                        deleteHint={t('department.list.deleteHint')}
                        onMore={departmentId ? () => onDepartmentPress(departmentId) : undefined}
                        moreLabel={t('common.more')}
                        moreHint={t('department.list.viewHint')}
                        viewTestID={`department-view-${itemKey}`}
                        editTestID={`department-edit-${itemKey}`}
                        deleteTestID={`department-delete-${itemKey}`}
                        moreTestID={`department-more-${itemKey}`}
                        accessibilityLabel={t('department.list.itemLabel', { name: title })}
                        accessibilityHint={t('department.list.itemHint', { name: title })}
                        testID={`department-item-${itemKey}`}
                      />
                    </li>
                  );
                })}
              </StyledMobileList>
            ) : null}

            {!isTableMode && showList ? (
              <StyledPagination>
                <StyledPaginationInfo>
                  {t('department.list.pageSummary', { page, totalPages, total: totalItems })}
                </StyledPaginationInfo>

                <StyledPaginationActions>
                  <StyledPaginationNavButton
                    type="button"
                    onClick={() => onPageChange(page - 1)}
                    disabled={page <= 1}
                    aria-label={t('common.previous')}
                    title={t('common.previous')}
                    data-testid="department-page-prev"
                  >
                    {'<'}
                  </StyledPaginationNavButton>

                  <StyledPaginationControl>
                    <StyledPaginationControlLabel>
                      {t('department.list.pageSizeLabel')}
                    </StyledPaginationControlLabel>
                    <StyledPaginationSelectSlot>
                      <Select
                        value={String(pageSize)}
                        onValueChange={onPageSizeChange}
                        options={pageSizeOptions}
                        accessibilityLabel={t('department.list.pageSizeLabel')}
                        compact
                        testID="department-page-size"
                      />
                    </StyledPaginationSelectSlot>
                  </StyledPaginationControl>

                  <StyledPaginationControl>
                    <StyledPaginationControlLabel>
                      {t('department.list.densityLabel')}
                    </StyledPaginationControlLabel>
                    <StyledPaginationSelectSlot>
                      <Select
                        value={density}
                        onValueChange={onDensityChange}
                        options={densityOptions}
                        accessibilityLabel={t('department.list.densityLabel')}
                        compact
                        testID="department-density"
                      />
                    </StyledPaginationSelectSlot>
                  </StyledPaginationControl>

                  <StyledPaginationNavButton
                    type="button"
                    onClick={() => onPageChange(page + 1)}
                    disabled={page >= totalPages}
                    aria-label={t('common.next')}
                    title={t('common.next')}
                    data-testid="department-page-next"
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
          accessibilityLabel={t('department.list.tableSettings')}
          testID="department-table-settings-modal"
        >
          <StyledSettingsBody>
            <StyledSettingsSection>
              <StyledSettingsTitle>{t('department.list.visibleColumns')}</StyledSettingsTitle>
              {columnOrder.map((column) => (
                <StyledColumnRow key={column}>
                  <Checkbox
                    checked={visibleColumns.includes(column)}
                    onChange={() => onToggleColumnVisibility(column)}
                    label={resolveColumnLabel(t, column)}
                    testID={`department-column-visible-${column}`}
                  />

                  <StyledColumnMoveControls>
                    <StyledMoveButton
                      type="button"
                      onClick={() => onMoveColumnLeft(column)}
                      aria-label={t('department.list.moveColumnLeft', {
                        column: resolveColumnLabel(t, column),
                      })}
                      disabled={columnOrder.indexOf(column) === 0}
                      data-testid={`department-column-left-${column}`}
                    >
                      {'<'}
                    </StyledMoveButton>
                    <StyledMoveButton
                      type="button"
                      onClick={() => onMoveColumnRight(column)}
                      aria-label={t('department.list.moveColumnRight', {
                        column: resolveColumnLabel(t, column),
                      })}
                      disabled={columnOrder.indexOf(column) === columnOrder.length - 1}
                      data-testid={`department-column-right-${column}`}
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
                data-testid="department-table-settings-reset"
              >
                {t('department.list.resetTablePreferences')}
              </StyledFilterButton>
            </StyledSettingsActions>
          </StyledSettingsBody>
        </Modal>
      </StyledContent>
    </StyledContainer>
  );
};

export default DepartmentListScreenWeb;


