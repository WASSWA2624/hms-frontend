/**
 * TenantListScreen - iOS
 * File: TenantListScreen.ios.jsx
 */
import React from 'react';
import { FlatList } from 'react-native';
import {
  Button,
  EmptyState,
  ErrorState,
  ListItem,
  OfflineState,
  Text,
} from '@platform/components';
import ListScaffold from '@platform/patterns/ListScaffold/ListScaffold.ios';
import { useI18n } from '@hooks';
import {
  StyledContainer,
  StyledContent,
  StyledHeaderRow,
  StyledList,
  StyledScrollView,
  StyledSeparator,
} from './TenantListScreen.ios.styles';
import useTenantListScreen from './useTenantListScreen';

const TenantListScreenIOS = () => {
  const { t } = useI18n();
  const {
    items,
    isLoading,
    hasError,
    errorMessage,
    isOffline,
    onRetry,
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
      onPress={onRetry}
      accessibilityLabel={t('common.retry')}
      accessibilityHint={t('common.retryHint')}
      testID="tenant-list-retry"
    >
      {t('common.retry')}
    </Button>
  ) : undefined;
  const errorComponent = (
    <ErrorState
      title={t('listScaffold.errorState.title')}
      description={errorMessage}
      action={retryAction}
    />
  );
  const offlineComponent = (
    <OfflineState
      action={retryAction}
    />
  );

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
    <StyledScrollView>
      <StyledContainer>
        <StyledContent>
          <StyledHeaderRow>
            <Text
              variant="h1"
              accessibilityRole="header"
              testID="tenant-list-title"
            >
              {t('tenant.list.title')}
            </Text>
            {onAdd && (
              <Button
                variant="primary"
                onPress={onAdd}
                accessibilityLabel={t('tenant.list.addLabel')}
                accessibilityHint={t('tenant.list.addHint')}
                testID="tenant-list-add"
              >
                {t('tenant.list.addLabel')}
              </Button>
            )}
          </StyledHeaderRow>
          <ListScaffold
            isLoading={isLoading}
            isEmpty={!isLoading && !hasError && !isOffline && items.length === 0}
            hasError={hasError}
            error={errorMessage}
            isOffline={isOffline}
            onRetry={onRetry}
            accessibilityLabel={t('tenant.list.accessibilityLabel')}
            testID="tenant-list"
            emptyComponent={emptyComponent}
            errorComponent={errorComponent}
            offlineComponent={offlineComponent}
          >
            {items.length > 0 ? (
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
          </ListScaffold>
        </StyledContent>
      </StyledContainer>
    </StyledScrollView>
  );
};

export default TenantListScreenIOS;
