/**
 * RoleListScreen - Android
 * Mobile list rendering with scoped search, filters, and pagination.
 */
import React from 'react';
import { FlatList } from 'react-native';
import {
  Button,
  Card,
  EmptyState,
  ErrorState,
  ErrorStateSizes,
  Icon,
  ListItem,
  LoadingSpinner,
  OfflineState,
  OfflineStateSizes,
  Select,
  Snackbar,
  Text,
  TextField,
} from '@platform/components';
import { useI18n } from '@hooks';
import {
  StyledAddButton,
  StyledAddLabel,
  StyledContainer,
  StyledContent,
  StyledFilterActions,
  StyledFilterBody,
  StyledFilterPanel,
  StyledFilterRow,
  StyledFilterRowActions,
  StyledList,
  StyledListBody,
  StyledPagination,
  StyledPaginationActions,
  StyledPaginationControl,
  StyledPaginationInfo,
  StyledScopeSlot,
  StyledSearchSlot,
  StyledSeparator,
  StyledStateStack,
  StyledToolbar,
  StyledToolbarActions,
} from './RoleListScreen.android.styles';
import useRoleListScreen from './useRoleListScreen';

const resolveRoleId = (roleItem) => String(roleItem?.id ?? '').trim();

const resolveMobileSubtitle = (t, roleItem, resolveRoleDescription, resolveRoleTenant, resolveRoleFacility) => {
  const description = resolveRoleDescription(roleItem);
  const tenant = resolveRoleTenant(roleItem);
  const facility = resolveRoleFacility(roleItem);
  const parts = [];

  if (description && description !== t('common.notAvailable')) {
    parts.push(description);
  }
  if (tenant && tenant !== t('common.notAvailable')) {
    parts.push(`${t('role.list.tenantLabel')}: ${tenant}`);
  }
  if (facility && facility !== t('common.notAvailable')) {
    parts.push(`${t('role.list.facilityLabel')}: ${facility}`);
  }

  return parts.length > 0 ? parts.join(' - ') : undefined;
};

const RoleListScreenAndroid = () => {
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
    isLoading,
    hasError,
    errorMessage,
    isOffline,
    noticeMessage,
    resolveRoleName,
    resolveRoleDescription,
    resolveRoleTenant,
    resolveRoleFacility,
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
    onPageChange,
    onPageSizeChange,
    onDensityChange,
    resolveFilterOperatorOptions,
    onItemPress,
    onEdit,
    onDelete,
    onAdd,
  } = useRoleListScreen();

  const rows = pagedItems;
  const emptyComponent = (
    <EmptyState
      title={t('role.list.emptyTitle')}
      description={t('role.list.emptyMessage')}
      action={onAdd ? (
        <StyledAddButton
          onPress={onAdd}
          accessibilityRole="button"
          accessibilityLabel={t('role.list.addLabel')}
          accessibilityHint={t('role.list.addHint')}
          testID="role-list-empty-add"
        >
          <Icon glyph="+" size="xs" decorative />
          <StyledAddLabel>{t('role.list.addLabel')}</StyledAddLabel>
        </StyledAddButton>
      ) : undefined}
      testID="role-list-empty-state"
    />
  );

  const noResultsComponent = (
    <EmptyState
      title={t('role.list.noResultsTitle')}
      description={t('role.list.noResultsMessage')}
      action={(
        <Button
          variant="surface"
          size="small"
          onPress={onClearSearchAndFilters}
          accessibilityLabel={t('role.list.clearSearchAndFilters')}
          testID="role-list-clear-search"
        >
          {t('role.list.clearSearchAndFilters')}
        </Button>
      )}
      testID="role-list-no-results"
    />
  );

  const ItemSeparator = () => <StyledSeparator />;
  const retryAction = onRetry ? (
    <Button
      variant="surface"
      size="small"
      onPress={onRetry}
      accessibilityLabel={t('common.retry')}
      accessibilityHint={t('common.retryHint')}
      testID="role-list-retry"
    >
      {t('common.retry')}
    </Button>
  ) : undefined;

  const showError = !isLoading && hasError && !isOffline;
  const showOffline = !isLoading && isOffline && rows.length === 0;
  const showOfflineBanner = !isLoading && isOffline && rows.length > 0;
  const showEmpty = !isLoading && !showError && !showOffline && !hasNoResults && totalItems === 0;
  const showNoResults = !isLoading && !showError && !showOffline && hasNoResults;
  const showList = rows.length > 0;

  const renderItem = ({ item: roleItem, index }) => {
    const roleId = resolveRoleId(roleItem);
    const itemKey = roleId || `role-${index}`;
    const title = resolveRoleName(roleItem);
    const subtitle = resolveMobileSubtitle(
      t,
      roleItem,
      resolveRoleDescription,
      resolveRoleTenant,
      resolveRoleFacility
    );

    return (
      <ListItem
        title={title}
        subtitle={subtitle}
        density="compact"
        onPress={roleId ? () => onItemPress(roleId) : undefined}
        onView={roleId ? () => onItemPress(roleId) : undefined}
        onEdit={onEdit && roleId ? (event) => onEdit(roleId, event) : undefined}
        onDelete={onDelete && roleId ? (event) => onDelete(roleId, event) : undefined}
        viewLabel={t('common.view')}
        viewHint={t('role.list.viewHint')}
        editLabel={t('common.edit')}
        editHint={t('role.list.editHint')}
        deleteLabel={t('common.remove')}
        deleteHint={t('role.list.deleteHint')}
        onMore={roleId ? () => onItemPress(roleId) : undefined}
        moreLabel={t('common.more')}
        moreHint={t('role.list.viewHint')}
        viewTestID={`role-view-${itemKey}`}
        editTestID={`role-edit-${itemKey}`}
        deleteTestID={`role-delete-${itemKey}`}
        moreTestID={`role-more-${itemKey}`}
        accessibilityLabel={t('role.list.itemLabel', { name: title })}
        accessibilityHint={t('role.list.itemHint', { name: title })}
        testID={`role-item-${itemKey}`}
      />
    );
  };

  return (
    <StyledContainer>
      {noticeMessage ? (
        <Snackbar
          visible={Boolean(noticeMessage)}
          message={noticeMessage}
          variant="success"
          position="bottom"
          onDismiss={onDismissNotice}
          testID="role-list-notice"
        />
      ) : null}

      <StyledContent>
        <StyledToolbar testID="role-list-toolbar">
          <StyledSearchSlot>
            <TextField
              value={search}
              onChangeText={onSearch}
              placeholder={t('role.list.searchPlaceholder')}
              accessibilityLabel={t('role.list.searchLabel')}
              density="compact"
              type="search"
              testID="role-list-search"
            />
          </StyledSearchSlot>

          <StyledScopeSlot>
            <Select
              value={searchScope}
              onValueChange={onSearchScopeChange}
              options={searchScopeOptions}
              label={t('role.list.searchScopeLabel')}
              compact
              testID="role-list-search-scope"
            />
          </StyledScopeSlot>

          <StyledToolbarActions>
            {onAdd ? (
              <StyledAddButton
                onPress={onAdd}
                accessibilityRole="button"
                accessibilityLabel={t('role.list.addLabel')}
                accessibilityHint={t('role.list.addHint')}
                testID="role-list-add"
              >
                <Icon glyph="+" size="xs" decorative />
                <StyledAddLabel>{t('role.list.addLabel')}</StyledAddLabel>
              </StyledAddButton>
            ) : null}
          </StyledToolbarActions>
        </StyledToolbar>

        <StyledFilterPanel>
          <StyledFilterBody>
            <Select
              value={filterLogic}
              onValueChange={onFilterLogicChange}
              options={filterLogicOptions}
              label={t('role.list.filterLogicLabel')}
              compact
              testID="role-filter-logic"
            />

            {filters.map((filter, index) => (
              <StyledFilterRow key={filter.id}>
                <Select
                  value={filter.field}
                  onValueChange={(value) => onFilterFieldChange(filter.id, value)}
                  options={filterFieldOptions}
                  label={t('role.list.filterFieldLabel')}
                  compact
                  testID={`role-filter-field-${index}`}
                />

                <Select
                  value={filter.operator}
                  onValueChange={(value) => onFilterOperatorChange(filter.id, value)}
                  options={resolveFilterOperatorOptions(filter.field)}
                  label={t('role.list.filterOperatorLabel')}
                  compact
                  testID={`role-filter-operator-${index}`}
                />

                <TextField
                  value={filter.value}
                  onChangeText={(value) => onFilterValueChange(filter.id, value)}
                  label={t('role.list.filterValueLabel')}
                  placeholder={t('role.list.filterValuePlaceholder')}
                  density="compact"
                  testID={`role-filter-value-${index}`}
                />

                <StyledFilterRowActions>
                  <Button
                    variant="surface"
                    size="small"
                    onPress={() => onRemoveFilter(filter.id)}
                    accessibilityLabel={t('role.list.removeFilter')}
                    testID={`role-filter-remove-${index}`}
                  >
                    {t('common.remove')}
                  </Button>
                </StyledFilterRowActions>
              </StyledFilterRow>
            ))}

            <StyledFilterActions>
              <Button
                variant="surface"
                size="small"
                onPress={onAddFilter}
                disabled={!canAddFilter}
                testID="role-filter-add"
              >
                {t('role.list.addFilter')}
              </Button>

              <Button
                variant="surface"
                size="small"
                onPress={onClearSearchAndFilters}
                testID="role-filter-clear"
              >
                {t('role.list.clearSearchAndFilters')}
              </Button>
            </StyledFilterActions>
          </StyledFilterBody>
        </StyledFilterPanel>

        <Card
          variant="outlined"
          accessibilityLabel={t('role.list.accessibilityLabel')}
          testID="role-list-card"
        >
          <StyledListBody>
            <StyledStateStack>
              {showError ? (
                <ErrorState
                  size={ErrorStateSizes.SMALL}
                  title={t('listScaffold.errorState.title')}
                  description={errorMessage}
                  action={retryAction}
                  testID="role-list-error"
                />
              ) : null}

              {showOffline ? (
                <OfflineState
                  size={OfflineStateSizes.SMALL}
                  title={t('shell.banners.offline.title')}
                  description={t('shell.banners.offline.message')}
                  action={retryAction}
                  testID="role-list-offline"
                />
              ) : null}

              {showOfflineBanner ? (
                <OfflineState
                  size={OfflineStateSizes.SMALL}
                  title={t('shell.banners.offline.title')}
                  description={t('shell.banners.offline.message')}
                  action={retryAction}
                  testID="role-list-offline-banner"
                />
              ) : null}
            </StyledStateStack>

            {isLoading ? (
              <LoadingSpinner accessibilityLabel={t('common.loading')} testID="role-list-loading" />
            ) : null}

            {showEmpty ? emptyComponent : null}
            {showNoResults ? noResultsComponent : null}

            {showList ? (
              <StyledList>
                <FlatList
                  data={rows}
                  keyExtractor={(roleItem, index) => resolveRoleId(roleItem) || `role-${index}`}
                  renderItem={renderItem}
                  ItemSeparatorComponent={ItemSeparator}
                  scrollEnabled={false}
                  accessibilityLabel={t('role.list.accessibilityLabel')}
                  testID="role-list-flatlist"
                />
              </StyledList>
            ) : null}

            {showList ? (
              <StyledPagination>
                <StyledPaginationInfo>
                  <Text variant="body">
                    {t('role.list.pageSummary', { page, totalPages, total: totalItems })}
                  </Text>
                </StyledPaginationInfo>

                <StyledPaginationActions>
                  <Button
                    variant="surface"
                    size="small"
                    onPress={() => onPageChange(page - 1)}
                    disabled={page <= 1}
                    accessibilityLabel={t('common.previous')}
                    testID="role-page-prev"
                  >
                    {t('common.previous')}
                  </Button>

                  <StyledPaginationControl>
                    <Select
                      value={String(pageSize)}
                      onValueChange={onPageSizeChange}
                      options={pageSizeOptions}
                      label={t('role.list.pageSizeLabel')}
                      compact
                      testID="role-page-size"
                    />
                  </StyledPaginationControl>

                  <StyledPaginationControl>
                    <Select
                      value={density}
                      onValueChange={onDensityChange}
                      options={densityOptions}
                      label={t('role.list.densityLabel')}
                      compact
                      testID="role-density"
                    />
                  </StyledPaginationControl>

                  <Button
                    variant="surface"
                    size="small"
                    onPress={() => onPageChange(page + 1)}
                    disabled={page >= totalPages}
                    accessibilityLabel={t('common.next')}
                    testID="role-page-next"
                  >
                    {t('common.next')}
                  </Button>
                </StyledPaginationActions>
              </StyledPagination>
            ) : null}
          </StyledListBody>
        </Card>
      </StyledContent>
    </StyledContainer>
  );
};

export default RoleListScreenAndroid;
