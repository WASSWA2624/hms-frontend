import React from 'react';
import { useWindowDimensions } from 'react-native';
import {
  Button,
  EmptyState,
  ErrorState,
  ErrorStateSizes,
  GlobalSmartDateField,
  Icon,
  LoadingSpinner,
  OfflineState,
  OfflineStateSizes,
  Select,
  Text,
  TextField,
} from '@platform/components';
import { useI18n } from '@hooks';
import breakpoints from '@theme/breakpoints';
import EntitlementBlockedState from '../components/EntitlementBlockedState';
import FieldHelpTrigger from '../components/FieldHelpTrigger';
import {
  StyledActionButton,
  StyledActions,
  StyledContainer,
  StyledContentCard,
  StyledField,
  StyledForm,
  StyledFormActions,
  StyledHeader,
  StyledHeaderEyebrow,
  StyledHeroCard,
  StyledInlineBadge,
  StyledInlineBadgeLabel,
  StyledList,
  StyledListHeader,
  StyledListItemActions,
  StyledListItem,
  StyledListItemHeader,
  StyledListItemTitleBlock,
  StyledRecordMetaList,
  StyledSectionMeta,
  StyledTabButton,
  StyledTabRow,
  StyledTabSlot,
} from './PatientLegalHubScreen.styles';
import usePatientLegalHubScreen from './usePatientLegalHubScreen';

const sanitizeString = (value) => String(value || '').trim();

const resolveTextValue = (event) => (
  event?.target?.value
  ?? event?.nativeEvent?.text
  ?? ''
);

const resolveTabIcon = (tab) => (
  tab === 'terms' ? '\u270d' : '\u2696'
);

const resolveActiveTabDescription = (tab, t) => (
  tab === 'terms'
    ? t('patients.resources.termsAcceptances.overviewDescription')
    : t('patients.resources.consents.overviewDescription')
);

const resolveRecordsMeta = (tab, count, t) => {
  const resourceLabel = tab === 'terms'
    ? t('patients.resources.termsAcceptances.pluralLabel')
    : t('patients.resources.consents.pluralLabel');
  return `${count} ${resourceLabel}`;
};

const PatientLegalHubScreen = () => {
  const { t } = useI18n();
  const { width } = useWindowDimensions();
  const isCompactLayout = width < breakpoints.tablet;
  const {
    activeTab,
    tabs,
    rows,
    editor,
    patientOptions,
    userOptions,
    consentTypeOptions,
    consentStatusOptions,
    isLoading,
    isOffline,
    hasError,
    errorMessage,
    isEntitlementBlocked,
    canManagePatientRecords,
    canDeletePatientRecords,
    onSelectTab,
    onRetry,
    onStartCreate,
    onStartEdit,
    onCloseEditor,
    onEditorChange,
    onSubmitEditor,
    onDeleteRecord,
    onGoToSubscriptions,
  } = usePatientLegalHubScreen();

  const recordsMeta = resolveRecordsMeta(activeTab, rows.length, t);
  const activeTabDescription = resolveActiveTabDescription(activeTab, t);

  const renderEditor = () => {
    if (!editor) return null;

    const isConsentEditor = editor.tab === 'consents';

    const formModeLabel = editor.mode === 'edit'
      ? t('patients.common.form.modeEdit')
      : t('patients.common.form.modeCreate');
    const editorTitle = isConsentEditor
      ? (
        editor.mode === 'edit'
          ? t('patients.resources.consents.form.editTitle')
          : t('patients.resources.consents.form.createTitle')
      )
      : t('patients.resources.termsAcceptances.form.createTitle');

    return (
      <StyledContentCard variant="outlined" testID="patient-legal-editor-card">
        <StyledListHeader>
          <Text variant="h3">{editorTitle}</Text>
          <StyledInlineBadge>
            <StyledInlineBadgeLabel>{formModeLabel}</StyledInlineBadgeLabel>
          </StyledInlineBadge>
        </StyledListHeader>

        <StyledForm>
          <StyledField>
            <FieldHelpTrigger
              label={t('patients.common.form.helpLabel')}
              tooltip={t('patients.common.form.helpTooltip')}
              helpTitle={t('patients.common.form.helpTitle')}
              helpBody={t('patients.common.form.helpBody', { mode: formModeLabel })}
              helpItems={[
                t('patients.common.form.helpItems.context'),
                t('patients.common.form.helpItems.required'),
                t('patients.common.form.helpItems.actions'),
                t('patients.common.form.helpItems.recovery'),
              ]}
              testID="patient-legal-form-help"
            />
          </StyledField>

          {isConsentEditor && editor.mode !== 'edit' ? (
            <StyledField>
              <Select
                label={t('patients.common.form.patientLabel')}
                value={editor.values.patient_id || ''}
                options={patientOptions}
                onValueChange={(value) => onEditorChange('patient_id', value)}
                helperText={editor.errors?.patient_id || t('patients.common.form.patientHint')}
                errorMessage={editor.errors?.patient_id}
                compact
              />
            </StyledField>
          ) : null}

          {isConsentEditor ? (
            <>
              <StyledField>
                <Select
                  label={t('patients.resources.consents.form.consentTypeLabel')}
                  value={editor.values.consent_type || ''}
                  options={consentTypeOptions}
                  onValueChange={(value) => onEditorChange('consent_type', value)}
                  helperText={editor.errors?.consent_type || t('patients.resources.consents.form.consentTypeHint')}
                  errorMessage={editor.errors?.consent_type}
                  compact
                />
              </StyledField>

              <StyledField>
                <Select
                  label={t('patients.resources.consents.form.statusLabel')}
                  value={editor.values.status || ''}
                  options={consentStatusOptions}
                  onValueChange={(value) => onEditorChange('status', value)}
                  helperText={editor.errors?.status || t('patients.resources.consents.form.statusHint')}
                  errorMessage={editor.errors?.status}
                  compact
                />
              </StyledField>

              <StyledField>
                <GlobalSmartDateField
                  label={t('patients.resources.consents.form.grantedAtLabel')}
                  value={editor.values.granted_at || ''}
                  onValueChange={(value) => onEditorChange('granted_at', value)}
                  helperText={editor.errors?.granted_at || t('patients.resources.consents.form.grantedAtHint')}
                  errorMessage={editor.errors?.granted_at}
                  placeholder={t('patients.resources.consents.form.grantedAtPlaceholder')}
                  density="compact"
                  testID="patient-legal-granted-at"
                />
              </StyledField>

              <StyledField>
                <GlobalSmartDateField
                  label={t('patients.resources.consents.form.revokedAtLabel')}
                  value={editor.values.revoked_at || ''}
                  onValueChange={(value) => onEditorChange('revoked_at', value)}
                  helperText={editor.errors?.revoked_at || t('patients.resources.consents.form.revokedAtHint')}
                  errorMessage={editor.errors?.revoked_at}
                  placeholder={t('patients.resources.consents.form.revokedAtPlaceholder')}
                  density="compact"
                  testID="patient-legal-revoked-at"
                />
              </StyledField>
            </>
          ) : (
            <>
              <StyledField>
                <Select
                  label={t('patients.resources.termsAcceptances.form.userLabel')}
                  value={editor.values.user_id || ''}
                  options={userOptions}
                  onValueChange={(value) => onEditorChange('user_id', value)}
                  helperText={editor.errors?.user_id || t('patients.resources.termsAcceptances.form.userHint')}
                  errorMessage={editor.errors?.user_id}
                  compact
                />
              </StyledField>

              <StyledField>
                <TextField
                  label={t('patients.resources.termsAcceptances.form.versionLabel')}
                  value={editor.values.version_label || ''}
                  onChange={(event) => onEditorChange('version_label', resolveTextValue(event))}
                  helperText={editor.errors?.version_label || t('patients.resources.termsAcceptances.form.versionHint')}
                  errorMessage={editor.errors?.version_label}
                  maxLength={40}
                  density="compact"
                />
              </StyledField>
            </>
          )}
        </StyledForm>

        <StyledFormActions>
          <Button
            variant="surface"
            size="medium"
            onPress={onCloseEditor}
            accessibilityLabel={t('patients.legal.actions.cancel')}
            icon={<Icon glyph={'\u2715'} size="xs" decorative />}
          >
            {t('patients.legal.actions.cancel')}
          </Button>
          <Button
            variant="surface"
            size="medium"
            onPress={onSubmitEditor}
            accessibilityLabel={t('patients.legal.actions.save')}
            icon={<Icon glyph={'\u2713'} size="xs" decorative />}
          >
            {t('patients.legal.actions.save')}
          </Button>
        </StyledFormActions>
      </StyledContentCard>
    );
  };

  return (
    <StyledContainer>
      <StyledHeroCard variant="outlined" testID="patient-legal-navigation-card">
        <StyledHeader>
          <StyledHeaderEyebrow>{t('patients.workspace.title')}</StyledHeaderEyebrow>
          <Text variant="h2" accessibilityRole="header">{t('patients.legal.title')}</Text>
          <Text variant="body">{t('patients.legal.description')}</Text>
          <StyledSectionMeta>{activeTabDescription}</StyledSectionMeta>
        </StyledHeader>

        <StyledTabRow>
          {tabs.map((tab) => (
            <StyledTabSlot key={tab} $isCompact={isCompactLayout}>
              <StyledTabButton
                variant={tab === activeTab ? 'primary' : 'surface'}
                size="small"
                onPress={() => onSelectTab(tab)}
                accessibilityRole="tab"
                accessibilityState={{ selected: tab === activeTab }}
                accessibilityLabel={t(`patients.legal.tabs.${tab}`)}
                testID={`patient-legal-tab-${tab}`}
                icon={
                  <Icon
                    glyph={resolveTabIcon(tab)}
                    size="xs"
                    decorative
                    tone={tab === activeTab ? 'inverse' : 'default'}
                  />
                }
              >
                {t(`patients.legal.tabs.${tab}`)}
              </StyledTabButton>
            </StyledTabSlot>
          ))}
        </StyledTabRow>

        <StyledActions>
          <StyledActionButton
            $isCompact={isCompactLayout}
            variant="surface"
            size="small"
            onPress={onRetry}
            accessibilityLabel={t('patients.legal.actions.refresh')}
            icon={<Icon glyph={'\u21bb'} size="xs" decorative />}
          >
            {t('patients.legal.actions.refresh')}
          </StyledActionButton>
          {canManagePatientRecords ? (
            <StyledActionButton
              $isCompact={isCompactLayout}
              variant="surface"
              size="small"
              onPress={onStartCreate}
              accessibilityLabel={t('patients.legal.actions.newRecord')}
              icon={<Icon glyph="+" size="xs" decorative />}
            >
              {t('patients.legal.actions.newRecord')}
            </StyledActionButton>
          ) : null}
        </StyledActions>
      </StyledHeroCard>

      {isLoading ? <LoadingSpinner accessibilityLabel={t('common.loading')} /> : null}

      {!isLoading && isEntitlementBlocked ? (
        <EntitlementBlockedState
          title={t('patients.entitlement.title')}
          description={t('patients.entitlement.description')}
          actionLabel={t('patients.entitlement.cta')}
          actionHint={t('patients.entitlement.ctaHint')}
          onAction={onGoToSubscriptions}
          testID="patient-legal-entitlement-blocked"
        />
      ) : null}

      {!isLoading && !isEntitlementBlocked && hasError ? (
        <ErrorState
          size={ErrorStateSizes.SMALL}
          title={t('patients.legal.state.loadError')}
          description={errorMessage}
          testID="patient-legal-error"
        />
      ) : null}

      {!isLoading && !isEntitlementBlocked && isOffline ? (
        <OfflineState
          size={OfflineStateSizes.SMALL}
          title={t('shell.banners.offline.title')}
          description={t('shell.banners.offline.message')}
          testID="patient-legal-offline"
        />
      ) : null}

      {!isLoading && !isEntitlementBlocked && !hasError ? (
        <StyledContentCard variant="outlined" testID="patient-legal-records-card">
          <StyledListHeader>
            <Text variant="h3">{t(`patients.legal.tabs.${activeTab}`)}</Text>
            <StyledSectionMeta>{recordsMeta}</StyledSectionMeta>
          </StyledListHeader>

          {rows.length === 0 ? (
            <EmptyState
              title={t('patients.legal.state.emptyTab')}
              description={t('patients.legal.state.emptyTab')}
              testID="patient-legal-empty"
            />
          ) : (
            <StyledList>
              {rows.map((row) => (
                <StyledListItem key={row.id || row.title}>
                  <StyledListItemHeader>
                    <StyledListItemTitleBlock>
                      <Text variant="label">{row.title}</Text>
                      {activeTab === 'consents' && sanitizeString(row?.record?.status) ? (
                        <StyledInlineBadge>
                          <StyledInlineBadgeLabel>{sanitizeString(row?.record?.status)}</StyledInlineBadgeLabel>
                        </StyledInlineBadge>
                      ) : null}
                    </StyledListItemTitleBlock>

                    <StyledListItemActions>
                      {activeTab === 'consents' && canManagePatientRecords ? (
                        <Button
                          variant="surface"
                          size="small"
                          onPress={() => onStartEdit(row)}
                          accessibilityLabel={t('patients.legal.actions.editRecord')}
                          icon={<Icon glyph={'\u270e'} size="xs" decorative />}
                        >
                          {t('patients.legal.actions.editRecord')}
                        </Button>
                      ) : null}
                      {canDeletePatientRecords ? (
                        <Button
                          variant="surface"
                          size="small"
                          onPress={() => onDeleteRecord(row)}
                          accessibilityLabel={t('patients.legal.actions.deleteRecord')}
                          icon={<Icon glyph={'\u2715'} size="xs" decorative />}
                        >
                          {t('patients.legal.actions.deleteRecord')}
                        </Button>
                      ) : null}
                    </StyledListItemActions>
                  </StyledListItemHeader>

                  <StyledRecordMetaList>
                    {row.humanFriendlyId ? (
                      <Text variant="caption">
                        {t('patients.legal.labels.recordId')}: {row.humanFriendlyId}
                      </Text>
                    ) : null}

                    <Text variant="caption">
                      {activeTab === 'consents'
                        ? `${t('patients.legal.labels.patient')}: ${row.subtitle || '-'}`
                        : `${t('patients.legal.labels.user')}: ${row.subtitle || '-'}`}
                    </Text>
                  </StyledRecordMetaList>
                </StyledListItem>
              ))}
            </StyledList>
          )}
        </StyledContentCard>
      ) : null}

      {!isLoading && !isEntitlementBlocked && canManagePatientRecords ? renderEditor() : null}
    </StyledContainer>
  );
};

export default PatientLegalHubScreen;

