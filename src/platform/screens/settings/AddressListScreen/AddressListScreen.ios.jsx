/**
 * AddressListScreen - iOS
 * File: AddressListScreen.ios.jsx
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
} from './AddressListScreen.ios.styles';
import useAddressListScreen from './useAddressListScreen';

const AddressListScreenIOS = () => {
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
    onAddressPress,
    onDelete,
    onAdd,
  } = useAddressListScreen();

  const emptyComponent = (
    <EmptyState
      title={t('address.list.emptyTitle')}
      description={t('address.list.emptyMessage')}
      action={
        onAdd ? (
          <StyledAddButton
            onPress={onAdd}
            accessibilityRole="button"
            accessibilityLabel={t('address.list.addLabel')}
            accessibilityHint={t('address.list.addHint')}
            testID="address-list-empty-add"
          >
            <Icon glyph="+" size="xs" decorative />
            <StyledAddLabel>{t('address.list.addLabel')}</StyledAddLabel>
          </StyledAddButton>
        ) : undefined
      }
      testID="address-list-empty-state"
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
      testID="address-list-retry"
    >
      {t('common.retry')}
    </Button>
  ) : undefined;
  const showError = !isLoading && hasError && !isOffline;
  const showOffline = !isLoading && isOffline;
  const showEmpty = !isLoading && items.length === 0;
  const showList = items.length > 0;

  const renderItem = ({ item: address }) => {
    const title = address?.line1 ?? address?.id ?? '';
    const city = address?.city ?? '';
    const state = address?.state ?? '';
    const type = address?.address_type ?? '';
    const typeLabel = type ? t(`address.types.${type}`) : '';
    const displayType = typeLabel && typeLabel !== `address.types.${type}` ? typeLabel : type;
    const subtitle = type
      ? `${t('address.list.typeLabel')}: ${displayType}${city || state ? ` · ${[city, state].filter(Boolean).join(', ')}` : ''}`
      : [city, state].filter(Boolean).join(', ');
    return (
      <ListItem
        title={title}
        subtitle={subtitle}
        onPress={() => onAddressPress(address.id)}
        actions={
          <Button
            variant="surface"
            size="small"
            onPress={(e) => onDelete(address.id, e)}
            accessibilityLabel={t('address.list.delete')}
            accessibilityHint={t('address.list.deleteHint')}
            icon={<Icon glyph="?" size="xs" decorative />}
            testID={`address-delete-${address.id}`}
          >
            {t('common.remove')}
          </Button>
        }
        accessibilityLabel={t('address.list.itemLabel', { name: title })}
        accessibilityHint={t('address.list.itemHint', { name: title })}
        testID={`address-item-${address.id}`}
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
          testID="address-list-notice"
        />
      ) : null}
      <StyledContent>
        <StyledToolbar testID="address-list-toolbar">
          <StyledSearchSlot>
            <TextField
              value={search}
              onChangeText={onSearch}
              placeholder={t('address.list.searchPlaceholder')}
              accessibilityLabel={t('address.list.searchLabel')}
              density="compact"
              testID="address-list-search"
            />
          </StyledSearchSlot>
          <StyledToolbarActions>
            {onAdd && (
              <StyledAddButton
                onPress={onAdd}
                accessibilityRole="button"
                accessibilityLabel={t('address.list.addLabel')}
                accessibilityHint={t('address.list.addHint')}
                testID="address-list-add"
              >
                <Icon glyph="+" size="xs" decorative />
                <StyledAddLabel>{t('address.list.addLabel')}</StyledAddLabel>
              </StyledAddButton>
            )}
          </StyledToolbarActions>
        </StyledToolbar>
        <Card
          variant="outlined"
          accessibilityLabel={t('address.list.accessibilityLabel')}
          testID="address-list-card"
        >
          <StyledListBody>
            <StyledStateStack>
              {showError && (
                <ErrorState
                  size={ErrorStateSizes.SMALL}
                  title={t('listScaffold.errorState.title')}
                  description={errorMessage}
                  action={retryAction}
                  testID="address-list-error"
                />
              )}
              {showOffline && (
                <OfflineState
                  size={OfflineStateSizes.SMALL}
                  title={t('shell.banners.offline.title')}
                  description={t('shell.banners.offline.message')}
                  action={retryAction}
                  testID="address-list-offline"
                />
              )}
            </StyledStateStack>
            {isLoading && (
              <LoadingSpinner accessibilityLabel={t('common.loading')} testID="address-list-loading" />
            )}
            {showEmpty && emptyComponent}
            {showList ? (
              <StyledList>
                <FlatList
                  data={items}
                  keyExtractor={(address) => address.id}
                  renderItem={renderItem}
                  ItemSeparatorComponent={ItemSeparator}
                  scrollEnabled={false}
                  accessibilityLabel={t('address.list.accessibilityLabel')}
                  testID="address-list-flatlist"
                />
              </StyledList>
            ) : null}
          </StyledListBody>
        </Card>
      </StyledContent>
    </StyledContainer>
  );
};

export default AddressListScreenIOS;
