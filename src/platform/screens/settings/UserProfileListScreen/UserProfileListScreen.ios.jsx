/**
 * UserProfileListScreen - iOS
 * File: UserProfileListScreen.ios.jsx
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
import { StyledContainer, StyledContent } from './UserProfileListScreen.ios.styles';
import useUserProfileListScreen from './useUserProfileListScreen';

const UserProfileListScreenIos = () => {
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
  } = useUserProfileListScreen();

  const emptyComponent = (
    <EmptyState
      title={t('userProfile.list.emptyTitle')}
      description={t('userProfile.list.emptyMessage')}
      testID="user-profile-list-empty-state"
    />
  );

  const renderItem = ({ item }) => {
    const fullName = [item?.first_name, item?.middle_name, item?.last_name].filter(Boolean).join(' ');
    const title = fullName || item?.user_id || item?.id || '';
    const subtitle = item?.user_id ? `${t('userProfile.list.userLabel')}: ${item.user_id}` : '';
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
            accessibilityLabel={t('userProfile.list.delete')}
            accessibilityHint={t('userProfile.list.deleteHint')}
            testID={`user-profile-delete-${item.id}`}
          >
            {t('common.remove')}
          </Button>
        }
        accessibilityLabel={t('userProfile.list.itemLabel', {
          name: title,
        })}
        testID={`user-profile-item-${item.id}`}
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
            testID="user-profile-list-title"
          >
            {t('userProfile.list.title')}
          </Text>
          {onAdd && (
            <Button
              variant="primary"
              onPress={onAdd}
              accessibilityLabel={t('userProfile.list.addLabel')}
              accessibilityHint={t('userProfile.list.addHint')}
              testID="user-profile-list-add"
            >
              {t('userProfile.list.addLabel')}
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
          accessibilityLabel={t('userProfile.list.accessibilityLabel')}
          testID="user-profile-list"
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

export default UserProfileListScreenIos;
