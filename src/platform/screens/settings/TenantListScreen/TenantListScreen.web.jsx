/**
 * TenantListScreen - Web
 * Full UI always renders: title + list area. On error/offline shows inline message + empty list.
 */
import React from 'react';
import {
  Button,
  EmptyState,
  ErrorState,
  ListItem,
  LoadingSpinner,
  OfflineState,
  Text,
} from '@platform/components';
import { useI18n } from '@hooks';
import { StyledContainer, StyledContent, StyledHeaderRow, StyledList, StyledListBody } from './TenantListScreen.web.styles';
import useTenantListScreen from './useTenantListScreen';

const TenantListScreenWeb = () => {
  const { t } = useI18n();
  const {
    items,
    isLoading,
    hasError,
    errorMessage,
    isOffline,
    onRetry,
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
          <Button
            variant="primary"
            onPress={onAdd}
            accessibilityLabel={t('tenant.list.addLabel')}
            accessibilityHint={t('tenant.list.addHint')}
            testID="tenant-list-empty-add"
          >
            {t('tenant.list.addLabel')}
          </Button>
        ) : undefined
      }
      testID="tenant-list-empty-state"
    />
  );

  return (
    <StyledContainer role="main" aria-label={t('tenant.list.title')}>
      <StyledContent>
        <StyledHeaderRow>
          <Text variant="h1" accessibilityRole="header" testID="tenant-list-title">
            {t('tenant.list.title')}
          </Text>
          {onAdd && (
            <Button
              variant="primary"
              onPress={onAdd}
              accessibilityLabel={t('tenant.list.addLabel')}
              accessibilityHint={t('tenant.list.addHint')}
              testID="tenant-list-add"
            >
              {t('tenant.list.addLabel')}
            </Button>
          )}
        </StyledHeaderRow>
        <StyledListBody role="region" aria-label={t('tenant.list.accessibilityLabel')} data-testid="tenant-list">
          {isLoading && <LoadingSpinner accessibilityLabel={t('common.loading')} testID="tenant-list-loading" />}
          {!isLoading && hasError && (
            <>
              <ErrorState
                title={t('listScaffold.errorState.title')}
                description={errorMessage}
                action={
                  onRetry ? (
                    <Button
                      variant="primary"
                      onPress={onRetry}
                      accessibilityLabel={t('common.retry')}
                      accessibilityHint={t('common.retryHint')}
                      testID="tenant-list-retry"
                    >
                      {t('common.retry')}
                    </Button>
                  ) : undefined
                }
                testID="tenant-list-error"
              />
              {emptyComponent}
            </>
          )}
          {!isLoading && isOffline && (
            <>
              <OfflineState
                action={
                  onRetry ? (
                    <Button
                      variant="primary"
                      onPress={onRetry}
                      accessibilityLabel={t('common.retry')}
                      accessibilityHint={t('common.retryHint')}
                      testID="tenant-list-retry"
                    >
                      {t('common.retry')}
                    </Button>
                  ) : undefined
                }
                testID="tenant-list-offline"
              />
              {emptyComponent}
            </>
          )}
          {!isLoading && !hasError && !isOffline && items.length === 0 && emptyComponent}
          {!isLoading && !hasError && !isOffline && items.length > 0 && (
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
                          variant="ghost"
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
      </StyledContent>
    </StyledContainer>
  );
};

export default TenantListScreenWeb;
