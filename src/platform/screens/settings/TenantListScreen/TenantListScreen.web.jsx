/**
 * TenantListScreen - Web
 * Desktop/tablet renders a customizable table; mobile web renders compact cards.
 */
import React from 'react';
import {
  Button,
  Card,
  Checkbox,
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
  StyledFilterActions,
  StyledFilterButton,
  StyledFilterPanel,
  StyledFilterRow,
  StyledListBody,
  StyledMobileList,
  StyledMoveButton,
  StyledPagination,
  StyledPaginationActions,
  StyledPaginationInfo,
  StyledRowActions,
  StyledScopeSlot,
  StyledSearchSlot,
  StyledSettingsActions,
  StyledSettingsBody,
  StyledSettingsSection,
  StyledSettingsTitle,
  StyledSortButton,
  StyledStateStack,
  StyledStatusBadge,
  StyledTable,
  StyledTableCell,
  StyledTableHeaderCell,
  StyledTableRow,
  StyledTableSettingsButton,
  StyledTableWrapper,
  StyledToolbar,
  StyledToolbarActions,
} from './TenantListScreen.web.styles';
import useTenantListScreen from './useTenantListScreen';

const resolveTenantTitle = (t, tenant) => {
  const name = String(tenant?.name ?? '').trim();
  if (name) return name;

  const slug = resolveTenantSlug(tenant);
  if (slug) return slug;

  return t('tenant.list.unnamed');
};

const resolveTenantSlug = (tenant) => humanizeIdentifier(tenant?.slug);
const resolveTenantHumanId = (tenant) => humanizeIdentifier(
  tenant?.human_friendly_id ?? tenant?.humanFriendlyId
);

const resolveSortIndicator = (activeField, activeDirection, field) => {
  if (activeField !== field) return '';
  return activeDirection === 'desc' ? 'v' : '^';
};

const resolveColumnLabel = (t, column) => {
  if (column === 'name') return t('tenant.list.columnName');
  if (column === 'slug') return t('tenant.list.columnSlug');
  if (column === 'humanId') return t('tenant.list.columnHumanId');
  if (column === 'status') return t('tenant.list.columnStatus');
  return column;
};

const resolveTenantCell = (t, tenant, column) => {
  if (column === 'name') return resolveTenantTitle(t, tenant);
  if (column === 'slug') return resolveTenantSlug(tenant) || t('common.notAvailable');
  if (column === 'humanId') return resolveTenantHumanId(tenant) || t('common.notAvailable');
  if (column === 'status') {
    const isActive = Boolean(tenant?.is_active);
    return {
      label: isActive ? t('tenant.list.statusActive') : t('tenant.list.statusInactive'),
      tone: isActive ? 'success' : 'warning',
    };
  }
  return t('common.notAvailable');
};

const TenantListScreenWeb = () => {
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
    selectedTenantIds,
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
    onToggleTenantSelection,
    onTogglePageSelection,
    onClearSelection,
    onBulkDelete,
    resolveFilterOperatorOptions,
    onTenantPress,
    onEdit,
    onDelete,
    onAdd,
  } = useTenantListScreen();

  const rows = pagedItems;
  const showError = !isLoading && hasError && !isOffline;
  const showOffline = !isLoading && isOffline;
  const showEmpty = !isLoading && !showError && !showOffline && !hasNoResults && totalItems === 0;
  const showList = !isLoading && !showError && !showOffline && rows.length > 0;

  const emptyComponent = (
    <EmptyState
      title={t('tenant.list.emptyTitle')}
      description={t('tenant.list.emptyMessage')}
      action={
        onAdd ? (
          <StyledAddButton
            type="button"
            onClick={onAdd}
            onPress={onAdd}
            accessibilityLabel={t('tenant.list.addLabel')}
            accessibilityHint={t('tenant.list.addHint')}
            testID="tenant-list-empty-add"
          >
            <Icon glyph="+" size="xs" decorative />
            <StyledAddLabel>{t('tenant.list.addLabel')}</StyledAddLabel>
          </StyledAddButton>
        ) : undefined
      }
      testID="tenant-list-empty-state"
    />
  );

  const noResultsComponent = (
    <EmptyState
      title={t('tenant.list.noResultsTitle')}
      description={t('tenant.list.noResultsMessage')}
      action={
        <StyledFilterButton
          type="button"
          onClick={onClearSearchAndFilters}
          testID="tenant-list-clear-search"
          aria-label={t('tenant.list.clearSearchAndFilters')}
        >
          {t('tenant.list.clearSearchAndFilters')}
        </StyledFilterButton>
      }
      testID="tenant-list-no-results"
    />
  );

  const retryAction = onRetry ? (
    <Button
      variant="surface"
      size="small"
      onPress={onRetry}
      accessibilityLabel={t('common.retry')}
      accessibilityHint={t('common.retryHint')}
      testID="tenant-list-retry"
    >
      {t('common.retry')}
    </Button>
  ) : undefined;

  return (
    <StyledContainer role="main" aria-label={t('tenant.list.title')}>
      {noticeMessage ? (
        <Snackbar
          visible={Boolean(noticeMessage)}
          message={noticeMessage}
          variant="success"
          position="bottom"
          onDismiss={onDismissNotice}
          testID="tenant-list-notice"
        />
      ) : null}

      <StyledContent>
        <StyledToolbar data-testid="tenant-list-toolbar">
          <StyledSearchSlot>
            <TextField
              value={search}
              onChange={(e) => onSearch(e.target.value)}
              placeholder={t('tenant.list.searchPlaceholder')}
              accessibilityLabel={t('tenant.list.searchLabel')}
              density="compact"
              type="search"
              testID="tenant-list-search"
            />
          </StyledSearchSlot>

          <StyledScopeSlot>
            <Select
              value={searchScope}
              onValueChange={onSearchScopeChange}
              options={searchScopeOptions}
              label={t('tenant.list.searchScopeLabel')}
              accessibilityLabel={t('tenant.list.searchScopeLabel')}
              compact
              testID="tenant-list-search-scope"
            />
          </StyledScopeSlot>

          {isTableMode ? (
            <StyledTableSettingsButton
              type="button"
              onClick={onOpenTableSettings}
              aria-label={t('tenant.list.tableSettings')}
              data-testid="tenant-table-settings"
            >
              {t('tenant.list.tableSettings')}
            </StyledTableSettingsButton>
          ) : null}

          <StyledToolbarActions>
            {onAdd ? (
              <StyledAddButton
                type="button"
                onClick={onAdd}
                onPress={onAdd}
                accessibilityLabel={t('tenant.list.addLabel')}
                accessibilityHint={t('tenant.list.addHint')}
                testID="tenant-list-add"
              >
                <Icon glyph="+" size="xs" decorative />
                <StyledAddLabel>{t('tenant.list.addLabel')}</StyledAddLabel>
              </StyledAddButton>
            ) : null}
          </StyledToolbarActions>
        </StyledToolbar>

        <StyledFilterPanel>
          <Select
            value={filterLogic}
            onValueChange={onFilterLogicChange}
            options={filterLogicOptions}
            label={t('tenant.list.filterLogicLabel')}
            accessibilityLabel={t('tenant.list.filterLogicLabel')}
            compact
            testID="tenant-filter-logic"
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
                  label={t('tenant.list.filterFieldLabel')}
                  compact
                  testID={`tenant-filter-field-${index}`}
                />

                <Select
                  value={filter.operator}
                  onValueChange={(value) => onFilterOperatorChange(filter.id, value)}
                  options={operatorOptions}
                  label={t('tenant.list.filterOperatorLabel')}
                  compact
                  testID={`tenant-filter-operator-${index}`}
                />

                {isStatusFilter ? (
                  <Select
                    value={filter.value || 'active'}
                    onValueChange={(value) => onFilterValueChange(filter.id, value)}
                    options={[
                      { value: 'active', label: t('tenant.list.statusActive') },
                      { value: 'inactive', label: t('tenant.list.statusInactive') },
                    ]}
                    label={t('tenant.list.filterValueLabel')}
                    compact
                    testID={`tenant-filter-value-${index}`}
                  />
                ) : (
                  <TextField
                    value={filter.value}
                    onChange={(event) => onFilterValueChange(filter.id, event.target.value)}
                    label={t('tenant.list.filterValueLabel')}
                    placeholder={t('tenant.list.filterValuePlaceholder')}
                    density="compact"
                    testID={`tenant-filter-value-${index}`}
                  />
                )}

                <StyledFilterActions>
                  <StyledFilterButton
                    type="button"
                    onClick={() => onRemoveFilter(filter.id)}
                    aria-label={t('tenant.list.removeFilter')}
                    testID={`tenant-filter-remove-${index}`}
                  >
                    {t('common.remove')}
                  </StyledFilterButton>
                </StyledFilterActions>
              </StyledFilterRow>
            );
          })}

          <StyledFilterActions>
            <StyledFilterButton
              type="button"
              onClick={onAddFilter}
              disabled={!canAddFilter}
              testID="tenant-filter-add"
            >
              {t('tenant.list.addFilter')}
            </StyledFilterButton>
            <StyledFilterButton
              type="button"
              onClick={onClearSearchAndFilters}
              testID="tenant-filter-clear"
            >
              {t('tenant.list.clearSearchAndFilters')}
            </StyledFilterButton>
          </StyledFilterActions>
        </StyledFilterPanel>

        {onBulkDelete && selectedTenantIds.length > 0 ? (
          <StyledBulkBar data-testid="tenant-bulk-bar">
            <StyledBulkInfo>
              {t('tenant.list.bulkSelectedCount', { count: selectedTenantIds.length })}
            </StyledBulkInfo>
            <StyledBulkActions>
              <StyledActionButton
                type="button"
                onClick={onClearSelection}
                data-testid="tenant-bulk-clear"
              >
                {t('tenant.list.clearSelection')}
              </StyledActionButton>
              <StyledDangerActionButton
                type="button"
                onClick={onBulkDelete}
                data-testid="tenant-bulk-delete"
              >
                {t('tenant.list.bulkDelete')}
              </StyledDangerActionButton>
            </StyledBulkActions>
          </StyledBulkBar>
        ) : null}

        <Card
          variant="outlined"
          accessibilityLabel={t('tenant.list.accessibilityLabel')}
          testID="tenant-list-card"
        >
          <StyledListBody
            role="region"
            aria-label={t('tenant.list.accessibilityLabel')}
            data-testid="tenant-list"
            testID="tenant-list"
          >
            <StyledStateStack>
              {showError ? (
                <ErrorState
                  size={ErrorStateSizes.SMALL}
                  title={t('listScaffold.errorState.title')}
                  description={errorMessage}
                  action={retryAction}
                  testID="tenant-list-error"
                />
              ) : null}

              {showOffline ? (
                <OfflineState
                  size={OfflineStateSizes.SMALL}
                  title={t('shell.banners.offline.title')}
                  description={t('shell.banners.offline.message')}
                  action={retryAction}
                  testID="tenant-list-offline"
                />
              ) : null}
            </StyledStateStack>

            {isLoading ? (
              <LoadingSpinner accessibilityLabel={t('common.loading')} testID="tenant-list-loading" />
            ) : null}

            {showEmpty ? emptyComponent : null}
            {hasNoResults ? noResultsComponent : null}

            {showList && isTableMode ? (
              <StyledTableWrapper>
                <StyledTable data-testid="tenant-table">
                  <thead>
                    <tr>
                      {onBulkDelete ? (
                        <StyledTableHeaderCell>
                          <Checkbox
                            checked={allPageSelected}
                            onChange={(checked) => onTogglePageSelection(Boolean(checked))}
                            accessibilityLabel={t('tenant.list.selectPage')}
                            testID="tenant-select-page"
                          />
                        </StyledTableHeaderCell>
                      ) : null}

                      {visibleColumns.map((column) => (
                        <StyledTableHeaderCell key={column}>
                          <StyledSortButton
                            type="button"
                            onClick={() => onSort(column)}
                            aria-label={t('tenant.list.sortBy', { field: resolveColumnLabel(t, column) })}
                            data-testid={`tenant-sort-${column}`}
                          >
                            {resolveColumnLabel(t, column)}
                            {resolveSortIndicator(sortField, sortDirection, column)}
                          </StyledSortButton>
                        </StyledTableHeaderCell>
                      ))}

                      <StyledTableHeaderCell>{t('tenant.list.columnActions')}</StyledTableHeaderCell>
                    </tr>
                  </thead>

                  <tbody>
                    {rows.map((tenant, index) => {
                      const tenantId = tenant?.id;
                      const itemKey = tenantId ?? tenant?.slug ?? `tenant-${index}`;
                      return (
                        <StyledTableRow key={itemKey}>
                          {onBulkDelete ? (
                            <StyledTableCell $density={density}>
                              <Checkbox
                                checked={Boolean(tenantId) && selectedTenantIds.includes(tenantId)}
                                onChange={() => onToggleTenantSelection(tenantId)}
                                accessibilityLabel={t('tenant.list.selectTenant', {
                                  name: resolveTenantTitle(t, tenant),
                                })}
                                testID={`tenant-select-${itemKey}`}
                              />
                            </StyledTableCell>
                          ) : null}

                          {visibleColumns.map((column) => {
                            const value = resolveTenantCell(t, tenant, column);
                            if (column === 'status' && value && typeof value === 'object') {
                              return (
                                <StyledTableCell key={`${itemKey}-${column}`} $density={density}>
                                  <StyledStatusBadge $tone={value.tone}>{value.label}</StyledStatusBadge>
                                </StyledTableCell>
                              );
                            }
                            return (
                              <StyledTableCell key={`${itemKey}-${column}`} $density={density}>
                                {value}
                              </StyledTableCell>
                            );
                          })}

                          <StyledTableCell $density={density}>
                            <StyledRowActions>
                              {tenantId ? (
                                <StyledActionButton
                                  type="button"
                                  onClick={() => onTenantPress(tenantId)}
                                  data-testid={`tenant-view-${itemKey}`}
                                >
                                  {t('tenant.list.view')}
                                </StyledActionButton>
                              ) : null}

                              {onEdit && tenantId ? (
                                <StyledActionButton
                                  type="button"
                                  onClick={(event) => onEdit(tenantId, event)}
                                  data-testid={`tenant-edit-${itemKey}`}
                                >
                                  {t('tenant.list.edit')}
                                </StyledActionButton>
                              ) : null}

                              {onDelete && tenantId ? (
                                <StyledDangerActionButton
                                  type="button"
                                  onClick={(event) => onDelete(tenantId, event)}
                                  data-testid={`tenant-delete-${itemKey}`}
                                >
                                  {t('common.remove')}
                                </StyledDangerActionButton>
                              ) : null}
                            </StyledRowActions>
                          </StyledTableCell>
                        </StyledTableRow>
                      );
                    })}
                  </tbody>
                </StyledTable>
              </StyledTableWrapper>
            ) : null}

            {showList && !isTableMode ? (
              <StyledMobileList role="list">
                {rows.map((tenant, index) => {
                  const title = resolveTenantTitle(t, tenant);
                  const leadingGlyph = String(title || 'T').charAt(0).toUpperCase();
                  const tenantId = tenant?.id;
                  const itemKey = tenantId ?? tenant?.slug ?? `tenant-${index}`;
                  const statusLabel = tenant?.is_active
                    ? t('tenant.list.statusActive')
                    : t('tenant.list.statusInactive');
                  const statusTone = tenant?.is_active ? 'success' : 'warning';
                  return (
                    <li key={itemKey} role="listitem">
                      <ListItem
                        leading={{ glyph: leadingGlyph, tone: 'inverse', backgroundTone: 'primary' }}
                        title={title}
                        subtitle={resolveTenantSlug(tenant)
                          ? t('tenant.list.slugValue', { slug: resolveTenantSlug(tenant) })
                          : undefined}
                        metadata={resolveTenantHumanId(tenant)
                          ? [{ key: 'tenant-human-id', text: t('tenant.list.idValue', { id: resolveTenantHumanId(tenant) }) }]
                          : []}
                        status={{
                          label: statusLabel,
                          tone: statusTone,
                          showDot: true,
                          accessibilityLabel: t('tenant.list.statusLabel'),
                        }}
                        density="compact"
                        onPress={tenantId ? () => onTenantPress(tenantId) : undefined}
                        onView={tenantId ? () => onTenantPress(tenantId) : undefined}
                        onEdit={onEdit && tenantId ? (event) => onEdit(tenantId, event) : undefined}
                        onDelete={onDelete && tenantId ? (event) => onDelete(tenantId, event) : undefined}
                        viewLabel={t('tenant.list.view')}
                        viewHint={t('tenant.list.viewHint')}
                        editLabel={t('tenant.list.edit')}
                        editHint={t('tenant.list.editHint')}
                        deleteLabel={t('common.remove')}
                        deleteHint={t('tenant.list.deleteHint')}
                        onMore={tenantId ? () => onTenantPress(tenantId) : undefined}
                        moreLabel={t('common.more')}
                        moreHint={t('tenant.list.viewHint')}
                        viewTestID={`tenant-view-${itemKey}`}
                        editTestID={`tenant-edit-${itemKey}`}
                        deleteTestID={`tenant-delete-${itemKey}`}
                        moreTestID={`tenant-more-${itemKey}`}
                        accessibilityLabel={t('tenant.list.itemLabel', { name: title })}
                        accessibilityHint={t('tenant.list.itemHint', { name: title })}
                        testID={`tenant-item-${itemKey}`}
                      />
                    </li>
                  );
                })}
              </StyledMobileList>
            ) : null}

            {showList ? (
              <StyledPagination>
                <StyledPaginationInfo>
                  {t('tenant.list.pageSummary', { page, totalPages, total: totalItems })}
                </StyledPaginationInfo>

                <StyledPaginationActions>
                  <StyledActionButton
                    type="button"
                    onClick={() => onPageChange(page - 1)}
                    disabled={page <= 1}
                    data-testid="tenant-page-prev"
                  >
                    {t('common.previous')}
                  </StyledActionButton>

                  <Select
                    value={String(pageSize)}
                    onValueChange={onPageSizeChange}
                    options={pageSizeOptions}
                    label={t('tenant.list.pageSizeLabel')}
                    compact
                    testID="tenant-page-size"
                  />

                  <Select
                    value={density}
                    onValueChange={onDensityChange}
                    options={densityOptions}
                    label={t('tenant.list.densityLabel')}
                    compact
                    testID="tenant-density"
                  />

                  <StyledActionButton
                    type="button"
                    onClick={() => onPageChange(page + 1)}
                    disabled={page >= totalPages}
                    data-testid="tenant-page-next"
                  >
                    {t('common.next')}
                  </StyledActionButton>
                </StyledPaginationActions>
              </StyledPagination>
            ) : null}
          </StyledListBody>
        </Card>

        <Modal
          visible={Boolean(isTableMode && isTableSettingsOpen)}
          onDismiss={onCloseTableSettings}
          size="small"
          accessibilityLabel={t('tenant.list.tableSettings')}
          testID="tenant-table-settings-modal"
        >
          <StyledSettingsBody>
            <StyledSettingsSection>
              <StyledSettingsTitle>{t('tenant.list.visibleColumns')}</StyledSettingsTitle>
              {columnOrder.map((column) => (
                <StyledColumnRow key={column}>
                  <Checkbox
                    checked={visibleColumns.includes(column)}
                    onChange={() => onToggleColumnVisibility(column)}
                    label={resolveColumnLabel(t, column)}
                    testID={`tenant-column-visible-${column}`}
                  />

                  <StyledColumnMoveControls>
                    <StyledMoveButton
                      type="button"
                      onClick={() => onMoveColumnLeft(column)}
                      aria-label={t('tenant.list.moveColumnLeft', {
                        column: resolveColumnLabel(t, column),
                      })}
                      disabled={columnOrder.indexOf(column) === 0}
                      data-testid={`tenant-column-left-${column}`}
                    >
                      {'<'}
                    </StyledMoveButton>
                    <StyledMoveButton
                      type="button"
                      onClick={() => onMoveColumnRight(column)}
                      aria-label={t('tenant.list.moveColumnRight', {
                        column: resolveColumnLabel(t, column),
                      })}
                      disabled={columnOrder.indexOf(column) === columnOrder.length - 1}
                      data-testid={`tenant-column-right-${column}`}
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
                data-testid="tenant-table-settings-reset"
              >
                {t('tenant.list.resetTablePreferences')}
              </StyledFilterButton>
            </StyledSettingsActions>
          </StyledSettingsBody>
        </Modal>
      </StyledContent>
    </StyledContainer>
  );
};

export default TenantListScreenWeb;
