/**
 * UserMfaListScreen - iOS
 * File: UserMfaListScreen.ios.jsx
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
import { StyledContainer, StyledContent } from './UserMfaListScreen.ios.styles';
import useUserMfaListScreen from './useUserMfaListScreen';

const UserMfaListScreenIos = () => {
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
  } = useUserMfaListScreen();

  const emptyComponent = (
    <EmptyState
      title={t('userMfa.list.emptyTitle')}
      description={t('userMfa.list.emptyMessage')}
      testID="user-mfa-list-empty-state"
    />
  );

  const renderItem = ({ item }) => {
    const channel = item?.channel ?? '';
    const userId = item?.user_id ?? '';
    const title = channel ? `${t('userMfa.list.channelLabel')}: ${channel}` : (item?.id ?? '');
    const subtitle = userId ? `${t('userMfa.list.userLabel')}: ${userId}` : '';
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
            accessibilityLabel={t('userMfa.list.delete')}
            accessibilityHint={t('userMfa.list.deleteHint')}
            testID={`user-mfa-delete-${item.id}`}
          >
            {t('common.remove')}
          </Button>
        }
        accessibilityLabel={t('userMfa.list.itemLabel', {
          name: title,
        })}
        testID={`user-mfa-item-${item.id}`}
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
            testID="user-mfa-list-title"
          >
            {t('userMfa.list.title')}
          </Text>
          {onAdd && (
            <Button
              variant="primary"
              onPress={onAdd}
              accessibilityLabel={t('userMfa.list.addLabel')}
              accessibilityHint={t('userMfa.list.addHint')}
              testID="user-mfa-list-add"
            >
              {t('userMfa.list.addLabel')}
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
          accessibilityLabel={t('userMfa.list.accessibilityLabel')}
          testID="user-mfa-list"
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

export default UserMfaListScreenIos;
