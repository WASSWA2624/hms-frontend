import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useRouter } from 'expo-router';
import { Linking, Platform } from 'react-native';
import {
  Button,
  Card,
  Container,
  EmptyState,
  ErrorState,
  ErrorStateSizes,
  LoadingSpinner,
  OfflineState,
  OfflineStateSizes,
  Select,
  Snackbar,
  Stack,
  Text,
} from '@platform/components';
import { useBillingWorkspace, useI18n, useNetwork } from '@hooks';
import { formatDateTime } from '@utils';
import { resolveEnumLabel, usePatientPortalScope } from './shared';

const BILLING_SECTION = {
  INVOICES: 'INVOICES',
  PAYMENTS: 'PAYMENTS',
  CLAIMS: 'CLAIMS',
  ALL: 'ALL',
};

const normalize = (value) => String(value || '').trim();
const resolveInvoiceIdentifier = (entry) =>
  normalize(
    entry?.invoice_display_id ||
      entry?.invoice_backend_identifier ||
      entry?.invoice_id
  );

const matchesSection = (entry, section) => {
  const type = normalize(entry?.type).toUpperCase();
  if (section === BILLING_SECTION.INVOICES) return type === 'INVOICE';
  if (section === BILLING_SECTION.PAYMENTS) return type === 'PAYMENT' || type === 'REFUND';
  if (section === BILLING_SECTION.CLAIMS) return type === 'CLAIM';
  return true;
};

const openExternalUrl = async (url) => {
  const normalized = normalize(url);
  if (!normalized) return false;
  try {
    if (Platform.OS === 'web' && typeof window !== 'undefined') {
      window.open(normalized, '_blank', 'noopener,noreferrer');
      return true;
    }
    await Linking.openURL(normalized);
    return true;
  } catch {
    return false;
  }
};

const PatientBillingScreen = () => {
  const { t, locale } = useI18n();
  const router = useRouter();
  const { isOffline } = useNetwork();
  const scope = usePatientPortalScope();
  const workspace = useBillingWorkspace();
  const toScopedPath = scope.toScopedPath;

  const [isRefreshing, setIsRefreshing] = useState(false);
  const [section, setSection] = useState(BILLING_SECTION.ALL);
  const [ledger, setLedger] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const [notice, setNotice] = useState(null);

  const loadLedger = useCallback(async () => {
    if (!scope.isScopeReady) return;
    setIsRefreshing(true);
    setSelectedItem(null);
    const response = await workspace.getPatientLedger(scope.effectivePatientId, {
      page: 1,
      limit: 120,
    });
    if (response) {
      setLedger(response);
    } else {
      setLedger(null);
    }
    setIsRefreshing(false);
  }, [scope.effectivePatientId, scope.isScopeReady, workspace]);

  useEffect(() => {
    if (!scope.isScopeReady) return;
    loadLedger();
  }, [loadLedger, scope.isScopeReady]);

  const entries = useMemo(() => {
    const rows = Array.isArray(ledger?.ledger?.items) ? ledger.ledger.items : [];
    return rows.filter((entry) => matchesSection(entry, section));
  }, [ledger?.ledger?.items, section]);

  const sectionOptions = useMemo(
    () => [
      { value: BILLING_SECTION.ALL, label: t('patientPortal.billing.sections.all') },
      { value: BILLING_SECTION.INVOICES, label: t('patientPortal.billing.sections.invoices') },
      { value: BILLING_SECTION.PAYMENTS, label: t('patientPortal.billing.sections.payments') },
      { value: BILLING_SECTION.CLAIMS, label: t('patientPortal.billing.sections.claims') },
    ],
    [t]
  );

  const onDownloadInvoice = useCallback(
    async (invoiceIdentifier) => {
      const normalizedIdentifier = normalize(invoiceIdentifier);
      if (!normalizedIdentifier) return;
      const url = await workspace.getInvoiceDocumentUrl(normalizedIdentifier);
      const opened = await openExternalUrl(url);
      if (!opened) {
        setNotice({
          variant: 'error',
          message: t('patientPortal.billing.documentOpenError'),
        });
      }
    },
    [t, workspace]
  );

  const hasError = Boolean(workspace.errorCode);
  const isLoading = !scope.isScopeReady || isRefreshing || workspace.isLoading;

  if (!scope.isScopeReady) {
    return (
      <Container size="medium" testID="patient-billing-loading">
        <LoadingSpinner accessibilityLabel={t('common.loading')} />
      </Container>
    );
  }

  return (
    <Container size="medium" testID="patient-billing-screen">
      <Stack spacing="md">
        {notice ? (
          <Snackbar
            visible={Boolean(notice?.message)}
            message={notice?.message || ''}
            variant={notice?.variant || 'info'}
            position="bottom"
            onDismiss={() => setNotice(null)}
            testID="patient-billing-notice"
          />
        ) : null}

        <Stack spacing="xs">
          <Text variant="h3">{t('patientPortal.billing.title')}</Text>
          <Text variant="body">{t('patientPortal.billing.description')}</Text>
        </Stack>

        <Button
          variant="surface"
          size="small"
          onPress={() => router.push(toScopedPath('/portal'))}
          accessibilityLabel={t('patientPortal.common.backToPortal')}
          accessibilityHint={t('patientPortal.common.backToPortalHint')}
          testID="patient-billing-back"
        >
          {t('patientPortal.common.backToPortal')}
        </Button>

        <Card testID="patient-billing-readonly-note">
          <Stack spacing="xs">
            <Text variant="label">{t('patientPortal.billing.readOnlyTitle')}</Text>
            <Text variant="caption">{t('patientPortal.billing.readOnlyMessage')}</Text>
          </Stack>
        </Card>

        {isOffline ? (
          <OfflineState
            size={OfflineStateSizes.SMALL}
            title={t('shell.banners.offline.title')}
            description={t('patientPortal.billing.offlineMessage')}
            testID="patient-billing-offline"
          />
        ) : null}

        {hasError ? (
          <ErrorState
            size={ErrorStateSizes.SMALL}
            title={t('patientPortal.billing.loadErrorTitle')}
            description={t('patientPortal.billing.loadErrorMessage')}
            action={
              <Button
                variant="surface"
                size="small"
                onPress={loadLedger}
                accessibilityLabel={t('common.retry')}
                accessibilityHint={t('common.retryHint')}
                testID="patient-billing-retry"
              >
                {t('common.retry')}
              </Button>
            }
            testID="patient-billing-error"
          />
        ) : null}

        <Card testID="patient-billing-filters">
          <Stack spacing="sm">
            <Select
              label={t('patientPortal.billing.sectionLabel')}
              value={section}
              options={sectionOptions}
              onValueChange={(value) => setSection(String(value || BILLING_SECTION.ALL))}
              compact
              testID="patient-billing-section-select"
            />
            <Button
              variant="surface"
              size="small"
              onPress={loadLedger}
              accessibilityLabel={t('patientPortal.billing.refresh')}
              accessibilityHint={t('patientPortal.billing.refreshHint')}
              testID="patient-billing-refresh"
            >
              {t('patientPortal.billing.refresh')}
            </Button>
          </Stack>
        </Card>

        <Card testID="patient-billing-summary">
          <Stack spacing="xs">
            <Text variant="caption">
              {t('patientPortal.billing.summary.totalInvoiced', {
                value: ledger?.summary?.total_invoiced || '0.00',
              })}
            </Text>
            <Text variant="caption">
              {t('patientPortal.billing.summary.totalPaid', {
                value: ledger?.summary?.total_paid || '0.00',
              })}
            </Text>
            <Text variant="caption">
              {t('patientPortal.billing.summary.balanceDue', {
                value: ledger?.summary?.balance_due || '0.00',
              })}
            </Text>
          </Stack>
        </Card>

        {isLoading ? (
          <LoadingSpinner accessibilityLabel={t('common.loading')} testID="patient-billing-loading-indicator" />
        ) : null}

        {!isLoading && entries.length === 0 ? (
          <EmptyState
            title={t('patientPortal.billing.emptyTitle')}
            description={t('patientPortal.billing.emptyMessage')}
            testID="patient-billing-empty"
          />
        ) : null}

        {entries.map((entry, index) => {
          const entryId = normalize(entry.display_id || entry.invoice_display_id || `${entry.type}-${index + 1}`);
          const invoiceIdentifier = resolveInvoiceIdentifier(entry);
          return (
            <Card key={entryId} testID={`patient-billing-item-${index + 1}`}>
              <Stack spacing="xs">
                <Text variant="label">{entryId || t('patientPortal.common.notAvailable')}</Text>
                <Text variant="caption">
                  {resolveEnumLabel(t, 'patientPortal.billing.timelineType', entry.type)}
                </Text>
                <Text variant="caption">
                  {resolveEnumLabel(t, 'patientPortal.billing.timelineStatus', entry.status)}
                </Text>
                <Text variant="caption">
                  {formatDateTime(entry.timeline_at || entry.created_at, locale)}
                </Text>
                <Button
                  variant="surface"
                  size="small"
                  onPress={() => setSelectedItem(entry)}
                  accessibilityLabel={t('patientPortal.billing.viewDetails')}
                  accessibilityHint={t('patientPortal.billing.viewDetailsHint')}
                  testID={`patient-billing-view-${entryId}`}
                >
                  {t('patientPortal.billing.viewDetails')}
                </Button>
                {invoiceIdentifier ? (
                  <Button
                    variant="surface"
                    size="small"
                    onPress={() => onDownloadInvoice(invoiceIdentifier)}
                    testID={`patient-billing-download-${entryId}`}
                  >
                    {t('patientPortal.billing.downloadInvoice')}
                  </Button>
                ) : null}
              </Stack>
            </Card>
          );
        })}

        {selectedItem ? (
          <Card testID="patient-billing-detail">
            <Stack spacing="xs">
              <Text variant="label">{t('patientPortal.billing.detailTitle')}</Text>
              <Text variant="caption">
                {t('patientPortal.billing.detailType', {
                  type: resolveEnumLabel(t, 'patientPortal.billing.timelineType', selectedItem.type),
                })}
              </Text>
              <Text variant="caption">
                {t('patientPortal.billing.detailStatus', {
                  status: resolveEnumLabel(
                    t,
                    'patientPortal.billing.timelineStatus',
                    selectedItem.status
                  ),
                })}
              </Text>
              <Text variant="caption">
                {t('patientPortal.billing.detailDate', {
                  when: formatDateTime(
                    selectedItem.timeline_at || selectedItem.created_at,
                    locale
                  ),
                })}
              </Text>
              {resolveInvoiceIdentifier(selectedItem) ? (
                <Button
                  variant="surface"
                  size="small"
                  onPress={() =>
                    onDownloadInvoice(resolveInvoiceIdentifier(selectedItem))
                  }
                  testID="patient-billing-detail-download"
                >
                  {t('patientPortal.billing.downloadInvoice')}
                </Button>
              ) : null}
            </Stack>
          </Card>
        ) : null}
      </Stack>
    </Container>
  );
};

export default PatientBillingScreen;
