/**
 * ContactListScreen - iOS
 * File: ContactListScreen.ios.jsx
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
  Select,
  Snackbar,
  TextField,
} from '@platform/components';
import { useI18n } from '@hooks';
import { humanizeIdentifier } from '@utils';
import {
  StyledAddButton,
  StyledAddLabel,
  StyledContainer,
  StyledContent,
  StyledList,
  StyledListBody,
  StyledScopeSlot,
  StyledSearchSlot,
  StyledStateStack,
  StyledToolbar,
  StyledToolbarActions,
} from './ContactListScreen.ios.styles';
import useContactListScreen from './useContactListScreen';

const resolveContactTitle = (t, contact) => {
  const value = humanizeIdentifier(
    contact?.value
    ?? contact?.name
  );
  if (value) return String(value).trim();
  return t('contact.list.unnamed');
};

const resolveContactTenant = (t, contact, canViewTechnicalIds = false) => {
  const value = humanizeIdentifier(
    contact?.tenant_name
    ?? contact?.tenant?.name
    ?? contact?.tenant_label
  );
  if (value) return String(value).trim();
  if (canViewTechnicalIds) {
    const tenantId = String(contact?.tenant_id ?? '').trim();
    if (tenantId) return tenantId;
  }
  if (String(contact?.tenant_id ?? '').trim()) {
    return t('contact.list.currentTenant');
  }
  return t('common.notAvailable');
};

const resolveContactType = (t, contact) => {
  const rawType = humanizeIdentifier(
    contact?.contact_type
    ?? contact?.type
    ?? contact?.contactType
  );
  if (!rawType) return t('common.notAvailable');
  const typeKey = `contact.types.${rawType}`;
  const translatedType = t(typeKey);
  return translatedType === typeKey ? rawType : translatedType;
};

const resolveContactSubtitle = (t, contact, canViewTechnicalIds = false) => {
  const tenant = resolveContactTenant(t, contact, canViewTechnicalIds);
  const type = resolveContactType(t, contact);

  if (type !== t('common.notAvailable') && tenant !== t('common.notAvailable')) {
    return t('contact.list.contextValue', { type, tenant });
  }
  if (type !== t('common.notAvailable')) {
    return t('contact.list.typeValue', { type });
  }
  if (tenant !== t('common.notAvailable')) {
    return t('contact.list.tenantValue', { tenant });
  }
  return undefined;
};

const ContactListScreenIOS = () => {
  const { t } = useI18n();
  const {
    items,
    search,
    searchScope,
    searchScopeOptions,
    isLoading,
    hasError,
    errorMessage,
    isOffline,
    hasNoResults,
    canViewTechnicalIds,
    noticeMessage,
    onDismissNotice,
    onRetry,
    onSearch,
    onSearchScopeChange,
    onClearSearchAndFilters,
    onContactPress,
    onEdit,
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

  const retryAction = onRetry ? (
    <Button
      variant="primary"
      size="small"
      onPress={onRetry}
      accessibilityLabel={t('common.retry')}
      accessibilityHint={t('common.retryHint')}
      testID="contact-list-retry"
    >
      {t('common.retry')}
    </Button>
  ) : undefined;
  const showError = !isLoading && hasError && !isOffline;
  const showOffline = !isLoading && isOffline && items.length === 0;
  const showOfflineBanner = !isLoading && isOffline && items.length > 0;
  const showEmpty = !isLoading && !showError && !showOffline && !hasNoResults && items.length === 0;
  const showNoResults = !isLoading && !showError && !showOffline && hasNoResults;
  const showList = items.length > 0;

  const renderItem = ({ item: Contact, index }) => {
    const title = resolveContactTitle(t, Contact);
    const leadingGlyph = String(title || 'B').charAt(0).toUpperCase();
    const ContactId = Contact?.id;
    const itemKey = ContactId ?? `contact-${index}`;
    const statusLabel = Contact?.is_primary
      ? t('contact.list.primaryStatePrimary')
      : t('contact.list.primaryStateSecondary');
    const statusTone = Contact?.is_primary ? 'success' : 'warning';

    return (
      <ListItem
        leading={{ glyph: leadingGlyph, tone: 'inverse', backgroundTone: 'primary' }}
        title={title}
        subtitle={resolveContactSubtitle(t, Contact, canViewTechnicalIds)}
        metadata={[]}
        status={{
          label: statusLabel,
          tone: statusTone,
          showDot: true,
          accessibilityLabel: t('contact.list.primaryLabel'),
        }}
        density="compact"
        onPress={ContactId ? () => onContactPress(ContactId) : undefined}
        onView={ContactId ? () => onContactPress(ContactId) : undefined}
        onEdit={onEdit && ContactId ? (event) => onEdit(ContactId, event) : undefined}
        onDelete={onDelete && ContactId ? (event) => onDelete(ContactId, event) : undefined}
        viewLabel={t('contact.list.view')}
        viewHint={t('contact.list.viewHint')}
        editLabel={t('contact.list.edit')}
        editHint={t('contact.list.editHint')}
        deleteLabel={t('common.remove')}
        deleteHint={t('contact.list.deleteHint')}
        onMore={ContactId ? () => onContactPress(ContactId) : undefined}
        moreLabel={t('common.more')}
        moreHint={t('contact.list.viewHint')}
        viewTestID={`contact-view-${itemKey}`}
        editTestID={`contact-edit-${itemKey}`}
        deleteTestID={`contact-delete-${itemKey}`}
        moreTestID={`contact-more-${itemKey}`}
        accessibilityLabel={t('contact.list.itemLabel', { name: title })}
        accessibilityHint={t('contact.list.itemHint', { name: title })}
        testID={`contact-item-${itemKey}`}
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
          <StyledSearchSlot>
            <TextField
              value={search}
              onChangeText={onSearch}
              placeholder={t('contact.list.searchPlaceholder')}
              accessibilityLabel={t('contact.list.searchLabel')}
              density="compact"
              type="search"
              testID="contact-list-search"
            />
          </StyledSearchSlot>
          <StyledScopeSlot>
            <Select
              value={searchScope}
              onValueChange={onSearchScopeChange}
              options={searchScopeOptions}
              label={t('contact.list.searchScopeLabel')}
              compact
              testID="contact-list-search-scope"
            />
          </StyledScopeSlot>
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
              {showOfflineBanner && (
                <OfflineState
                  size={OfflineStateSizes.SMALL}
                  title={t('shell.banners.offline.title')}
                  description={t('shell.banners.offline.message')}
                  action={retryAction}
                  testID="contact-list-offline-banner"
                />
              )}
            </StyledStateStack>
            {isLoading && (
              <LoadingSpinner accessibilityLabel={t('common.loading')} testID="contact-list-loading" />
            )}
            {showEmpty && emptyComponent}
            {showNoResults ? (
              <EmptyState
                title={t('contact.list.noResultsTitle')}
                description={t('contact.list.noResultsMessage')}
                action={(
                  <StyledAddButton
                    onPress={onClearSearchAndFilters}
                    accessibilityRole="button"
                    accessibilityLabel={t('contact.list.clearSearchAndFilters')}
                    testID="contact-list-clear-search"
                  >
                    <StyledAddLabel>{t('contact.list.clearSearchAndFilters')}</StyledAddLabel>
                  </StyledAddButton>
                )}
                testID="contact-list-no-results"
              />
            ) : null}
            {showList ? (
              <StyledList>
                <FlatList
                  data={items}
                  keyExtractor={(Contact, index) => Contact?.id ?? `contact-${index}`}
                  renderItem={renderItem}
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

export default ContactListScreenIOS;
