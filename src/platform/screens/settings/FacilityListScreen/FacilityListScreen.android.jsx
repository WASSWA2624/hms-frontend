/**
 * FacilityListScreen - Android
 * File: FacilityListScreen.android.jsx
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
} from './FacilityListScreen.android.styles';
import useFacilityListScreen from './useFacilityListScreen';

const resolveFacilityTypeLabel = (t, value) => {
  if (!value) return '';
  const key = `facility.form.type${value}`;
  const resolved = t(key);
  return resolved === key ? value : resolved;
};

const FacilityListScreenAndroid = () => {
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
            onPress={onAdd}
            accessibilityRole="button"
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

  const ItemSeparator = () => <StyledSeparator />;
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

  const renderItem = ({ item: facility }) => {
    const title = facility?.name ?? facility?.id ?? '';
    const typeLabel = resolveFacilityTypeLabel(t, facility?.facility_type);
    const subtitle = typeLabel ? `${t('facility.list.typeLabel')}: ${typeLabel}` : '';
    return (
      <ListItem
        title={title}
        subtitle={subtitle}
        onPress={() => onFacilityPress(facility.id)}
        actions={onDelete ? (
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
        ) : undefined}
        accessibilityLabel={t('facility.list.itemLabel', { name: title })}
        accessibilityHint={t('facility.list.itemHint', { name: title })}
        testID={`facility-item-${facility.id}`}
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
          testID="facility-list-notice"
        />
      ) : null}
      <StyledContent>
        <StyledToolbar testID="facility-list-toolbar">
          <StyledSearchSlot>
            <TextField
              value={search}
              onChangeText={onSearch}
              placeholder={t('facility.list.searchPlaceholder')}
              accessibilityLabel={t('facility.list.searchLabel')}
              accessibilityHint={t('facility.list.searchHint')}
              density="compact"
              type="search"
              testID="facility-list-search"
            />
          </StyledSearchSlot>
          <StyledToolbarActions>
            {onAdd && (
              <StyledAddButton
                onPress={onAdd}
                accessibilityRole="button"
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
          <StyledListBody>
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
            {showList ? (
              <StyledList>
                <FlatList
                  data={items}
                  keyExtractor={(f) => f.id}
                  renderItem={renderItem}
                  ItemSeparatorComponent={ItemSeparator}
                  scrollEnabled={false}
                  accessibilityLabel={t('facility.list.accessibilityLabel')}
                  testID="facility-list-flatlist"
                />
              </StyledList>
            ) : null}
          </StyledListBody>
        </Card>
      </StyledContent>
    </StyledContainer>
  );
};

export default FacilityListScreenAndroid;
