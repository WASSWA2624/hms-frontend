/**
 * AddressListScreen - Web
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
} from './AddressListScreen.web.styles';
import useAddressListScreen from './useAddressListScreen';

const resolveAddressTitle = (t, Address) => {
  const name = humanizeIdentifier(
    Address?.line1
    ?? Address?.name
  );
  if (name) return String(name).trim();
  return t('address.list.unnamed');
};

const resolveAddressTenantLabel = (t, Address) => {
  const value = humanizeIdentifier(
    Address?.tenant_name
    ?? Address?.tenant?.name
    ?? Address?.tenant_label
  );
  if (value) return String(value).trim();
  return t('common.notAvailable');
};

const resolveAddressFacilityLabel = (t, Address) => {
  const value = humanizeIdentifier(
    Address?.facility_name
    ?? Address?.facility?.name
    ?? Address?.facility_label
  );
  if (value) return String(value).trim();
  return t('common.notAvailable');
};

const resolveColumnLabel = (t, column) => {
  if (column === 'name') return t('address.list.columnName');
  if (column === 'tenant') return t('address.list.columnTenant');
  if (column === 'facility') return t('address.list.columnFacility');
  if (column === 'status') return t('address.list.columnStatus');
  return column;
};

const TABLE_COLUMN_LAYOUT = {
  name: { width: 240, minWidth: 200, align: 'left' },
  tenant: { width: 220, minWidth: 180, align: 'left' },
  facility: { width: 220, minWidth: 180, align: 'left' },
  status: { width: 130, minWidth: 112, align: 'center', truncate: false },
};

const resolveAddressCell = (t, Address, column) => {
  if (column === 'name') return resolveAddressTitle(t, Address);
  if (column === 'tenant') return resolveAddressTenantLabel(t, Address);
  if (column === 'facility') return resolveAddressFacilityLabel(t, Address);
  if (column === 'status') {
    const isActive = Boolean(Address?.is_active);
    return {
      label: isActive ? t('address.list.statusActive') : t('address.list.statusInactive'),
      tone: isActive ? 'success' : 'warning',
    };
  }
  return t('common.notAvailable');
};

const resolveMobileSubtitle = (t, Address) => {
  const tenant = resolveAddressTenantLabel(t, Address);
  const facility = resolveAddressFacilityLabel(t, Address);

  if (tenant !== t('common.notAvailable') && facility !== t('common.notAvailable')) {
    return t('address.list.contextValue', { tenant, facility });
  }
  if (facility !== t('common.notAvailable')) {
    return t('address.list.facilityValue', { facility });
  }
  if (tenant !== t('common.notAvailable')) {
    return t('address.list.tenantValue', { tenant });
  }
  return undefined;
};

const AddressListScreenWeb = () => {
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
    selectedAddressIds,
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
    onToggleAddressSelection,
    onTogglePageSelection,
    onClearSelection,
    onBulkDelete,
    resolveFilterOperatorOptions,
    onAddressPress,
    onEdit,
    onDelete,
    onAdd,
  } = useAddressListScreen();

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
      title={t('address.list.emptyTitle')}
      description={t('address.list.emptyMessage')}
      action={
        onAdd ? (
          <StyledAddButton
            type="button"
            onClick={onAdd}
            onPress={onAdd}
            accessibilityLabel={t('address.list.addLabel')}
            accessibilityHint={t('address.list.addHint')}
            testID="address-list-empty-add"
          >
            <Icon glyph="+" size="xs" decorative />
            <StyledAddLabel>{t('address.list.addLabel')}</StyledAddLabel>
          </StyledAddButton>
        ) : undefined
      }
      testID="address-list-empty-state"
    />
  );

  const noResultsComponent = (
    <EmptyState
      title={t('address.list.noResultsTitle')}
      description={t('address.list.noResultsMessage')}
      action={
        <StyledFilterButton
          type="button"
          onClick={onClearSearchAndFilters}
          testID="address-list-clear-search"
          aria-label={t('address.list.clearSearchAndFilters')}
        >
          {t('address.list.clearSearchAndFilters')}
        </StyledFilterButton>
      }
      testID="address-list-no-results"
    />
  );

  const retryAction = onRetry ? (
    <Button
      variant="surface"
      size="small"
      onPress={onRetry}
      accessibilityLabel={t('common.retry')}
      accessibilityHint={t('common.retryHint')}
      testID="address-list-retry"
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
        sortLabel: t('address.list.sortBy', { field: resolveColumnLabel(t, column) }),
        width: columnLayout.width,
        minWidth: columnLayout.minWidth,
        align: columnLayout.align,
        truncate: columnLayout.truncate,
        renderCell: (Address) => {
          const value = resolveAddressCell(t, Address, column);
          if (column === 'status' && value && typeof value === 'object') {
            return <StyledStatusBadge $tone={value.tone}>{value.label}</StyledStatusBadge>;
          }
          if (column === 'name') {
            return <StyledPrimaryCellText>{value}</StyledPrimaryCellText>;
          }
          if (column === 'tenant' || column === 'facility') {
            return <StyledCodeCellText>{value}</StyledCodeCellText>;
          }
          return value;
        },
        getCellTitle: (Address) => {
          const value = resolveAddressCell(t, Address, column);
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
      isRowSelected: (Address) => Boolean(Address?.id) && selectedAddressIds.includes(Address.id),
      onToggleRow: (Address) => onToggleAddressSelection(Address?.id),
      selectAllLabel: t('address.list.selectPage'),
      selectRowLabel: (Address) => t('address.list.selectAddress', {
        name: resolveAddressTitle(t, Address),
      }),
      headerCheckboxTestId: 'address-select-page',
      rowCheckboxTestIdPrefix: 'address-select',
    };
  }, [
    onBulkDelete,
    allPageSelected,
    onTogglePageSelection,
    selectedAddressIds,
    onToggleAddressSelection,
    t,
  ]);

  const handleTableRowPress = useCallback((Address) => {
    if (!Address?.id) return;
    onAddressPress(Address.id);
  }, [onAddressPress]);

  const renderTableRowActions = useCallback((Address) => {
    const AddressId = Address?.id;
    if (!AddressId) return null;

    return (
      <StyledRowActions>
        <StyledActionButton
          type="button"
          onClick={(event) => {
            event.stopPropagation();
            onAddressPress(AddressId);
          }}
          data-testid={`address-view-${AddressId}`}
        >
          {t('address.list.view')}
        </StyledActionButton>

        {onEdit ? (
          <StyledActionButton
            type="button"
            onClick={(event) => onEdit(AddressId, event)}
            data-testid={`address-edit-${AddressId}`}
          >
            {t('address.list.edit')}
          </StyledActionButton>
        ) : null}

        {onDelete ? (
          <StyledDangerActionButton
            type="button"
            onClick={(event) => onDelete(AddressId, event)}
            data-testid={`address-delete-${AddressId}`}
          >
            {t('common.remove')}
          </StyledDangerActionButton>
        ) : null}
      </StyledRowActions>
    );
  }, [onAddressPress, onEdit, onDelete, t]);

  const searchBarSection = (
    <StyledToolbar data-testid="address-list-toolbar">
      <StyledSearchSlot>
        <TextField
          value={search}
          onChange={(e) => onSearch(e.target.value)}
          placeholder={t('address.list.searchPlaceholder')}
          accessibilityLabel={t('address.list.searchLabel')}
          density="compact"
          type="search"
          testID="address-list-search"
        />
      </StyledSearchSlot>

      <StyledScopeSlot>
        <StyledControlLabel>{t('address.list.searchScopeLabel')}</StyledControlLabel>
        <Select
          value={searchScope}
          onValueChange={onSearchScopeChange}
          options={searchScopeOptions}
          accessibilityLabel={t('address.list.searchScopeLabel')}
          compact
          testID="address-list-search-scope"
        />
      </StyledScopeSlot>

      <StyledToolbarActions>
        {isTableMode ? (
          <StyledTableSettingsButton
            type="button"
            onClick={onOpenTableSettings}
            aria-label={t('address.list.tableSettings')}
            data-testid="address-table-settings"
          >
            {t('address.list.tableSettings')}
          </StyledTableSettingsButton>
        ) : null}

        {onAdd ? (
          <StyledAddButton
            type="button"
            onClick={onAdd}
            onPress={onAdd}
            accessibilityLabel={t('address.list.addLabel')}
            accessibilityHint={t('address.list.addHint')}
            testID="address-list-add"
          >
            <Icon glyph="+" size="xs" decorative />
            <StyledAddLabel>{t('address.list.addLabel')}</StyledAddLabel>
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
          data-testid="address-filter-toggle"
        >
          <StyledFilterChevron $collapsed={isFilterPanelCollapsed} aria-hidden="true">
            {'\u25BE'}
          </StyledFilterChevron>
        </StyledFilterToggleButton>
      </StyledFilterHeader>

      {!isFilterPanelCollapsed ? (
        <StyledFilterBody data-testid="address-filter-body">
          <Select
            value={filterLogic}
            onValueChange={onFilterLogicChange}
            options={filterLogicOptions}
            label={t('address.list.filterLogicLabel')}
            accessibilityLabel={t('address.list.filterLogicLabel')}
            compact
            testID="address-filter-logic"
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
                  label={t('address.list.filterFieldLabel')}
                  compact
                  testID={`address-filter-field-${index}`}
                />

                <Select
                  value={filter.operator}
                  onValueChange={(value) => onFilterOperatorChange(filter.id, value)}
                  options={operatorOptions}
                  label={t('address.list.filterOperatorLabel')}
                  compact
                  testID={`address-filter-operator-${index}`}
                />

                {isStatusFilter ? (
                  <Select
                    value={filter.value || 'active'}
                    onValueChange={(value) => onFilterValueChange(filter.id, value)}
                    options={[
                      { value: 'active', label: t('address.list.statusActive') },
                      { value: 'inactive', label: t('address.list.statusInactive') },
                    ]}
                    label={t('address.list.filterValueLabel')}
                    compact
                    testID={`address-filter-value-${index}`}
                  />
                ) : (
                  <TextField
                    value={filter.value}
                    onChange={(event) => onFilterValueChange(filter.id, event.target.value)}
                    label={t('address.list.filterValueLabel')}
                    placeholder={t('address.list.filterValuePlaceholder')}
                    density="compact"
                    testID={`address-filter-value-${index}`}
                  />
                )}

                <StyledFilterRowActions>
                  <StyledFilterButton
                    type="button"
                    onClick={() => onRemoveFilter(filter.id)}
                    aria-label={t('address.list.removeFilter')}
                    testID={`address-filter-remove-${index}`}
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
              testID="address-filter-add"
            >
              {t('address.list.addFilter')}
            </StyledFilterButton>
            <StyledFilterButton
              type="button"
              onClick={onClearSearchAndFilters}
              testID="address-filter-clear"
            >
              {t('address.list.clearSearchAndFilters')}
            </StyledFilterButton>
          </StyledFilterActions>
        </StyledFilterBody>
      ) : null}
    </StyledFilterPanel>
  );

  const bulkActionsBar = onBulkDelete && selectedAddressIds.length > 0 ? (
    <StyledBulkBar data-testid="address-bulk-bar">
      <StyledBulkInfo>
        {t('address.list.bulkSelectedCount', { count: selectedAddressIds.length })}
      </StyledBulkInfo>
      <StyledBulkActions>
        <StyledActionButton
          type="button"
          onClick={onClearSelection}
          data-testid="address-bulk-clear"
        >
          {t('address.list.clearSelection')}
        </StyledActionButton>
        <StyledDangerActionButton
          type="button"
          onClick={onBulkDelete}
          data-testid="address-bulk-delete"
        >
          {t('address.list.bulkDelete')}
        </StyledDangerActionButton>
      </StyledBulkActions>
    </StyledBulkBar>
  ) : null;

  const tableStatusContent = showEmpty ? emptyComponent : (hasNoResults ? noResultsComponent : null);

  const paginationContent = showList ? (
    <StyledPaginationInfo>
      {t('address.list.pageSummary', { page, totalPages, total: totalItems })}
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
        data-testid="address-page-prev"
      >
        {'<'}
      </StyledPaginationNavButton>

      <StyledPaginationControl>
        <StyledPaginationControlLabel>
          {t('address.list.pageSizeLabel')}
        </StyledPaginationControlLabel>
        <StyledPaginationSelectSlot>
          <Select
            value={String(pageSize)}
            onValueChange={onPageSizeChange}
            options={pageSizeOptions}
            accessibilityLabel={t('address.list.pageSizeLabel')}
            compact
            testID="address-page-size"
          />
        </StyledPaginationSelectSlot>
      </StyledPaginationControl>

      <StyledPaginationControl>
        <StyledPaginationControlLabel>
          {t('address.list.densityLabel')}
        </StyledPaginationControlLabel>
        <StyledPaginationSelectSlot>
          <Select
            value={density}
            onValueChange={onDensityChange}
            options={densityOptions}
            accessibilityLabel={t('address.list.densityLabel')}
            compact
            testID="address-density"
          />
        </StyledPaginationSelectSlot>
      </StyledPaginationControl>

      <StyledPaginationNavButton
        type="button"
        onClick={() => onPageChange(page + 1)}
        disabled={page >= totalPages}
        aria-label={t('common.next')}
        title={t('common.next')}
        data-testid="address-page-next"
      >
        {'>'}
      </StyledPaginationNavButton>
    </StyledPaginationActions>
  ) : null;

  return (
    <StyledContainer role="main" aria-label={t('address.list.title')}>
      {noticeMessage ? (
        <Snackbar
          visible={Boolean(noticeMessage)}
          message={noticeMessage}
          variant="success"
          position="bottom"
          onDismiss={onDismissNotice}
          testID="address-list-notice"
        />
      ) : null}

      <StyledContent>
        {!isTableMode ? searchBarSection : null}
        {!isTableMode ? filterBarSection : null}
        {!isTableMode ? bulkActionsBar : null}

        <Card
          variant="outlined"
          accessibilityLabel={t('address.list.accessibilityLabel')}
          testID="address-list-card"
        >
          <StyledListBody
            role="region"
            aria-label={t('address.list.accessibilityLabel')}
            data-testid="address-list"
            testID="address-list"
          >
            <StyledStateStack>
              {showError ? (
                <ErrorState
                  size={ErrorStateSizes.SMALL}
                  title={t('listScaffold.errorState.title')}
                  description={errorMessage}
                  action={retryAction}
                  testID="address-list-error"
                />
              ) : null}

              {showOffline ? (
                <OfflineState
                  size={OfflineStateSizes.SMALL}
                  title={t('shell.banners.offline.title')}
                  description={t('shell.banners.offline.message')}
                  action={retryAction}
                  testID="address-list-offline"
                />
              ) : null}

              {showOfflineBanner ? (
                <OfflineState
                  size={OfflineStateSizes.SMALL}
                  title={t('shell.banners.offline.title')}
                  description={t('shell.banners.offline.message')}
                  action={retryAction}
                  testID="address-list-offline-banner"
                />
              ) : null}
            </StyledStateStack>

            {isLoading ? (
              <LoadingSpinner accessibilityLabel={t('common.loading')} testID="address-list-loading" />
            ) : null}

            {!isTableMode && showEmpty ? emptyComponent : null}
            {!isTableMode && hasNoResults ? noResultsComponent : null}

            {showDesktopTable ? (
              <DataTable
                columns={tableColumns}
                rows={rows}
                getRowKey={(Address, index) => Address?.id ?? `address-${index}`}
                rowDensity={density}
                sortField={sortField}
                sortDirection={sortDirection}
                onSort={onSort}
                selection={tableSelection}
                renderRowActions={renderTableRowActions}
                rowActionsLabel={t('address.list.columnActions')}
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
                testID="address-table"
              />
            ) : null}

            {showList && !isTableMode ? (
              <StyledMobileList role="list">
                {rows.map((Address, index) => {
                  const title = resolveAddressTitle(t, Address);
                  const leadingGlyph = String(title || 'B').charAt(0).toUpperCase();
                  const AddressId = Address?.id;
                  const itemKey = AddressId ?? `address-${index}`;
                  const statusLabel = Address?.is_active
                    ? t('address.list.statusActive')
                    : t('address.list.statusInactive');
                  const statusTone = Address?.is_active ? 'success' : 'warning';
                  return (
                    <li key={itemKey} role="listitem">
                      <ListItem
                        leading={{ glyph: leadingGlyph, tone: 'inverse', backgroundTone: 'primary' }}
                        title={title}
                        subtitle={resolveMobileSubtitle(t, Address)}
                        metadata={[]}
                        status={{
                          label: statusLabel,
                          tone: statusTone,
                          showDot: true,
                          accessibilityLabel: t('address.list.statusLabel'),
                        }}
                        density="compact"
                        onPress={AddressId ? () => onAddressPress(AddressId) : undefined}
                        onView={AddressId ? () => onAddressPress(AddressId) : undefined}
                        onEdit={onEdit && AddressId ? (event) => onEdit(AddressId, event) : undefined}
                        onDelete={onDelete && AddressId ? (event) => onDelete(AddressId, event) : undefined}
                        viewLabel={t('address.list.view')}
                        viewHint={t('address.list.viewHint')}
                        editLabel={t('address.list.edit')}
                        editHint={t('address.list.editHint')}
                        deleteLabel={t('common.remove')}
                        deleteHint={t('address.list.deleteHint')}
                        onMore={AddressId ? () => onAddressPress(AddressId) : undefined}
                        moreLabel={t('common.more')}
                        moreHint={t('address.list.viewHint')}
                        viewTestID={`address-view-${itemKey}`}
                        editTestID={`address-edit-${itemKey}`}
                        deleteTestID={`address-delete-${itemKey}`}
                        moreTestID={`address-more-${itemKey}`}
                        accessibilityLabel={t('address.list.itemLabel', { name: title })}
                        accessibilityHint={t('address.list.itemHint', { name: title })}
                        testID={`address-item-${itemKey}`}
                      />
                    </li>
                  );
                })}
              </StyledMobileList>
            ) : null}

            {!isTableMode && showList ? (
              <StyledPagination>
                <StyledPaginationInfo>
                  {t('address.list.pageSummary', { page, totalPages, total: totalItems })}
                </StyledPaginationInfo>

                <StyledPaginationActions>
                  <StyledPaginationNavButton
                    type="button"
                    onClick={() => onPageChange(page - 1)}
                    disabled={page <= 1}
                    aria-label={t('common.previous')}
                    title={t('common.previous')}
                    data-testid="address-page-prev"
                  >
                    {'<'}
                  </StyledPaginationNavButton>

                  <StyledPaginationControl>
                    <StyledPaginationControlLabel>
                      {t('address.list.pageSizeLabel')}
                    </StyledPaginationControlLabel>
                    <StyledPaginationSelectSlot>
                      <Select
                        value={String(pageSize)}
                        onValueChange={onPageSizeChange}
                        options={pageSizeOptions}
                        accessibilityLabel={t('address.list.pageSizeLabel')}
                        compact
                        testID="address-page-size"
                      />
                    </StyledPaginationSelectSlot>
                  </StyledPaginationControl>

                  <StyledPaginationControl>
                    <StyledPaginationControlLabel>
                      {t('address.list.densityLabel')}
                    </StyledPaginationControlLabel>
                    <StyledPaginationSelectSlot>
                      <Select
                        value={density}
                        onValueChange={onDensityChange}
                        options={densityOptions}
                        accessibilityLabel={t('address.list.densityLabel')}
                        compact
                        testID="address-density"
                      />
                    </StyledPaginationSelectSlot>
                  </StyledPaginationControl>

                  <StyledPaginationNavButton
                    type="button"
                    onClick={() => onPageChange(page + 1)}
                    disabled={page >= totalPages}
                    aria-label={t('common.next')}
                    title={t('common.next')}
                    data-testid="address-page-next"
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
          accessibilityLabel={t('address.list.tableSettings')}
          testID="address-table-settings-modal"
        >
          <StyledSettingsBody>
            <StyledSettingsSection>
              <StyledSettingsTitle>{t('address.list.visibleColumns')}</StyledSettingsTitle>
              {columnOrder.map((column) => (
                <StyledColumnRow key={column}>
                  <Checkbox
                    checked={visibleColumns.includes(column)}
                    onChange={() => onToggleColumnVisibility(column)}
                    label={resolveColumnLabel(t, column)}
                    testID={`address-column-visible-${column}`}
                  />

                  <StyledColumnMoveControls>
                    <StyledMoveButton
                      type="button"
                      onClick={() => onMoveColumnLeft(column)}
                      aria-label={t('address.list.moveColumnLeft', {
                        column: resolveColumnLabel(t, column),
                      })}
                      disabled={columnOrder.indexOf(column) === 0}
                      data-testid={`address-column-left-${column}`}
                    >
                      {'<'}
                    </StyledMoveButton>
                    <StyledMoveButton
                      type="button"
                      onClick={() => onMoveColumnRight(column)}
                      aria-label={t('address.list.moveColumnRight', {
                        column: resolveColumnLabel(t, column),
                      })}
                      disabled={columnOrder.indexOf(column) === columnOrder.length - 1}
                      data-testid={`address-column-right-${column}`}
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
                data-testid="address-table-settings-reset"
              >
                {t('address.list.resetTablePreferences')}
              </StyledFilterButton>
            </StyledSettingsActions>
          </StyledSettingsBody>
        </Modal>
      </StyledContent>
    </StyledContainer>
  );
};

export default AddressListScreenWeb;
