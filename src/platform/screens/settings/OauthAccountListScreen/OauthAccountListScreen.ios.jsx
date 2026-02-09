/**
 * OauthAccountListScreen - iOS
 * File: OauthAccountListScreen.ios.jsx
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
import { StyledContainer, StyledContent } from './OauthAccountListScreen.ios.styles';
import useOauthAccountListScreen from './useOauthAccountListScreen';

const OauthAccountListScreenIos = () => {
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
  } = useOauthAccountListScreen();

  const emptyComponent = (
    <EmptyState
      title={t('oauthAccount.list.emptyTitle')}
      description={t('oauthAccount.list.emptyMessage')}
      testID="oauth-account-list-empty-state"
    />
  );

  const renderItem = ({ item }) => {
    const provider = item?.provider ?? '';
    const userId = item?.user_id ?? '';
    const title = provider ? `${t('oauthAccount.list.providerLabel')}: ${provider}` : (item?.id ?? '');
    const subtitle = userId ? `${t('oauthAccount.list.userLabel')}: ${userId}` : '';
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
            accessibilityLabel={t('oauthAccount.list.delete')}
            accessibilityHint={t('oauthAccount.list.deleteHint')}
            testID={`oauth-account-delete-${item.id}`}
          >
            {t('common.remove')}
          </Button>
        }
        accessibilityLabel={t('oauthAccount.list.itemLabel', {
          name: title,
        })}
        testID={`oauth-account-item-${item.id}`}
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
            testID="oauth-account-list-title"
          >
            {t('oauthAccount.list.title')}
          </Text>
          {onAdd && (
            <Button
              variant="primary"
              onPress={onAdd}
              accessibilityLabel={t('oauthAccount.list.addLabel')}
              accessibilityHint={t('oauthAccount.list.addHint')}
              testID="oauth-account-list-add"
            >
              {t('oauthAccount.list.addLabel')}
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
          accessibilityLabel={t('oauthAccount.list.accessibilityLabel')}
          testID="oauth-account-list"
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

export default OauthAccountListScreenIos;
