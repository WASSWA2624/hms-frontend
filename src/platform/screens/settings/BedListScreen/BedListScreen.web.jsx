/**
 * BedListScreen - Web
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
} from './BedListScreen.web.styles';
import useBedListScreen from './useBedListScreen';

const resolveColumnLabel = (t, column) => {
  if (column === 'label') return t('bed.list.columnLabel');
  if (column === 'tenant') return t('bed.list.columnTenant');
  if (column === 'facility') return t('bed.list.columnFacility');
  if (column === 'ward') return t('bed.list.columnWard');
  if (column === 'room') return t('bed.list.columnRoom');
  if (column === 'status') return t('bed.list.columnStatus');
  return column;
};

const TABLE_COLUMN_LAYOUT = {
  label: { width: 220, minWidth: 180, align: 'left' },
  tenant: { width: 210, minWidth: 170, align: 'left' },
  facility: { width: 200, minWidth: 170, align: 'left' },
  ward: { width: 190, minWidth: 160, align: 'left' },
  room: { width: 170, minWidth: 150, align: 'left' },
  status: { width: 130, minWidth: 112, align: 'center', truncate: false },
};

const resolveStatusMeta = (t, statusValue) => {
  if (statusValue === 'AVAILABLE') {
    return { label: t('bed.list.statusAvailable'), tone: 'success' };
  }
  if (statusValue === 'OCCUPIED') {
    return { label: t('bed.list.statusOccupied'), tone: 'warning' };
  }
  if (statusValue === 'RESERVED') {
    return { label: t('bed.list.statusReserved'), tone: 'info' };
  }
  if (statusValue === 'OUT_OF_SERVICE') {
    return { label: t('bed.list.statusOutOfService'), tone: 'error' };
  }
  return { label: t('common.notAvailable'), tone: 'warning' };
};

const resolveMobileSubtitle = (t, tenant, facility, ward, room) => {
  const available = [tenant, facility, ward, room].filter((value) => (
    value && value !== t('common.notAvailable')
  ));
  if (available.length === 0) return undefined;
  if (available.length === 4) {
    return t('bed.list.contextValue', {
      tenant: available[0],
      facility: available[1],
      ward: available[2],
      room: available[3],
    });
  }
  if (available.length === 3) {
    return t('bed.list.partialContextValue', {
      tenant: available[0],
      facility: available[1],
      ward: available[2],
    });
  }
  if (available.length === 2) {
    return t('bed.list.shortContextValue', {
      first: available[0],
      second: available[1],
    });
  }
  if (available.length === 1) return available[0];
  return undefined;
};

const BedListScreenWeb = () => {
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
    selectedBedIds,
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
    onToggleBedSelection,
    onTogglePageSelection,
    onClearSelection,
    onBulkDelete,
    resolveFilterOperatorOptions,
    resolveBedLabelText,
    resolveBedTenantText,
    resolveBedFacilityText,
    resolveBedWardText,
    resolveBedRoomText,
    resolveBedStatusText,
    onBedPress,
    onEdit,
    onDelete,
    onAdd,
  } = useBedListScreen();

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
      title={t('bed.list.emptyTitle')}
      description={t('bed.list.emptyMessage')}
      action={
        onAdd ? (
          <StyledAddButton
            type="button"
            onClick={onAdd}
            onPress={onAdd}
            accessibilityLabel={t('bed.list.addLabel')}
            accessibilityHint={t('bed.list.addHint')}
            testID="bed-list-empty-add"
          >
            <Icon glyph="+" size="xs" decorative />
            <StyledAddLabel>{t('bed.list.addLabel')}</StyledAddLabel>
          </StyledAddButton>
        ) : undefined
      }
      testID="bed-list-empty-state"
    />
  );

  const noResultsComponent = (
    <EmptyState
      title={t('bed.list.noResultsTitle')}
      description={t('bed.list.noResultsMessage')}
      action={
        <StyledFilterButton
          type="button"
          onClick={onClearSearchAndFilters}
          testID="bed-list-clear-search"
          aria-label={t('bed.list.clearSearchAndFilters')}
        >
          {t('bed.list.clearSearchAndFilters')}
        </StyledFilterButton>
      }
      testID="bed-list-no-results"
    />
  );

  const retryAction = onRetry ? (
    <Button
      variant="surface"
      size="small"
      onPress={onRetry}
      accessibilityLabel={t('common.retry')}
      accessibilityHint={t('common.retryHint')}
      testID="bed-list-retry"
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
        sortLabel: t('bed.list.sortBy', { field: resolveColumnLabel(t, column) }),
        width: columnLayout.width,
        minWidth: columnLayout.minWidth,
        align: columnLayout.align,
        truncate: columnLayout.truncate,
        renderCell: (bed) => {
          if (column === 'status') {
            const statusMeta = resolveStatusMeta(t, resolveBedStatusText(bed));
            return <StyledStatusBadge $tone={statusMeta.tone}>{statusMeta.label}</StyledStatusBadge>;
          }
          if (column === 'label') {
            return <StyledPrimaryCellText>{resolveBedLabelText(bed)}</StyledPrimaryCellText>;
          }
          if (column === 'tenant') {
            return <StyledCodeCellText>{resolveBedTenantText(bed)}</StyledCodeCellText>;
          }
          if (column === 'facility') {
            return <StyledCodeCellText>{resolveBedFacilityText(bed)}</StyledCodeCellText>;
          }
          if (column === 'ward') {
            return <StyledCodeCellText>{resolveBedWardText(bed)}</StyledCodeCellText>;
          }
          if (column === 'room') {
            return <StyledCodeCellText>{resolveBedRoomText(bed)}</StyledCodeCellText>;
          }
          return t('common.notAvailable');
        },
        getCellTitle: (bed) => {
          let value = '';
          if (column === 'label') value = resolveBedLabelText(bed);
          else if (column === 'tenant') value = resolveBedTenantText(bed);
          else if (column === 'facility') value = resolveBedFacilityText(bed);
          else if (column === 'ward') value = resolveBedWardText(bed);
          else if (column === 'room') value = resolveBedRoomText(bed);
          else if (column === 'status') value = resolveStatusMeta(t, resolveBedStatusText(bed)).label;
          return typeof value === 'string' ? value : undefined;
        },
      };
    }),
    [
      visibleColumns,
      t,
      resolveBedLabelText,
      resolveBedTenantText,
      resolveBedFacilityText,
      resolveBedWardText,
      resolveBedRoomText,
      resolveBedStatusText,
    ]
  );

  const tableSelection = useMemo(() => {
    if (!onBulkDelete) return undefined;
    return {
      enabled: true,
      allSelected: allPageSelected,
      onToggleAll: (checked) => onTogglePageSelection(Boolean(checked)),
      isRowSelected: (Bed) => Boolean(Bed?.id) && selectedBedIds.includes(Bed.id),
      onToggleRow: (Bed) => onToggleBedSelection(Bed?.id),
      selectAllLabel: t('bed.list.selectPage'),
      selectRowLabel: (bed) => t('bed.list.selectBed', {
        name: resolveBedLabelText(bed),
      }),
      headerCheckboxTestId: 'bed-select-page',
      rowCheckboxTestIdPrefix: 'bed-select',
    };
  }, [
    onBulkDelete,
    allPageSelected,
    onTogglePageSelection,
    selectedBedIds,
    onToggleBedSelection,
    t,
    resolveBedLabelText,
  ]);

  const handleTableRowPress = useCallback((Bed) => {
    if (!Bed?.id) return;
    onBedPress(Bed.id);
  }, [onBedPress]);

  const renderTableRowActions = useCallback((Bed) => {
    const BedId = Bed?.id;
    if (!BedId) return null;

    return (
      <StyledRowActions>
        <StyledActionButton
          type="button"
          onClick={(event) => {
            event.stopPropagation();
            onBedPress(BedId);
          }}
          data-testid={`bed-view-${BedId}`}
        >
          {t('bed.list.view')}
        </StyledActionButton>

        {onEdit ? (
          <StyledActionButton
            type="button"
            onClick={(event) => onEdit(BedId, event)}
            data-testid={`bed-edit-${BedId}`}
          >
            {t('bed.list.edit')}
          </StyledActionButton>
        ) : null}

        {onDelete ? (
          <StyledDangerActionButton
            type="button"
            onClick={(event) => onDelete(BedId, event)}
            data-testid={`bed-delete-${BedId}`}
          >
            {t('common.remove')}
          </StyledDangerActionButton>
        ) : null}
      </StyledRowActions>
    );
  }, [onBedPress, onEdit, onDelete, t]);

  const searchBarSection = (
    <StyledToolbar data-testid="bed-list-toolbar">
      <StyledSearchSlot>
        <TextField
          value={search}
          onChange={(e) => onSearch(e.target.value)}
          placeholder={t('bed.list.searchPlaceholder')}
          accessibilityLabel={t('bed.list.searchLabel')}
          density="compact"
          type="search"
          testID="bed-list-search"
        />
      </StyledSearchSlot>

      <StyledScopeSlot>
        <StyledControlLabel>{t('bed.list.searchScopeLabel')}</StyledControlLabel>
        <Select
          value={searchScope}
          onValueChange={onSearchScopeChange}
          options={searchScopeOptions}
          accessibilityLabel={t('bed.list.searchScopeLabel')}
          compact
          testID="bed-list-search-scope"
        />
      </StyledScopeSlot>

      <StyledToolbarActions>
        {isTableMode ? (
          <StyledTableSettingsButton
            type="button"
            onClick={onOpenTableSettings}
            aria-label={t('bed.list.tableSettings')}
            data-testid="bed-table-settings"
          >
            {t('bed.list.tableSettings')}
          </StyledTableSettingsButton>
        ) : null}

        {onAdd ? (
          <StyledAddButton
            type="button"
            onClick={onAdd}
            onPress={onAdd}
            accessibilityLabel={t('bed.list.addLabel')}
            accessibilityHint={t('bed.list.addHint')}
            testID="bed-list-add"
          >
            <Icon glyph="+" size="xs" decorative />
            <StyledAddLabel>{t('bed.list.addLabel')}</StyledAddLabel>
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
          data-testid="bed-filter-toggle"
        >
          <StyledFilterChevron $collapsed={isFilterPanelCollapsed} aria-hidden="true">
            {'\u25BE'}
          </StyledFilterChevron>
        </StyledFilterToggleButton>
      </StyledFilterHeader>

      {!isFilterPanelCollapsed ? (
        <StyledFilterBody data-testid="bed-filter-body">
          <Select
            value={filterLogic}
            onValueChange={onFilterLogicChange}
            options={filterLogicOptions}
            label={t('bed.list.filterLogicLabel')}
            accessibilityLabel={t('bed.list.filterLogicLabel')}
            compact
            testID="bed-filter-logic"
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
                  label={t('bed.list.filterFieldLabel')}
                  compact
                  testID={`bed-filter-field-${index}`}
                />

                <Select
                  value={filter.operator}
                  onValueChange={(value) => onFilterOperatorChange(filter.id, value)}
                  options={operatorOptions}
                  label={t('bed.list.filterOperatorLabel')}
                  compact
                  testID={`bed-filter-operator-${index}`}
                />

                {isStatusFilter ? (
                  <Select
                    value={filter.value || 'AVAILABLE'}
                    onValueChange={(value) => onFilterValueChange(filter.id, value)}
                    options={[
                      { value: 'AVAILABLE', label: t('bed.list.statusAvailable') },
                      { value: 'OCCUPIED', label: t('bed.list.statusOccupied') },
                      { value: 'RESERVED', label: t('bed.list.statusReserved') },
                      { value: 'OUT_OF_SERVICE', label: t('bed.list.statusOutOfService') },
                    ]}
                    label={t('bed.list.filterValueLabel')}
                    compact
                    testID={`bed-filter-value-${index}`}
                  />
                ) : (
                  <TextField
                    value={filter.value}
                    onChange={(event) => onFilterValueChange(filter.id, event.target.value)}
                    label={t('bed.list.filterValueLabel')}
                    placeholder={t('bed.list.filterValuePlaceholder')}
                    density="compact"
                    testID={`bed-filter-value-${index}`}
                  />
                )}

                <StyledFilterRowActions>
                  <StyledFilterButton
                    type="button"
                    onClick={() => onRemoveFilter(filter.id)}
                    aria-label={t('bed.list.removeFilter')}
                    testID={`bed-filter-remove-${index}`}
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
              testID="bed-filter-add"
            >
              {t('bed.list.addFilter')}
            </StyledFilterButton>
            <StyledFilterButton
              type="button"
              onClick={onClearSearchAndFilters}
              testID="bed-filter-clear"
            >
              {t('bed.list.clearSearchAndFilters')}
            </StyledFilterButton>
          </StyledFilterActions>
        </StyledFilterBody>
      ) : null}
    </StyledFilterPanel>
  );

  const bulkActionsBar = onBulkDelete && selectedBedIds.length > 0 ? (
    <StyledBulkBar data-testid="bed-bulk-bar">
      <StyledBulkInfo>
        {t('bed.list.bulkSelectedCount', { count: selectedBedIds.length })}
      </StyledBulkInfo>
      <StyledBulkActions>
        <StyledActionButton
          type="button"
          onClick={onClearSelection}
          data-testid="bed-bulk-clear"
        >
          {t('bed.list.clearSelection')}
        </StyledActionButton>
        <StyledDangerActionButton
          type="button"
          onClick={onBulkDelete}
          data-testid="bed-bulk-delete"
        >
          {t('bed.list.bulkDelete')}
        </StyledDangerActionButton>
      </StyledBulkActions>
    </StyledBulkBar>
  ) : null;

  const tableStatusContent = showEmpty ? emptyComponent : (hasNoResults ? noResultsComponent : null);

  const paginationContent = showList ? (
    <StyledPaginationInfo>
      {t('bed.list.pageSummary', { page, totalPages, total: totalItems })}
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
        data-testid="bed-page-prev"
      >
        {'<'}
      </StyledPaginationNavButton>

      <StyledPaginationControl>
        <StyledPaginationControlLabel>
          {t('bed.list.pageSizeLabel')}
        </StyledPaginationControlLabel>
        <StyledPaginationSelectSlot>
          <Select
            value={String(pageSize)}
            onValueChange={onPageSizeChange}
            options={pageSizeOptions}
            accessibilityLabel={t('bed.list.pageSizeLabel')}
            compact
            testID="bed-page-size"
          />
        </StyledPaginationSelectSlot>
      </StyledPaginationControl>

      <StyledPaginationControl>
        <StyledPaginationControlLabel>
          {t('bed.list.densityLabel')}
        </StyledPaginationControlLabel>
        <StyledPaginationSelectSlot>
          <Select
            value={density}
            onValueChange={onDensityChange}
            options={densityOptions}
            accessibilityLabel={t('bed.list.densityLabel')}
            compact
            testID="bed-density"
          />
        </StyledPaginationSelectSlot>
      </StyledPaginationControl>

      <StyledPaginationNavButton
        type="button"
        onClick={() => onPageChange(page + 1)}
        disabled={page >= totalPages}
        aria-label={t('common.next')}
        title={t('common.next')}
        data-testid="bed-page-next"
      >
        {'>'}
      </StyledPaginationNavButton>
    </StyledPaginationActions>
  ) : null;

  return (
    <StyledContainer role="main" aria-label={t('bed.list.title')}>
      {noticeMessage ? (
        <Snackbar
          visible={Boolean(noticeMessage)}
          message={noticeMessage}
          variant="success"
          position="bottom"
          onDismiss={onDismissNotice}
          testID="bed-list-notice"
        />
      ) : null}

      <StyledContent>
        {!isTableMode ? searchBarSection : null}
        {!isTableMode ? filterBarSection : null}
        {!isTableMode ? bulkActionsBar : null}

        <Card
          variant="outlined"
          accessibilityLabel={t('bed.list.accessibilityLabel')}
          testID="bed-list-card"
        >
          <StyledListBody
            role="region"
            aria-label={t('bed.list.accessibilityLabel')}
            data-testid="bed-list"
            testID="bed-list"
          >
            <StyledStateStack>
              {showError ? (
                <ErrorState
                  size={ErrorStateSizes.SMALL}
                  title={t('listScaffold.errorState.title')}
                  description={errorMessage}
                  action={retryAction}
                  testID="bed-list-error"
                />
              ) : null}

              {showOffline ? (
                <OfflineState
                  size={OfflineStateSizes.SMALL}
                  title={t('shell.banners.offline.title')}
                  description={t('shell.banners.offline.message')}
                  action={retryAction}
                  testID="bed-list-offline"
                />
              ) : null}

              {showOfflineBanner ? (
                <OfflineState
                  size={OfflineStateSizes.SMALL}
                  title={t('shell.banners.offline.title')}
                  description={t('shell.banners.offline.message')}
                  action={retryAction}
                  testID="bed-list-offline-banner"
                />
              ) : null}
            </StyledStateStack>

            {isLoading ? (
              <LoadingSpinner accessibilityLabel={t('common.loading')} testID="bed-list-loading" />
            ) : null}

            {!isTableMode && showEmpty ? emptyComponent : null}
            {!isTableMode && hasNoResults ? noResultsComponent : null}

            {showDesktopTable ? (
              <DataTable
                columns={tableColumns}
                rows={rows}
                getRowKey={(Bed, index) => Bed?.id ?? `bed-${index}`}
                rowDensity={density}
                sortField={sortField}
                sortDirection={sortDirection}
                onSort={onSort}
                selection={tableSelection}
                renderRowActions={renderTableRowActions}
                rowActionsLabel={t('bed.list.columnActions')}
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
                minWidth={1120}
                testID="bed-table"
              />
            ) : null}

            {showList && !isTableMode ? (
              <StyledMobileList role="list">
                {rows.map((bed, index) => {
                  const title = resolveBedLabelText(bed);
                  const leadingGlyph = String(title || 'B').charAt(0).toUpperCase();
                  const bedId = bed?.id;
                  const itemKey = bedId ?? `bed-${index}`;
                  const statusMeta = resolveStatusMeta(t, resolveBedStatusText(bed));
                  const tenant = resolveBedTenantText(bed);
                  const facility = resolveBedFacilityText(bed);
                  const ward = resolveBedWardText(bed);
                  const room = resolveBedRoomText(bed);
                  return (
                    <li key={itemKey} role="listitem">
                      <ListItem
                        leading={{ glyph: leadingGlyph, tone: 'inverse', backgroundTone: 'primary' }}
                        title={title}
                        subtitle={resolveMobileSubtitle(t, tenant, facility, ward, room)}
                        metadata={[]}
                        status={{
                          label: statusMeta.label,
                          tone: statusMeta.tone,
                          showDot: true,
                          accessibilityLabel: t('bed.list.statusLabel'),
                        }}
                        density="compact"
                        onPress={bedId ? () => onBedPress(bedId) : undefined}
                        onView={bedId ? () => onBedPress(bedId) : undefined}
                        onEdit={onEdit && bedId ? (event) => onEdit(bedId, event) : undefined}
                        onDelete={onDelete && bedId ? (event) => onDelete(bedId, event) : undefined}
                        viewLabel={t('bed.list.view')}
                        viewHint={t('bed.list.viewHint')}
                        editLabel={t('bed.list.edit')}
                        editHint={t('bed.list.editHint')}
                        deleteLabel={t('common.remove')}
                        deleteHint={t('bed.list.deleteHint')}
                        onMore={bedId ? () => onBedPress(bedId) : undefined}
                        moreLabel={t('common.more')}
                        moreHint={t('bed.list.viewHint')}
                        viewTestID={`bed-view-${itemKey}`}
                        editTestID={`bed-edit-${itemKey}`}
                        deleteTestID={`bed-delete-${itemKey}`}
                        moreTestID={`bed-more-${itemKey}`}
                        accessibilityLabel={t('bed.list.itemLabel', { name: title })}
                        accessibilityHint={t('bed.list.itemHint', { name: title })}
                        testID={`bed-item-${itemKey}`}
                      />
                    </li>
                  );
                })}
              </StyledMobileList>
            ) : null}

            {!isTableMode && showList ? (
              <StyledPagination>
                <StyledPaginationInfo>
                  {t('bed.list.pageSummary', { page, totalPages, total: totalItems })}
                </StyledPaginationInfo>

                <StyledPaginationActions>
                  <StyledPaginationNavButton
                    type="button"
                    onClick={() => onPageChange(page - 1)}
                    disabled={page <= 1}
                    aria-label={t('common.previous')}
                    title={t('common.previous')}
                    data-testid="bed-page-prev"
                  >
                    {'<'}
                  </StyledPaginationNavButton>

                  <StyledPaginationControl>
                    <StyledPaginationControlLabel>
                      {t('bed.list.pageSizeLabel')}
                    </StyledPaginationControlLabel>
                    <StyledPaginationSelectSlot>
                      <Select
                        value={String(pageSize)}
                        onValueChange={onPageSizeChange}
                        options={pageSizeOptions}
                        accessibilityLabel={t('bed.list.pageSizeLabel')}
                        compact
                        testID="bed-page-size"
                      />
                    </StyledPaginationSelectSlot>
                  </StyledPaginationControl>

                  <StyledPaginationControl>
                    <StyledPaginationControlLabel>
                      {t('bed.list.densityLabel')}
                    </StyledPaginationControlLabel>
                    <StyledPaginationSelectSlot>
                      <Select
                        value={density}
                        onValueChange={onDensityChange}
                        options={densityOptions}
                        accessibilityLabel={t('bed.list.densityLabel')}
                        compact
                        testID="bed-density"
                      />
                    </StyledPaginationSelectSlot>
                  </StyledPaginationControl>

                  <StyledPaginationNavButton
                    type="button"
                    onClick={() => onPageChange(page + 1)}
                    disabled={page >= totalPages}
                    aria-label={t('common.next')}
                    title={t('common.next')}
                    data-testid="bed-page-next"
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
          accessibilityLabel={t('bed.list.tableSettings')}
          testID="bed-table-settings-modal"
        >
          <StyledSettingsBody>
            <StyledSettingsSection>
              <StyledSettingsTitle>{t('bed.list.visibleColumns')}</StyledSettingsTitle>
              {columnOrder.map((column) => (
                <StyledColumnRow key={column}>
                  <Checkbox
                    checked={visibleColumns.includes(column)}
                    onChange={() => onToggleColumnVisibility(column)}
                    label={resolveColumnLabel(t, column)}
                    testID={`bed-column-visible-${column}`}
                  />

                  <StyledColumnMoveControls>
                    <StyledMoveButton
                      type="button"
                      onClick={() => onMoveColumnLeft(column)}
                      aria-label={t('bed.list.moveColumnLeft', {
                        column: resolveColumnLabel(t, column),
                      })}
                      disabled={columnOrder.indexOf(column) === 0}
                      data-testid={`bed-column-left-${column}`}
                    >
                      {'<'}
                    </StyledMoveButton>
                    <StyledMoveButton
                      type="button"
                      onClick={() => onMoveColumnRight(column)}
                      aria-label={t('bed.list.moveColumnRight', {
                        column: resolveColumnLabel(t, column),
                      })}
                      disabled={columnOrder.indexOf(column) === columnOrder.length - 1}
                      data-testid={`bed-column-right-${column}`}
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
                data-testid="bed-table-settings-reset"
              >
                {t('bed.list.resetTablePreferences')}
              </StyledFilterButton>
            </StyledSettingsActions>
          </StyledSettingsBody>
        </Modal>
      </StyledContent>
    </StyledContainer>
  );
};

export default BedListScreenWeb;



