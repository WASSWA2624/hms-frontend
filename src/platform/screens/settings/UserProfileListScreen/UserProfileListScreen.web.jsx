/**
 * UserProfileListScreen - Web
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
  StyledTableSettingsButton,
  StyledToolbar,
  StyledToolbarActions,
} from './UserProfileListScreen.web.styles';
import useUserProfileListScreen from './useUserProfileListScreen';

const resolveProfileId = (profileItem) => String(profileItem?.id ?? profileItem?.user_profile_id ?? '').trim();

const resolveColumnLabel = (t, column) => {
  if (column === 'profile') return t('userProfile.list.columnProfile');
  if (column === 'user') return t('userProfile.list.columnUser');
  if (column === 'facility') return t('userProfile.list.columnFacility');
  if (column === 'gender') return t('userProfile.list.columnGender');
  if (column === 'dob') return t('userProfile.list.columnDob');
  return column;
};

const TABLE_COLUMN_LAYOUT = {
  profile: { width: 220, minWidth: 180, align: 'left' },
  user: { width: 220, minWidth: 180, align: 'left' },
  facility: { width: 220, minWidth: 180, align: 'left' },
  gender: { width: 140, minWidth: 120, align: 'left' },
  dob: { width: 150, minWidth: 130, align: 'left' },
};

const UserProfileListScreenWeb = () => {
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
    selectedProfileIds,
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
    onToggleProfileSelection,
    onTogglePageSelection,
    onClearSelection,
    onBulkDelete,
    resolveFilterOperatorOptions,
    resolveProfileDisplayName,
    resolveProfileUserDisplay,
    resolveProfileFacilityDisplay,
    resolveProfileGenderDisplay,
    resolveProfileDobDisplay,
    onProfilePress,
    onEdit,
    onDelete,
    onAdd,
  } = useUserProfileListScreen();

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
      title={t('userProfile.list.emptyTitle')}
      description={t('userProfile.list.emptyMessage')}
      action={
        onAdd ? (
          <StyledAddButton
            type="button"
            onClick={onAdd}
            onPress={onAdd}
            accessibilityLabel={t('userProfile.list.addLabel')}
            accessibilityHint={t('userProfile.list.addHint')}
            testID="user-profile-list-empty-add"
          >
            <Icon glyph="+" size="xs" decorative />
            <StyledAddLabel>{t('userProfile.list.addLabel')}</StyledAddLabel>
          </StyledAddButton>
        ) : undefined
      }
      testID="user-profile-list-empty-state"
    />
  );

  const noResultsComponent = (
    <EmptyState
      title={t('userProfile.list.noResultsTitle')}
      description={t('userProfile.list.noResultsMessage')}
      action={
        <StyledFilterButton
          type="button"
          onClick={onClearSearchAndFilters}
          testID="user-profile-list-clear-search"
          aria-label={t('userProfile.list.clearSearchAndFilters')}
        >
          {t('userProfile.list.clearSearchAndFilters')}
        </StyledFilterButton>
      }
      testID="user-profile-list-no-results"
    />
  );

  const retryAction = onRetry ? (
    <Button
      variant="surface"
      size="small"
      onPress={onRetry}
      accessibilityLabel={t('common.retry')}
      accessibilityHint={t('common.retryHint')}
      testID="user-profile-list-retry"
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
        sortLabel: t('userProfile.list.sortBy', { field: resolveColumnLabel(t, column) }),
        width: columnLayout.width,
        minWidth: columnLayout.minWidth,
        align: columnLayout.align,
        truncate: columnLayout.truncate,
        renderCell: (profileItem) => {
          let value = t('common.notAvailable');
          if (column === 'profile') value = resolveProfileDisplayName(profileItem);
          if (column === 'user') value = resolveProfileUserDisplay(profileItem);
          if (column === 'facility') value = resolveProfileFacilityDisplay(profileItem);
          if (column === 'gender') value = resolveProfileGenderDisplay(profileItem);
          if (column === 'dob') value = resolveProfileDobDisplay(profileItem);

          if (column === 'profile') {
            return <StyledPrimaryCellText>{value}</StyledPrimaryCellText>;
          }
          if (column === 'user' || column === 'facility' || column === 'dob') {
            return <StyledCodeCellText>{value}</StyledCodeCellText>;
          }
          return value;
        },
        getCellTitle: (profileItem) => {
          let value = t('common.notAvailable');
          if (column === 'profile') value = resolveProfileDisplayName(profileItem);
          if (column === 'user') value = resolveProfileUserDisplay(profileItem);
          if (column === 'facility') value = resolveProfileFacilityDisplay(profileItem);
          if (column === 'gender') value = resolveProfileGenderDisplay(profileItem);
          if (column === 'dob') value = resolveProfileDobDisplay(profileItem);
          return typeof value === 'string' ? value : undefined;
        },
      };
    }),
    [
      visibleColumns,
      t,
      resolveProfileDisplayName,
      resolveProfileUserDisplay,
      resolveProfileFacilityDisplay,
      resolveProfileGenderDisplay,
      resolveProfileDobDisplay,
    ]
  );

  const tableSelection = useMemo(() => {
    if (!onBulkDelete) return undefined;
    return {
      enabled: true,
      allSelected: allPageSelected,
      onToggleAll: (checked) => onTogglePageSelection(Boolean(checked)),
      isRowSelected: (profileItem) => {
        const profileId = resolveProfileId(profileItem);
        return Boolean(profileId) && selectedProfileIds.includes(profileId);
      },
      onToggleRow: (profileItem) => onToggleProfileSelection(resolveProfileId(profileItem)),
      selectAllLabel: t('userProfile.list.selectPage'),
      selectRowLabel: (profileItem) => t('userProfile.list.selectProfile', {
        name: resolveProfileDisplayName(profileItem),
      }),
      headerCheckboxTestId: 'user-profile-select-page',
      rowCheckboxTestIdPrefix: 'user-profile-select',
    };
  }, [
    onBulkDelete,
    allPageSelected,
    onTogglePageSelection,
    selectedProfileIds,
    onToggleProfileSelection,
    resolveProfileDisplayName,
    t,
  ]);

  const handleTableRowPress = useCallback((profileItem) => {
    const profileId = resolveProfileId(profileItem);
    if (!profileId) return;
    onProfilePress(profileId);
  }, [onProfilePress]);

  const renderTableRowActions = useCallback((profileItem) => {
    const profileId = resolveProfileId(profileItem);
    if (!profileId) return null;

    return (
      <StyledRowActions>
        <StyledActionButton
          type="button"
          onClick={(event) => {
            event.stopPropagation();
            onProfilePress(profileId);
          }}
          data-testid={`user-profile-view-${profileId}`}
        >
          {t('userProfile.list.view')}
        </StyledActionButton>

        {onEdit ? (
          <StyledActionButton
            type="button"
            onClick={(event) => onEdit(profileId, event)}
            data-testid={`user-profile-edit-${profileId}`}
          >
            {t('userProfile.list.edit')}
          </StyledActionButton>
        ) : null}

        {onDelete ? (
          <StyledDangerActionButton
            type="button"
            onClick={(event) => onDelete(profileId, event)}
            data-testid={`user-profile-delete-${profileId}`}
          >
            {t('common.remove')}
          </StyledDangerActionButton>
        ) : null}
      </StyledRowActions>
    );
  }, [onProfilePress, onEdit, onDelete, t]);

  const searchBarSection = (
    <StyledToolbar data-testid="user-profile-list-toolbar">
      <StyledSearchSlot>
        <TextField
          value={search}
          onChange={(e) => onSearch(e.target.value)}
          placeholder={t('userProfile.list.searchPlaceholder')}
          accessibilityLabel={t('userProfile.list.searchLabel')}
          density="compact"
          type="search"
          testID="user-profile-list-search"
        />
      </StyledSearchSlot>

      <StyledScopeSlot>
        <StyledControlLabel>{t('userProfile.list.searchScopeLabel')}</StyledControlLabel>
        <Select
          value={searchScope}
          onValueChange={onSearchScopeChange}
          options={searchScopeOptions}
          accessibilityLabel={t('userProfile.list.searchScopeLabel')}
          compact
          testID="user-profile-list-search-scope"
        />
      </StyledScopeSlot>

      <StyledToolbarActions>
        {isTableMode ? (
          <StyledTableSettingsButton
            type="button"
            onClick={onOpenTableSettings}
            aria-label={t('userProfile.list.tableSettings')}
            data-testid="user-profile-table-settings"
          >
            {t('userProfile.list.tableSettings')}
          </StyledTableSettingsButton>
        ) : null}

        {onAdd ? (
          <StyledAddButton
            type="button"
            onClick={onAdd}
            onPress={onAdd}
            accessibilityLabel={t('userProfile.list.addLabel')}
            accessibilityHint={t('userProfile.list.addHint')}
            testID="user-profile-list-add"
          >
            <Icon glyph="+" size="xs" decorative />
            <StyledAddLabel>{t('userProfile.list.addLabel')}</StyledAddLabel>
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
          data-testid="user-profile-filter-toggle"
        >
          <StyledFilterChevron $collapsed={isFilterPanelCollapsed} aria-hidden="true">
            {'\u25BE'}
          </StyledFilterChevron>
        </StyledFilterToggleButton>
      </StyledFilterHeader>

      {!isFilterPanelCollapsed ? (
        <StyledFilterBody data-testid="user-profile-filter-body">
          <Select
            value={filterLogic}
            onValueChange={onFilterLogicChange}
            options={filterLogicOptions}
            label={t('userProfile.list.filterLogicLabel')}
            accessibilityLabel={t('userProfile.list.filterLogicLabel')}
            compact
            testID="user-profile-filter-logic"
          />

          {filters.map((filter, index) => {
            const operatorOptions = resolveFilterOperatorOptions(filter.field);
            return (
              <StyledFilterRow key={filter.id}>
                <Select
                  value={filter.field}
                  onValueChange={(value) => onFilterFieldChange(filter.id, value)}
                  options={filterFieldOptions}
                  label={t('userProfile.list.filterFieldLabel')}
                  compact
                  testID={`user-profile-filter-field-${index}`}
                />

                <Select
                  value={filter.operator}
                  onValueChange={(value) => onFilterOperatorChange(filter.id, value)}
                  options={operatorOptions}
                  label={t('userProfile.list.filterOperatorLabel')}
                  compact
                  testID={`user-profile-filter-operator-${index}`}
                />

                <TextField
                  value={filter.value}
                  onChange={(event) => onFilterValueChange(filter.id, event.target.value)}
                  label={t('userProfile.list.filterValueLabel')}
                  placeholder={t('userProfile.list.filterValuePlaceholder')}
                  density="compact"
                  testID={`user-profile-filter-value-${index}`}
                />

                <StyledFilterRowActions>
                  <StyledFilterButton
                    type="button"
                    onClick={() => onRemoveFilter(filter.id)}
                    aria-label={t('userProfile.list.removeFilter')}
                    testID={`user-profile-filter-remove-${index}`}
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
              testID="user-profile-filter-add"
            >
              {t('userProfile.list.addFilter')}
            </StyledFilterButton>
            <StyledFilterButton
              type="button"
              onClick={onClearSearchAndFilters}
              testID="user-profile-filter-clear"
            >
              {t('userProfile.list.clearSearchAndFilters')}
            </StyledFilterButton>
          </StyledFilterActions>
        </StyledFilterBody>
      ) : null}
    </StyledFilterPanel>
  );

  const bulkActionsBar = onBulkDelete && selectedProfileIds.length > 0 ? (
    <StyledBulkBar data-testid="user-profile-bulk-bar">
      <StyledBulkInfo>
        {t('userProfile.list.bulkSelectedCount', { count: selectedProfileIds.length })}
      </StyledBulkInfo>
      <StyledBulkActions>
        <StyledActionButton
          type="button"
          onClick={onClearSelection}
          data-testid="user-profile-bulk-clear"
        >
          {t('userProfile.list.clearSelection')}
        </StyledActionButton>
        <StyledDangerActionButton
          type="button"
          onClick={onBulkDelete}
          data-testid="user-profile-bulk-delete"
        >
          {t('userProfile.list.bulkDelete')}
        </StyledDangerActionButton>
      </StyledBulkActions>
    </StyledBulkBar>
  ) : null;

  const tableStatusContent = showEmpty ? emptyComponent : (hasNoResults ? noResultsComponent : null);

  const paginationContent = showList ? (
    <StyledPaginationInfo>
      {t('userProfile.list.pageSummary', { page, totalPages, total: totalItems })}
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
        data-testid="user-profile-page-prev"
      >
        {'<'}
      </StyledPaginationNavButton>

      <StyledPaginationControl>
        <StyledPaginationControlLabel>
          {t('userProfile.list.pageSizeLabel')}
        </StyledPaginationControlLabel>
        <StyledPaginationSelectSlot>
          <Select
            value={String(pageSize)}
            onValueChange={onPageSizeChange}
            options={pageSizeOptions}
            accessibilityLabel={t('userProfile.list.pageSizeLabel')}
            compact
            testID="user-profile-page-size"
          />
        </StyledPaginationSelectSlot>
      </StyledPaginationControl>

      <StyledPaginationControl>
        <StyledPaginationControlLabel>
          {t('userProfile.list.densityLabel')}
        </StyledPaginationControlLabel>
        <StyledPaginationSelectSlot>
          <Select
            value={density}
            onValueChange={onDensityChange}
            options={densityOptions}
            accessibilityLabel={t('userProfile.list.densityLabel')}
            compact
            testID="user-profile-density"
          />
        </StyledPaginationSelectSlot>
      </StyledPaginationControl>

      <StyledPaginationNavButton
        type="button"
        onClick={() => onPageChange(page + 1)}
        disabled={page >= totalPages}
        aria-label={t('common.next')}
        title={t('common.next')}
        data-testid="user-profile-page-next"
      >
        {'>'}
      </StyledPaginationNavButton>
    </StyledPaginationActions>
  ) : null;

  return (
    <StyledContainer role="main" aria-label={t('userProfile.list.title')}>
      {noticeMessage ? (
        <Snackbar
          visible={Boolean(noticeMessage)}
          message={noticeMessage}
          variant="success"
          position="bottom"
          onDismiss={onDismissNotice}
          testID="user-profile-list-notice"
        />
      ) : null}

      <StyledContent>
        {!isTableMode ? searchBarSection : null}
        {!isTableMode ? filterBarSection : null}
        {!isTableMode ? bulkActionsBar : null}

        <Card
          variant="outlined"
          accessibilityLabel={t('userProfile.list.accessibilityLabel')}
          testID="user-profile-list-card"
        >
          <StyledListBody
            role="region"
            aria-label={t('userProfile.list.accessibilityLabel')}
            data-testid="user-profile-list"
            testID="user-profile-list"
          >
            <StyledStateStack>
              {showError ? (
                <ErrorState
                  size={ErrorStateSizes.SMALL}
                  title={t('listScaffold.errorState.title')}
                  description={errorMessage}
                  action={retryAction}
                  testID="user-profile-list-error"
                />
              ) : null}

              {showOffline ? (
                <OfflineState
                  size={OfflineStateSizes.SMALL}
                  title={t('shell.banners.offline.title')}
                  description={t('shell.banners.offline.message')}
                  action={retryAction}
                  testID="user-profile-list-offline"
                />
              ) : null}

              {showOfflineBanner ? (
                <OfflineState
                  size={OfflineStateSizes.SMALL}
                  title={t('shell.banners.offline.title')}
                  description={t('shell.banners.offline.message')}
                  action={retryAction}
                  testID="user-profile-list-offline-banner"
                />
              ) : null}
            </StyledStateStack>

            {isLoading ? (
              <LoadingSpinner accessibilityLabel={t('common.loading')} testID="user-profile-list-loading" />
            ) : null}

            {!isTableMode && showEmpty ? emptyComponent : null}
            {!isTableMode && hasNoResults ? noResultsComponent : null}

            {showDesktopTable ? (
              <DataTable
                columns={tableColumns}
                rows={rows}
                getRowKey={(profileItem, index) => resolveProfileId(profileItem) || `user-profile-${index}`}
                rowDensity={density}
                sortField={sortField}
                sortDirection={sortDirection}
                onSort={onSort}
                selection={tableSelection}
                renderRowActions={renderTableRowActions}
                rowActionsLabel={t('userProfile.list.columnActions')}
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
                testID="user-profile-table"
              />
            ) : null}

            {showList && !isTableMode ? (
              <StyledMobileList role="list">
                {rows.map((profileItem, index) => {
                  const title = resolveProfileDisplayName(profileItem);
                  const leadingGlyph = String(title || 'B').charAt(0).toUpperCase();
                  const profileId = resolveProfileId(profileItem);
                  const itemKey = profileId ?? `user-profile-${index}`;
                  const userLabel = resolveProfileUserDisplay(profileItem);
                  const facilityLabel = resolveProfileFacilityDisplay(profileItem);
                  const genderLabel = resolveProfileGenderDisplay(profileItem);
                  const dobLabel = resolveProfileDobDisplay(profileItem);
                  const subtitle = [userLabel, facilityLabel]
                    .filter((value) => value && value !== t('common.notAvailable'))
                    .join(' | ');
                  const metadata = [
                    genderLabel ? { label: t('userProfile.list.genderLabel'), value: genderLabel } : null,
                    dobLabel && dobLabel !== t('common.notAvailable')
                      ? { label: t('userProfile.list.dobLabel'), value: dobLabel }
                      : null,
                  ].filter(Boolean);
                  return (
                    <li key={itemKey} role="listitem">
                      <ListItem
                        leading={{ glyph: leadingGlyph, tone: 'inverse', backgroundTone: 'primary' }}
                        title={title}
                        subtitle={subtitle || undefined}
                        metadata={metadata}
                        density="compact"
                        onPress={profileId ? () => onProfilePress(profileId) : undefined}
                        onView={profileId ? () => onProfilePress(profileId) : undefined}
                        onEdit={onEdit && profileId ? (event) => onEdit(profileId, event) : undefined}
                        onDelete={onDelete && profileId ? (event) => onDelete(profileId, event) : undefined}
                        viewLabel={t('userProfile.list.view')}
                        viewHint={t('userProfile.list.viewHint')}
                        editLabel={t('userProfile.list.edit')}
                        editHint={t('userProfile.list.editHint')}
                        deleteLabel={t('common.remove')}
                        deleteHint={t('userProfile.list.deleteHint')}
                        onMore={profileId ? () => onProfilePress(profileId) : undefined}
                        moreLabel={t('common.more')}
                        moreHint={t('userProfile.list.viewHint')}
                        viewTestID={`user-profile-view-${itemKey}`}
                        editTestID={`user-profile-edit-${itemKey}`}
                        deleteTestID={`user-profile-delete-${itemKey}`}
                        moreTestID={`user-profile-more-${itemKey}`}
                        accessibilityLabel={t('userProfile.list.itemLabel', { name: title })}
                        accessibilityHint={t('userProfile.list.itemHint', { name: title })}
                        testID={`user-profile-item-${itemKey}`}
                      />
                    </li>
                  );
                })}
              </StyledMobileList>
            ) : null}

            {!isTableMode && showList ? (
              <StyledPagination>
                <StyledPaginationInfo>
                  {t('userProfile.list.pageSummary', { page, totalPages, total: totalItems })}
                </StyledPaginationInfo>

                <StyledPaginationActions>
                  <StyledPaginationNavButton
                    type="button"
                    onClick={() => onPageChange(page - 1)}
                    disabled={page <= 1}
                    aria-label={t('common.previous')}
                    title={t('common.previous')}
                    data-testid="user-profile-page-prev"
                  >
                    {'<'}
                  </StyledPaginationNavButton>

                  <StyledPaginationControl>
                    <StyledPaginationControlLabel>
                      {t('userProfile.list.pageSizeLabel')}
                    </StyledPaginationControlLabel>
                    <StyledPaginationSelectSlot>
                      <Select
                        value={String(pageSize)}
                        onValueChange={onPageSizeChange}
                        options={pageSizeOptions}
                        accessibilityLabel={t('userProfile.list.pageSizeLabel')}
                        compact
                        testID="user-profile-page-size"
                      />
                    </StyledPaginationSelectSlot>
                  </StyledPaginationControl>

                  <StyledPaginationControl>
                    <StyledPaginationControlLabel>
                      {t('userProfile.list.densityLabel')}
                    </StyledPaginationControlLabel>
                    <StyledPaginationSelectSlot>
                      <Select
                        value={density}
                        onValueChange={onDensityChange}
                        options={densityOptions}
                        accessibilityLabel={t('userProfile.list.densityLabel')}
                        compact
                        testID="user-profile-density"
                      />
                    </StyledPaginationSelectSlot>
                  </StyledPaginationControl>

                  <StyledPaginationNavButton
                    type="button"
                    onClick={() => onPageChange(page + 1)}
                    disabled={page >= totalPages}
                    aria-label={t('common.next')}
                    title={t('common.next')}
                    data-testid="user-profile-page-next"
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
          accessibilityLabel={t('userProfile.list.tableSettings')}
          testID="user-profile-table-settings-modal"
        >
          <StyledSettingsBody>
            <StyledSettingsSection>
              <StyledSettingsTitle>{t('userProfile.list.visibleColumns')}</StyledSettingsTitle>
              {columnOrder.map((column) => (
                <StyledColumnRow key={column}>
                  <Checkbox
                    checked={visibleColumns.includes(column)}
                    onChange={() => onToggleColumnVisibility(column)}
                    label={resolveColumnLabel(t, column)}
                    testID={`user-profile-column-visible-${column}`}
                  />

                  <StyledColumnMoveControls>
                    <StyledMoveButton
                      type="button"
                      onClick={() => onMoveColumnLeft(column)}
                      aria-label={t('userProfile.list.moveColumnLeft', {
                        column: resolveColumnLabel(t, column),
                      })}
                      disabled={columnOrder.indexOf(column) === 0}
                      data-testid={`user-profile-column-left-${column}`}
                    >
                      {'<'}
                    </StyledMoveButton>
                    <StyledMoveButton
                      type="button"
                      onClick={() => onMoveColumnRight(column)}
                      aria-label={t('userProfile.list.moveColumnRight', {
                        column: resolveColumnLabel(t, column),
                      })}
                      disabled={columnOrder.indexOf(column) === columnOrder.length - 1}
                      data-testid={`user-profile-column-right-${column}`}
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
                data-testid="user-profile-table-settings-reset"
              >
                {t('userProfile.list.resetTablePreferences')}
              </StyledFilterButton>
            </StyledSettingsActions>
          </StyledSettingsBody>
        </Modal>
      </StyledContent>
    </StyledContainer>
  );
};

export default UserProfileListScreenWeb;



