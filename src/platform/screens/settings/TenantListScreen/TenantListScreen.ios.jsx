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
  StyledSearchSlot,
  StyledScopeSlot,
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
  const slug = resolveTenantSlug(tenant);
  if (slug) return t('tenant.list.slugValue', { slug });
  return undefined;
};

const resolveTenantMetadata = (t, tenant) => {
  const humanId = resolveTenantHumanId(tenant);
  if (!humanId) return [];
  return [{
    key: 'tenant-human-id',
    text: t('tenant.list.idValue', { id: humanId }),
  }];
};

const resolveTenantLeadingGlyph = (title) => {
  const normalized = String(title || '').trim();
  if (!normalized) return 'T';
  return normalized.charAt(0).toUpperCase();
};

const TenantListScreenIOS = () => {
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
    noticeMessage,
    onDismissNotice,
    onRetry,
    onSearch,
    onSearchScopeChange,
    onClearSearchAndFilters,
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
  const showOffline = !isLoading && isOffline && items.length === 0;
  const showOfflineBanner = !isLoading && isOffline && items.length > 0;
  const showEmpty = !isLoading && !showError && !showOffline && !hasNoResults && items.length === 0;
  const showNoResults = !isLoading && !showError && !showOffline && hasNoResults;
  const showList = items.length > 0;

  const renderItem = ({ item: tenant, index }) => {
    const title = resolveTenantTitle(t, tenant);
    const leadingGlyph = resolveTenantLeadingGlyph(title);
    const tenantId = tenant?.id;
    const itemKey = tenantId ?? tenant?.slug ?? `tenant-${index}`;
    const statusLabel = tenant?.is_active
      ? t('tenant.list.statusActive')
      : t('tenant.list.statusInactive');
    const statusTone = tenant?.is_active ? 'success' : 'warning';
    return (
      <ListItem
        leading={{ glyph: leadingGlyph, tone: 'inverse', backgroundTone: 'primary' }}
        title={title}
        subtitle={resolveTenantSubtitle(t, tenant)}
        metadata={resolveTenantMetadata(t, tenant)}
        status={{
          label: statusLabel,
          tone: statusTone,
          showDot: true,
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
        onMore={tenantId ? () => onTenantPress(tenantId) : undefined}
        moreLabel={t('common.more')}
        moreHint={t('tenant.list.viewHint')}
        viewTestID={`tenant-view-${itemKey}`}
        editTestID={`tenant-edit-${itemKey}`}
        deleteTestID={`tenant-delete-${itemKey}`}
        moreTestID={`tenant-more-${itemKey}`}
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
          <StyledScopeSlot>
            <Select
              value={searchScope}
              onValueChange={onSearchScopeChange}
              options={searchScopeOptions}
              label={t('tenant.list.searchScopeLabel')}
              compact
              testID="tenant-list-search-scope"
            />
          </StyledScopeSlot>
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
              {showOfflineBanner && (
                <OfflineState
                  size={OfflineStateSizes.SMALL}
                  title={t('shell.banners.offline.title')}
                  description={t('shell.banners.offline.message')}
                  action={retryAction}
                  testID="tenant-list-offline-banner"
                />
              )}
            </StyledStateStack>
            {isLoading && (
              <LoadingSpinner accessibilityLabel={t('common.loading')} testID="tenant-list-loading" />
            )}
            {showEmpty && emptyComponent}
            {showNoResults ? (
              <EmptyState
                title={t('tenant.list.noResultsTitle')}
                description={t('tenant.list.noResultsMessage')}
                action={(
                  <StyledAddButton
                    onPress={onClearSearchAndFilters}
                    accessibilityRole="button"
                    accessibilityLabel={t('tenant.list.clearSearchAndFilters')}
                    testID="tenant-list-clear-search"
                  >
                    <StyledAddLabel>{t('tenant.list.clearSearchAndFilters')}</StyledAddLabel>
                  </StyledAddButton>
                )}
                testID="tenant-list-no-results"
              />
            ) : null}
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
