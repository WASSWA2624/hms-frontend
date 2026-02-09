/**
 * RoleListScreen - Android
 * File: RoleListScreen.android.jsx
 */
import React from 'react';
import { FlatList, View } from 'react-native';
import {
  Button,
  EmptyState,
  ListItem,
  Text,
} from '@platform/components';
import { ListScaffold } from '@platform/patterns';
import { useI18n } from '@hooks';
import { StyledContainer, StyledContent } from './RoleListScreen.android.styles';
import useRoleListScreen from './useRoleListScreen';

const RoleListScreenAndroid = () => {
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
  } = useRoleListScreen();

  const emptyComponent = (
    <EmptyState
      title={t('role.list.emptyTitle')}
      description={t('role.list.emptyMessage')}
      testID="role-list-empty-state"
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
            accessibilityLabel={t('role.list.delete')}
            accessibilityHint={t('role.list.deleteHint')}
            testID={`role-delete-${item.id}`}
          >
            {t('common.remove')}
          </Button>
        }
        accessibilityLabel={t('role.list.itemLabel', {
          name: title,
        })}
        testID={`role-item-${item.id}`}
      />
    );
  };

  return (
    <StyledContainer>
      <StyledContent>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8 }}>
          <Text
            variant="h1"
            accessibilityRole="header"
            testID="role-list-title"
          >
            {t('role.list.title')}
          </Text>
          {onAdd && (
            <Button
              variant="primary"
              onPress={onAdd}
              accessibilityLabel={t('role.list.addLabel')}
              accessibilityHint={t('role.list.addHint')}
              testID="role-list-add"
            >
              {t('role.list.addLabel')}
            </Button>
          )}
        </View>
        <ListScaffold
          isLoading={isLoading}
          isEmpty={!isLoading && !hasError && !isOffline && items.length === 0}
          hasError={hasError}
          error={errorMessage}
          isOffline={isOffline}
          onRetry={onRetry}
          accessibilityLabel={t('role.list.accessibilityLabel')}
          testID="role-list"
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

export default RoleListScreenAndroid;
