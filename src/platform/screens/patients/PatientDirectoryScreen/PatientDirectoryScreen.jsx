import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components/native';
import {
  Button,
  Card,
  EmptyState,
  ErrorState,
  ErrorStateSizes,
  GlobalDateRangeField,
  Icon,
  LoadingSpinner,
  Modal,
  OfflineState,
  OfflineStateSizes,
  Select,
  Text,
  TextField,
  Tooltip,
} from '@platform/components';
import { useMainRouteHeaderActions } from '@platform/layouts/RouteLayouts/MainRouteLayout';
import { useI18n } from '@hooks';
import {
  EntitlementBlockedState,
  PatientListCards,
} from '../components';
import usePatientDirectoryScreen from './usePatientDirectoryScreen';

const StyledContainer = styled.View`
  width: 100%;
  align-self: center;
  max-width: 1180px;
  gap: 16px;
  padding-bottom: 16px;
`;

const StyledBreadcrumbActionGroup = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
  align-items: center;
  justify-content: flex-start;
  gap: 8px;
`;

const StyledToolbarCard = styled(Card)`
  gap: 4px;
  padding: 4px;
  overflow: visible;
`;

const StyledAdvancedFilters = styled.View`
  gap: 10px;
  border-top-width: 1px;
  border-top-color: ${({ theme }) => theme.colors.border?.subtle || '#e2e8f0'};
  padding-top: 10px;
`;

const StyledToolbarGrid = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px;
`;

const StyledToolbarField = styled.View`
  flex-basis: 280px;
  flex-grow: 1;
  min-width: 180px;
`;

const StyledSearchRow = styled.View`
  flex-direction: row;
  align-items: center;
  gap: 8px;
`;

const StyledSearchInputSlot = styled.View`
  flex: 1;
  min-width: 220px;
`;

const StyledSearchHelpAnchor = styled.View`
  position: relative;
  z-index: 2147483002;
`;

const StyledSearchHelpButton = styled.Pressable`
  width: 24px;
  height: 24px;
  border-radius: 999px;
  align-items: center;
  justify-content: center;
  border-width: 1px;
  border-color: ${({ theme }) => theme.colors.border?.default || '#b8c2d4'};
  background-color: ${({ theme }) => theme.colors.background?.surface || '#ffffff'};
`;

const StyledSearchHelpBody = styled(Text)`
  margin-top: 8px;
`;

const StyledSearchHelpList = styled.View`
  margin-top: 10px;
  gap: 6px;
`;

const StyledSearchHelpItem = styled(Text)`
  font-size: 12px;
`;

const StyledListCard = styled(Card)`
  gap: 6px;
  padding: 4px;
`;

const StyledPaginationRow = styled.View`
  margin-top: 4px;
  flex-direction: row;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
`;

const StyledPaginationActions = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px;
`;

const StyledRowsControl = styled.View`
  flex-direction: row;
  align-items: center;
  gap: 6px;
`;

const StyledRowsSelectSlot = styled.View`
  width: 96px;
`;

const StyledFilterActions = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: flex-start;
  gap: 8px;
`;

const PatientDirectoryScreen = () => {
  const { t } = useI18n();
  const { setBeforeBackActions, clearBeforeBackActions } = useMainRouteHeaderActions();
  const [isSearchTooltipVisible, setIsSearchTooltipVisible] = useState(false);
  const [isSearchHelpOpen, setIsSearchHelpOpen] = useState(false);
  const searchHelpButtonRef = useRef(null);
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
    isFilterPanelOpen,
    filters,
    dateRangePresets,
    hasActiveFilters,
    genderFilterValues,
    appointmentStatusFilterValues,
    datePresetValues,
    onSearch,
    onSortBy,
    onOrder,
    onPageSize,
    onPreviousPage,
    onNextPage,
    onOpenPatient,
    onEditPatient,
    onDeletePatient,
    onQuickCreate,
    onRetry,
    onGoToSubscriptions,
    onToggleFilterPanel,
    onFilterChange,
    onDateRangePresetChange,
    onDateRangeValueChange,
    onClearDateRange,
    onApplyFilters,
    onClearFilters,
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
  const genderOptions = genderFilterValues.map((value) => ({
    value,
    label: value
      ? t(`patients.resources.patients.options.gender.${value.toLowerCase()}`)
      : t('patients.directory.anyGender'),
  }));
  const appointmentStatusOptions = appointmentStatusFilterValues.map((value) => ({
    value,
    label: value
      ? t(`patients.directory.appointmentStatusOptions.${value}`)
      : t('patients.directory.anyAppointmentStatus'),
  }));
  const datePresetOptions = datePresetValues.map((value) => ({
    value,
    label: t(`patients.directory.dateRangePresets.${value}`),
  }));

  useEffect(() => {
    setBeforeBackActions(
      <StyledBreadcrumbActionGroup>
        <Button
          variant="surface"
          size="small"
          onPress={onRetry}
          accessibilityLabel={t('patients.directory.refresh')}
        >
          {t('patients.directory.refresh')}
        </Button>
        <Button
          variant="surface"
          size="small"
          onPress={onToggleFilterPanel}
          accessibilityLabel={t(
            isFilterPanelOpen
              ? 'patients.directory.hideFilters'
              : 'patients.directory.showFilters'
          )}
          testID="patient-directory-toggle-filters"
        >
          {isFilterPanelOpen
            ? t('patients.directory.hideFilters')
            : t('patients.directory.showFilters')}
        </Button>
        {canCreatePatientRecords ? (
          <Button
            variant="surface"
            size="small"
            onPress={onQuickCreate}
            accessibilityLabel={t('patients.directory.createPatient')}
          >
            {t('patients.directory.createPatient')}
          </Button>
        ) : null}
      </StyledBreadcrumbActionGroup>
    );

    return () => {
      clearBeforeBackActions();
    };
  }, [
    canCreatePatientRecords,
    clearBeforeBackActions,
    isFilterPanelOpen,
    onQuickCreate,
    onRetry,
    onToggleFilterPanel,
    setBeforeBackActions,
    t,
  ]);

  return (
    <StyledContainer>
      <StyledToolbarCard variant="outlined">
        <StyledToolbarGrid>
          <StyledToolbarField>
            <StyledSearchRow>
              <StyledSearchInputSlot>
                <TextField
                  value={searchValue}
                  placeholder={t('patients.directory.searchPlaceholder')}
                  onChange={(event) => onSearch(event?.target?.value)}
                  density="compact"
                  testID="patient-directory-search"
                />
              </StyledSearchInputSlot>
              <StyledSearchHelpAnchor>
                <StyledSearchHelpButton
                  ref={searchHelpButtonRef}
                  accessibilityRole="button"
                  accessibilityLabel={t('patients.directory.searchHelpTitle')}
                  onPress={() => setIsSearchHelpOpen(true)}
                  onHoverIn={() => setIsSearchTooltipVisible(true)}
                  onHoverOut={() => setIsSearchTooltipVisible(false)}
                  onFocus={() => setIsSearchTooltipVisible(true)}
                  onBlur={() => setIsSearchTooltipVisible(false)}
                  testID="patient-directory-search-help"
                >
                  <Icon glyph="?" size="xs" decorative />
                </StyledSearchHelpButton>
                <Tooltip
                  visible={isSearchTooltipVisible && !isSearchHelpOpen}
                  text={t('patients.directory.searchHelpTooltip')}
                  position="right"
                  anchorRef={searchHelpButtonRef}
                />
              </StyledSearchHelpAnchor>
            </StyledSearchRow>
          </StyledToolbarField>
        </StyledToolbarGrid>

        {isFilterPanelOpen ? (
          <StyledAdvancedFilters>
            <StyledToolbarGrid>
              <StyledToolbarField>
                <TextField
                  label={t('patients.directory.patientIdLabel')}
                  value={filters.patient_id}
                  placeholder={t('patients.directory.patientIdPlaceholder')}
                  onChange={(event) => onFilterChange('patient_id', event?.target?.value)}
                  onChangeText={(value) => onFilterChange('patient_id', value)}
                  density="compact"
                  testID="patient-directory-filter-patient-id"
                />
              </StyledToolbarField>

              <StyledToolbarField>
                <TextField
                  label={t('patients.directory.firstNameLabel')}
                  value={filters.first_name}
                  placeholder={t('patients.directory.firstNamePlaceholder')}
                  onChange={(event) => onFilterChange('first_name', event?.target?.value)}
                  onChangeText={(value) => onFilterChange('first_name', value)}
                  density="compact"
                  testID="patient-directory-filter-first-name"
                />
              </StyledToolbarField>

              <StyledToolbarField>
                <TextField
                  label={t('patients.directory.lastNameLabel')}
                  value={filters.last_name}
                  placeholder={t('patients.directory.lastNamePlaceholder')}
                  onChange={(event) => onFilterChange('last_name', event?.target?.value)}
                  onChangeText={(value) => onFilterChange('last_name', value)}
                  density="compact"
                  testID="patient-directory-filter-last-name"
                />
              </StyledToolbarField>

              <StyledToolbarField>
                <Select
                  label={t('patients.directory.genderLabel')}
                  value={filters.gender}
                  options={genderOptions}
                  onValueChange={(value) => onFilterChange('gender', value)}
                  compact
                  testID="patient-directory-filter-gender"
                />
              </StyledToolbarField>

              <StyledToolbarField>
                <TextField
                  type="date"
                  label={t('patients.directory.dateOfBirthLabel')}
                  value={filters.date_of_birth}
                  placeholder={t('patients.directory.dateOfBirthPlaceholder')}
                  onChange={(event) => onFilterChange('date_of_birth', event?.target?.value)}
                  onChangeText={(value) => onFilterChange('date_of_birth', value)}
                  density="compact"
                  testID="patient-directory-filter-dob"
                />
              </StyledToolbarField>

              <StyledToolbarField>
                <TextField
                  label={t('patients.directory.contactLabel')}
                  value={filters.contact}
                  placeholder={t('patients.directory.contactPlaceholder')}
                  onChange={(event) => onFilterChange('contact', event?.target?.value)}
                  onChangeText={(value) => onFilterChange('contact', value)}
                  density="compact"
                  testID="patient-directory-filter-contact"
                />
              </StyledToolbarField>

              <StyledToolbarField>
                <Select
                  label={t('patients.directory.appointmentStatusLabel')}
                  value={filters.appointment_status}
                  options={appointmentStatusOptions}
                  onValueChange={(value) => onFilterChange('appointment_status', value)}
                  compact
                  testID="patient-directory-filter-appointment-status"
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
            </StyledToolbarGrid>

            <GlobalDateRangeField
              label={t('patients.directory.createdRangeLabel')}
              helperText={t('patients.directory.createdRangeHint')}
              presetLabel={t('patients.directory.dateRangePresetLabel')}
              preset={dateRangePresets.created}
              presetOptions={datePresetOptions}
              onPresetChange={(value) => onDateRangePresetChange('created', value)}
              fromLabel={t('patients.directory.dateRangeFromLabel')}
              toLabel={t('patients.directory.dateRangeToLabel')}
              fromValue={filters.created_from}
              toValue={filters.created_to}
              onFromChange={(value) => onDateRangeValueChange('created', 'from', value)}
              onToChange={(value) => onDateRangeValueChange('created', 'to', value)}
              clearLabel={t('patients.directory.clearDateRange')}
              onClear={() => onClearDateRange('created')}
              testID="patient-directory-created-range"
            />

            <GlobalDateRangeField
              label={t('patients.directory.appointmentRangeLabel')}
              helperText={t('patients.directory.appointmentRangeHint')}
              presetLabel={t('patients.directory.dateRangePresetLabel')}
              preset={dateRangePresets.appointments}
              presetOptions={datePresetOptions}
              onPresetChange={(value) => onDateRangePresetChange('appointments', value)}
              fromLabel={t('patients.directory.dateRangeFromLabel')}
              toLabel={t('patients.directory.dateRangeToLabel')}
              fromValue={filters.appointment_from}
              toValue={filters.appointment_to}
              onFromChange={(value) => onDateRangeValueChange('appointments', 'from', value)}
              onToChange={(value) => onDateRangeValueChange('appointments', 'to', value)}
              clearLabel={t('patients.directory.clearDateRange')}
              onClear={() => onClearDateRange('appointments')}
              testID="patient-directory-appointment-range"
            />

            <StyledFilterActions>
              <Button
                variant="surface"
                size="small"
                onPress={onClearFilters}
                accessibilityLabel={t('patients.directory.clearFilters')}
                testID="patient-directory-clear-filters"
              >
                {t('patients.directory.clearFilters')}
              </Button>
              <Button
                variant="surface"
                size="small"
                onPress={onApplyFilters}
                accessibilityLabel={t('patients.directory.applyFilters')}
                testID="patient-directory-apply-filters"
              >
                {t('patients.directory.applyFilters')}
              </Button>
            </StyledFilterActions>
          </StyledAdvancedFilters>
        ) : null}
      </StyledToolbarCard>

      <Modal
        visible={isSearchHelpOpen}
        onDismiss={() => setIsSearchHelpOpen(false)}
        size="small"
        accessibilityLabel={t('patients.directory.searchHelpTitle')}
        accessibilityHint={t('patients.directory.searchHelpBody')}
        testID="patient-directory-search-help-modal"
      >
        <Text variant="h4">{t('patients.directory.searchHelpTitle')}</Text>
        <StyledSearchHelpBody variant="body">{t('patients.directory.searchHelpBody')}</StyledSearchHelpBody>
        <StyledSearchHelpList>
          <StyledSearchHelpItem variant="caption">
            - {t('patients.directory.searchHelpItems.global')}
          </StyledSearchHelpItem>
          <StyledSearchHelpItem variant="caption">
            - {t('patients.directory.searchHelpItems.advanced')}
          </StyledSearchHelpItem>
          <StyledSearchHelpItem variant="caption">
            - {t('patients.directory.searchHelpItems.actions')}
          </StyledSearchHelpItem>
        </StyledSearchHelpList>
      </Modal>

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
              {hasActiveFilters ? (
                <Text variant="caption">{t('patients.directory.filteredResults')}</Text>
              ) : null}
              <PatientListCards
                items={items}
                onOpenPatient={onOpenPatient}
                onEditPatient={onEditPatient}
                onDeletePatient={onDeletePatient}
                patientLabel={t('patients.directory.columns.patient')}
                patientIdLabel={t('patients.directory.columns.patientId')}
                tenantLabel={t('patients.directory.columns.tenant')}
                facilityLabel={t('patients.directory.columns.facility')}
                actionsLabel={t('patients.common.list.columnActions')}
                openButtonLabel={t('patients.directory.openWorkspace')}
                editButtonLabel={t('common.edit')}
                deleteButtonLabel={t('common.delete')}
                resolveOpenAccessibilityLabel={(patient) =>
                  t('patients.directory.actions.detailsHint', {
                    patient: patient?.displayName || t('patients.directory.columns.patient'),
                  })
                }
                resolveEditAccessibilityLabel={(patient) =>
                  t('patients.directory.actions.editHint', {
                    patient: patient?.displayName || t('patients.directory.columns.patient'),
                  })
                }
                resolveDeleteAccessibilityLabel={(patient) =>
                  t('patients.directory.actions.deleteHint', {
                    patient: patient?.displayName || t('patients.directory.columns.patient'),
                  })
                }
                testIdPrefix="patient-directory-item-"
              />

              <StyledPaginationRow>
                <Text variant="caption">
                  {t('patients.directory.pageSummary', {
                    page: pagination.page,
                    totalPages: pagination.totalPages,
                    total: pagination.total,
                  })}
                </Text>
                <StyledPaginationActions>
                  <StyledRowsControl>
                    <Text variant="caption">{t('patients.directory.pageSizeLabel')}</Text>
                    <StyledRowsSelectSlot>
                      <Select
                        value={String(pageSize)}
                        options={pageSizeSelectOptions}
                        onValueChange={onPageSize}
                        accessibilityLabel={t('patients.directory.pageSizeLabel')}
                        compact
                        testID="patient-directory-page-size"
                      />
                    </StyledRowsSelectSlot>
                  </StyledRowsControl>
                  <Button
                    variant="surface"
                    size="small"
                    onPress={onPreviousPage}
                    disabled={page <= 1}
                    accessibilityLabel={t('patients.directory.previousPage')}
                  >
                    {t('patients.directory.previousPage')}
                  </Button>
                  <Button
                    variant="surface"
                    size="small"
                    onPress={onNextPage}
                    disabled={page >= pagination.totalPages}
                    accessibilityLabel={t('patients.directory.nextPage')}
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
