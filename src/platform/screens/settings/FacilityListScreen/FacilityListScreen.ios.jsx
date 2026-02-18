/**
 * FacilityListScreen - iOS
 * File: FacilityListScreen.ios.jsx
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
} from './FacilityListScreen.ios.styles';
import useFacilityListScreen from './useFacilityListScreen';

const resolveFacilityTitle = (t, facility) => {
  const name = humanizeIdentifier(facility?.name);
  if (name) return String(name).trim();
  return t('facility.list.unnamed');
};

const resolveFacilityTypeValue = (facility) => String(facility?.facility_type ?? '').trim();
const resolveFacilityTypeLabel = (t, facility) => {
  const value = resolveFacilityTypeValue(facility);
  if (!value) return '';
  const key = `facility.form.type${value}`;
  const resolved = t(key);
  return resolved === key ? value : resolved;
};
const resolveFacilitySubtitle = (t, facility) => {
  const typeLabel = resolveFacilityTypeLabel(t, facility);
  if (typeLabel) return t('facility.list.typeValue', { type: typeLabel });
  return undefined;
};

const resolveFacilityMetadata = () => [];

const resolveFacilityLeadingGlyph = (title) => {
  const normalized = String(title || '').trim();
  if (!normalized) return 'F';
  return normalized.charAt(0).toUpperCase();
};

const FacilityListScreenIOS = () => {
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
    onFacilityPress,
    onEdit,
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
  const showOffline = !isLoading && isOffline && items.length === 0;
  const showOfflineBanner = !isLoading && isOffline && items.length > 0;
  const showEmpty = !isLoading && !showError && !showOffline && !hasNoResults && items.length === 0;
  const showNoResults = !isLoading && !showError && !showOffline && hasNoResults;
  const showList = items.length > 0;

  const renderItem = ({ item: facility, index }) => {
    const title = resolveFacilityTitle(t, facility);
    const leadingGlyph = resolveFacilityLeadingGlyph(title);
    const facilityId = facility?.id;
    const itemKey = facilityId ?? `facility-${index}`;
    const statusLabel = facility?.is_active
      ? t('facility.list.statusActive')
      : t('facility.list.statusInactive');
    const statusTone = facility?.is_active ? 'success' : 'warning';
    return (
      <ListItem
        leading={{ glyph: leadingGlyph, tone: 'inverse', backgroundTone: 'primary' }}
        title={title}
        subtitle={resolveFacilitySubtitle(t, facility)}
        metadata={resolveFacilityMetadata(t, facility)}
        status={{
          label: statusLabel,
          tone: statusTone,
          showDot: true,
          accessibilityLabel: t('facility.list.statusLabel'),
        }}
        density="compact"
        onPress={facilityId ? () => onFacilityPress(facilityId) : undefined}
        onView={facilityId ? () => onFacilityPress(facilityId) : undefined}
        onEdit={onEdit && facilityId ? (event) => onEdit(facilityId, event) : undefined}
        onDelete={onDelete && facilityId ? (event) => onDelete(facilityId, event) : undefined}
        viewLabel={t('facility.list.view')}
        viewHint={t('facility.list.viewHint')}
        editLabel={t('facility.list.edit')}
        editHint={t('facility.list.editHint')}
        deleteLabel={t('common.remove')}
        deleteHint={t('facility.list.deleteHint')}
        onMore={facilityId ? () => onFacilityPress(facilityId) : undefined}
        moreLabel={t('common.more')}
        moreHint={t('facility.list.viewHint')}
        viewTestID={`facility-view-${itemKey}`}
        editTestID={`facility-edit-${itemKey}`}
        deleteTestID={`facility-delete-${itemKey}`}
        moreTestID={`facility-more-${itemKey}`}
        accessibilityLabel={t('facility.list.itemLabel', { name: title })}
        accessibilityHint={t('facility.list.itemHint', { name: title })}
        testID={`facility-item-${itemKey}`}
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
              density="compact"
              type="search"
              testID="facility-list-search"
            />
          </StyledSearchSlot>
          <StyledScopeSlot>
            <Select
              value={searchScope}
              onValueChange={onSearchScopeChange}
              options={searchScopeOptions}
              label={t('facility.list.searchScopeLabel')}
              compact
              testID="facility-list-search-scope"
            />
          </StyledScopeSlot>
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
              {showOfflineBanner && (
                <OfflineState
                  size={OfflineStateSizes.SMALL}
                  title={t('shell.banners.offline.title')}
                  description={t('shell.banners.offline.message')}
                  action={retryAction}
                  testID="facility-list-offline-banner"
                />
              )}
            </StyledStateStack>
            {isLoading && (
              <LoadingSpinner accessibilityLabel={t('common.loading')} testID="facility-list-loading" />
            )}
            {showEmpty && emptyComponent}
            {showNoResults ? (
              <EmptyState
                title={t('facility.list.noResultsTitle')}
                description={t('facility.list.noResultsMessage')}
                action={(
                  <StyledAddButton
                    onPress={onClearSearchAndFilters}
                    accessibilityRole="button"
                    accessibilityLabel={t('facility.list.clearSearchAndFilters')}
                    testID="facility-list-clear-search"
                  >
                    <StyledAddLabel>{t('facility.list.clearSearchAndFilters')}</StyledAddLabel>
                  </StyledAddButton>
                )}
                testID="facility-list-no-results"
              />
            ) : null}
            {showList ? (
              <StyledList>
                <FlatList
                  data={items}
                  keyExtractor={(facility, index) => facility?.id ?? `facility-${index}`}
                  renderItem={renderItem}
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

export default FacilityListScreenIOS;

