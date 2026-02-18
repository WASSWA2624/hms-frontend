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
  return t('unit.list.unnamed');
};

const resolveUnitTenant = (t, Unit) => {
  const value = humanizeIdentifier(
    Unit?.tenant_name
    ?? Unit?.tenant?.name
    ?? Unit?.tenant_label
  );
  if (value) return String(value).trim();
  return t('common.notAvailable');
};

const resolveUnitFacility = (t, Unit) => {
  const value = humanizeIdentifier(
    Unit?.facility_name
    ?? Unit?.facility?.name
    ?? Unit?.facility_label
  );
  if (value) return String(value).trim();
  return t('common.notAvailable');
};

const resolveUnitDepartment = (t, Unit) => {
  const value = humanizeIdentifier(
    Unit?.department_name
    ?? Unit?.department?.name
    ?? Unit?.department_label
  );
  if (value) return String(value).trim();
  return t('common.notAvailable');
};

const resolveUnitSubtitle = (t, Unit) => {
  const tenant = resolveUnitTenant(t, Unit);
  const facility = resolveUnitFacility(t, Unit);
  const department = resolveUnitDepartment(t, Unit);

  if (
    tenant !== t('common.notAvailable')
    && facility !== t('common.notAvailable')
    && department !== t('common.notAvailable')
  ) {
    return t('unit.list.contextValue', { tenant, facility, department });
  }
  if (facility !== t('common.notAvailable') && department !== t('common.notAvailable')) {
    return t('unit.list.facilityDepartmentValue', { facility, department });
  }
  if (tenant !== t('common.notAvailable') && facility !== t('common.notAvailable')) {
    return t('unit.list.tenantFacilityValue', { tenant, facility });
  }
  if (tenant !== t('common.notAvailable') && department !== t('common.notAvailable')) {
    return t('unit.list.tenantDepartmentValue', { tenant, department });
  }
  if (department !== t('common.notAvailable')) {
    return t('unit.list.departmentValue', { department });
  }
  if (facility !== t('common.notAvailable')) {
    return t('unit.list.facilityValue', { facility });
  }
  if (tenant !== t('common.notAvailable')) {
    return t('unit.list.tenantValue', { tenant });
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
      title={t('unit.list.emptyTitle')}
      description={t('unit.list.emptyMessage')}
      action={
        onAdd ? (
          <StyledAddButton
            onPress={onAdd}
            accessibilityRole="button"
            accessibilityLabel={t('unit.list.addLabel')}
            accessibilityHint={t('unit.list.addHint')}
            testID="unit-list-empty-add"
          >
            <Icon glyph="+" size="xs" decorative />
            <StyledAddLabel>{t('unit.list.addLabel')}</StyledAddLabel>
          </StyledAddButton>
        ) : undefined
      }
      testID="unit-list-empty-state"
    />
  );

  const retryAction = onRetry ? (
    <Button
      variant="primary"
      size="small"
      onPress={onRetry}
      accessibilityLabel={t('common.retry')}
      accessibilityHint={t('common.retryHint')}
      testID="unit-list-retry"
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
    const leadingGlyph = String(title || 'U').charAt(0).toUpperCase();
    const UnitId = Unit?.id;
    const itemKey = UnitId ?? `unit-${index}`;
    const statusLabel = Unit?.is_active
      ? t('unit.list.statusActive')
      : t('unit.list.statusInactive');
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
          accessibilityLabel: t('unit.list.statusLabel'),
        }}
        density="compact"
        onPress={UnitId ? () => onUnitPress(UnitId) : undefined}
        onView={UnitId ? () => onUnitPress(UnitId) : undefined}
        onEdit={onEdit && UnitId ? (event) => onEdit(UnitId, event) : undefined}
        onDelete={onDelete && UnitId ? (event) => onDelete(UnitId, event) : undefined}
        viewLabel={t('unit.list.view')}
        viewHint={t('unit.list.viewHint')}
        editLabel={t('unit.list.edit')}
        editHint={t('unit.list.editHint')}
        deleteLabel={t('common.remove')}
        deleteHint={t('unit.list.deleteHint')}
        onMore={UnitId ? () => onUnitPress(UnitId) : undefined}
        moreLabel={t('common.more')}
        moreHint={t('unit.list.viewHint')}
        viewTestID={`unit-view-${itemKey}`}
        editTestID={`unit-edit-${itemKey}`}
        deleteTestID={`unit-delete-${itemKey}`}
        moreTestID={`unit-more-${itemKey}`}
        accessibilityLabel={t('unit.list.itemLabel', { name: title })}
        accessibilityHint={t('unit.list.itemHint', { name: title })}
        testID={`unit-item-${itemKey}`}
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
          testID="unit-list-notice"
        />
      ) : null}
      <StyledContent>
        <StyledToolbar testID="unit-list-toolbar">
          <StyledSearchSlot>
            <TextField
              value={search}
              onChangeText={onSearch}
              placeholder={t('unit.list.searchPlaceholder')}
              accessibilityLabel={t('unit.list.searchLabel')}
              density="compact"
              type="search"
              testID="unit-list-search"
            />
          </StyledSearchSlot>
          <StyledScopeSlot>
            <Select
              value={searchScope}
              onValueChange={onSearchScopeChange}
              options={searchScopeOptions}
              label={t('unit.list.searchScopeLabel')}
              compact
              testID="unit-list-search-scope"
            />
          </StyledScopeSlot>
          <StyledToolbarActions>
            {onAdd && (
              <StyledAddButton
                onPress={onAdd}
                accessibilityRole="button"
                accessibilityLabel={t('unit.list.addLabel')}
                accessibilityHint={t('unit.list.addHint')}
                testID="unit-list-add"
              >
                <Icon glyph="+" size="xs" decorative />
                <StyledAddLabel>{t('unit.list.addLabel')}</StyledAddLabel>
              </StyledAddButton>
            )}
          </StyledToolbarActions>
        </StyledToolbar>
        <Card
          variant="outlined"
          accessibilityLabel={t('unit.list.accessibilityLabel')}
          testID="unit-list-card"
        >
          <StyledListBody>
            <StyledStateStack>
              {showError && (
                <ErrorState
                  size={ErrorStateSizes.SMALL}
                  title={t('listScaffold.errorState.title')}
                  description={errorMessage}
                  action={retryAction}
                  testID="unit-list-error"
                />
              )}
              {showOffline && (
                <OfflineState
                  size={OfflineStateSizes.SMALL}
                  title={t('shell.banners.offline.title')}
                  description={t('shell.banners.offline.message')}
                  action={retryAction}
                  testID="unit-list-offline"
                />
              )}
              {showOfflineBanner && (
                <OfflineState
                  size={OfflineStateSizes.SMALL}
                  title={t('shell.banners.offline.title')}
                  description={t('shell.banners.offline.message')}
                  action={retryAction}
                  testID="unit-list-offline-banner"
                />
              )}
            </StyledStateStack>
            {isLoading && (
              <LoadingSpinner accessibilityLabel={t('common.loading')} testID="unit-list-loading" />
            )}
            {showEmpty && emptyComponent}
            {showNoResults ? (
              <EmptyState
                title={t('unit.list.noResultsTitle')}
                description={t('unit.list.noResultsMessage')}
                action={(
                  <StyledAddButton
                    onPress={onClearSearchAndFilters}
                    accessibilityRole="button"
                    accessibilityLabel={t('unit.list.clearSearchAndFilters')}
                    testID="unit-list-clear-search"
                  >
                    <StyledAddLabel>{t('unit.list.clearSearchAndFilters')}</StyledAddLabel>
                  </StyledAddButton>
                )}
                testID="unit-list-no-results"
              />
            ) : null}
            {showList ? (
              <StyledList>
                <FlatList
                  data={items}
                  keyExtractor={(Unit, index) => Unit?.id ?? `unit-${index}`}
                  renderItem={renderItem}
                  scrollEnabled={false}
                  accessibilityLabel={t('unit.list.accessibilityLabel')}
                  testID="unit-list-flatlist"
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


