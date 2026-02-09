/**
 * UserListScreen - Android
 * File: UserListScreen.android.jsx
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
import { StyledContainer, StyledContent } from './UserListScreen.android.styles';
import useUserListScreen from './useUserListScreen';

const UserListScreenAndroid = () => {
  const { t } = useI18n();
  const {
    items,
    isLoading,
    hasError,
    errorMessage,
    isOffline,
    onRetry,
    onUserPress,
    onDelete,
    onAdd,
  } = useUserListScreen();

  const emptyComponent = (
    <EmptyState
      title={t('user.list.emptyTitle')}
      description={t('user.list.emptyMessage')}
      testID="user-list-empty-state"
    />
  );

  const renderItem = ({ item: user }) => {
    const title = user?.email ?? user?.phone ?? user?.id ?? '';
    const subtitle = user?.status ? `${t('user.detail.statusLabel')}: ${user.status}` : '';
    return (
      <ListItem
        title={title}
        subtitle={subtitle}
        onPress={() => onUserPress(user.id)}
        actions={
          <Button
            variant="ghost"
            size="small"
            onPress={(e) => onDelete(user.id, e)}
            accessibilityLabel={t('user.list.delete')}
            accessibilityHint={t('user.list.deleteHint')}
            testID={`user-delete-${user.id}`}
          >
            {t('common.remove')}
          </Button>
        }
        accessibilityLabel={t('user.list.itemLabel', {
          name: title,
        })}
        testID={`user-item-${user.id}`}
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
            testID="user-list-title"
          >
            {t('user.list.title')}
          </Text>
          {onAdd && (
            <Button
              variant="primary"
              onPress={onAdd}
              accessibilityLabel={t('user.list.addLabel')}
              accessibilityHint={t('user.list.addHint')}
              testID="user-list-add"
            >
              {t('user.list.addLabel')}
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
          accessibilityLabel={t('user.list.accessibilityLabel')}
          testID="user-list"
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

export default UserListScreenAndroid;
