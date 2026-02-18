/**
 * BedListScreen - iOS
 * File: BedListScreen.ios.jsx
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
} from './BedListScreen.ios.styles';
import useBedListScreen from './useBedListScreen';

const resolveStatusMeta = (t, statusValue) => {
  if (statusValue === 'AVAILABLE') {
    return { label: t('bed.list.statusAvailable'), tone: 'success' };
  }
  if (statusValue === 'OCCUPIED') {
    return { label: t('bed.list.statusOccupied'), tone: 'warning' };
  }
  if (statusValue === 'RESERVED') {
    return { label: t('bed.list.statusReserved'), tone: 'info' };
  }
  if (statusValue === 'OUT_OF_SERVICE') {
    return { label: t('bed.list.statusOutOfService'), tone: 'error' };
  }
  return { label: t('common.notAvailable'), tone: 'warning' };
};

const resolveBedSubtitle = (t, tenant, facility, ward, room) => {
  const available = [tenant, facility, ward, room].filter((value) => (
    value && value !== t('common.notAvailable')
  ));
  if (available.length === 0) return undefined;
  if (available.length === 4) {
    return t('bed.list.contextValue', {
      tenant: available[0],
      facility: available[1],
      ward: available[2],
      room: available[3],
    });
  }
  if (available.length === 3) {
    return t('bed.list.partialContextValue', {
      tenant: available[0],
      facility: available[1],
      ward: available[2],
    });
  }
  if (available.length === 2) {
    return t('bed.list.shortContextValue', {
      first: available[0],
      second: available[1],
    });
  }
  if (available.length === 1) return available[0];
  return undefined;
};

const BedListScreenIOS = () => {
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
    resolveBedLabelText,
    resolveBedTenantText,
    resolveBedFacilityText,
    resolveBedWardText,
    resolveBedRoomText,
    resolveBedStatusText,
    onBedPress,
    onEdit,
    onDelete,
    onAdd,
  } = useBedListScreen();

  const emptyComponent = (
    <EmptyState
      title={t('bed.list.emptyTitle')}
      description={t('bed.list.emptyMessage')}
      action={
        onAdd ? (
          <StyledAddButton
            onPress={onAdd}
            accessibilityRole="button"
            accessibilityLabel={t('bed.list.addLabel')}
            accessibilityHint={t('bed.list.addHint')}
            testID="bed-list-empty-add"
          >
            <Icon glyph="+" size="xs" decorative />
            <StyledAddLabel>{t('bed.list.addLabel')}</StyledAddLabel>
          </StyledAddButton>
        ) : undefined
      }
      testID="bed-list-empty-state"
    />
  );

  const retryAction = onRetry ? (
    <Button
      variant="primary"
      size="small"
      onPress={onRetry}
      accessibilityLabel={t('common.retry')}
      accessibilityHint={t('common.retryHint')}
      testID="bed-list-retry"
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

  const renderItem = ({ item: bed, index }) => {
    const title = resolveBedLabelText(bed);
    const leadingGlyph = String(title || 'B').charAt(0).toUpperCase();
    const bedId = bed?.id;
    const itemKey = bedId ?? `bed-${index}`;
    const statusMeta = resolveStatusMeta(t, resolveBedStatusText(bed));
    const tenant = resolveBedTenantText(bed);
    const facility = resolveBedFacilityText(bed);
    const ward = resolveBedWardText(bed);
    const room = resolveBedRoomText(bed);

    return (
      <ListItem
        leading={{ glyph: leadingGlyph, tone: 'inverse', backgroundTone: 'primary' }}
        title={title}
        subtitle={resolveBedSubtitle(t, tenant, facility, ward, room)}
        metadata={[]}
        status={{
          label: statusMeta.label,
          tone: statusMeta.tone,
          showDot: true,
          accessibilityLabel: t('bed.list.statusLabel'),
        }}
        density="compact"
        onPress={bedId ? () => onBedPress(bedId) : undefined}
        onView={bedId ? () => onBedPress(bedId) : undefined}
        onEdit={onEdit && bedId ? (event) => onEdit(bedId, event) : undefined}
        onDelete={onDelete && bedId ? (event) => onDelete(bedId, event) : undefined}
        viewLabel={t('bed.list.view')}
        viewHint={t('bed.list.viewHint')}
        editLabel={t('bed.list.edit')}
        editHint={t('bed.list.editHint')}
        deleteLabel={t('common.remove')}
        deleteHint={t('bed.list.deleteHint')}
        onMore={bedId ? () => onBedPress(bedId) : undefined}
        moreLabel={t('common.more')}
        moreHint={t('bed.list.viewHint')}
        viewTestID={`bed-view-${itemKey}`}
        editTestID={`bed-edit-${itemKey}`}
        deleteTestID={`bed-delete-${itemKey}`}
        moreTestID={`bed-more-${itemKey}`}
        accessibilityLabel={t('bed.list.itemLabel', { name: title })}
        accessibilityHint={t('bed.list.itemHint', { name: title })}
        testID={`bed-item-${itemKey}`}
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
          testID="bed-list-notice"
        />
      ) : null}
      <StyledContent>
        <StyledToolbar testID="bed-list-toolbar">
          <StyledSearchSlot>
            <TextField
              value={search}
              onChangeText={onSearch}
              placeholder={t('bed.list.searchPlaceholder')}
              accessibilityLabel={t('bed.list.searchLabel')}
              density="compact"
              type="search"
              testID="bed-list-search"
            />
          </StyledSearchSlot>
          <StyledScopeSlot>
            <Select
              value={searchScope}
              onValueChange={onSearchScopeChange}
              options={searchScopeOptions}
              label={t('bed.list.searchScopeLabel')}
              compact
              testID="bed-list-search-scope"
            />
          </StyledScopeSlot>
          <StyledToolbarActions>
            {onAdd && (
              <StyledAddButton
                onPress={onAdd}
                accessibilityRole="button"
                accessibilityLabel={t('bed.list.addLabel')}
                accessibilityHint={t('bed.list.addHint')}
                testID="bed-list-add"
              >
                <Icon glyph="+" size="xs" decorative />
                <StyledAddLabel>{t('bed.list.addLabel')}</StyledAddLabel>
              </StyledAddButton>
            )}
          </StyledToolbarActions>
        </StyledToolbar>
        <Card
          variant="outlined"
          accessibilityLabel={t('bed.list.accessibilityLabel')}
          testID="bed-list-card"
        >
          <StyledListBody>
            <StyledStateStack>
              {showError && (
                <ErrorState
                  size={ErrorStateSizes.SMALL}
                  title={t('listScaffold.errorState.title')}
                  description={errorMessage}
                  action={retryAction}
                  testID="bed-list-error"
                />
              )}
              {showOffline && (
                <OfflineState
                  size={OfflineStateSizes.SMALL}
                  title={t('shell.banners.offline.title')}
                  description={t('shell.banners.offline.message')}
                  action={retryAction}
                  testID="bed-list-offline"
                />
              )}
              {showOfflineBanner && (
                <OfflineState
                  size={OfflineStateSizes.SMALL}
                  title={t('shell.banners.offline.title')}
                  description={t('shell.banners.offline.message')}
                  action={retryAction}
                  testID="bed-list-offline-banner"
                />
              )}
            </StyledStateStack>
            {isLoading && (
              <LoadingSpinner accessibilityLabel={t('common.loading')} testID="bed-list-loading" />
            )}
            {showEmpty && emptyComponent}
            {showNoResults ? (
              <EmptyState
                title={t('bed.list.noResultsTitle')}
                description={t('bed.list.noResultsMessage')}
                action={(
                  <StyledAddButton
                    onPress={onClearSearchAndFilters}
                    accessibilityRole="button"
                    accessibilityLabel={t('bed.list.clearSearchAndFilters')}
                    testID="bed-list-clear-search"
                  >
                    <StyledAddLabel>{t('bed.list.clearSearchAndFilters')}</StyledAddLabel>
                  </StyledAddButton>
                )}
                testID="bed-list-no-results"
              />
            ) : null}
            {showList ? (
              <StyledList>
                <FlatList
                  data={items}
                  keyExtractor={(Bed, index) => Bed?.id ?? `bed-${index}`}
                  renderItem={renderItem}
                  scrollEnabled={false}
                  accessibilityLabel={t('bed.list.accessibilityLabel')}
                  testID="bed-list-flatlist"
                />
              </StyledList>
            ) : null}
          </StyledListBody>
        </Card>
      </StyledContent>
    </StyledContainer>
  );
};

export default BedListScreenIOS;




