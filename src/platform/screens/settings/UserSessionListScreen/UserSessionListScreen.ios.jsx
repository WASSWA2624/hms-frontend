/**
 * UserSessionListScreen - iOS
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
import { formatDateTime } from '@utils';
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
} from './UserSessionListScreen.ios.styles';
import useUserSessionListScreen from './useUserSessionListScreen';

const resolveSessionId = (sessionItem) => String(sessionItem?.id ?? '').trim();

const resolveMobileSubtitle = (
  t,
  locale,
  sessionItem,
  resolveStatusLabel
) => {
  const statusValue = resolveStatusLabel(sessionItem);
  const startedValue = formatDateTime(sessionItem?.created_at, locale);
  const parts = [];

  if (statusValue && statusValue !== t('common.notAvailable')) {
    parts.push(`${t('userSession.list.statusLabel')}: ${statusValue}`);
  }
  if (startedValue) {
    parts.push(`${t('userSession.list.startedLabel')}: ${startedValue}`);
  }

  return parts.length > 0 ? parts.join(' - ') : undefined;
};

const UserSessionListScreenIOS = () => {
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
    resolveSessionLabel,
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
  } = useUserSessionListScreen();

  const rows = pagedItems;
  const emptyComponent = (
    <EmptyState
      title={t('userSession.list.emptyTitle')}
      description={t('userSession.list.emptyMessage')}
      testID="user-session-list-empty-state"
    />
  );

  const noResultsComponent = (
    <EmptyState
      title={t('userSession.list.noResultsTitle')}
      description={t('userSession.list.noResultsMessage')}
      action={(
        <Button
          variant="surface"
          size="small"
          onPress={onClearSearchAndFilters}
          accessibilityLabel={t('userSession.list.clearSearchAndFilters')}
          testID="user-session-list-clear-search"
        >
          {t('userSession.list.clearSearchAndFilters')}
        </Button>
      )}
      testID="user-session-list-no-results"
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
      testID="user-session-list-retry"
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

  const renderItem = ({ item: sessionItem, index }) => {
    const sessionId = resolveSessionId(sessionItem);
    const itemKey = sessionId || `user-session-${index}`;
    const title = resolveSessionLabel(sessionItem);
    const subtitle = resolveMobileSubtitle(
      t,
      locale,
      sessionItem,
      resolveStatusLabel
    );

    return (
      <ListItem
        title={title}
        subtitle={subtitle}
        onPress={sessionId ? () => onItemPress(sessionId) : undefined}
        accessibilityLabel={t('userSession.list.itemLabel', { name: title })}
        testID={`user-session-item-${itemKey}`}
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
          testID="user-session-list-notice"
        />
      ) : null}

      <StyledContent>
        <StyledToolbar testID="user-session-list-toolbar">
          <StyledSearchSlot>
            <TextField
              value={search}
              onChangeText={onSearch}
              placeholder={t('userSession.list.searchPlaceholder')}
              accessibilityLabel={t('userSession.list.searchLabel')}
              density="compact"
              type="search"
              testID="user-session-list-search"
            />
          </StyledSearchSlot>

          <StyledScopeSlot>
            <Select
              value={searchScope}
              onValueChange={onSearchScopeChange}
              options={searchScopeOptions}
              label={t('userSession.list.searchScopeLabel')}
              compact
              testID="user-session-list-search-scope"
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
              label={t('userSession.list.filterLogicLabel')}
              compact
              testID="user-session-filter-logic"
            />

            {filters.map((filter, index) => (
              <StyledFilterRow key={filter.id}>
                <Select
                  value={filter.field}
                  onValueChange={(value) => onFilterFieldChange(filter.id, value)}
                  options={filterFieldOptions}
                  label={t('userSession.list.filterFieldLabel')}
                  compact
                  testID={`user-session-filter-field-${index}`}
                />

                <Select
                  value={filter.operator}
                  onValueChange={(value) => onFilterOperatorChange(filter.id, value)}
                  options={resolveFilterOperatorOptions(filter.field)}
                  label={t('userSession.list.filterOperatorLabel')}
                  compact
                  testID={`user-session-filter-operator-${index}`}
                />

                <TextField
                  value={filter.value}
                  onChangeText={(value) => onFilterValueChange(filter.id, value)}
                  label={t('userSession.list.filterValueLabel')}
                  placeholder={t('userSession.list.filterValuePlaceholder')}
                  density="compact"
                  testID={`user-session-filter-value-${index}`}
                />

                <StyledFilterRowActions>
                  <Button
                    variant="surface"
                    size="small"
                    onPress={() => onRemoveFilter(filter.id)}
                    accessibilityLabel={t('userSession.list.removeFilter')}
                    testID={`user-session-filter-remove-${index}`}
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
                testID="user-session-filter-add"
              >
                {t('userSession.list.addFilter')}
              </Button>

              <Button
                variant="surface"
                size="small"
                onPress={onClearSearchAndFilters}
                testID="user-session-filter-clear"
              >
                {t('userSession.list.clearSearchAndFilters')}
              </Button>
            </StyledFilterActions>
          </StyledFilterBody>
        </StyledFilterPanel>

        <Card
          variant="outlined"
          accessibilityLabel={t('userSession.list.accessibilityLabel')}
          testID="user-session-list-card"
        >
          <StyledListBody>
            <StyledStateStack>
              {showError ? (
                <ErrorState
                  size={ErrorStateSizes.SMALL}
                  title={t('listScaffold.errorState.title')}
                  description={errorMessage}
                  action={retryAction}
                  testID="user-session-list-error"
                />
              ) : null}

              {showOffline ? (
                <OfflineState
                  size={OfflineStateSizes.SMALL}
                  title={t('shell.banners.offline.title')}
                  description={t('shell.banners.offline.message')}
                  action={retryAction}
                  testID="user-session-list-offline"
                />
              ) : null}

              {showOfflineBanner ? (
                <OfflineState
                  size={OfflineStateSizes.SMALL}
                  title={t('shell.banners.offline.title')}
                  description={t('shell.banners.offline.message')}
                  action={retryAction}
                  testID="user-session-list-offline-banner"
                />
              ) : null}
            </StyledStateStack>

            {isLoading ? (
              <LoadingSpinner
                accessibilityLabel={t('common.loading')}
                testID="user-session-list-loading"
              />
            ) : null}

            {showEmpty ? emptyComponent : null}
            {showNoResults ? noResultsComponent : null}

            {showList ? (
              <StyledList>
                <FlatList
                  data={rows}
                  keyExtractor={(sessionItem, index) => (
                    resolveSessionId(sessionItem) || `user-session-${index}`
                  )}
                  renderItem={renderItem}
                  ItemSeparatorComponent={ItemSeparator}
                  scrollEnabled={false}
                  accessibilityLabel={t('userSession.list.accessibilityLabel')}
                  testID="user-session-list-flatlist"
                />
              </StyledList>
            ) : null}

            {showList ? (
              <StyledPagination>
                <StyledPaginationInfo>
                  <Text variant="body">
                    {t('userSession.list.pageSummary', { page, totalPages, total: totalItems })}
                  </Text>
                </StyledPaginationInfo>

                <StyledPaginationActions>
                  <Button
                    variant="surface"
                    size="small"
                    onPress={() => onPageChange(page - 1)}
                    disabled={page <= 1}
                    accessibilityLabel={t('common.previous')}
                    testID="user-session-page-prev"
                  >
                    {t('common.previous')}
                  </Button>

                  <StyledPaginationControl>
                    <Select
                      value={String(pageSize)}
                      onValueChange={onPageSizeChange}
                      options={pageSizeOptions}
                      label={t('userSession.list.pageSizeLabel')}
                      compact
                      testID="user-session-page-size"
                    />
                  </StyledPaginationControl>

                  <StyledPaginationControl>
                    <Select
                      value={density}
                      onValueChange={onDensityChange}
                      options={densityOptions}
                      label={t('userSession.list.densityLabel')}
                      compact
                      testID="user-session-density"
                    />
                  </StyledPaginationControl>

                  <Button
                    variant="surface"
                    size="small"
                    onPress={() => onPageChange(page + 1)}
                    disabled={page >= totalPages}
                    accessibilityLabel={t('common.next')}
                    testID="user-session-page-next"
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

export default UserSessionListScreenIOS;

