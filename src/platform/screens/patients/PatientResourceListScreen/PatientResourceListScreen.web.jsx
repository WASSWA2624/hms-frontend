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
  Text,
  TextField,
  Tooltip,
} from '@platform/components';
import { useI18n } from '@hooks';
import { formatDateTime } from '@utils';
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
  StyledHeader,
  StyledHeaderCopy,
  StyledHeaderTop,
  StyledHelpAnchor,
  StyledHelpButton,
  StyledHelpChecklist,
  StyledHelpItem,
  StyledHelpModalBody,
  StyledHelpModalTitle,
  StyledListBody,
  StyledMobileList,
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
  StyledSubtitleCellText,
  StyledTableSettingsButton,
  StyledTitleCellText,
  StyledToolbar,
  StyledToolbarActions,
} from './PatientResourceListScreen.web.styles';
import usePatientResourceListScreen from './usePatientResourceListScreen';

const resolveColumnLabel = (t, column) => {
  if (column === 'title') return t('patients.common.list.columnTitle');
  if (column === 'subtitle') return t('patients.common.list.columnSubtitle');
  if (column === 'updatedAt') return t('patients.common.list.columnUpdatedAt');
  if (column === 'createdAt') return t('patients.common.list.columnCreatedAt');
  return column;
};

const PatientResourceListScreenWeb = ({ resourceId }) => {
  const { t, locale } = useI18n();
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [isHelpTooltipVisible, setIsHelpTooltipVisible] = useState(false);
  const {
    config,
    resourceLabel,
    items,
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
    selectedRecordIds,
    allPageSelected,
    isTableMode,
    isTableSettingsOpen,
    isLoading,
    hasError,
    errorMessage,
    isOffline,
    noticeMessage,
    helpContent,
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
    onToggleRecordSelection,
    onTogglePageSelection,
    onClearSelection,
    onBulkDelete,
    resolveFilterOperatorOptions,
    onItemPress,
    onEdit,
    onDelete,
    onAdd,
  } = usePatientResourceListScreen(resourceId);

  const [isFilterPanelCollapsed, setIsFilterPanelCollapsed] = useState(true);

  if (!config) return null;

  const showError = !isLoading && hasError && !isOffline;
  const showOffline = !isLoading && isOffline && items.length === 0;
  const showOfflineBanner = !isLoading && isOffline && items.length > 0;
  const showEmpty = !isLoading && !showError && !showOffline && !hasNoResults && totalItems === 0;
  const showList = items.length > 0;
  const showDesktopTable = isTableMode && !showError && !showOffline;

  const emptyComponent = (
    <EmptyState
      title={t(`${config.i18nKey}.list.emptyTitle`)}
      description={t(`${config.i18nKey}.list.emptyMessage`)}
      action={
        onAdd ? (
          <StyledAddButton
            type="button"
            onClick={onAdd}
            accessibilityLabel={t(`${config.i18nKey}.list.addLabel`)}
            accessibilityHint={t(`${config.i18nKey}.list.addHint`)}
            testID="patient-resource-list-empty-add"
          >
            <Icon glyph="+" size="xs" decorative />
            <StyledAddLabel>{t(`${config.i18nKey}.list.addLabel`)}</StyledAddLabel>
          </StyledAddButton>
        ) : undefined
      }
      testID="patient-resource-list-empty"
    />
  );

  const noResultsComponent = (
    <EmptyState
      title={t('patients.common.list.noResultsTitle')}
      description={t('patients.common.list.noResultsMessage')}
      action={
        <StyledFilterButton
          type="button"
          onClick={onClearSearchAndFilters}
          testID="patient-resource-list-clear-search"
        >
          {t('patients.common.list.clearSearchAndFilters')}
        </StyledFilterButton>
      }
      testID="patient-resource-list-no-results"
    />
  );

  const retryAction = onRetry ? (
    <Button
      variant="surface"
      size="small"
      onPress={onRetry}
      accessibilityLabel={t('common.retry')}
      accessibilityHint={t('common.retryHint')}
      testID="patient-resource-list-retry"
    >
      {t('common.retry')}
    </Button>
  ) : undefined;

  const tableColumns = useMemo(
    () => visibleColumns.map((column) => ({
      id: column,
      label: resolveColumnLabel(t, column),
      sortable: true,
      sortLabel: t('patients.common.list.sortBy', { field: resolveColumnLabel(t, column) }),
      renderCell: (item) => {
        if (column === 'title') {
          const value = config.getItemTitle(item, t) || t('patients.common.list.unnamedRecord', { position: 1 });
          return <StyledTitleCellText>{value}</StyledTitleCellText>;
        }
        if (column === 'subtitle') {
          const value = config.getItemSubtitle(item, t);
          return <StyledSubtitleCellText>{value || '-'}</StyledSubtitleCellText>;
        }
        if (column === 'updatedAt') {
          return formatDateTime(item?.updated_at, locale);
        }
        if (column === 'createdAt') {
          return formatDateTime(item?.created_at, locale);
        }
        return '-';
      },
      getCellTitle: (item) => {
        if (column === 'title') return config.getItemTitle(item, t);
        if (column === 'subtitle') return config.getItemSubtitle(item, t);
        return undefined;
      },
    })),
    [visibleColumns, t, config, locale]
  );

  const tableSelection = useMemo(() => {
    if (!onBulkDelete) return undefined;
    return {
      enabled: true,
      allSelected: allPageSelected,
      onToggleAll: (checked) => onTogglePageSelection(Boolean(checked)),
      isRowSelected: (item) => Boolean(item?.id) && selectedRecordIds.includes(item.id),
      onToggleRow: (item) => onToggleRecordSelection(item?.id),
      selectAllLabel: t('patients.common.list.selectPage'),
      selectRowLabel: (item) => t('patients.common.list.selectRecord', {
        name: config.getItemTitle(item, t) || t('patients.common.list.unnamedRecord', { position: 1 }),
      }),
      headerCheckboxTestId: 'patient-resource-select-page',
      rowCheckboxTestIdPrefix: 'patient-resource-select',
    };
  }, [
    onBulkDelete,
    allPageSelected,
    onTogglePageSelection,
    selectedRecordIds,
    onToggleRecordSelection,
    t,
    config,
  ]);

  const handleTableRowPress = useCallback((item) => {
    if (!item?.id) return;
    onItemPress(item.id);
  }, [onItemPress]);

  const renderTableRowActions = useCallback((item) => {
    const itemId = item?.id;
    if (!itemId) return null;

    return (
      <StyledRowActions>
        <StyledActionButton
          type="button"
          onClick={(event) => {
            event.stopPropagation();
            onItemPress(itemId);
          }}
          data-testid={`patient-resource-view-${itemId}`}
        >
          {t('patients.common.list.view')}
        </StyledActionButton>

        {onEdit ? (
          <StyledActionButton
            type="button"
            onClick={(event) => onEdit(itemId, event)}
            data-testid={`patient-resource-edit-${itemId}`}
          >
            {t('patients.common.list.edit')}
          </StyledActionButton>
        ) : null}

        {onDelete ? (
          <StyledDangerActionButton
            type="button"
            onClick={(event) => onDelete(itemId, event)}
            data-testid={`patient-resource-delete-${itemId}`}
          >
            {t('common.remove')}
          </StyledDangerActionButton>
        ) : null}
      </StyledRowActions>
    );
  }, [onDelete, onItemPress, t]);

  const searchBarSection = (
    <StyledToolbar data-testid="patient-resource-list-toolbar">
      <StyledSearchSlot>
        <TextField
          value={search}
          onChange={(event) => onSearch(event.target.value)}
          placeholder={t('patients.common.list.searchPlaceholder')}
          accessibilityLabel={t('patients.common.list.searchLabel')}
          density="compact"
          type="search"
          testID="patient-resource-list-search"
        />
      </StyledSearchSlot>

      <StyledScopeSlot>
        <StyledControlLabel>{t('patients.common.list.searchScopeLabel')}</StyledControlLabel>
        <Select
          value={searchScope}
          onValueChange={onSearchScopeChange}
          options={searchScopeOptions}
          compact
          testID="patient-resource-list-search-scope"
        />
      </StyledScopeSlot>

      <StyledToolbarActions>
        {isTableMode ? (
          <StyledTableSettingsButton
            type="button"
            onClick={onOpenTableSettings}
            data-testid="patient-resource-table-settings"
          >
            {t('patients.common.list.tableSettings')}
          </StyledTableSettingsButton>
        ) : null}

        {onAdd ? (
          <StyledAddButton
            type="button"
            onClick={onAdd}
            accessibilityLabel={t(`${config.i18nKey}.list.addLabel`)}
            accessibilityHint={t(`${config.i18nKey}.list.addHint`)}
            testID="patient-resource-list-add"
          >
            <Icon glyph="+" size="xs" decorative />
            <StyledAddLabel>{t(`${config.i18nKey}.list.addLabel`)}</StyledAddLabel>
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
          data-testid="patient-resource-filter-toggle"
        >
          <StyledFilterChevron $collapsed={isFilterPanelCollapsed}>
            {'\u25BE'}
          </StyledFilterChevron>
        </StyledFilterToggleButton>
      </StyledFilterHeader>

      {!isFilterPanelCollapsed ? (
        <StyledFilterBody data-testid="patient-resource-filter-body">
          <Select
            value={filterLogic}
            onValueChange={onFilterLogicChange}
            options={filterLogicOptions}
            label={t('patients.common.list.filterLogicLabel')}
            compact
            testID="patient-resource-filter-logic"
          />

          {filters.map((filter, index) => {
            const operatorOptions = resolveFilterOperatorOptions(filter.field);
            const isBooleanFilter = operatorOptions.length === 1 && operatorOptions[0]?.value === 'is';
            return (
              <StyledFilterRow key={filter.id}>
                <Select
                  value={filter.field}
                  onValueChange={(value) => onFilterFieldChange(filter.id, value)}
                  options={filterFieldOptions}
                  label={t('patients.common.list.filterFieldLabel')}
                  compact
                  testID={`patient-resource-filter-field-${index}`}
                />

                <Select
                  value={filter.operator}
                  onValueChange={(value) => onFilterOperatorChange(filter.id, value)}
                  options={operatorOptions}
                  label={t('patients.common.list.filterOperatorLabel')}
                  compact
                  testID={`patient-resource-filter-operator-${index}`}
                />

                {isBooleanFilter ? (
                  <Select
                    value={filter.value || 'on'}
                    onValueChange={(value) => onFilterValueChange(filter.id, value)}
                    options={[
                      { value: 'on', label: t('common.on') },
                      { value: 'off', label: t('common.off') },
                    ]}
                    label={t('patients.common.list.filterValueLabel')}
                    compact
                    testID={`patient-resource-filter-value-${index}`}
                  />
                ) : (
                  <TextField
                    value={filter.value}
                    onChange={(event) => onFilterValueChange(filter.id, event.target.value)}
                    label={t('patients.common.list.filterValueLabel')}
                    placeholder={t('patients.common.list.filterValuePlaceholder')}
                    density="compact"
                    testID={`patient-resource-filter-value-${index}`}
                  />
                )}

                <StyledFilterRowActions>
                  <StyledFilterButton
                    type="button"
                    onClick={() => onRemoveFilter(filter.id)}
                    testID={`patient-resource-filter-remove-${index}`}
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
              testID="patient-resource-filter-add"
            >
              {t('patients.common.list.addFilter')}
            </StyledFilterButton>
            <StyledFilterButton
              type="button"
              onClick={onClearSearchAndFilters}
              testID="patient-resource-filter-clear"
            >
              {t('patients.common.list.clearSearchAndFilters')}
            </StyledFilterButton>
          </StyledFilterActions>
        </StyledFilterBody>
      ) : null}
    </StyledFilterPanel>
  );

  const bulkActionsBar = onBulkDelete && selectedRecordIds.length > 0 ? (
    <StyledBulkBar data-testid="patient-resource-bulk-bar">
      <StyledBulkInfo>
        {t('patients.common.list.bulkSelectedCount', { count: selectedRecordIds.length })}
      </StyledBulkInfo>
      <StyledBulkActions>
        <StyledActionButton
          type="button"
          onClick={onClearSelection}
          data-testid="patient-resource-bulk-clear"
        >
          {t('patients.common.list.clearSelection')}
        </StyledActionButton>
        <StyledDangerActionButton
          type="button"
          onClick={onBulkDelete}
          data-testid="patient-resource-bulk-delete"
        >
          {t('patients.common.list.bulkDelete')}
        </StyledDangerActionButton>
      </StyledBulkActions>
    </StyledBulkBar>
  ) : null;

  const tableStatusContent = showEmpty ? emptyComponent : (hasNoResults ? noResultsComponent : null);

  const paginationContent = showList ? (
    <StyledPaginationInfo>
      {t('patients.common.list.pageSummary', { page, totalPages, total: totalItems })}
    </StyledPaginationInfo>
  ) : null;

  const tableNavigationContent = showList ? (
    <StyledPaginationActions>
      <StyledPaginationNavButton
        type="button"
        onClick={() => onPageChange(page - 1)}
        disabled={page <= 1}
        data-testid="patient-resource-page-prev"
      >
        {'<'}
      </StyledPaginationNavButton>

      <StyledPaginationControl>
        <StyledPaginationControlLabel>
          {t('patients.common.list.pageSizeLabel')}
        </StyledPaginationControlLabel>
        <StyledPaginationSelectSlot>
          <Select
            value={String(pageSize)}
            onValueChange={onPageSizeChange}
            options={pageSizeOptions}
            compact
            testID="patient-resource-page-size"
          />
        </StyledPaginationSelectSlot>
      </StyledPaginationControl>

      <StyledPaginationControl>
        <StyledPaginationControlLabel>
          {t('patients.common.list.densityLabel')}
        </StyledPaginationControlLabel>
        <StyledPaginationSelectSlot>
          <Select
            value={density}
            onValueChange={onDensityChange}
            options={densityOptions}
            compact
            testID="patient-resource-density"
          />
        </StyledPaginationSelectSlot>
      </StyledPaginationControl>

      <StyledPaginationNavButton
        type="button"
        onClick={() => onPageChange(page + 1)}
        disabled={page >= totalPages}
        data-testid="patient-resource-page-next"
      >
        {'>'}
      </StyledPaginationNavButton>
    </StyledPaginationActions>
  ) : null;

  return (
    <StyledContainer role="main" aria-label={t(`${config.i18nKey}.list.title`)}>
      {noticeMessage ? (
        <Snackbar
          visible={Boolean(noticeMessage)}
          message={noticeMessage}
          variant="success"
          position="bottom"
          onDismiss={onDismissNotice}
          testID="patient-resource-list-notice"
        />
      ) : null}

      <StyledContent>
        <StyledHeader>
          <StyledHeaderTop>
            <StyledHeaderCopy>
              <Text variant="h2" accessibilityRole="header">{t(`${config.i18nKey}.list.title`)}</Text>
              <Text variant="body">{t('patients.common.list.description', { resource: resourceLabel })}</Text>
            </StyledHeaderCopy>
            <StyledHelpAnchor>
              <StyledHelpButton
                type="button"
                aria-label={helpContent?.label}
                testID="patient-resource-list-help-trigger"
                onMouseEnter={() => setIsHelpTooltipVisible(true)}
                onMouseLeave={() => setIsHelpTooltipVisible(false)}
                onFocus={() => setIsHelpTooltipVisible(true)}
                onBlur={() => setIsHelpTooltipVisible(false)}
                onClick={() => setIsHelpOpen(true)}
              >
                <Icon glyph="?" size="xs" decorative />
              </StyledHelpButton>
              <Tooltip
                visible={isHelpTooltipVisible && !isHelpOpen}
                position="bottom"
                text={helpContent?.tooltip || ''}
              />
            </StyledHelpAnchor>
          </StyledHeaderTop>
        </StyledHeader>

        <Modal
          visible={isHelpOpen}
          onDismiss={() => setIsHelpOpen(false)}
          size="small"
          accessibilityLabel={helpContent?.title}
          testID="patient-resource-list-help-modal"
        >
          <StyledHelpModalTitle>{helpContent?.title}</StyledHelpModalTitle>
          <StyledHelpModalBody>{helpContent?.body}</StyledHelpModalBody>
          <StyledHelpChecklist>
            {(helpContent?.items || []).map((item) => (
              <StyledHelpItem key={item}>{item}</StyledHelpItem>
            ))}
          </StyledHelpChecklist>
        </Modal>

        <Card
          variant="outlined"
          accessibilityLabel={t(`${config.i18nKey}.list.accessibilityLabel`)}
          testID="patient-resource-list-card"
        >
          <StyledListBody role="region" aria-label={t(`${config.i18nKey}.list.accessibilityLabel`)}>
            <StyledStateStack>
              {showError ? (
                <ErrorState
                  size={ErrorStateSizes.SMALL}
                  title={t('listScaffold.errorState.title')}
                  description={errorMessage}
                  action={retryAction}
                  testID="patient-resource-list-error"
                />
              ) : null}

              {showOffline ? (
                <OfflineState
                  size={OfflineStateSizes.SMALL}
                  title={t('shell.banners.offline.title')}
                  description={t('shell.banners.offline.message')}
                  action={retryAction}
                  testID="patient-resource-list-offline"
                />
              ) : null}

              {showOfflineBanner ? (
                <OfflineState
                  size={OfflineStateSizes.SMALL}
                  title={t('shell.banners.offline.title')}
                  description={t('shell.banners.offline.message')}
                  action={retryAction}
                  testID="patient-resource-list-offline-banner"
                />
              ) : null}
            </StyledStateStack>

            {isLoading ? (
              <LoadingSpinner accessibilityLabel={t('common.loading')} testID="patient-resource-list-loading" />
            ) : null}

            {!isTableMode && showEmpty ? emptyComponent : null}
            {!isTableMode && hasNoResults ? noResultsComponent : null}

            {showDesktopTable ? (
              <DataTable
                columns={tableColumns}
                rows={items}
                getRowKey={(item, index) => item?.id ?? `patient-resource-${index}`}
                rowDensity={density}
                sortField={sortField}
                sortDirection={sortDirection}
                onSort={onSort}
                selection={tableSelection}
                renderRowActions={renderTableRowActions}
                rowActionsLabel={t('patients.common.list.columnActions')}
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
                minWidth={940}
                testID="patient-resource-table"
              />
            ) : null}

            {showList && !isTableMode ? (
              <StyledMobileList role="list">
                {items.map((item, index) => {
                  const title = config.getItemTitle(item, t) || t('patients.common.list.unnamedRecord', { position: index + 1 });
                  const subtitle = config.getItemSubtitle(item, t);
                  const leadingGlyph = String(title || 'P').charAt(0).toUpperCase();
                  const itemId = item?.id;
                  const itemKey = itemId ?? `patient-resource-${index}`;

                  return (
                    <li key={itemKey} role="listitem">
                      <ListItem
                        leading={{ glyph: leadingGlyph, tone: 'inverse', backgroundTone: 'primary' }}
                        title={title}
                        subtitle={subtitle || '-'}
                        density="compact"
                        onPress={itemId ? () => onItemPress(itemId) : undefined}
                        onView={itemId ? () => onItemPress(itemId) : undefined}
                        onEdit={onEdit && itemId ? (event) => onEdit(itemId, event) : undefined}
                        onDelete={onDelete && itemId ? (event) => onDelete(itemId, event) : undefined}
                        viewLabel={t('patients.common.list.view')}
                        viewHint={t('patients.common.list.viewHint')}
                        editLabel={t('patients.common.list.edit')}
                        editHint={t('patients.common.list.editHint')}
                        deleteLabel={t('common.remove')}
                        deleteHint={t(`${config.i18nKey}.list.deleteHint`)}
                        viewTestID={`patient-resource-view-${itemKey}`}
                        editTestID={`patient-resource-edit-${itemKey}`}
                        deleteTestID={`patient-resource-delete-${itemKey}`}
                        accessibilityLabel={t(`${config.i18nKey}.list.itemLabel`, { name: title })}
                        accessibilityHint={t(`${config.i18nKey}.list.itemHint`, { name: title })}
                        testID={`patient-resource-item-${itemKey}`}
                      />
                    </li>
                  );
                })}
              </StyledMobileList>
            ) : null}

            {!isTableMode && showList ? (
              <StyledPagination>
                <StyledPaginationInfo>
                  {t('patients.common.list.pageSummary', { page, totalPages, total: totalItems })}
                </StyledPaginationInfo>

                {tableNavigationContent}
              </StyledPagination>
            ) : null}
          </StyledListBody>
        </Card>

        <Modal
          visible={Boolean(isTableMode && isTableSettingsOpen)}
          onDismiss={onCloseTableSettings}
          size="small"
          accessibilityLabel={t('patients.common.list.tableSettings')}
          testID="patient-resource-table-settings-modal"
        >
          <StyledSettingsBody>
            <StyledSettingsSection>
              <StyledSettingsTitle>{t('patients.common.list.visibleColumns')}</StyledSettingsTitle>
              {columnOrder.map((column) => (
                <StyledColumnRow key={column}>
                  <Checkbox
                    checked={visibleColumns.includes(column)}
                    onChange={() => onToggleColumnVisibility(column)}
                    label={resolveColumnLabel(t, column)}
                    testID={`patient-resource-column-visible-${column}`}
                  />

                  <StyledColumnMoveControls>
                    <StyledMoveButton
                      type="button"
                      onClick={() => onMoveColumnLeft(column)}
                      disabled={columnOrder.indexOf(column) === 0}
                      data-testid={`patient-resource-column-left-${column}`}
                    >
                      {'<'}
                    </StyledMoveButton>
                    <StyledMoveButton
                      type="button"
                      onClick={() => onMoveColumnRight(column)}
                      disabled={columnOrder.indexOf(column) === columnOrder.length - 1}
                      data-testid={`patient-resource-column-right-${column}`}
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
                data-testid="patient-resource-table-settings-reset"
              >
                {t('patients.common.list.resetTablePreferences')}
              </StyledFilterButton>
            </StyledSettingsActions>
          </StyledSettingsBody>
        </Modal>
      </StyledContent>
    </StyledContainer>
  );
};

export default PatientResourceListScreenWeb;
