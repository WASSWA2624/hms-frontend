/**
 * OauthAccountListScreen - Android
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
import { formatDateTime } from '@utils';
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
} from './OauthAccountListScreen.android.styles';
import useOauthAccountListScreen from './useOauthAccountListScreen';

const resolveOauthAccountId = (oauthAccountItem) => String(oauthAccountItem?.id ?? '').trim();

const resolveMobileSubtitle = (
  t,
  locale,
  oauthAccountItem,
  resolveUserLabel,
  resolveProviderUserLabel
) => {
  const userValue = resolveUserLabel(oauthAccountItem);
  const providerUserValue = resolveProviderUserLabel(oauthAccountItem);
  const expiresValue = formatDateTime(oauthAccountItem?.expires_at, locale);
  const parts = [];

  if (userValue && userValue !== t('common.notAvailable')) {
    parts.push(`${t('oauthAccount.list.userLabel')}: ${userValue}`);
  }
  if (providerUserValue && providerUserValue !== t('common.notAvailable')) {
    parts.push(`${t('oauthAccount.list.providerUserLabel')}: ${providerUserValue}`);
  }
  if (expiresValue) {
    parts.push(`${t('oauthAccount.list.expiresLabel')}: ${expiresValue}`);
  }

  return parts.length > 0 ? parts.join(' - ') : undefined;
};

const OauthAccountListScreenAndroid = () => {
  const { t, locale } = useI18n();
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
    resolveProviderLabel,
    resolveUserLabel,
    resolveProviderUserLabel,
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
  } = useOauthAccountListScreen();

  const rows = pagedItems;
  const emptyComponent = (
    <EmptyState
      title={t('oauthAccount.list.emptyTitle')}
      description={t('oauthAccount.list.emptyMessage')}
      action={onAdd ? (
        <StyledAddButton
          onPress={onAdd}
          accessibilityRole="button"
          accessibilityLabel={t('oauthAccount.list.addLabel')}
          accessibilityHint={t('oauthAccount.list.addHint')}
          testID="oauth-account-list-empty-add"
        >
          <Icon glyph="+" size="xs" decorative />
          <StyledAddLabel>{t('oauthAccount.list.addLabel')}</StyledAddLabel>
        </StyledAddButton>
      ) : undefined}
      testID="oauth-account-list-empty-state"
    />
  );

  const noResultsComponent = (
    <EmptyState
      title={t('oauthAccount.list.noResultsTitle')}
      description={t('oauthAccount.list.noResultsMessage')}
      action={(
        <Button
          variant="surface"
          size="small"
          onPress={onClearSearchAndFilters}
          accessibilityLabel={t('oauthAccount.list.clearSearchAndFilters')}
          testID="oauth-account-list-clear-search"
        >
          {t('oauthAccount.list.clearSearchAndFilters')}
        </Button>
      )}
      testID="oauth-account-list-no-results"
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
      testID="oauth-account-list-retry"
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

  const renderItem = ({ item: oauthAccountItem, index }) => {
    const oauthAccountId = resolveOauthAccountId(oauthAccountItem);
    const itemKey = oauthAccountId || `oauth-account-${index}`;
    const title = resolveProviderLabel(oauthAccountItem);
    const subtitle = resolveMobileSubtitle(
      t,
      locale,
      oauthAccountItem,
      resolveUserLabel,
      resolveProviderUserLabel
    );

    return (
      <ListItem
        title={title}
        subtitle={subtitle}
        onPress={oauthAccountId ? () => onItemPress(oauthAccountId) : undefined}
        actions={onDelete && oauthAccountId ? (
          <Button
            variant="surface"
            size="small"
            onPress={(event) => onDelete(oauthAccountId, event)}
            accessibilityLabel={t('oauthAccount.list.delete')}
            accessibilityHint={t('oauthAccount.list.deleteHint')}
            testID={`oauth-account-delete-${itemKey}`}
          >
            {t('common.remove')}
          </Button>
        ) : undefined}
        accessibilityLabel={t('oauthAccount.list.itemLabel', { name: title })}
        testID={`oauth-account-item-${itemKey}`}
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
          testID="oauth-account-list-notice"
        />
      ) : null}

      <StyledContent>
        <StyledToolbar testID="oauth-account-list-toolbar">
          <StyledSearchSlot>
            <TextField
              value={search}
              onChangeText={onSearch}
              placeholder={t('oauthAccount.list.searchPlaceholder')}
              accessibilityLabel={t('oauthAccount.list.searchLabel')}
              density="compact"
              type="search"
              testID="oauth-account-list-search"
            />
          </StyledSearchSlot>

          <StyledScopeSlot>
            <Select
              value={searchScope}
              onValueChange={onSearchScopeChange}
              options={searchScopeOptions}
              label={t('oauthAccount.list.searchScopeLabel')}
              compact
              testID="oauth-account-list-search-scope"
            />
          </StyledScopeSlot>

          <StyledToolbarActions>
            {onAdd ? (
              <StyledAddButton
                onPress={onAdd}
                accessibilityRole="button"
                accessibilityLabel={t('oauthAccount.list.addLabel')}
                accessibilityHint={t('oauthAccount.list.addHint')}
                testID="oauth-account-list-add"
              >
                <Icon glyph="+" size="xs" decorative />
                <StyledAddLabel>{t('oauthAccount.list.addLabel')}</StyledAddLabel>
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
              label={t('oauthAccount.list.filterLogicLabel')}
              compact
              testID="oauth-account-filter-logic"
            />

            {filters.map((filter, index) => (
              <StyledFilterRow key={filter.id}>
                <Select
                  value={filter.field}
                  onValueChange={(value) => onFilterFieldChange(filter.id, value)}
                  options={filterFieldOptions}
                  label={t('oauthAccount.list.filterFieldLabel')}
                  compact
                  testID={`oauth-account-filter-field-${index}`}
                />

                <Select
                  value={filter.operator}
                  onValueChange={(value) => onFilterOperatorChange(filter.id, value)}
                  options={resolveFilterOperatorOptions(filter.field)}
                  label={t('oauthAccount.list.filterOperatorLabel')}
                  compact
                  testID={`oauth-account-filter-operator-${index}`}
                />

                <TextField
                  value={filter.value}
                  onChangeText={(value) => onFilterValueChange(filter.id, value)}
                  label={t('oauthAccount.list.filterValueLabel')}
                  placeholder={t('oauthAccount.list.filterValuePlaceholder')}
                  density="compact"
                  testID={`oauth-account-filter-value-${index}`}
                />

                <StyledFilterRowActions>
                  <Button
                    variant="surface"
                    size="small"
                    onPress={() => onRemoveFilter(filter.id)}
                    accessibilityLabel={t('oauthAccount.list.removeFilter')}
                    testID={`oauth-account-filter-remove-${index}`}
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
                testID="oauth-account-filter-add"
              >
                {t('oauthAccount.list.addFilter')}
              </Button>

              <Button
                variant="surface"
                size="small"
                onPress={onClearSearchAndFilters}
                testID="oauth-account-filter-clear"
              >
                {t('oauthAccount.list.clearSearchAndFilters')}
              </Button>
            </StyledFilterActions>
          </StyledFilterBody>
        </StyledFilterPanel>

        <Card
          variant="outlined"
          accessibilityLabel={t('oauthAccount.list.accessibilityLabel')}
          testID="oauth-account-list-card"
        >
          <StyledListBody>
            <StyledStateStack>
              {showError ? (
                <ErrorState
                  size={ErrorStateSizes.SMALL}
                  title={t('listScaffold.errorState.title')}
                  description={errorMessage}
                  action={retryAction}
                  testID="oauth-account-list-error"
                />
              ) : null}

              {showOffline ? (
                <OfflineState
                  size={OfflineStateSizes.SMALL}
                  title={t('shell.banners.offline.title')}
                  description={t('shell.banners.offline.message')}
                  action={retryAction}
                  testID="oauth-account-list-offline"
                />
              ) : null}

              {showOfflineBanner ? (
                <OfflineState
                  size={OfflineStateSizes.SMALL}
                  title={t('shell.banners.offline.title')}
                  description={t('shell.banners.offline.message')}
                  action={retryAction}
                  testID="oauth-account-list-offline-banner"
                />
              ) : null}
            </StyledStateStack>

            {isLoading ? (
              <LoadingSpinner
                accessibilityLabel={t('common.loading')}
                testID="oauth-account-list-loading"
              />
            ) : null}

            {showEmpty ? emptyComponent : null}
            {showNoResults ? noResultsComponent : null}

            {showList ? (
              <StyledList>
                <FlatList
                  data={rows}
                  keyExtractor={(oauthAccountItem, index) => (
                    resolveOauthAccountId(oauthAccountItem) || `oauth-account-${index}`
                  )}
                  renderItem={renderItem}
                  ItemSeparatorComponent={ItemSeparator}
                  scrollEnabled={false}
                  accessibilityLabel={t('oauthAccount.list.accessibilityLabel')}
                  testID="oauth-account-list-flatlist"
                />
              </StyledList>
            ) : null}

            {showList ? (
              <StyledPagination>
                <StyledPaginationInfo>
                  <Text variant="body">
                    {t('oauthAccount.list.pageSummary', { page, totalPages, total: totalItems })}
                  </Text>
                </StyledPaginationInfo>

                <StyledPaginationActions>
                  <Button
                    variant="surface"
                    size="small"
                    onPress={() => onPageChange(page - 1)}
                    disabled={page <= 1}
                    accessibilityLabel={t('common.previous')}
                    testID="oauth-account-page-prev"
                  >
                    {t('common.previous')}
                  </Button>

                  <StyledPaginationControl>
                    <Select
                      value={String(pageSize)}
                      onValueChange={onPageSizeChange}
                      options={pageSizeOptions}
                      label={t('oauthAccount.list.pageSizeLabel')}
                      compact
                      testID="oauth-account-page-size"
                    />
                  </StyledPaginationControl>

                  <StyledPaginationControl>
                    <Select
                      value={density}
                      onValueChange={onDensityChange}
                      options={densityOptions}
                      label={t('oauthAccount.list.densityLabel')}
                      compact
                      testID="oauth-account-density"
                    />
                  </StyledPaginationControl>

                  <Button
                    variant="surface"
                    size="small"
                    onPress={() => onPageChange(page + 1)}
                    disabled={page >= totalPages}
                    accessibilityLabel={t('common.next')}
                    testID="oauth-account-page-next"
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

export default OauthAccountListScreenAndroid;

