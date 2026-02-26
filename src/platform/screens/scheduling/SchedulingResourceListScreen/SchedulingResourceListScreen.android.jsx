import React from 'react';
import { FlatList, View } from 'react-native';
import {
  Button,
  Card,
  Checkbox,
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
  StyledList,
  StyledListBody,
  StyledSeparator,
  StyledStateStack,
  StyledToolbar,
  StyledToolbarActions,
} from './SchedulingResourceListScreen.android.styles';
import useSchedulingResourceListScreen from './useSchedulingResourceListScreen';

const SchedulingResourceListScreenAndroid = ({ resourceId }) => {
  const { t } = useI18n();
  const {
    config,
    items,
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
    reminderBoardFilter,
    reminderBoardFilterOptions,
    showReminderBoardFilters,
    filters,
    filterFieldOptions,
    filterLogic,
    filterLogicOptions,
    canAddFilter,
    hasNoResults,
    hasActiveSearchOrFilter,
    selectedRecordIds,
    isLoading,
    hasError,
    errorMessage,
    isOffline,
    noticeMessage,
    onDismissNotice,
    onRetry,
    onSearch,
    onSearchScopeChange,
    onReminderBoardFilterChange,
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
    onToggleRecordSelection,
    onClearSelection,
    onBulkDelete,
    resolveFilterOperatorOptions,
    resolveRowAction,
    onItemPress,
    onDelete,
    onEdit,
    onAdd,
    canCreate,
    canEdit,
    canDelete,
    createBlockedReason,
    deleteBlockedReason,
  } = useSchedulingResourceListScreen(resourceId);

  if (!config) return null;

  const showError = !isLoading && hasError && !isOffline;
  const showOffline = !isLoading && isOffline && items.length === 0;
  const showOfflineBanner = !isLoading && isOffline && items.length > 0;
  const showEmpty = !isLoading && !showError && !showOffline && !hasNoResults && totalItems === 0;
  const showNoResults = !isLoading && !showError && !showOffline && hasNoResults;
  const showList = items.length > 0;

  const retryAction = (
    <Button
      variant="surface"
      size="small"
      onPress={onRetry}
      accessibilityLabel={t('common.retry')}
      accessibilityHint={t('common.retryHint')}
      icon={<Icon glyph="?" size="xs" decorative />}
    >
      {t('common.retry')}
    </Button>
  );

  const renderItem = ({ item, index }) => {
    const itemId = item?.id;
    const key = itemId || `scheduling-item-${index}`;
    const title = config.getItemTitle(item, t);
    const subtitle = config.getItemSubtitle(item, t);
    const resourceAction = resolveRowAction(item);

    return (
      <React.Fragment key={key}>
        <ListItem
          title={title}
          subtitle={subtitle}
          onPress={itemId ? () => onItemPress(itemId) : undefined}
          actions={(
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, alignItems: 'center' }}>
              {resourceAction ? (
                <Button
                  variant="surface"
                  size="small"
                  onPress={resourceAction.onPress}
                  disabled={resourceAction.disabled}
                  testID={`scheduling-resource-action-${resourceAction.key}-${key}`}
                >
                  {resourceAction.label}
                </Button>
              ) : null}
              {canEdit && onEdit && itemId ? (
                <Button
                  variant="surface"
                  size="small"
                  onPress={(event) => onEdit(itemId, event)}
                  testID={`scheduling-resource-edit-${key}`}
                >
                  {t('scheduling.common.list.edit')}
                </Button>
              ) : null}
              {canDelete && onDelete && itemId ? (
                <Button
                  variant="surface"
                  size="small"
                  onPress={(event) => onDelete(itemId, event)}
                  disabled={!canDelete}
                  accessibilityHint={!canDelete ? deleteBlockedReason : t(`${config.i18nKey}.list.deleteHint`)}
                  testID={`scheduling-resource-delete-${key}`}
                >
                  {t('common.remove')}
                </Button>
              ) : null}
              {onBulkDelete && itemId ? (
                <Checkbox
                  checked={selectedRecordIds.includes(itemId)}
                  onChange={() => onToggleRecordSelection(itemId)}
                  label={t('scheduling.common.list.selectRow', { name: title })}
                  testID={`scheduling-resource-select-${key}`}
                />
              ) : null}
            </View>
          )}
          accessibilityLabel={t(`${config.i18nKey}.list.itemLabel`, { name: title })}
          accessibilityHint={t(`${config.i18nKey}.list.itemHint`, { name: title })}
          testID={`scheduling-resource-item-${key}`}
        />
        {index < items.length - 1 ? <StyledSeparator /> : null}
      </React.Fragment>
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
          testID="scheduling-resource-list-notice"
        />
      ) : null}

      <StyledContent>
        <StyledToolbar>
          <View style={{ gap: 8 }}>
            <TextField
              value={search}
              onChangeText={onSearch}
              placeholder={t('scheduling.common.list.searchPlaceholder')}
              accessibilityLabel={t('scheduling.common.list.searchLabel')}
              density="compact"
              type="search"
              testID="scheduling-resource-list-search"
            />
            <Select
              value={searchScope}
              onValueChange={onSearchScopeChange}
              options={searchScopeOptions}
              label={t('scheduling.common.list.searchScopeLabel')}
              compact
              testID="scheduling-resource-list-search-scope"
            />
            {showReminderBoardFilters ? (
              <Select
                value={reminderBoardFilter}
                onValueChange={onReminderBoardFilterChange}
                options={reminderBoardFilterOptions}
                label={t('scheduling.resources.appointmentReminders.list.quickFilters')}
                compact
                testID="scheduling-resource-list-reminder-board"
              />
            ) : null}
            <Select
              value={filterLogic}
              onValueChange={onFilterLogicChange}
              options={filterLogicOptions}
              label={t('scheduling.common.list.filterLogicLabel')}
              compact
              testID="scheduling-resource-list-filter-logic"
            />

            {filters.map((filter, index) => (
              <View key={filter.id} style={{ gap: 8 }}>
                <Select
                  value={filter.field}
                  onValueChange={(value) => onFilterFieldChange(filter.id, value)}
                  options={filterFieldOptions}
                  label={t('scheduling.common.list.filterFieldLabel')}
                  compact
                  testID={`scheduling-resource-list-filter-field-${index}`}
                />
                <Select
                  value={filter.operator}
                  onValueChange={(value) => onFilterOperatorChange(filter.id, value)}
                  options={resolveFilterOperatorOptions(filter.field)}
                  label={t('scheduling.common.list.filterOperatorLabel')}
                  compact
                  testID={`scheduling-resource-list-filter-operator-${index}`}
                />
                <TextField
                  value={filter.value}
                  onChangeText={(value) => onFilterValueChange(filter.id, value)}
                  label={t('scheduling.common.list.filterValueLabel')}
                  placeholder={t('scheduling.common.list.filterValuePlaceholder')}
                  density="compact"
                  testID={`scheduling-resource-list-filter-value-${index}`}
                />
                <Button
                  variant="surface"
                  size="small"
                  onPress={() => onRemoveFilter(filter.id)}
                  testID={`scheduling-resource-list-filter-remove-${index}`}
                >
                  {t('common.remove')}
                </Button>
              </View>
            ))}

            <View style={{ flexDirection: 'row', gap: 8, flexWrap: 'wrap' }}>
              <Button
                variant="surface"
                size="small"
                onPress={onAddFilter}
                disabled={!canAddFilter}
                testID="scheduling-resource-list-filter-add"
              >
                {t('scheduling.common.list.addFilter')}
              </Button>
              <Button
                variant="surface"
                size="small"
                onPress={onClearSearchAndFilters}
                testID="scheduling-resource-list-filter-clear"
              >
                {t('scheduling.common.list.clearSearchAndFilters')}
              </Button>
            </View>
          </View>

          <StyledToolbarActions>
            <StyledAddButton
              onPress={onAdd}
              disabled={!canCreate}
              accessibilityLabel={t(`${config.i18nKey}.list.addLabel`)}
              accessibilityHint={!canCreate ? createBlockedReason : t(`${config.i18nKey}.list.addHint`)}
              testID="scheduling-resource-list-add"
            >
              <Icon glyph="+" size="xs" decorative />
              <StyledAddLabel>{t(`${config.i18nKey}.list.addLabel`)}</StyledAddLabel>
            </StyledAddButton>
          </StyledToolbarActions>
        </StyledToolbar>

        <Card
          variant="outlined"
          accessibilityLabel={t(`${config.i18nKey}.list.accessibilityLabel`)}
          testID="scheduling-resource-list-card"
        >
          <StyledListBody>
            <StyledStateStack>
              {showError ? (
                <ErrorState
                  size={ErrorStateSizes.SMALL}
                  title={t('listScaffold.errorState.title')}
                  description={errorMessage}
                  action={retryAction}
                  testID="scheduling-resource-list-error"
                />
              ) : null}

              {showOffline ? (
                <OfflineState
                  size={OfflineStateSizes.SMALL}
                  title={t('shell.banners.offline.title')}
                  description={t('shell.banners.offline.message')}
                  action={retryAction}
                  testID="scheduling-resource-list-offline"
                />
              ) : null}

              {showOfflineBanner ? (
                <OfflineState
                  size={OfflineStateSizes.SMALL}
                  title={t('shell.banners.offline.title')}
                  description={t('shell.banners.offline.message')}
                  action={retryAction}
                  testID="scheduling-resource-list-offline-banner"
                />
              ) : null}
            </StyledStateStack>

            {isLoading ? (
              <LoadingSpinner accessibilityLabel={t('common.loading')} testID="scheduling-resource-list-loading" />
            ) : null}

            {showEmpty ? (
              <EmptyState
                title={t(`${config.i18nKey}.list.emptyTitle`)}
                description={t(`${config.i18nKey}.list.emptyMessage`)}
                testID="scheduling-resource-list-empty"
              />
            ) : null}

            {showNoResults ? (
              <EmptyState
                title={t('scheduling.common.list.noResultsTitle')}
                description={t('scheduling.common.list.noResultsMessage')}
                action={(
                  <Button variant="surface" size="small" onPress={onClearSearchAndFilters}>
                    {t('scheduling.common.list.clearSearchAndFilters')}
                  </Button>
                )}
                testID="scheduling-resource-list-no-results"
              />
            ) : null}

            {showList ? (
              <StyledList>
                <FlatList
                  data={items}
                  keyExtractor={(item, index) => item?.id ?? `scheduling-item-${index}`}
                  renderItem={renderItem}
                  scrollEnabled={false}
                  accessibilityLabel={t(`${config.i18nKey}.list.accessibilityLabel`)}
                  testID="scheduling-resource-list-flatlist"
                />
              </StyledList>
            ) : null}

            {showList ? (
              <View style={{ gap: 8 }}>
                <Text>{t('scheduling.common.list.pageSummary', { page, totalPages, total: totalItems })}</Text>
                <View style={{ flexDirection: 'row', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
                  <Button variant="surface" size="small" onPress={() => onPageChange(page - 1)} disabled={page <= 1}>
                    {t('common.previous')}
                  </Button>
                  <Select
                    value={String(pageSize)}
                    onValueChange={onPageSizeChange}
                    options={pageSizeOptions}
                    label={t('scheduling.common.list.pageSizeLabel')}
                    compact
                    testID="scheduling-resource-list-page-size"
                  />
                  <Select
                    value={density}
                    onValueChange={onDensityChange}
                    options={densityOptions}
                    label={t('scheduling.common.list.densityLabel')}
                    compact
                    testID="scheduling-resource-list-density"
                  />
                  <Button variant="surface" size="small" onPress={() => onPageChange(page + 1)} disabled={page >= totalPages}>
                    {t('common.next')}
                  </Button>
                </View>
              </View>
            ) : null}

            {onBulkDelete && selectedRecordIds.length > 0 ? (
              <View style={{ gap: 8 }}>
                <Text>{t('scheduling.common.list.bulkSelectedCount', { count: selectedRecordIds.length })}</Text>
                <View style={{ flexDirection: 'row', gap: 8, flexWrap: 'wrap' }}>
                  <Button variant="surface" size="small" onPress={onClearSelection}>
                    {t('scheduling.common.list.clearSelection')}
                  </Button>
                  <Button variant="surface" size="small" onPress={onBulkDelete}>
                    {t('scheduling.common.list.bulkDelete')}
                  </Button>
                </View>
              </View>
            ) : null}
          </StyledListBody>
        </Card>
      </StyledContent>
    </StyledContainer>
  );
};

export default SchedulingResourceListScreenAndroid;