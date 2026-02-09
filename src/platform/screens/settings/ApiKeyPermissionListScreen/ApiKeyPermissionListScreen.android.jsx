/**
 * ApiKeyPermissionListScreen - Android
 * File: ApiKeyPermissionListScreen.android.jsx
 */
import React from 'react';
import { FlatList } from 'react-native';
import {
  Button,
  EmptyState,
  ListItem,
  Stack,
  Text,
} from '@platform/components';
import { ListScaffold } from '@platform/patterns';
import { useI18n } from '@hooks';
import { StyledContainer, StyledContent } from './ApiKeyPermissionListScreen.android.styles';
import useApiKeyPermissionListScreen from './useApiKeyPermissionListScreen';

const ApiKeyPermissionListScreenAndroid = () => {
  const { t } = useI18n();
  const {
    items,
    isLoading,
    hasError,
    errorMessage,
    isOffline,
    onRetry,
    onItemPress,
    onDelete,
    onAdd,
  } = useApiKeyPermissionListScreen();

  const emptyComponent = (
    <EmptyState
      title={t('apiKeyPermission.list.emptyTitle')}
      description={t('apiKeyPermission.list.emptyMessage')}
      testID="api-key-permission-list-empty-state"
    />
  );

  const renderItem = ({ item }) => {
    const apiKeyId = item?.api_key_id ?? '';
    const permissionId = item?.permission_id ?? '';
    const title = apiKeyId ? `${t('apiKeyPermission.list.apiKeyLabel')}: ${apiKeyId}` : (item?.id ?? '');
    const subtitle = permissionId ? `${t('apiKeyPermission.list.permissionLabel')}: ${permissionId}` : '';
    return (
      <ListItem
        title={title}
        subtitle={subtitle}
        onPress={() => onItemPress(item.id)}
        actions={
          <Button
            variant="ghost"
            size="small"
            onPress={(e) => onDelete(item.id, e)}
            accessibilityLabel={t('apiKeyPermission.list.delete')}
            accessibilityHint={t('apiKeyPermission.list.deleteHint')}
            testID={`api-key-permission-delete-${item.id}`}
          >
            {t('common.remove')}
          </Button>
        }
        accessibilityLabel={t('apiKeyPermission.list.itemLabel', {
          name: title,
        })}
        testID={`api-key-permission-item-${item.id}`}
      />
    );
  };

  return (
    <StyledContainer>
      <StyledContent>
        <Stack direction="horizontal" align="center" justify="space-between" wrap spacing="sm">
          <Text
            variant="h1"
            accessibilityRole="header"
            testID="api-key-permission-list-title"
          >
            {t('apiKeyPermission.list.title')}
          </Text>
          {onAdd && (
            <Button
              variant="primary"
              onPress={onAdd}
              accessibilityLabel={t('apiKeyPermission.list.addLabel')}
              accessibilityHint={t('apiKeyPermission.list.addHint')}
              testID="api-key-permission-list-add"
            >
              {t('apiKeyPermission.list.addLabel')}
            </Button>
          )}
        </Stack>
        <ListScaffold
          isLoading={isLoading}
          isEmpty={!isLoading && !hasError && !isOffline && items.length === 0}
          hasError={hasError}
          error={errorMessage}
          isOffline={isOffline}
          onRetry={onRetry}
          accessibilityLabel={t('apiKeyPermission.list.accessibilityLabel')}
          testID="api-key-permission-list"
          emptyComponent={emptyComponent}
        >
          {items.length > 0 ? (
            <FlatList
              data={items}
              renderItem={renderItem}
              keyExtractor={(item) => item.id}
              scrollEnabled={false}
            />
          ) : null}
        </ListScaffold>
      </StyledContent>
    </StyledContainer>
  );
};

export default ApiKeyPermissionListScreenAndroid;
