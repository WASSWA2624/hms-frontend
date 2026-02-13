/**
 * AddressListScreen - Web
 * Full UI always renders: title + list area. On error/offline shows inline message + empty list.
 */
import React from 'react';
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
  StyledStateStack,
  StyledToolbar,
  StyledToolbarActions,
} from './AddressListScreen.web.styles';
import useAddressListScreen from './useAddressListScreen';

const AddressListScreenWeb = () => {
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
            type="button"
            onClick={onAdd}
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

  return (
    <StyledContainer role="main" aria-label={t('address.list.title')}>
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
        <StyledToolbar data-testid="address-list-toolbar">
          <StyledSearchSlot>
            <TextField
              value={search}
              onChange={(e) => onSearch(e.target.value)}
              placeholder={t('address.list.searchPlaceholder')}
              accessibilityLabel={t('address.list.searchLabel')}
              density="compact"
              type="search"
              testID="address-list-search"
            />
          </StyledSearchSlot>
          <StyledToolbarActions>
            {onAdd && (
              <StyledAddButton
                type="button"
                onClick={onAdd}
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
          <StyledListBody role="region" aria-label={t('address.list.accessibilityLabel')} data-testid="address-list">
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
            {showList && (
              <StyledList role="list">
                {items.map((address) => {
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
                    <li key={address.id} role="listitem">
                      <ListItem
                        title={title}
                        subtitle={subtitle}
                        onPress={() => onAddressPress(address.id)}
                        actions={onDelete ? (
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
                        ) : null}
                        accessibilityLabel={t('address.list.itemLabel', { name: title })}
                        accessibilityHint={t('address.list.itemHint', { name: title })}
                        testID={`address-item-${address.id}`}
                      />
                    </li>
                  );
                })}
              </StyledList>
            )}
          </StyledListBody>
        </Card>
      </StyledContent>
    </StyledContainer>
  );
};

export default AddressListScreenWeb;
