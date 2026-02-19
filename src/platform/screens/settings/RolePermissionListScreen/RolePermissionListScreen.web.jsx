/**
 * RolePermissionListScreen - Web
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
} from './RolePermissionListScreen.web.styles';
import useRolePermissionListScreen from './useRolePermissionListScreen';

const TABLE_MODE_BREAKPOINT = 768;
const TABLE_COLUMN_LAYOUT = {
  role: { width: 260, minWidth: 180, align: 'left' },
  permission: { width: 320, minWidth: 220, align: 'left' },
  tenant: { width: 220, minWidth: 180, align: 'left' },
};

const resolveRolePermissionId = (rolePermissionItem) => String(rolePermissionItem?.id ?? '').trim();

const resolveColumnLabel = (t, column) => {
  if (column === 'role') return t('rolePermission.list.columnRole');
  if (column === 'permission') return t('rolePermission.list.columnPermission');
  if (column === 'tenant') return t('rolePermission.list.columnTenant');
  return column;
};

const resolveRolePermissionCell = (
  t,
  rolePermissionItem,
  column,
  resolveRoleLabel,
  resolvePermissionLabel,
  resolveTenantLabel
) => {
  if (column === 'role') return resolveRoleLabel(rolePermissionItem);
  if (column === 'permission') return resolvePermissionLabel(rolePermissionItem);
  if (column === 'tenant') return resolveTenantLabel(rolePermissionItem);
  return t('common.notAvailable');
};

const RolePermissionListScreenWeb = () => {
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
    resolveRoleLabel,
    resolvePermissionLabel,
    resolveTenantLabel,
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
  } = useRolePermissionListScreen();

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
      title={t('rolePermission.list.emptyTitle')}
      description={t('rolePermission.list.emptyMessage')}
      action={
        onAdd ? (
          <StyledAddButton
            type="button"
            onClick={onAdd}
            onPress={onAdd}
            accessibilityLabel={t('rolePermission.list.addLabel')}
            accessibilityHint={t('rolePermission.list.addHint')}
            testID="role-permission-list-empty-add"
          >
            <Icon glyph="+" size="xs" decorative />
            <StyledAddLabel>{t('rolePermission.list.addLabel')}</StyledAddLabel>
          </StyledAddButton>
        ) : undefined
      }
      testID="role-permission-list-empty-state"
    />
  );

  const noResultsComponent = (
    <EmptyState
      title={t('rolePermission.list.noResultsTitle')}
      description={t('rolePermission.list.noResultsMessage')}
      action={
        <StyledFilterButton
          type="button"
          onClick={onClearSearchAndFilters}
          onPress={onClearSearchAndFilters}
          testID="role-permission-list-clear-search"
          data-testid="role-permission-list-clear-search"
          aria-label={t('rolePermission.list.clearSearchAndFilters')}
        >
          {t('rolePermission.list.clearSearchAndFilters')}
        </StyledFilterButton>
      }
      testID="role-permission-list-no-results"
    />
  );

  const retryAction = onRetry ? (
    <Button
      variant="surface"
      size="small"
      onPress={onRetry}
      accessibilityLabel={t('common.retry')}
      accessibilityHint={t('common.retryHint')}
      testID="role-permission-list-retry"
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
      sortLabel: t('rolePermission.list.sortBy', { field: resolveColumnLabel(t, column) }),
      width: columnLayout.width,
      minWidth: columnLayout.minWidth,
      align: columnLayout.align,
      renderCell: (rolePermissionItem) => resolveRolePermissionCell(
        t,
        rolePermissionItem,
        column,
        resolveRoleLabel,
        resolvePermissionLabel,
        resolveTenantLabel
      ),
      getCellTitle: (rolePermissionItem) => resolveRolePermissionCell(
        t,
        rolePermissionItem,
        column,
        resolveRoleLabel,
        resolvePermissionLabel,
        resolveTenantLabel
      ),
    };
  }), [visibleColumns, t, resolveRoleLabel, resolvePermissionLabel, resolveTenantLabel]);

  const handleTableRowPress = useCallback((rolePermissionItem) => {
    const rolePermissionId = resolveRolePermissionId(rolePermissionItem);
    if (!rolePermissionId) return;
    onItemPress(rolePermissionId);
  }, [onItemPress]);

  const renderTableRowActions = useCallback((rolePermissionItem) => {
    const rolePermissionId = resolveRolePermissionId(rolePermissionItem);
    if (!rolePermissionId) return null;

    return (
      <StyledRowActions>
        <StyledActionButton
          type="button"
          onClick={(event) => {
            event.stopPropagation();
            onItemPress(rolePermissionId);
          }}
          data-testid={`role-permission-view-${rolePermissionId}`}
        >
          {t('common.view')}
        </StyledActionButton>

        {onDelete ? (
          <StyledDangerActionButton
            type="button"
            onClick={(event) => onDelete(rolePermissionId, event)}
            data-testid={`role-permission-delete-${rolePermissionId}`}
          >
            {t('common.remove')}
          </StyledDangerActionButton>
        ) : null}
      </StyledRowActions>
    );
  }, [onDelete, onItemPress, t]);

  const searchBarSection = (
    <StyledToolbar data-testid="permission-list-toolbar" testID="permission-list-toolbar">
      <StyledSearchSlot>
        <TextField
          value={search}
          onChange={(event) => onSearch(event.target.value)}
          placeholder={t('rolePermission.list.searchPlaceholder')}
          accessibilityLabel={t('rolePermission.list.searchLabel')}
          density="compact"
          type="search"
          testID="role-permission-list-search"
        />
      </StyledSearchSlot>

      <StyledScopeSlot>
        <Select
          value={searchScope}
          onValueChange={onSearchScopeChange}
          options={searchScopeOptions}
          label={t('rolePermission.list.searchScopeLabel')}
          compact
          testID="role-permission-list-search-scope"
        />
      </StyledScopeSlot>

      <StyledToolbarActions>
        {isTableMode ? (
          <StyledTableSettingsButton
            type="button"
            onClick={onOpenTableSettings}
            aria-label={t('rolePermission.list.tableSettings')}
            data-testid="role-permission-table-settings"
          >
            {t('rolePermission.list.tableSettings')}
          </StyledTableSettingsButton>
        ) : null}

        {onAdd ? (
          <StyledAddButton
            type="button"
            onClick={onAdd}
            onPress={onAdd}
            accessibilityLabel={t('rolePermission.list.addLabel')}
            accessibilityHint={t('rolePermission.list.addHint')}
            testID="role-permission-list-add"
          >
            <Icon glyph="+" size="xs" decorative />
            <StyledAddLabel>{t('rolePermission.list.addLabel')}</StyledAddLabel>
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
        data-testid="permission-filter-toggle"
      >
        {t('common.filters')}
      </StyledFilterButton>

      {!isFilterPanelCollapsed ? (
        <StyledFilterBody data-testid="permission-filter-body">
          <Select
            value={filterLogic}
            onValueChange={onFilterLogicChange}
            options={filterLogicOptions}
            label={t('rolePermission.list.filterLogicLabel')}
            accessibilityLabel={t('rolePermission.list.filterLogicLabel')}
            compact
            testID="role-permission-filter-logic"
          />

          {filters.map((filter, index) => {
            const operatorOptions = resolveFilterOperatorOptions(filter.field);
            return (
              <StyledFilterRow key={filter.id}>
                <Select
                  value={filter.field}
                  onValueChange={(value) => onFilterFieldChange(filter.id, value)}
                  options={filterFieldOptions}
                  label={t('rolePermission.list.filterFieldLabel')}
                  compact
                  testID={`role-permission-filter-field-${index}`}
                />

                <Select
                  value={filter.operator}
                  onValueChange={(value) => onFilterOperatorChange(filter.id, value)}
                  options={operatorOptions}
                  label={t('rolePermission.list.filterOperatorLabel')}
                  compact
                  testID={`role-permission-filter-operator-${index}`}
                />

                <TextField
                  value={filter.value}
                  onChange={(event) => onFilterValueChange(filter.id, event.target.value)}
                  label={t('rolePermission.list.filterValueLabel')}
                  placeholder={t('rolePermission.list.filterValuePlaceholder')}
                  density="compact"
                  testID={`role-permission-filter-value-${index}`}
                />

                <StyledFilterRowActions>
                  <StyledFilterButton
                    type="button"
                    onClick={() => onRemoveFilter(filter.id)}
                    aria-label={t('rolePermission.list.removeFilter')}
                    testID={`role-permission-filter-remove-${index}`}
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
              testID="role-permission-filter-add"
            >
              {t('rolePermission.list.addFilter')}
            </StyledFilterButton>
            <StyledFilterButton
              type="button"
              onClick={onClearSearchAndFilters}
              testID="role-permission-filter-clear"
            >
              {t('rolePermission.list.clearSearchAndFilters')}
            </StyledFilterButton>
          </StyledFilterActions>
        </StyledFilterBody>
      ) : null}
    </StyledFilterPanel>
  );

  const tableStatusContent = showEmpty ? emptyComponent : (hasNoResults ? noResultsComponent : null);

  const paginationContent = showList ? (
    <StyledPaginationInfo>
      {t('rolePermission.list.pageSummary', { page, totalPages, total: totalItems })}
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
        data-testid="role-permission-page-prev"
      >
        {'<'}
      </StyledPaginationNavButton>

      <StyledPaginationControl>
        <StyledPaginationControlLabel>
          {t('rolePermission.list.pageSizeLabel')}
        </StyledPaginationControlLabel>
        <StyledPaginationSelectSlot>
          <Select
            value={String(pageSize)}
            onValueChange={onPageSizeChange}
            options={pageSizeOptions}
            accessibilityLabel={t('rolePermission.list.pageSizeLabel')}
            compact
            testID="role-permission-page-size"
          />
        </StyledPaginationSelectSlot>
      </StyledPaginationControl>

      <StyledPaginationControl>
        <StyledPaginationControlLabel>
          {t('rolePermission.list.densityLabel')}
        </StyledPaginationControlLabel>
        <StyledPaginationSelectSlot>
          <Select
            value={density}
            onValueChange={onDensityChange}
            options={densityOptions}
            accessibilityLabel={t('rolePermission.list.densityLabel')}
            compact
            testID="role-permission-density"
          />
        </StyledPaginationSelectSlot>
      </StyledPaginationControl>

      <StyledPaginationNavButton
        type="button"
        onClick={() => onPageChange(page + 1)}
        disabled={page >= totalPages}
        aria-label={t('common.next')}
        title={t('common.next')}
        data-testid="role-permission-page-next"
      >
        {'>'}
      </StyledPaginationNavButton>
    </StyledPaginationActions>
  ) : null;

  return (
    <StyledContainer role="main" aria-label={t('permission.list.title')}>
      {noticeMessage ? (
        <Snackbar
          visible={Boolean(noticeMessage)}
          message={noticeMessage}
          variant="success"
          position="bottom"
          onDismiss={onDismissNotice}
          testID="permission-list-notice"
        />
      ) : null}

      <StyledContent>
        {!isTableMode ? searchBarSection : null}
        {!isTableMode ? filterBarSection : null}

        <Card
          variant="outlined"
          accessibilityLabel={t('permission.list.accessibilityLabel')}
          testID="permission-list-card"
        >
          <StyledListBody
            role="region"
            aria-label={t('permission.list.accessibilityLabel')}
            data-testid="permission-list"
            testID="permission-list"
          >
            <StyledStateStack>
              {showError ? (
                <ErrorState
                  size={ErrorStateSizes.SMALL}
                  title={t('listScaffold.errorState.title')}
                  description={errorMessage}
                  action={retryAction}
                  testID="permission-list-error"
                />
              ) : null}

              {showOffline ? (
                <OfflineState
                  size={OfflineStateSizes.SMALL}
                  title={t('shell.banners.offline.title')}
                  description={t('shell.banners.offline.message')}
                  action={retryAction}
                  testID="permission-list-offline"
                />
              ) : null}

              {showOfflineBanner ? (
                <OfflineState
                  size={OfflineStateSizes.SMALL}
                  title={t('shell.banners.offline.title')}
                  description={t('shell.banners.offline.message')}
                  action={retryAction}
                  testID="permission-list-offline-banner"
                />
              ) : null}
            </StyledStateStack>

            {isLoading ? (
              <LoadingSpinner accessibilityLabel={t('common.loading')} testID="permission-list-loading" />
            ) : null}

            {!isTableMode && showEmpty ? emptyComponent : null}
            {!isTableMode && hasNoResults ? noResultsComponent : null}

            {showDesktopTable ? (
              <DataTable
                columns={tableColumns}
                rows={rows}
                getRowKey={(permissionItem, index) => (
                  resolvePermissionId(permissionItem) || `permission-${index}`
                )}
                rowDensity={density}
                sortField={sortField}
                sortDirection={sortDirection}
                onSort={onSort}
                renderRowActions={renderTableRowActions}
                rowActionsLabel={t('permission.list.columnActions')}
                onRowPress={handleTableRowPress}
                searchBar={searchBarSection}
                filterBar={filterBarSection}
                statusContent={tableStatusContent}
                pagination={paginationContent}
                tableNavigation={tableNavigationContent}
                showDefaultEmptyRow={false}
                minWidth={900}
                testID="permission-table"
              />
            ) : null}

            {showList && !isTableMode ? (
              <StyledList role="list">
                {rows.map((permissionItem, index) => {
                  const permissionId = resolvePermissionId(permissionItem);
                  const itemKey = permissionId || `permission-${index}`;
                  const title = resolvePermissionName(t, permissionItem);
                  const description = resolvePermissionDescription(t, permissionItem);
                  const tenant = resolvePermissionTenant(t, permissionItem, canViewTechnicalIds);
                  const subtitle = [description, tenant].filter(Boolean).join(' - ');

                  return (
                    <li key={itemKey} role="listitem">
                      <ListItem
                        title={title}
                        subtitle={subtitle || undefined}
                        onPress={permissionId ? () => onItemPress(permissionId) : undefined}
                        actions={onDelete && permissionId ? (
                          <Button
                            variant="surface"
                            size="small"
                            onPress={(event) => onDelete(permissionId, event)}
                            accessibilityLabel={t('permission.list.delete')}
                            accessibilityHint={t('permission.list.deleteHint')}
                            testID={`permission-delete-${itemKey}`}
                          >
                            {t('common.remove')}
                          </Button>
                        ) : undefined}
                        accessibilityLabel={t('permission.list.itemLabel', { name: title })}
                        testID={`permission-item-${itemKey}`}
                      />
                    </li>
                  );
                })}
              </StyledList>
            ) : null}

            {!isTableMode && showList ? (
              <StyledPagination>
                <StyledPaginationInfo>
                  {t('permission.list.pageSummary', { page, totalPages, total: totalItems })}
                </StyledPaginationInfo>

                <StyledPaginationActions>
                  <StyledPaginationNavButton
                    type="button"
                    onClick={() => onPageChange(page - 1)}
                    disabled={page <= 1}
                    aria-label={t('common.previous')}
                    title={t('common.previous')}
                    data-testid="permission-page-prev"
                  >
                    {'<'}
                  </StyledPaginationNavButton>

                  <StyledPaginationControl>
                    <StyledPaginationControlLabel>
                      {t('permission.list.pageSizeLabel')}
                    </StyledPaginationControlLabel>
                    <StyledPaginationSelectSlot>
                      <Select
                        value={String(pageSize)}
                        onValueChange={onPageSizeChange}
                        options={pageSizeOptions}
                        accessibilityLabel={t('permission.list.pageSizeLabel')}
                        compact
                        testID="permission-page-size"
                      />
                    </StyledPaginationSelectSlot>
                  </StyledPaginationControl>

                  <StyledPaginationControl>
                    <StyledPaginationControlLabel>
                      {t('permission.list.densityLabel')}
                    </StyledPaginationControlLabel>
                    <StyledPaginationSelectSlot>
                      <Select
                        value={density}
                        onValueChange={onDensityChange}
                        options={densityOptions}
                        accessibilityLabel={t('permission.list.densityLabel')}
                        compact
                        testID="permission-density"
                      />
                    </StyledPaginationSelectSlot>
                  </StyledPaginationControl>

                  <StyledPaginationNavButton
                    type="button"
                    onClick={() => onPageChange(page + 1)}
                    disabled={page >= totalPages}
                    aria-label={t('common.next')}
                    title={t('common.next')}
                    data-testid="permission-page-next"
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
          accessibilityLabel={t('permission.list.tableSettings')}
          testID="permission-table-settings-modal"
        >
          <StyledSettingsBody>
            <StyledSettingsSection>
              <StyledSettingsTitle>{t('permission.list.visibleColumns')}</StyledSettingsTitle>
              {columnOrder.map((column) => (
                <StyledColumnRow key={column}>
                  <Checkbox
                    checked={visibleColumns.includes(column)}
                    onChange={() => onToggleColumnVisibility(column)}
                    label={resolveColumnLabel(t, column)}
                    testID={`permission-column-visible-${column}`}
                  />

                  <StyledColumnMoveControls>
                    <StyledMoveButton
                      type="button"
                      onClick={() => onMoveColumnLeft(column)}
                      aria-label={t('permission.list.moveColumnLeft', {
                        column: resolveColumnLabel(t, column),
                      })}
                      disabled={columnOrder.indexOf(column) === 0}
                      data-testid={`permission-column-left-${column}`}
                    >
                      {'<'}
                    </StyledMoveButton>
                    <StyledMoveButton
                      type="button"
                      onClick={() => onMoveColumnRight(column)}
                      aria-label={t('permission.list.moveColumnRight', {
                        column: resolveColumnLabel(t, column),
                      })}
                      disabled={columnOrder.indexOf(column) === columnOrder.length - 1}
                      data-testid={`permission-column-right-${column}`}
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
                data-testid="permission-table-settings-reset"
              >
                {t('permission.list.resetTablePreferences')}
              </StyledFilterButton>
            </StyledSettingsActions>
          </StyledSettingsBody>
        </Modal>
      </StyledContent>
    </StyledContainer>
  );
};

export default PermissionListScreenWeb;
