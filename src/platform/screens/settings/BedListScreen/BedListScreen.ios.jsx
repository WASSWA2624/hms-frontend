/**
 * BedListScreen - iOS
 * File: BedListScreen.ios.jsx
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
} from './BedListScreen.ios.styles';
import useBedListScreen from './useBedListScreen';

const resolveBedStatusLabel = (t, status) => {
  const normalizedStatus = String(status ?? '').trim();
  if (!normalizedStatus) return '';
  const key = `bed.form.statusOptions.${normalizedStatus}`;
  const resolved = t(key);
  return resolved === key ? normalizedStatus : resolved;
};

const BedListScreenIOS = () => {
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
    onBedPress,
    onDelete,
    onAdd,
  } = useBedListScreen();

  const emptyComponent = (
    <EmptyState
      title={t('bed.list.emptyTitle')}
      description={t('bed.list.emptyMessage')}
      action={
        onAdd ? (
          <StyledAddButton
            onPress={onAdd}
            accessibilityRole="button"
            accessibilityLabel={t('bed.list.addLabel')}
            accessibilityHint={t('bed.list.addHint')}
            testID="bed-list-empty-add"
          >
            <Icon glyph="+" size="xs" decorative />
            <StyledAddLabel>{t('bed.list.addLabel')}</StyledAddLabel>
          </StyledAddButton>
        ) : undefined
      }
      testID="bed-list-empty-state"
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
      testID="bed-list-retry"
    >
      {t('common.retry')}
    </Button>
  ) : undefined;
  const showError = !isLoading && hasError && !isOffline;
  const showOffline = !isLoading && isOffline;
  const showEmpty = !isLoading && items.length === 0;
  const showList = items.length > 0;

  const renderItem = ({ item: bed }) => {
    const title = bed?.label ?? bed?.id ?? '';
    const statusLabel = resolveBedStatusLabel(t, bed?.status);
    const subtitle = statusLabel ? `${t('bed.list.statusLabel')}: ${statusLabel}` : '';
    return (
      <ListItem
        title={title}
        subtitle={subtitle}
        onPress={() => onBedPress(bed.id)}
        actions={onDelete ? (
          <Button
            variant="surface"
            size="small"
            onPress={(e) => onDelete(bed.id, e)}
            accessibilityLabel={t('bed.list.delete')}
            accessibilityHint={t('bed.list.deleteHint')}
            icon={<Icon glyph="?" size="xs" decorative />}
            testID={`bed-delete-${bed.id}`}
          >
            {t('common.remove')}
          </Button>
        ) : undefined}
        accessibilityLabel={t('bed.list.itemLabel', { name: title })}
        accessibilityHint={t('bed.list.itemHint', { name: title })}
        testID={`bed-item-${bed.id}`}
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
          testID="bed-list-notice"
        />
      ) : null}
      <StyledContent>
        <StyledToolbar testID="bed-list-toolbar">
          <StyledSearchSlot>
            <TextField
              value={search}
              onChangeText={onSearch}
              placeholder={t('bed.list.searchPlaceholder')}
              accessibilityLabel={t('bed.list.searchLabel')}
              density="compact"
              testID="bed-list-search"
            />
          </StyledSearchSlot>
          <StyledToolbarActions>
            {onAdd && (
              <StyledAddButton
                onPress={onAdd}
                accessibilityRole="button"
                accessibilityLabel={t('bed.list.addLabel')}
                accessibilityHint={t('bed.list.addHint')}
                testID="bed-list-add"
              >
                <Icon glyph="+" size="xs" decorative />
                <StyledAddLabel>{t('bed.list.addLabel')}</StyledAddLabel>
              </StyledAddButton>
            )}
          </StyledToolbarActions>
        </StyledToolbar>
        <Card
          variant="outlined"
          accessibilityLabel={t('bed.list.accessibilityLabel')}
          testID="bed-list-card"
        >
          <StyledListBody>
            <StyledStateStack>
              {showError && (
                <ErrorState
                  size={ErrorStateSizes.SMALL}
                  title={t('listScaffold.errorState.title')}
                  description={errorMessage}
                  action={retryAction}
                  testID="bed-list-error"
                />
              )}
              {showOffline && (
                <OfflineState
                  size={OfflineStateSizes.SMALL}
                  title={t('shell.banners.offline.title')}
                  description={t('shell.banners.offline.message')}
                  action={retryAction}
                  testID="bed-list-offline"
                />
              )}
            </StyledStateStack>
            {isLoading && (
              <LoadingSpinner accessibilityLabel={t('common.loading')} testID="bed-list-loading" />
            )}
            {showEmpty && emptyComponent}
            {showList ? (
              <StyledList>
                <FlatList
                  data={items}
                  keyExtractor={(bed) => bed.id}
                  renderItem={renderItem}
                  ItemSeparatorComponent={ItemSeparator}
                  scrollEnabled={false}
                  accessibilityLabel={t('bed.list.accessibilityLabel')}
                  testID="bed-list-flatlist"
                />
              </StyledList>
            ) : null}
          </StyledListBody>
        </Card>
      </StyledContent>
    </StyledContainer>
  );
};

export default BedListScreenIOS;
