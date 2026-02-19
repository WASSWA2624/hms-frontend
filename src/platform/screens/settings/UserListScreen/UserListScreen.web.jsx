/**
 * UserListScreen - Web
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
} from './UserListScreen.web.styles';
import useUserListScreen from './useUserListScreen';

const resolveUserId = (userItem) => String(userItem?.id ?? userItem?.user_id ?? '').trim();

const resolveUserEmail = (userItem) => String(userItem?.email ?? '').trim();

const resolveUserPhone = (userItem) => String(userItem?.phone ?? '').trim();

const resolveUserStatusValue = (userItem) => String(userItem?.status ?? '').trim().toUpperCase();

const resolveUserStatusLabel = (t, value) => {
  if (!value) return t('common.notAvailable');
  const key = `user.status.${value}`;
  const resolved = t(key);
  return resolved === key ? value : resolved;
};

const resolveUserStatusState = (t, userItem) => {
  const normalized = resolveUserStatusValue(userItem);
  const label = resolveUserStatusLabel(t, normalized);
  return {
    label,
    tone: normalized === 'ACTIVE' ? 'success' : 'warning',
  };
};

const resolveUserTitle = (t, userItem) => {
  const email = resolveUserEmail(userItem);
  if (email) return email;
  const phone = resolveUserPhone(userItem);
  if (phone) return phone;
  return t('user.list.unnamed');
};

const resolveUserTenantLabel = (t, userItem, canViewTechnicalIds = false) => {
  const value = humanizeIdentifier(
    userItem?.tenant_name
    ?? userItem?.tenant?.name
    ?? userItem?.tenant_label
  );
  if (value) return String(value).trim();
  if (canViewTechnicalIds) {
    const tenantId = String(userItem?.tenant_id ?? '').trim();
    if (tenantId) return tenantId;
  }
  if (String(userItem?.tenant_id ?? '').trim()) {
    return t('user.list.currentTenant');
  }
  return t('common.notAvailable');
};

const resolveUserFacilityLabel = (t, userItem, canViewTechnicalIds = false) => {
  const value = humanizeIdentifier(
    userItem?.facility_name
    ?? userItem?.facility?.name
    ?? userItem?.facility_label
  );
  if (value) return String(value).trim();
  if (canViewTechnicalIds) {
    const facilityId = String(userItem?.facility_id ?? '').trim();
    if (facilityId) return facilityId;
  }
  if (String(userItem?.facility_id ?? '').trim()) {
    return t('user.list.currentFacility');
  }
  return t('common.notAvailable');
};

const resolveColumnLabel = (t, column) => {
  if (column === 'email') return t('user.list.columnEmail');
  if (column === 'phone') return t('user.list.columnPhone');
  if (column === 'status') return t('user.list.columnStatus');
  if (column === 'tenant') return t('user.list.columnTenant');
  if (column === 'facility') return t('user.list.columnFacility');
  return column;
};

const TABLE_COLUMN_LAYOUT = {
  email: { width: 260, minWidth: 220, align: 'left' },
  phone: { width: 180, minWidth: 150, align: 'left' },
  status: { width: 140, minWidth: 120, align: 'center', truncate: false },
  tenant: { width: 220, minWidth: 180, align: 'left' },
  facility: { width: 220, minWidth: 180, align: 'left' },
};

const resolveUserCell = (t, userItem, column, canViewTechnicalIds = false) => {
  if (column === 'email') return resolveUserEmail(userItem) || t('common.notAvailable');
  if (column === 'phone') return resolveUserPhone(userItem) || t('common.notAvailable');
  if (column === 'status') return resolveUserStatusState(t, userItem);
  if (column === 'tenant') return resolveUserTenantLabel(t, userItem, canViewTechnicalIds);
  if (column === 'facility') return resolveUserFacilityLabel(t, userItem, canViewTechnicalIds);
  return t('common.notAvailable');
};

const resolveMobileSubtitle = (t, userItem, canViewTechnicalIds = false) => {
  const tenant = resolveUserTenantLabel(t, userItem, canViewTechnicalIds);
  const facility = resolveUserFacilityLabel(t, userItem, canViewTechnicalIds);

  if (tenant !== t('common.notAvailable') && facility !== t('common.notAvailable')) {
    return t('user.list.contextValue', { tenant, facility });
  }
  if (tenant !== t('common.notAvailable')) {
    return t('user.list.tenantValue', { tenant });
  }
  if (facility !== t('common.notAvailable')) {
    return t('user.list.facilityValue', { facility });
  }
  return undefined;
};

const UserListScreenWeb = () => {
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
    selectedUserIds,
    canViewTechnicalIds,
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
    onToggleUserSelection,
    onTogglePageSelection,
    onClearSelection,
    onBulkDelete,
    resolveFilterOperatorOptions,
    onUserPress,
    onEdit,
    onDelete,
    onAdd,
  } = useUserListScreen();

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
      title={t('user.list.emptyTitle')}
      description={t('user.list.emptyMessage')}
      action={
        onAdd ? (
          <StyledAddButton
            type="button"
            onClick={onAdd}
            onPress={onAdd}
            accessibilityLabel={t('user.list.addLabel')}
            accessibilityHint={t('user.list.addHint')}
            testID="user-list-empty-add"
          >
            <Icon glyph="+" size="xs" decorative />
            <StyledAddLabel>{t('user.list.addLabel')}</StyledAddLabel>
          </StyledAddButton>
        ) : undefined
      }
      testID="user-list-empty-state"
    />
  );

  const noResultsComponent = (
    <EmptyState
      title={t('user.list.noResultsTitle')}
      description={t('user.list.noResultsMessage')}
      action={
        <StyledFilterButton
          type="button"
          onClick={onClearSearchAndFilters}
          testID="user-list-clear-search"
          aria-label={t('user.list.clearSearchAndFilters')}
        >
          {t('user.list.clearSearchAndFilters')}
        </StyledFilterButton>
      }
      testID="user-list-no-results"
    />
  );

  const retryAction = onRetry ? (
    <Button
      variant="surface"
      size="small"
      onPress={onRetry}
      accessibilityLabel={t('common.retry')}
      accessibilityHint={t('common.retryHint')}
      testID="user-list-retry"
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
        sortLabel: t('user.list.sortBy', { field: resolveColumnLabel(t, column) }),
        width: columnLayout.width,
        minWidth: columnLayout.minWidth,
        align: columnLayout.align,
        truncate: columnLayout.truncate,
        renderCell: (userItem) => {
          const value = resolveUserCell(t, userItem, column, canViewTechnicalIds);
          if (column === 'status' && value && typeof value === 'object') {
            return <StyledStatusBadge $tone={value.tone}>{value.label}</StyledStatusBadge>;
          }
          if (column === 'email') {
            return <StyledPrimaryCellText>{value}</StyledPrimaryCellText>;
          }
          if (column === 'phone' || column === 'tenant' || column === 'facility') {
            return <StyledCodeCellText>{value}</StyledCodeCellText>;
          }
          return value;
        },
        getCellTitle: (userItem) => {
          const value = resolveUserCell(t, userItem, column, canViewTechnicalIds);
          return typeof value === 'string' ? value : undefined;
        },
      };
    }),
    [visibleColumns, t, canViewTechnicalIds]
  );

  const tableSelection = useMemo(() => {
    if (!onBulkDelete) return undefined;
    return {
      enabled: true,
      allSelected: allPageSelected,
      onToggleAll: (checked) => onTogglePageSelection(Boolean(checked)),
      isRowSelected: (userItem) => {
        const userId = resolveUserId(userItem);
        return Boolean(userId) && selectedUserIds.includes(userId);
      },
      onToggleRow: (userItem) => onToggleUserSelection(resolveUserId(userItem)),
      selectAllLabel: t('user.list.selectPage'),
      selectRowLabel: (userItem) => t('user.list.selectUser', {
        name: resolveUserTitle(t, userItem),
      }),
      headerCheckboxTestId: 'user-select-page',
      rowCheckboxTestIdPrefix: 'user-select',
    };
  }, [
    onBulkDelete,
    allPageSelected,
    onTogglePageSelection,
    selectedUserIds,
    onToggleUserSelection,
    t,
  ]);

  const handleTableRowPress = useCallback((userItem) => {
    const userId = resolveUserId(userItem);
    if (!userId) return;
    onUserPress(userId);
  }, [onUserPress]);

  const renderTableRowActions = useCallback((userItem) => {
    const userId = resolveUserId(userItem);
    if (!userId) return null;

    return (
      <StyledRowActions>
        <StyledActionButton
          type="button"
          onClick={(event) => {
            event.stopPropagation();
            onUserPress(userId);
          }}
          data-testid={`user-view-${userId}`}
        >
          {t('user.list.view')}
        </StyledActionButton>

        {onEdit ? (
          <StyledActionButton
            type="button"
            onClick={(event) => onEdit(userId, event)}
            data-testid={`user-edit-${userId}`}
          >
            {t('user.list.edit')}
          </StyledActionButton>
        ) : null}

        {onDelete ? (
          <StyledDangerActionButton
            type="button"
            onClick={(event) => onDelete(userId, event)}
            data-testid={`user-delete-${userId}`}
          >
            {t('common.remove')}
          </StyledDangerActionButton>
        ) : null}
      </StyledRowActions>
    );
  }, [onUserPress, onEdit, onDelete, t]);

  const searchBarSection = (
    <StyledToolbar data-testid="user-list-toolbar">
      <StyledSearchSlot>
        <TextField
          value={search}
          onChange={(e) => onSearch(e.target.value)}
          placeholder={t('user.list.searchPlaceholder')}
          accessibilityLabel={t('user.list.searchLabel')}
          density="compact"
          type="search"
          testID="user-list-search"
        />
      </StyledSearchSlot>

      <StyledScopeSlot>
        <StyledControlLabel>{t('user.list.searchScopeLabel')}</StyledControlLabel>
        <Select
          value={searchScope}
          onValueChange={onSearchScopeChange}
          options={searchScopeOptions}
          accessibilityLabel={t('user.list.searchScopeLabel')}
          compact
          testID="user-list-search-scope"
        />
      </StyledScopeSlot>

      <StyledToolbarActions>
        {isTableMode ? (
          <StyledTableSettingsButton
            type="button"
            onClick={onOpenTableSettings}
            aria-label={t('user.list.tableSettings')}
            data-testid="user-table-settings"
          >
            {t('user.list.tableSettings')}
          </StyledTableSettingsButton>
        ) : null}

        {onAdd ? (
          <StyledAddButton
            type="button"
            onClick={onAdd}
            onPress={onAdd}
            accessibilityLabel={t('user.list.addLabel')}
            accessibilityHint={t('user.list.addHint')}
            testID="user-list-add"
          >
            <Icon glyph="+" size="xs" decorative />
            <StyledAddLabel>{t('user.list.addLabel')}</StyledAddLabel>
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
          data-testid="user-filter-toggle"
        >
          <StyledFilterChevron $collapsed={isFilterPanelCollapsed} aria-hidden="true">
            {'\u25BE'}
          </StyledFilterChevron>
        </StyledFilterToggleButton>
      </StyledFilterHeader>

      {!isFilterPanelCollapsed ? (
        <StyledFilterBody data-testid="user-filter-body">
          <Select
            value={filterLogic}
            onValueChange={onFilterLogicChange}
            options={filterLogicOptions}
            label={t('user.list.filterLogicLabel')}
            accessibilityLabel={t('user.list.filterLogicLabel')}
            compact
            testID="user-filter-logic"
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
                  label={t('user.list.filterFieldLabel')}
                  compact
                  testID={`user-filter-field-${index}`}
                />

                <Select
                  value={filter.operator}
                  onValueChange={(value) => onFilterOperatorChange(filter.id, value)}
                  options={operatorOptions}
                  label={t('user.list.filterOperatorLabel')}
                  compact
                  testID={`user-filter-operator-${index}`}
                />

                {isStatusFilter ? (
                  <Select
                    value={filter.value || 'active'}
                    onValueChange={(value) => onFilterValueChange(filter.id, value)}
                    options={[
                      { value: 'active', label: t('user.status.ACTIVE') },
                      { value: 'inactive', label: t('user.status.INACTIVE') },
                      { value: 'suspended', label: t('user.status.SUSPENDED') },
                      { value: 'pending', label: t('user.status.PENDING') },
                    ]}
                    label={t('user.list.filterValueLabel')}
                    compact
                    testID={`user-filter-value-${index}`}
                  />
                ) : (
                  <TextField
                    value={filter.value}
                    onChange={(event) => onFilterValueChange(filter.id, event.target.value)}
                    label={t('user.list.filterValueLabel')}
                    placeholder={t('user.list.filterValuePlaceholder')}
                    density="compact"
                    testID={`user-filter-value-${index}`}
                  />
                )}

                <StyledFilterRowActions>
                  <StyledFilterButton
                    type="button"
                    onClick={() => onRemoveFilter(filter.id)}
                    aria-label={t('user.list.removeFilter')}
                    testID={`user-filter-remove-${index}`}
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
              testID="user-filter-add"
            >
              {t('user.list.addFilter')}
            </StyledFilterButton>
            <StyledFilterButton
              type="button"
              onClick={onClearSearchAndFilters}
              testID="user-filter-clear"
            >
              {t('user.list.clearSearchAndFilters')}
            </StyledFilterButton>
          </StyledFilterActions>
        </StyledFilterBody>
      ) : null}
    </StyledFilterPanel>
  );

  const bulkActionsBar = onBulkDelete && selectedUserIds.length > 0 ? (
    <StyledBulkBar data-testid="user-bulk-bar">
      <StyledBulkInfo>
        {t('user.list.bulkSelectedCount', { count: selectedUserIds.length })}
      </StyledBulkInfo>
      <StyledBulkActions>
        <StyledActionButton
          type="button"
          onClick={onClearSelection}
          data-testid="user-bulk-clear"
        >
          {t('user.list.clearSelection')}
        </StyledActionButton>
        <StyledDangerActionButton
          type="button"
          onClick={onBulkDelete}
          data-testid="user-bulk-delete"
        >
          {t('user.list.bulkDelete')}
        </StyledDangerActionButton>
      </StyledBulkActions>
    </StyledBulkBar>
  ) : null;

  const tableStatusContent = showEmpty ? emptyComponent : (hasNoResults ? noResultsComponent : null);

  const paginationContent = showList ? (
    <StyledPaginationInfo>
      {t('user.list.pageSummary', { page, totalPages, total: totalItems })}
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
        data-testid="user-page-prev"
      >
        {'<'}
      </StyledPaginationNavButton>

      <StyledPaginationControl>
        <StyledPaginationControlLabel>
          {t('user.list.pageSizeLabel')}
        </StyledPaginationControlLabel>
        <StyledPaginationSelectSlot>
          <Select
            value={String(pageSize)}
            onValueChange={onPageSizeChange}
            options={pageSizeOptions}
            accessibilityLabel={t('user.list.pageSizeLabel')}
            compact
            testID="user-page-size"
          />
        </StyledPaginationSelectSlot>
      </StyledPaginationControl>

      <StyledPaginationControl>
        <StyledPaginationControlLabel>
          {t('user.list.densityLabel')}
        </StyledPaginationControlLabel>
        <StyledPaginationSelectSlot>
          <Select
            value={density}
            onValueChange={onDensityChange}
            options={densityOptions}
            accessibilityLabel={t('user.list.densityLabel')}
            compact
            testID="user-density"
          />
        </StyledPaginationSelectSlot>
      </StyledPaginationControl>

      <StyledPaginationNavButton
        type="button"
        onClick={() => onPageChange(page + 1)}
        disabled={page >= totalPages}
        aria-label={t('common.next')}
        title={t('common.next')}
        data-testid="user-page-next"
      >
        {'>'}
      </StyledPaginationNavButton>
    </StyledPaginationActions>
  ) : null;

  return (
    <StyledContainer role="main" aria-label={t('user.list.title')}>
      {noticeMessage ? (
        <Snackbar
          visible={Boolean(noticeMessage)}
          message={noticeMessage}
          variant="success"
          position="bottom"
          onDismiss={onDismissNotice}
          testID="user-list-notice"
        />
      ) : null}

      <StyledContent>
        {!isTableMode ? searchBarSection : null}
        {!isTableMode ? filterBarSection : null}
        {!isTableMode ? bulkActionsBar : null}

        <Card
          variant="outlined"
          accessibilityLabel={t('user.list.accessibilityLabel')}
          testID="user-list-card"
        >
          <StyledListBody
            role="region"
            aria-label={t('user.list.accessibilityLabel')}
            data-testid="user-list"
            testID="user-list"
          >
            <StyledStateStack>
              {showError ? (
                <ErrorState
                  size={ErrorStateSizes.SMALL}
                  title={t('listScaffold.errorState.title')}
                  description={errorMessage}
                  action={retryAction}
                  testID="user-list-error"
                />
              ) : null}

              {showOffline ? (
                <OfflineState
                  size={OfflineStateSizes.SMALL}
                  title={t('shell.banners.offline.title')}
                  description={t('shell.banners.offline.message')}
                  action={retryAction}
                  testID="user-list-offline"
                />
              ) : null}

              {showOfflineBanner ? (
                <OfflineState
                  size={OfflineStateSizes.SMALL}
                  title={t('shell.banners.offline.title')}
                  description={t('shell.banners.offline.message')}
                  action={retryAction}
                  testID="user-list-offline-banner"
                />
              ) : null}
            </StyledStateStack>

            {isLoading ? (
              <LoadingSpinner accessibilityLabel={t('common.loading')} testID="user-list-loading" />
            ) : null}

            {!isTableMode && showEmpty ? emptyComponent : null}
            {!isTableMode && hasNoResults ? noResultsComponent : null}

            {showDesktopTable ? (
              <DataTable
                columns={tableColumns}
                rows={rows}
                getRowKey={(userItem, index) => resolveUserId(userItem) || `user-${index}`}
                rowDensity={density}
                sortField={sortField}
                sortDirection={sortDirection}
                onSort={onSort}
                selection={tableSelection}
                renderRowActions={renderTableRowActions}
                rowActionsLabel={t('user.list.columnActions')}
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
                testID="user-table"
              />
            ) : null}

            {showList && !isTableMode ? (
              <StyledMobileList role="list">
                {rows.map((userItem, index) => {
                  const title = resolveUserTitle(t, userItem);
                  const leadingGlyph = String(title || 'B').charAt(0).toUpperCase();
                  const userId = resolveUserId(userItem);
                  const itemKey = userId ?? `user-${index}`;
                  const statusState = resolveUserStatusState(t, userItem);
                  return (
                    <li key={itemKey} role="listitem">
                      <ListItem
                        leading={{ glyph: leadingGlyph, tone: 'inverse', backgroundTone: 'primary' }}
                        title={title}
                        subtitle={resolveMobileSubtitle(t, userItem, canViewTechnicalIds)}
                        metadata={[]}
                        status={{
                          label: statusState.label,
                          tone: statusState.tone,
                          showDot: true,
                          accessibilityLabel: t('user.list.statusLabel'),
                        }}
                        density="compact"
                        onPress={userId ? () => onUserPress(userId) : undefined}
                        onView={userId ? () => onUserPress(userId) : undefined}
                        onEdit={onEdit && userId ? (event) => onEdit(userId, event) : undefined}
                        onDelete={onDelete && userId ? (event) => onDelete(userId, event) : undefined}
                        viewLabel={t('user.list.view')}
                        viewHint={t('user.list.viewHint')}
                        editLabel={t('user.list.edit')}
                        editHint={t('user.list.editHint')}
                        deleteLabel={t('common.remove')}
                        deleteHint={t('user.list.deleteHint')}
                        onMore={userId ? () => onUserPress(userId) : undefined}
                        moreLabel={t('common.more')}
                        moreHint={t('user.list.viewHint')}
                        viewTestID={`user-view-${itemKey}`}
                        editTestID={`user-edit-${itemKey}`}
                        deleteTestID={`user-delete-${itemKey}`}
                        moreTestID={`user-more-${itemKey}`}
                        accessibilityLabel={t('user.list.itemLabel', { name: title })}
                        accessibilityHint={t('user.list.itemHint', { name: title })}
                        testID={`user-item-${itemKey}`}
                      />
                    </li>
                  );
                })}
              </StyledMobileList>
            ) : null}

            {!isTableMode && showList ? (
              <StyledPagination>
                <StyledPaginationInfo>
                  {t('user.list.pageSummary', { page, totalPages, total: totalItems })}
                </StyledPaginationInfo>

                <StyledPaginationActions>
                  <StyledPaginationNavButton
                    type="button"
                    onClick={() => onPageChange(page - 1)}
                    disabled={page <= 1}
                    aria-label={t('common.previous')}
                    title={t('common.previous')}
                    data-testid="user-page-prev"
                  >
                    {'<'}
                  </StyledPaginationNavButton>

                  <StyledPaginationControl>
                    <StyledPaginationControlLabel>
                      {t('user.list.pageSizeLabel')}
                    </StyledPaginationControlLabel>
                    <StyledPaginationSelectSlot>
                      <Select
                        value={String(pageSize)}
                        onValueChange={onPageSizeChange}
                        options={pageSizeOptions}
                        accessibilityLabel={t('user.list.pageSizeLabel')}
                        compact
                        testID="user-page-size"
                      />
                    </StyledPaginationSelectSlot>
                  </StyledPaginationControl>

                  <StyledPaginationControl>
                    <StyledPaginationControlLabel>
                      {t('user.list.densityLabel')}
                    </StyledPaginationControlLabel>
                    <StyledPaginationSelectSlot>
                      <Select
                        value={density}
                        onValueChange={onDensityChange}
                        options={densityOptions}
                        accessibilityLabel={t('user.list.densityLabel')}
                        compact
                        testID="user-density"
                      />
                    </StyledPaginationSelectSlot>
                  </StyledPaginationControl>

                  <StyledPaginationNavButton
                    type="button"
                    onClick={() => onPageChange(page + 1)}
                    disabled={page >= totalPages}
                    aria-label={t('common.next')}
                    title={t('common.next')}
                    data-testid="user-page-next"
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
          accessibilityLabel={t('user.list.tableSettings')}
          testID="user-table-settings-modal"
        >
          <StyledSettingsBody>
            <StyledSettingsSection>
              <StyledSettingsTitle>{t('user.list.visibleColumns')}</StyledSettingsTitle>
              {columnOrder.map((column) => (
                <StyledColumnRow key={column}>
                  <Checkbox
                    checked={visibleColumns.includes(column)}
                    onChange={() => onToggleColumnVisibility(column)}
                    label={resolveColumnLabel(t, column)}
                    testID={`user-column-visible-${column}`}
                  />

                  <StyledColumnMoveControls>
                    <StyledMoveButton
                      type="button"
                      onClick={() => onMoveColumnLeft(column)}
                      aria-label={t('user.list.moveColumnLeft', {
                        column: resolveColumnLabel(t, column),
                      })}
                      disabled={columnOrder.indexOf(column) === 0}
                      data-testid={`user-column-left-${column}`}
                    >
                      {'<'}
                    </StyledMoveButton>
                    <StyledMoveButton
                      type="button"
                      onClick={() => onMoveColumnRight(column)}
                      aria-label={t('user.list.moveColumnRight', {
                        column: resolveColumnLabel(t, column),
                      })}
                      disabled={columnOrder.indexOf(column) === columnOrder.length - 1}
                      data-testid={`user-column-right-${column}`}
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
                data-testid="user-table-settings-reset"
              >
                {t('user.list.resetTablePreferences')}
              </StyledFilterButton>
            </StyledSettingsActions>
          </StyledSettingsBody>
        </Modal>
      </StyledContent>
    </StyledContainer>
  );
};

export default UserListScreenWeb;


