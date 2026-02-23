import React from 'react';
import { useWindowDimensions } from 'react-native';
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
  Switch,
  Text,
  TextField,
} from '@platform/components';
import { useI18n } from '@hooks';
import breakpoints from '@theme/breakpoints';
import { formatDateTime } from '@utils';
import EntitlementBlockedState from '../components/EntitlementBlockedState';
import FieldHelpTrigger from '../components/FieldHelpTrigger';
import InlineFieldGuide from '../components/InlineFieldGuide';
import {
  StyledActions,
  StyledBadgeText,
  StyledContainer,
  StyledFieldBlock,
  StyledFormActions,
  StyledFormGrid,
  StyledHeader,
  StyledItemHeader,
  StyledListItem,
  StyledPanelRow,
  StyledReadOnlyNotice,
  StyledSummaryLabel,
  StyledSummaryRow,
  StyledSummarySection,
  StyledSummarySectionTitle,
  StyledSummaryGrid,
  StyledSummaryValue,
  StyledTabRow,
} from './PatientWorkspaceScreen.styles';
import usePatientWorkspaceScreen from './usePatientWorkspaceScreen';

const DATE_ONLY_REGEX = /^\d{4}-\d{2}-\d{2}$/;

const sanitizeString = (value) => String(value || '').trim();

const resolveDateOnly = (value) => {
  const normalized = sanitizeString(value);
  if (!normalized) return '';
  if (DATE_ONLY_REGEX.test(normalized)) return normalized;
  const parsed = new Date(normalized);
  if (Number.isNaN(parsed.getTime())) return '';
  return parsed.toISOString().slice(0, 10);
};

const resolveContextLabel = ({ label, humanFriendlyId, fallbackId, fallbackValue }) => {
  const normalizedLabel = sanitizeString(label);
  const normalizedHumanFriendlyId = sanitizeString(humanFriendlyId);
  const normalizedFallbackId = sanitizeString(fallbackId);
  const normalizedFallbackValue = sanitizeString(fallbackValue);

  if (normalizedLabel && normalizedHumanFriendlyId) {
    return `${normalizedLabel} (${normalizedHumanFriendlyId})`;
  }
  if (normalizedLabel) return normalizedLabel;
  if (normalizedHumanFriendlyId) return normalizedHumanFriendlyId;
  if (normalizedFallbackId) return normalizedFallbackId;
  return normalizedFallbackValue;
};

const resolveContactEntryValue = (entry) => {
  if (entry == null) return '';
  if (typeof entry === 'string' || typeof entry === 'number') {
    return sanitizeString(entry);
  }

  return [
    entry?.value,
    entry?.contact_value,
    entry?.contact,
    entry?.phone,
    entry?.phone_number,
    entry?.mobile,
    entry?.mobile_number,
    entry?.telephone,
    entry?.tel,
    entry?.email,
    entry?.email_address,
  ]
    .map((value) => sanitizeString(value))
    .find(Boolean) || '';
};

const resolvePatientContactLabel = (patient, fallback = '') => {
  const directContactValue = [
    patient?.contact,
    patient?.contact_label,
    patient?.contact_value,
    patient?.primary_contact,
    patient?.phone,
    patient?.phone_number,
    patient?.mobile,
    patient?.mobile_number,
    patient?.telephone,
    patient?.tel,
    patient?.email,
    patient?.email_address,
    patient?.primary_phone,
    patient?.primary_phone_number,
  ]
    .map((value) => sanitizeString(value))
    .find(Boolean);
  if (directContactValue) return directContactValue;

  const nestedContactValue = [
    patient?.primary_contact_details,
    patient?.primary_contact_detail,
    patient?.primaryContact,
    patient?.contact,
  ]
    .map((entry) => resolveContactEntryValue(entry))
    .find(Boolean);
  if (nestedContactValue) return nestedContactValue;

  const contactCollections = [
    patient?.contacts,
    patient?.patient_contacts,
    patient?.contact_entries,
    patient?.contact_list,
  ];

  for (let index = 0; index < contactCollections.length; index += 1) {
    const collection = contactCollections[index];
    if (!Array.isArray(collection) || collection.length === 0) continue;
    const value = collection
      .map((entry) => resolveContactEntryValue(entry))
      .find(Boolean);
    if (value) return value;
  }

  return fallback;
};

const resolveAge = (dateOfBirth) => {
  const dateOnly = resolveDateOnly(dateOfBirth);
  if (!dateOnly) return null;

  const parsed = new Date(`${dateOnly}T00:00:00.000Z`);
  if (Number.isNaN(parsed.getTime())) return null;

  const now = new Date();
  let years = now.getFullYear() - parsed.getUTCFullYear();
  const hasNotReachedBirthday = (
    now.getMonth() < parsed.getUTCMonth()
    || (now.getMonth() === parsed.getUTCMonth() && now.getDate() < parsed.getUTCDate())
  );
  if (hasNotReachedBirthday) years -= 1;
  if (years < 0) return null;
  return years;
};

const resolveDateTimeLabel = (value, locale) => {
  const normalized = sanitizeString(value);
  if (!normalized) return '';
  const formatted = formatDateTime(normalized, locale || 'en-US');
  return sanitizeString(formatted) || normalized;
};

const PatientWorkspaceScreen = () => {
  const { t, locale } = useI18n();
  const { width } = useWindowDimensions();
  const isCompactLayout = width < breakpoints.tablet;
  const {
    patient,
    tabs,
    activeTab,
    panelOptions,
    activePanel,
    panelRows,
    activePanelConfig,
    panelDraft,
    isSummaryEditMode,
    summaryValues,
    summaryErrors,
    genderOptions,
    isLoading,
    isOffline,
    hasError,
    errorMessage,
    isEntitlementBlocked,
    canManagePatientRecords,
    canDeletePatientRecords,
    canManageAllTenants,
    onSelectTab,
    onSelectPanel,
    onRetry,
    onGoToSubscriptions,
    onStartCreate,
    onDeletePatient,
    onStartEditRecord,
    onDeleteRecord,
    onPanelDraftChange,
    onPanelSubmit,
    onClosePanelEditor,
    onSummaryFieldChange,
    onStartSummaryEdit,
    onCancelSummaryEdit,
    onSaveSummary,
  } = usePatientWorkspaceScreen();

  const fallbackLabel = t('common.notAvailable');
  const patientName = [patient?.first_name, patient?.last_name]
    .map((value) => sanitizeString(value))
    .filter(Boolean)
    .join(' ')
    .trim()
    || sanitizeString(patient?.human_friendly_id)
    || t('patients.overview.unnamedPatient', { position: 1 });
  const patientHumanFriendlyId = sanitizeString(patient?.human_friendly_id) || fallbackLabel;
  const patientInternalId = sanitizeString(patient?.id) || fallbackLabel;
  const patientDateOfBirth = resolveDateOnly(patient?.date_of_birth) || fallbackLabel;
  const patientAge = (() => {
    const age = resolveAge(patient?.date_of_birth);
    if (age == null) return fallbackLabel;
    return t('patients.workspace.patientSummary.ageValue', { age });
  })();
  const patientGender = sanitizeString(patient?.gender) || fallbackLabel;
  const patientIsActive = patient?.is_active === false
    ? t('common.boolean.false')
    : t('common.boolean.true');
  const patientContact = resolvePatientContactLabel(patient, fallbackLabel);
  const patientTenant = resolveContextLabel({
    label: patient?.tenant_label || patient?.tenant_name || patient?.tenant_context?.label,
    humanFriendlyId: (
      patient?.tenant_human_friendly_id
      || patient?.tenant_context?.human_friendly_id
      || patient?.tenant_context?.humanFriendlyId
    ),
    fallbackId: patient?.tenant_id,
    fallbackValue: fallbackLabel,
  });
  const patientFacility = resolveContextLabel({
    label: patient?.facility_label || patient?.facility_name || patient?.facility_context?.label,
    humanFriendlyId: (
      patient?.facility_human_friendly_id
      || patient?.facility_context?.human_friendly_id
      || patient?.facility_context?.humanFriendlyId
    ),
    fallbackId: patient?.facility_id,
    fallbackValue: fallbackLabel,
  });
  const patientCreatedAt = resolveDateTimeLabel(patient?.created_at, locale) || fallbackLabel;
  const patientUpdatedAt = resolveDateTimeLabel(patient?.updated_at, locale) || fallbackLabel;
  const canDeletePatientProfile = (
    canDeletePatientRecords && typeof onDeletePatient === 'function'
  );

  const summaryAboutRows = [
    { key: 'name', label: t('patients.workspace.patientSummary.name'), value: patientName },
    { key: 'patientId', label: t('patients.workspace.patientSummary.patientId'), value: patientHumanFriendlyId },
    { key: 'contact', label: t('patients.workspace.patientSummary.contact'), value: patientContact },
    { key: 'dob', label: t('patients.workspace.patientSummary.dob'), value: patientDateOfBirth },
    { key: 'age', label: t('patients.workspace.patientSummary.age'), value: patientAge },
    { key: 'gender', label: t('patients.workspace.patientSummary.gender'), value: patientGender },
    { key: 'active', label: t('patients.workspace.patientSummary.active'), value: patientIsActive },
  ];

  const summaryContextRows = [
    { key: 'tenant', label: t('patients.workspace.patientSummary.tenant'), value: patientTenant },
    { key: 'facility', label: t('patients.workspace.patientSummary.facility'), value: patientFacility },
    { key: 'createdAt', label: t('patients.workspace.patientSummary.createdAt'), value: patientCreatedAt },
    { key: 'updatedAt', label: t('patients.workspace.patientSummary.updatedAt'), value: patientUpdatedAt },
  ];
  if (canManageAllTenants) {
    summaryContextRows.push({
      key: 'internalId',
      label: t('patients.workspace.patientSummary.internalId'),
      value: patientInternalId,
    });
  }

  const renderSummarySection = (sectionTitle, rows, testID) => (
    <StyledSummarySection testID={testID}>
      <StyledSummarySectionTitle>{sectionTitle}</StyledSummarySectionTitle>
      <StyledSummaryGrid>
        {rows.map((row) => (
          <StyledSummaryRow key={row.key} $isCompact={isCompactLayout}>
            <StyledSummaryLabel
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              {row.label}
            </StyledSummaryLabel>
            <StyledSummaryValue
              numberOfLines={isCompactLayout ? 3 : 2}
              ellipsizeMode="tail"
              $isCompact={isCompactLayout}
            >
              {row.value}
            </StyledSummaryValue>
          </StyledSummaryRow>
        ))}
      </StyledSummaryGrid>
    </StyledSummarySection>
  );

  const renderSummaryReadonly = () => (
    <Card variant="outlined">
      {renderSummarySection(
        t('patients.workspace.summarySections.about'),
        summaryAboutRows,
        'patient-workspace-summary-about'
      )}
      {renderSummarySection(
        t('patients.workspace.summarySections.record'),
        summaryContextRows,
        'patient-workspace-summary-record'
      )}

      {!canManagePatientRecords ? (
        <StyledReadOnlyNotice>
          {t('patients.workspace.access.readOnly')}
        </StyledReadOnlyNotice>
      ) : null}
    </Card>
  );

  const renderSummaryEdit = () => (
    <Card variant="outlined">
      <StyledFormGrid>
        <StyledFieldBlock>
          <FieldHelpTrigger
            label={t('patients.resources.patients.form.firstNameLabel')}
            tooltip={t('patients.resources.patients.form.firstNameHint')}
            helpTitle={t('patients.resources.patients.form.firstNameLabel')}
            helpBody={t('patients.resources.patients.form.firstNameHint')}
            testID="patient-workspace-summary-help-first-name"
          />
          <InlineFieldGuide text={t('patients.resources.patients.form.firstNameHint')} />
          <TextField
            value={summaryValues.first_name || ''}
            onChange={(event) => onSummaryFieldChange('first_name', event?.target?.value || '')}
            helperText={summaryErrors.first_name || t('patients.resources.patients.form.firstNameHint')}
            errorMessage={summaryErrors.first_name}
            density="compact"
          />
        </StyledFieldBlock>

        <StyledFieldBlock>
          <FieldHelpTrigger
            label={t('patients.resources.patients.form.lastNameLabel')}
            tooltip={t('patients.resources.patients.form.lastNameHint')}
            helpTitle={t('patients.resources.patients.form.lastNameLabel')}
            helpBody={t('patients.resources.patients.form.lastNameHint')}
            testID="patient-workspace-summary-help-last-name"
          />
          <InlineFieldGuide text={t('patients.resources.patients.form.lastNameHint')} />
          <TextField
            value={summaryValues.last_name || ''}
            onChange={(event) => onSummaryFieldChange('last_name', event?.target?.value || '')}
            helperText={summaryErrors.last_name || t('patients.resources.patients.form.lastNameHint')}
            errorMessage={summaryErrors.last_name}
            density="compact"
          />
        </StyledFieldBlock>

        <StyledFieldBlock>
          <FieldHelpTrigger
            label={t('patients.resources.patients.form.dateOfBirthLabel')}
            tooltip={t('patients.resources.patients.form.dateOfBirthHint')}
            helpTitle={t('patients.resources.patients.form.dateOfBirthLabel')}
            helpBody={t('patients.resources.patients.form.dateOfBirthHint')}
            testID="patient-workspace-summary-help-dob"
          />
          <InlineFieldGuide text={t('patients.resources.patients.form.dateOfBirthHint')} />
          <TextField
            value={summaryValues.date_of_birth || ''}
            onChange={(event) => onSummaryFieldChange('date_of_birth', event?.target?.value || '')}
            helperText={summaryErrors.date_of_birth || t('patients.resources.patients.form.dateOfBirthHint')}
            errorMessage={summaryErrors.date_of_birth}
            density="compact"
          />
        </StyledFieldBlock>

        <StyledFieldBlock>
          <FieldHelpTrigger
            label={t('patients.resources.patients.form.genderLabel')}
            tooltip={t('patients.resources.patients.form.genderHint')}
            helpTitle={t('patients.resources.patients.form.genderLabel')}
            helpBody={t('patients.resources.patients.form.genderHint')}
            testID="patient-workspace-summary-help-gender"
          />
          <InlineFieldGuide text={t('patients.resources.patients.form.genderHint')} />
          <Select
            value={summaryValues.gender || ''}
            options={genderOptions}
            onValueChange={(value) => onSummaryFieldChange('gender', value)}
            compact
          />
        </StyledFieldBlock>

        <StyledFieldBlock>
          <FieldHelpTrigger
            label={t('patients.resources.patients.form.activeLabel')}
            tooltip={t('patients.resources.patients.form.activeHint')}
            helpTitle={t('patients.resources.patients.form.activeLabel')}
            helpBody={t('patients.resources.patients.form.activeHint')}
            testID="patient-workspace-summary-help-active"
          />
          <InlineFieldGuide text={t('patients.resources.patients.form.activeHint')} />
          <Switch
            value={Boolean(summaryValues.is_active)}
            onValueChange={(value) => onSummaryFieldChange('is_active', value)}
            label={t('patients.resources.patients.form.activeLabel')}
          />
        </StyledFieldBlock>
      </StyledFormGrid>

      <StyledFormActions>
        <Button
          variant="surface"
          size="medium"
          onPress={onCancelSummaryEdit}
          accessibilityLabel={t('patients.workspace.actions.cancel')}
          icon={<Icon glyph={'\u2715'} size="xs" decorative />}
        >
          {t('patients.workspace.actions.cancel')}
        </Button>
        <Button
          variant="surface"
          size="medium"
          onPress={onSaveSummary}
          accessibilityLabel={t('patients.workspace.actions.save')}
          icon={<Icon glyph={'\u2713'} size="xs" decorative />}
        >
          {t('patients.workspace.actions.save')}
        </Button>
      </StyledFormActions>
    </Card>
  );

  const renderPanelForm = () => {
    if (!panelDraft || !activePanelConfig) return null;
    const fields = activePanelConfig.fields || [];

    return (
      <Card variant="outlined">
        <StyledFormGrid>
          {fields.map((field) => {
            const fieldError = panelDraft.errors?.[field.name];
            if (field.type === 'switch') {
              return (
                <StyledFieldBlock key={field.name}>
                  <FieldHelpTrigger
                    label={t(field.labelKey)}
                    tooltip={t(field.hintKey)}
                    helpTitle={t(field.labelKey)}
                    helpBody={t(field.hintKey)}
                    testID={`patient-workspace-help-${field.name}`}
                  />
                  <InlineFieldGuide text={t(field.hintKey)} />
                  <Switch
                    value={Boolean(panelDraft.values?.[field.name])}
                    onValueChange={(value) => onPanelDraftChange(field.name, value)}
                    label={t(field.labelKey)}
                  />
                </StyledFieldBlock>
              );
            }

            if (field.type === 'select') {
              const options = (field.options || []).map((option) => ({
                value: option.value,
                label: option.labelKey ? t(option.labelKey) : option.label || option.value,
              }));
              return (
                <StyledFieldBlock key={field.name}>
                  <FieldHelpTrigger
                    label={t(field.labelKey)}
                    tooltip={t(field.hintKey)}
                    helpTitle={t(field.labelKey)}
                    helpBody={t(field.hintKey)}
                    testID={`patient-workspace-help-${field.name}`}
                  />
                  <InlineFieldGuide text={t(field.hintKey)} />
                  <Select
                    value={panelDraft.values?.[field.name] || ''}
                    options={options}
                    onValueChange={(value) => onPanelDraftChange(field.name, value)}
                    helperText={fieldError || t(field.hintKey)}
                    errorMessage={fieldError}
                    compact
                  />
                </StyledFieldBlock>
              );
            }

            return (
              <StyledFieldBlock key={field.name}>
                <FieldHelpTrigger
                  label={t(field.labelKey)}
                  tooltip={t(field.hintKey)}
                  helpTitle={t(field.labelKey)}
                  helpBody={t(field.hintKey)}
                  testID={`patient-workspace-help-${field.name}`}
                />
                <InlineFieldGuide text={t(field.hintKey)} />
                <TextField
                  value={panelDraft.values?.[field.name] || ''}
                  onChange={(event) => onPanelDraftChange(field.name, event?.target?.value || '')}
                  helperText={fieldError || t(field.hintKey)}
                  errorMessage={fieldError}
                  maxLength={field.maxLength}
                  density="compact"
                />
              </StyledFieldBlock>
            );
          })}
        </StyledFormGrid>

        <StyledFormActions>
          <Button
            variant="surface"
            size="medium"
            onPress={onClosePanelEditor}
            accessibilityLabel={t('patients.workspace.actions.cancel')}
            icon={<Icon glyph={'\u2715'} size="xs" decorative />}
          >
            {t('patients.workspace.actions.cancel')}
          </Button>
          <Button
            variant="surface"
            size="medium"
            onPress={onPanelSubmit}
            accessibilityLabel={t('patients.workspace.actions.save')}
            icon={<Icon glyph={'\u2713'} size="xs" decorative />}
          >
            {t('patients.workspace.actions.save')}
          </Button>
        </StyledFormActions>
      </Card>
    );
  };

  return (
    <StyledContainer>
      <StyledHeader>
        <Text variant="h2" accessibilityRole="header">{t('patients.workspace.title')}</Text>
        <Text variant="body">{t('patients.workspace.description')}</Text>
        <StyledBadgeText>
          {patientName} {patient?.human_friendly_id ? `(${patient.human_friendly_id})` : ''}
        </StyledBadgeText>
      </StyledHeader>

      <StyledTabRow>
        {tabs.map((tab) => (
          <Button
            key={tab}
            variant="surface"
            size="medium"
            onPress={() => onSelectTab(tab)}
            accessibilityLabel={t(`patients.workspace.tabs.${tab}`)}
            icon={<Icon glyph="?" size="xs" decorative />}
          >
            {t(`patients.workspace.tabs.${tab}`)}
          </Button>
        ))}
      </StyledTabRow>

      {activeTab !== 'summary' ? (
        <StyledPanelRow>
          {panelOptions.map((panel) => (
            <Button
              key={panel}
              variant="surface"
              size="medium"
              onPress={() => onSelectPanel(panel)}
              accessibilityLabel={t(`patients.workspace.panels.${panel}`)}
              icon={<Icon glyph="?" size="xs" decorative />}
            >
              {t(`patients.workspace.panels.${panel}`)}
            </Button>
          ))}
        </StyledPanelRow>
      ) : null}

      <StyledActions>
        <Button
          variant="surface"
          size="medium"
          onPress={onRetry}
          accessibilityLabel={t('patients.workspace.actions.refresh')}
          icon={<Icon glyph={'\u21bb'} size="xs" decorative />}
        >
          {t('patients.workspace.actions.refresh')}
        </Button>
        {activeTab === 'summary' && !isSummaryEditMode && canManagePatientRecords ? (
          <Button
            variant="surface"
            size="medium"
            onPress={onStartSummaryEdit}
            accessibilityLabel={t('patients.workspace.actions.editPatient')}
            icon={<Icon glyph={'\u270e'} size="xs" decorative />}
            testID="patient-workspace-edit-patient"
          >
            {t('patients.workspace.actions.editPatient')}
          </Button>
        ) : null}
        {activeTab === 'summary' && !isSummaryEditMode && canDeletePatientProfile ? (
          <Button
            variant="surface"
            size="medium"
            onPress={onDeletePatient}
            accessibilityLabel={t('patients.workspace.actions.deletePatient')}
            icon={<Icon glyph={'\u2715'} size="xs" decorative />}
            testID="patient-workspace-delete-patient"
          >
            {t('patients.workspace.actions.deletePatient')}
          </Button>
        ) : null}
        {activeTab !== 'summary' && canManagePatientRecords ? (
          <Button
            variant="surface"
            size="medium"
            onPress={onStartCreate}
            accessibilityLabel={t('patients.workspace.actions.newRecord')}
            icon={<Icon glyph="+" size="xs" decorative />}
          >
            {t('patients.workspace.actions.newRecord')}
          </Button>
        ) : null}
      </StyledActions>

      {isLoading ? <LoadingSpinner accessibilityLabel={t('common.loading')} /> : null}

      {!isLoading && isEntitlementBlocked ? (
        <EntitlementBlockedState
          title={t('patients.entitlement.title')}
          description={t('patients.entitlement.description')}
          actionLabel={t('patients.entitlement.cta')}
          actionHint={t('patients.entitlement.ctaHint')}
          onAction={onGoToSubscriptions}
          testID="patient-workspace-entitlement-blocked"
        />
      ) : null}

      {!isLoading && !isEntitlementBlocked && hasError ? (
        <ErrorState
          size={ErrorStateSizes.SMALL}
          title={t('patients.workspace.state.loadError')}
          description={errorMessage}
          testID="patient-workspace-error"
        />
      ) : null}

      {!isLoading && !isEntitlementBlocked && isOffline ? (
        <OfflineState
          size={OfflineStateSizes.SMALL}
          title={t('shell.banners.offline.title')}
          description={t('shell.banners.offline.message')}
          testID="patient-workspace-offline"
        />
      ) : null}

      {!isLoading && !isEntitlementBlocked && !hasError ? (
        <>
          {activeTab === 'summary' ? (
            isSummaryEditMode ? renderSummaryEdit() : renderSummaryReadonly()
          ) : (
            <Card variant="outlined">
              {panelRows.length === 0 ? (
                <EmptyState
                  title={t('patients.workspace.state.emptyPanel')}
                  description={t('patients.workspace.state.emptyPanel')}
                  testID="patient-workspace-empty-panel"
                />
              ) : (
                <StyledFormGrid>
                  {panelRows.map((row) => (
                    <StyledListItem key={row.id || row.title}>
                      <StyledItemHeader>
                        <Text variant="label">{row.title}</Text>
                        <StyledActions>
                          {canManagePatientRecords ? (
                            <Button
                              variant="surface"
                              size="medium"
                              onPress={() => onStartEditRecord(row.id)}
                              accessibilityLabel={t('patients.workspace.actions.editRecord')}
                              icon={<Icon glyph={'\u270e'} size="xs" decorative />}
                            >
                              {t('patients.workspace.actions.editRecord')}
                            </Button>
                          ) : null}
                          {canDeletePatientRecords ? (
                            <Button
                              variant="surface"
                              size="medium"
                              onPress={() => onDeleteRecord(row.id)}
                              accessibilityLabel={t('patients.workspace.actions.deleteRecord')}
                              icon={<Icon glyph={'\u2715'} size="xs" decorative />}
                            >
                              {t('patients.workspace.actions.deleteRecord')}
                            </Button>
                          ) : null}
                        </StyledActions>
                      </StyledItemHeader>
                      {row.humanFriendlyId ? (
                        <Text variant="caption">
                          {t('patients.workspace.patientSummary.patientId')}: {row.humanFriendlyId}
                        </Text>
                      ) : null}
                      {row.subtitle ? <Text variant="caption">{row.subtitle}</Text> : null}
                    </StyledListItem>
                  ))}
                </StyledFormGrid>
              )}
            </Card>
          )}

          {activeTab !== 'summary' ? renderPanelForm() : null}
        </>
      ) : null}
    </StyledContainer>
  );
};

export default PatientWorkspaceScreen;

