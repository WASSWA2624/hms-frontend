/**
 * BranchListScreen - iOS
 * File: BranchListScreen.ios.jsx
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
} from './BranchListScreen.ios.styles';
import useBranchListScreen from './useBranchListScreen';

const resolveBranchTitle = (t, branch) => {
  const name = humanizeIdentifier(branch?.name);
  if (name) return String(name).trim();
  return t('branch.list.unnamed');
};

const resolveBranchTenant = (t, branch) => {
  const value = humanizeIdentifier(
    branch?.tenant_name
    ?? branch?.tenant?.name
    ?? branch?.tenant_label
  );
  if (value) return String(value).trim();
  return t('common.notAvailable');
};

const resolveBranchFacility = (t, branch) => {
  const value = humanizeIdentifier(
    branch?.facility_name
    ?? branch?.facility?.name
    ?? branch?.facility_label
  );
  if (value) return String(value).trim();
  return t('common.notAvailable');
};

const resolveBranchSubtitle = (t, branch) => {
  const tenant = resolveBranchTenant(t, branch);
  const facility = resolveBranchFacility(t, branch);

  if (tenant !== t('common.notAvailable') && facility !== t('common.notAvailable')) {
    return t('branch.list.contextValue', { tenant, facility });
  }
  if (facility !== t('common.notAvailable')) {
    return t('branch.list.facilityValue', { facility });
  }
  if (tenant !== t('common.notAvailable')) {
    return t('branch.list.tenantValue', { tenant });
  }
  return undefined;
};

const BranchListScreenIOS = () => {
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
    onBranchPress,
    onEdit,
    onDelete,
    onAdd,
  } = useBranchListScreen();

  const emptyComponent = (
    <EmptyState
      title={t('branch.list.emptyTitle')}
      description={t('branch.list.emptyMessage')}
      action={
        onAdd ? (
          <StyledAddButton
            onPress={onAdd}
            accessibilityRole="button"
            accessibilityLabel={t('branch.list.addLabel')}
            accessibilityHint={t('branch.list.addHint')}
            testID="branch-list-empty-add"
          >
            <Icon glyph="+" size="xs" decorative />
            <StyledAddLabel>{t('branch.list.addLabel')}</StyledAddLabel>
          </StyledAddButton>
        ) : undefined
      }
      testID="branch-list-empty-state"
    />
  );

  const retryAction = onRetry ? (
    <Button
      variant="primary"
      size="small"
      onPress={onRetry}
      accessibilityLabel={t('common.retry')}
      accessibilityHint={t('common.retryHint')}
      testID="branch-list-retry"
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

  const renderItem = ({ item: branch, index }) => {
    const title = resolveBranchTitle(t, branch);
    const leadingGlyph = String(title || 'B').charAt(0).toUpperCase();
    const branchId = branch?.id;
    const itemKey = branchId ?? `branch-${index}`;
    const statusLabel = branch?.is_active
      ? t('branch.list.statusActive')
      : t('branch.list.statusInactive');
    const statusTone = branch?.is_active ? 'success' : 'warning';

    return (
      <ListItem
        leading={{ glyph: leadingGlyph, tone: 'inverse', backgroundTone: 'primary' }}
        title={title}
        subtitle={resolveBranchSubtitle(t, branch)}
        metadata={[]}
        status={{
          label: statusLabel,
          tone: statusTone,
          showDot: true,
          accessibilityLabel: t('branch.list.statusLabel'),
        }}
        density="compact"
        onPress={branchId ? () => onBranchPress(branchId) : undefined}
        onView={branchId ? () => onBranchPress(branchId) : undefined}
        onEdit={onEdit && branchId ? (event) => onEdit(branchId, event) : undefined}
        onDelete={onDelete && branchId ? (event) => onDelete(branchId, event) : undefined}
        viewLabel={t('branch.list.view')}
        viewHint={t('branch.list.viewHint')}
        editLabel={t('branch.list.edit')}
        editHint={t('branch.list.editHint')}
        deleteLabel={t('common.remove')}
        deleteHint={t('branch.list.deleteHint')}
        onMore={branchId ? () => onBranchPress(branchId) : undefined}
        moreLabel={t('common.more')}
        moreHint={t('branch.list.viewHint')}
        viewTestID={`branch-view-${itemKey}`}
        editTestID={`branch-edit-${itemKey}`}
        deleteTestID={`branch-delete-${itemKey}`}
        moreTestID={`branch-more-${itemKey}`}
        accessibilityLabel={t('branch.list.itemLabel', { name: title })}
        accessibilityHint={t('branch.list.itemHint', { name: title })}
        testID={`branch-item-${itemKey}`}
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
          testID="branch-list-notice"
        />
      ) : null}
      <StyledContent>
        <StyledToolbar testID="branch-list-toolbar">
          <StyledSearchSlot>
            <TextField
              value={search}
              onChangeText={onSearch}
              placeholder={t('branch.list.searchPlaceholder')}
              accessibilityLabel={t('branch.list.searchLabel')}
              density="compact"
              type="search"
              testID="branch-list-search"
            />
          </StyledSearchSlot>
          <StyledScopeSlot>
            <Select
              value={searchScope}
              onValueChange={onSearchScopeChange}
              options={searchScopeOptions}
              label={t('branch.list.searchScopeLabel')}
              compact
              testID="branch-list-search-scope"
            />
          </StyledScopeSlot>
          <StyledToolbarActions>
            {onAdd && (
              <StyledAddButton
                onPress={onAdd}
                accessibilityRole="button"
                accessibilityLabel={t('branch.list.addLabel')}
                accessibilityHint={t('branch.list.addHint')}
                testID="branch-list-add"
              >
                <Icon glyph="+" size="xs" decorative />
                <StyledAddLabel>{t('branch.list.addLabel')}</StyledAddLabel>
              </StyledAddButton>
            )}
          </StyledToolbarActions>
        </StyledToolbar>
        <Card
          variant="outlined"
          accessibilityLabel={t('branch.list.accessibilityLabel')}
          testID="branch-list-card"
        >
          <StyledListBody>
            <StyledStateStack>
              {showError && (
                <ErrorState
                  size={ErrorStateSizes.SMALL}
                  title={t('listScaffold.errorState.title')}
                  description={errorMessage}
                  action={retryAction}
                  testID="branch-list-error"
                />
              )}
              {showOffline && (
                <OfflineState
                  size={OfflineStateSizes.SMALL}
                  title={t('shell.banners.offline.title')}
                  description={t('shell.banners.offline.message')}
                  action={retryAction}
                  testID="branch-list-offline"
                />
              )}
              {showOfflineBanner && (
                <OfflineState
                  size={OfflineStateSizes.SMALL}
                  title={t('shell.banners.offline.title')}
                  description={t('shell.banners.offline.message')}
                  action={retryAction}
                  testID="branch-list-offline-banner"
                />
              )}
            </StyledStateStack>
            {isLoading && (
              <LoadingSpinner accessibilityLabel={t('common.loading')} testID="branch-list-loading" />
            )}
            {showEmpty && emptyComponent}
            {showNoResults ? (
              <EmptyState
                title={t('branch.list.noResultsTitle')}
                description={t('branch.list.noResultsMessage')}
                action={(
                  <StyledAddButton
                    onPress={onClearSearchAndFilters}
                    accessibilityRole="button"
                    accessibilityLabel={t('branch.list.clearSearchAndFilters')}
                    testID="branch-list-clear-search"
                  >
                    <StyledAddLabel>{t('branch.list.clearSearchAndFilters')}</StyledAddLabel>
                  </StyledAddButton>
                )}
                testID="branch-list-no-results"
              />
            ) : null}
            {showList ? (
              <StyledList>
                <FlatList
                  data={items}
                  keyExtractor={(branch, index) => branch?.id ?? `branch-${index}`}
                  renderItem={renderItem}
                  scrollEnabled={false}
                  accessibilityLabel={t('branch.list.accessibilityLabel')}
                  testID="branch-list-flatlist"
                />
              </StyledList>
            ) : null}
          </StyledListBody>
        </Card>
      </StyledContent>
    </StyledContainer>
  );
};

export default BranchListScreenIOS;
