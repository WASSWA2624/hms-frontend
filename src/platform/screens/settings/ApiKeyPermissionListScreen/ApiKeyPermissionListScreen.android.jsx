/**
 * ApiKeyPermissionListScreen - Android
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
} from './ApiKeyPermissionListScreen.android.styles';
import useApiKeyPermissionListScreen from './useApiKeyPermissionListScreen';

const resolveApiKeyPermissionId = (apiKeyPermissionItem) => String(apiKeyPermissionItem?.id ?? '').trim();

const resolveMobileSubtitle = (
  t,
  apiKeyPermissionItem,
  resolvePermissionLabel,
  resolveTenantLabel
) => {
  const permissionValue = resolvePermissionLabel(apiKeyPermissionItem);
  const tenantValue = resolveTenantLabel(apiKeyPermissionItem);
  const parts = [];

  if (permissionValue && permissionValue !== t('common.notAvailable')) {
    parts.push(`${t('apiKeyPermission.list.permissionLabel')}: ${permissionValue}`);
  }
  if (tenantValue && tenantValue !== t('common.notAvailable')) {
    parts.push(`${t('apiKeyPermission.list.tenantLabel')}: ${tenantValue}`);
  }

  return parts.length > 0 ? parts.join(' - ') : undefined;
};

const ApiKeyPermissionListScreenAndroid = () => {
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
    resolveApiKeyLabel,
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
  } = useApiKeyPermissionListScreen();

  const rows = pagedItems;
  const emptyComponent = (
    <EmptyState
      title={t('apiKeyPermission.list.emptyTitle')}
      description={t('apiKeyPermission.list.emptyMessage')}
      action={onAdd ? (
        <StyledAddButton
          onPress={onAdd}
          accessibilityRole="button"
          accessibilityLabel={t('apiKeyPermission.list.addLabel')}
          accessibilityHint={t('apiKeyPermission.list.addHint')}
          testID="api-key-permission-list-empty-add"
        >
          <Icon glyph="+" size="xs" decorative />
          <StyledAddLabel>{t('apiKeyPermission.list.addLabel')}</StyledAddLabel>
        </StyledAddButton>
      ) : undefined}
      testID="api-key-permission-list-empty-state"
    />
  );

  const noResultsComponent = (
    <EmptyState
      title={t('apiKeyPermission.list.noResultsTitle')}
      description={t('apiKeyPermission.list.noResultsMessage')}
      action={(
        <Button
          variant="surface"
          size="small"
          onPress={onClearSearchAndFilters}
          accessibilityLabel={t('apiKeyPermission.list.clearSearchAndFilters')}
          testID="api-key-permission-list-clear-search"
        >
          {t('apiKeyPermission.list.clearSearchAndFilters')}
        </Button>
      )}
      testID="api-key-permission-list-no-results"
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
      testID="api-key-permission-list-retry"
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

  const renderItem = ({ item: apiKeyPermissionItem, index }) => {
    const apiKeyPermissionId = resolveApiKeyPermissionId(apiKeyPermissionItem);
    const itemKey = apiKeyPermissionId || `api-key-permission-${index}`;
    const title = resolveApiKeyLabel(apiKeyPermissionItem);
    const subtitle = resolveMobileSubtitle(
      t,
      apiKeyPermissionItem,
      resolvePermissionLabel,
      resolveTenantLabel
    );

    return (
      <ListItem
        title={title}
        subtitle={subtitle}
        onPress={apiKeyPermissionId ? () => onItemPress(apiKeyPermissionId) : undefined}
        actions={onDelete && apiKeyPermissionId ? (
          <Button
            variant="surface"
            size="small"
            onPress={(event) => onDelete(apiKeyPermissionId, event)}
            accessibilityLabel={t('apiKeyPermission.list.delete')}
            accessibilityHint={t('apiKeyPermission.list.deleteHint')}
            testID={`api-key-permission-delete-${itemKey}`}
          >
            {t('common.remove')}
          </Button>
        ) : undefined}
        accessibilityLabel={t('apiKeyPermission.list.itemLabel', { name: title })}
        testID={`api-key-permission-item-${itemKey}`}
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
          testID="api-key-permission-list-notice"
        />
      ) : null}

      <StyledContent>
        <StyledToolbar testID="api-key-permission-list-toolbar">
          <StyledSearchSlot>
            <TextField
              value={search}
              onChangeText={onSearch}
              placeholder={t('apiKeyPermission.list.searchPlaceholder')}
              accessibilityLabel={t('apiKeyPermission.list.searchLabel')}
              density="compact"
              type="search"
              testID="api-key-permission-list-search"
            />
          </StyledSearchSlot>

          <StyledScopeSlot>
            <Select
              value={searchScope}
              onValueChange={onSearchScopeChange}
              options={searchScopeOptions}
              label={t('apiKeyPermission.list.searchScopeLabel')}
              compact
              testID="api-key-permission-list-search-scope"
            />
          </StyledScopeSlot>

          <StyledToolbarActions>
            {onAdd ? (
              <StyledAddButton
                onPress={onAdd}
                accessibilityRole="button"
                accessibilityLabel={t('apiKeyPermission.list.addLabel')}
                accessibilityHint={t('apiKeyPermission.list.addHint')}
                testID="api-key-permission-list-add"
              >
                <Icon glyph="+" size="xs" decorative />
                <StyledAddLabel>{t('apiKeyPermission.list.addLabel')}</StyledAddLabel>
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
              label={t('apiKeyPermission.list.filterLogicLabel')}
              compact
              testID="api-key-permission-filter-logic"
            />

            {filters.map((filter, index) => (
              <StyledFilterRow key={filter.id}>
                <Select
                  value={filter.field}
                  onValueChange={(value) => onFilterFieldChange(filter.id, value)}
                  options={filterFieldOptions}
                  label={t('apiKeyPermission.list.filterFieldLabel')}
                  compact
                  testID={`api-key-permission-filter-field-${index}`}
                />

                <Select
                  value={filter.operator}
                  onValueChange={(value) => onFilterOperatorChange(filter.id, value)}
                  options={resolveFilterOperatorOptions(filter.field)}
                  label={t('apiKeyPermission.list.filterOperatorLabel')}
                  compact
                  testID={`api-key-permission-filter-operator-${index}`}
                />

                <TextField
                  value={filter.value}
                  onChangeText={(value) => onFilterValueChange(filter.id, value)}
                  label={t('apiKeyPermission.list.filterValueLabel')}
                  placeholder={t('apiKeyPermission.list.filterValuePlaceholder')}
                  density="compact"
                  testID={`api-key-permission-filter-value-${index}`}
                />

                <StyledFilterRowActions>
                  <Button
                    variant="surface"
                    size="small"
                    onPress={() => onRemoveFilter(filter.id)}
                    accessibilityLabel={t('apiKeyPermission.list.removeFilter')}
                    testID={`api-key-permission-filter-remove-${index}`}
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
                testID="api-key-permission-filter-add"
              >
                {t('apiKeyPermission.list.addFilter')}
              </Button>

              <Button
                variant="surface"
                size="small"
                onPress={onClearSearchAndFilters}
                testID="api-key-permission-filter-clear"
              >
                {t('apiKeyPermission.list.clearSearchAndFilters')}
              </Button>
            </StyledFilterActions>
          </StyledFilterBody>
        </StyledFilterPanel>

        <Card
          variant="outlined"
          accessibilityLabel={t('apiKeyPermission.list.accessibilityLabel')}
          testID="api-key-permission-list-card"
        >
          <StyledListBody>
            <StyledStateStack>
              {showError ? (
                <ErrorState
                  size={ErrorStateSizes.SMALL}
                  title={t('listScaffold.errorState.title')}
                  description={errorMessage}
                  action={retryAction}
                  testID="api-key-permission-list-error"
                />
              ) : null}

              {showOffline ? (
                <OfflineState
                  size={OfflineStateSizes.SMALL}
                  title={t('shell.banners.offline.title')}
                  description={t('shell.banners.offline.message')}
                  action={retryAction}
                  testID="api-key-permission-list-offline"
                />
              ) : null}

              {showOfflineBanner ? (
                <OfflineState
                  size={OfflineStateSizes.SMALL}
                  title={t('shell.banners.offline.title')}
                  description={t('shell.banners.offline.message')}
                  action={retryAction}
                  testID="api-key-permission-list-offline-banner"
                />
              ) : null}
            </StyledStateStack>

            {isLoading ? (
              <LoadingSpinner
                accessibilityLabel={t('common.loading')}
                testID="api-key-permission-list-loading"
              />
            ) : null}

            {showEmpty ? emptyComponent : null}
            {showNoResults ? noResultsComponent : null}

            {showList ? (
              <StyledList>
                <FlatList
                  data={rows}
                  keyExtractor={(apiKeyPermissionItem, index) => (
                    resolveApiKeyPermissionId(apiKeyPermissionItem) || `api-key-permission-${index}`
                  )}
                  renderItem={renderItem}
                  ItemSeparatorComponent={ItemSeparator}
                  scrollEnabled={false}
                  accessibilityLabel={t('apiKeyPermission.list.accessibilityLabel')}
                  testID="api-key-permission-list-flatlist"
                />
              </StyledList>
            ) : null}

            {showList ? (
              <StyledPagination>
                <StyledPaginationInfo>
                  <Text variant="body">
                    {t('apiKeyPermission.list.pageSummary', { page, totalPages, total: totalItems })}
                  </Text>
                </StyledPaginationInfo>

                <StyledPaginationActions>
                  <Button
                    variant="surface"
                    size="small"
                    onPress={() => onPageChange(page - 1)}
                    disabled={page <= 1}
                    accessibilityLabel={t('common.previous')}
                    testID="api-key-permission-page-prev"
                  >
                    {t('common.previous')}
                  </Button>

                  <StyledPaginationControl>
                    <Select
                      value={String(pageSize)}
                      onValueChange={onPageSizeChange}
                      options={pageSizeOptions}
                      label={t('apiKeyPermission.list.pageSizeLabel')}
                      compact
                      testID="api-key-permission-page-size"
                    />
                  </StyledPaginationControl>

                  <StyledPaginationControl>
                    <Select
                      value={density}
                      onValueChange={onDensityChange}
                      options={densityOptions}
                      label={t('apiKeyPermission.list.densityLabel')}
                      compact
                      testID="api-key-permission-density"
                    />
                  </StyledPaginationControl>

                  <Button
                    variant="surface"
                    size="small"
                    onPress={() => onPageChange(page + 1)}
                    disabled={page >= totalPages}
                    accessibilityLabel={t('common.next')}
                    testID="api-key-permission-page-next"
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

export default ApiKeyPermissionListScreenAndroid;
