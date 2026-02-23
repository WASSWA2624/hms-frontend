import React, { useEffect, useRef, useState } from 'react';
import { useWindowDimensions } from 'react-native';
import {
  Button,
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
import breakpoints from '@theme/breakpoints';
import EntitlementBlockedState from '../components/EntitlementBlockedState';
import PatientListCards from '../components/PatientListCards';
import {
  StyledAdvancedFilters,
  StyledBreadcrumbActionGroup,
  StyledContainer,
  StyledFilterActions,
  StyledListCard,
  StyledPaginationActions,
  StyledPaginationRow,
  StyledRowsControl,
  StyledRowsSelectSlot,
  StyledSearchHelpAnchor,
  StyledSearchHelpBody,
  StyledSearchHelpButton,
  StyledSearchHelpItem,
  StyledSearchHelpList,
  StyledSearchInputSlot,
  StyledSearchRow,
  StyledToolbarCard,
  StyledToolbarField,
  StyledToolbarGrid,
} from './PatientDirectoryScreen.styles';
import usePatientDirectoryScreen from './usePatientDirectoryScreen';

const PatientDirectoryScreen = () => {
  const { t } = useI18n();
  const { width } = useWindowDimensions();
  const isCompactHeaderActions = width < breakpoints.tablet;
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
          size="medium"
          onPress={onRetry}
          accessibilityLabel={t('patients.directory.refresh')}
          icon={<Icon glyph={'\u21bb'} size="xs" decorative />}
        >
          {!isCompactHeaderActions ? t('patients.directory.refresh') : null}
        </Button>
        <Button
          variant="surface"
          size="medium"
          onPress={onToggleFilterPanel}
          accessibilityLabel={t(
            isFilterPanelOpen
              ? 'patients.directory.hideFilters'
              : 'patients.directory.showFilters'
          )}
          icon={<Icon glyph={'\u2699'} size="xs" decorative />}
          testID="patient-directory-toggle-filters"
        >
          {!isCompactHeaderActions
            ? (isFilterPanelOpen
              ? t('patients.directory.hideFilters')
              : t('patients.directory.showFilters'))
            : null}
        </Button>
        {canCreatePatientRecords ? (
          <Button
            variant="surface"
            size="medium"
            onPress={onQuickCreate}
            accessibilityLabel={t('patients.directory.createPatient')}
            icon={<Icon glyph={'\u2795'} size="xs" decorative />}
          >
            {!isCompactHeaderActions ? t('patients.directory.createPatient') : null}
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
    isCompactHeaderActions,
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
                  label={t('patients.directory.searchLabel')}
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
                size="medium"
                onPress={onClearFilters}
                accessibilityLabel={t('patients.directory.clearFilters')}
                icon={<Icon glyph={'\u2715'} size="xs" decorative />}
                testID="patient-directory-clear-filters"
              >
                {t('patients.directory.clearFilters')}
              </Button>
              <Button
                variant="surface"
                size="medium"
                onPress={onApplyFilters}
                accessibilityLabel={t('patients.directory.applyFilters')}
                icon={<Icon glyph={'\u2713'} size="xs" decorative />}
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
        size="medium"
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
              size="medium"
              onPress={onRetry}
              accessibilityLabel={t('common.retry')}
              icon={<Icon glyph={'\u21bb'} size="xs" decorative />}
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
              size="medium"
              onPress={onRetry}
              accessibilityLabel={t('common.retry')}
              icon={<Icon glyph={'\u21bb'} size="xs" decorative />}
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
                    size="medium"
                    onPress={onPreviousPage}
                    disabled={page <= 1}
                    accessibilityLabel={t('patients.directory.previousPage')}
                    icon={<Icon glyph={'\u2039'} size="xs" decorative />}
                  >
                    {t('patients.directory.previousPage')}
                  </Button>
                  <Button
                    variant="surface"
                    size="medium"
                    onPress={onNextPage}
                    disabled={page >= pagination.totalPages}
                    accessibilityLabel={t('patients.directory.nextPage')}
                    icon={<Icon glyph={'\u203a'} size="xs" decorative />}
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

