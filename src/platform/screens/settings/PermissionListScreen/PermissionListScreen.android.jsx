/**
 * PermissionListScreen - Android
 * File: PermissionListScreen.android.jsx
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
import { humanizeIdentifier } from '@utils';
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
} from './PermissionListScreen.android.styles';
import usePermissionListScreen from './usePermissionListScreen';

const resolvePermissionId = (permissionItem) => String(permissionItem?.id ?? '').trim();

const resolvePermissionName = (t, permissionItem) => (
  humanizeIdentifier(permissionItem?.name) || t('permission.list.unnamedPermission')
);

const resolvePermissionDescription = (t, permissionItem) => (
  humanizeIdentifier(permissionItem?.description) || t('common.notAvailable')
);

const resolvePermissionTenant = (t, permissionItem, canViewTechnicalIds) => {
  const readableTenant = humanizeIdentifier(permissionItem?.tenant_name)
    || humanizeIdentifier(permissionItem?.tenant?.name)
    || humanizeIdentifier(permissionItem?.tenant_label);

  if (readableTenant) return readableTenant;

  const technicalTenantId = String(permissionItem?.tenant_id ?? '').trim();
  if (technicalTenantId && canViewTechnicalIds) return technicalTenantId;
  if (technicalTenantId) return t('permission.list.currentTenantLabel');
  return t('common.notAvailable');
};

const PermissionListScreenAndroid = () => {
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
    canViewTechnicalIds,
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
    onPageChange,
    onPageSizeChange,
    onDensityChange,
    resolveFilterOperatorOptions,
    onItemPress,
    onDelete,
    onAdd,
  } = usePermissionListScreen();

  const rows = pagedItems;
  const emptyComponent = (
    <EmptyState
      title={t('permission.list.emptyTitle')}
      description={t('permission.list.emptyMessage')}
      action={
        onAdd ? (
          <StyledAddButton
            onPress={onAdd}
            accessibilityRole="button"
            accessibilityLabel={t('permission.list.addLabel')}
            accessibilityHint={t('permission.list.addHint')}
            testID="permission-list-empty-add"
          >
            <Icon glyph="+" size="xs" decorative />
            <StyledAddLabel>{t('permission.list.addLabel')}</StyledAddLabel>
          </StyledAddButton>
        ) : undefined
      }
      testID="permission-list-empty-state"
    />
  );

  const noResultsComponent = (
    <EmptyState
      title={t('permission.list.noResultsTitle')}
      description={t('permission.list.noResultsMessage')}
      action={(
        <StyledAddButton
          onPress={onClearSearchAndFilters}
          accessibilityRole="button"
          accessibilityLabel={t('permission.list.clearSearchAndFilters')}
          testID="permission-list-clear-search"
        >
          <StyledAddLabel>{t('permission.list.clearSearchAndFilters')}</StyledAddLabel>
        </StyledAddButton>
      )}
      testID="permission-list-no-results"
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
      testID="permission-list-retry"
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

  const renderItem = ({ item: permissionItem, index }) => {
    const permissionId = resolvePermissionId(permissionItem);
    const itemKey = permissionId || `permission-${index}`;
    const title = resolvePermissionName(t, permissionItem);
    const description = resolvePermissionDescription(t, permissionItem);
    const tenant = resolvePermissionTenant(t, permissionItem, canViewTechnicalIds);
    const subtitle = [description, tenant].filter(Boolean).join(' - ');

    return (
      <ListItem
        title={title}
        subtitle={subtitle || undefined}
        onPress={permissionId ? () => onItemPress(permissionId) : undefined}
        actions={onDelete && permissionId ? (
          <Button
            variant="surface"
            size="small"
            onPress={(event) => onDelete(permissionId, event)}
            accessibilityLabel={t('permission.list.delete')}
            accessibilityHint={t('permission.list.deleteHint')}
            testID={`permission-delete-${itemKey}`}
          >
            {t('common.remove')}
          </Button>
        ) : undefined}
        accessibilityLabel={t('permission.list.itemLabel', { name: title })}
        testID={`permission-item-${itemKey}`}
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
          testID="permission-list-notice"
        />
      ) : null}
      <StyledContent>
        <StyledToolbar testID="permission-list-toolbar">
          <StyledSearchSlot>
            <TextField
              value={search}
              onChangeText={onSearch}
              placeholder={t('permission.list.searchPlaceholder')}
              accessibilityLabel={t('permission.list.searchLabel')}
              density="compact"
              type="search"
              testID="permission-list-search"
            />
          </StyledSearchSlot>
          <StyledScopeSlot>
            <Select
              value={searchScope}
              onValueChange={onSearchScopeChange}
              options={searchScopeOptions}
              label={t('permission.list.searchScopeLabel')}
              compact
              testID="permission-list-search-scope"
            />
          </StyledScopeSlot>
          <StyledToolbarActions>
            {onAdd && (
              <StyledAddButton
                onPress={onAdd}
                accessibilityRole="button"
                accessibilityLabel={t('permission.list.addLabel')}
                accessibilityHint={t('permission.list.addHint')}
                testID="permission-list-add"
              >
                <Icon glyph="+" size="xs" decorative />
                <StyledAddLabel>{t('permission.list.addLabel')}</StyledAddLabel>
              </StyledAddButton>
            )}
          </StyledToolbarActions>
        </StyledToolbar>

        <StyledFilterPanel>
          <StyledFilterBody>
            <Select
              value={filterLogic}
              onValueChange={onFilterLogicChange}
              options={filterLogicOptions}
              label={t('permission.list.filterLogicLabel')}
              compact
              testID="permission-filter-logic"
            />

            {filters.map((filter, index) => (
              <StyledFilterRow key={filter.id}>
                <Select
                  value={filter.field}
                  onValueChange={(value) => onFilterFieldChange(filter.id, value)}
                  options={filterFieldOptions}
                  label={t('permission.list.filterFieldLabel')}
                  compact
                  testID={`permission-filter-field-${index}`}
                />

                <Select
                  value={filter.operator}
                  onValueChange={(value) => onFilterOperatorChange(filter.id, value)}
                  options={resolveFilterOperatorOptions(filter.field)}
                  label={t('permission.list.filterOperatorLabel')}
                  compact
                  testID={`permission-filter-operator-${index}`}
                />

                <TextField
                  value={filter.value}
                  onChangeText={(value) => onFilterValueChange(filter.id, value)}
                  label={t('permission.list.filterValueLabel')}
                  placeholder={t('permission.list.filterValuePlaceholder')}
                  density="compact"
                  testID={`permission-filter-value-${index}`}
                />

                <StyledFilterRowActions>
                  <Button
                    variant="surface"
                    size="small"
                    onPress={() => onRemoveFilter(filter.id)}
                    accessibilityLabel={t('permission.list.removeFilter')}
                    testID={`permission-filter-remove-${index}`}
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
                testID="permission-filter-add"
              >
                {t('permission.list.addFilter')}
              </Button>

              <Button
                variant="surface"
                size="small"
                onPress={onClearSearchAndFilters}
                testID="permission-filter-clear"
              >
                {t('permission.list.clearSearchAndFilters')}
              </Button>
            </StyledFilterActions>
          </StyledFilterBody>
        </StyledFilterPanel>

        <Card
          variant="outlined"
          accessibilityLabel={t('permission.list.accessibilityLabel')}
          testID="permission-list-card"
        >
          <StyledListBody>
            <StyledStateStack>
              {showError && (
                <ErrorState
                  size={ErrorStateSizes.SMALL}
                  title={t('listScaffold.errorState.title')}
                  description={errorMessage}
                  action={retryAction}
                  testID="permission-list-error"
                />
              )}
              {showOffline && (
                <OfflineState
                  size={OfflineStateSizes.SMALL}
                  title={t('shell.banners.offline.title')}
                  description={t('shell.banners.offline.message')}
                  action={retryAction}
                  testID="permission-list-offline"
                />
              )}
              {showOfflineBanner && (
                <OfflineState
                  size={OfflineStateSizes.SMALL}
                  title={t('shell.banners.offline.title')}
                  description={t('shell.banners.offline.message')}
                  action={retryAction}
                  testID="permission-list-offline-banner"
                />
              )}
            </StyledStateStack>
            {isLoading && (
              <LoadingSpinner accessibilityLabel={t('common.loading')} testID="permission-list-loading" />
            )}
            {showEmpty ? emptyComponent : null}
            {showNoResults ? noResultsComponent : null}
            {showList ? (
              <StyledList>
                <FlatList
                  data={rows}
                  keyExtractor={(permissionItem, index) => resolvePermissionId(permissionItem) || `permission-${index}`}
                  renderItem={renderItem}
                  ItemSeparatorComponent={ItemSeparator}
                  scrollEnabled={false}
                  accessibilityLabel={t('permission.list.accessibilityLabel')}
                  testID="permission-list-flatlist"
                />
              </StyledList>
            ) : null}

            {showList ? (
              <StyledPagination>
                <StyledPaginationInfo>
                  <Text variant="body">
                    {t('permission.list.pageSummary', { page, totalPages, total: totalItems })}
                  </Text>
                </StyledPaginationInfo>

                <StyledPaginationActions>
                  <Button
                    variant="surface"
                    size="small"
                    onPress={() => onPageChange(page - 1)}
                    disabled={page <= 1}
                    accessibilityLabel={t('common.previous')}
                    testID="permission-page-prev"
                  >
                    {t('common.previous')}
                  </Button>

                  <StyledPaginationControl>
                    <Select
                      value={String(pageSize)}
                      onValueChange={onPageSizeChange}
                      options={pageSizeOptions}
                      label={t('permission.list.pageSizeLabel')}
                      compact
                      testID="permission-page-size"
                    />
                  </StyledPaginationControl>

                  <StyledPaginationControl>
                    <Select
                      value={density}
                      onValueChange={onDensityChange}
                      options={densityOptions}
                      label={t('permission.list.densityLabel')}
                      compact
                      testID="permission-density"
                    />
                  </StyledPaginationControl>

                  <Button
                    variant="surface"
                    size="small"
                    onPress={() => onPageChange(page + 1)}
                    disabled={page >= totalPages}
                    accessibilityLabel={t('common.next')}
                    testID="permission-page-next"
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

export default PermissionListScreenAndroid;
