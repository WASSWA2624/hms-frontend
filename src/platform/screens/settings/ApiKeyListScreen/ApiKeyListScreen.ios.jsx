/**
 * ApiKeyListScreen - iOS
 * File: ApiKeyListScreen.ios.jsx
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
import { StyledContainer, StyledContent } from './ApiKeyListScreen.ios.styles';
import useApiKeyListScreen from './useApiKeyListScreen';

const ApiKeyListScreenIos = () => {
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
  } = useApiKeyListScreen();

  const emptyComponent = (
    <EmptyState
      title={t('apiKey.list.emptyTitle')}
      description={t('apiKey.list.emptyMessage')}
      testID="api-key-list-empty-state"
    />
  );

  const renderItem = ({ item }) => {
    const title = item?.name ?? item?.id ?? '';
    const userId = item?.user_id ?? '';
    const subtitle = userId ? `${t('apiKey.list.userLabel')}: ${userId}` : '';
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
            accessibilityLabel={t('apiKey.list.delete')}
            accessibilityHint={t('apiKey.list.deleteHint')}
            testID={`api-key-delete-${item.id}`}
          >
            {t('common.remove')}
          </Button>
        }
        accessibilityLabel={t('apiKey.list.itemLabel', {
          name: title,
        })}
        testID={`api-key-item-${item.id}`}
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
            testID="api-key-list-title"
          >
            {t('apiKey.list.title')}
          </Text>
          {onAdd && (
            <Button
              variant="primary"
              onPress={onAdd}
              accessibilityLabel={t('apiKey.list.addLabel')}
              accessibilityHint={t('apiKey.list.addHint')}
              testID="api-key-list-add"
            >
              {t('apiKey.list.addLabel')}
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
          accessibilityLabel={t('apiKey.list.accessibilityLabel')}
          testID="api-key-list"
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

export default ApiKeyListScreenIos;
