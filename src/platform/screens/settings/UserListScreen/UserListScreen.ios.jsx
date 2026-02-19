/**
 * UserListScreen - iOS
 * File: UserListScreen.ios.jsx
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
  StyledPagination,
  StyledPaginationActions,
  StyledPaginationControl,
  StyledPaginationControlLabel,
  StyledPaginationInfo,
  StyledPaginationNavButton,
  StyledPaginationNavLabel,
  StyledPaginationSelectSlot,
  StyledScopeSlot,
  StyledSearchSlot,
  StyledStateStack,
  StyledToolbar,
  StyledToolbarActions,
} from './UserListScreen.ios.styles';
import useUserListScreen from './useUserListScreen';

const resolveUserId = (userItem) => String(userItem?.id ?? userItem?.user_id ?? '').trim();

const resolveUserEmail = (userItem) => String(userItem?.email ?? '').trim();

const resolveUserPhone = (userItem) => String(userItem?.phone ?? '').trim();

const resolveUserStatusValue = (userItem) => String(userItem?.status ?? '').trim().toUpperCase();

const resolveUserStatusLabel = (t, userItem) => {
  const status = resolveUserStatusValue(userItem);
  if (!status) return t('common.notAvailable');
  const key = `user.status.${status}`;
  const resolved = t(key);
  return resolved === key ? status : resolved;
};

const resolveUserTitle = (t, userItem) => {
  const email = resolveUserEmail(userItem);
  if (email) return email;
  const phone = resolveUserPhone(userItem);
  if (phone) return phone;
  return t('user.list.unnamed');
};

const resolveUserTenant = (t, userItem, canViewTechnicalIds = false) => {
  const value = humanizeIdentifier(
    userItem?.tenant_name
    ?? userItem?.tenant?.name
    ?? userItem?.tenant_label
  );
  if (value) return String(value).trim();
  if (canViewTechnicalIds) {
    const tenantId = String(userItem?.tenant_id ?? '').trim();
    if (tenantId) return tenantId;
  }
  if (String(userItem?.tenant_id ?? '').trim()) {
    return t('user.list.currentTenant');
  }
  return t('common.notAvailable');
};

const resolveUserFacility = (t, userItem, canViewTechnicalIds = false) => {
  const value = humanizeIdentifier(
    userItem?.facility_name
    ?? userItem?.facility?.name
    ?? userItem?.facility_label
  );
  if (value) return String(value).trim();
  if (canViewTechnicalIds) {
    const facilityId = String(userItem?.facility_id ?? '').trim();
    if (facilityId) return facilityId;
  }
  if (String(userItem?.facility_id ?? '').trim()) {
    return t('user.list.currentFacility');
  }
  return t('common.notAvailable');
};

const resolveUserSubtitle = (t, userItem, canViewTechnicalIds = false) => {
  const tenant = resolveUserTenant(t, userItem, canViewTechnicalIds);
  const facility = resolveUserFacility(t, userItem, canViewTechnicalIds);

  if (tenant !== t('common.notAvailable') && facility !== t('common.notAvailable')) {
    return t('user.list.contextValue', { tenant, facility });
  }
  if (tenant !== t('common.notAvailable')) {
    return t('user.list.tenantValue', { tenant });
  }
  if (facility !== t('common.notAvailable')) {
    return t('user.list.facilityValue', { facility });
  }
  return undefined;
};

const UserListScreenIOS = () => {
  const { t } = useI18n();
  const {
    items,
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
    isLoading,
    hasError,
    errorMessage,
    isOffline,
    hasNoResults,
    canViewTechnicalIds,
    noticeMessage,
    onDismissNotice,
    onRetry,
    onSearch,
    onSearchScopeChange,
    onClearSearchAndFilters,
    onPageChange,
    onPageSizeChange,
    onDensityChange,
    onUserPress,
    onEdit,
    onDelete,
    onAdd,
  } = useUserListScreen();

  const rows = Array.isArray(pagedItems) ? pagedItems : items;
  const resolvedTotalItems = Number.isFinite(Number(totalItems))
    ? Number(totalItems)
    : rows.length;
  const resolvedTotalPages = Number.isFinite(Number(totalPages))
    ? Number(totalPages)
    : Math.max(1, Math.ceil((resolvedTotalItems || 1) / Math.max(1, Number(pageSize) || 1)));

  const emptyComponent = (
    <EmptyState
      title={t('user.list.emptyTitle')}
      description={t('user.list.emptyMessage')}
      action={
        onAdd ? (
          <StyledAddButton
            onPress={onAdd}
            accessibilityRole="button"
            accessibilityLabel={t('user.list.addLabel')}
            accessibilityHint={t('user.list.addHint')}
            testID="user-list-empty-add"
          >
            <Icon glyph="+" size="xs" decorative />
            <StyledAddLabel>{t('user.list.addLabel')}</StyledAddLabel>
          </StyledAddButton>
        ) : undefined
      }
      testID="user-list-empty-state"
    />
  );

  const retryAction = onRetry ? (
    <Button
      variant="primary"
      size="small"
      onPress={onRetry}
      accessibilityLabel={t('common.retry')}
      accessibilityHint={t('common.retryHint')}
      testID="user-list-retry"
    >
      {t('common.retry')}
    </Button>
  ) : undefined;
  const showError = !isLoading && hasError && !isOffline;
  const showOffline = !isLoading && isOffline && rows.length === 0;
  const showOfflineBanner = !isLoading && isOffline && rows.length > 0;
  const showEmpty = !isLoading && !showError && !showOffline && !hasNoResults && resolvedTotalItems === 0;
  const showNoResults = !isLoading && !showError && !showOffline && hasNoResults;
  const showList = rows.length > 0;

  const renderItem = ({ item: userItem, index }) => {
    const title = resolveUserTitle(t, userItem);
    const leadingGlyph = String(title || 'B').charAt(0).toUpperCase();
    const userId = resolveUserId(userItem);
    const itemKey = userId ?? `user-${index}`;
    const status = resolveUserStatusValue(userItem);
    const statusLabel = resolveUserStatusLabel(t, userItem);
    const statusTone = status === 'ACTIVE' ? 'success' : 'warning';

    return (
      <ListItem
        leading={{ glyph: leadingGlyph, tone: 'inverse', backgroundTone: 'primary' }}
        title={title}
        subtitle={resolveUserSubtitle(t, userItem, canViewTechnicalIds)}
        metadata={[]}
        status={{
          label: statusLabel,
          tone: statusTone,
          showDot: true,
          accessibilityLabel: t('user.list.statusLabel'),
        }}
        density="compact"
        onPress={userId ? () => onUserPress(userId) : undefined}
        onView={userId ? () => onUserPress(userId) : undefined}
        onEdit={onEdit && userId ? (event) => onEdit(userId, event) : undefined}
        onDelete={onDelete && userId ? (event) => onDelete(userId, event) : undefined}
        viewLabel={t('user.list.view')}
        viewHint={t('user.list.viewHint')}
        editLabel={t('user.list.edit')}
        editHint={t('user.list.editHint')}
        deleteLabel={t('common.remove')}
        deleteHint={t('user.list.deleteHint')}
        onMore={userId ? () => onUserPress(userId) : undefined}
        moreLabel={t('common.more')}
        moreHint={t('user.list.viewHint')}
        viewTestID={`user-view-${itemKey}`}
        editTestID={`user-edit-${itemKey}`}
        deleteTestID={`user-delete-${itemKey}`}
        moreTestID={`user-more-${itemKey}`}
        accessibilityLabel={t('user.list.itemLabel', { name: title })}
        accessibilityHint={t('user.list.itemHint', { name: title })}
        testID={`user-item-${itemKey}`}
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
          testID="user-list-notice"
        />
      ) : null}
      <StyledContent>
        <StyledToolbar testID="user-list-toolbar">
          <StyledSearchSlot>
            <TextField
              value={search}
              onChangeText={onSearch}
              placeholder={t('user.list.searchPlaceholder')}
              accessibilityLabel={t('user.list.searchLabel')}
              density="compact"
              type="search"
              testID="user-list-search"
            />
          </StyledSearchSlot>
          <StyledScopeSlot>
            <Select
              value={searchScope}
              onValueChange={onSearchScopeChange}
              options={searchScopeOptions}
              label={t('user.list.searchScopeLabel')}
              compact
              testID="user-list-search-scope"
            />
          </StyledScopeSlot>
          <StyledToolbarActions>
            {onAdd && (
              <StyledAddButton
                onPress={onAdd}
                accessibilityRole="button"
                accessibilityLabel={t('user.list.addLabel')}
                accessibilityHint={t('user.list.addHint')}
                testID="user-list-add"
              >
                <Icon glyph="+" size="xs" decorative />
                <StyledAddLabel>{t('user.list.addLabel')}</StyledAddLabel>
              </StyledAddButton>
            )}
          </StyledToolbarActions>
        </StyledToolbar>
        <Card
          variant="outlined"
          accessibilityLabel={t('user.list.accessibilityLabel')}
          testID="user-list-card"
        >
          <StyledListBody>
            <StyledStateStack>
              {showError && (
                <ErrorState
                  size={ErrorStateSizes.SMALL}
                  title={t('listScaffold.errorState.title')}
                  description={errorMessage}
                  action={retryAction}
                  testID="user-list-error"
                />
              )}
              {showOffline && (
                <OfflineState
                  size={OfflineStateSizes.SMALL}
                  title={t('shell.banners.offline.title')}
                  description={t('shell.banners.offline.message')}
                  action={retryAction}
                  testID="user-list-offline"
                />
              )}
              {showOfflineBanner && (
                <OfflineState
                  size={OfflineStateSizes.SMALL}
                  title={t('shell.banners.offline.title')}
                  description={t('shell.banners.offline.message')}
                  action={retryAction}
                  testID="user-list-offline-banner"
                />
              )}
            </StyledStateStack>
            {isLoading && (
              <LoadingSpinner accessibilityLabel={t('common.loading')} testID="user-list-loading" />
            )}
            {showEmpty && emptyComponent}
            {showNoResults ? (
              <EmptyState
                title={t('user.list.noResultsTitle')}
                description={t('user.list.noResultsMessage')}
                action={(
                  <StyledAddButton
                    onPress={onClearSearchAndFilters}
                    accessibilityRole="button"
                    accessibilityLabel={t('user.list.clearSearchAndFilters')}
                    testID="user-list-clear-search"
                  >
                    <StyledAddLabel>{t('user.list.clearSearchAndFilters')}</StyledAddLabel>
                  </StyledAddButton>
                )}
                testID="user-list-no-results"
              />
            ) : null}
            {showList ? (
              <StyledList>
                <FlatList
                  data={rows}
                  keyExtractor={(userItem, index) => resolveUserId(userItem) || `user-${index}`}
                  renderItem={renderItem}
                  scrollEnabled={false}
                  accessibilityLabel={t('user.list.accessibilityLabel')}
                  testID="user-list-flatlist"
                />
              </StyledList>
            ) : null}

            {showList ? (
              <StyledPagination>
                <StyledPaginationInfo>
                  {t('user.list.pageSummary', {
                    page,
                    totalPages: resolvedTotalPages,
                    total: resolvedTotalItems,
                  })}
                </StyledPaginationInfo>

                <StyledPaginationActions>
                  <StyledPaginationNavButton
                    onPress={() => onPageChange(page - 1)}
                    disabled={page <= 1}
                    accessibilityRole="button"
                    accessibilityLabel={t('common.previous')}
                    testID="user-page-prev"
                  >
                    <StyledPaginationNavLabel>{'<'}</StyledPaginationNavLabel>
                  </StyledPaginationNavButton>

                  <StyledPaginationControl>
                    <StyledPaginationControlLabel>
                      {t('user.list.pageSizeLabel')}
                    </StyledPaginationControlLabel>
                    <StyledPaginationSelectSlot>
                      <Select
                        value={String(pageSize)}
                        onValueChange={onPageSizeChange}
                        options={pageSizeOptions}
                        accessibilityLabel={t('user.list.pageSizeLabel')}
                        compact
                        testID="user-page-size"
                      />
                    </StyledPaginationSelectSlot>
                  </StyledPaginationControl>

                  <StyledPaginationControl>
                    <StyledPaginationControlLabel>
                      {t('user.list.densityLabel')}
                    </StyledPaginationControlLabel>
                    <StyledPaginationSelectSlot>
                      <Select
                        value={density}
                        onValueChange={onDensityChange}
                        options={densityOptions}
                        accessibilityLabel={t('user.list.densityLabel')}
                        compact
                        testID="user-density"
                      />
                    </StyledPaginationSelectSlot>
                  </StyledPaginationControl>

                  <StyledPaginationNavButton
                    onPress={() => onPageChange(page + 1)}
                    disabled={page >= resolvedTotalPages}
                    accessibilityRole="button"
                    accessibilityLabel={t('common.next')}
                    testID="user-page-next"
                  >
                    <StyledPaginationNavLabel>{'>'}</StyledPaginationNavLabel>
                  </StyledPaginationNavButton>
                </StyledPaginationActions>
              </StyledPagination>
            ) : null}
          </StyledListBody>
        </Card>
      </StyledContent>
    </StyledContainer>
  );
};

export default UserListScreenIOS;


