/**
 * UserRoleListScreen - iOS
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
} from './UserRoleListScreen.ios.styles';
import useUserRoleListScreen from './useUserRoleListScreen';

const resolveUserRoleId = (UserRoleItem) => String(UserRoleItem?.id ?? '').trim();

const resolveMobileSubtitle = (
  t,
  UserRoleItem,
  resolveRoleLabel,
  resolveTenantLabel,
  resolveFacilityLabel
) => {
  const roleValue = resolveRoleLabel(UserRoleItem);
  const tenantValue = resolveTenantLabel(UserRoleItem);
  const facilityValue = resolveFacilityLabel(UserRoleItem);
  const parts = [];

  if (roleValue && roleValue !== t('common.notAvailable')) {
    parts.push(`${t('userRole.list.roleLabel')}: ${roleValue}`);
  }
  if (tenantValue && tenantValue !== t('common.notAvailable')) {
    parts.push(`${t('userRole.list.tenantLabel')}: ${tenantValue}`);
  }
  if (facilityValue && facilityValue !== t('common.notAvailable')) {
    parts.push(`${t('userRole.list.facilityLabel')}: ${facilityValue}`);
  }

  return parts.length > 0 ? parts.join(' - ') : undefined;
};

const UserRoleListScreenIOS = () => {
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
    resolveRoleLabel,
    resolveTenantLabel,
    resolveFacilityLabel,
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
  } = useUserRoleListScreen();

  const rows = pagedItems;
  const emptyComponent = (
    <EmptyState
      title={t('userRole.list.emptyTitle')}
      description={t('userRole.list.emptyMessage')}
      action={onAdd ? (
        <StyledAddButton
          onPress={onAdd}
          accessibilityRole="button"
          accessibilityLabel={t('userRole.list.addLabel')}
          accessibilityHint={t('userRole.list.addHint')}
          testID="user-role-list-empty-add"
        >
          <Icon glyph="+" size="xs" decorative />
          <StyledAddLabel>{t('userRole.list.addLabel')}</StyledAddLabel>
        </StyledAddButton>
      ) : undefined}
      testID="user-role-list-empty-state"
    />
  );

  const noResultsComponent = (
    <EmptyState
      title={t('userRole.list.noResultsTitle')}
      description={t('userRole.list.noResultsMessage')}
      action={(
        <Button
          variant="surface"
          size="small"
          onPress={onClearSearchAndFilters}
          accessibilityLabel={t('userRole.list.clearSearchAndFilters')}
          testID="user-role-list-clear-search"
        >
          {t('userRole.list.clearSearchAndFilters')}
        </Button>
      )}
      testID="user-role-list-no-results"
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
      testID="user-role-list-retry"
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

  const renderItem = ({ item: UserRoleItem, index }) => {
    const UserRoleId = resolveUserRoleId(UserRoleItem);
    const itemKey = UserRoleId || `user-role-${index}`;
    const title = resolveUserLabel(UserRoleItem);
    const subtitle = resolveMobileSubtitle(
      t,
      UserRoleItem,
      resolveRoleLabel,
      resolveTenantLabel,
      resolveFacilityLabel
    );

    return (
      <ListItem
        title={title}
        subtitle={subtitle}
        onPress={UserRoleId ? () => onItemPress(UserRoleId) : undefined}
        actions={onDelete && UserRoleId ? (
          <Button
            variant="surface"
            size="small"
            onPress={(event) => onDelete(UserRoleId, event)}
            accessibilityLabel={t('userRole.list.delete')}
            accessibilityHint={t('userRole.list.deleteHint')}
            testID={`user-role-delete-${itemKey}`}
          >
            {t('common.remove')}
          </Button>
        ) : undefined}
        accessibilityLabel={t('userRole.list.itemLabel', { name: title })}
        testID={`user-role-item-${itemKey}`}
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
          testID="user-role-list-notice"
        />
      ) : null}

      <StyledContent>
        <StyledToolbar testID="user-role-list-toolbar">
          <StyledSearchSlot>
            <TextField
              value={search}
              onChangeText={onSearch}
              placeholder={t('userRole.list.searchPlaceholder')}
              accessibilityLabel={t('userRole.list.searchLabel')}
              density="compact"
              type="search"
              testID="user-role-list-search"
            />
          </StyledSearchSlot>

          <StyledScopeSlot>
            <Select
              value={searchScope}
              onValueChange={onSearchScopeChange}
              options={searchScopeOptions}
              label={t('userRole.list.searchScopeLabel')}
              compact
              testID="user-role-list-search-scope"
            />
          </StyledScopeSlot>

          <StyledToolbarActions>
            {onAdd ? (
              <StyledAddButton
                onPress={onAdd}
                accessibilityRole="button"
                accessibilityLabel={t('userRole.list.addLabel')}
                accessibilityHint={t('userRole.list.addHint')}
                testID="user-role-list-add"
              >
                <Icon glyph="+" size="xs" decorative />
                <StyledAddLabel>{t('userRole.list.addLabel')}</StyledAddLabel>
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
              label={t('userRole.list.filterLogicLabel')}
              compact
              testID="user-role-filter-logic"
            />

            {filters.map((filter, index) => (
              <StyledFilterRow key={filter.id}>
                <Select
                  value={filter.field}
                  onValueChange={(value) => onFilterFieldChange(filter.id, value)}
                  options={filterFieldOptions}
                  label={t('userRole.list.filterFieldLabel')}
                  compact
                  testID={`user-role-filter-field-${index}`}
                />

                <Select
                  value={filter.operator}
                  onValueChange={(value) => onFilterOperatorChange(filter.id, value)}
                  options={resolveFilterOperatorOptions(filter.field)}
                  label={t('userRole.list.filterOperatorLabel')}
                  compact
                  testID={`user-role-filter-operator-${index}`}
                />

                <TextField
                  value={filter.value}
                  onChangeText={(value) => onFilterValueChange(filter.id, value)}
                  label={t('userRole.list.filterValueLabel')}
                  placeholder={t('userRole.list.filterValuePlaceholder')}
                  density="compact"
                  testID={`user-role-filter-value-${index}`}
                />

                <StyledFilterRowActions>
                  <Button
                    variant="surface"
                    size="small"
                    onPress={() => onRemoveFilter(filter.id)}
                    accessibilityLabel={t('userRole.list.removeFilter')}
                    testID={`user-role-filter-remove-${index}`}
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
                testID="user-role-filter-add"
              >
                {t('userRole.list.addFilter')}
              </Button>

              <Button
                variant="surface"
                size="small"
                onPress={onClearSearchAndFilters}
                testID="user-role-filter-clear"
              >
                {t('userRole.list.clearSearchAndFilters')}
              </Button>
            </StyledFilterActions>
          </StyledFilterBody>
        </StyledFilterPanel>

        <Card
          variant="outlined"
          accessibilityLabel={t('userRole.list.accessibilityLabel')}
          testID="user-role-list-card"
        >
          <StyledListBody>
            <StyledStateStack>
              {showError ? (
                <ErrorState
                  size={ErrorStateSizes.SMALL}
                  title={t('listScaffold.errorState.title')}
                  description={errorMessage}
                  action={retryAction}
                  testID="user-role-list-error"
                />
              ) : null}

              {showOffline ? (
                <OfflineState
                  size={OfflineStateSizes.SMALL}
                  title={t('shell.banners.offline.title')}
                  description={t('shell.banners.offline.message')}
                  action={retryAction}
                  testID="user-role-list-offline"
                />
              ) : null}

              {showOfflineBanner ? (
                <OfflineState
                  size={OfflineStateSizes.SMALL}
                  title={t('shell.banners.offline.title')}
                  description={t('shell.banners.offline.message')}
                  action={retryAction}
                  testID="user-role-list-offline-banner"
                />
              ) : null}
            </StyledStateStack>

            {isLoading ? (
              <LoadingSpinner
                accessibilityLabel={t('common.loading')}
                testID="user-role-list-loading"
              />
            ) : null}

            {showEmpty ? emptyComponent : null}
            {showNoResults ? noResultsComponent : null}

            {showList ? (
              <StyledList>
                <FlatList
                  data={rows}
                  keyExtractor={(UserRoleItem, index) => (
                    resolveUserRoleId(UserRoleItem) || `user-role-${index}`
                  )}
                  renderItem={renderItem}
                  ItemSeparatorComponent={ItemSeparator}
                  scrollEnabled={false}
                  accessibilityLabel={t('userRole.list.accessibilityLabel')}
                  testID="user-role-list-flatlist"
                />
              </StyledList>
            ) : null}

            {showList ? (
              <StyledPagination>
                <StyledPaginationInfo>
                  <Text variant="body">
                    {t('userRole.list.pageSummary', { page, totalPages, total: totalItems })}
                  </Text>
                </StyledPaginationInfo>

                <StyledPaginationActions>
                  <Button
                    variant="surface"
                    size="small"
                    onPress={() => onPageChange(page - 1)}
                    disabled={page <= 1}
                    accessibilityLabel={t('common.previous')}
                    testID="user-role-page-prev"
                  >
                    {t('common.previous')}
                  </Button>

                  <StyledPaginationControl>
                    <Select
                      value={String(pageSize)}
                      onValueChange={onPageSizeChange}
                      options={pageSizeOptions}
                      label={t('userRole.list.pageSizeLabel')}
                      compact
                      testID="user-role-page-size"
                    />
                  </StyledPaginationControl>

                  <StyledPaginationControl>
                    <Select
                      value={density}
                      onValueChange={onDensityChange}
                      options={densityOptions}
                      label={t('userRole.list.densityLabel')}
                      compact
                      testID="user-role-density"
                    />
                  </StyledPaginationControl>

                  <Button
                    variant="surface"
                    size="small"
                    onPress={() => onPageChange(page + 1)}
                    disabled={page >= totalPages}
                    accessibilityLabel={t('common.next')}
                    testID="user-role-page-next"
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

export default UserRoleListScreenIOS;
