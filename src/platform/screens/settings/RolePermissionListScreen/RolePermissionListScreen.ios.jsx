/**
 * RolePermissionListScreen - iOS
 * File: RolePermissionListScreen.ios.jsx
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
import { StyledContainer, StyledContent } from './RolePermissionListScreen.ios.styles';
import useRolePermissionListScreen from './useRolePermissionListScreen';

const RolePermissionListScreenIos = () => {
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
  } = useRolePermissionListScreen();

  const emptyComponent = (
    <EmptyState
      title={t('rolePermission.list.emptyTitle')}
      description={t('rolePermission.list.emptyMessage')}
      testID="role-permission-list-empty-state"
    />
  );

  const renderItem = ({ item }) => {
    const roleId = item?.role_id ?? '';
    const permissionId = item?.permission_id ?? '';
    const title = roleId ? `${t('rolePermission.list.roleLabel')}: ${roleId}` : (item?.id ?? '');
    const subtitle = permissionId ? `${t('rolePermission.list.permissionLabel')}: ${permissionId}` : '';
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
            accessibilityLabel={t('rolePermission.list.delete')}
            accessibilityHint={t('rolePermission.list.deleteHint')}
            testID={`role-permission-delete-${item.id}`}
          >
            {t('common.remove')}
          </Button>
        }
        accessibilityLabel={t('rolePermission.list.itemLabel', {
          name: title,
        })}
        testID={`role-permission-item-${item.id}`}
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
            testID="role-permission-list-title"
          >
            {t('rolePermission.list.title')}
          </Text>
          {onAdd && (
            <Button
              variant="primary"
              onPress={onAdd}
              accessibilityLabel={t('rolePermission.list.addLabel')}
              accessibilityHint={t('rolePermission.list.addHint')}
              testID="role-permission-list-add"
            >
              {t('rolePermission.list.addLabel')}
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
          accessibilityLabel={t('rolePermission.list.accessibilityLabel')}
          testID="role-permission-list"
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

export default RolePermissionListScreenIos;
