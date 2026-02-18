/**
 * DepartmentListScreen - Android
 * File: DepartmentListScreen.android.jsx
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
} from './DepartmentListScreen.android.styles';
import useDepartmentListScreen from './useDepartmentListScreen';

const resolveDepartmentTitle = (t, department) => {
  const name = humanizeIdentifier(department?.name);
  if (name) return String(name).trim();
  return t('department.list.unnamed');
};

const resolveDepartmentTypeValue = (department) => String(department?.department_type ?? '').trim();
const resolveDepartmentShortName = (department) => String(department?.short_name ?? '').trim();
const resolveDepartmentTypeLabel = (t, department) => {
  const value = resolveDepartmentTypeValue(department);
  if (!value) return '';
  const key = `department.form.type${value}`;
  const resolved = t(key);
  return resolved === key ? value : resolved;
};
const resolveDepartmentSubtitle = (t, department) => {
  const shortName = resolveDepartmentShortName(department);
  const typeLabel = resolveDepartmentTypeLabel(t, department);
  if (shortName && typeLabel) return t('department.list.subtitleTypeAndShort', { type: typeLabel, shortName });
  if (shortName) return t('department.list.shortNameValue', { shortName });
  if (typeLabel) return t('department.list.typeValue', { type: typeLabel });
  return undefined;
};

const resolveDepartmentMetadata = () => [];

const resolveDepartmentLeadingGlyph = (title) => {
  const normalized = String(title || '').trim();
  if (!normalized) return 'D';
  return normalized.charAt(0).toUpperCase();
};

const DepartmentListScreenAndroid = () => {
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
    onDepartmentPress,
    onEdit,
    onDelete,
    onAdd,
  } = useDepartmentListScreen();

  const emptyComponent = (
    <EmptyState
      title={t('department.list.emptyTitle')}
      description={t('department.list.emptyMessage')}
      action={
        onAdd ? (
          <StyledAddButton
            onPress={onAdd}
            accessibilityRole="button"
            accessibilityLabel={t('department.list.addLabel')}
            accessibilityHint={t('department.list.addHint')}
            testID="department-list-empty-add"
          >
            <Icon glyph="+" size="xs" decorative />
            <StyledAddLabel>{t('department.list.addLabel')}</StyledAddLabel>
          </StyledAddButton>
        ) : undefined
      }
      testID="department-list-empty-state"
    />
  );

  const retryAction = onRetry ? (
    <Button
      variant="primary"
      size="small"
      onPress={onRetry}
      accessibilityLabel={t('common.retry')}
      accessibilityHint={t('common.retryHint')}
      testID="department-list-retry"
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

  const renderItem = ({ item: department, index }) => {
    const title = resolveDepartmentTitle(t, department);
    const leadingGlyph = resolveDepartmentLeadingGlyph(title);
    const departmentId = department?.id;
    const itemKey = departmentId ?? `department-${index}`;
    const statusLabel = department?.is_active
      ? t('department.list.statusActive')
      : t('department.list.statusInactive');
    const statusTone = department?.is_active ? 'success' : 'warning';
    return (
      <ListItem
        leading={{ glyph: leadingGlyph, tone: 'inverse', backgroundTone: 'primary' }}
        title={title}
        subtitle={resolveDepartmentSubtitle(t, department)}
        metadata={resolveDepartmentMetadata(t, department)}
        status={{
          label: statusLabel,
          tone: statusTone,
          showDot: true,
          accessibilityLabel: t('department.list.statusLabel'),
        }}
        density="compact"
        onPress={departmentId ? () => onDepartmentPress(departmentId) : undefined}
        onView={departmentId ? () => onDepartmentPress(departmentId) : undefined}
        onEdit={onEdit && departmentId ? (event) => onEdit(departmentId, event) : undefined}
        onDelete={onDelete && departmentId ? (event) => onDelete(departmentId, event) : undefined}
        viewLabel={t('department.list.view')}
        viewHint={t('department.list.viewHint')}
        editLabel={t('department.list.edit')}
        editHint={t('department.list.editHint')}
        deleteLabel={t('common.remove')}
        deleteHint={t('department.list.deleteHint')}
        onMore={departmentId ? () => onDepartmentPress(departmentId) : undefined}
        moreLabel={t('common.more')}
        moreHint={t('department.list.viewHint')}
        viewTestID={`department-view-${itemKey}`}
        editTestID={`department-edit-${itemKey}`}
        deleteTestID={`department-delete-${itemKey}`}
        moreTestID={`department-more-${itemKey}`}
        accessibilityLabel={t('department.list.itemLabel', { name: title })}
        accessibilityHint={t('department.list.itemHint', { name: title })}
        testID={`department-item-${itemKey}`}
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
          testID="department-list-notice"
        />
      ) : null}
      <StyledContent>
        <StyledToolbar testID="department-list-toolbar">
          <StyledSearchSlot>
            <TextField
              value={search}
              onChangeText={onSearch}
              placeholder={t('department.list.searchPlaceholder')}
              accessibilityLabel={t('department.list.searchLabel')}
              density="compact"
              type="search"
              testID="department-list-search"
            />
          </StyledSearchSlot>
          <StyledScopeSlot>
            <Select
              value={searchScope}
              onValueChange={onSearchScopeChange}
              options={searchScopeOptions}
              label={t('department.list.searchScopeLabel')}
              compact
              testID="department-list-search-scope"
            />
          </StyledScopeSlot>
          <StyledToolbarActions>
            {onAdd && (
              <StyledAddButton
                onPress={onAdd}
                accessibilityRole="button"
                accessibilityLabel={t('department.list.addLabel')}
                accessibilityHint={t('department.list.addHint')}
                testID="department-list-add"
              >
                <Icon glyph="+" size="xs" decorative />
                <StyledAddLabel>{t('department.list.addLabel')}</StyledAddLabel>
              </StyledAddButton>
            )}
          </StyledToolbarActions>
        </StyledToolbar>
        <Card
          variant="outlined"
          accessibilityLabel={t('department.list.accessibilityLabel')}
          testID="department-list-card"
        >
          <StyledListBody>
            <StyledStateStack>
              {showError && (
                <ErrorState
                  size={ErrorStateSizes.SMALL}
                  title={t('listScaffold.errorState.title')}
                  description={errorMessage}
                  action={retryAction}
                  testID="department-list-error"
                />
              )}
              {showOffline && (
                <OfflineState
                  size={OfflineStateSizes.SMALL}
                  title={t('shell.banners.offline.title')}
                  description={t('shell.banners.offline.message')}
                  action={retryAction}
                  testID="department-list-offline"
                />
              )}
              {showOfflineBanner && (
                <OfflineState
                  size={OfflineStateSizes.SMALL}
                  title={t('shell.banners.offline.title')}
                  description={t('shell.banners.offline.message')}
                  action={retryAction}
                  testID="department-list-offline-banner"
                />
              )}
            </StyledStateStack>
            {isLoading && (
              <LoadingSpinner accessibilityLabel={t('common.loading')} testID="department-list-loading" />
            )}
            {showEmpty && emptyComponent}
            {showNoResults ? (
              <EmptyState
                title={t('department.list.noResultsTitle')}
                description={t('department.list.noResultsMessage')}
                action={(
                  <StyledAddButton
                    onPress={onClearSearchAndFilters}
                    accessibilityRole="button"
                    accessibilityLabel={t('department.list.clearSearchAndFilters')}
                    testID="department-list-clear-search"
                  >
                    <StyledAddLabel>{t('department.list.clearSearchAndFilters')}</StyledAddLabel>
                  </StyledAddButton>
                )}
                testID="department-list-no-results"
              />
            ) : null}
            {showList ? (
              <StyledList>
                <FlatList
                  data={items}
                  keyExtractor={(department, index) => department?.id ?? `department-${index}`}
                  renderItem={renderItem}
                  scrollEnabled={false}
                  accessibilityLabel={t('department.list.accessibilityLabel')}
                  testID="department-list-flatlist"
                />
              </StyledList>
            ) : null}
          </StyledListBody>
        </Card>
      </StyledContent>
    </StyledContainer>
  );
};

export default DepartmentListScreenAndroid;

