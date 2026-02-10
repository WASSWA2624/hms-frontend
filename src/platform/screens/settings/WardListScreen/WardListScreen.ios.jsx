/**
 * WardListScreen - iOS
 * File: WardListScreen.ios.jsx
 */
import React from 'react';
import { FlatList } from 'react-native';
import {
  Button,
  Card,
  EmptyState,
  ErrorState,
  ErrorStateSizes,
  Icon,
  ListItem,
  LoadingSpinner,
  OfflineState,
  OfflineStateSizes,
  Snackbar,
  TextField,
} from '@platform/components';
import { useI18n } from '@hooks';
import {
  StyledAddButton,
  StyledAddLabel,
  StyledContainer,
  StyledContent,
  StyledList,
  StyledListBody,
  StyledSearchSlot,
  StyledSeparator,
  StyledStateStack,
  StyledToolbar,
  StyledToolbarActions,
} from './WardListScreen.ios.styles';
import useWardListScreen from './useWardListScreen';

const WardListScreenIOS = () => {
  const { t } = useI18n();
  const {
    items,
    search,
    isLoading,
    hasError,
    errorMessage,
    isOffline,
    noticeMessage,
    onDismissNotice,
    onRetry,
    onSearch,
    onWardPress,
    onDelete,
    onAdd,
  } = useWardListScreen();

  const emptyComponent = (
    <EmptyState
      title={t('ward.list.emptyTitle')}
      description={t('ward.list.emptyMessage')}
      action={
        onAdd ? (
          <StyledAddButton
            onPress={onAdd}
            accessibilityRole="button"
            accessibilityLabel={t('ward.list.addLabel')}
            accessibilityHint={t('ward.list.addHint')}
            testID="ward-list-empty-add"
          >
            <Icon glyph="+" size="xs" decorative />
            <StyledAddLabel>{t('ward.list.addLabel')}</StyledAddLabel>
          </StyledAddButton>
        ) : undefined
      }
      testID="ward-list-empty-state"
    />
  );

  const ItemSeparator = () => <StyledSeparator />;
  const retryAction = onRetry ? (
    <Button
      variant="surface"
      size="small"
      onPress={onRetry}
      accessibilityLabel={t('common.retry')}
      accessibilityHint={t('common.retryHint')}
      icon={<Icon glyph="?" size="xs" decorative />}
      testID="ward-list-retry"
    >
      {t('common.retry')}
    </Button>
  ) : undefined;
  const showError = !isLoading && hasError && !isOffline;
  const showOffline = !isLoading && isOffline;
  const showEmpty = !isLoading && items.length === 0;
  const showList = items.length > 0;

  const renderItem = ({ item: ward }) => {
    const title = ward?.name ?? ward?.id ?? '';
    const subtitle = ward?.ward_type ? `${t('ward.list.typeLabel')}: ${ward.ward_type}` : '';
    return (
      <ListItem
        title={title}
        subtitle={subtitle}
        onPress={() => onWardPress(ward.id)}
        actions={
          <Button
            variant="surface"
            size="small"
            onPress={(e) => onDelete(ward.id, e)}
            accessibilityLabel={t('ward.list.delete')}
            accessibilityHint={t('ward.list.deleteHint')}
            icon={<Icon glyph="?" size="xs" decorative />}
            testID={`ward-delete-${ward.id}`}
          >
            {t('common.remove')}
          </Button>
        }
        accessibilityLabel={t('ward.list.itemLabel', { name: title })}
        accessibilityHint={t('ward.list.itemHint', { name: title })}
        testID={`ward-item-${ward.id}`}
      />
    );
  };

  return (
    <StyledContainer>
      {noticeMessage ? (
        <Snackbar
          visible={Boolean(noticeMessage)}
          message={noticeMessage}
          variant="success"
          position="bottom"
          onDismiss={onDismissNotice}
          testID="ward-list-notice"
        />
      ) : null}
      <StyledContent>
        <StyledToolbar testID="ward-list-toolbar">
          <StyledSearchSlot>
            <TextField
              value={search}
              onChangeText={onSearch}
              placeholder={t('ward.list.searchPlaceholder')}
              accessibilityLabel={t('ward.list.searchLabel')}
              density="compact"
              testID="ward-list-search"
            />
          </StyledSearchSlot>
          <StyledToolbarActions>
            {onAdd && (
              <StyledAddButton
                onPress={onAdd}
                accessibilityRole="button"
                accessibilityLabel={t('ward.list.addLabel')}
                accessibilityHint={t('ward.list.addHint')}
                testID="ward-list-add"
              >
                <Icon glyph="+" size="xs" decorative />
                <StyledAddLabel>{t('ward.list.addLabel')}</StyledAddLabel>
              </StyledAddButton>
            )}
          </StyledToolbarActions>
        </StyledToolbar>
        <Card
          variant="outlined"
          accessibilityLabel={t('ward.list.accessibilityLabel')}
          testID="ward-list-card"
        >
          <StyledListBody>
            <StyledStateStack>
              {showError && (
                <ErrorState
                  size={ErrorStateSizes.SMALL}
                  title={t('listScaffold.errorState.title')}
                  description={errorMessage}
                  action={retryAction}
                  testID="ward-list-error"
                />
              )}
              {showOffline && (
                <OfflineState
                  size={OfflineStateSizes.SMALL}
                  title={t('shell.banners.offline.title')}
                  description={t('shell.banners.offline.message')}
                  action={retryAction}
                  testID="ward-list-offline"
                />
              )}
            </StyledStateStack>
            {isLoading && (
              <LoadingSpinner accessibilityLabel={t('common.loading')} testID="ward-list-loading" />
            )}
            {showEmpty && emptyComponent}
            {showList ? (
              <StyledList>
                <FlatList
                  data={items}
                  keyExtractor={(ward) => ward.id}
                  renderItem={renderItem}
                  ItemSeparatorComponent={ItemSeparator}
                  scrollEnabled={false}
                  accessibilityLabel={t('ward.list.accessibilityLabel')}
                  testID="ward-list-flatlist"
                />
              </StyledList>
            ) : null}
          </StyledListBody>
        </Card>
      </StyledContent>
    </StyledContainer>
  );
};

export default WardListScreenIOS;
