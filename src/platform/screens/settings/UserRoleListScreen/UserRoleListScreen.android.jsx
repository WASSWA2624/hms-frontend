/**
 * UserRoleListScreen - Android
 * File: UserRoleListScreen.android.jsx
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
import { StyledContainer, StyledContent } from './UserRoleListScreen.android.styles';
import useUserRoleListScreen from './useUserRoleListScreen';

const UserRoleListScreenAndroid = () => {
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
  } = useUserRoleListScreen();

  const emptyComponent = (
    <EmptyState
      title={t('userRole.list.emptyTitle')}
      description={t('userRole.list.emptyMessage')}
      testID="user-role-list-empty-state"
    />
  );

  const renderItem = ({ item }) => {
    const userId = item?.user_id ?? '';
    const roleId = item?.role_id ?? '';
    const tenantId = item?.tenant_id ?? '';
    const title = userId ? `${t('userRole.list.userLabel')}: ${userId}` : (item?.id ?? '');
    const subtitle = [
      roleId ? `${t('userRole.list.roleLabel')}: ${roleId}` : '',
      tenantId ? `${t('userRole.list.tenantLabel')}: ${tenantId}` : '',
    ].filter(Boolean).join(' • ');
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
            accessibilityLabel={t('userRole.list.delete')}
            accessibilityHint={t('userRole.list.deleteHint')}
            testID={`user-role-delete-${item.id}`}
          >
            {t('common.remove')}
          </Button>
        }
        accessibilityLabel={t('userRole.list.itemLabel', {
          name: title,
        })}
        testID={`user-role-item-${item.id}`}
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
            testID="user-role-list-title"
          >
            {t('userRole.list.title')}
          </Text>
          {onAdd && (
            <Button
              variant="primary"
              onPress={onAdd}
              accessibilityLabel={t('userRole.list.addLabel')}
              accessibilityHint={t('userRole.list.addHint')}
              testID="user-role-list-add"
            >
              {t('userRole.list.addLabel')}
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
          accessibilityLabel={t('userRole.list.accessibilityLabel')}
          testID="user-role-list"
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

export default UserRoleListScreenAndroid;
