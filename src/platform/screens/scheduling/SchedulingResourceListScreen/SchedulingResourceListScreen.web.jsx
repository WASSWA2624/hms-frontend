import React from 'react';
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
  StyledAddButton,
  StyledAddLabel,
  StyledContainer,
  StyledContent,
  StyledList,
  StyledListBody,
  StyledStateStack,
  StyledToolbar,
  StyledToolbarActions,
} from './SchedulingResourceListScreen.web.styles';
import useSchedulingResourceListScreen from './useSchedulingResourceListScreen';

const resolveColumnLabelKey = (column) => `scheduling.common.list.column${column.charAt(0).toUpperCase()}${column.slice(1)}`;

const SchedulingResourceListScreenWeb = ({ resourceId }) => {
  const { t } = useI18n();
  const {
    config,
    pagedRecords,
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
    reminderBoardFilter,
    reminderBoardFilterOptions,
    showReminderBoardFilters,
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
    selectedRecordIds,
    allPageSelected,
    isTableMode,
    isTableSettingsOpen,
    items,
    isLoading,
    hasError,
    errorMessage,
    isOffline,
    noticeMessage,
    onDismissNotice,
    onRetry,
    onSearch,
    onSearchScopeChange,
    onReminderBoardFilterChange,
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
    onToggleRecordSelection,
    onTogglePageSelection,
    onClearSelection,
    onBulkDelete,
    resolveFilterOperatorOptions,
    resolveRowAction,
    onItemPress,
    onDelete,
    onEdit,
    onAdd,
    canCreate,
    canEdit,
    canDelete,
    createBlockedReason,
    deleteBlockedReason,
  } = useSchedulingResourceListScreen(resourceId);

  if (!config) return null;

  const titleKey = `${config.i18nKey}.list.title`;
  const addLabelKey = `${config.i18nKey}.list.addLabel`;
  const rows = pagedRecords.map((record) => record.item);

  const showError = !isLoading && hasError && !isOffline;
  const showOffline = !isLoading && isOffline && rows.length === 0;
  const showOfflineBanner = !isLoading && isOffline && rows.length > 0;
  const showEmpty = !isLoading && !showError && !showOffline && !hasNoResults && totalItems === 0;
  const showNoResults = !isLoading && !showError && !showOffline && hasNoResults;
  const showList = !isLoading && !showError && !showOffline && rows.length > 0;

  const tableColumns = visibleColumns.map((column) => ({
    id: column,
    label: t(resolveColumnLabelKey(column)),
    sortable: true,
    renderCell: (item) => {
      if (column === 'title') return config.getItemTitle(item, t);
      if (column === 'subtitle') return config.getItemSubtitle(item, t) || '-';
      if (column === 'updatedAt') return item?.updated_at || '-';
      if (column === 'createdAt') return item?.created_at || '-';
      return '-';
    },
  }));

  const tableSelection = onBulkDelete ? {
    enabled: true,
    allSelected: allPageSelected,
    onToggleAll: (checked) => onTogglePageSelection(Boolean(checked)),
    isRowSelected: (item) => Boolean(item?.id) && selectedRecordIds.includes(item.id),
    onToggleRow: (item) => onToggleRecordSelection(item?.id),
    selectAllLabel: t('scheduling.common.list.selectPage'),
    selectRowLabel: (item) => t('scheduling.common.list.selectRow', { name: config.getItemTitle(item, t) }),
    headerCheckboxTestId: 'scheduling-select-page',
    rowCheckboxTestIdPrefix: 'scheduling-select-row',
  } : undefined;

  const searchBar = (
    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'flex-end' }}>
      <div style={{ minWidth: 220, flex: 1 }}>
        <TextField
          value={search}
          onChange={(event) => onSearch(event.target.value)}
          placeholder={t('scheduling.common.list.searchPlaceholder')}
          accessibilityLabel={t('scheduling.common.list.searchLabel')}
          density="compact"
          type="search"
          testID="scheduling-resource-list-search"
        />
      </div>
      <div style={{ minWidth: 180 }}>
        <Select
          value={searchScope}
          onValueChange={onSearchScopeChange}
          options={searchScopeOptions}
          label={t('scheduling.common.list.searchScopeLabel')}
          compact
          testID="scheduling-resource-list-search-scope"
        />
      </div>
      {showReminderBoardFilters ? (
        <div style={{ minWidth: 180 }}>
          <Select
            value={reminderBoardFilter}
            onValueChange={onReminderBoardFilterChange}
            options={reminderBoardFilterOptions}
            label={t('scheduling.resources.appointmentReminders.list.quickFilters')}
            compact
            testID="scheduling-resource-list-reminder-board"
          />
        </div>
      ) : null}
      {isTableMode ? (
        <Button
          variant="surface"
          size="small"
          onPress={onOpenTableSettings}
          testID="scheduling-resource-list-table-settings"
        >
          {t('scheduling.common.list.tableSettings')}
        </Button>
      ) : null}
      <StyledAddButton
        type="button"
        onClick={onAdd}
        disabled={!canCreate}
        aria-disabled={!canCreate}
        title={!canCreate ? createBlockedReason : undefined}
        accessibilityLabel={t(addLabelKey)}
        accessibilityHint={t(`${config.i18nKey}.list.addHint`)}
        testID="scheduling-resource-list-add"
        data-testid="scheduling-resource-list-add"
      >
        <Icon glyph="+" size="xs" decorative />
        <StyledAddLabel>{t(addLabelKey)}</StyledAddLabel>
      </StyledAddButton>
    </div>
  );

  const filterBar = (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      <div style={{ width: 180 }}>
        <Select
          value={filterLogic}
          onValueChange={onFilterLogicChange}
          options={filterLogicOptions}
          label={t('scheduling.common.list.filterLogicLabel')}
          compact
          testID="scheduling-resource-list-filter-logic"
        />
      </div>

      {filters.map((filter, index) => (
        <div key={filter.id} style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'flex-end' }}>
          <div style={{ minWidth: 190 }}>
            <Select
              value={filter.field}
              onValueChange={(value) => onFilterFieldChange(filter.id, value)}
              options={filterFieldOptions}
              label={t('scheduling.common.list.filterFieldLabel')}
              compact
              testID={`scheduling-resource-list-filter-field-${index}`}
            />
          </div>

          <div style={{ minWidth: 150 }}>
            <Select
              value={filter.operator}
              onValueChange={(value) => onFilterOperatorChange(filter.id, value)}
              options={resolveFilterOperatorOptions(filter.field)}
              label={t('scheduling.common.list.filterOperatorLabel')}
              compact
              testID={`scheduling-resource-list-filter-operator-${index}`}
            />
          </div>

          <div style={{ minWidth: 220 }}>
            <TextField
              value={filter.value}
              onChange={(event) => onFilterValueChange(filter.id, event.target.value)}
              label={t('scheduling.common.list.filterValueLabel')}
              placeholder={t('scheduling.common.list.filterValuePlaceholder')}
              density="compact"
              testID={`scheduling-resource-list-filter-value-${index}`}
            />
          </div>

          <Button
            variant="surface"
            size="small"
            onPress={() => onRemoveFilter(filter.id)}
            testID={`scheduling-resource-list-filter-remove-${index}`}
          >
            {t('common.remove')}
          </Button>
        </div>
      ))}

      <div style={{ display: 'flex', gap: 8 }}>
        <Button
          variant="surface"
          size="small"
          onPress={onAddFilter}
          disabled={!canAddFilter}
          testID="scheduling-resource-list-filter-add"
        >
          {t('scheduling.common.list.addFilter')}
        </Button>
        <Button
          variant="surface"
          size="small"
          onPress={onClearSearchAndFilters}
          testID="scheduling-resource-list-filter-clear"
        >
          {t('scheduling.common.list.clearSearchAndFilters')}
        </Button>
      </div>
    </div>
  );

  const bulkActionsBar = onBulkDelete && selectedRecordIds.length > 0 ? (
    <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8, flexWrap: 'wrap' }}>
      <span>{t('scheduling.common.list.bulkSelectedCount', { count: selectedRecordIds.length })}</span>
      <div style={{ display: 'flex', gap: 8 }}>
        <Button variant="surface" size="small" onPress={onClearSelection} testID="scheduling-resource-list-clear-selection">
          {t('scheduling.common.list.clearSelection')}
        </Button>
        <Button variant="surface" size="small" onPress={onBulkDelete} testID="scheduling-resource-list-bulk-delete">
          {t('scheduling.common.list.bulkDelete')}
        </Button>
      </div>
    </div>
  ) : null;

  const pagination = showList ? (
    <span>{t('scheduling.common.list.pageSummary', { page, totalPages, total: totalItems })}</span>
  ) : null;

  const tableNavigation = showList ? (
    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
      <Button variant="surface" size="small" onPress={() => onPageChange(page - 1)} disabled={page <= 1}>
        {t('common.previous')}
      </Button>
      <Select
        value={String(pageSize)}
        onValueChange={onPageSizeChange}
        options={pageSizeOptions}
        label={t('scheduling.common.list.pageSizeLabel')}
        compact
        testID="scheduling-resource-list-page-size"
      />
      <Select
        value={density}
        onValueChange={onDensityChange}
        options={densityOptions}
        label={t('scheduling.common.list.densityLabel')}
        compact
        testID="scheduling-resource-list-density"
      />
      <Button variant="surface" size="small" onPress={() => onPageChange(page + 1)} disabled={page >= totalPages}>
        {t('common.next')}
      </Button>
    </div>
  ) : null;

  return (
    <StyledContainer role="main" aria-label={t(titleKey)}>
      {noticeMessage ? (
        <Snackbar
          visible={Boolean(noticeMessage)}
          message={noticeMessage}
          variant="success"
          position="bottom"
          onDismiss={onDismissNotice}
          testID="scheduling-resource-list-notice"
        />
      ) : null}
      <StyledContent>
        {!isTableMode ? (
          <StyledToolbar data-testid="scheduling-resource-list-toolbar">
            <StyledToolbarActions>{searchBar}</StyledToolbarActions>
          </StyledToolbar>
        ) : null}

        <Card
          variant="outlined"
          accessibilityLabel={t(`${config.i18nKey}.list.accessibilityLabel`)}
          testID="scheduling-resource-list-card"
        >
          <StyledListBody role="region" aria-label={t(`${config.i18nKey}.list.accessibilityLabel`)}>
            <StyledStateStack>
              {showError ? (
                <ErrorState
                  size={ErrorStateSizes.SMALL}
                  title={t('listScaffold.errorState.title')}
                  description={errorMessage}
                  action={
                    <Button
                      variant="surface"
                      size="small"
                      onPress={onRetry}
                      accessibilityLabel={t('common.retry')}
                      accessibilityHint={t('common.retryHint')}
                      icon={<Icon glyph="?" size="xs" decorative />}
                    >
                      {t('common.retry')}
                    </Button>
                  }
                  testID="scheduling-resource-list-error"
                />
              ) : null}

              {showOffline ? (
                <OfflineState
                  size={OfflineStateSizes.SMALL}
                  title={t('shell.banners.offline.title')}
                  description={t('shell.banners.offline.message')}
                  action={
                    <Button
                      variant="surface"
                      size="small"
                      onPress={onRetry}
                      accessibilityLabel={t('common.retry')}
                      accessibilityHint={t('common.retryHint')}
                      icon={<Icon glyph="?" size="xs" decorative />}
                    >
                      {t('common.retry')}
                    </Button>
                  }
                  testID="scheduling-resource-list-offline"
                />
              ) : null}

              {showOfflineBanner ? (
                <OfflineState
                  size={OfflineStateSizes.SMALL}
                  title={t('shell.banners.offline.title')}
                  description={t('shell.banners.offline.message')}
                  action={
                    <Button
                      variant="surface"
                      size="small"
                      onPress={onRetry}
                      accessibilityLabel={t('common.retry')}
                      accessibilityHint={t('common.retryHint')}
                      icon={<Icon glyph="?" size="xs" decorative />}
                    >
                      {t('common.retry')}
                    </Button>
                  }
                  testID="scheduling-resource-list-offline-banner"
                />
              ) : null}
            </StyledStateStack>

            {isLoading ? (
              <LoadingSpinner accessibilityLabel={t('common.loading')} testID="scheduling-resource-list-loading" />
            ) : null}

            {showEmpty ? (
              <EmptyState
                title={t(`${config.i18nKey}.list.emptyTitle`)}
                description={t(`${config.i18nKey}.list.emptyMessage`)}
                testID="scheduling-resource-list-empty"
              />
            ) : null}

            {showNoResults ? (
              <EmptyState
                title={t('scheduling.common.list.noResultsTitle')}
                description={t('scheduling.common.list.noResultsMessage')}
                action={(
                  <Button variant="surface" size="small" onPress={onClearSearchAndFilters}>
                    {t('scheduling.common.list.clearSearchAndFilters')}
                  </Button>
                )}
                testID="scheduling-resource-list-no-results"
              />
            ) : null}

            {showList && isTableMode ? (
              <DataTable
                columns={tableColumns}
                rows={rows}
                getRowKey={(item, index) => item?.id ?? `scheduling-row-${index}`}
                rowDensity={density}
                sortField={sortField}
                sortDirection={sortDirection}
                onSort={onSort}
                selection={tableSelection}
                renderRowActions={(item) => {
                  const itemId = item?.id;
                  if (!itemId) return null;
                  const resourceAction = resolveRowAction(item);
                  return (
                    <div style={{ display: 'flex', gap: 8 }}>
                      <Button variant="surface" size="small" onPress={() => onItemPress(itemId)}>
                        {t('scheduling.common.list.view')}
                      </Button>
                      {resourceAction ? (
                        <Button
                          variant="surface"
                          size="small"
                          onPress={resourceAction.onPress}
                          disabled={resourceAction.disabled}
                        >
                          {resourceAction.label}
                        </Button>
                      ) : null}
                      {canEdit && onEdit ? (
                        <Button variant="surface" size="small" onPress={(event) => onEdit(itemId, event)}>
                          {t('scheduling.common.list.edit')}
                        </Button>
                      ) : null}
                      {canDelete && onDelete ? (
                        <Button variant="surface" size="small" onPress={(event) => onDelete(itemId, event)}>
                          {t('common.remove')}
                        </Button>
                      ) : null}
                    </div>
                  );
                }}
                rowActionsLabel={t('scheduling.common.list.actions')}
                onRowPress={(item) => {
                  if (item?.id) onItemPress(item.id);
                }}
                searchBar={searchBar}
                filterBar={filterBar}
                hasActiveFilters={hasActiveSearchOrFilter}
                bulkActionsBar={bulkActionsBar}
                pagination={pagination}
                tableNavigation={tableNavigation}
                showDefaultEmptyRow={false}
                minWidth={980}
                testID="scheduling-resource-table"
              />
            ) : null}

            {showList && !isTableMode ? (
              <StyledList role="list">
                {items.map((item) => {
                  const itemTitle = config.getItemTitle(item, t);
                  const itemSubtitle = config.getItemSubtitle(item, t);
                  const resourceAction = resolveRowAction(item);
                  const canDeleteItem = canDelete;

                  return (
                    <li key={item.id} role="listitem">
                      <ListItem
                        title={itemTitle}
                        subtitle={itemSubtitle}
                        onPress={() => onItemPress(item.id)}
                        actions={(
                          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                            {resourceAction ? (
                              <Button
                                variant="surface"
                                size="small"
                                onPress={resourceAction.onPress}
                                disabled={resourceAction.disabled}
                                testID={`scheduling-resource-action-${resourceAction.key}-${item.id}`}
                              >
                                {resourceAction.label}
                              </Button>
                            ) : null}
                            {canEdit && onEdit ? (
                              <Button
                                variant="surface"
                                size="small"
                                onPress={(event) => onEdit(item.id, event)}
                                testID={`scheduling-resource-edit-${item.id}`}
                              >
                                {t('scheduling.common.list.edit')}
                              </Button>
                            ) : null}
                            {canDelete && onDelete ? (
                              <Button
                                variant="surface"
                                size="small"
                                onPress={(event) => onDelete(item.id, event)}
                                disabled={!canDeleteItem}
                                aria-disabled={!canDeleteItem}
                                title={!canDeleteItem ? deleteBlockedReason : undefined}
                                accessibilityLabel={t(`${config.i18nKey}.list.delete`) }
                                accessibilityHint={t(`${config.i18nKey}.list.deleteHint`) }
                                icon={<Icon glyph="?" size="xs" decorative />}
                                testID={`scheduling-resource-delete-${item.id}`}
                              >
                                {t('common.remove')}
                              </Button>
                            ) : null}
                            {onBulkDelete ? (
                              <Checkbox
                                checked={selectedRecordIds.includes(item.id)}
                                onChange={() => onToggleRecordSelection(item.id)}
                                label={t('scheduling.common.list.selectRow', { name: itemTitle })}
                                testID={`scheduling-resource-select-${item.id}`}
                              />
                            ) : null}
                          </div>
                        )}
                        accessibilityLabel={t(`${config.i18nKey}.list.itemLabel`, { name: itemTitle })}
                        accessibilityHint={t(`${config.i18nKey}.list.itemHint`, { name: itemTitle })}
                        testID={`scheduling-resource-item-${item.id}`}
                      />
                    </li>
                  );
                })}
              </StyledList>
            ) : null}

            {!isTableMode ? filterBar : null}
            {!isTableMode ? bulkActionsBar : null}
            {!isTableMode ? pagination : null}
            {!isTableMode ? tableNavigation : null}
          </StyledListBody>
        </Card>

        <Modal
          visible={Boolean(isTableMode && isTableSettingsOpen)}
          onDismiss={onCloseTableSettings}
          size="small"
          accessibilityLabel={t('scheduling.common.list.tableSettings')}
          testID="scheduling-resource-table-settings-modal"
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <strong>{t('scheduling.common.list.visibleColumns')}</strong>
            {columnOrder.map((column) => (
              <div key={column} style={{ display: 'flex', justifyContent: 'space-between', gap: 8 }}>
                <Checkbox
                  checked={visibleColumns.includes(column)}
                  onChange={() => onToggleColumnVisibility(column)}
                  label={t(resolveColumnLabelKey(column))}
                  testID={`scheduling-resource-column-${column}`}
                />
                <div style={{ display: 'flex', gap: 4 }}>
                  <Button
                    variant="surface"
                    size="small"
                    onPress={() => onMoveColumnLeft(column)}
                    disabled={columnOrder.indexOf(column) === 0}
                  >
                    {'<'}
                  </Button>
                  <Button
                    variant="surface"
                    size="small"
                    onPress={() => onMoveColumnRight(column)}
                    disabled={columnOrder.indexOf(column) === columnOrder.length - 1}
                  >
                    {'>'}
                  </Button>
                </div>
              </div>
            ))}
            <Button variant="surface" size="small" onPress={onResetTablePreferences}>
              {t('scheduling.common.list.resetTablePreferences')}
            </Button>
          </div>
        </Modal>
      </StyledContent>
    </StyledContainer>
  );
};

export default SchedulingResourceListScreenWeb;
