/**
 * RoomListScreen - Web
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
} from './RoomListScreen.web.styles';
import useRoomListScreen from './useRoomListScreen';

const resolveColumnLabel = (t, column) => {
  if (column === 'name') return t('room.list.columnName');
  if (column === 'tenant') return t('room.list.columnTenant');
  if (column === 'facility') return t('room.list.columnFacility');
  if (column === 'ward') return t('room.list.columnWard');
  if (column === 'floor') return t('room.list.columnFloor');
  return column;
};

const TABLE_COLUMN_LAYOUT = {
  name: { width: 230, minWidth: 190, align: 'left' },
  tenant: { width: 210, minWidth: 170, align: 'left' },
  facility: { width: 200, minWidth: 170, align: 'left' },
  ward: { width: 190, minWidth: 160, align: 'left' },
  floor: { width: 150, minWidth: 120, align: 'left' },
};

const resolveFloorMeta = (t, floorValue) => {
  const normalized = String(floorValue ?? '').trim();
  if (normalized) {
    return { label: normalized, tone: 'info' };
  }
  return { label: t('common.notAvailable'), tone: 'warning' };
};

const resolveMobileSubtitle = (t, tenant, facility, ward) => {
  const available = [tenant, facility, ward].filter((value) => (
    value && value !== t('common.notAvailable')
  ));
  if (available.length === 0) return undefined;
  if (available.length === 3) {
    return t('room.list.contextValue', {
      tenant: available[0],
      facility: available[1],
      ward: available[2],
    });
  }
  if (available.length === 2) {
    return t('room.list.partialContextValue', {
      first: available[0],
      second: available[1],
    });
  }
  if (available.length === 1) return available[0];
  return undefined;
};

const RoomListScreenWeb = () => {
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
    hasActiveSearchOrFilter,
    sortField,
    sortDirection,
    columnOrder,
    visibleColumns,
    selectedRoomIds,
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
    onToggleRoomSelection,
    onTogglePageSelection,
    onClearSelection,
    onBulkDelete,
    resolveFilterOperatorOptions,
    resolveRoomNameText,
    resolveRoomTenantText,
    resolveRoomFacilityText,
    resolveRoomWardText,
    resolveRoomFloorText,
    onRoomPress,
    onEdit,
    onDelete,
    onAdd,
  } = useRoomListScreen();

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
      title={t('room.list.emptyTitle')}
      description={t('room.list.emptyMessage')}
      action={
        onAdd ? (
          <StyledAddButton
            type="button"
            onClick={onAdd}
            onPress={onAdd}
            accessibilityLabel={t('room.list.addLabel')}
            accessibilityHint={t('room.list.addHint')}
            testID="room-list-empty-add"
          >
            <Icon glyph="+" size="xs" decorative />
            <StyledAddLabel>{t('room.list.addLabel')}</StyledAddLabel>
          </StyledAddButton>
        ) : undefined
      }
      testID="room-list-empty-state"
    />
  );

  const noResultsComponent = (
    <EmptyState
      title={t('room.list.noResultsTitle')}
      description={t('room.list.noResultsMessage')}
      action={
        <StyledFilterButton
          type="button"
          onClick={onClearSearchAndFilters}
          testID="room-list-clear-search"
          aria-label={t('room.list.clearSearchAndFilters')}
        >
          {t('room.list.clearSearchAndFilters')}
        </StyledFilterButton>
      }
      testID="room-list-no-results"
    />
  );

  const retryAction = onRetry ? (
    <Button
      variant="surface"
      size="small"
      onPress={onRetry}
      accessibilityLabel={t('common.retry')}
      accessibilityHint={t('common.retryHint')}
      testID="room-list-retry"
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
        sortLabel: t('room.list.sortBy', { field: resolveColumnLabel(t, column) }),
        width: columnLayout.width,
        minWidth: columnLayout.minWidth,
        align: columnLayout.align,
        truncate: columnLayout.truncate,
        renderCell: (room) => {
          if (column === 'name') {
            return <StyledPrimaryCellText>{resolveRoomNameText(room)}</StyledPrimaryCellText>;
          }
          if (column === 'tenant') {
            return <StyledCodeCellText>{resolveRoomTenantText(room)}</StyledCodeCellText>;
          }
          if (column === 'facility') {
            return <StyledCodeCellText>{resolveRoomFacilityText(room)}</StyledCodeCellText>;
          }
          if (column === 'ward') {
            return <StyledCodeCellText>{resolveRoomWardText(room)}</StyledCodeCellText>;
          }
          if (column === 'floor') {
            const floorMeta = resolveFloorMeta(t, resolveRoomFloorText(room));
            return <StyledStatusBadge $tone={floorMeta.tone}>{floorMeta.label}</StyledStatusBadge>;
          }
          return t('common.notAvailable');
        },
        getCellTitle: (room) => {
          let value = '';
          if (column === 'name') value = resolveRoomNameText(room);
          else if (column === 'tenant') value = resolveRoomTenantText(room);
          else if (column === 'facility') value = resolveRoomFacilityText(room);
          else if (column === 'ward') value = resolveRoomWardText(room);
          else if (column === 'floor') value = resolveFloorMeta(t, resolveRoomFloorText(room)).label;
          return typeof value === 'string' ? value : undefined;
        },
      };
    }),
    [
      visibleColumns,
      t,
      resolveRoomNameText,
      resolveRoomTenantText,
      resolveRoomFacilityText,
      resolveRoomWardText,
      resolveRoomFloorText,
    ]
  );

  const tableSelection = useMemo(() => {
    if (!onBulkDelete) return undefined;
    return {
      enabled: true,
      allSelected: allPageSelected,
      onToggleAll: (checked) => onTogglePageSelection(Boolean(checked)),
      isRowSelected: (room) => Boolean(room?.id) && selectedRoomIds.includes(room.id),
      onToggleRow: (room) => onToggleRoomSelection(room?.id),
      selectAllLabel: t('room.list.selectPage'),
      selectRowLabel: (room) => t('room.list.selectRoom', {
        name: resolveRoomNameText(room),
      }),
      headerCheckboxTestId: 'room-select-page',
      rowCheckboxTestIdPrefix: 'room-select',
    };
  }, [
    onBulkDelete,
    allPageSelected,
    onTogglePageSelection,
    selectedRoomIds,
    onToggleRoomSelection,
    t,
    resolveRoomNameText,
  ]);

  const handleTableRowPress = useCallback((room) => {
    if (!room?.id) return;
    onRoomPress(room.id);
  }, [onRoomPress]);

  const renderTableRowActions = useCallback((room) => {
    const roomId = room?.id;
    if (!roomId) return null;

    return (
      <StyledRowActions>
        <StyledActionButton
          type="button"
          onClick={(event) => {
            event.stopPropagation();
            onRoomPress(roomId);
          }}
          data-testid={`room-view-${roomId}`}
        >
          {t('room.list.view')}
        </StyledActionButton>

        {onEdit ? (
          <StyledActionButton
            type="button"
            onClick={(event) => onEdit(roomId, event)}
            data-testid={`room-edit-${roomId}`}
          >
            {t('room.list.edit')}
          </StyledActionButton>
        ) : null}

        {onDelete ? (
          <StyledDangerActionButton
            type="button"
            onClick={(event) => onDelete(roomId, event)}
            data-testid={`room-delete-${roomId}`}
          >
            {t('common.remove')}
          </StyledDangerActionButton>
        ) : null}
      </StyledRowActions>
    );
  }, [onRoomPress, onEdit, onDelete, t]);

  const searchBarSection = (
    <StyledToolbar data-testid="room-list-toolbar">
      <StyledSearchSlot>
        <TextField
          value={search}
          onChange={(e) => onSearch(e.target.value)}
          placeholder={t('room.list.searchPlaceholder')}
          accessibilityLabel={t('room.list.searchLabel')}
          density="compact"
          type="search"
          testID="room-list-search"
        />
      </StyledSearchSlot>

      <StyledScopeSlot>
        <StyledControlLabel>{t('room.list.searchScopeLabel')}</StyledControlLabel>
        <Select
          value={searchScope}
          onValueChange={onSearchScopeChange}
          options={searchScopeOptions}
          accessibilityLabel={t('room.list.searchScopeLabel')}
          compact
          testID="room-list-search-scope"
        />
      </StyledScopeSlot>

      <StyledToolbarActions>
        {isTableMode ? (
          <StyledTableSettingsButton
            type="button"
            onClick={onOpenTableSettings}
            aria-label={t('room.list.tableSettings')}
            data-testid="room-table-settings"
          >
            {t('room.list.tableSettings')}
          </StyledTableSettingsButton>
        ) : null}

        {onAdd ? (
          <StyledAddButton
            type="button"
            onClick={onAdd}
            onPress={onAdd}
            accessibilityLabel={t('room.list.addLabel')}
            accessibilityHint={t('room.list.addHint')}
            testID="room-list-add"
          >
            <Icon glyph="+" size="xs" decorative />
            <StyledAddLabel>{t('room.list.addLabel')}</StyledAddLabel>
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
          data-testid="room-filter-toggle"
        >
          <StyledFilterChevron $collapsed={isFilterPanelCollapsed} aria-hidden="true">
            {'\u25BE'}
          </StyledFilterChevron>
        </StyledFilterToggleButton>
      </StyledFilterHeader>

      {!isFilterPanelCollapsed ? (
        <StyledFilterBody data-testid="room-filter-body">
          <Select
            value={filterLogic}
            onValueChange={onFilterLogicChange}
            options={filterLogicOptions}
            label={t('room.list.filterLogicLabel')}
            accessibilityLabel={t('room.list.filterLogicLabel')}
            compact
            testID="room-filter-logic"
          />

          {filters.map((filter, index) => {
            const operatorOptions = resolveFilterOperatorOptions(filter.field);
            return (
              <StyledFilterRow key={filter.id}>
                <Select
                  value={filter.field}
                  onValueChange={(value) => onFilterFieldChange(filter.id, value)}
                  options={filterFieldOptions}
                  label={t('room.list.filterFieldLabel')}
                  compact
                  testID={`room-filter-field-${index}`}
                />

                <Select
                  value={filter.operator}
                  onValueChange={(value) => onFilterOperatorChange(filter.id, value)}
                  options={operatorOptions}
                  label={t('room.list.filterOperatorLabel')}
                  compact
                  testID={`room-filter-operator-${index}`}
                />

                <TextField
                  value={filter.value}
                  onChange={(event) => onFilterValueChange(filter.id, event.target.value)}
                  label={t('room.list.filterValueLabel')}
                  placeholder={t('room.list.filterValuePlaceholder')}
                  density="compact"
                  testID={`room-filter-value-${index}`}
                />

                <StyledFilterRowActions>
                  <StyledFilterButton
                    type="button"
                    onClick={() => onRemoveFilter(filter.id)}
                    aria-label={t('room.list.removeFilter')}
                    testID={`room-filter-remove-${index}`}
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
              testID="room-filter-add"
            >
              {t('room.list.addFilter')}
            </StyledFilterButton>
            <StyledFilterButton
              type="button"
              onClick={onClearSearchAndFilters}
              testID="room-filter-clear"
            >
              {t('room.list.clearSearchAndFilters')}
            </StyledFilterButton>
          </StyledFilterActions>
        </StyledFilterBody>
      ) : null}
    </StyledFilterPanel>
  );

  const bulkActionsBar = onBulkDelete && selectedRoomIds.length > 0 ? (
    <StyledBulkBar data-testid="room-bulk-bar">
      <StyledBulkInfo>
        {t('room.list.bulkSelectedCount', { count: selectedRoomIds.length })}
      </StyledBulkInfo>
      <StyledBulkActions>
        <StyledActionButton
          type="button"
          onClick={onClearSelection}
          data-testid="room-bulk-clear"
        >
          {t('room.list.clearSelection')}
        </StyledActionButton>
        <StyledDangerActionButton
          type="button"
          onClick={onBulkDelete}
          data-testid="room-bulk-delete"
        >
          {t('room.list.bulkDelete')}
        </StyledDangerActionButton>
      </StyledBulkActions>
    </StyledBulkBar>
  ) : null;

  const tableStatusContent = showEmpty ? emptyComponent : (hasNoResults ? noResultsComponent : null);

  const paginationContent = showList ? (
    <StyledPaginationInfo>
      {t('room.list.pageSummary', { page, totalPages, total: totalItems })}
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
        data-testid="room-page-prev"
      >
        {'<'}
      </StyledPaginationNavButton>

      <StyledPaginationControl>
        <StyledPaginationControlLabel>
          {t('room.list.pageSizeLabel')}
        </StyledPaginationControlLabel>
        <StyledPaginationSelectSlot>
          <Select
            value={String(pageSize)}
            onValueChange={onPageSizeChange}
            options={pageSizeOptions}
            accessibilityLabel={t('room.list.pageSizeLabel')}
            compact
            testID="room-page-size"
          />
        </StyledPaginationSelectSlot>
      </StyledPaginationControl>

      <StyledPaginationControl>
        <StyledPaginationControlLabel>
          {t('room.list.densityLabel')}
        </StyledPaginationControlLabel>
        <StyledPaginationSelectSlot>
          <Select
            value={density}
            onValueChange={onDensityChange}
            options={densityOptions}
            accessibilityLabel={t('room.list.densityLabel')}
            compact
            testID="room-density"
          />
        </StyledPaginationSelectSlot>
      </StyledPaginationControl>

      <StyledPaginationNavButton
        type="button"
        onClick={() => onPageChange(page + 1)}
        disabled={page >= totalPages}
        aria-label={t('common.next')}
        title={t('common.next')}
        data-testid="room-page-next"
      >
        {'>'}
      </StyledPaginationNavButton>
    </StyledPaginationActions>
  ) : null;

  return (
    <StyledContainer role="main" aria-label={t('room.list.title')}>
      {noticeMessage ? (
        <Snackbar
          visible={Boolean(noticeMessage)}
          message={noticeMessage}
          variant="success"
          position="bottom"
          onDismiss={onDismissNotice}
          testID="room-list-notice"
        />
      ) : null}

      <StyledContent>
        {!isTableMode ? searchBarSection : null}
        {!isTableMode ? filterBarSection : null}
        {!isTableMode ? bulkActionsBar : null}

        <Card
          variant="outlined"
          accessibilityLabel={t('room.list.accessibilityLabel')}
          testID="room-list-card"
        >
          <StyledListBody
            role="region"
            aria-label={t('room.list.accessibilityLabel')}
            data-testid="room-list"
            testID="room-list"
          >
            <StyledStateStack>
              {showError ? (
                <ErrorState
                  size={ErrorStateSizes.SMALL}
                  title={t('listScaffold.errorState.title')}
                  description={errorMessage}
                  action={retryAction}
                  testID="room-list-error"
                />
              ) : null}

              {showOffline ? (
                <OfflineState
                  size={OfflineStateSizes.SMALL}
                  title={t('shell.banners.offline.title')}
                  description={t('shell.banners.offline.message')}
                  action={retryAction}
                  testID="room-list-offline"
                />
              ) : null}

              {showOfflineBanner ? (
                <OfflineState
                  size={OfflineStateSizes.SMALL}
                  title={t('shell.banners.offline.title')}
                  description={t('shell.banners.offline.message')}
                  action={retryAction}
                  testID="room-list-offline-banner"
                />
              ) : null}
            </StyledStateStack>

            {isLoading ? (
              <LoadingSpinner accessibilityLabel={t('common.loading')} testID="room-list-loading" />
            ) : null}

            {!isTableMode && showEmpty ? emptyComponent : null}
            {!isTableMode && hasNoResults ? noResultsComponent : null}

            {showDesktopTable ? (
              <DataTable
                columns={tableColumns}
                rows={rows}
                getRowKey={(room, index) => room?.id ?? `room-${index}`}
                rowDensity={density}
                sortField={sortField}
                sortDirection={sortDirection}
                onSort={onSort}
                selection={tableSelection}
                renderRowActions={renderTableRowActions}
                rowActionsLabel={t('room.list.columnActions')}
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
                hasActiveFilters={hasActiveSearchOrFilter}
                bulkActionsBar={bulkActionsBar}
                statusContent={tableStatusContent}
                pagination={paginationContent}
                tableNavigation={tableNavigationContent}
                showDefaultEmptyRow={false}
                minWidth={980}
                testID="room-table"
              />
            ) : null}

            {showList && !isTableMode ? (
              <StyledMobileList role="list">
                {rows.map((room, index) => {
                  const title = resolveRoomNameText(room);
                  const leadingGlyph = String(title || 'R').charAt(0).toUpperCase();
                  const roomId = room?.id;
                  const itemKey = roomId ?? `room-${index}`;
                  const floorMeta = resolveFloorMeta(t, resolveRoomFloorText(room));
                  const tenant = resolveRoomTenantText(room);
                  const facility = resolveRoomFacilityText(room);
                  const ward = resolveRoomWardText(room);
                  return (
                    <li key={itemKey} role="listitem">
                      <ListItem
                        leading={{ glyph: leadingGlyph, tone: 'inverse', backgroundTone: 'primary' }}
                        title={title}
                        subtitle={resolveMobileSubtitle(t, tenant, facility, ward)}
                        metadata={[]}
                        status={{
                          label: floorMeta.label,
                          tone: floorMeta.tone,
                          showDot: true,
                          accessibilityLabel: t('room.list.floorLabel'),
                        }}
                        density="compact"
                        onPress={roomId ? () => onRoomPress(roomId) : undefined}
                        onView={roomId ? () => onRoomPress(roomId) : undefined}
                        onEdit={onEdit && roomId ? (event) => onEdit(roomId, event) : undefined}
                        onDelete={onDelete && roomId ? (event) => onDelete(roomId, event) : undefined}
                        viewLabel={t('room.list.view')}
                        viewHint={t('room.list.viewHint')}
                        editLabel={t('room.list.edit')}
                        editHint={t('room.list.editHint')}
                        deleteLabel={t('common.remove')}
                        deleteHint={t('room.list.deleteHint')}
                        onMore={roomId ? () => onRoomPress(roomId) : undefined}
                        moreLabel={t('common.more')}
                        moreHint={t('room.list.viewHint')}
                        viewTestID={`room-view-${itemKey}`}
                        editTestID={`room-edit-${itemKey}`}
                        deleteTestID={`room-delete-${itemKey}`}
                        moreTestID={`room-more-${itemKey}`}
                        accessibilityLabel={t('room.list.itemLabel', { name: title })}
                        accessibilityHint={t('room.list.itemHint', { name: title })}
                        testID={`room-item-${itemKey}`}
                      />
                    </li>
                  );
                })}
              </StyledMobileList>
            ) : null}

            {!isTableMode && showList ? (
              <StyledPagination>
                <StyledPaginationInfo>
                  {t('room.list.pageSummary', { page, totalPages, total: totalItems })}
                </StyledPaginationInfo>

                <StyledPaginationActions>
                  <StyledPaginationNavButton
                    type="button"
                    onClick={() => onPageChange(page - 1)}
                    disabled={page <= 1}
                    aria-label={t('common.previous')}
                    title={t('common.previous')}
                    data-testid="room-page-prev"
                  >
                    {'<'}
                  </StyledPaginationNavButton>

                  <StyledPaginationControl>
                    <StyledPaginationControlLabel>
                      {t('room.list.pageSizeLabel')}
                    </StyledPaginationControlLabel>
                    <StyledPaginationSelectSlot>
                      <Select
                        value={String(pageSize)}
                        onValueChange={onPageSizeChange}
                        options={pageSizeOptions}
                        accessibilityLabel={t('room.list.pageSizeLabel')}
                        compact
                        testID="room-page-size"
                      />
                    </StyledPaginationSelectSlot>
                  </StyledPaginationControl>

                  <StyledPaginationControl>
                    <StyledPaginationControlLabel>
                      {t('room.list.densityLabel')}
                    </StyledPaginationControlLabel>
                    <StyledPaginationSelectSlot>
                      <Select
                        value={density}
                        onValueChange={onDensityChange}
                        options={densityOptions}
                        accessibilityLabel={t('room.list.densityLabel')}
                        compact
                        testID="room-density"
                      />
                    </StyledPaginationSelectSlot>
                  </StyledPaginationControl>

                  <StyledPaginationNavButton
                    type="button"
                    onClick={() => onPageChange(page + 1)}
                    disabled={page >= totalPages}
                    aria-label={t('common.next')}
                    title={t('common.next')}
                    data-testid="room-page-next"
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
          accessibilityLabel={t('room.list.tableSettings')}
          testID="room-table-settings-modal"
        >
          <StyledSettingsBody>
            <StyledSettingsSection>
              <StyledSettingsTitle>{t('room.list.visibleColumns')}</StyledSettingsTitle>
              {columnOrder.map((column) => (
                <StyledColumnRow key={column}>
                  <Checkbox
                    checked={visibleColumns.includes(column)}
                    onChange={() => onToggleColumnVisibility(column)}
                    label={resolveColumnLabel(t, column)}
                    testID={`room-column-visible-${column}`}
                  />

                  <StyledColumnMoveControls>
                    <StyledMoveButton
                      type="button"
                      onClick={() => onMoveColumnLeft(column)}
                      aria-label={t('room.list.moveColumnLeft', {
                        column: resolveColumnLabel(t, column),
                      })}
                      disabled={columnOrder.indexOf(column) === 0}
                      data-testid={`room-column-left-${column}`}
                    >
                      {'<'}
                    </StyledMoveButton>
                    <StyledMoveButton
                      type="button"
                      onClick={() => onMoveColumnRight(column)}
                      aria-label={t('room.list.moveColumnRight', {
                        column: resolveColumnLabel(t, column),
                      })}
                      disabled={columnOrder.indexOf(column) === columnOrder.length - 1}
                      data-testid={`room-column-right-${column}`}
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
                data-testid="room-table-settings-reset"
              >
                {t('room.list.resetTablePreferences')}
              </StyledFilterButton>
            </StyledSettingsActions>
          </StyledSettingsBody>
        </Modal>
      </StyledContent>
    </StyledContainer>
  );
};

export default RoomListScreenWeb;





