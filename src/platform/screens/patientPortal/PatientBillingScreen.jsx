import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useRouter } from 'expo-router';
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
  TextField,
} from '@platform/components';
import { useI18n, useInsuranceClaim, useInvoice, useNetwork, usePayment } from '@hooks';
import { formatDateTime } from '@utils';
import {
  PAYMENT_METHOD_VALUES,
  normalizeList,
  resolveEnumLabel,
  toIsoDateTime,
  toPositiveDecimal,
  usePatientPortalScope,
} from './shared';

const BILLING_SECTION = {
  INVOICES: 'INVOICES',
  PAYMENTS: 'PAYMENTS',
  CLAIMS: 'CLAIMS',
};

const defaultPaymentForm = {
  invoice_id: '',
  method: 'MOBILE_MONEY',
  amount: '',
  paid_at: '',
};

const buildScopedParams = ({ patientId, tenantId, facilityId }) => {
  const params = {
    page: 1,
    limit: 50,
    patient_id: patientId,
  };
  if (tenantId) params.tenant_id = tenantId;
  if (facilityId) params.facility_id = facilityId;
  return params;
};

const PatientBillingScreen = () => {
  const { t, locale } = useI18n();
  const router = useRouter();
  const { isOffline } = useNetwork();
  const scope = usePatientPortalScope();
  const toScopedPath = scope.toScopedPath;
  const invoiceListApi = useInvoice();
  const invoiceDetailApi = useInvoice();
  const paymentListApi = usePayment();
  const paymentDetailApi = usePayment();
  const paymentCreateApi = usePayment();
  const claimLookupApi = useInsuranceClaim();
  const claimDetailApi = useInsuranceClaim();

  const [isRefreshing, setIsRefreshing] = useState(false);
  const [section, setSection] = useState(BILLING_SECTION.INVOICES);
  const [claims, setClaims] = useState([]);
  const [selectedEntry, setSelectedEntry] = useState(null);
  const [selectedDetail, setSelectedDetail] = useState(null);
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [paymentForm, setPaymentForm] = useState(defaultPaymentForm);
  const [paymentErrors, setPaymentErrors] = useState({});
  const [notice, setNotice] = useState(null);

  const canCreatePayments = scope.canCreatePayments && Boolean(scope.effectiveTenantId);
  const paymentWriteBlockedReason = scope.canCreatePayments
    ? t('patientPortal.billing.tenantRequired')
    : t('patientPortal.billing.paymentWriteBlocked');

  const loadBilling = useCallback(async () => {
    if (!scope.isScopeReady) return;
    setIsRefreshing(true);
    setClaims([]);
    setSelectedEntry(null);
    setSelectedDetail(null);
    invoiceListApi.reset();
    paymentListApi.reset();
    claimLookupApi.reset();

    const [invoiceResponse, paymentResponse] = await Promise.all([
      invoiceListApi.list(
        buildScopedParams({
          patientId: scope.effectivePatientId,
          tenantId: scope.effectiveTenantId,
          facilityId: scope.effectiveFacilityId,
        })
      ),
      paymentListApi.list(
        buildScopedParams({
          patientId: scope.effectivePatientId,
          tenantId: scope.effectiveTenantId,
          facilityId: scope.effectiveFacilityId,
        })
      ),
    ]);

    const invoices = normalizeList(invoiceResponse).filter((invoice) => {
      const patientId = String(invoice?.patient_id || '').trim();
      return patientId === scope.effectivePatientId;
    });

    const invoiceIds = invoices
      .map((invoice) => String(invoice?.id || '').trim())
      .filter(Boolean);

    const claimsBucket = [];
    for (const invoiceId of invoiceIds) {
      const claimResponse = await claimLookupApi.list({
        page: 1,
        limit: 50,
        invoice_id: invoiceId,
      });
      claimsBucket.push(...normalizeList(claimResponse));
    }
    setClaims(
      claimsBucket.sort((left, right) => {
        const leftTime = new Date(left?.submitted_at || left?.created_at || 0).getTime();
        const rightTime = new Date(right?.submitted_at || right?.created_at || 0).getTime();
        return rightTime - leftTime;
      })
    );

    // Keep references warm for parity with list hooks.
    void paymentResponse;
    setIsRefreshing(false);
  }, [
    claimLookupApi,
    invoiceListApi,
    paymentListApi,
    scope.effectiveFacilityId,
    scope.effectivePatientId,
    scope.effectiveTenantId,
    scope.isScopeReady,
  ]);

  useEffect(() => {
    if (!scope.isScopeReady) return;
    loadBilling();
  }, [loadBilling, scope.isScopeReady]);

  const invoices = useMemo(
    () =>
      normalizeList(invoiceListApi.data)
        .filter((invoice) => {
          const patientId = String(invoice?.patient_id || '').trim();
          return patientId === scope.effectivePatientId;
        })
        .sort((left, right) => {
          const leftTime = new Date(left?.issued_at || left?.created_at || 0).getTime();
          const rightTime = new Date(right?.issued_at || right?.created_at || 0).getTime();
          return rightTime - leftTime;
        }),
    [invoiceListApi.data, scope.effectivePatientId]
  );

  const payments = useMemo(
    () =>
      normalizeList(paymentListApi.data)
        .filter((payment) => {
          const patientId = String(payment?.patient_id || '').trim();
          return patientId === scope.effectivePatientId;
        })
        .sort((left, right) => {
          const leftTime = new Date(left?.paid_at || left?.created_at || 0).getTime();
          const rightTime = new Date(right?.paid_at || right?.created_at || 0).getTime();
          return rightTime - leftTime;
        }),
    [paymentListApi.data, scope.effectivePatientId]
  );

  const claimRows = useMemo(() => {
    const invoiceIdSet = new Set(invoices.map((invoice) => String(invoice?.id || '').trim()));
    return claims.filter((claim) => invoiceIdSet.has(String(claim?.invoice_id || '').trim()));
  }, [claims, invoices]);

  const sectionRows = useMemo(() => {
    if (section === BILLING_SECTION.INVOICES) return invoices;
    if (section === BILLING_SECTION.PAYMENTS) return payments;
    return claimRows;
  }, [claimRows, invoices, payments, section]);

  const invoiceOptions = useMemo(
    () =>
      invoices.map((invoice) => ({
        label: t('patientPortal.billing.invoiceOptionLabel', {
          id: String(invoice?.id || '').trim() || t('patientPortal.common.notAvailable'),
          status: resolveEnumLabel(t, 'patientPortal.billing.invoiceStatus', invoice?.status),
        }),
        value: String(invoice?.id || '').trim(),
      })),
    [invoices, t]
  );

  const paymentMethodOptions = useMemo(
    () =>
      PAYMENT_METHOD_VALUES.map((method) => ({
        label: resolveEnumLabel(t, 'patientPortal.billing.paymentMethod', method),
        value: method,
      })),
    [t]
  );

  const handleSelectEntry = useCallback(
    async (entry) => {
      if (!entry) return;
      const entryId = String(entry?.id || '').trim();
      if (!entryId) return;
      setSelectedEntry({ type: section, id: entryId });
      setSelectedDetail(null);
      invoiceDetailApi.reset();
      paymentDetailApi.reset();
      claimDetailApi.reset();

      if (section === BILLING_SECTION.INVOICES) {
        const detail = await invoiceDetailApi.get(entryId);
        if (!detail || typeof detail !== 'object') return;
        const patientId = String(detail?.patient_id || '').trim();
        if (patientId !== scope.effectivePatientId) {
          setSelectedEntry(null);
          setNotice({
            variant: 'error',
            message: t('patientPortal.common.accessDenied'),
          });
          return;
        }
        setSelectedDetail(detail || null);
        return;
      }

      if (section === BILLING_SECTION.PAYMENTS) {
        const detail = await paymentDetailApi.get(entryId);
        if (!detail || typeof detail !== 'object') return;
        const patientId = String(detail?.patient_id || '').trim();
        const invoiceId = String(detail?.invoice_id || '').trim();
        const allowedInvoiceIds = new Set(invoices.map((invoice) => String(invoice?.id || '').trim()));
        if (
          patientId !== scope.effectivePatientId ||
          !invoiceId ||
          !allowedInvoiceIds.has(invoiceId)
        ) {
          setSelectedEntry(null);
          setNotice({
            variant: 'error',
            message: t('patientPortal.common.accessDenied'),
          });
          return;
        }
        setSelectedDetail(detail || null);
        return;
      }

      const detail = await claimDetailApi.get(entryId);
      if (!detail || typeof detail !== 'object') return;
      const invoiceId = String(detail?.invoice_id || '').trim();
      const allowedInvoiceIds = new Set(invoices.map((invoice) => String(invoice?.id || '').trim()));
      if (!invoiceId || !allowedInvoiceIds.has(invoiceId)) {
        setSelectedEntry(null);
        setNotice({
          variant: 'error',
          message: t('patientPortal.common.accessDenied'),
        });
        return;
      }
      setSelectedDetail(detail || null);
    },
    [
      claimDetailApi,
      invoiceDetailApi,
      invoices,
      paymentDetailApi,
      scope.effectivePatientId,
      section,
      t,
    ]
  );

  const handleSubmitPayment = useCallback(async () => {
    if (!canCreatePayments) {
      setNotice({
        variant: 'error',
        message: paymentWriteBlockedReason,
      });
      return;
    }

    const errors = {};
    const selectedInvoiceId = String(paymentForm.invoice_id || '').trim();
    const allowedInvoiceIds = new Set(invoices.map((invoice) => String(invoice?.id || '').trim()));
    if (!selectedInvoiceId || !allowedInvoiceIds.has(selectedInvoiceId)) {
      errors.invoice_id = t('patientPortal.billing.paymentForm.invoiceInvalid');
    }

    if (!PAYMENT_METHOD_VALUES.includes(String(paymentForm.method || '').toUpperCase())) {
      errors.method = t('patientPortal.billing.paymentForm.methodInvalid');
    }

    const parsedAmount = toPositiveDecimal(paymentForm.amount);
    if (!parsedAmount) {
      errors.amount = t('patientPortal.billing.paymentForm.amountInvalid');
    }

    let paidAtIso = null;
    if (String(paymentForm.paid_at || '').trim()) {
      paidAtIso = toIsoDateTime(paymentForm.paid_at);
      if (!paidAtIso) {
        errors.paid_at = t('patientPortal.billing.paymentForm.paidAtInvalid');
      }
    }

    if (Object.keys(errors).length > 0) {
      setPaymentErrors(errors);
      return;
    }

    setPaymentErrors({});

    const created = await paymentCreateApi.create({
      tenant_id: scope.effectiveTenantId,
      facility_id: scope.effectiveFacilityId || null,
      patient_id: scope.effectivePatientId,
      invoice_id: selectedInvoiceId,
      status: 'PENDING',
      method: String(paymentForm.method || '').toUpperCase(),
      amount: parsedAmount,
      paid_at: paidAtIso || null,
      transaction_ref: null,
    });

    if (!created) {
      setNotice({
        variant: 'error',
        message: t('patientPortal.billing.paymentForm.submitError'),
      });
      return;
    }

    setNotice({
      variant: 'success',
      message: isOffline
        ? t('patientPortal.common.queuedNotice')
        : t('patientPortal.billing.paymentForm.submitSuccess'),
    });
    setShowPaymentForm(false);
    setPaymentForm(defaultPaymentForm);
    await loadBilling();
    setSection(BILLING_SECTION.PAYMENTS);
  }, [
    canCreatePayments,
    invoices,
    isOffline,
    loadBilling,
    paymentCreateApi,
    paymentForm.amount,
    paymentForm.invoice_id,
    paymentForm.method,
    paymentForm.paid_at,
    paymentWriteBlockedReason,
    scope.effectiveFacilityId,
    scope.effectivePatientId,
    scope.effectiveTenantId,
    t,
  ]);

  const hasError = Boolean(
    invoiceListApi.errorCode ||
      invoiceDetailApi.errorCode ||
      paymentListApi.errorCode ||
      paymentDetailApi.errorCode ||
      paymentCreateApi.errorCode ||
      claimLookupApi.errorCode ||
      claimDetailApi.errorCode
  );

  const isLoading =
    !scope.isScopeReady ||
    isRefreshing ||
    invoiceListApi.isLoading ||
    paymentListApi.isLoading ||
    claimLookupApi.isLoading;

  const detailLoading =
    invoiceDetailApi.isLoading ||
    paymentDetailApi.isLoading ||
    claimDetailApi.isLoading;

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
            action={(
              <Button
                variant="surface"
                size="small"
                onPress={loadBilling}
                accessibilityLabel={t('common.retry')}
                accessibilityHint={t('common.retryHint')}
                testID="patient-billing-retry"
              >
                {t('common.retry')}
              </Button>
            )}
            testID="patient-billing-error"
          />
        ) : null}

        <Card accessibilityLabel={t('patientPortal.billing.sectionLabel')} testID="patient-billing-sections">
          <Stack spacing="xs">
            <Button
              variant="surface"
              size="small"
              onPress={() => setSection(BILLING_SECTION.INVOICES)}
              accessibilityLabel={t('patientPortal.billing.sections.invoices')}
              accessibilityHint={t('patientPortal.billing.sectionsHint')}
              testID="patient-billing-section-invoices"
            >
              {t('patientPortal.billing.sections.invoices')}
            </Button>
            <Button
              variant="surface"
              size="small"
              onPress={() => setSection(BILLING_SECTION.PAYMENTS)}
              accessibilityLabel={t('patientPortal.billing.sections.payments')}
              accessibilityHint={t('patientPortal.billing.sectionsHint')}
              testID="patient-billing-section-payments"
            >
              {t('patientPortal.billing.sections.payments')}
            </Button>
            <Button
              variant="surface"
              size="small"
              onPress={() => setSection(BILLING_SECTION.CLAIMS)}
              accessibilityLabel={t('patientPortal.billing.sections.claims')}
              accessibilityHint={t('patientPortal.billing.sectionsHint')}
              testID="patient-billing-section-claims"
            >
              {t('patientPortal.billing.sections.claims')}
            </Button>
            <Button
              variant="surface"
              size="small"
              onPress={loadBilling}
              accessibilityLabel={t('patientPortal.billing.refresh')}
              accessibilityHint={t('patientPortal.billing.refreshHint')}
              testID="patient-billing-refresh"
            >
              {t('patientPortal.billing.refresh')}
            </Button>
          </Stack>
        </Card>

        <Button
          variant="surface"
          size="small"
          onPress={() => setShowPaymentForm((prev) => !prev)}
          disabled={!canCreatePayments}
          aria-disabled={!canCreatePayments}
          title={!canCreatePayments ? paymentWriteBlockedReason : undefined}
          accessibilityLabel={t('patientPortal.billing.paymentForm.toggle')}
          accessibilityHint={t('patientPortal.billing.paymentForm.toggleHint')}
          testID="patient-billing-toggle-payment-form"
        >
          {t('patientPortal.billing.paymentForm.toggle')}
        </Button>
        {!canCreatePayments ? (
          <Text variant="caption">{paymentWriteBlockedReason}</Text>
        ) : null}

        {showPaymentForm ? (
          <Card accessibilityLabel={t('patientPortal.billing.paymentForm.title')} testID="patient-billing-payment-form">
            <Stack spacing="sm">
              <Text variant="label">{t('patientPortal.billing.paymentForm.title')}</Text>
              <Select
                label={t('patientPortal.billing.paymentForm.invoiceLabel')}
                value={paymentForm.invoice_id}
                options={invoiceOptions}
                onValueChange={(value) => setPaymentForm((prev) => ({ ...prev, invoice_id: String(value || '') }))}
                errorMessage={paymentErrors.invoice_id}
                accessibilityLabel={t('patientPortal.billing.paymentForm.invoiceLabel')}
                accessibilityHint={t('patientPortal.billing.paymentForm.invoiceHint')}
                testID="patient-billing-payment-invoice"
              />
              <Select
                label={t('patientPortal.billing.paymentForm.methodLabel')}
                value={paymentForm.method}
                options={paymentMethodOptions}
                onValueChange={(value) => setPaymentForm((prev) => ({ ...prev, method: String(value || '') }))}
                errorMessage={paymentErrors.method}
                accessibilityLabel={t('patientPortal.billing.paymentForm.methodLabel')}
                accessibilityHint={t('patientPortal.billing.paymentForm.methodHint')}
                testID="patient-billing-payment-method"
              />
              <TextField
                label={t('patientPortal.billing.paymentForm.amountLabel')}
                value={paymentForm.amount}
                onChangeText={(value) => setPaymentForm((prev) => ({ ...prev, amount: value }))}
                placeholder={t('patientPortal.billing.paymentForm.amountPlaceholder')}
                errorMessage={paymentErrors.amount}
                accessibilityLabel={t('patientPortal.billing.paymentForm.amountLabel')}
                accessibilityHint={t('patientPortal.billing.paymentForm.amountHint')}
                testID="patient-billing-payment-amount"
              />
              <TextField
                label={t('patientPortal.billing.paymentForm.paidAtLabel')}
                value={paymentForm.paid_at}
                onChangeText={(value) => setPaymentForm((prev) => ({ ...prev, paid_at: value }))}
                type="datetime-local"
                placeholder={t('patientPortal.billing.paymentForm.paidAtPlaceholder')}
                errorMessage={paymentErrors.paid_at}
                accessibilityLabel={t('patientPortal.billing.paymentForm.paidAtLabel')}
                accessibilityHint={t('patientPortal.billing.paymentForm.paidAtHint')}
                testID="patient-billing-payment-paid-at"
              />
              <Stack spacing="xs">
                <Button
                  variant="surface"
                  size="small"
                  onPress={handleSubmitPayment}
                  disabled={paymentCreateApi.isLoading}
                  aria-disabled={paymentCreateApi.isLoading}
                  accessibilityLabel={t('patientPortal.billing.paymentForm.submit')}
                  accessibilityHint={t('patientPortal.billing.paymentForm.submitHint')}
                  testID="patient-billing-payment-submit"
                >
                  {t('patientPortal.billing.paymentForm.submit')}
                </Button>
                <Button
                  variant="surface"
                  size="small"
                  onPress={() => {
                    setShowPaymentForm(false);
                    setPaymentForm(defaultPaymentForm);
                    setPaymentErrors({});
                  }}
                  accessibilityLabel={t('common.cancel')}
                  accessibilityHint={t('patientPortal.billing.paymentForm.cancelHint')}
                  testID="patient-billing-payment-cancel"
                >
                  {t('common.cancel')}
                </Button>
              </Stack>
            </Stack>
          </Card>
        ) : null}

        {isLoading ? (
          <LoadingSpinner accessibilityLabel={t('common.loading')} testID="patient-billing-loading-indicator" />
        ) : null}

        {!isLoading && sectionRows.length === 0 ? (
          <EmptyState
            title={t('patientPortal.billing.emptyTitle')}
            description={t('patientPortal.billing.emptyMessage')}
            testID="patient-billing-empty"
          />
        ) : null}

        {sectionRows.map((row) => (
          <Card key={row.id} testID={`patient-billing-item-${section}-${row.id}`}>
            <Stack spacing="xs">
              {section === BILLING_SECTION.INVOICES ? (
                <>
                  <Text variant="label">
                    {t('patientPortal.billing.rowInvoiceId', {
                      id: String(row?.id || '').trim() || t('patientPortal.common.notAvailable'),
                    })}
                  </Text>
                  <Text variant="caption">
                    {t('patientPortal.billing.rowInvoiceStatus', {
                      status: resolveEnumLabel(t, 'patientPortal.billing.invoiceStatus', row?.status),
                    })}
                  </Text>
                  <Text variant="caption">
                    {t('patientPortal.billing.rowInvoiceBillingStatus', {
                      status: resolveEnumLabel(
                        t,
                        'patientPortal.billing.invoiceBillingStatus',
                        row?.billing_status
                      ),
                    })}
                  </Text>
                </>
              ) : null}

              {section === BILLING_SECTION.PAYMENTS ? (
                <>
                  <Text variant="label">
                    {t('patientPortal.billing.rowPaymentId', {
                      id: String(row?.id || '').trim() || t('patientPortal.common.notAvailable'),
                    })}
                  </Text>
                  <Text variant="caption">
                    {t('patientPortal.billing.rowPaymentStatus', {
                      status: resolveEnumLabel(t, 'patientPortal.billing.paymentStatus', row?.status),
                    })}
                  </Text>
                  <Text variant="caption">
                    {t('patientPortal.billing.rowPaymentMethod', {
                      method: resolveEnumLabel(t, 'patientPortal.billing.paymentMethod', row?.method),
                    })}
                  </Text>
                </>
              ) : null}

              {section === BILLING_SECTION.CLAIMS ? (
                <>
                  <Text variant="label">
                    {t('patientPortal.billing.rowClaimId', {
                      id: String(row?.id || '').trim() || t('patientPortal.common.notAvailable'),
                    })}
                  </Text>
                  <Text variant="caption">
                    {t('patientPortal.billing.rowClaimStatus', {
                      status: resolveEnumLabel(t, 'patientPortal.billing.claimStatus', row?.status),
                    })}
                  </Text>
                </>
              ) : null}

              <Text variant="caption">
                {formatDateTime(
                  row?.issued_at || row?.paid_at || row?.submitted_at || row?.created_at,
                  locale
                )}
              </Text>

              <Button
                variant="surface"
                size="small"
                onPress={() => handleSelectEntry(row)}
                accessibilityLabel={t('patientPortal.billing.viewDetails')}
                accessibilityHint={t('patientPortal.billing.viewDetailsHint')}
                testID={`patient-billing-view-${section}-${row.id}`}
              >
                {t('patientPortal.billing.viewDetails')}
              </Button>
            </Stack>
          </Card>
        ))}

        {selectedEntry ? (
          <Card accessibilityLabel={t('patientPortal.billing.detailTitle')} testID="patient-billing-detail">
            <Stack spacing="xs">
              <Text variant="label">{t('patientPortal.billing.detailTitle')}</Text>
              {detailLoading ? (
                <LoadingSpinner accessibilityLabel={t('common.loading')} testID="patient-billing-detail-loading" />
              ) : (
                <>
                  <Text variant="caption">
                    {t('patientPortal.billing.detailType', {
                      type:
                        selectedEntry.type === BILLING_SECTION.INVOICES
                          ? t('patientPortal.billing.sections.invoices')
                          : selectedEntry.type === BILLING_SECTION.PAYMENTS
                            ? t('patientPortal.billing.sections.payments')
                            : t('patientPortal.billing.sections.claims'),
                    })}
                  </Text>
                  {selectedEntry.type === BILLING_SECTION.INVOICES ? (
                    <>
                      <Text variant="caption">
                        {t('patientPortal.billing.detailInvoiceStatus', {
                          status: resolveEnumLabel(
                            t,
                            'patientPortal.billing.invoiceStatus',
                            selectedDetail?.status
                          ),
                        })}
                      </Text>
                      <Text variant="caption">
                        {t('patientPortal.billing.detailInvoiceBillingStatus', {
                          status: resolveEnumLabel(
                            t,
                            'patientPortal.billing.invoiceBillingStatus',
                            selectedDetail?.billing_status
                          ),
                        })}
                      </Text>
                    </>
                  ) : null}
                  {selectedEntry.type === BILLING_SECTION.PAYMENTS ? (
                    <>
                      <Text variant="caption">
                        {t('patientPortal.billing.detailPaymentStatus', {
                          status: resolveEnumLabel(
                            t,
                            'patientPortal.billing.paymentStatus',
                            selectedDetail?.status
                          ),
                        })}
                      </Text>
                      <Text variant="caption">
                        {t('patientPortal.billing.detailPaymentMethod', {
                          method: resolveEnumLabel(
                            t,
                            'patientPortal.billing.paymentMethod',
                            selectedDetail?.method
                          ),
                        })}
                      </Text>
                    </>
                  ) : null}
                  {selectedEntry.type === BILLING_SECTION.CLAIMS ? (
                    <Text variant="caption">
                      {t('patientPortal.billing.detailClaimStatus', {
                        status: resolveEnumLabel(
                          t,
                          'patientPortal.billing.claimStatus',
                          selectedDetail?.status
                        ),
                      })}
                    </Text>
                  ) : null}
                  <Text variant="caption">
                    {t('patientPortal.billing.detailDate', {
                      when: formatDateTime(
                        selectedDetail?.issued_at ||
                          selectedDetail?.paid_at ||
                          selectedDetail?.submitted_at ||
                          selectedDetail?.created_at,
                        locale
                      ),
                    })}
                  </Text>
                </>
              )}
            </Stack>
          </Card>
        ) : null}
      </Stack>
    </Container>
  );
};

export default PatientBillingScreen;
