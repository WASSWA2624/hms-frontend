/**
 * AddressListScreen - Android
 * File: AddressListScreen.android.jsx
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
} from './AddressListScreen.android.styles';
import useAddressListScreen from './useAddressListScreen';

const resolveAddressTitle = (t, Address) => {
  const name = humanizeIdentifier(
    Address?.line1
    ?? Address?.name
  );
  if (name) return String(name).trim();
  return t('address.list.unnamed');
};

const resolveAddressTenant = (t, Address) => {
  const value = humanizeIdentifier(
    Address?.tenant_name
    ?? Address?.tenant?.name
    ?? Address?.tenant_label
  );
  if (value) return String(value).trim();
  return t('common.notAvailable');
};

const resolveAddressFacility = (t, Address) => {
  const value = humanizeIdentifier(
    Address?.facility_name
    ?? Address?.facility?.name
    ?? Address?.facility_label
  );
  if (value) return String(value).trim();
  return t('common.notAvailable');
};

const resolveAddressSubtitle = (t, Address) => {
  const tenant = resolveAddressTenant(t, Address);
  const facility = resolveAddressFacility(t, Address);

  if (tenant !== t('common.notAvailable') && facility !== t('common.notAvailable')) {
    return t('address.list.contextValue', { tenant, facility });
  }
  if (facility !== t('common.notAvailable')) {
    return t('address.list.facilityValue', { facility });
  }
  if (tenant !== t('common.notAvailable')) {
    return t('address.list.tenantValue', { tenant });
  }
  return undefined;
};

const AddressListScreenAndroid = () => {
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
    onAddressPress,
    onEdit,
    onDelete,
    onAdd,
  } = useAddressListScreen();

  const emptyComponent = (
    <EmptyState
      title={t('address.list.emptyTitle')}
      description={t('address.list.emptyMessage')}
      action={
        onAdd ? (
          <StyledAddButton
            onPress={onAdd}
            accessibilityRole="button"
            accessibilityLabel={t('address.list.addLabel')}
            accessibilityHint={t('address.list.addHint')}
            testID="address-list-empty-add"
          >
            <Icon glyph="+" size="xs" decorative />
            <StyledAddLabel>{t('address.list.addLabel')}</StyledAddLabel>
          </StyledAddButton>
        ) : undefined
      }
      testID="address-list-empty-state"
    />
  );

  const retryAction = onRetry ? (
    <Button
      variant="primary"
      size="small"
      onPress={onRetry}
      accessibilityLabel={t('common.retry')}
      accessibilityHint={t('common.retryHint')}
      testID="address-list-retry"
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

  const renderItem = ({ item: Address, index }) => {
    const title = resolveAddressTitle(t, Address);
    const leadingGlyph = String(title || 'B').charAt(0).toUpperCase();
    const AddressId = Address?.id;
    const itemKey = AddressId ?? `address-${index}`;
    const statusLabel = Address?.is_active
      ? t('address.list.statusActive')
      : t('address.list.statusInactive');
    const statusTone = Address?.is_active ? 'success' : 'warning';

    return (
      <ListItem
        leading={{ glyph: leadingGlyph, tone: 'inverse', backgroundTone: 'primary' }}
        title={title}
        subtitle={resolveAddressSubtitle(t, Address)}
        metadata={[]}
        status={{
          label: statusLabel,
          tone: statusTone,
          showDot: true,
          accessibilityLabel: t('address.list.statusLabel'),
        }}
        density="compact"
        onPress={AddressId ? () => onAddressPress(AddressId) : undefined}
        onView={AddressId ? () => onAddressPress(AddressId) : undefined}
        onEdit={onEdit && AddressId ? (event) => onEdit(AddressId, event) : undefined}
        onDelete={onDelete && AddressId ? (event) => onDelete(AddressId, event) : undefined}
        viewLabel={t('address.list.view')}
        viewHint={t('address.list.viewHint')}
        editLabel={t('address.list.edit')}
        editHint={t('address.list.editHint')}
        deleteLabel={t('common.remove')}
        deleteHint={t('address.list.deleteHint')}
        onMore={AddressId ? () => onAddressPress(AddressId) : undefined}
        moreLabel={t('common.more')}
        moreHint={t('address.list.viewHint')}
        viewTestID={`address-view-${itemKey}`}
        editTestID={`address-edit-${itemKey}`}
        deleteTestID={`address-delete-${itemKey}`}
        moreTestID={`address-more-${itemKey}`}
        accessibilityLabel={t('address.list.itemLabel', { name: title })}
        accessibilityHint={t('address.list.itemHint', { name: title })}
        testID={`address-item-${itemKey}`}
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
          testID="address-list-notice"
        />
      ) : null}
      <StyledContent>
        <StyledToolbar testID="address-list-toolbar">
          <StyledSearchSlot>
            <TextField
              value={search}
              onChangeText={onSearch}
              placeholder={t('address.list.searchPlaceholder')}
              accessibilityLabel={t('address.list.searchLabel')}
              density="compact"
              type="search"
              testID="address-list-search"
            />
          </StyledSearchSlot>
          <StyledScopeSlot>
            <Select
              value={searchScope}
              onValueChange={onSearchScopeChange}
              options={searchScopeOptions}
              label={t('address.list.searchScopeLabel')}
              compact
              testID="address-list-search-scope"
            />
          </StyledScopeSlot>
          <StyledToolbarActions>
            {onAdd && (
              <StyledAddButton
                onPress={onAdd}
                accessibilityRole="button"
                accessibilityLabel={t('address.list.addLabel')}
                accessibilityHint={t('address.list.addHint')}
                testID="address-list-add"
              >
                <Icon glyph="+" size="xs" decorative />
                <StyledAddLabel>{t('address.list.addLabel')}</StyledAddLabel>
              </StyledAddButton>
            )}
          </StyledToolbarActions>
        </StyledToolbar>
        <Card
          variant="outlined"
          accessibilityLabel={t('address.list.accessibilityLabel')}
          testID="address-list-card"
        >
          <StyledListBody>
            <StyledStateStack>
              {showError && (
                <ErrorState
                  size={ErrorStateSizes.SMALL}
                  title={t('listScaffold.errorState.title')}
                  description={errorMessage}
                  action={retryAction}
                  testID="address-list-error"
                />
              )}
              {showOffline && (
                <OfflineState
                  size={OfflineStateSizes.SMALL}
                  title={t('shell.banners.offline.title')}
                  description={t('shell.banners.offline.message')}
                  action={retryAction}
                  testID="address-list-offline"
                />
              )}
              {showOfflineBanner && (
                <OfflineState
                  size={OfflineStateSizes.SMALL}
                  title={t('shell.banners.offline.title')}
                  description={t('shell.banners.offline.message')}
                  action={retryAction}
                  testID="address-list-offline-banner"
                />
              )}
            </StyledStateStack>
            {isLoading && (
              <LoadingSpinner accessibilityLabel={t('common.loading')} testID="address-list-loading" />
            )}
            {showEmpty && emptyComponent}
            {showNoResults ? (
              <EmptyState
                title={t('address.list.noResultsTitle')}
                description={t('address.list.noResultsMessage')}
                action={(
                  <StyledAddButton
                    onPress={onClearSearchAndFilters}
                    accessibilityRole="button"
                    accessibilityLabel={t('address.list.clearSearchAndFilters')}
                    testID="address-list-clear-search"
                  >
                    <StyledAddLabel>{t('address.list.clearSearchAndFilters')}</StyledAddLabel>
                  </StyledAddButton>
                )}
                testID="address-list-no-results"
              />
            ) : null}
            {showList ? (
              <StyledList>
                <FlatList
                  data={items}
                  keyExtractor={(Address, index) => Address?.id ?? `address-${index}`}
                  renderItem={renderItem}
                  scrollEnabled={false}
                  accessibilityLabel={t('address.list.accessibilityLabel')}
                  testID="address-list-flatlist"
                />
              </StyledList>
            ) : null}
          </StyledListBody>
        </Card>
      </StyledContent>
    </StyledContainer>
  );
};

export default AddressListScreenAndroid;
