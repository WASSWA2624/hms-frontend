/**
 * UserProfileListScreen - Android
 * File: UserProfileListScreen.android.jsx
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
} from './UserProfileListScreen.android.styles';
import useUserProfileListScreen from './useUserProfileListScreen';

const resolveProfileId = (profileItem) => String(profileItem?.id ?? profileItem?.user_profile_id ?? '').trim();

const UserProfileListScreenAndroid = () => {
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
    noticeMessage,
    onDismissNotice,
    onRetry,
    onSearch,
    onSearchScopeChange,
    onClearSearchAndFilters,
    onPageChange,
    onPageSizeChange,
    onDensityChange,
    onProfilePress,
    onEdit,
    onDelete,
    onAdd,
    resolveProfileDisplayName,
    resolveProfileUserDisplay,
    resolveProfileFacilityDisplay,
    resolveProfileGenderDisplay,
    resolveProfileDobDisplay,
  } = useUserProfileListScreen();

  const rows = Array.isArray(pagedItems) ? pagedItems : items;
  const resolvedTotalItems = Number.isFinite(Number(totalItems))
    ? Number(totalItems)
    : rows.length;
  const resolvedTotalPages = Number.isFinite(Number(totalPages))
    ? Number(totalPages)
    : Math.max(1, Math.ceil((resolvedTotalItems || 1) / Math.max(1, Number(pageSize) || 1)));

  const emptyComponent = (
    <EmptyState
      title={t('userProfile.list.emptyTitle')}
      description={t('userProfile.list.emptyMessage')}
      action={
        onAdd ? (
          <StyledAddButton
            onPress={onAdd}
            accessibilityRole="button"
            accessibilityLabel={t('userProfile.list.addLabel')}
            accessibilityHint={t('userProfile.list.addHint')}
            testID="user-profile-list-empty-add"
          >
            <Icon glyph="+" size="xs" decorative />
            <StyledAddLabel>{t('userProfile.list.addLabel')}</StyledAddLabel>
          </StyledAddButton>
        ) : undefined
      }
      testID="user-profile-list-empty-state"
    />
  );

  const retryAction = onRetry ? (
    <Button
      variant="primary"
      size="small"
      onPress={onRetry}
      accessibilityLabel={t('common.retry')}
      accessibilityHint={t('common.retryHint')}
      testID="user-profile-list-retry"
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

  const renderItem = ({ item: profileItem, index }) => {
    const profileId = resolveProfileId(profileItem);
    const itemKey = profileId || `user-profile-${index}`;
    const title = resolveProfileDisplayName(profileItem);
    const leadingGlyph = String(title || 'P').charAt(0).toUpperCase();
    const userLabel = resolveProfileUserDisplay(profileItem);
    const facilityLabel = resolveProfileFacilityDisplay(profileItem);
    const genderLabel = resolveProfileGenderDisplay(profileItem);
    const dobLabel = resolveProfileDobDisplay(profileItem);
    const subtitle = [userLabel, facilityLabel]
      .filter((value) => value && value !== t('common.notAvailable'))
      .join(' | ');
    const metadata = [
      genderLabel ? { label: t('userProfile.list.genderLabel'), value: genderLabel } : null,
      dobLabel && dobLabel !== t('common.notAvailable')
        ? { label: t('userProfile.list.dobLabel'), value: dobLabel }
        : null,
    ].filter(Boolean);

    return (
      <ListItem
        leading={{ glyph: leadingGlyph, tone: 'inverse', backgroundTone: 'primary' }}
        title={title}
        subtitle={subtitle || undefined}
        metadata={metadata}
        density="compact"
        onPress={profileId ? () => onProfilePress(profileId) : undefined}
        onView={profileId ? () => onProfilePress(profileId) : undefined}
        onEdit={onEdit && profileId ? (event) => onEdit(profileId, event) : undefined}
        onDelete={onDelete && profileId ? (event) => onDelete(profileId, event) : undefined}
        viewLabel={t('userProfile.list.view')}
        viewHint={t('userProfile.list.viewHint')}
        editLabel={t('userProfile.list.edit')}
        editHint={t('userProfile.list.editHint')}
        deleteLabel={t('common.remove')}
        deleteHint={t('userProfile.list.deleteHint')}
        onMore={profileId ? () => onProfilePress(profileId) : undefined}
        moreLabel={t('common.more')}
        moreHint={t('userProfile.list.viewHint')}
        viewTestID={`user-profile-view-${itemKey}`}
        editTestID={`user-profile-edit-${itemKey}`}
        deleteTestID={`user-profile-delete-${itemKey}`}
        moreTestID={`user-profile-more-${itemKey}`}
        accessibilityLabel={t('userProfile.list.itemLabel', { name: title })}
        accessibilityHint={t('userProfile.list.itemHint', { name: title })}
        testID={`user-profile-item-${itemKey}`}
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
          testID="user-profile-list-notice"
        />
      ) : null}
      <StyledContent>
        <StyledToolbar testID="user-profile-list-toolbar">
          <StyledSearchSlot>
            <TextField
              value={search}
              onChangeText={onSearch}
              placeholder={t('userProfile.list.searchPlaceholder')}
              accessibilityLabel={t('userProfile.list.searchLabel')}
              density="compact"
              type="search"
              testID="user-profile-list-search"
            />
          </StyledSearchSlot>
          <StyledScopeSlot>
            <Select
              value={searchScope}
              onValueChange={onSearchScopeChange}
              options={searchScopeOptions}
              label={t('userProfile.list.searchScopeLabel')}
              compact
              testID="user-profile-list-search-scope"
            />
          </StyledScopeSlot>
          <StyledToolbarActions>
            {onAdd && (
              <StyledAddButton
                onPress={onAdd}
                accessibilityRole="button"
                accessibilityLabel={t('userProfile.list.addLabel')}
                accessibilityHint={t('userProfile.list.addHint')}
                testID="user-profile-list-add"
              >
                <Icon glyph="+" size="xs" decorative />
                <StyledAddLabel>{t('userProfile.list.addLabel')}</StyledAddLabel>
              </StyledAddButton>
            )}
          </StyledToolbarActions>
        </StyledToolbar>
        <Card
          variant="outlined"
          accessibilityLabel={t('userProfile.list.accessibilityLabel')}
          testID="user-profile-list-card"
        >
          <StyledListBody>
            <StyledStateStack>
              {showError && (
                <ErrorState
                  size={ErrorStateSizes.SMALL}
                  title={t('listScaffold.errorState.title')}
                  description={errorMessage}
                  action={retryAction}
                  testID="user-profile-list-error"
                />
              )}
              {showOffline && (
                <OfflineState
                  size={OfflineStateSizes.SMALL}
                  title={t('shell.banners.offline.title')}
                  description={t('shell.banners.offline.message')}
                  action={retryAction}
                  testID="user-profile-list-offline"
                />
              )}
              {showOfflineBanner && (
                <OfflineState
                  size={OfflineStateSizes.SMALL}
                  title={t('shell.banners.offline.title')}
                  description={t('shell.banners.offline.message')}
                  action={retryAction}
                  testID="user-profile-list-offline-banner"
                />
              )}
            </StyledStateStack>
            {isLoading && (
              <LoadingSpinner accessibilityLabel={t('common.loading')} testID="user-profile-list-loading" />
            )}
            {showEmpty && emptyComponent}
            {showNoResults ? (
              <EmptyState
                title={t('userProfile.list.noResultsTitle')}
                description={t('userProfile.list.noResultsMessage')}
                action={(
                  <StyledAddButton
                    onPress={onClearSearchAndFilters}
                    accessibilityRole="button"
                    accessibilityLabel={t('userProfile.list.clearSearchAndFilters')}
                    testID="user-profile-list-clear-search"
                  >
                    <StyledAddLabel>{t('userProfile.list.clearSearchAndFilters')}</StyledAddLabel>
                  </StyledAddButton>
                )}
                testID="user-profile-list-no-results"
              />
            ) : null}
            {showList ? (
              <StyledList>
                <FlatList
                  data={rows}
                  keyExtractor={(profileItem, index) => resolveProfileId(profileItem) || `user-profile-${index}`}
                  renderItem={renderItem}
                  scrollEnabled={false}
                  accessibilityLabel={t('userProfile.list.accessibilityLabel')}
                  testID="user-profile-list-flatlist"
                />
              </StyledList>
            ) : null}

            {showList ? (
              <StyledPagination>
                <StyledPaginationInfo>
                  {t('userProfile.list.pageSummary', {
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
                    testID="user-profile-page-prev"
                  >
                    <StyledPaginationNavLabel>{'<'}</StyledPaginationNavLabel>
                  </StyledPaginationNavButton>

                  <StyledPaginationControl>
                    <StyledPaginationControlLabel>
                      {t('userProfile.list.pageSizeLabel')}
                    </StyledPaginationControlLabel>
                    <StyledPaginationSelectSlot>
                      <Select
                        value={String(pageSize)}
                        onValueChange={onPageSizeChange}
                        options={pageSizeOptions}
                        accessibilityLabel={t('userProfile.list.pageSizeLabel')}
                        compact
                        testID="user-profile-page-size"
                      />
                    </StyledPaginationSelectSlot>
                  </StyledPaginationControl>

                  <StyledPaginationControl>
                    <StyledPaginationControlLabel>
                      {t('userProfile.list.densityLabel')}
                    </StyledPaginationControlLabel>
                    <StyledPaginationSelectSlot>
                      <Select
                        value={density}
                        onValueChange={onDensityChange}
                        options={densityOptions}
                        accessibilityLabel={t('userProfile.list.densityLabel')}
                        compact
                        testID="user-profile-density"
                      />
                    </StyledPaginationSelectSlot>
                  </StyledPaginationControl>

                  <StyledPaginationNavButton
                    onPress={() => onPageChange(page + 1)}
                    disabled={page >= resolvedTotalPages}
                    accessibilityRole="button"
                    accessibilityLabel={t('common.next')}
                    testID="user-profile-page-next"
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

export default UserProfileListScreenAndroid;
