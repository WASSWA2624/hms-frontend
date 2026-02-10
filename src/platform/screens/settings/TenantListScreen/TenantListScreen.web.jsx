/**
 * TenantListScreen - Web
 * Full UI always renders: toolbar + list area. On error/offline shows inline message + empty list.
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
} from './TenantListScreen.web.styles';
import useTenantListScreen from './useTenantListScreen';

const TenantListScreenWeb = () => {
  const { t } = useI18n();
  const {
    items,
    search,
    isLoading,
    hasError,
    errorMessage,
    isOffline,
    onRetry,
    onSearch,
    onTenantPress,
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
            type="button"
            onClick={onAdd}
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
      variant="surface"
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
  const showEmpty = !isLoading && items.length === 0;
  const showList = items.length > 0;

  return (
    <StyledContainer role="main" aria-label={t('tenant.list.title')}>
      <StyledContent>
        <StyledToolbar data-testid="tenant-list-toolbar">
          <StyledSearchSlot>
            <TextField
              value={search}
              onChange={(e) => onSearch(e.target.value)}
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
                type="button"
                onClick={onAdd}
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
          <StyledListBody role="region" aria-label={t('tenant.list.accessibilityLabel')} data-testid="tenant-list">
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
            {showList && (
              <StyledList role="list">
                {items.map((tenant) => {
                  const title = tenant?.name ?? tenant?.slug ?? tenant?.id ?? '';
                  const subtitle = tenant?.slug ? t('tenant.list.slugValue', { slug: tenant.slug }) : '';
                  return (
                    <li key={tenant.id} role="listitem">
                      <ListItem
                        title={title}
                        subtitle={subtitle}
                        onPress={() => onTenantPress(tenant.id)}
                        actions={
                          <Button
                            variant="surface"
                            size="small"
                            onPress={(e) => onDelete(tenant.id, e)}
                            accessibilityLabel={t('tenant.list.delete')}
                            accessibilityHint={t('tenant.list.deleteHint')}
                            testID={`tenant-delete-${tenant.id}`}
                          >
                            {t('common.remove')}
                          </Button>
                        }
                        accessibilityLabel={t('tenant.list.itemLabel', { name: title })}
                        accessibilityHint={t('tenant.list.itemHint', { name: title })}
                        testID={`tenant-item-${tenant.id}`}
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

export default TenantListScreenWeb;
