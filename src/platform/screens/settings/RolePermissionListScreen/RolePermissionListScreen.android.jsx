/**
 * RolePermissionListScreen - Android
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
} from './RolePermissionListScreen.android.styles';
import useRolePermissionListScreen from './useRolePermissionListScreen';

const resolveRolePermissionId = (rolePermissionItem) => String(rolePermissionItem?.id ?? '').trim();

const resolveMobileSubtitle = (
  t,
  rolePermissionItem,
  resolvePermissionLabel,
  resolveTenantLabel
) => {
  const permissionValue = resolvePermissionLabel(rolePermissionItem);
  const tenantValue = resolveTenantLabel(rolePermissionItem);
  const parts = [];

  if (permissionValue && permissionValue !== t('common.notAvailable')) {
    parts.push(`${t('rolePermission.list.permissionLabel')}: ${permissionValue}`);
  }
  if (tenantValue && tenantValue !== t('common.notAvailable')) {
    parts.push(`${t('rolePermission.list.tenantLabel')}: ${tenantValue}`);
  }

  return parts.length > 0 ? parts.join(' - ') : undefined;
};

const RolePermissionListScreenAndroid = () => {
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
    onPageChange,
    onPageSizeChange,
    onDensityChange,
    resolveFilterOperatorOptions,
    onItemPress,
    onDelete,
    onAdd,
  } = useRolePermissionListScreen();

  const rows = pagedItems;
  const emptyComponent = (
    <EmptyState
      title={t('rolePermission.list.emptyTitle')}
      description={t('rolePermission.list.emptyMessage')}
      action={onAdd ? (
        <StyledAddButton
          onPress={onAdd}
          accessibilityRole="button"
          accessibilityLabel={t('rolePermission.list.addLabel')}
          accessibilityHint={t('rolePermission.list.addHint')}
          testID="role-permission-list-empty-add"
        >
          <Icon glyph="+" size="xs" decorative />
          <StyledAddLabel>{t('rolePermission.list.addLabel')}</StyledAddLabel>
        </StyledAddButton>
      ) : undefined}
      testID="role-permission-list-empty-state"
    />
  );

  const noResultsComponent = (
    <EmptyState
      title={t('rolePermission.list.noResultsTitle')}
      description={t('rolePermission.list.noResultsMessage')}
      action={(
        <Button
          variant="surface"
          size="small"
          onPress={onClearSearchAndFilters}
          accessibilityLabel={t('rolePermission.list.clearSearchAndFilters')}
          testID="role-permission-list-clear-search"
        >
          {t('rolePermission.list.clearSearchAndFilters')}
        </Button>
      )}
      testID="role-permission-list-no-results"
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
      testID="role-permission-list-retry"
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

  const renderItem = ({ item: rolePermissionItem, index }) => {
    const rolePermissionId = resolveRolePermissionId(rolePermissionItem);
    const itemKey = rolePermissionId || `role-permission-${index}`;
    const title = resolveRoleLabel(rolePermissionItem);
    const subtitle = resolveMobileSubtitle(
      t,
      rolePermissionItem,
      resolvePermissionLabel,
      resolveTenantLabel
    );

    return (
      <ListItem
        title={title}
        subtitle={subtitle}
        onPress={rolePermissionId ? () => onItemPress(rolePermissionId) : undefined}
        actions={onDelete && rolePermissionId ? (
          <Button
            variant="surface"
            size="small"
            onPress={(event) => onDelete(rolePermissionId, event)}
            accessibilityLabel={t('rolePermission.list.delete')}
            accessibilityHint={t('rolePermission.list.deleteHint')}
            testID={`role-permission-delete-${itemKey}`}
          >
            {t('common.remove')}
          </Button>
        ) : undefined}
        accessibilityLabel={t('rolePermission.list.itemLabel', { name: title })}
        testID={`role-permission-item-${itemKey}`}
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
          testID="role-permission-list-notice"
        />
      ) : null}

      <StyledContent>
        <StyledToolbar testID="role-permission-list-toolbar">
          <StyledSearchSlot>
            <TextField
              value={search}
              onChangeText={onSearch}
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
            {onAdd ? (
              <StyledAddButton
                onPress={onAdd}
                accessibilityRole="button"
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

        <StyledFilterPanel>
          <StyledFilterBody>
            <Select
              value={filterLogic}
              onValueChange={onFilterLogicChange}
              options={filterLogicOptions}
              label={t('rolePermission.list.filterLogicLabel')}
              compact
              testID="role-permission-filter-logic"
            />

            {filters.map((filter, index) => (
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
                  options={resolveFilterOperatorOptions(filter.field)}
                  label={t('rolePermission.list.filterOperatorLabel')}
                  compact
                  testID={`role-permission-filter-operator-${index}`}
                />

                <TextField
                  value={filter.value}
                  onChangeText={(value) => onFilterValueChange(filter.id, value)}
                  label={t('rolePermission.list.filterValueLabel')}
                  placeholder={t('rolePermission.list.filterValuePlaceholder')}
                  density="compact"
                  testID={`role-permission-filter-value-${index}`}
                />

                <StyledFilterRowActions>
                  <Button
                    variant="surface"
                    size="small"
                    onPress={() => onRemoveFilter(filter.id)}
                    accessibilityLabel={t('rolePermission.list.removeFilter')}
                    testID={`role-permission-filter-remove-${index}`}
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
                testID="role-permission-filter-add"
              >
                {t('rolePermission.list.addFilter')}
              </Button>

              <Button
                variant="surface"
                size="small"
                onPress={onClearSearchAndFilters}
                testID="role-permission-filter-clear"
              >
                {t('rolePermission.list.clearSearchAndFilters')}
              </Button>
            </StyledFilterActions>
          </StyledFilterBody>
        </StyledFilterPanel>

        <Card
          variant="outlined"
          accessibilityLabel={t('rolePermission.list.accessibilityLabel')}
          testID="role-permission-list-card"
        >
          <StyledListBody>
            <StyledStateStack>
              {showError ? (
                <ErrorState
                  size={ErrorStateSizes.SMALL}
                  title={t('listScaffold.errorState.title')}
                  description={errorMessage}
                  action={retryAction}
                  testID="role-permission-list-error"
                />
              ) : null}

              {showOffline ? (
                <OfflineState
                  size={OfflineStateSizes.SMALL}
                  title={t('shell.banners.offline.title')}
                  description={t('shell.banners.offline.message')}
                  action={retryAction}
                  testID="role-permission-list-offline"
                />
              ) : null}

              {showOfflineBanner ? (
                <OfflineState
                  size={OfflineStateSizes.SMALL}
                  title={t('shell.banners.offline.title')}
                  description={t('shell.banners.offline.message')}
                  action={retryAction}
                  testID="role-permission-list-offline-banner"
                />
              ) : null}
            </StyledStateStack>

            {isLoading ? (
              <LoadingSpinner
                accessibilityLabel={t('common.loading')}
                testID="role-permission-list-loading"
              />
            ) : null}

            {showEmpty ? emptyComponent : null}
            {showNoResults ? noResultsComponent : null}

            {showList ? (
              <StyledList>
                <FlatList
                  data={rows}
                  keyExtractor={(rolePermissionItem, index) => (
                    resolveRolePermissionId(rolePermissionItem) || `role-permission-${index}`
                  )}
                  renderItem={renderItem}
                  ItemSeparatorComponent={ItemSeparator}
                  scrollEnabled={false}
                  accessibilityLabel={t('rolePermission.list.accessibilityLabel')}
                  testID="role-permission-list-flatlist"
                />
              </StyledList>
            ) : null}

            {showList ? (
              <StyledPagination>
                <StyledPaginationInfo>
                  <Text variant="body">
                    {t('rolePermission.list.pageSummary', { page, totalPages, total: totalItems })}
                  </Text>
                </StyledPaginationInfo>

                <StyledPaginationActions>
                  <Button
                    variant="surface"
                    size="small"
                    onPress={() => onPageChange(page - 1)}
                    disabled={page <= 1}
                    accessibilityLabel={t('common.previous')}
                    testID="role-permission-page-prev"
                  >
                    {t('common.previous')}
                  </Button>

                  <StyledPaginationControl>
                    <Select
                      value={String(pageSize)}
                      onValueChange={onPageSizeChange}
                      options={pageSizeOptions}
                      label={t('rolePermission.list.pageSizeLabel')}
                      compact
                      testID="role-permission-page-size"
                    />
                  </StyledPaginationControl>

                  <StyledPaginationControl>
                    <Select
                      value={density}
                      onValueChange={onDensityChange}
                      options={densityOptions}
                      label={t('rolePermission.list.densityLabel')}
                      compact
                      testID="role-permission-density"
                    />
                  </StyledPaginationControl>

                  <Button
                    variant="surface"
                    size="small"
                    onPress={() => onPageChange(page + 1)}
                    disabled={page >= totalPages}
                    accessibilityLabel={t('common.next')}
                    testID="role-permission-page-next"
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

export default RolePermissionListScreenAndroid;
