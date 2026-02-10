/**
 * FacilityListScreen - Web
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
} from './FacilityListScreen.web.styles';
import useFacilityListScreen from './useFacilityListScreen';

const resolveFacilityTypeLabel = (t, value) => {
  if (!value) return '';
  const key = `facility.form.type${value}`;
  const resolved = t(key);
  return resolved === key ? value : resolved;
};

const FacilityListScreenWeb = () => {
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
    onFacilityPress,
    onDelete,
    onAdd,
  } = useFacilityListScreen();

  const emptyComponent = (
    <EmptyState
      title={t('facility.list.emptyTitle')}
      description={t('facility.list.emptyMessage')}
      action={
        onAdd ? (
          <StyledAddButton
            type="button"
            onClick={onAdd}
            accessibilityLabel={t('facility.list.addLabel')}
            accessibilityHint={t('facility.list.addHint')}
            testID="facility-list-empty-add"
          >
            <Icon glyph="+" size="xs" decorative />
            <StyledAddLabel>{t('facility.list.addLabel')}</StyledAddLabel>
          </StyledAddButton>
        ) : undefined
      }
      testID="facility-list-empty-state"
    />
  );

  const retryAction = onRetry ? (
    <Button
      variant="primary"
      size="small"
      onPress={onRetry}
      accessibilityLabel={t('common.retry')}
      accessibilityHint={t('common.retryHint')}
      testID="facility-list-retry"
    >
      {t('common.retry')}
    </Button>
  ) : undefined;

  const showError = !isLoading && hasError && !isOffline;
  const showOffline = !isLoading && isOffline;
  const showEmpty = !isLoading && items.length === 0;
  const showList = items.length > 0;

  return (
    <StyledContainer role="main" aria-label={t('facility.list.title')}>
      {noticeMessage ? (
        <Snackbar
          visible={Boolean(noticeMessage)}
          message={noticeMessage}
          variant="success"
          position="bottom"
          onDismiss={onDismissNotice}
          testID="facility-list-notice"
        />
      ) : null}
      <StyledContent>
        <StyledToolbar data-testid="facility-list-toolbar">
          <StyledSearchSlot>
            <TextField
              value={search}
              onChange={(e) => onSearch(e.target.value)}
              placeholder={t('facility.list.searchPlaceholder')}
              accessibilityLabel={t('facility.list.searchLabel')}
              density="compact"
              type="search"
              testID="facility-list-search"
            />
          </StyledSearchSlot>
          <StyledToolbarActions>
            {onAdd && (
              <StyledAddButton
                type="button"
                onClick={onAdd}
                accessibilityLabel={t('facility.list.addLabel')}
                accessibilityHint={t('facility.list.addHint')}
                testID="facility-list-add"
              >
                <Icon glyph="+" size="xs" decorative />
                <StyledAddLabel>{t('facility.list.addLabel')}</StyledAddLabel>
              </StyledAddButton>
            )}
          </StyledToolbarActions>
        </StyledToolbar>
        <Card
          variant="outlined"
          accessibilityLabel={t('facility.list.accessibilityLabel')}
          testID="facility-list-card"
        >
          <StyledListBody role="region" aria-label={t('facility.list.accessibilityLabel')} data-testid="facility-list">
            <StyledStateStack>
              {showError && (
                <ErrorState
                  size={ErrorStateSizes.SMALL}
                  title={t('listScaffold.errorState.title')}
                  description={errorMessage}
                  action={retryAction}
                  testID="facility-list-error"
                />
              )}
              {showOffline && (
                <OfflineState
                  size={OfflineStateSizes.SMALL}
                  title={t('shell.banners.offline.title')}
                  description={t('shell.banners.offline.message')}
                  action={retryAction}
                  testID="facility-list-offline"
                />
              )}
            </StyledStateStack>
            {isLoading && (
              <LoadingSpinner accessibilityLabel={t('common.loading')} testID="facility-list-loading" />
            )}
            {showEmpty && emptyComponent}
            {showList && (
              <StyledList role="list">
                {items.map((facility) => {
                  const title = facility?.name ?? facility?.id ?? '';
                  const typeLabel = resolveFacilityTypeLabel(t, facility?.facility_type);
                  const subtitle = typeLabel ? `${t('facility.list.typeLabel')}: ${typeLabel}` : '';
                  return (
                    <li key={facility.id} role="listitem">
                      <ListItem
                        title={title}
                        subtitle={subtitle}
                        onPress={() => onFacilityPress(facility.id)}
                        actions={
                          <Button
                            variant="ghost"
                            size="small"
                            onPress={(e) => onDelete(facility.id, e)}
                            accessibilityLabel={t('facility.list.delete')}
                            accessibilityHint={t('facility.list.deleteHint')}
                            testID={`facility-delete-${facility.id}`}
                          >
                            {t('common.remove')}
                          </Button>
                        }
                        accessibilityLabel={t('facility.list.itemLabel', { name: title })}
                        accessibilityHint={t('facility.list.itemHint', { name: title })}
                        testID={`facility-item-${facility.id}`}
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

export default FacilityListScreenWeb;
