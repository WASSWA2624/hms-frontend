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
import {
  StyledActions,
  StyledChromeTabButton,
  StyledChromeTabIcon,
  StyledChromeTabLabel,
  StyledChromeTabsRail,
  StyledContainer,
  StyledFieldBlock,
  StyledFormActions,
  StyledFormGrid,
  StyledItemActions,
  StyledItemHeader,
  StyledListItem,
  StyledPageNavigation,
  StyledPageNavigationTitle,
  StyledReadOnlyNotice,
  StyledResourceSection,
  StyledResourceSectionDescription,
  StyledResourceSectionHeader,
  StyledResourceSectionTitle,
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

const resolveTextValue = (event) => (
  event?.target?.value
  ?? event?.nativeEvent?.text
  ?? ''
);

const resolveTranslation = (t, key, fallback = '') => {
  if (!key) return fallback;
  const translated = t(key);
  const normalized = sanitizeString(translated);
  if (!normalized || normalized === key) return fallback || key;
  return translated;
};

const resolveFieldLabel = (field, t) => {
  const fallback = sanitizeString(field?.name)
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (char) => char.toUpperCase());
  return resolveTranslation(t, field?.labelKey, fallback);
};

const resolveFieldHint = (field, t) => resolveTranslation(t, field?.hintKey, '');

const resolveFieldPlaceholder = (field, t) => resolveTranslation(t, field?.placeholderKey, '');

const resolveSelectOptions = (field, t) => (
  (field?.options || []).map((option) => ({
    value: sanitizeString(option?.value),
    label: resolveTranslation(t, option?.labelKey, sanitizeString(option?.value)),
  }))
);

const PatientDetailsScreen = () => {
  const { t, locale } = useI18n();
  const { width } = useWindowDimensions();
  const isCompactLayout = width < breakpoints.tablet;
  const compactButtonStyle = isCompactLayout ? { flexGrow: 1 } : undefined;

  const {
    routePatientId,
    initialTabKey,
    patient,
    resourceSections,
    resourceKeys,
    isSummaryEditMode,
    summaryValues,
    summaryErrors,
    genderOptions,
    isLoading,
    isOffline,
    hasError,
    errorMessage,
    isEntitlementBlocked,
    isPatientDeleted,
    canManagePatientRecords,
    canDeletePatientRecords,
    onRetry,
    onGoToSubscriptions,
    onDeletePatient,
    onSummaryFieldChange,
    onStartSummaryEdit,
    onCancelSummaryEdit,
    onSaveSummary,
    onResourceCreate,
    onResourceEdit,
    onResourceDelete,
    onResourceFieldChange,
    onResourceSubmit,
    onResourceCancel,
  } = usePatientDetailsScreen();
  const [selectedPageTab, setSelectedPageTab] = React.useState(initialTabKey || 'details');

  React.useEffect(() => {
    setSelectedPageTab(initialTabKey || 'details');
  }, [initialTabKey, routePatientId]);

  const fallbackLabel = t('common.notAvailable');
  const patientName = [patient?.first_name, patient?.last_name]
    .map((value) => sanitizeString(value))
    .filter(Boolean)
    .join(' ')
    .trim()
    || sanitizeString(patient?.human_friendly_id)
    || t('patients.overview.unnamedPatient', { position: 1 });
  const patientHumanFriendlyId = sanitizeString(patient?.human_friendly_id) || fallbackLabel;
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
      label: resolveTranslation(t, 'patients.workspace.tabs.summary', 'Summary'),
      icon: '\u2139',
      description: resolveTranslation(
        t,
        'patients.workspace.summarySections.about',
        'About patient'
      ),
    },
    {
      key: 'identity',
      label: resolveTranslation(t, 'patients.workspace.tabs.identity', 'Identity & Reachability'),
      icon: '\ud83d\udd11',
      description: resolveTranslation(
        t,
        'patients.resources.patientIdentifiers.overviewDescription',
        'Patient identifiers and guardian records.'
      ),
    },
    {
      key: 'contacts',
      label: resolveTranslation(t, 'patients.workspace.panels.contacts', 'Contacts'),
      icon: '\u260e',
      description: resolveTranslation(
        t,
        'patients.resources.patientContacts.overviewDescription',
        'Patient communication channels and contact values.'
      ),
    },
    {
      key: 'address',
      label: resolveTranslation(t, 'address.list.title', 'Addresses'),
      icon: '\ud83d\udccd',
      description: resolveTranslation(t, 'address.list.accessibilityLabel', 'Patient addresses'),
    },
    {
      key: 'documents',
      label: resolveTranslation(t, 'patients.workspace.panels.documents', 'Documents'),
      icon: '\ud83d\udcc4',
      description: resolveTranslation(
        t,
        'patients.resources.patientDocuments.overviewDescription',
        'Document metadata linked to patient records.'
      ),
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
    <Card variant="outlined" testID="patient-details-summary-view">
      {renderSummarySection(
        t('patients.workspace.summarySections.about'),
        summaryAboutRows,
        'patient-details-summary-about'
      )}
      {renderSummarySection(
        t('patients.workspace.summarySections.record'),
        summaryContextRows,
        'patient-details-summary-record'
      )}

      {!canManagePatientRecords ? (
        <StyledReadOnlyNotice>
          {t('patients.workspace.access.readOnly')}
        </StyledReadOnlyNotice>
      ) : null}
    </Card>
  );

  const renderSummaryEdit = () => (
    <Card variant="outlined" testID="patient-details-summary-editor">
      <StyledFormGrid>
        <StyledFieldBlock>
          <Text variant="label">{t('patients.resources.patients.form.firstNameLabel')}</Text>
          <TextField
            value={summaryValues.first_name || ''}
            onChange={(event) => onSummaryFieldChange('first_name', resolveTextValue(event))}
            helperText={summaryErrors.first_name || t('patients.resources.patients.form.firstNameHint')}
            errorMessage={summaryErrors.first_name}
            density="compact"
          />
        </StyledFieldBlock>

        <StyledFieldBlock>
          <Text variant="label">{t('patients.resources.patients.form.lastNameLabel')}</Text>
          <TextField
            value={summaryValues.last_name || ''}
            onChange={(event) => onSummaryFieldChange('last_name', resolveTextValue(event))}
            helperText={summaryErrors.last_name || t('patients.resources.patients.form.lastNameHint')}
            errorMessage={summaryErrors.last_name}
            density="compact"
          />
        </StyledFieldBlock>

        <StyledFieldBlock>
          <Text variant="label">{t('patients.resources.patients.form.dateOfBirthLabel')}</Text>
          <TextField
            value={summaryValues.date_of_birth || ''}
            onChange={(event) => onSummaryFieldChange('date_of_birth', resolveTextValue(event))}
            helperText={summaryErrors.date_of_birth || t('patients.resources.patients.form.dateOfBirthHint')}
            errorMessage={summaryErrors.date_of_birth}
            density="compact"
          />
        </StyledFieldBlock>

        <StyledFieldBlock>
          <Text variant="label">{t('patients.resources.patients.form.genderLabel')}</Text>
          <Select
            value={summaryValues.gender || ''}
            options={genderOptions}
            onValueChange={(value) => onSummaryFieldChange('gender', value)}
            compact
          />
        </StyledFieldBlock>

        <StyledFieldBlock>
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

  const renderResourceEditorField = (resourceKey, field, editor, sectionTestID) => {
    const fieldName = sanitizeString(field?.name);
    if (!fieldName) return null;

    const value = editor?.values?.[fieldName];
    const errorMessage = editor?.errors?.[fieldName];
    const label = resolveFieldLabel(field, t);
    const hint = resolveFieldHint(field, t);
    const placeholder = resolveFieldPlaceholder(field, t);

    if (field?.type === 'switch') {
      return (
        <StyledFieldBlock key={fieldName}>
          <Switch
            value={Boolean(value)}
            onValueChange={(nextValue) => onResourceFieldChange(resourceKey, fieldName, nextValue)}
            label={label}
          />
          {errorMessage ? <Text variant="caption">{errorMessage}</Text> : null}
        </StyledFieldBlock>
      );
    }

    if (field?.type === 'select') {
      return (
        <StyledFieldBlock key={fieldName}>
          <Text variant="label">{label}</Text>
          <Select
            value={sanitizeString(value)}
            options={resolveSelectOptions(field, t)}
            onValueChange={(nextValue) => onResourceFieldChange(resourceKey, fieldName, nextValue)}
            helperText={errorMessage || hint}
            errorMessage={errorMessage}
            placeholder={placeholder}
            compact
            testID={`${sectionTestID}-field-${fieldName}`}
          />
        </StyledFieldBlock>
      );
    }

    return (
      <StyledFieldBlock key={fieldName}>
        <Text variant="label">{label}</Text>
        <TextField
          value={sanitizeString(value)}
          onChange={(event) => onResourceFieldChange(resourceKey, fieldName, resolveTextValue(event))}
          helperText={errorMessage || hint}
          errorMessage={errorMessage}
          placeholder={placeholder}
          maxLength={field?.maxLength}
          density="compact"
          testID={`${sectionTestID}-field-${fieldName}`}
        />
      </StyledFieldBlock>
    );
  };

  const renderResourceSection = ({
    section,
    title,
    description,
    emptyMessage,
    testID,
    icon,
  }) => {
    if (!section?.config) return null;

    const resourceKey = section.key;
    const records = Array.isArray(section.records) ? section.records : [];
    const editor = section.editor;
    const sectionErrorMessage = sanitizeString(section.errorMessage);
    const shouldShowSectionError = Boolean(sectionErrorMessage) && records.length === 0;
    const shouldShowSectionLoading = Boolean(section.isLoading)
      && records.length === 0
      && !shouldShowSectionError;

    return (
      <StyledResourceSection key={resourceKey}>
        <Card variant="outlined" testID={testID}>
          <StyledResourceSectionHeader>
            <StyledResourceSectionTitle>{title}</StyledResourceSectionTitle>
            <StyledItemActions>
              {canManagePatientRecords ? (
                <Button
                  variant="surface"
                  size="small"
                  onPress={() => onResourceCreate(resourceKey)}
                  accessibilityLabel={t('patients.workspace.actions.newRecord')}
                  icon={<Icon glyph={'+'} size="xs" decorative />}
                  testID={`${testID}-add`}
                >
                  {t('patients.workspace.actions.newRecord')}
                </Button>
              ) : null}
            </StyledItemActions>
          </StyledResourceSectionHeader>
          {sanitizeString(description) ? (
            <StyledResourceSectionDescription>{description}</StyledResourceSectionDescription>
          ) : null}

          {shouldShowSectionLoading ? (
            <LoadingSpinner accessibilityLabel={t('common.loading')} />
          ) : shouldShowSectionError ? (
            <ErrorState
              size={ErrorStateSizes.SMALL}
              title={t('patients.workspace.state.loadError')}
              description={sectionErrorMessage}
              testID={`${testID}-error`}
            />
          ) : records.length === 0 ? (
            <EmptyState
              title={emptyMessage}
              description={emptyMessage}
              testID={`${testID}-empty`}
            />
          ) : (
            <StyledFormGrid>
              {records.map((record, index) => {
                const rowTitle = sanitizeString(section.config.getItemTitle?.(record, t))
                  || t('patients.common.list.unnamedRecord', { position: index + 1 });
                const rowSubtitle = sanitizeString(section.config.getItemSubtitle?.(record, t))
                  || fallbackLabel;
                const rowMeta = sanitizeString(record?.human_friendly_id)
                  || resolveDateTimeLabel(record?.updated_at || record?.created_at, locale)
                  || '';
                const rowId = sanitizeString(record?.id);
                const rowKey = rowId || `${resourceKey}-${index + 1}`;

                return (
                  <StyledListItem key={rowKey}>
                    <StyledItemHeader>
                      <Text variant="label">{rowTitle}</Text>
                      <StyledItemActions>
                        {canManagePatientRecords ? (
                          <Button
                            variant="surface"
                            size="small"
                            onPress={() => onResourceEdit(resourceKey, record)}
                            accessibilityLabel={t('patients.workspace.actions.editRecord')}
                            icon={<Icon glyph={'\u270e'} size="xs" decorative />}
                            testID={`${testID}-edit-${index + 1}`}
                            disabled={!rowId}
                          >
                            {t('patients.workspace.actions.editRecord')}
                          </Button>
                        ) : null}
                        {canDeletePatientRecords ? (
                          <Button
                            variant="surface"
                            size="small"
                            onPress={() => onResourceDelete(resourceKey, rowId)}
                            accessibilityLabel={t('patients.workspace.actions.deleteRecord')}
                            icon={<Icon glyph={'\u2715'} size="xs" decorative />}
                            testID={`${testID}-delete-${index + 1}`}
                            disabled={!rowId}
                          >
                            {t('patients.workspace.actions.deleteRecord')}
                          </Button>
                        ) : null}
                      </StyledItemActions>
                    </StyledItemHeader>
                    <Text variant="caption">{rowSubtitle}</Text>
                    {sanitizeString(rowMeta) ? <Text variant="caption">{rowMeta}</Text> : null}
                  </StyledListItem>
                );
              })}
            </StyledFormGrid>
          )}
        </Card>

        {editor ? (
          <Card variant="outlined" testID={`${testID}-editor`}>
            <StyledResourceSectionHeader>
              <StyledResourceSectionTitle>
                {editor.mode === 'edit'
                  ? t('patients.workspace.actions.editRecord')
                  : t('patients.workspace.actions.newRecord')}
              </StyledResourceSectionTitle>
              <Icon glyph={icon} size="xs" decorative />
            </StyledResourceSectionHeader>

            <StyledFormGrid>
              {(section.config.fields || []).map((field) => (
                renderResourceEditorField(resourceKey, field, editor, testID)
              ))}
            </StyledFormGrid>

            <StyledFormActions>
              <Button
                variant="surface"
                size="small"
                onPress={() => onResourceCancel(resourceKey)}
                accessibilityLabel={t('patients.workspace.actions.cancel')}
                icon={<Icon glyph={'\u2715'} size="xs" decorative />}
                testID={`${testID}-cancel`}
              >
                {t('patients.workspace.actions.cancel')}
              </Button>
              <Button
                variant="surface"
                size="small"
                onPress={() => onResourceSubmit(resourceKey)}
                accessibilityLabel={t('patients.workspace.actions.save')}
                icon={<Icon glyph={'\u2713'} size="xs" decorative />}
                testID={`${testID}-save`}
              >
                {t('patients.workspace.actions.save')}
              </Button>
            </StyledFormActions>
          </Card>
        ) : null}
      </StyledResourceSection>
    );
  };

  const renderSelectedTabBody = () => {
    if (selectedPageTab === 'details') {
      return isSummaryEditMode ? renderSummaryEdit() : renderSummaryReadonly();
    }

    if (selectedPageTab === 'identity') {
      return (
        <>
          {renderResourceSection({
            section: resourceSections?.[resourceKeys.IDENTIFIERS],
            title: t('patients.workspace.panels.identifiers'),
            description: t('patients.resources.patientIdentifiers.overviewDescription'),
            emptyMessage: t('patients.resources.patientIdentifiers.list.emptyMessage'),
            testID: 'patient-details-identifiers',
            icon: '\ud83d\udd11',
          })}
          {renderResourceSection({
            section: resourceSections?.[resourceKeys.GUARDIANS],
            title: t('patients.workspace.panels.guardians'),
            description: t('patients.resources.patientGuardians.overviewDescription'),
            emptyMessage: t('patients.resources.patientGuardians.list.emptyMessage'),
            testID: 'patient-details-guardians',
            icon: '\ud83d\udc6a',
          })}
        </>
      );
    }

    if (selectedPageTab === 'contacts') {
      return (
        <>
          <Card variant="outlined" testID="patient-details-contacts-primary">
            <StyledSummarySection>
              <StyledSummarySectionTitle>{t('patients.workspace.patientSummary.contact')}</StyledSummarySectionTitle>
              <Text variant="body">{patientContact}</Text>
            </StyledSummarySection>
          </Card>
          {renderResourceSection({
            section: resourceSections?.[resourceKeys.CONTACTS],
            title: t('patients.workspace.panels.contacts'),
            description: t('patients.resources.patientContacts.overviewDescription'),
            emptyMessage: t('patients.resources.patientContacts.list.emptyMessage'),
            testID: 'patient-details-contacts',
            icon: '\u260e',
          })}
        </>
      );
    }

    if (selectedPageTab === 'address') {
      return renderResourceSection({
        section: resourceSections?.[resourceKeys.ADDRESSES],
        title: t('address.list.title'),
        description: t('address.list.accessibilityLabel'),
        emptyMessage: t('address.list.emptyMessage'),
        testID: 'patient-details-addresses',
        icon: '\ud83d\udccd',
      });
    }

    if (selectedPageTab === 'documents') {
      return renderResourceSection({
        section: resourceSections?.[resourceKeys.DOCUMENTS],
        title: t('patients.workspace.panels.documents'),
        description: t('patients.resources.patientDocuments.overviewDescription'),
        emptyMessage: t('patients.resources.patientDocuments.list.emptyMessage'),
        testID: 'patient-details-documents',
        icon: '\ud83d\udcc4',
      });
    }

    return null;
  };

  return (
    <StyledContainer>
      <Card variant="outlined" testID="patient-details-page-navigation">
        <StyledPageNavigation>
          <StyledPageNavigationTitle>{t('patients.workspace.title')}</StyledPageNavigationTitle>

          <StyledChromeTabsRail accessibilityRole="radiogroup">
            {screenTabs.map((tab) => (
              <StyledChromeTabButton
                key={tab.key}
                onPress={() => setSelectedPageTab(tab.key)}
                $isActive={selectedPageTab === tab.key}
                $isCompact={isCompactLayout}
                accessibilityRole="radio"
                accessibilityState={{ selected: selectedPageTab === tab.key }}
                accessibilityLabel={tab.label}
                testID={`patient-details-page-tab-${tab.key}`}
              >
                <StyledChromeTabIcon $isActive={selectedPageTab === tab.key}>
                  {tab.icon}
                </StyledChromeTabIcon>
                <StyledChromeTabLabel
                  numberOfLines={1}
                  ellipsizeMode="tail"
                  $isActive={selectedPageTab === tab.key}
                >
                  {tab.label}
                </StyledChromeTabLabel>
              </StyledChromeTabButton>
            ))}
          </StyledChromeTabsRail>
        </StyledPageNavigation>
      </Card>

      <Card variant="outlined" testID={`patient-details-page-content-${selectedPageTab}`}>
        <StyledPageNavigation>
          <Text variant="h3">{selectedPageTabConfig?.label}</Text>
          <Text variant="body">{selectedPageTabConfig?.description}</Text>
        </StyledPageNavigation>
      </Card>

      <StyledActions>
        <Button
          variant="surface"
          size="small"
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
            size="small"
            onPress={onStartSummaryEdit}
            accessibilityLabel={t('patients.workspace.actions.editPatient')}
            icon={<Icon glyph={'\u270e'} size="xs" decorative />}
            testID="patient-details-edit-patient"
            style={compactButtonStyle}
          >
            {t('patients.workspace.actions.editPatient')}
          </Button>
        ) : null}

        {selectedPageTab === 'details' && !isSummaryEditMode && canDeletePatientProfile ? (
          <Button
            variant="surface"
            size="small"
            onPress={onDeletePatient}
            accessibilityLabel={t('patients.workspace.actions.deletePatient')}
            icon={<Icon glyph={'\u2715'} size="xs" decorative />}
            testID="patient-details-delete-patient"
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
          testID="patient-details-entitlement-blocked"
        />
      ) : null}

      {!isLoading && !isEntitlementBlocked && hasError ? (
        <ErrorState
          size={ErrorStateSizes.SMALL}
          title={t('patients.workspace.state.loadError')}
          description={errorMessage}
          testID="patient-details-error"
        />
      ) : null}

      {!isLoading && !isEntitlementBlocked && isOffline ? (
        <OfflineState
          size={OfflineStateSizes.SMALL}
          title={t('shell.banners.offline.title')}
          description={t('shell.banners.offline.message')}
          testID="patient-details-offline"
        />
      ) : null}

      {!isLoading && !isEntitlementBlocked && !hasError && isPatientDeleted ? (
        <Card variant="outlined" testID="patient-details-deleted">
          <EmptyState
            title={t('patients.workspace.state.emptyPanel')}
            description={t('patients.workspace.state.emptyPanel')}
          />
        </Card>
      ) : null}

      {!isLoading && !isEntitlementBlocked && !hasError && !isPatientDeleted
        ? renderSelectedTabBody()
        : null}
    </StyledContainer>
  );
};

export default PatientDetailsScreen;
