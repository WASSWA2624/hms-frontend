/**
 * UserMfaListScreen - Android
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
} from './UserMfaListScreen.android.styles';
import useUserMfaListScreen from './useUserMfaListScreen';

const resolveUserMfaId = (userMfaItem) => String(userMfaItem?.id ?? '').trim();

const resolveMobileSubtitle = (
  t,
  userMfaItem,
  resolveChannelLabel,
  resolveEnabledLabel
) => {
  const channelValue = resolveChannelLabel(userMfaItem);
  const enabledValue = resolveEnabledLabel(userMfaItem);
  const parts = [];

  if (channelValue && channelValue !== t('common.notAvailable')) {
    parts.push(`${t('userMfa.list.channelLabel')}: ${channelValue}`);
  }
  if (enabledValue && enabledValue !== t('common.notAvailable')) {
    parts.push(`${t('userMfa.list.statusLabel')}: ${enabledValue}`);
  }

  return parts.length > 0 ? parts.join(' - ') : undefined;
};

const UserMfaListScreenAndroid = () => {
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
    resolveUserLabel,
    resolveChannelLabel,
    resolveEnabledLabel,
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
  } = useUserMfaListScreen();

  const rows = pagedItems;
  const emptyComponent = (
    <EmptyState
      title={t('userMfa.list.emptyTitle')}
      description={t('userMfa.list.emptyMessage')}
      action={onAdd ? (
        <StyledAddButton
          onPress={onAdd}
          accessibilityRole="button"
          accessibilityLabel={t('userMfa.list.addLabel')}
          accessibilityHint={t('userMfa.list.addHint')}
          testID="user-mfa-list-empty-add"
        >
          <Icon glyph="+" size="xs" decorative />
          <StyledAddLabel>{t('userMfa.list.addLabel')}</StyledAddLabel>
        </StyledAddButton>
      ) : undefined}
      testID="user-mfa-list-empty-state"
    />
  );

  const noResultsComponent = (
    <EmptyState
      title={t('userMfa.list.noResultsTitle')}
      description={t('userMfa.list.noResultsMessage')}
      action={(
        <Button
          variant="surface"
          size="small"
          onPress={onClearSearchAndFilters}
          accessibilityLabel={t('userMfa.list.clearSearchAndFilters')}
          testID="user-mfa-list-clear-search"
        >
          {t('userMfa.list.clearSearchAndFilters')}
        </Button>
      )}
      testID="user-mfa-list-no-results"
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
      testID="user-mfa-list-retry"
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

  const renderItem = ({ item: userMfaItem, index }) => {
    const userMfaId = resolveUserMfaId(userMfaItem);
    const itemKey = userMfaId || `user-mfa-${index}`;
    const title = resolveUserLabel(userMfaItem);
    const subtitle = resolveMobileSubtitle(
      t,
      userMfaItem,
      resolveChannelLabel,
      resolveEnabledLabel
    );

    return (
      <ListItem
        title={title}
        subtitle={subtitle}
        onPress={userMfaId ? () => onItemPress(userMfaId) : undefined}
        actions={onDelete && userMfaId ? (
          <Button
            variant="surface"
            size="small"
            onPress={(event) => onDelete(userMfaId, event)}
            accessibilityLabel={t('userMfa.list.delete')}
            accessibilityHint={t('userMfa.list.deleteHint')}
            testID={`user-mfa-delete-${itemKey}`}
          >
            {t('common.remove')}
          </Button>
        ) : undefined}
        accessibilityLabel={t('userMfa.list.itemLabel', { name: title })}
        testID={`user-mfa-item-${itemKey}`}
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
          testID="user-mfa-list-notice"
        />
      ) : null}

      <StyledContent>
        <StyledToolbar testID="user-mfa-list-toolbar">
          <StyledSearchSlot>
            <TextField
              value={search}
              onChangeText={onSearch}
              placeholder={t('userMfa.list.searchPlaceholder')}
              accessibilityLabel={t('userMfa.list.searchLabel')}
              density="compact"
              type="search"
              testID="user-mfa-list-search"
            />
          </StyledSearchSlot>

          <StyledScopeSlot>
            <Select
              value={searchScope}
              onValueChange={onSearchScopeChange}
              options={searchScopeOptions}
              label={t('userMfa.list.searchScopeLabel')}
              compact
              testID="user-mfa-list-search-scope"
            />
          </StyledScopeSlot>

          <StyledToolbarActions>
            {onAdd ? (
              <StyledAddButton
                onPress={onAdd}
                accessibilityRole="button"
                accessibilityLabel={t('userMfa.list.addLabel')}
                accessibilityHint={t('userMfa.list.addHint')}
                testID="user-mfa-list-add"
              >
                <Icon glyph="+" size="xs" decorative />
                <StyledAddLabel>{t('userMfa.list.addLabel')}</StyledAddLabel>
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
              label={t('userMfa.list.filterLogicLabel')}
              compact
              testID="user-mfa-filter-logic"
            />

            {filters.map((filter, index) => (
              <StyledFilterRow key={filter.id}>
                <Select
                  value={filter.field}
                  onValueChange={(value) => onFilterFieldChange(filter.id, value)}
                  options={filterFieldOptions}
                  label={t('userMfa.list.filterFieldLabel')}
                  compact
                  testID={`user-mfa-filter-field-${index}`}
                />

                <Select
                  value={filter.operator}
                  onValueChange={(value) => onFilterOperatorChange(filter.id, value)}
                  options={resolveFilterOperatorOptions(filter.field)}
                  label={t('userMfa.list.filterOperatorLabel')}
                  compact
                  testID={`user-mfa-filter-operator-${index}`}
                />

                <TextField
                  value={filter.value}
                  onChangeText={(value) => onFilterValueChange(filter.id, value)}
                  label={t('userMfa.list.filterValueLabel')}
                  placeholder={t('userMfa.list.filterValuePlaceholder')}
                  density="compact"
                  testID={`user-mfa-filter-value-${index}`}
                />

                <StyledFilterRowActions>
                  <Button
                    variant="surface"
                    size="small"
                    onPress={() => onRemoveFilter(filter.id)}
                    accessibilityLabel={t('userMfa.list.removeFilter')}
                    testID={`user-mfa-filter-remove-${index}`}
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
                testID="user-mfa-filter-add"
              >
                {t('userMfa.list.addFilter')}
              </Button>

              <Button
                variant="surface"
                size="small"
                onPress={onClearSearchAndFilters}
                testID="user-mfa-filter-clear"
              >
                {t('userMfa.list.clearSearchAndFilters')}
              </Button>
            </StyledFilterActions>
          </StyledFilterBody>
        </StyledFilterPanel>

        <Card
          variant="outlined"
          accessibilityLabel={t('userMfa.list.accessibilityLabel')}
          testID="user-mfa-list-card"
        >
          <StyledListBody>
            <StyledStateStack>
              {showError ? (
                <ErrorState
                  size={ErrorStateSizes.SMALL}
                  title={t('listScaffold.errorState.title')}
                  description={errorMessage}
                  action={retryAction}
                  testID="user-mfa-list-error"
                />
              ) : null}

              {showOffline ? (
                <OfflineState
                  size={OfflineStateSizes.SMALL}
                  title={t('shell.banners.offline.title')}
                  description={t('shell.banners.offline.message')}
                  action={retryAction}
                  testID="user-mfa-list-offline"
                />
              ) : null}

              {showOfflineBanner ? (
                <OfflineState
                  size={OfflineStateSizes.SMALL}
                  title={t('shell.banners.offline.title')}
                  description={t('shell.banners.offline.message')}
                  action={retryAction}
                  testID="user-mfa-list-offline-banner"
                />
              ) : null}
            </StyledStateStack>

            {isLoading ? (
              <LoadingSpinner
                accessibilityLabel={t('common.loading')}
                testID="user-mfa-list-loading"
              />
            ) : null}

            {showEmpty ? emptyComponent : null}
            {showNoResults ? noResultsComponent : null}

            {showList ? (
              <StyledList>
                <FlatList
                  data={rows}
                  keyExtractor={(userMfaItem, index) => (
                    resolveUserMfaId(userMfaItem) || `user-mfa-${index}`
                  )}
                  renderItem={renderItem}
                  ItemSeparatorComponent={ItemSeparator}
                  scrollEnabled={false}
                  accessibilityLabel={t('userMfa.list.accessibilityLabel')}
                  testID="user-mfa-list-flatlist"
                />
              </StyledList>
            ) : null}

            {showList ? (
              <StyledPagination>
                <StyledPaginationInfo>
                  <Text variant="body">
                    {t('userMfa.list.pageSummary', { page, totalPages, total: totalItems })}
                  </Text>
                </StyledPaginationInfo>

                <StyledPaginationActions>
                  <Button
                    variant="surface"
                    size="small"
                    onPress={() => onPageChange(page - 1)}
                    disabled={page <= 1}
                    accessibilityLabel={t('common.previous')}
                    testID="user-mfa-page-prev"
                  >
                    {t('common.previous')}
                  </Button>

                  <StyledPaginationControl>
                    <Select
                      value={String(pageSize)}
                      onValueChange={onPageSizeChange}
                      options={pageSizeOptions}
                      label={t('userMfa.list.pageSizeLabel')}
                      compact
                      testID="user-mfa-page-size"
                    />
                  </StyledPaginationControl>

                  <StyledPaginationControl>
                    <Select
                      value={density}
                      onValueChange={onDensityChange}
                      options={densityOptions}
                      label={t('userMfa.list.densityLabel')}
                      compact
                      testID="user-mfa-density"
                    />
                  </StyledPaginationControl>

                  <Button
                    variant="surface"
                    size="small"
                    onPress={() => onPageChange(page + 1)}
                    disabled={page >= totalPages}
                    accessibilityLabel={t('common.next')}
                    testID="user-mfa-page-next"
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

export default UserMfaListScreenAndroid;
