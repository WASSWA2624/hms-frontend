/**
 * WardListScreen - iOS
 * File: WardListScreen.ios.jsx
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
} from './WardListScreen.ios.styles';
import useWardListScreen from './useWardListScreen';

const resolveActiveMeta = (t, activeValue) => {
  if (activeValue === 'active') {
    return { label: t('common.on'), tone: 'success' };
  }
  if (activeValue === 'inactive') {
    return { label: t('common.off'), tone: 'warning' };
  }
  return { label: t('common.notAvailable'), tone: 'warning' };
};

const resolveWardSubtitle = (t, tenant, facility, wardType) => {
  const available = [tenant, facility, wardType].filter((value) => (
    value && value !== t('common.notAvailable')
  ));
  if (available.length === 0) return undefined;
  if (available.length === 3) {
    return t('ward.list.contextValue', {
      tenant: available[0],
      facility: available[1],
      type: available[2],
    });
  }
  if (available.length === 2) {
    return t('ward.list.partialContextValue', {
      first: available[0],
      second: available[1],
    });
  }
  if (available.length === 1) return available[0];
  return undefined;
};

const WardListScreenIOS = () => {
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
    resolveWardNameText,
    resolveWardTenantText,
    resolveWardFacilityText,
    resolveWardTypeText,
    resolveWardActiveText,
    onWardPress,
    onEdit,
    onDelete,
    onAdd,
  } = useWardListScreen();

  const emptyComponent = (
    <EmptyState
      title={t('ward.list.emptyTitle')}
      description={t('ward.list.emptyMessage')}
      action={
        onAdd ? (
          <StyledAddButton
            onPress={onAdd}
            accessibilityRole="button"
            accessibilityLabel={t('ward.list.addLabel')}
            accessibilityHint={t('ward.list.addHint')}
            testID="ward-list-empty-add"
          >
            <Icon glyph="+" size="xs" decorative />
            <StyledAddLabel>{t('ward.list.addLabel')}</StyledAddLabel>
          </StyledAddButton>
        ) : undefined
      }
      testID="ward-list-empty-state"
    />
  );

  const retryAction = onRetry ? (
    <Button
      variant="primary"
      size="small"
      onPress={onRetry}
      accessibilityLabel={t('common.retry')}
      accessibilityHint={t('common.retryHint')}
      testID="ward-list-retry"
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

  const renderItem = ({ item: ward, index }) => {
    const title = resolveWardNameText(ward);
    const leadingGlyph = String(title || 'R').charAt(0).toUpperCase();
    const wardId = ward?.id;
    const itemKey = wardId ?? `ward-${index}`;
    const activeMeta = resolveActiveMeta(t, resolveWardActiveText(ward));
    const tenant = resolveWardTenantText(ward);
    const facility = resolveWardFacilityText(ward);
    const wardType = resolveWardTypeText(ward);

    return (
      <ListItem
        leading={{ glyph: leadingGlyph, tone: 'inverse', backgroundTone: 'primary' }}
        title={title}
        subtitle={resolveWardSubtitle(t, tenant, facility, wardType)}
        metadata={[]}
        status={{
          label: activeMeta.label,
          tone: activeMeta.tone,
          showDot: true,
          accessibilityLabel: t('ward.list.activeLabel'),
        }}
        density="compact"
        onPress={wardId ? () => onWardPress(wardId) : undefined}
        onView={wardId ? () => onWardPress(wardId) : undefined}
        onEdit={onEdit && wardId ? (event) => onEdit(wardId, event) : undefined}
        onDelete={onDelete && wardId ? (event) => onDelete(wardId, event) : undefined}
        viewLabel={t('ward.list.view')}
        viewHint={t('ward.list.viewHint')}
        editLabel={t('ward.list.edit')}
        editHint={t('ward.list.editHint')}
        deleteLabel={t('common.remove')}
        deleteHint={t('ward.list.deleteHint')}
        onMore={wardId ? () => onWardPress(wardId) : undefined}
        moreLabel={t('common.more')}
        moreHint={t('ward.list.viewHint')}
        viewTestID={`ward-view-${itemKey}`}
        editTestID={`ward-edit-${itemKey}`}
        deleteTestID={`ward-delete-${itemKey}`}
        moreTestID={`ward-more-${itemKey}`}
        accessibilityLabel={t('ward.list.itemLabel', { name: title })}
        accessibilityHint={t('ward.list.itemHint', { name: title })}
        testID={`ward-item-${itemKey}`}
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
          testID="ward-list-notice"
        />
      ) : null}
      <StyledContent>
        <StyledToolbar testID="ward-list-toolbar">
          <StyledSearchSlot>
            <TextField
              value={search}
              onChangeText={onSearch}
              placeholder={t('ward.list.searchPlaceholder')}
              accessibilityLabel={t('ward.list.searchLabel')}
              density="compact"
              type="search"
              testID="ward-list-search"
            />
          </StyledSearchSlot>
          <StyledScopeSlot>
            <Select
              value={searchScope}
              onValueChange={onSearchScopeChange}
              options={searchScopeOptions}
              label={t('ward.list.searchScopeLabel')}
              compact
              testID="ward-list-search-scope"
            />
          </StyledScopeSlot>
          <StyledToolbarActions>
            {onAdd && (
              <StyledAddButton
                onPress={onAdd}
                accessibilityRole="button"
                accessibilityLabel={t('ward.list.addLabel')}
                accessibilityHint={t('ward.list.addHint')}
                testID="ward-list-add"
              >
                <Icon glyph="+" size="xs" decorative />
                <StyledAddLabel>{t('ward.list.addLabel')}</StyledAddLabel>
              </StyledAddButton>
            )}
          </StyledToolbarActions>
        </StyledToolbar>
        <Card
          variant="outlined"
          accessibilityLabel={t('ward.list.accessibilityLabel')}
          testID="ward-list-card"
        >
          <StyledListBody>
            <StyledStateStack>
              {showError && (
                <ErrorState
                  size={ErrorStateSizes.SMALL}
                  title={t('listScaffold.errorState.title')}
                  description={errorMessage}
                  action={retryAction}
                  testID="ward-list-error"
                />
              )}
              {showOffline && (
                <OfflineState
                  size={OfflineStateSizes.SMALL}
                  title={t('shell.banners.offline.title')}
                  description={t('shell.banners.offline.message')}
                  action={retryAction}
                  testID="ward-list-offline"
                />
              )}
              {showOfflineBanner && (
                <OfflineState
                  size={OfflineStateSizes.SMALL}
                  title={t('shell.banners.offline.title')}
                  description={t('shell.banners.offline.message')}
                  action={retryAction}
                  testID="ward-list-offline-banner"
                />
              )}
            </StyledStateStack>
            {isLoading && (
              <LoadingSpinner accessibilityLabel={t('common.loading')} testID="ward-list-loading" />
            )}
            {showEmpty && emptyComponent}
            {showNoResults ? (
              <EmptyState
                title={t('ward.list.noResultsTitle')}
                description={t('ward.list.noResultsMessage')}
                action={(
                  <StyledAddButton
                    onPress={onClearSearchAndFilters}
                    accessibilityRole="button"
                    accessibilityLabel={t('ward.list.clearSearchAndFilters')}
                    testID="ward-list-clear-search"
                  >
                    <StyledAddLabel>{t('ward.list.clearSearchAndFilters')}</StyledAddLabel>
                  </StyledAddButton>
                )}
                testID="ward-list-no-results"
              />
            ) : null}
            {showList ? (
              <StyledList>
                <FlatList
                  data={items}
                  keyExtractor={(ward, index) => ward?.id ?? `ward-${index}`}
                  renderItem={renderItem}
                  scrollEnabled={false}
                  accessibilityLabel={t('ward.list.accessibilityLabel')}
                  testID="ward-list-flatlist"
                />
              </StyledList>
            ) : null}
          </StyledListBody>
        </Card>
      </StyledContent>
    </StyledContainer>
  );
};

export default WardListScreenIOS;


