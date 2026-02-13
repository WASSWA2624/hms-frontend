/**
 * ContactListScreen - Android
 * File: ContactListScreen.android.jsx
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
} from '@platform/components';
import { useI18n } from '@hooks';
import {
  StyledAddButton,
  StyledAddLabel,
  StyledContainer,
  StyledContent,
  StyledList,
  StyledListBody,
  StyledSeparator,
  StyledStateStack,
  StyledToolbar,
  StyledToolbarActions,
} from './ContactListScreen.android.styles';
import useContactListScreen from './useContactListScreen';

const resolveContactTypeLabel = (t, value) => {
  if (!value) return '';
  const key = `contact.types.${value}`;
  const resolved = t(key);
  return resolved === key ? value : resolved;
};

const ContactListScreenAndroid = () => {
  const { t } = useI18n();
  const {
    items,
    isLoading,
    hasError,
    errorMessage,
    isOffline,
    noticeMessage,
    onDismissNotice,
    onRetry,
    onContactPress,
    onDelete,
    onAdd,
  } = useContactListScreen();

  const emptyComponent = (
    <EmptyState
      title={t('contact.list.emptyTitle')}
      description={t('contact.list.emptyMessage')}
      action={
        onAdd ? (
          <StyledAddButton
            onPress={onAdd}
            accessibilityRole="button"
            accessibilityLabel={t('contact.list.addLabel')}
            accessibilityHint={t('contact.list.addHint')}
            testID="contact-list-empty-add"
          >
            <Icon glyph="+" size="xs" decorative />
            <StyledAddLabel>{t('contact.list.addLabel')}</StyledAddLabel>
          </StyledAddButton>
        ) : undefined
      }
      testID="contact-list-empty-state"
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
      testID="contact-list-retry"
    >
      {t('common.retry')}
    </Button>
  ) : undefined;
  const showError = !isLoading && hasError && !isOffline;
  const showOffline = !isLoading && isOffline;
  const showEmpty = !isLoading && !showError && !showOffline && items.length === 0;
  const showList = items.length > 0;

  const renderItem = ({ item: contact }) => {
    const title = contact?.value ?? contact?.id ?? '';
    const typeLabel = resolveContactTypeLabel(t, contact?.contact_type);
    const subtitle = typeLabel ? `${t('contact.list.typeLabel')}: ${typeLabel}` : '';
    return (
      <ListItem
        title={title}
        subtitle={subtitle}
        onPress={() => onContactPress(contact.id)}
        actions={onDelete ? (
          <Button
            variant="surface"
            size="small"
            onPress={(e) => onDelete(contact.id, e)}
            accessibilityLabel={t('contact.list.delete')}
            accessibilityHint={t('contact.list.deleteHint')}
            icon={<Icon glyph="?" size="xs" decorative />}
            testID={`contact-delete-${contact.id}`}
          >
            {t('common.remove')}
          </Button>
        ) : undefined}
        accessibilityLabel={t('contact.list.itemLabel', { name: title })}
        accessibilityHint={t('contact.list.itemHint', { name: title })}
        testID={`contact-item-${contact.id}`}
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
          testID="contact-list-notice"
        />
      ) : null}
      <StyledContent>
        <StyledToolbar testID="contact-list-toolbar">
          <StyledToolbarActions>
            {onAdd && (
              <StyledAddButton
                onPress={onAdd}
                accessibilityRole="button"
                accessibilityLabel={t('contact.list.addLabel')}
                accessibilityHint={t('contact.list.addHint')}
                testID="contact-list-add"
              >
                <Icon glyph="+" size="xs" decorative />
                <StyledAddLabel>{t('contact.list.addLabel')}</StyledAddLabel>
              </StyledAddButton>
            )}
          </StyledToolbarActions>
        </StyledToolbar>
        <Card
          variant="outlined"
          accessibilityLabel={t('contact.list.accessibilityLabel')}
          testID="contact-list-card"
        >
          <StyledListBody>
            <StyledStateStack>
              {showError && (
                <ErrorState
                  size={ErrorStateSizes.SMALL}
                  title={t('listScaffold.errorState.title')}
                  description={errorMessage}
                  action={retryAction}
                  testID="contact-list-error"
                />
              )}
              {showOffline && (
                <OfflineState
                  size={OfflineStateSizes.SMALL}
                  title={t('shell.banners.offline.title')}
                  description={t('shell.banners.offline.message')}
                  action={retryAction}
                  testID="contact-list-offline"
                />
              )}
            </StyledStateStack>
            {isLoading && (
              <LoadingSpinner accessibilityLabel={t('common.loading')} testID="contact-list-loading" />
            )}
            {showEmpty && emptyComponent}
            {showList ? (
              <StyledList>
                <FlatList
                  data={items}
                  keyExtractor={(contact) => contact.id}
                  renderItem={renderItem}
                  ItemSeparatorComponent={ItemSeparator}
                  scrollEnabled={false}
                  accessibilityLabel={t('contact.list.accessibilityLabel')}
                  testID="contact-list-flatlist"
                />
              </StyledList>
            ) : null}
          </StyledListBody>
        </Card>
      </StyledContent>
    </StyledContainer>
  );
};

export default ContactListScreenAndroid;
