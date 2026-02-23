import React from 'react';
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
  StyledSummaryGrid,
  StyledSummaryValue,
  StyledTabRow,
} from './PatientWorkspaceScreen.styles';
import usePatientWorkspaceScreen from './usePatientWorkspaceScreen';

const PatientWorkspaceScreen = () => {
  const { t } = useI18n();
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
    onSelectTab,
    onSelectPanel,
    onRetry,
    onGoToSubscriptions,
    onStartCreate,
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

  const patientName = [patient?.first_name, patient?.last_name].filter(Boolean).join(' ').trim()
    || patient?.human_friendly_id
    || t('patients.overview.unnamedPatient', { position: 1 });

  const renderSummaryReadonly = () => (
    <Card variant="outlined">
      <StyledSummaryGrid>
        <Text variant="label">{t('patients.workspace.patientSummary.name')}</Text>
        <StyledSummaryValue>{patientName}</StyledSummaryValue>

        <Text variant="label">{t('patients.workspace.patientSummary.patientId')}</Text>
        <StyledSummaryValue>{patient?.human_friendly_id || '-'}</StyledSummaryValue>

        <Text variant="label">{t('patients.workspace.patientSummary.tenant')}</Text>
        <StyledSummaryValue>{patient?.tenant_label || patient?.tenant_human_friendly_id || '-'}</StyledSummaryValue>

        <Text variant="label">{t('patients.workspace.patientSummary.facility')}</Text>
        <StyledSummaryValue>{patient?.facility_label || patient?.facility_human_friendly_id || '-'}</StyledSummaryValue>

        <Text variant="label">{t('patients.workspace.patientSummary.dob')}</Text>
        <StyledSummaryValue>{String(patient?.date_of_birth || '').slice(0, 10) || '-'}</StyledSummaryValue>

        <Text variant="label">{t('patients.workspace.patientSummary.gender')}</Text>
        <StyledSummaryValue>{patient?.gender || '-'}</StyledSummaryValue>
      </StyledSummaryGrid>

      {canManagePatientRecords ? (
        <StyledActions>
          <Button
            variant="surface"
            size="medium"
            onPress={onStartSummaryEdit}
            accessibilityLabel={t('patients.workspace.actions.editRecord')}
            icon={<Icon glyph={'\u270e'} size="xs" decorative />}
          >
            {t('patients.workspace.actions.editRecord')}
          </Button>
        </StyledActions>
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

