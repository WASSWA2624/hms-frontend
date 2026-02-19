/**
 * ApiKeyListScreen - Android
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
} from './ApiKeyListScreen.android.styles';
import useApiKeyListScreen from './useApiKeyListScreen';

const resolveApiKeyId = (apiKeyItem) => String(apiKeyItem?.id ?? '').trim();

const resolveMobileSubtitle = (
  t,
  apiKeyItem,
  resolveUserLabel,
  resolveTenantLabel,
  resolveStatusLabel
) => {
  const userValue = resolveUserLabel(apiKeyItem);
  const tenantValue = resolveTenantLabel(apiKeyItem);
  const statusValue = resolveStatusLabel(apiKeyItem);
  const parts = [];

  if (userValue && userValue !== t('common.notAvailable')) {
    parts.push(`${t('apiKey.list.userLabel')}: ${userValue}`);
  }
  if (tenantValue && tenantValue !== t('common.notAvailable')) {
    parts.push(`${t('apiKey.list.tenantLabel')}: ${tenantValue}`);
  }
  if (statusValue && statusValue !== t('common.notAvailable')) {
    parts.push(`${t('apiKey.list.statusLabel')}: ${statusValue}`);
  }

  return parts.length > 0 ? parts.join(' - ') : undefined;
};

const ApiKeyListScreenAndroid = () => {
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
    resolveApiKeyName,
    resolveUserLabel,
    resolveTenantLabel,
    resolveStatusLabel,
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
  } = useApiKeyListScreen();

  const rows = pagedItems;
  const emptyComponent = (
    <EmptyState
      title={t('apiKey.list.emptyTitle')}
      description={t('apiKey.list.emptyMessage')}
      testID="api-key-list-empty-state"
    />
  );

  const noResultsComponent = (
    <EmptyState
      title={t('apiKey.list.noResultsTitle')}
      description={t('apiKey.list.noResultsMessage')}
      action={(
        <Button
          variant="surface"
          size="small"
          onPress={onClearSearchAndFilters}
          accessibilityLabel={t('apiKey.list.clearSearchAndFilters')}
          testID="api-key-list-clear-search"
        >
          {t('apiKey.list.clearSearchAndFilters')}
        </Button>
      )}
      testID="api-key-list-no-results"
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
      testID="api-key-list-retry"
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

  const renderItem = ({ item: apiKeyItem, index }) => {
    const apiKeyId = resolveApiKeyId(apiKeyItem);
    const itemKey = apiKeyId || `api-key-${index}`;
    const title = resolveApiKeyName(apiKeyItem);
    const subtitle = resolveMobileSubtitle(
      t,
      apiKeyItem,
      resolveUserLabel,
      resolveTenantLabel,
      resolveStatusLabel
    );

    return (
      <ListItem
        title={title}
        subtitle={subtitle}
        onPress={apiKeyId ? () => onItemPress(apiKeyId) : undefined}
        accessibilityLabel={t('apiKey.list.itemLabel', { name: title })}
        testID={`api-key-item-${itemKey}`}
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
          testID="api-key-list-notice"
        />
      ) : null}

      <StyledContent>
        <StyledToolbar testID="api-key-list-toolbar">
          <StyledSearchSlot>
            <TextField
              value={search}
              onChangeText={onSearch}
              placeholder={t('apiKey.list.searchPlaceholder')}
              accessibilityLabel={t('apiKey.list.searchLabel')}
              density="compact"
              type="search"
              testID="api-key-list-search"
            />
          </StyledSearchSlot>

          <StyledScopeSlot>
            <Select
              value={searchScope}
              onValueChange={onSearchScopeChange}
              options={searchScopeOptions}
              label={t('apiKey.list.searchScopeLabel')}
              compact
              testID="api-key-list-search-scope"
            />
          </StyledScopeSlot>

          <StyledToolbarActions />
        </StyledToolbar>

        <StyledFilterPanel>
          <StyledFilterBody>
            <Select
              value={filterLogic}
              onValueChange={onFilterLogicChange}
              options={filterLogicOptions}
              label={t('apiKey.list.filterLogicLabel')}
              compact
              testID="api-key-filter-logic"
            />

            {filters.map((filter, index) => (
              <StyledFilterRow key={filter.id}>
                <Select
                  value={filter.field}
                  onValueChange={(value) => onFilterFieldChange(filter.id, value)}
                  options={filterFieldOptions}
                  label={t('apiKey.list.filterFieldLabel')}
                  compact
                  testID={`api-key-filter-field-${index}`}
                />

                <Select
                  value={filter.operator}
                  onValueChange={(value) => onFilterOperatorChange(filter.id, value)}
                  options={resolveFilterOperatorOptions(filter.field)}
                  label={t('apiKey.list.filterOperatorLabel')}
                  compact
                  testID={`api-key-filter-operator-${index}`}
                />

                <TextField
                  value={filter.value}
                  onChangeText={(value) => onFilterValueChange(filter.id, value)}
                  label={t('apiKey.list.filterValueLabel')}
                  placeholder={t('apiKey.list.filterValuePlaceholder')}
                  density="compact"
                  testID={`api-key-filter-value-${index}`}
                />

                <StyledFilterRowActions>
                  <Button
                    variant="surface"
                    size="small"
                    onPress={() => onRemoveFilter(filter.id)}
                    accessibilityLabel={t('apiKey.list.removeFilter')}
                    testID={`api-key-filter-remove-${index}`}
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
                testID="api-key-filter-add"
              >
                {t('apiKey.list.addFilter')}
              </Button>

              <Button
                variant="surface"
                size="small"
                onPress={onClearSearchAndFilters}
                testID="api-key-filter-clear"
              >
                {t('apiKey.list.clearSearchAndFilters')}
              </Button>
            </StyledFilterActions>
          </StyledFilterBody>
        </StyledFilterPanel>

        <Card
          variant="outlined"
          accessibilityLabel={t('apiKey.list.accessibilityLabel')}
          testID="api-key-list-card"
        >
          <StyledListBody>
            <StyledStateStack>
              {showError ? (
                <ErrorState
                  size={ErrorStateSizes.SMALL}
                  title={t('listScaffold.errorState.title')}
                  description={errorMessage}
                  action={retryAction}
                  testID="api-key-list-error"
                />
              ) : null}

              {showOffline ? (
                <OfflineState
                  size={OfflineStateSizes.SMALL}
                  title={t('shell.banners.offline.title')}
                  description={t('shell.banners.offline.message')}
                  action={retryAction}
                  testID="api-key-list-offline"
                />
              ) : null}

              {showOfflineBanner ? (
                <OfflineState
                  size={OfflineStateSizes.SMALL}
                  title={t('shell.banners.offline.title')}
                  description={t('shell.banners.offline.message')}
                  action={retryAction}
                  testID="api-key-list-offline-banner"
                />
              ) : null}
            </StyledStateStack>

            {isLoading ? (
              <LoadingSpinner
                accessibilityLabel={t('common.loading')}
                testID="api-key-list-loading"
              />
            ) : null}

            {showEmpty ? emptyComponent : null}
            {showNoResults ? noResultsComponent : null}

            {showList ? (
              <StyledList>
                <FlatList
                  data={rows}
                  keyExtractor={(apiKeyItem, index) => (
                    resolveApiKeyId(apiKeyItem) || `api-key-${index}`
                  )}
                  renderItem={renderItem}
                  ItemSeparatorComponent={ItemSeparator}
                  scrollEnabled={false}
                  accessibilityLabel={t('apiKey.list.accessibilityLabel')}
                  testID="api-key-list-flatlist"
                />
              </StyledList>
            ) : null}

            {showList ? (
              <StyledPagination>
                <StyledPaginationInfo>
                  <Text variant="body">
                    {t('apiKey.list.pageSummary', { page, totalPages, total: totalItems })}
                  </Text>
                </StyledPaginationInfo>

                <StyledPaginationActions>
                  <Button
                    variant="surface"
                    size="small"
                    onPress={() => onPageChange(page - 1)}
                    disabled={page <= 1}
                    accessibilityLabel={t('common.previous')}
                    testID="api-key-page-prev"
                  >
                    {t('common.previous')}
                  </Button>

                  <StyledPaginationControl>
                    <Select
                      value={String(pageSize)}
                      onValueChange={onPageSizeChange}
                      options={pageSizeOptions}
                      label={t('apiKey.list.pageSizeLabel')}
                      compact
                      testID="api-key-page-size"
                    />
                  </StyledPaginationControl>

                  <StyledPaginationControl>
                    <Select
                      value={density}
                      onValueChange={onDensityChange}
                      options={densityOptions}
                      label={t('apiKey.list.densityLabel')}
                      compact
                      testID="api-key-density"
                    />
                  </StyledPaginationControl>

                  <Button
                    variant="surface"
                    size="small"
                    onPress={() => onPageChange(page + 1)}
                    disabled={page >= totalPages}
                    accessibilityLabel={t('common.next')}
                    testID="api-key-page-next"
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

export default ApiKeyListScreenAndroid;
