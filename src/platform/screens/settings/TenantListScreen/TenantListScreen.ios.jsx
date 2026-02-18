/**
 * TenantListScreen - iOS
 * File: TenantListScreen.ios.jsx
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
import { humanizeIdentifier } from '@utils';
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
} from './TenantListScreen.ios.styles';
import useTenantListScreen from './useTenantListScreen';

const resolveTenantTitle = (t, tenant) => {
  const name = String(tenant?.name ?? '').trim();
  if (name) return name;

  const slug = resolveTenantSlug(tenant);
  if (slug) return slug;

  return t('tenant.list.unnamed');
};

const resolveTenantSlug = (tenant) => humanizeIdentifier(tenant?.slug);
const resolveTenantHumanId = (tenant) => humanizeIdentifier(
  tenant?.human_friendly_id ?? tenant?.humanFriendlyId
);
const resolveTenantSubtitle = (t, tenant) => {
  const humanId = resolveTenantHumanId(tenant);
  const slug = resolveTenantSlug(tenant);
  if (humanId && slug) {
    return `${t('tenant.list.idValue', { id: humanId })} · ${t('tenant.list.slugValue', { slug })}`;
  }
  if (humanId) return t('tenant.list.idValue', { id: humanId });
  if (slug) return t('tenant.list.slugValue', { slug });
  return undefined;
};

const TenantListScreenIOS = () => {
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
    onTenantPress,
    onEdit,
    onDelete,
    onAdd,
  } = useTenantListScreen();

  const emptyComponent = (
    <EmptyState
      title={t('tenant.list.emptyTitle')}
      description={t('tenant.list.emptyMessage')}
      action={
        onAdd ? (
          <StyledAddButton
            onPress={onAdd}
            accessibilityRole="button"
            accessibilityLabel={t('tenant.list.addLabel')}
            accessibilityHint={t('tenant.list.addHint')}
            testID="tenant-list-empty-add"
          >
            <Icon glyph="+" size="xs" decorative />
            <StyledAddLabel>{t('tenant.list.addLabel')}</StyledAddLabel>
          </StyledAddButton>
        ) : undefined
      }
      testID="tenant-list-empty-state"
    />
  );

  const retryAction = onRetry ? (
    <Button
      variant="primary"
      size="small"
      onPress={onRetry}
      accessibilityLabel={t('common.retry')}
      accessibilityHint={t('common.retryHint')}
      testID="tenant-list-retry"
    >
      {t('common.retry')}
    </Button>
  ) : undefined;
  const showError = !isLoading && hasError && !isOffline;
  const showOffline = !isLoading && isOffline;
  const showEmpty = !isLoading && !showError && !showOffline && items.length === 0;
  const showList = items.length > 0;

  const renderItem = ({ item: tenant, index }) => {
    const title = resolveTenantTitle(t, tenant);
    const tenantId = tenant?.id;
    const itemKey = tenantId ?? tenant?.slug ?? `tenant-${index}`;
    const statusLabel = tenant?.is_active
      ? t('tenant.list.statusActive')
      : t('tenant.list.statusInactive');
    const statusVariant = tenant?.is_active ? 'success' : 'warning';
    return (
      <ListItem
        title={title}
        subtitle={resolveTenantSubtitle(t, tenant)}
        badge={{
          label: statusLabel,
          variant: statusVariant,
          size: 'small',
          accessibilityLabel: t('tenant.list.statusLabel'),
        }}
        density="compact"
        onPress={tenantId ? () => onTenantPress(tenantId) : undefined}
        onView={tenantId ? () => onTenantPress(tenantId) : undefined}
        onEdit={onEdit && tenantId ? (event) => onEdit(tenantId, event) : undefined}
        onDelete={onDelete && tenantId ? (event) => onDelete(tenantId, event) : undefined}
        viewLabel={t('tenant.list.view')}
        viewHint={t('tenant.list.viewHint')}
        editLabel={t('tenant.list.edit')}
        editHint={t('tenant.list.editHint')}
        deleteLabel={t('common.remove')}
        deleteHint={t('tenant.list.deleteHint')}
        viewTestID={`tenant-view-${itemKey}`}
        editTestID={`tenant-edit-${itemKey}`}
        deleteTestID={`tenant-delete-${itemKey}`}
        accessibilityLabel={t('tenant.list.itemLabel', { name: title })}
        accessibilityHint={t('tenant.list.itemHint', { name: title })}
        testID={`tenant-item-${itemKey}`}
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
          testID="tenant-list-notice"
        />
      ) : null}
      <StyledContent>
        <StyledToolbar testID="tenant-list-toolbar">
          <StyledSearchSlot>
            <TextField
              value={search}
              onChangeText={onSearch}
              placeholder={t('tenant.list.searchPlaceholder')}
              accessibilityLabel={t('tenant.list.searchLabel')}
              density="compact"
              type="search"
              testID="tenant-list-search"
            />
          </StyledSearchSlot>
          <StyledToolbarActions>
            {onAdd && (
              <StyledAddButton
                onPress={onAdd}
                accessibilityRole="button"
                accessibilityLabel={t('tenant.list.addLabel')}
                accessibilityHint={t('tenant.list.addHint')}
                testID="tenant-list-add"
              >
                <Icon glyph="+" size="xs" decorative />
                <StyledAddLabel>{t('tenant.list.addLabel')}</StyledAddLabel>
              </StyledAddButton>
            )}
          </StyledToolbarActions>
        </StyledToolbar>
        <Card
          variant="outlined"
          accessibilityLabel={t('tenant.list.accessibilityLabel')}
          testID="tenant-list-card"
        >
          <StyledListBody>
            <StyledStateStack>
              {showError && (
                <ErrorState
                  size={ErrorStateSizes.SMALL}
                  title={t('listScaffold.errorState.title')}
                  description={errorMessage}
                  action={retryAction}
                  testID="tenant-list-error"
                />
              )}
              {showOffline && (
                <OfflineState
                  size={OfflineStateSizes.SMALL}
                  title={t('shell.banners.offline.title')}
                  description={t('shell.banners.offline.message')}
                  action={retryAction}
                  testID="tenant-list-offline"
                />
              )}
            </StyledStateStack>
            {isLoading && (
              <LoadingSpinner accessibilityLabel={t('common.loading')} testID="tenant-list-loading" />
            )}
            {showEmpty && emptyComponent}
            {showList ? (
              <StyledList>
                <FlatList
                  data={items}
                  keyExtractor={(tenant, index) => tenant?.id ?? tenant?.slug ?? `tenant-${index}`}
                  renderItem={renderItem}
                  scrollEnabled={false}
                  accessibilityLabel={t('tenant.list.accessibilityLabel')}
                  testID="tenant-list-flatlist"
                />
              </StyledList>
            ) : null}
          </StyledListBody>
        </Card>
      </StyledContent>
    </StyledContainer>
  );
};

export default TenantListScreenIOS;
