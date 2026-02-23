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
  StyledChromeTab,
  StyledChromeTabLabel,
  StyledChromeTabsRail,
  StyledContainer,
  StyledFieldBlock,
  StyledFormActions,
  StyledFormGrid,
  StyledItemHeader,
  StyledListItem,
  StyledPageNavigation,
  StyledPageNavigationTitle,
  StyledReadOnlyNotice,
  StyledSummaryLabel,
  StyledSummaryRow,
  StyledSummarySection,
  StyledSummarySectionTitle,
  StyledSummaryGrid,
  StyledSummaryValue,
} from './PatientDetailsScreen.styles';
import usePatientDetailsScreen from './usePatientDetailsScreen';

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

const PatientDetailsScreen = () => {
  const { t, locale } = useI18n();
  const { width } = useWindowDimensions();
  const isCompactLayout = width < breakpoints.tablet;
  const topNavButtonSize = 'small';
  const compactButtonStyle = isCompactLayout ? { flexGrow: 1 } : undefined;
  const [selectedPageTab, setSelectedPageTab] = React.useState('details');
  const {
    patient,
    identifierRecords = [],
    guardianRecords = [],
    contactRecords = [],
    documentRecords = [],
    addressRecords = [],
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
    onRetry,
    onGoToSubscriptions,
    onDeletePatient,
    onSummaryFieldChange,
    onStartSummaryEdit,
    onCancelSummaryEdit,
    onSaveSummary,
  } = usePatientDetailsScreen();

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
  const screenTabs = [
    {
      key: 'details',
      label: t('patients.workspace.tabs.summary'),
      icon: '\u2139',
      description: t('patients.workspace.summarySections.about'),
    },
    {
      key: 'identity',
      label: t('patients.workspace.tabs.identity'),
      icon: '\ud83d\udd11',
      description: t('patients.workspace.panels.identifiers'),
    },
    {
      key: 'contacts',
      label: t('patients.workspace.panels.contacts'),
      icon: '\u260e',
      description: t('patients.workspace.patientSummary.contact'),
    },
    {
      key: 'address',
      label: 'Address',
      icon: '\ud83d\udccd',
      description: 'Address records linked to this patient.',
    },
    {
      key: 'documents',
      label: t('patients.workspace.panels.documents'),
      icon: '\ud83d\udcc4',
      description: t('patients.resources.patientDocuments.overviewDescription'),
    },
  ];
  const selectedPageTabConfig = (
    screenTabs.find((tab) => tab.key === selectedPageTab)
    || screenTabs.find((tab) => tab.key === 'details')
    || screenTabs[0]
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

  const identityRows = React.useMemo(
    () => [
      ...identifierRecords.map((record, index) => ({
        key: sanitizeString(record?.id) || `identifier-${index + 1}`,
        title: sanitizeString(record?.identifier_type) || t('patients.workspace.panels.identifiers'),
        subtitle: sanitizeString(record?.identifier_value) || fallbackLabel,
        meta: record?.is_primary ? t('patients.resources.patientIdentifiers.detail.primaryLabel') : '',
      })),
      ...guardianRecords.map((record, index) => ({
        key: sanitizeString(record?.id) || `guardian-${index + 1}`,
        title: sanitizeString(record?.name) || t('patients.workspace.panels.guardians'),
        subtitle: sanitizeString(record?.relationship) || fallbackLabel,
        meta: sanitizeString(record?.phone || record?.email),
      })),
    ],
    [identifierRecords, guardianRecords, fallbackLabel, t]
  );

  const contactRows = React.useMemo(
    () => contactRecords.map((record, index) => ({
      key: sanitizeString(record?.id) || `contact-${index + 1}`,
      title: sanitizeString(record?.contact_type) || t('patients.workspace.panels.contacts'),
      subtitle: sanitizeString(record?.value) || fallbackLabel,
      meta: record?.is_primary ? t('patients.resources.patientContacts.detail.primaryLabel') : '',
    })),
    [contactRecords, fallbackLabel, t]
  );

  const addressRows = React.useMemo(() => {
    const normalizedAddressEntries = addressRecords.map((record, index) => ({
      key: sanitizeString(record?.id) || `address-${index + 1}`,
      title: sanitizeString(record?.address_type) || 'Address',
      subtitle: [
        sanitizeString(record?.line1),
        sanitizeString(record?.line2),
        sanitizeString(record?.city),
        sanitizeString(record?.state),
        sanitizeString(record?.postal_code),
        sanitizeString(record?.country),
      ].filter(Boolean).join(', ') || fallbackLabel,
      meta: sanitizeString(record?.human_friendly_id),
    }));

    if (normalizedAddressEntries.length > 0) {
      return normalizedAddressEntries;
    }

    const extensionAddress = patient?.extension_json?.address || patient?.extension_json?.addresses;
    const extensionCandidates = Array.isArray(extensionAddress) ? extensionAddress : [extensionAddress];
    const extensionRows = extensionCandidates
      .filter(Boolean)
      .map((record, index) => ({
        key: sanitizeString(record?.id) || `address-extension-${index + 1}`,
        title: sanitizeString(record?.address_type || record?.type) || 'Address',
        subtitle: [
          sanitizeString(record?.line1),
          sanitizeString(record?.line2),
          sanitizeString(record?.city),
          sanitizeString(record?.state),
          sanitizeString(record?.postal_code || record?.postalCode),
          sanitizeString(record?.country),
        ].filter(Boolean).join(', ') || fallbackLabel,
        meta: '',
      }));
    return extensionRows;
  }, [addressRecords, patient, fallbackLabel]);

  const documentRows = React.useMemo(
    () => documentRecords.map((record, index) => ({
      key: sanitizeString(record?.id) || `document-${index + 1}`,
      title: sanitizeString(record?.document_type) || t('patients.workspace.panels.documents'),
      subtitle: sanitizeString(record?.file_name || record?.storage_key) || fallbackLabel,
      meta: resolveDateTimeLabel(record?.updated_at || record?.created_at, locale),
    })),
    [documentRecords, fallbackLabel, locale, t]
  );

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

  const renderRecordCollectionCard = (rows, emptyMessage, testID) => (
    <Card variant="outlined" testID={testID}>
      {rows.length === 0 ? (
        <EmptyState
          title={emptyMessage}
          description={emptyMessage}
          testID={`${testID}-empty`}
        />
      ) : (
        <StyledFormGrid>
          {rows.map((row) => (
            <StyledListItem key={row.key}>
              <StyledItemHeader>
                <Text variant="label">{row.title}</Text>
              </StyledItemHeader>
              <Text variant="caption">{row.subtitle}</Text>
              {sanitizeString(row.meta) ? <Text variant="caption">{row.meta}</Text> : null}
            </StyledListItem>
          ))}
        </StyledFormGrid>
      )}
    </Card>
  );

  return (
    <StyledContainer>
      <Card variant="outlined" testID="patient-workspace-page-navigation">
        <StyledPageNavigation>
          <StyledPageNavigationTitle>{t('patients.screen.label')}</StyledPageNavigationTitle>

          <StyledChromeTabsRail accessibilityRole="radiogroup">
            {screenTabs.map((tab) => (
              <StyledChromeTab
                key={tab.key}
                onPress={() => setSelectedPageTab(tab.key)}
                $isActive={selectedPageTab === tab.key}
                $isCompact={isCompactLayout}
                accessibilityRole="radio"
                accessibilityState={{ selected: selectedPageTab === tab.key }}
                accessibilityLabel={tab.label}
                testID={`patient-workspace-page-tab-${tab.key}`}
              >
                <Icon glyph={tab.icon} size="xs" decorative />
                <StyledChromeTabLabel $isActive={selectedPageTab === tab.key}>
                  {tab.label}
                </StyledChromeTabLabel>
              </StyledChromeTab>
            ))}
          </StyledChromeTabsRail>
        </StyledPageNavigation>
      </Card>

      <Card variant="outlined" testID={`patient-workspace-page-content-${selectedPageTab}`}>
        <StyledPageNavigation>
          <Text variant="h3">{selectedPageTabConfig?.label}</Text>
          <Text variant="body">{selectedPageTabConfig?.description}</Text>
        </StyledPageNavigation>
      </Card>

      <StyledActions>
        <Button
          variant="surface"
          size={topNavButtonSize}
          onPress={onRetry}
          accessibilityLabel={t('patients.workspace.actions.refresh')}
          icon={<Icon glyph={'\u21bb'} size="xs" decorative />}
          style={compactButtonStyle}
        >
          {t('patients.workspace.actions.refresh')}
        </Button>
        {selectedPageTab === 'details' && !isSummaryEditMode && canManagePatientRecords ? (
          <Button
            variant="surface"
            size={topNavButtonSize}
            onPress={onStartSummaryEdit}
            accessibilityLabel={t('patients.workspace.actions.editPatient')}
            icon={<Icon glyph={'\u270e'} size="xs" decorative />}
            testID="patient-workspace-edit-patient"
            style={compactButtonStyle}
          >
            {t('patients.workspace.actions.editPatient')}
          </Button>
        ) : null}
        {selectedPageTab === 'details' && !isSummaryEditMode && canDeletePatientProfile ? (
          <Button
            variant="surface"
            size={topNavButtonSize}
            onPress={onDeletePatient}
            accessibilityLabel={t('patients.workspace.actions.deletePatient')}
            icon={<Icon glyph={'\u2715'} size="xs" decorative />}
            testID="patient-workspace-delete-patient"
            style={compactButtonStyle}
          >
            {t('patients.workspace.actions.deletePatient')}
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
          {selectedPageTab === 'details' ? (
            isSummaryEditMode ? renderSummaryEdit() : renderSummaryReadonly()
          ) : null}

          {selectedPageTab === 'identity'
            ? renderRecordCollectionCard(
              identityRows,
              t('patients.resources.patientIdentifiers.list.emptyMessage'),
              'patient-workspace-identity'
            )
            : null}

          {selectedPageTab === 'contacts' ? (
            <>
              <Card variant="outlined" testID="patient-workspace-contacts-primary">
                <StyledSummarySection>
                  <StyledSummarySectionTitle>{t('patients.workspace.patientSummary.contact')}</StyledSummarySectionTitle>
                  <Text variant="body">{patientContact}</Text>
                </StyledSummarySection>
              </Card>
              {renderRecordCollectionCard(
                contactRows,
                t('patients.resources.patientContacts.list.emptyMessage'),
                'patient-workspace-contacts'
              )}
            </>
          ) : null}

          {selectedPageTab === 'address'
            ? renderRecordCollectionCard(
              addressRows,
              'No patient address records are available yet.',
              'patient-workspace-address'
            )
            : null}

          {selectedPageTab === 'documents'
            ? renderRecordCollectionCard(
              documentRows,
              t('patients.resources.patientDocuments.list.emptyMessage'),
              'patient-workspace-documents'
            )
            : null}
        </>
      ) : null}
    </StyledContainer>
  );
};

export default PatientDetailsScreen;

