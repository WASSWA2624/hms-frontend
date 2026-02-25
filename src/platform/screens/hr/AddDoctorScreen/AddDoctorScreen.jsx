import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useRouter } from 'expo-router';
import {
  Button,
  Card,
  ErrorState,
  ErrorStateSizes,
  LoadingSpinner,
  PriceInputField,
  Select,
  Switch,
  Text,
  TextArea,
  TextField,
} from '@platform/components';
import { DOCTOR_ONBOARDING_ACCESS_POLICY } from '@config/accessPolicy';
import {
  useDoctor,
  useFacility,
  useI18n,
  useRole,
  useScopeAccess,
  useStaffPosition,
  useTenant,
} from '@hooks';
import {
  StyledCaption,
  StyledContainer,
  StyledGrid,
  StyledHeader,
  StyledInlineActions,
  StyledRowCard,
  StyledSection,
  StyledSectionTitle,
} from './AddDoctorScreen.styles';

const UUID_LIKE_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const CURRENCY_OPTIONS = ['USD', 'UGX', 'KES', 'TZS', 'RWF', 'EUR', 'GBP', 'CAD', 'AUD'];
const STATUS_OPTIONS = ['ACTIVE', 'INACTIVE', 'SUSPENDED', 'PENDING'];
const PRACTITIONER_OPTIONS = ['MO', 'SPECIALIST'];
const DAY_OPTIONS = [
  { value: 0, label: 'Sun' },
  { value: 1, label: 'Mon' },
  { value: 2, label: 'Tue' },
  { value: 3, label: 'Wed' },
  { value: 4, label: 'Thu' },
  { value: 5, label: 'Fri' },
  { value: 6, label: 'Sat' },
];

const sanitizeString = (value) => String(value || '').trim();
const isUuidLike = (value) => UUID_LIKE_REGEX.test(sanitizeString(value));
const isNonEmpty = (value) => sanitizeString(value).length > 0;

const resolveListItems = (value) => {
  if (Array.isArray(value)) return value;
  if (Array.isArray(value?.items)) return value.items;
  return [];
};

const resolvePublicId = (record) => {
  const candidate = sanitizeString(
    record?.human_friendly_id || record?.humanFriendlyId || record?.id
  );
  if (!candidate || isUuidLike(candidate)) return '';
  return candidate;
};

const resolveCurrencyFromExtension = (extension) => {
  if (!extension || typeof extension !== 'object') return '';
  const candidates = [
    extension.currency,
    extension.default_currency,
    extension.defaultCurrency,
    extension?.settings?.currency,
    extension?.settings?.default_currency,
    extension?.settings?.defaultCurrency,
    extension?.billing?.currency,
    extension?.billing?.default_currency,
    extension?.billing?.defaultCurrency,
    extension?.preferences?.currency,
    extension?.preferences?.default_currency,
    extension?.preferences?.defaultCurrency,
  ];
  const matched = candidates.find((value) => sanitizeString(value));
  return sanitizeString(matched).toUpperCase();
};

const toIsoFromTime = (timeValue, anchorDate = '1970-01-01') => {
  const normalized = sanitizeString(timeValue);
  if (!normalized) return '';
  const match = normalized.match(/^([01]\d|2[0-3]):([0-5]\d)$/);
  if (!match) return '';
  return `${anchorDate}T${match[1]}:${match[2]}:00.000Z`;
};

const toIsoDateStart = (dateValue) => {
  const normalized = sanitizeString(dateValue);
  if (!normalized) return '';
  if (!/^\d{4}-\d{2}-\d{2}$/.test(normalized)) return '';
  return `${normalized}T00:00:00.000Z`;
};

const hasAnyRole = (assignedRoles, requiredRoles) =>
  requiredRoles.some((role) => assignedRoles.includes(role));

const createRecurringRow = () => ({
  day_of_week: '1',
  start_time: '08:00',
  end_time: '17:00',
  timezone: 'UTC',
  effective_from: '',
  effective_to: '',
});

const createOverrideRow = () => ({
  schedule_index: '0',
  override_date: '',
  start_time: '08:00',
  end_time: '17:00',
  is_available: true,
});

const AddDoctorScreen = () => {
  const { t } = useI18n();
  const router = useRouter();
  const {
    roles,
    canManageAllTenants,
    tenantId,
    facilityId,
    isResolved,
  } = useScopeAccess('hr');
  const { create: createDoctor, isLoading, errorCode, reset: resetDoctorState } = useDoctor();
  const { list: listRoles } = useRole();
  const { list: listStaffPositions } = useStaffPosition();
  const { get: getFacilityRecord } = useFacility();
  const { get: getTenantRecord } = useTenant();

  const [roleOptions, setRoleOptions] = useState([]);
  const [positionOptions, setPositionOptions] = useState([]);
  const [globalCurrency, setGlobalCurrency] = useState('USD');
  const [submitError, setSubmitError] = useState('');
  const [submitSuccess, setSubmitSuccess] = useState('');
  const [selectedRoleCandidate, setSelectedRoleCandidate] = useState('');
  const [recurringRows, setRecurringRows] = useState([createRecurringRow()]);
  const [overrideRows, setOverrideRows] = useState([]);

  const [draft, setDraft] = useState({
    tenant_id: sanitizeString(tenantId),
    facility_id: sanitizeString(facilityId),
    email: '',
    phone: '',
    password: '',
    status: 'ACTIVE',
    position_title: '',
    practitioner_type: 'MO',
    position_id: '',
    position_name: '',
    consultation_fee: '',
    consultation_currency: 'USD',
    is_fee_overridden: false,
    role_ids: [],
    notes: '',
  });

  const canCreateDoctor =
    canManageAllTenants || hasAnyRole(roles, DOCTOR_ONBOARDING_ACCESS_POLICY.create);

  const statusOptions = useMemo(
    () => STATUS_OPTIONS.map((value) => ({ value, label: value })),
    []
  );
  const practitionerOptions = useMemo(
    () => PRACTITIONER_OPTIONS.map((value) => ({ value, label: value })),
    []
  );
  const dayOptions = useMemo(
    () => DAY_OPTIONS.map((option) => ({ value: String(option.value), label: option.label })),
    []
  );
  const currencyOptions = useMemo(() => {
    const values = [...CURRENCY_OPTIONS, sanitizeString(globalCurrency).toUpperCase()].filter(Boolean);
    return Array.from(new Set(values));
  }, [globalCurrency]);
  const isSpecialist = sanitizeString(draft.practitioner_type).toUpperCase() === 'SPECIALIST';

  useEffect(() => {
    if (!isResolved) return;
    setDraft((previous) => ({
      ...previous,
      tenant_id: sanitizeString(previous.tenant_id || tenantId),
      facility_id: sanitizeString(previous.facility_id || facilityId),
    }));
  }, [facilityId, isResolved, tenantId]);

  useEffect(() => {
    if (!isResolved) return;
    let isDisposed = false;

    const hydrateCurrency = async () => {
      const facilityCurrency =
        sanitizeString(facilityId) &&
        resolveCurrencyFromExtension((await getFacilityRecord(sanitizeString(facilityId)))?.extension_json);
      if (facilityCurrency) {
        if (!isDisposed) setGlobalCurrency(facilityCurrency);
        return;
      }

      const tenantCurrency =
        sanitizeString(tenantId) &&
        resolveCurrencyFromExtension((await getTenantRecord(sanitizeString(tenantId)))?.extension_json);
      if (!isDisposed) {
        setGlobalCurrency(tenantCurrency || 'USD');
      }
    };

    hydrateCurrency().catch(() => {
      if (!isDisposed) setGlobalCurrency('USD');
    });

    return () => {
      isDisposed = true;
    };
  }, [facilityId, getFacilityRecord, getTenantRecord, isResolved, tenantId]);

  useEffect(() => {
    setDraft((previous) => {
      if (sanitizeString(previous.consultation_currency)) return previous;
      return {
        ...previous,
        consultation_currency: globalCurrency,
      };
    });
  }, [globalCurrency]);

  useEffect(() => {
    if (!isResolved || !canCreateDoctor) return;
    let isDisposed = false;

    const loadLookups = async () => {
      const roleRows = resolveListItems(await listRoles({ page: 1, limit: 200, sort_by: 'name', order: 'asc' }));
      const positionRows = resolveListItems(
        await listStaffPositions({ page: 1, limit: 200, sort_by: 'name', order: 'asc' })
      );

      const nextRoleOptions = roleRows
        .map((role) => {
          const id = resolvePublicId(role);
          if (!id) return null;
          const name = sanitizeString(role?.name) || id;
          return { value: id, label: `${name} | ${id}` };
        })
        .filter(Boolean);

      const nextPositionOptions = positionRows
        .map((position) => {
          const id = resolvePublicId(position);
          if (!id) return null;
          const name = sanitizeString(position?.name) || id;
          return { value: id, label: `${name} | ${id}` };
        })
        .filter(Boolean);

      if (!isDisposed) {
        setRoleOptions(nextRoleOptions);
        setPositionOptions(nextPositionOptions);
      }
    };

    loadLookups().catch(() => {
      if (!isDisposed) {
        setRoleOptions([]);
        setPositionOptions([]);
      }
    });

    return () => {
      isDisposed = true;
    };
  }, [canCreateDoctor, isResolved, listRoles, listStaffPositions]);

  const updateDraft = useCallback((field, value) => {
    setSubmitError('');
    setSubmitSuccess('');
    setDraft((previous) => ({ ...previous, [field]: value }));
  }, []);

  const updateRecurringRow = useCallback((index, field, value) => {
    setRecurringRows((previous) =>
      previous.map((row, rowIndex) => (rowIndex === index ? { ...row, [field]: value } : row))
    );
  }, []);

  const updateOverrideRow = useCallback((index, field, value) => {
    setOverrideRows((previous) =>
      previous.map((row, rowIndex) => (rowIndex === index ? { ...row, [field]: value } : row))
    );
  }, []);

  const addRoleCandidate = useCallback(() => {
    const roleId = sanitizeString(selectedRoleCandidate);
    if (!roleId) return;
    setDraft((previous) => ({
      ...previous,
      role_ids: Array.from(new Set([...(previous.role_ids || []), roleId])),
    }));
    setSelectedRoleCandidate('');
  }, [selectedRoleCandidate]);

  const removeRole = useCallback((roleId) => {
    setDraft((previous) => ({
      ...previous,
      role_ids: (previous.role_ids || []).filter((entry) => entry !== roleId),
    }));
  }, []);

  const resetForm = useCallback(() => {
    setDraft({
      tenant_id: sanitizeString(tenantId),
      facility_id: sanitizeString(facilityId),
      email: '',
      phone: '',
      password: '',
      status: 'ACTIVE',
      position_title: '',
      practitioner_type: 'MO',
      position_id: '',
      position_name: '',
      consultation_fee: '',
      consultation_currency: globalCurrency || 'USD',
      is_fee_overridden: false,
      role_ids: [],
      notes: '',
    });
    setRecurringRows([createRecurringRow()]);
    setOverrideRows([]);
    setSelectedRoleCandidate('');
  }, [facilityId, globalCurrency, tenantId]);

  const handleSubmit = useCallback(async () => {
    setSubmitError('');
    setSubmitSuccess('');
    resetDoctorState();

    const tenantPublicId = sanitizeString(draft.tenant_id);
    const facilityPublicId = sanitizeString(draft.facility_id);
    const email = sanitizeString(draft.email);
    const password = sanitizeString(draft.password);
    const positionTitle = sanitizeString(draft.position_title);
    const practitionerType = sanitizeString(draft.practitioner_type).toUpperCase();
    const isCurrentSpecialist = practitionerType === 'SPECIALIST';

    if (!tenantPublicId) {
      setSubmitError('Tenant is required.');
      return;
    }
    if (!email) {
      setSubmitError('Email is required.');
      return;
    }
    if (!password) {
      setSubmitError('Password is required.');
      return;
    }
    if (!positionTitle) {
      setSubmitError('Position title is required.');
      return;
    }

    const recurringSchedules = [];
    for (let index = 0; index < recurringRows.length; index += 1) {
      const row = recurringRows[index];
      const dayOfWeek = Number(row.day_of_week);
      const startTime = toIsoFromTime(row.start_time, '1970-01-01');
      const endTime = toIsoFromTime(row.end_time, '1970-01-01');
      const effectiveFrom = toIsoDateStart(row.effective_from);
      const effectiveTo = toIsoDateStart(row.effective_to);

      if (!Number.isInteger(dayOfWeek) || dayOfWeek < 0 || dayOfWeek > 6) {
        setSubmitError(`Recurring schedule ${index + 1}: invalid day.`);
        return;
      }
      if (!startTime || !endTime) {
        setSubmitError(`Recurring schedule ${index + 1}: start/end time must be HH:mm.`);
        return;
      }

      recurringSchedules.push({
        day_of_week: dayOfWeek,
        start_time: startTime,
        end_time: endTime,
        timezone: sanitizeString(row.timezone) || 'UTC',
        effective_from: effectiveFrom || null,
        effective_to: effectiveTo || null,
      });
    }

    const scheduleOverrides = [];
    for (let index = 0; index < overrideRows.length; index += 1) {
      const row = overrideRows[index];
      const overrideDate = toIsoDateStart(row.override_date);
      const startTime = toIsoFromTime(row.start_time, sanitizeString(row.override_date) || '1970-01-01');
      const endTime = toIsoFromTime(row.end_time, sanitizeString(row.override_date) || '1970-01-01');
      if (!overrideDate || !startTime || !endTime) {
        setSubmitError(`Date override ${index + 1}: date and times are required.`);
        return;
      }

      scheduleOverrides.push({
        schedule_index: Number.isInteger(Number(row.schedule_index))
          ? Number(row.schedule_index)
          : 0,
        override_date: overrideDate,
        start_time: startTime,
        end_time: endTime,
        is_available: Boolean(row.is_available),
      });
    }

    if (isCurrentSpecialist && draft.is_fee_overridden && !isNonEmpty(draft.consultation_fee)) {
      setSubmitError('Consultation fee is required when specialist fee override is enabled.');
      return;
    }

    const payload = {
      tenant_id: tenantPublicId,
      facility_id: facilityPublicId || null,
      email,
      phone: sanitizeString(draft.phone) || null,
      password,
      status: sanitizeString(draft.status) || 'ACTIVE',
      position_title: positionTitle,
      practitioner_type: practitionerType || 'MO',
      position_id: sanitizeString(draft.position_id) || undefined,
      position_name: sanitizeString(draft.position_name) || undefined,
      consultation_fee:
        isCurrentSpecialist && draft.is_fee_overridden
          ? sanitizeString(draft.consultation_fee) || null
          : null,
      consultation_currency:
        isCurrentSpecialist && draft.is_fee_overridden
          ? sanitizeString(draft.consultation_currency).toUpperCase() || globalCurrency || 'USD'
          : null,
      is_fee_overridden: isCurrentSpecialist ? Boolean(draft.is_fee_overridden) : false,
      role_ids: draft.role_ids || [],
      recurring_schedules: recurringSchedules,
      schedule_overrides: scheduleOverrides,
    };

    const created = await createDoctor(payload);
    if (!created) {
      setSubmitError('Unable to create doctor. Check the form and try again.');
      return;
    }

    setSubmitSuccess('Doctor created successfully.');
    resetForm();
  }, [
    createDoctor,
    draft,
    globalCurrency,
    overrideRows,
    recurringRows,
    resetDoctorState,
    resetForm,
  ]);

  const roleChips = useMemo(
    () =>
      (draft.role_ids || []).map((roleId) => {
        const option = roleOptions.find((entry) => entry.value === roleId);
        return { value: roleId, label: option?.label || roleId };
      }),
    [draft.role_ids, roleOptions]
  );

  if (!isResolved) {
    return <LoadingSpinner accessibilityLabel={t('common.loading')} />;
  }

  if (!canCreateDoctor) {
    return (
      <ErrorState
        size={ErrorStateSizes.SMALL}
        title="Access denied"
        description="You do not have permission to onboard doctors."
      />
    );
  }

  return (
    <StyledContainer testID="add-doctor-screen">
      <StyledHeader>
        <div>
          <Text variant="h2" accessibilityRole="header">
            Add Doctor
          </Text>
          <Text variant="body">
            Account, title/position, practitioner fee, and schedules.
          </Text>
        </div>
        <StyledInlineActions>
          <Button variant="surface" size="small" onPress={() => router.push('/hr')}>
            Back
          </Button>
          <Button
            variant="primary"
            size="small"
            onPress={handleSubmit}
            disabled={isLoading}
            testID="add-doctor-submit"
          >
            Save doctor
          </Button>
        </StyledInlineActions>
      </StyledHeader>

      {submitError || errorCode ? (
        <ErrorState
          size={ErrorStateSizes.SMALL}
          title="Unable to save"
          description={submitError || errorCode}
        />
      ) : null}
      {submitSuccess ? <Text variant="caption">{submitSuccess}</Text> : null}

      <Card variant="outlined">
        <StyledSection>
          <StyledSectionTitle>Account</StyledSectionTitle>
          <StyledGrid>
            <TextField
              label="Tenant ID"
              value={draft.tenant_id}
              onChangeText={(value) => updateDraft('tenant_id', value)}
              density="compact"
              disabled={!canManageAllTenants}
            />
            <TextField
              label="Facility ID"
              value={draft.facility_id}
              onChangeText={(value) => updateDraft('facility_id', value)}
              density="compact"
              disabled={!canManageAllTenants}
            />
            <TextField
              label="Email"
              value={draft.email}
              onChangeText={(value) => updateDraft('email', value)}
              density="compact"
            />
            <TextField
              label="Phone"
              value={draft.phone}
              onChangeText={(value) => updateDraft('phone', value)}
              density="compact"
            />
            <TextField
              label="Password"
              value={draft.password}
              onChangeText={(value) => updateDraft('password', value)}
              density="compact"
            />
            <Select
              label="Status"
              value={draft.status}
              options={statusOptions}
              onValueChange={(value) => updateDraft('status', value)}
              compact
            />
          </StyledGrid>
        </StyledSection>
      </Card>

      <Card variant="outlined">
        <StyledSection>
          <StyledSectionTitle>Role, Title, Position</StyledSectionTitle>
          <StyledGrid>
            <TextField
              label="Position title"
              value={draft.position_title}
              onChangeText={(value) => updateDraft('position_title', value)}
              density="compact"
            />
            <Select
              label="Position (optional)"
              value={draft.position_id}
              options={positionOptions}
              onValueChange={(value) => updateDraft('position_id', value)}
              compact
              searchable
            />
            <TextField
              label="Custom position name"
              value={draft.position_name}
              onChangeText={(value) => updateDraft('position_name', value)}
              density="compact"
            />
          </StyledGrid>

          <StyledGrid>
            <Select
              label="Add role"
              value={selectedRoleCandidate}
              options={roleOptions}
              onValueChange={setSelectedRoleCandidate}
              compact
              searchable
            />
            <StyledInlineActions>
              <Button variant="surface" size="small" onPress={addRoleCandidate}>
                Add role
              </Button>
            </StyledInlineActions>
          </StyledGrid>

          <StyledInlineActions>
            {roleChips.map((role) => (
              <Button
                key={`role-chip-${role.value}`}
                variant="surface"
                size="small"
                onPress={() => removeRole(role.value)}
              >
                {`Remove ${role.label}`}
              </Button>
            ))}
          </StyledInlineActions>
        </StyledSection>
      </Card>

      <Card variant="outlined">
        <StyledSection>
          <StyledSectionTitle>Practitioner and Fee</StyledSectionTitle>
          <StyledGrid>
            <Select
              label="Practitioner type"
              value={draft.practitioner_type}
              options={practitionerOptions}
              onValueChange={(value) => updateDraft('practitioner_type', value)}
              compact
            />
            <Switch
              label="Fee override"
              value={Boolean(draft.is_fee_overridden)}
              onValueChange={(value) => updateDraft('is_fee_overridden', Boolean(value))}
              disabled={!isSpecialist}
            />
          </StyledGrid>
          {isSpecialist ? (
            <PriceInputField
              amountLabel="Consultation fee"
              amountValue={draft.consultation_fee}
              onAmountChange={(value) => updateDraft('consultation_fee', value)}
              currencyLabel="Currency"
              currencyValue={draft.consultation_currency}
              onCurrencyChange={(value) => updateDraft('consultation_currency', value)}
              currencyOptions={currencyOptions}
              amountTestId="add-doctor-consultation-fee"
              currencyTestId="add-doctor-consultation-currency"
            />
          ) : (
            <StyledCaption>Medical officers use the default consultation fee policy.</StyledCaption>
          )}
        </StyledSection>
      </Card>

      <Card variant="outlined">
        <StyledSection>
          <StyledHeader>
            <StyledSectionTitle>Recurring Schedule</StyledSectionTitle>
            <Button
              variant="surface"
              size="small"
              onPress={() => setRecurringRows((previous) => [...previous, createRecurringRow()])}
            >
              Add schedule
            </Button>
          </StyledHeader>
          {recurringRows.map((row, index) => (
            <StyledRowCard key={`recurring-row-${index + 1}`}>
              <StyledCaption>{`Schedule ${index + 1}`}</StyledCaption>
              <StyledGrid>
                <Select
                  label="Day"
                  value={row.day_of_week}
                  options={dayOptions}
                  onValueChange={(value) => updateRecurringRow(index, 'day_of_week', value)}
                  compact
                />
                <TextField
                  label="Timezone"
                  value={row.timezone}
                  onChangeText={(value) => updateRecurringRow(index, 'timezone', value)}
                  density="compact"
                />
                <TextField
                  label="Start (HH:mm)"
                  value={row.start_time}
                  onChangeText={(value) => updateRecurringRow(index, 'start_time', value)}
                  density="compact"
                />
                <TextField
                  label="End (HH:mm)"
                  value={row.end_time}
                  onChangeText={(value) => updateRecurringRow(index, 'end_time', value)}
                  density="compact"
                />
                <TextField
                  label="Effective from (YYYY-MM-DD)"
                  value={row.effective_from}
                  onChangeText={(value) => updateRecurringRow(index, 'effective_from', value)}
                  density="compact"
                />
                <TextField
                  label="Effective to (YYYY-MM-DD)"
                  value={row.effective_to}
                  onChangeText={(value) => updateRecurringRow(index, 'effective_to', value)}
                  density="compact"
                />
              </StyledGrid>
              <StyledInlineActions>
                <Button
                  variant="surface"
                  size="small"
                  onPress={() =>
                    setRecurringRows((previous) =>
                      previous.length > 1
                        ? previous.filter((_item, rowIndex) => rowIndex !== index)
                        : previous
                    )
                  }
                >
                  Remove
                </Button>
              </StyledInlineActions>
            </StyledRowCard>
          ))}
        </StyledSection>
      </Card>

      <Card variant="outlined">
        <StyledSection>
          <StyledHeader>
            <StyledSectionTitle>Date Overrides</StyledSectionTitle>
            <Button
              variant="surface"
              size="small"
              onPress={() => setOverrideRows((previous) => [...previous, createOverrideRow()])}
            >
              Add override
            </Button>
          </StyledHeader>
          {overrideRows.length === 0 ? (
            <StyledCaption>No date-specific overrides added.</StyledCaption>
          ) : null}
          {overrideRows.map((row, index) => (
            <StyledRowCard key={`override-row-${index + 1}`}>
              <StyledCaption>{`Override ${index + 1}`}</StyledCaption>
              <StyledGrid>
                <TextField
                  label="Schedule index"
                  value={row.schedule_index}
                  onChangeText={(value) => updateOverrideRow(index, 'schedule_index', value)}
                  density="compact"
                />
                <TextField
                  label="Date (YYYY-MM-DD)"
                  value={row.override_date}
                  onChangeText={(value) => updateOverrideRow(index, 'override_date', value)}
                  density="compact"
                />
                <TextField
                  label="Start (HH:mm)"
                  value={row.start_time}
                  onChangeText={(value) => updateOverrideRow(index, 'start_time', value)}
                  density="compact"
                />
                <TextField
                  label="End (HH:mm)"
                  value={row.end_time}
                  onChangeText={(value) => updateOverrideRow(index, 'end_time', value)}
                  density="compact"
                />
                <Switch
                  label="Available"
                  value={Boolean(row.is_available)}
                  onValueChange={(value) => updateOverrideRow(index, 'is_available', Boolean(value))}
                />
              </StyledGrid>
              <StyledInlineActions>
                <Button
                  variant="surface"
                  size="small"
                  onPress={() =>
                    setOverrideRows((previous) =>
                      previous.filter((_item, rowIndex) => rowIndex !== index)
                    )
                  }
                >
                  Remove
                </Button>
              </StyledInlineActions>
            </StyledRowCard>
          ))}
        </StyledSection>
      </Card>

      <Card variant="outlined">
        <StyledSection>
          <StyledSectionTitle>Notes</StyledSectionTitle>
          <TextArea
            label="Internal notes"
            value={draft.notes}
            onChangeText={(value) => updateDraft('notes', value)}
          />
        </StyledSection>
      </Card>
    </StyledContainer>
  );
};

export default AddDoctorScreen;
