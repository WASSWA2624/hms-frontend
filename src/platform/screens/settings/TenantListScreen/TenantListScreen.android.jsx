/**
 * TenantListScreen - Android
 * File: TenantListScreen.android.jsx
 */
import React from 'react';
import { FlatList } from 'react-native';
import {
  Button,
  Card,
  EmptyState,
  ErrorState,
  ErrorStateSizes,
  ListItem,
  LoadingSpinner,
  OfflineState,
  OfflineStateSizes,
  SearchBar,
} from '@platform/components';
import { useI18n } from '@hooks';
import {
  StyledContainer,
  StyledContent,
  StyledList,
  StyledListBody,
  StyledSearchSlot,
  StyledSeparator,
  StyledStateStack,
  StyledToolbar,
  StyledToolbarActions,
} from './TenantListScreen.android.styles';
import useTenantListScreen from './useTenantListScreen';

const TenantListScreenAndroid = () => {
  const { t } = useI18n();
  const {
    items,
    search,
    isLoading,
    hasError,
    errorMessage,
    isOffline,
    onRetry,
    onSearch,
    onTenantPress,
    onDelete,
    onAdd,
  } = useTenantListScreen();

  const emptyComponent = (
    <EmptyState
      title={t('tenant.list.emptyTitle')}
      description={t('tenant.list.emptyMessage')}
      action={
        onAdd ? (
          <Button
            variant="primary"
            size="small"
            onPress={onAdd}
            accessibilityLabel={t('tenant.list.addLabel')}
            accessibilityHint={t('tenant.list.addHint')}
            testID="tenant-list-empty-add"
          >
            {t('tenant.list.addLabel')}
          </Button>
        ) : undefined
      }
      testID="tenant-list-empty-state"
    />
  );

  const ItemSeparator = () => <StyledSeparator />;
  const retryAction = onRetry ? (
    <Button
      variant="primary"
      size="small"
      onPress={onRetry}
      accessibilityLabel={t('common.retry')}
      accessibilityHint={t('common.retryHint')}
      testID="tenant-list-retry"
    >
      {t('common.retry')}
    </Button>
  ) : undefined;
  const showError = !isLoading && hasError && !isOffline;
  const showOffline = !isLoading && isOffline;
  const showEmpty = !isLoading && items.length === 0;
  const showList = items.length > 0;

  const renderItem = ({ item: tenant }) => {
    const title = tenant?.name ?? tenant?.slug ?? tenant?.id ?? '';
    const subtitle = tenant?.slug ? t('tenant.list.slugValue', { slug: tenant.slug }) : '';
    return (
      <ListItem
        title={title}
        subtitle={subtitle}
        onPress={() => onTenantPress(tenant.id)}
        actions={
          <Button
            variant="ghost"
            size="small"
            onPress={(e) => onDelete(tenant.id, e)}
            accessibilityLabel={t('tenant.list.delete')}
            accessibilityHint={t('tenant.list.deleteHint')}
            testID={`tenant-delete-${tenant.id}`}
          >
            {t('common.remove')}
          </Button>
        }
        accessibilityLabel={t('tenant.list.itemLabel', { name: title })}
        accessibilityHint={t('tenant.list.itemHint', { name: title })}
        testID={`tenant-item-${tenant.id}`}
      />
    );
  };

  return (
    <StyledContainer>
      <StyledContent>
        <StyledToolbar testID="tenant-list-toolbar">
          <StyledSearchSlot>
            <SearchBar
              value={search}
              onSearch={onSearch}
              placeholder={t('tenant.list.searchPlaceholder')}
              accessibilityLabel={t('tenant.list.searchLabel')}
              testID="tenant-list-search"
            />
          </StyledSearchSlot>
          <StyledToolbarActions>
            {onAdd && (
              <Button
                variant="primary"
                size="small"
                onPress={onAdd}
                accessibilityLabel={t('tenant.list.addLabel')}
                accessibilityHint={t('tenant.list.addHint')}
                testID="tenant-list-add"
              >
                {t('tenant.list.addLabel')}
              </Button>
            )}
          </StyledToolbarActions>
        </StyledToolbar>
        <Card
          variant="outlined"
          accessibilityLabel={t('tenant.list.accessibilityLabel')}
          testID="tenant-list-card"
        >
          <StyledListBody>
            <StyledStateStack>
              {showError && (
                <ErrorState
                  size={ErrorStateSizes.SMALL}
                  title={t('listScaffold.errorState.title')}
                  description={errorMessage}
                  action={retryAction}
                  testID="tenant-list-error"
                />
              )}
              {showOffline && (
                <OfflineState
                  size={OfflineStateSizes.SMALL}
                  title={t('shell.banners.offline.title')}
                  description={t('shell.banners.offline.message')}
                  action={retryAction}
                  testID="tenant-list-offline"
                />
              )}
            </StyledStateStack>
            {isLoading && (
              <LoadingSpinner accessibilityLabel={t('common.loading')} testID="tenant-list-loading" />
            )}
            {showEmpty && emptyComponent}
            {showList ? (
              <StyledList>
                <FlatList
                  data={items}
                  keyExtractor={(t) => t.id}
                  renderItem={renderItem}
                  ItemSeparatorComponent={ItemSeparator}
                  scrollEnabled={false}
                  accessibilityLabel={t('tenant.list.accessibilityLabel')}
                  testID="tenant-list-flatlist"
                />
              </StyledList>
            ) : null}
          </StyledListBody>
        </Card>
      </StyledContent>
    </StyledContainer>
  );
};

export default TenantListScreenAndroid;
