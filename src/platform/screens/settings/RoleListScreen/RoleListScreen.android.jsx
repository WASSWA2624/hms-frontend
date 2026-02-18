/**
 * RoleListScreen - Android
 * File: RoleListScreen.android.jsx
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
  StyledSeparator,
  StyledStateStack,
  StyledToolbar,
  StyledToolbarActions,
} from './RoleListScreen.android.styles';
import useRoleListScreen from './useRoleListScreen';

const resolveRoleId = (roleItem) => String(roleItem?.id ?? '').trim();

const resolveRoleName = (t, roleItem) => (
  humanizeIdentifier(roleItem?.name) || t('role.list.unnamedRole')
);

const RoleListScreenAndroid = () => {
  const { t } = useI18n();
  const {
    items,
    search,
    searchScope,
    searchScopeOptions,
    hasNoResults,
    isLoading,
    hasError,
    errorMessage,
    isOffline,
    noticeMessage,
    onDismissNotice,
    onRetry,
    onSearch,
    onSearchScopeChange,
    onClearSearchAndFilters,
    onItemPress,
    onDelete,
    onAdd,
  } = useRoleListScreen();

  const emptyComponent = (
    <EmptyState
      title={t('role.list.emptyTitle')}
      description={t('role.list.emptyMessage')}
      action={
        onAdd ? (
          <StyledAddButton
            onPress={onAdd}
            accessibilityRole="button"
            accessibilityLabel={t('role.list.addLabel')}
            accessibilityHint={t('role.list.addHint')}
            testID="role-list-empty-add"
          >
            <Icon glyph="+" size="xs" decorative />
            <StyledAddLabel>{t('role.list.addLabel')}</StyledAddLabel>
          </StyledAddButton>
        ) : undefined
      }
      testID="role-list-empty-state"
    />
  );

  const noResultsComponent = (
    <EmptyState
      title={t('role.list.noResultsTitle')}
      description={t('role.list.noResultsMessage')}
      action={(
        <StyledAddButton
          onPress={onClearSearchAndFilters}
          accessibilityRole="button"
          accessibilityLabel={t('role.list.clearSearchAndFilters')}
          testID="role-list-clear-search"
        >
          <StyledAddLabel>{t('role.list.clearSearchAndFilters')}</StyledAddLabel>
        </StyledAddButton>
      )}
      testID="role-list-no-results"
    />
  );

  const ItemSeparator = () => <StyledSeparator />;
  const retryAction = onRetry ? (
    <Button
      variant="surface"
      size="small"
      onPress={onRetry}
      accessibilityLabel={t('common.retry')}
      accessibilityHint={t('common.retryHint')}
      testID="role-list-retry"
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

  const renderItem = ({ item: roleItem, index }) => {
    const roleId = resolveRoleId(roleItem);
    const itemKey = roleId || `role-${index}`;
    const title = resolveRoleName(t, roleItem);
    const subtitle = humanizeIdentifier(roleItem?.description);
    return (
      <ListItem
        title={title}
        subtitle={subtitle || undefined}
        onPress={roleId ? () => onItemPress(roleId) : undefined}
        actions={onDelete && roleId ? (
          <Button
            variant="surface"
            size="small"
            onPress={(event) => onDelete(roleId, event)}
            accessibilityLabel={t('role.list.delete')}
            accessibilityHint={t('role.list.deleteHint')}
            testID={`role-delete-${itemKey}`}
          >
            {t('common.remove')}
          </Button>
        ) : undefined}
        accessibilityLabel={t('role.list.itemLabel', { name: title })}
        testID={`role-item-${itemKey}`}
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
          testID="role-list-notice"
        />
      ) : null}
      <StyledContent>
        <StyledToolbar testID="role-list-toolbar">
          <StyledSearchSlot>
            <TextField
              value={search}
              onChangeText={onSearch}
              placeholder={t('role.list.searchPlaceholder')}
              accessibilityLabel={t('role.list.searchLabel')}
              density="compact"
              type="search"
              testID="role-list-search"
            />
          </StyledSearchSlot>
          <StyledScopeSlot>
            <Select
              value={searchScope}
              onValueChange={onSearchScopeChange}
              options={searchScopeOptions}
              label={t('role.list.searchScopeLabel')}
              compact
              testID="role-list-search-scope"
            />
          </StyledScopeSlot>
          <StyledToolbarActions>
            {onAdd && (
              <StyledAddButton
                onPress={onAdd}
                accessibilityRole="button"
                accessibilityLabel={t('role.list.addLabel')}
                accessibilityHint={t('role.list.addHint')}
                testID="role-list-add"
              >
                <Icon glyph="+" size="xs" decorative />
                <StyledAddLabel>{t('role.list.addLabel')}</StyledAddLabel>
              </StyledAddButton>
            )}
          </StyledToolbarActions>
        </StyledToolbar>
        <Card
          variant="outlined"
          accessibilityLabel={t('role.list.accessibilityLabel')}
          testID="role-list-card"
        >
          <StyledListBody>
            <StyledStateStack>
              {showError && (
                <ErrorState
                  size={ErrorStateSizes.SMALL}
                  title={t('listScaffold.errorState.title')}
                  description={errorMessage}
                  action={retryAction}
                  testID="role-list-error"
                />
              )}
              {showOffline && (
                <OfflineState
                  size={OfflineStateSizes.SMALL}
                  title={t('shell.banners.offline.title')}
                  description={t('shell.banners.offline.message')}
                  action={retryAction}
                  testID="role-list-offline"
                />
              )}
              {showOfflineBanner && (
                <OfflineState
                  size={OfflineStateSizes.SMALL}
                  title={t('shell.banners.offline.title')}
                  description={t('shell.banners.offline.message')}
                  action={retryAction}
                  testID="role-list-offline-banner"
                />
              )}
            </StyledStateStack>
            {isLoading && (
              <LoadingSpinner accessibilityLabel={t('common.loading')} testID="role-list-loading" />
            )}
            {showEmpty ? emptyComponent : null}
            {showNoResults ? noResultsComponent : null}
            {showList ? (
              <StyledList>
                <FlatList
                  data={items}
                  keyExtractor={(roleItem, index) => resolveRoleId(roleItem) || `role-${index}`}
                  renderItem={renderItem}
                  ItemSeparatorComponent={ItemSeparator}
                  scrollEnabled={false}
                  accessibilityLabel={t('role.list.accessibilityLabel')}
                  testID="role-list-flatlist"
                />
              </StyledList>
            ) : null}
          </StyledListBody>
        </Card>
      </StyledContent>
    </StyledContainer>
  );
};

export default RoleListScreenAndroid;
