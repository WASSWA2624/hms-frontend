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
import {
  EntitlementBlockedState,
  FieldHelpTrigger,
  InlineFieldGuide,
} from '../components';
import usePatientLegalHubScreen from './usePatientLegalHubScreen';

const StyledContainer = styled.View`
  flex: 1;
  gap: 14px;
`;

const StyledHeader = styled.View`
  gap: 6px;
`;

const StyledTabRow = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
  gap: 8px;
`;

const StyledActions = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
  gap: 8px;
`;

const StyledList = styled.View`
  gap: 8px;
`;

const StyledListItem = styled.View`
  border-width: 1px;
  border-color: ${({ theme }) => theme.colors.border?.subtle || '#e2e8f0'};
  border-radius: 10px;
  padding: 10px;
  gap: 4px;
`;

const StyledListItemHeader = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
`;

const StyledForm = styled.View`
  gap: 12px;
`;

const StyledField = styled.View`
  gap: 4px;
`;

const StyledFormActions = styled.View`
  flex-direction: row;
  justify-content: flex-end;
  gap: 8px;
`;

const PatientLegalHubScreen = () => {
  const { t } = useI18n();
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

  const renderEditor = () => {
    if (!editor) return null;

    const isConsentEditor = editor.tab === 'consents';

    return (
      <Card variant="outlined">
        <StyledForm>
          {isConsentEditor && editor.mode !== 'edit' ? (
            <StyledField>
              <FieldHelpTrigger
                label={t('patients.common.form.patientLabel')}
                tooltip={t('patients.common.form.patientHint')}
                helpTitle={t('patients.common.form.patientLabel')}
                helpBody={t('patients.common.form.patientHint')}
                testID="patient-legal-help-patient"
              />
              <InlineFieldGuide text={t('patients.common.form.patientHint')} />
              <Select
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
                <FieldHelpTrigger
                  label={t('patients.resources.consents.form.consentTypeLabel')}
                  tooltip={t('patients.resources.consents.form.consentTypeHint')}
                  helpTitle={t('patients.resources.consents.form.consentTypeLabel')}
                  helpBody={t('patients.resources.consents.form.consentTypeHint')}
                  testID="patient-legal-help-consent-type"
                />
                <InlineFieldGuide text={t('patients.resources.consents.form.consentTypeHint')} />
                <Select
                  value={editor.values.consent_type || ''}
                  options={consentTypeOptions}
                  onValueChange={(value) => onEditorChange('consent_type', value)}
                  helperText={editor.errors?.consent_type || t('patients.resources.consents.form.consentTypeHint')}
                  errorMessage={editor.errors?.consent_type}
                  compact
                />
              </StyledField>

              <StyledField>
                <FieldHelpTrigger
                  label={t('patients.resources.consents.form.statusLabel')}
                  tooltip={t('patients.resources.consents.form.statusHint')}
                  helpTitle={t('patients.resources.consents.form.statusLabel')}
                  helpBody={t('patients.resources.consents.form.statusHint')}
                  testID="patient-legal-help-consent-status"
                />
                <InlineFieldGuide text={t('patients.resources.consents.form.statusHint')} />
                <Select
                  value={editor.values.status || ''}
                  options={consentStatusOptions}
                  onValueChange={(value) => onEditorChange('status', value)}
                  helperText={editor.errors?.status || t('patients.resources.consents.form.statusHint')}
                  errorMessage={editor.errors?.status}
                  compact
                />
              </StyledField>

              <StyledField>
                <FieldHelpTrigger
                  label={t('patients.resources.consents.form.grantedAtLabel')}
                  tooltip={t('patients.resources.consents.form.grantedAtHint')}
                  helpTitle={t('patients.resources.consents.form.grantedAtLabel')}
                  helpBody={t('patients.resources.consents.form.grantedAtHint')}
                  testID="patient-legal-help-consent-granted-at"
                />
                <InlineFieldGuide text={t('patients.resources.consents.form.grantedAtHint')} />
                <TextField
                  value={editor.values.granted_at || ''}
                  onChange={(event) => onEditorChange('granted_at', event?.target?.value || '')}
                  helperText={editor.errors?.granted_at || t('patients.resources.consents.form.grantedAtHint')}
                  errorMessage={editor.errors?.granted_at}
                  density="compact"
                />
              </StyledField>

              <StyledField>
                <FieldHelpTrigger
                  label={t('patients.resources.consents.form.revokedAtLabel')}
                  tooltip={t('patients.resources.consents.form.revokedAtHint')}
                  helpTitle={t('patients.resources.consents.form.revokedAtLabel')}
                  helpBody={t('patients.resources.consents.form.revokedAtHint')}
                  testID="patient-legal-help-consent-revoked-at"
                />
                <InlineFieldGuide text={t('patients.resources.consents.form.revokedAtHint')} />
                <TextField
                  value={editor.values.revoked_at || ''}
                  onChange={(event) => onEditorChange('revoked_at', event?.target?.value || '')}
                  helperText={editor.errors?.revoked_at || t('patients.resources.consents.form.revokedAtHint')}
                  errorMessage={editor.errors?.revoked_at}
                  density="compact"
                />
              </StyledField>
            </>
          ) : (
            <>
              <StyledField>
                <FieldHelpTrigger
                  label={t('patients.resources.termsAcceptances.form.userLabel')}
                  tooltip={t('patients.resources.termsAcceptances.form.userHint')}
                  helpTitle={t('patients.resources.termsAcceptances.form.userLabel')}
                  helpBody={t('patients.resources.termsAcceptances.form.userHint')}
                  testID="patient-legal-help-terms-user"
                />
                <InlineFieldGuide text={t('patients.resources.termsAcceptances.form.userHint')} />
                <Select
                  value={editor.values.user_id || ''}
                  options={userOptions}
                  onValueChange={(value) => onEditorChange('user_id', value)}
                  helperText={editor.errors?.user_id || t('patients.resources.termsAcceptances.form.userHint')}
                  errorMessage={editor.errors?.user_id}
                  compact
                />
              </StyledField>

              <StyledField>
                <FieldHelpTrigger
                  label={t('patients.resources.termsAcceptances.form.versionLabel')}
                  tooltip={t('patients.resources.termsAcceptances.form.versionHint')}
                  helpTitle={t('patients.resources.termsAcceptances.form.versionLabel')}
                  helpBody={t('patients.resources.termsAcceptances.form.versionHint')}
                  testID="patient-legal-help-terms-version"
                />
                <InlineFieldGuide text={t('patients.resources.termsAcceptances.form.versionHint')} />
                <TextField
                  value={editor.values.version_label || ''}
                  onChange={(event) => onEditorChange('version_label', event?.target?.value || '')}
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
            size="small"
            onPress={onCloseEditor}
            accessibilityLabel={t('patients.legal.actions.cancel')}
            icon={<Icon glyph="?" size="xs" decorative />}
          >
            {t('patients.legal.actions.cancel')}
          </Button>
          <Button
            variant="surface"
            size="small"
            onPress={onSubmitEditor}
            accessibilityLabel={t('patients.legal.actions.save')}
            icon={<Icon glyph="?" size="xs" decorative />}
          >
            {t('patients.legal.actions.save')}
          </Button>
        </StyledFormActions>
      </Card>
    );
  };

  return (
    <StyledContainer>
      <StyledHeader>
        <Text variant="h2" accessibilityRole="header">{t('patients.legal.title')}</Text>
        <Text variant="body">{t('patients.legal.description')}</Text>
      </StyledHeader>

      <StyledTabRow>
        {tabs.map((tab) => (
          <Button
            key={tab}
            variant="surface"
            size="small"
            onPress={() => onSelectTab(tab)}
            accessibilityLabel={t(`patients.legal.tabs.${tab}`)}
            icon={<Icon glyph="?" size="xs" decorative />}
          >
            {t(`patients.legal.tabs.${tab}`)}
          </Button>
        ))}
      </StyledTabRow>

      <StyledActions>
        <Button
          variant="surface"
          size="small"
          onPress={onRetry}
          accessibilityLabel={t('patients.legal.actions.refresh')}
          icon={<Icon glyph="?" size="xs" decorative />}
        >
          {t('patients.legal.actions.refresh')}
        </Button>
        {canManagePatientRecords ? (
          <Button
            variant="surface"
            size="small"
            onPress={onStartCreate}
            accessibilityLabel={t('patients.legal.actions.newRecord')}
            icon={<Icon glyph="+" size="xs" decorative />}
          >
            {t('patients.legal.actions.newRecord')}
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
        <Card variant="outlined">
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
                    <Text variant="label">{row.title}</Text>
                    <StyledActions>
                      {activeTab === 'consents' && canManagePatientRecords ? (
                        <Button
                          variant="surface"
                          size="small"
                          onPress={() => onStartEdit(row)}
                          accessibilityLabel={t('patients.legal.actions.editRecord')}
                          icon={<Icon glyph="?" size="xs" decorative />}
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
                          icon={<Icon glyph="?" size="xs" decorative />}
                        >
                          {t('patients.legal.actions.deleteRecord')}
                        </Button>
                      ) : null}
                    </StyledActions>
                  </StyledListItemHeader>

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
                </StyledListItem>
              ))}
            </StyledList>
          )}
        </Card>
      ) : null}

      {!isLoading && !isEntitlementBlocked && canManagePatientRecords ? renderEditor() : null}
    </StyledContainer>
  );
};

export default PatientLegalHubScreen;
