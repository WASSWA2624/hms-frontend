/**
 * UnitListScreen - iOS
 * File: UnitListScreen.ios.jsx
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
  TextField,
} from '@platform/components';
import { useI18n } from '@hooks';
import { humanizeIdentifier } from '@utils';
import {
  StyledAddButton,
  StyledAddLabel,
  StyledContainer,
  StyledContent,
  StyledList,
  StyledListBody,
  StyledScopeSlot,
  StyledSearchSlot,
  StyledStateStack,
  StyledToolbar,
  StyledToolbarActions,
} from './UnitListScreen.ios.styles';
import useUnitListScreen from './useUnitListScreen';

const resolveUnitTitle = (t, Unit) => {
  const name = humanizeIdentifier(Unit?.name);
  if (name) return String(name).trim();
  return t('Unit.list.unnamed');
};

const resolveUnitTenant = (t, Unit) => {
  const value = humanizeIdentifier(
    Unit?.tenant_name
    ?? Unit?.tenant?.name
    ?? Unit?.tenant_label
    ?? Unit?.tenant_id
  );
  if (value) return String(value).trim();
  return t('common.notAvailable');
};

const resolveUnitFacility = (t, Unit) => {
  const value = humanizeIdentifier(
    Unit?.facility_name
    ?? Unit?.facility?.name
    ?? Unit?.facility_label
    ?? Unit?.facility_id
  );
  if (value) return String(value).trim();
  return t('common.notAvailable');
};

const resolveUnitSubtitle = (t, Unit) => {
  const tenant = resolveUnitTenant(t, Unit);
  const facility = resolveUnitFacility(t, Unit);

  if (tenant !== t('common.notAvailable') && facility !== t('common.notAvailable')) {
    return t('Unit.list.contextValue', { tenant, facility });
  }
  if (facility !== t('common.notAvailable')) {
    return t('Unit.list.facilityValue', { facility });
  }
  if (tenant !== t('common.notAvailable')) {
    return t('Unit.list.tenantValue', { tenant });
  }
  return undefined;
};

const UnitListScreenIOS = () => {
  const { t } = useI18n();
  const {
    items,
    search,
    searchScope,
    searchScopeOptions,
    isLoading,
    hasError,
    errorMessage,
    isOffline,
    hasNoResults,
    noticeMessage,
    onDismissNotice,
    onRetry,
    onSearch,
    onSearchScopeChange,
    onClearSearchAndFilters,
    onUnitPress,
    onEdit,
    onDelete,
    onAdd,
  } = useUnitListScreen();

  const emptyComponent = (
    <EmptyState
      title={t('Unit.list.emptyTitle')}
      description={t('Unit.list.emptyMessage')}
      action={
        onAdd ? (
          <StyledAddButton
            onPress={onAdd}
            accessibilityRole="button"
            accessibilityLabel={t('Unit.list.addLabel')}
            accessibilityHint={t('Unit.list.addHint')}
            testID="Unit-list-empty-add"
          >
            <Icon glyph="+" size="xs" decorative />
            <StyledAddLabel>{t('Unit.list.addLabel')}</StyledAddLabel>
          </StyledAddButton>
        ) : undefined
      }
      testID="Unit-list-empty-state"
    />
  );

  const retryAction = onRetry ? (
    <Button
      variant="primary"
      size="small"
      onPress={onRetry}
      accessibilityLabel={t('common.retry')}
      accessibilityHint={t('common.retryHint')}
      testID="Unit-list-retry"
    >
      {t('common.retry')}
    </Button>
  ) : undefined;
  const showError = !isLoading && hasError && !isOffline;
  const showOffline = !isLoading && isOffline && items.length === 0;
  const showOfflineBanner = !isLoading && isOffline && items.length > 0;
  const showEmpty = !isLoading && !showError && !showOffline && !hasNoResults && items.length === 0;
  const showNoResults = !isLoading && !showError && !showOffline && hasNoResults;
  const showList = items.length > 0;

  const renderItem = ({ item: Unit, index }) => {
    const title = resolveUnitTitle(t, Unit);
    const leadingGlyph = String(title || 'B').charAt(0).toUpperCase();
    const UnitId = Unit?.id;
    const itemKey = UnitId ?? `Unit-${index}`;
    const statusLabel = Unit?.is_active
      ? t('Unit.list.statusActive')
      : t('Unit.list.statusInactive');
    const statusTone = Unit?.is_active ? 'success' : 'warning';

    return (
      <ListItem
        leading={{ glyph: leadingGlyph, tone: 'inverse', backgroundTone: 'primary' }}
        title={title}
        subtitle={resolveUnitSubtitle(t, Unit)}
        metadata={[]}
        status={{
          label: statusLabel,
          tone: statusTone,
          showDot: true,
          accessibilityLabel: t('Unit.list.statusLabel'),
        }}
        density="compact"
        onPress={UnitId ? () => onUnitPress(UnitId) : undefined}
        onView={UnitId ? () => onUnitPress(UnitId) : undefined}
        onEdit={onEdit && UnitId ? (event) => onEdit(UnitId, event) : undefined}
        onDelete={onDelete && UnitId ? (event) => onDelete(UnitId, event) : undefined}
        viewLabel={t('Unit.list.view')}
        viewHint={t('Unit.list.viewHint')}
        editLabel={t('Unit.list.edit')}
        editHint={t('Unit.list.editHint')}
        deleteLabel={t('common.remove')}
        deleteHint={t('Unit.list.deleteHint')}
        onMore={UnitId ? () => onUnitPress(UnitId) : undefined}
        moreLabel={t('common.more')}
        moreHint={t('Unit.list.viewHint')}
        viewTestID={`Unit-view-${itemKey}`}
        editTestID={`Unit-edit-${itemKey}`}
        deleteTestID={`Unit-delete-${itemKey}`}
        moreTestID={`Unit-more-${itemKey}`}
        accessibilityLabel={t('Unit.list.itemLabel', { name: title })}
        accessibilityHint={t('Unit.list.itemHint', { name: title })}
        testID={`Unit-item-${itemKey}`}
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
          testID="Unit-list-notice"
        />
      ) : null}
      <StyledContent>
        <StyledToolbar testID="Unit-list-toolbar">
          <StyledSearchSlot>
            <TextField
              value={search}
              onChangeText={onSearch}
              placeholder={t('Unit.list.searchPlaceholder')}
              accessibilityLabel={t('Unit.list.searchLabel')}
              density="compact"
              type="search"
              testID="Unit-list-search"
            />
          </StyledSearchSlot>
          <StyledScopeSlot>
            <Select
              value={searchScope}
              onValueChange={onSearchScopeChange}
              options={searchScopeOptions}
              label={t('Unit.list.searchScopeLabel')}
              compact
              testID="Unit-list-search-scope"
            />
          </StyledScopeSlot>
          <StyledToolbarActions>
            {onAdd && (
              <StyledAddButton
                onPress={onAdd}
                accessibilityRole="button"
                accessibilityLabel={t('Unit.list.addLabel')}
                accessibilityHint={t('Unit.list.addHint')}
                testID="Unit-list-add"
              >
                <Icon glyph="+" size="xs" decorative />
                <StyledAddLabel>{t('Unit.list.addLabel')}</StyledAddLabel>
              </StyledAddButton>
            )}
          </StyledToolbarActions>
        </StyledToolbar>
        <Card
          variant="outlined"
          accessibilityLabel={t('Unit.list.accessibilityLabel')}
          testID="Unit-list-card"
        >
          <StyledListBody>
            <StyledStateStack>
              {showError && (
                <ErrorState
                  size={ErrorStateSizes.SMALL}
                  title={t('listScaffold.errorState.title')}
                  description={errorMessage}
                  action={retryAction}
                  testID="Unit-list-error"
                />
              )}
              {showOffline && (
                <OfflineState
                  size={OfflineStateSizes.SMALL}
                  title={t('shell.banners.offline.title')}
                  description={t('shell.banners.offline.message')}
                  action={retryAction}
                  testID="Unit-list-offline"
                />
              )}
              {showOfflineBanner && (
                <OfflineState
                  size={OfflineStateSizes.SMALL}
                  title={t('shell.banners.offline.title')}
                  description={t('shell.banners.offline.message')}
                  action={retryAction}
                  testID="Unit-list-offline-banner"
                />
              )}
            </StyledStateStack>
            {isLoading && (
              <LoadingSpinner accessibilityLabel={t('common.loading')} testID="Unit-list-loading" />
            )}
            {showEmpty && emptyComponent}
            {showNoResults ? (
              <EmptyState
                title={t('Unit.list.noResultsTitle')}
                description={t('Unit.list.noResultsMessage')}
                action={(
                  <StyledAddButton
                    onPress={onClearSearchAndFilters}
                    accessibilityRole="button"
                    accessibilityLabel={t('Unit.list.clearSearchAndFilters')}
                    testID="Unit-list-clear-search"
                  >
                    <StyledAddLabel>{t('Unit.list.clearSearchAndFilters')}</StyledAddLabel>
                  </StyledAddButton>
                )}
                testID="Unit-list-no-results"
              />
            ) : null}
            {showList ? (
              <StyledList>
                <FlatList
                  data={items}
                  keyExtractor={(Unit, index) => Unit?.id ?? `Unit-${index}`}
                  renderItem={renderItem}
                  scrollEnabled={false}
                  accessibilityLabel={t('Unit.list.accessibilityLabel')}
                  testID="Unit-list-flatlist"
                />
              </StyledList>
            ) : null}
          </StyledListBody>
        </Card>
      </StyledContent>
    </StyledContainer>
  );
};

export default UnitListScreenIOS;


