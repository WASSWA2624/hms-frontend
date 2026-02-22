import React from 'react';
import styled from 'styled-components/native';
import {
  Button,
  Card,
  EmptyState,
  ErrorState,
  ErrorStateSizes,
  Icon,
  LoadingSpinner,
  OfflineState,
  OfflineStateSizes,
  Select,
  Text,
  TextField,
} from '@platform/components';
import { useI18n } from '@hooks';
import { EntitlementBlockedState, FieldHelpTrigger, InlineFieldGuide } from '../components';
import usePatientDirectoryScreen from './usePatientDirectoryScreen';

const StyledContainer = styled.View`
  flex: 1;
  gap: 16px;
`;

const StyledHeader = styled.View`
  gap: 8px;
`;

const StyledHeaderRow = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
`;

const StyledToolbarCard = styled(Card)`
  gap: 12px;
`;

const StyledToolbarGrid = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
  gap: 10px;
`;

const StyledToolbarField = styled.View`
  flex-basis: 220px;
  flex-grow: 1;
  min-width: 180px;
`;

const StyledListCard = styled(Card)`
  gap: 10px;
`;

const StyledListRow = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  border-width: 1px;
  border-color: ${({ theme }) => theme.colors.border?.subtle || '#e2e8f0'};
  border-radius: 10px;
  padding: 10px;
`;

const StyledRowMeta = styled.View`
  flex: 1;
  gap: 2px;
`;

const StyledPaginationRow = styled.View`
  margin-top: 4px;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
`;

const StyledPaginationActions = styled.View`
  flex-direction: row;
  align-items: center;
  gap: 8px;
`;

const PatientDirectoryScreen = () => {
  const { t } = useI18n();
  const {
    items,
    searchValue,
    page,
    pageSize,
    pageSizeOptions,
    sortBy,
    sortOptions,
    order,
    orderOptions,
    pagination,
    isLoading,
    isOffline,
    hasError,
    errorMessage,
    isEntitlementBlocked,
    canCreatePatientRecords,
    hasResults,
    onSearch,
    onSortBy,
    onOrder,
    onPageSize,
    onPreviousPage,
    onNextPage,
    onOpenPatient,
    onQuickCreate,
    onRetry,
    onGoToSubscriptions,
  } = usePatientDirectoryScreen();

  const sortSelectOptions = sortOptions.map((value) => ({
    value,
    label: t(`patients.directory.sortOptions.${value}`),
  }));
  const orderSelectOptions = orderOptions.map((value) => ({
    value,
    label: t(`patients.directory.orderOptions.${value}`),
  }));
  const pageSizeSelectOptions = pageSizeOptions.map((value) => ({
    value: String(value),
    label: String(value),
  }));

  return (
    <StyledContainer>
      <StyledHeader>
        <StyledHeaderRow>
          <Text variant="h2" accessibilityRole="header">
            {t('patients.directory.title')}
          </Text>
          <StyledPaginationActions>
            <Button
              variant="surface"
              size="small"
              onPress={onRetry}
              accessibilityLabel={t('patients.directory.refresh')}
              icon={<Icon glyph="?" size="xs" decorative />}
            >
              {t('patients.directory.refresh')}
            </Button>
            {canCreatePatientRecords ? (
              <Button
                variant="surface"
                size="small"
                onPress={onQuickCreate}
                accessibilityLabel={t('patients.directory.createPatient')}
                icon={<Icon glyph="+" size="xs" decorative />}
              >
                {t('patients.directory.createPatient')}
              </Button>
            ) : null}
          </StyledPaginationActions>
        </StyledHeaderRow>
        <Text variant="body">{t('patients.directory.description')}</Text>
      </StyledHeader>

      <StyledToolbarCard variant="outlined">
        <StyledToolbarGrid>
          <StyledToolbarField>
            <FieldHelpTrigger
              label={t('patients.directory.searchLabel')}
              tooltip={t('patients.common.list.helpTooltip')}
              helpTitle={t('patients.common.list.helpTitle')}
              helpBody={t('patients.common.list.helpBody', {
                resource: t('patients.resources.patients.pluralLabel'),
              })}
              helpItems={[
                t('patients.common.list.helpItems.search'),
                t('patients.common.list.helpItems.filter'),
              ]}
              testID="patient-directory-search-help"
            />
            <InlineFieldGuide text={t('patients.common.list.searchPlaceholder')} />
            <TextField
              value={searchValue}
              placeholder={t('patients.directory.searchPlaceholder')}
              onChange={(event) => onSearch(event?.target?.value)}
              density="compact"
              testID="patient-directory-search"
            />
          </StyledToolbarField>

          <StyledToolbarField>
            <Select
              label={t('patients.directory.sortLabel')}
              value={sortBy}
              options={sortSelectOptions}
              onValueChange={onSortBy}
              compact
              testID="patient-directory-sort-by"
            />
          </StyledToolbarField>

          <StyledToolbarField>
            <Select
              label={t('patients.directory.orderLabel')}
              value={order}
              options={orderSelectOptions}
              onValueChange={onOrder}
              compact
              testID="patient-directory-order"
            />
          </StyledToolbarField>

          <StyledToolbarField>
            <Select
              label={t('patients.directory.pageSizeLabel')}
              value={String(pageSize)}
              options={pageSizeSelectOptions}
              onValueChange={onPageSize}
              compact
              testID="patient-directory-page-size"
            />
          </StyledToolbarField>
        </StyledToolbarGrid>
      </StyledToolbarCard>

      {isLoading ? <LoadingSpinner accessibilityLabel={t('common.loading')} /> : null}

      {!isLoading && isEntitlementBlocked ? (
        <EntitlementBlockedState
          title={t('patients.entitlement.title')}
          description={t('patients.entitlement.description')}
          actionLabel={t('patients.entitlement.cta')}
          actionHint={t('patients.entitlement.ctaHint')}
          onAction={onGoToSubscriptions}
          testID="patient-directory-entitlement-blocked"
        />
      ) : null}

      {!isLoading && !isEntitlementBlocked && hasError && !isOffline ? (
        <ErrorState
          size={ErrorStateSizes.SMALL}
          title={t('patients.directory.loadError')}
          description={errorMessage}
          action={
            <Button
              variant="surface"
              size="small"
              onPress={onRetry}
              accessibilityLabel={t('common.retry')}
              icon={<Icon glyph="?" size="xs" decorative />}
            >
              {t('common.retry')}
            </Button>
          }
          testID="patient-directory-error"
        />
      ) : null}

      {!isLoading && !isEntitlementBlocked && isOffline ? (
        <OfflineState
          size={OfflineStateSizes.SMALL}
          title={t('shell.banners.offline.title')}
          description={t('shell.banners.offline.message')}
          action={
            <Button
              variant="surface"
              size="small"
              onPress={onRetry}
              accessibilityLabel={t('common.retry')}
              icon={<Icon glyph="?" size="xs" decorative />}
            >
              {t('common.retry')}
            </Button>
          }
          testID="patient-directory-offline"
        />
      ) : null}

      {!isLoading && !isEntitlementBlocked && !hasError ? (
        <StyledListCard variant="outlined">
          {hasResults ? (
            <>
              {items.map((item) => (
                <StyledListRow key={item.id || item.displayName}>
                  <StyledRowMeta>
                    <Text variant="label">{item.displayName}</Text>
                    <Text variant="caption">
                      {t('patients.directory.columns.patientId')}: {item.humanFriendlyId}
                    </Text>
                    <Text variant="caption">
                      {t('patients.directory.columns.tenant')}: {item.tenantLabel}
                    </Text>
                    <Text variant="caption">
                      {t('patients.directory.columns.facility')}: {item.facilityLabel}
                    </Text>
                  </StyledRowMeta>
                  <Button
                    variant="surface"
                    size="small"
                    onPress={() => onOpenPatient(item.id)}
                    accessibilityLabel={t('patients.directory.openWorkspace')}
                    icon={<Icon glyph="?" size="xs" decorative />}
                  >
                    {t('patients.directory.openWorkspace')}
                  </Button>
                </StyledListRow>
              ))}

              <StyledPaginationRow>
                <Text variant="caption">
                  {t('patients.directory.pageSummary', {
                    page: pagination.page,
                    totalPages: pagination.totalPages,
                    total: pagination.total,
                  })}
                </Text>
                <StyledPaginationActions>
                  <Button
                    variant="surface"
                    size="small"
                    onPress={onPreviousPage}
                    disabled={page <= 1}
                    accessibilityLabel={t('patients.directory.previousPage')}
                    icon={<Icon glyph="?" size="xs" decorative />}
                  >
                    {t('patients.directory.previousPage')}
                  </Button>
                  <Button
                    variant="surface"
                    size="small"
                    onPress={onNextPage}
                    disabled={page >= pagination.totalPages}
                    accessibilityLabel={t('patients.directory.nextPage')}
                    icon={<Icon glyph="?" size="xs" decorative />}
                  >
                    {t('patients.directory.nextPage')}
                  </Button>
                </StyledPaginationActions>
              </StyledPaginationRow>
            </>
          ) : (
            <EmptyState
              title={t('patients.directory.emptyTitle')}
              description={t('patients.directory.emptyMessage')}
              testID="patient-directory-empty"
            />
          )}
        </StyledListCard>
      ) : null}
    </StyledContainer>
  );
};

export default PatientDirectoryScreen;
