/**
 * RoomListScreen - iOS
 * File: RoomListScreen.ios.jsx
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
} from './RoomListScreen.ios.styles';
import useRoomListScreen from './useRoomListScreen';

const resolveFloorMeta = (t, floorValue) => {
  const normalized = String(floorValue ?? '').trim();
  if (normalized) {
    return { label: normalized, tone: 'info' };
  }
  return { label: t('common.notAvailable'), tone: 'warning' };
};

const resolveRoomSubtitle = (t, tenant, facility, ward) => {
  const available = [tenant, facility, ward].filter((value) => (
    value && value !== t('common.notAvailable')
  ));
  if (available.length === 0) return undefined;
  if (available.length === 3) {
    return t('room.list.contextValue', {
      tenant: available[0],
      facility: available[1],
      ward: available[2],
    });
  }
  if (available.length === 2) {
    return t('room.list.partialContextValue', {
      first: available[0],
      second: available[1],
    });
  }
  if (available.length === 1) return available[0];
  return undefined;
};

const RoomListScreenIOS = () => {
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
    resolveRoomNameText,
    resolveRoomTenantText,
    resolveRoomFacilityText,
    resolveRoomWardText,
    resolveRoomFloorText,
    onRoomPress,
    onEdit,
    onDelete,
    onAdd,
  } = useRoomListScreen();

  const emptyComponent = (
    <EmptyState
      title={t('room.list.emptyTitle')}
      description={t('room.list.emptyMessage')}
      action={
        onAdd ? (
          <StyledAddButton
            onPress={onAdd}
            accessibilityRole="button"
            accessibilityLabel={t('room.list.addLabel')}
            accessibilityHint={t('room.list.addHint')}
            testID="room-list-empty-add"
          >
            <Icon glyph="+" size="xs" decorative />
            <StyledAddLabel>{t('room.list.addLabel')}</StyledAddLabel>
          </StyledAddButton>
        ) : undefined
      }
      testID="room-list-empty-state"
    />
  );

  const retryAction = onRetry ? (
    <Button
      variant="primary"
      size="small"
      onPress={onRetry}
      accessibilityLabel={t('common.retry')}
      accessibilityHint={t('common.retryHint')}
      testID="room-list-retry"
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

  const renderItem = ({ item: room, index }) => {
    const title = resolveRoomNameText(room);
    const leadingGlyph = String(title || 'R').charAt(0).toUpperCase();
    const roomId = room?.id;
    const itemKey = roomId ?? `room-${index}`;
    const floorMeta = resolveFloorMeta(t, resolveRoomFloorText(room));
    const tenant = resolveRoomTenantText(room);
    const facility = resolveRoomFacilityText(room);
    const ward = resolveRoomWardText(room);

    return (
      <ListItem
        leading={{ glyph: leadingGlyph, tone: 'inverse', backgroundTone: 'primary' }}
        title={title}
        subtitle={resolveRoomSubtitle(t, tenant, facility, ward)}
        metadata={[]}
        status={{
          label: floorMeta.label,
          tone: floorMeta.tone,
          showDot: true,
          accessibilityLabel: t('room.list.floorLabel'),
        }}
        density="compact"
        onPress={roomId ? () => onRoomPress(roomId) : undefined}
        onView={roomId ? () => onRoomPress(roomId) : undefined}
        onEdit={onEdit && roomId ? (event) => onEdit(roomId, event) : undefined}
        onDelete={onDelete && roomId ? (event) => onDelete(roomId, event) : undefined}
        viewLabel={t('room.list.view')}
        viewHint={t('room.list.viewHint')}
        editLabel={t('room.list.edit')}
        editHint={t('room.list.editHint')}
        deleteLabel={t('common.remove')}
        deleteHint={t('room.list.deleteHint')}
        onMore={roomId ? () => onRoomPress(roomId) : undefined}
        moreLabel={t('common.more')}
        moreHint={t('room.list.viewHint')}
        viewTestID={`room-view-${itemKey}`}
        editTestID={`room-edit-${itemKey}`}
        deleteTestID={`room-delete-${itemKey}`}
        moreTestID={`room-more-${itemKey}`}
        accessibilityLabel={t('room.list.itemLabel', { name: title })}
        accessibilityHint={t('room.list.itemHint', { name: title })}
        testID={`room-item-${itemKey}`}
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
          testID="room-list-notice"
        />
      ) : null}
      <StyledContent>
        <StyledToolbar testID="room-list-toolbar">
          <StyledSearchSlot>
            <TextField
              value={search}
              onChangeText={onSearch}
              placeholder={t('room.list.searchPlaceholder')}
              accessibilityLabel={t('room.list.searchLabel')}
              density="compact"
              type="search"
              testID="room-list-search"
            />
          </StyledSearchSlot>
          <StyledScopeSlot>
            <Select
              value={searchScope}
              onValueChange={onSearchScopeChange}
              options={searchScopeOptions}
              label={t('room.list.searchScopeLabel')}
              compact
              testID="room-list-search-scope"
            />
          </StyledScopeSlot>
          <StyledToolbarActions>
            {onAdd && (
              <StyledAddButton
                onPress={onAdd}
                accessibilityRole="button"
                accessibilityLabel={t('room.list.addLabel')}
                accessibilityHint={t('room.list.addHint')}
                testID="room-list-add"
              >
                <Icon glyph="+" size="xs" decorative />
                <StyledAddLabel>{t('room.list.addLabel')}</StyledAddLabel>
              </StyledAddButton>
            )}
          </StyledToolbarActions>
        </StyledToolbar>
        <Card
          variant="outlined"
          accessibilityLabel={t('room.list.accessibilityLabel')}
          testID="room-list-card"
        >
          <StyledListBody>
            <StyledStateStack>
              {showError && (
                <ErrorState
                  size={ErrorStateSizes.SMALL}
                  title={t('listScaffold.errorState.title')}
                  description={errorMessage}
                  action={retryAction}
                  testID="room-list-error"
                />
              )}
              {showOffline && (
                <OfflineState
                  size={OfflineStateSizes.SMALL}
                  title={t('shell.banners.offline.title')}
                  description={t('shell.banners.offline.message')}
                  action={retryAction}
                  testID="room-list-offline"
                />
              )}
              {showOfflineBanner && (
                <OfflineState
                  size={OfflineStateSizes.SMALL}
                  title={t('shell.banners.offline.title')}
                  description={t('shell.banners.offline.message')}
                  action={retryAction}
                  testID="room-list-offline-banner"
                />
              )}
            </StyledStateStack>
            {isLoading && (
              <LoadingSpinner accessibilityLabel={t('common.loading')} testID="room-list-loading" />
            )}
            {showEmpty && emptyComponent}
            {showNoResults ? (
              <EmptyState
                title={t('room.list.noResultsTitle')}
                description={t('room.list.noResultsMessage')}
                action={(
                  <StyledAddButton
                    onPress={onClearSearchAndFilters}
                    accessibilityRole="button"
                    accessibilityLabel={t('room.list.clearSearchAndFilters')}
                    testID="room-list-clear-search"
                  >
                    <StyledAddLabel>{t('room.list.clearSearchAndFilters')}</StyledAddLabel>
                  </StyledAddButton>
                )}
                testID="room-list-no-results"
              />
            ) : null}
            {showList ? (
              <StyledList>
                <FlatList
                  data={items}
                  keyExtractor={(room, index) => room?.id ?? `room-${index}`}
                  renderItem={renderItem}
                  scrollEnabled={false}
                  accessibilityLabel={t('room.list.accessibilityLabel')}
                  testID="room-list-flatlist"
                />
              </StyledList>
            ) : null}
          </StyledListBody>
        </Card>
      </StyledContent>
    </StyledContainer>
  );
};

export default RoomListScreenIOS;

