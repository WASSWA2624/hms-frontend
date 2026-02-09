/**
 * PermissionListScreen - iOS
 * File: PermissionListScreen.ios.jsx
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
import { StyledContainer, StyledContent } from './PermissionListScreen.ios.styles';
import usePermissionListScreen from './usePermissionListScreen';

const PermissionListScreenIos = () => {
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
  } = usePermissionListScreen();

  const emptyComponent = (
    <EmptyState
      title={t('permission.list.emptyTitle')}
      description={t('permission.list.emptyMessage')}
      testID="permission-list-empty-state"
    />
  );

  const renderItem = ({ item }) => {
    const title = item?.name ?? item?.id ?? '';
    const subtitle = item?.description ?? '';
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
            accessibilityLabel={t('permission.list.delete')}
            accessibilityHint={t('permission.list.deleteHint')}
            testID={`permission-delete-${item.id}`}
          >
            {t('common.remove')}
          </Button>
        }
        accessibilityLabel={t('permission.list.itemLabel', {
          name: title,
        })}
        testID={`permission-item-${item.id}`}
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
            testID="permission-list-title"
          >
            {t('permission.list.title')}
          </Text>
          {onAdd && (
            <Button
              variant="primary"
              onPress={onAdd}
              accessibilityLabel={t('permission.list.addLabel')}
              accessibilityHint={t('permission.list.addHint')}
              testID="permission-list-add"
            >
              {t('permission.list.addLabel')}
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
          accessibilityLabel={t('permission.list.accessibilityLabel')}
          testID="permission-list"
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

export default PermissionListScreenIos;
