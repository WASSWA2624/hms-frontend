/**
 * ContactListScreen - Web
 * Desktop/tablet renders a customizable table; mobile web renders compact cards.
 */
import React, { useCallback, useMemo, useState } from 'react';
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
} from './ContactListScreen.web.styles';
import useContactListScreen from './useContactListScreen';

const resolveContactTitle = (t, contact) => {
  const value = humanizeIdentifier(
    contact?.value
    ?? contact?.name
  );
  if (value) return String(value).trim();
  return t('contact.list.unnamed');
};

const resolveContactTenantLabel = (t, contact, canViewTechnicalIds = false) => {
  const value = humanizeIdentifier(
    contact?.tenant_name
    ?? contact?.tenant?.name
    ?? contact?.tenant_label
  );
  if (value) return String(value).trim();
  if (canViewTechnicalIds) {
    const tenantId = String(contact?.tenant_id ?? '').trim();
    if (tenantId) return tenantId;
  }
  if (String(contact?.tenant_id ?? '').trim()) {
    return t('contact.list.currentTenant');
  }
  return t('common.notAvailable');
};

const resolveContactTypeLabel = (t, contact) => {
  const rawType = humanizeIdentifier(
    contact?.contact_type
    ?? contact?.type
    ?? contact?.contactType
  );
  if (!rawType) return t('common.notAvailable');
  const typeKey = `contact.types.${rawType}`;
  const translatedType = t(typeKey);
  return translatedType === typeKey ? rawType : translatedType;
};

const resolveColumnLabel = (t, column) => {
  if (column === 'value') return t('contact.list.columnValue');
  if (column === 'type') return t('contact.list.columnType');
  if (column === 'tenant') return t('contact.list.columnTenant');
  if (column === 'primary') return t('contact.list.columnPrimary');
  return column;
};

const TABLE_COLUMN_LAYOUT = {
  value: { width: 240, minWidth: 200, align: 'left' },
  type: { width: 180, minWidth: 140, align: 'left' },
  tenant: { width: 220, minWidth: 180, align: 'left' },
  primary: { width: 130, minWidth: 112, align: 'center', truncate: false },
};

const resolveContactCell = (t, contact, column, canViewTechnicalIds = false) => {
  if (column === 'value') return resolveContactTitle(t, contact);
  if (column === 'type') return resolveContactTypeLabel(t, contact);
  if (column === 'tenant') return resolveContactTenantLabel(t, contact, canViewTechnicalIds);
  if (column === 'primary') {
    const isPrimary = Boolean(contact?.is_primary);
    return {
      label: isPrimary ? t('contact.list.primaryStatePrimary') : t('contact.list.primaryStateSecondary'),
      tone: isPrimary ? 'success' : 'warning',
    };
  }
  return t('common.notAvailable');
};

const resolveMobileSubtitle = (t, contact, canViewTechnicalIds = false) => {
  const tenant = resolveContactTenantLabel(t, contact, canViewTechnicalIds);
  const type = resolveContactTypeLabel(t, contact);

  if (type !== t('common.notAvailable') && tenant !== t('common.notAvailable')) {
    return t('contact.list.contextValue', { type, tenant });
  }
  if (type !== t('common.notAvailable')) {
    return t('contact.list.typeValue', { type });
  }
  if (tenant !== t('common.notAvailable')) {
    return t('contact.list.tenantValue', { tenant });
  }
  return undefined;
};

const ContactListScreenWeb = () => {
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
    selectedContactIds,
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
    onToggleContactSelection,
    onTogglePageSelection,
    onClearSelection,
    onBulkDelete,
    resolveFilterOperatorOptions,
    onContactPress,
    onEdit,
    onDelete,
    onAdd,
  } = useContactListScreen();

  const rows = pagedItems;
  const [isFilterPanelCollapsed, setIsFilterPanelCollapsed] = useState(false);
  const showError = !isLoading && hasError && !isOffline;
  const showOffline = !isLoading && isOffline && rows.length === 0;
  const showOfflineBanner = !isLoading && isOffline && rows.length > 0;
  const showEmpty = !isLoading && !showError && !showOffline && !hasNoResults && totalItems === 0;
  const showList = !isLoading && !showError && !showOffline && rows.length > 0;
  const showDesktopTable = isTableMode && !showError && !showOffline;

  const emptyComponent = (
    <EmptyState
      title={t('contact.list.emptyTitle')}
      description={t('contact.list.emptyMessage')}
      action={
        onAdd ? (
          <StyledAddButton
            type="button"
            onClick={onAdd}
            onPress={onAdd}
            accessibilityLabel={t('contact.list.addLabel')}
            accessibilityHint={t('contact.list.addHint')}
            testID="contact-list-empty-add"
          >
            <Icon glyph="+" size="xs" decorative />
            <StyledAddLabel>{t('contact.list.addLabel')}</StyledAddLabel>
          </StyledAddButton>
        ) : undefined
      }
      testID="contact-list-empty-state"
    />
  );

  const noResultsComponent = (
    <EmptyState
      title={t('contact.list.noResultsTitle')}
      description={t('contact.list.noResultsMessage')}
      action={
        <StyledFilterButton
          type="button"
          onClick={onClearSearchAndFilters}
          testID="contact-list-clear-search"
          aria-label={t('contact.list.clearSearchAndFilters')}
        >
          {t('contact.list.clearSearchAndFilters')}
        </StyledFilterButton>
      }
      testID="contact-list-no-results"
    />
  );

  const retryAction = onRetry ? (
    <Button
      variant="surface"
      size="small"
      onPress={onRetry}
      accessibilityLabel={t('common.retry')}
      accessibilityHint={t('common.retryHint')}
      testID="contact-list-retry"
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
        sortLabel: t('contact.list.sortBy', { field: resolveColumnLabel(t, column) }),
        width: columnLayout.width,
        minWidth: columnLayout.minWidth,
        align: columnLayout.align,
        truncate: columnLayout.truncate,
        renderCell: (contact) => {
          const value = resolveContactCell(t, contact, column, canViewTechnicalIds);
          if (column === 'primary' && value && typeof value === 'object') {
            return <StyledStatusBadge $tone={value.tone}>{value.label}</StyledStatusBadge>;
          }
          if (column === 'value') {
            return <StyledPrimaryCellText>{value}</StyledPrimaryCellText>;
          }
          if (column === 'type' || column === 'tenant') {
            return <StyledCodeCellText>{value}</StyledCodeCellText>;
          }
          return value;
        },
        getCellTitle: (contact) => {
          const value = resolveContactCell(t, contact, column, canViewTechnicalIds);
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
      isRowSelected: (Contact) => Boolean(Contact?.id) && selectedContactIds.includes(Contact.id),
      onToggleRow: (Contact) => onToggleContactSelection(Contact?.id),
      selectAllLabel: t('contact.list.selectPage'),
      selectRowLabel: (Contact) => t('contact.list.selectContact', {
        name: resolveContactTitle(t, Contact),
      }),
      headerCheckboxTestId: 'contact-select-page',
      rowCheckboxTestIdPrefix: 'contact-select',
    };
  }, [
    onBulkDelete,
    allPageSelected,
    onTogglePageSelection,
    selectedContactIds,
    onToggleContactSelection,
    t,
  ]);

  const handleTableRowPress = useCallback((Contact) => {
    if (!Contact?.id) return;
    onContactPress(Contact.id);
  }, [onContactPress]);

  const renderTableRowActions = useCallback((Contact) => {
    const ContactId = Contact?.id;
    if (!ContactId) return null;

    return (
      <StyledRowActions>
        <StyledActionButton
          type="button"
          onClick={(event) => {
            event.stopPropagation();
            onContactPress(ContactId);
          }}
          data-testid={`contact-view-${ContactId}`}
        >
          {t('contact.list.view')}
        </StyledActionButton>

        {onEdit ? (
          <StyledActionButton
            type="button"
            onClick={(event) => onEdit(ContactId, event)}
            data-testid={`contact-edit-${ContactId}`}
          >
            {t('contact.list.edit')}
          </StyledActionButton>
        ) : null}

        {onDelete ? (
          <StyledDangerActionButton
            type="button"
            onClick={(event) => onDelete(ContactId, event)}
            data-testid={`contact-delete-${ContactId}`}
          >
            {t('common.remove')}
          </StyledDangerActionButton>
        ) : null}
      </StyledRowActions>
    );
  }, [onContactPress, onEdit, onDelete, t]);

  const searchBarSection = (
    <StyledToolbar data-testid="contact-list-toolbar">
      <StyledSearchSlot>
        <TextField
          value={search}
          onChange={(e) => onSearch(e.target.value)}
          placeholder={t('contact.list.searchPlaceholder')}
          accessibilityLabel={t('contact.list.searchLabel')}
          density="compact"
          type="search"
          testID="contact-list-search"
        />
      </StyledSearchSlot>

      <StyledScopeSlot>
        <StyledControlLabel>{t('contact.list.searchScopeLabel')}</StyledControlLabel>
        <Select
          value={searchScope}
          onValueChange={onSearchScopeChange}
          options={searchScopeOptions}
          accessibilityLabel={t('contact.list.searchScopeLabel')}
          compact
          testID="contact-list-search-scope"
        />
      </StyledScopeSlot>

      <StyledToolbarActions>
        {isTableMode ? (
          <StyledTableSettingsButton
            type="button"
            onClick={onOpenTableSettings}
            aria-label={t('contact.list.tableSettings')}
            data-testid="contact-table-settings"
          >
            {t('contact.list.tableSettings')}
          </StyledTableSettingsButton>
        ) : null}

        {onAdd ? (
          <StyledAddButton
            type="button"
            onClick={onAdd}
            onPress={onAdd}
            accessibilityLabel={t('contact.list.addLabel')}
            accessibilityHint={t('contact.list.addHint')}
            testID="contact-list-add"
          >
            <Icon glyph="+" size="xs" decorative />
            <StyledAddLabel>{t('contact.list.addLabel')}</StyledAddLabel>
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
          data-testid="contact-filter-toggle"
        >
          <StyledFilterChevron $collapsed={isFilterPanelCollapsed} aria-hidden="true">
            {'\u25BE'}
          </StyledFilterChevron>
        </StyledFilterToggleButton>
      </StyledFilterHeader>

      {!isFilterPanelCollapsed ? (
        <StyledFilterBody data-testid="contact-filter-body">
          <Select
            value={filterLogic}
            onValueChange={onFilterLogicChange}
            options={filterLogicOptions}
            label={t('contact.list.filterLogicLabel')}
            accessibilityLabel={t('contact.list.filterLogicLabel')}
            compact
            testID="contact-filter-logic"
          />

          {filters.map((filter, index) => {
            const operatorOptions = resolveFilterOperatorOptions(filter.field);
            const isPrimaryFilter = filter.field === 'primary';
            return (
              <StyledFilterRow key={filter.id}>
                <Select
                  value={filter.field}
                  onValueChange={(value) => onFilterFieldChange(filter.id, value)}
                  options={filterFieldOptions}
                  label={t('contact.list.filterFieldLabel')}
                  compact
                  testID={`contact-filter-field-${index}`}
                />

                <Select
                  value={filter.operator}
                  onValueChange={(value) => onFilterOperatorChange(filter.id, value)}
                  options={operatorOptions}
                  label={t('contact.list.filterOperatorLabel')}
                  compact
                  testID={`contact-filter-operator-${index}`}
                />

                {isPrimaryFilter ? (
                  <Select
                    value={filter.value || 'primary'}
                    onValueChange={(value) => onFilterValueChange(filter.id, value)}
                    options={[
                      { value: 'primary', label: t('contact.list.primaryStatePrimary') },
                      { value: 'secondary', label: t('contact.list.primaryStateSecondary') },
                    ]}
                    label={t('contact.list.filterValueLabel')}
                    compact
                    testID={`contact-filter-value-${index}`}
                  />
                ) : (
                  <TextField
                    value={filter.value}
                    onChange={(event) => onFilterValueChange(filter.id, event.target.value)}
                    label={t('contact.list.filterValueLabel')}
                    placeholder={t('contact.list.filterValuePlaceholder')}
                    density="compact"
                    testID={`contact-filter-value-${index}`}
                  />
                )}

                <StyledFilterRowActions>
                  <StyledFilterButton
                    type="button"
                    onClick={() => onRemoveFilter(filter.id)}
                    aria-label={t('contact.list.removeFilter')}
                    testID={`contact-filter-remove-${index}`}
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
              testID="contact-filter-add"
            >
              {t('contact.list.addFilter')}
            </StyledFilterButton>
            <StyledFilterButton
              type="button"
              onClick={onClearSearchAndFilters}
              testID="contact-filter-clear"
            >
              {t('contact.list.clearSearchAndFilters')}
            </StyledFilterButton>
          </StyledFilterActions>
        </StyledFilterBody>
      ) : null}
    </StyledFilterPanel>
  );

  const bulkActionsBar = onBulkDelete && selectedContactIds.length > 0 ? (
    <StyledBulkBar data-testid="contact-bulk-bar">
      <StyledBulkInfo>
        {t('contact.list.bulkSelectedCount', { count: selectedContactIds.length })}
      </StyledBulkInfo>
      <StyledBulkActions>
        <StyledActionButton
          type="button"
          onClick={onClearSelection}
          data-testid="contact-bulk-clear"
        >
          {t('contact.list.clearSelection')}
        </StyledActionButton>
        <StyledDangerActionButton
          type="button"
          onClick={onBulkDelete}
          data-testid="contact-bulk-delete"
        >
          {t('contact.list.bulkDelete')}
        </StyledDangerActionButton>
      </StyledBulkActions>
    </StyledBulkBar>
  ) : null;

  const tableStatusContent = showEmpty ? emptyComponent : (hasNoResults ? noResultsComponent : null);

  const paginationContent = showList ? (
    <StyledPaginationInfo>
      {t('contact.list.pageSummary', { page, totalPages, total: totalItems })}
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
        data-testid="contact-page-prev"
      >
        {'<'}
      </StyledPaginationNavButton>

      <StyledPaginationControl>
        <StyledPaginationControlLabel>
          {t('contact.list.pageSizeLabel')}
        </StyledPaginationControlLabel>
        <StyledPaginationSelectSlot>
          <Select
            value={String(pageSize)}
            onValueChange={onPageSizeChange}
            options={pageSizeOptions}
            accessibilityLabel={t('contact.list.pageSizeLabel')}
            compact
            testID="contact-page-size"
          />
        </StyledPaginationSelectSlot>
      </StyledPaginationControl>

      <StyledPaginationControl>
        <StyledPaginationControlLabel>
          {t('contact.list.densityLabel')}
        </StyledPaginationControlLabel>
        <StyledPaginationSelectSlot>
          <Select
            value={density}
            onValueChange={onDensityChange}
            options={densityOptions}
            accessibilityLabel={t('contact.list.densityLabel')}
            compact
            testID="contact-density"
          />
        </StyledPaginationSelectSlot>
      </StyledPaginationControl>

      <StyledPaginationNavButton
        type="button"
        onClick={() => onPageChange(page + 1)}
        disabled={page >= totalPages}
        aria-label={t('common.next')}
        title={t('common.next')}
        data-testid="contact-page-next"
      >
        {'>'}
      </StyledPaginationNavButton>
    </StyledPaginationActions>
  ) : null;

  return (
    <StyledContainer role="main" aria-label={t('contact.list.title')}>
      {noticeMessage ? (
        <Snackbar
          visible={Boolean(noticeMessage)}
          message={noticeMessage}
          variant="success"
          position="bottom"
          onDismiss={onDismissNotice}
          testID="contact-list-notice"
        />
      ) : null}

      <StyledContent>
        {!isTableMode ? searchBarSection : null}
        {!isTableMode ? filterBarSection : null}
        {!isTableMode ? bulkActionsBar : null}

        <Card
          variant="outlined"
          accessibilityLabel={t('contact.list.accessibilityLabel')}
          testID="contact-list-card"
        >
          <StyledListBody
            role="region"
            aria-label={t('contact.list.accessibilityLabel')}
            data-testid="contact-list"
            testID="contact-list"
          >
            <StyledStateStack>
              {showError ? (
                <ErrorState
                  size={ErrorStateSizes.SMALL}
                  title={t('listScaffold.errorState.title')}
                  description={errorMessage}
                  action={retryAction}
                  testID="contact-list-error"
                />
              ) : null}

              {showOffline ? (
                <OfflineState
                  size={OfflineStateSizes.SMALL}
                  title={t('shell.banners.offline.title')}
                  description={t('shell.banners.offline.message')}
                  action={retryAction}
                  testID="contact-list-offline"
                />
              ) : null}

              {showOfflineBanner ? (
                <OfflineState
                  size={OfflineStateSizes.SMALL}
                  title={t('shell.banners.offline.title')}
                  description={t('shell.banners.offline.message')}
                  action={retryAction}
                  testID="contact-list-offline-banner"
                />
              ) : null}
            </StyledStateStack>

            {isLoading ? (
              <LoadingSpinner accessibilityLabel={t('common.loading')} testID="contact-list-loading" />
            ) : null}

            {!isTableMode && showEmpty ? emptyComponent : null}
            {!isTableMode && hasNoResults ? noResultsComponent : null}

            {showDesktopTable ? (
              <DataTable
                columns={tableColumns}
                rows={rows}
                getRowKey={(Contact, index) => Contact?.id ?? `contact-${index}`}
                rowDensity={density}
                sortField={sortField}
                sortDirection={sortDirection}
                onSort={onSort}
                selection={tableSelection}
                renderRowActions={renderTableRowActions}
                rowActionsLabel={t('contact.list.columnActions')}
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
                testID="contact-table"
              />
            ) : null}

            {showList && !isTableMode ? (
              <StyledMobileList role="list">
                {rows.map((Contact, index) => {
                  const title = resolveContactTitle(t, Contact);
                  const leadingGlyph = String(title || 'B').charAt(0).toUpperCase();
                  const ContactId = Contact?.id;
                  const itemKey = ContactId ?? `contact-${index}`;
                  const statusLabel = Contact?.is_primary
                    ? t('contact.list.primaryStatePrimary')
                    : t('contact.list.primaryStateSecondary');
                  const statusTone = Contact?.is_primary ? 'success' : 'warning';
                  return (
                    <li key={itemKey} role="listitem">
                      <ListItem
                        leading={{ glyph: leadingGlyph, tone: 'inverse', backgroundTone: 'primary' }}
                        title={title}
                        subtitle={resolveMobileSubtitle(t, Contact, canViewTechnicalIds)}
                        metadata={[]}
                        status={{
                          label: statusLabel,
                          tone: statusTone,
                          showDot: true,
                          accessibilityLabel: t('contact.list.primaryLabel'),
                        }}
                        density="compact"
                        onPress={ContactId ? () => onContactPress(ContactId) : undefined}
                        onView={ContactId ? () => onContactPress(ContactId) : undefined}
                        onEdit={onEdit && ContactId ? (event) => onEdit(ContactId, event) : undefined}
                        onDelete={onDelete && ContactId ? (event) => onDelete(ContactId, event) : undefined}
                        viewLabel={t('contact.list.view')}
                        viewHint={t('contact.list.viewHint')}
                        editLabel={t('contact.list.edit')}
                        editHint={t('contact.list.editHint')}
                        deleteLabel={t('common.remove')}
                        deleteHint={t('contact.list.deleteHint')}
                        onMore={ContactId ? () => onContactPress(ContactId) : undefined}
                        moreLabel={t('common.more')}
                        moreHint={t('contact.list.viewHint')}
                        viewTestID={`contact-view-${itemKey}`}
                        editTestID={`contact-edit-${itemKey}`}
                        deleteTestID={`contact-delete-${itemKey}`}
                        moreTestID={`contact-more-${itemKey}`}
                        accessibilityLabel={t('contact.list.itemLabel', { name: title })}
                        accessibilityHint={t('contact.list.itemHint', { name: title })}
                        testID={`contact-item-${itemKey}`}
                      />
                    </li>
                  );
                })}
              </StyledMobileList>
            ) : null}

            {!isTableMode && showList ? (
              <StyledPagination>
                <StyledPaginationInfo>
                  {t('contact.list.pageSummary', { page, totalPages, total: totalItems })}
                </StyledPaginationInfo>

                <StyledPaginationActions>
                  <StyledPaginationNavButton
                    type="button"
                    onClick={() => onPageChange(page - 1)}
                    disabled={page <= 1}
                    aria-label={t('common.previous')}
                    title={t('common.previous')}
                    data-testid="contact-page-prev"
                  >
                    {'<'}
                  </StyledPaginationNavButton>

                  <StyledPaginationControl>
                    <StyledPaginationControlLabel>
                      {t('contact.list.pageSizeLabel')}
                    </StyledPaginationControlLabel>
                    <StyledPaginationSelectSlot>
                      <Select
                        value={String(pageSize)}
                        onValueChange={onPageSizeChange}
                        options={pageSizeOptions}
                        accessibilityLabel={t('contact.list.pageSizeLabel')}
                        compact
                        testID="contact-page-size"
                      />
                    </StyledPaginationSelectSlot>
                  </StyledPaginationControl>

                  <StyledPaginationControl>
                    <StyledPaginationControlLabel>
                      {t('contact.list.densityLabel')}
                    </StyledPaginationControlLabel>
                    <StyledPaginationSelectSlot>
                      <Select
                        value={density}
                        onValueChange={onDensityChange}
                        options={densityOptions}
                        accessibilityLabel={t('contact.list.densityLabel')}
                        compact
                        testID="contact-density"
                      />
                    </StyledPaginationSelectSlot>
                  </StyledPaginationControl>

                  <StyledPaginationNavButton
                    type="button"
                    onClick={() => onPageChange(page + 1)}
                    disabled={page >= totalPages}
                    aria-label={t('common.next')}
                    title={t('common.next')}
                    data-testid="contact-page-next"
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
          accessibilityLabel={t('contact.list.tableSettings')}
          testID="contact-table-settings-modal"
        >
          <StyledSettingsBody>
            <StyledSettingsSection>
              <StyledSettingsTitle>{t('contact.list.visibleColumns')}</StyledSettingsTitle>
              {columnOrder.map((column) => (
                <StyledColumnRow key={column}>
                  <Checkbox
                    checked={visibleColumns.includes(column)}
                    onChange={() => onToggleColumnVisibility(column)}
                    label={resolveColumnLabel(t, column)}
                    testID={`contact-column-visible-${column}`}
                  />

                  <StyledColumnMoveControls>
                    <StyledMoveButton
                      type="button"
                      onClick={() => onMoveColumnLeft(column)}
                      aria-label={t('contact.list.moveColumnLeft', {
                        column: resolveColumnLabel(t, column),
                      })}
                      disabled={columnOrder.indexOf(column) === 0}
                      data-testid={`contact-column-left-${column}`}
                    >
                      {'<'}
                    </StyledMoveButton>
                    <StyledMoveButton
                      type="button"
                      onClick={() => onMoveColumnRight(column)}
                      aria-label={t('contact.list.moveColumnRight', {
                        column: resolveColumnLabel(t, column),
                      })}
                      disabled={columnOrder.indexOf(column) === columnOrder.length - 1}
                      data-testid={`contact-column-right-${column}`}
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
                data-testid="contact-table-settings-reset"
              >
                {t('contact.list.resetTablePreferences')}
              </StyledFilterButton>
            </StyledSettingsActions>
          </StyledSettingsBody>
        </Modal>
      </StyledContent>
    </StyledContainer>
  );
};

export default ContactListScreenWeb;
