/**
 * Payment Route
 * Step 11.1.13: payment checkout using mounted billing endpoints.
 */
import React, { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'expo-router';
import { useAuth, useI18n } from '@hooks';
import {
  Button,
  Card,
  Container,
  ErrorState,
  ErrorStateSizes,
  LoadingSpinner,
  Stack,
  Text,
} from '@platform/components';
import {
  createInvoice,
  createPayment,
  createSubscriptionInvoice,
  listSubscriptionInvoices,
  listSubscriptionPlans,
  updateInvoice,
  updateSubscription,
} from '@features';
import {
  mergeOnboardingContext,
  readOnboardingProgress,
  readRegistrationContext,
  saveAuthResumeContext,
  saveOnboardingStep,
} from '@navigation';
import { resolveErrorMessage, toDecimalString, toIsoTimestamp } from '@navigation/onboardingHelpers';
import withRouteTermsAcceptance from '../shared/withRouteTermsAcceptance';

const PAYMENT_METHODS = ['CREDIT_CARD', 'MOBILE_MONEY', 'BANK_TRANSFER'];

function OnboardingPaymentRoute() {
  const { t } = useI18n();
  const router = useRouter();
  const { isAuthenticated, user } = useAuth();

  const [isHydrating, setIsHydrating] = useState(true);
  const [isPaying, setIsPaying] = useState(false);
  const [error, setError] = useState(null);
  const [notice, setNotice] = useState('');

  const [checkoutContext, setCheckoutContext] = useState({
    tenant_id: '',
    facility_id: '',
    subscription_id: '',
    subscription_plan_id: '',
    invoice_id: '',
    payment_id: '',
    billing_cycle: 'MONTHLY',
    amount: '0.00',
    currency: 'USD',
  });
  const [selectedMethod, setSelectedMethod] = useState('MOBILE_MONEY');

  const hydrate = useCallback(async () => {
    setIsHydrating(true);
    setError(null);
    setNotice('');

    try {
      const [registration, progress] = await Promise.all([
        readRegistrationContext(),
        readOnboardingProgress(),
      ]);

      const resolvedContext = {
        tenant_id: String(user?.tenant_id || progress?.context?.tenant_id || registration?.tenant_id || '').trim(),
        facility_id: String(user?.facility_id || progress?.context?.facility_id || registration?.facility_id || '').trim(),
        subscription_id: String(progress?.context?.subscription_id || '').trim(),
        subscription_plan_id: String(progress?.context?.subscription_plan_id || '').trim(),
        invoice_id: String(progress?.context?.invoice_id || '').trim(),
        payment_id: String(progress?.context?.payment_id || '').trim(),
        billing_cycle: String(progress?.context?.billing_cycle || 'MONTHLY').trim().toUpperCase(),
        amount: toDecimalString(progress?.context?.payment_amount || 0),
        currency: String(progress?.context?.payment_currency || 'USD').trim().toUpperCase(),
      };

      const method = String(progress?.context?.payment_method || 'MOBILE_MONEY').trim().toUpperCase();
      setSelectedMethod(PAYMENT_METHODS.includes(method) ? method : 'MOBILE_MONEY');

      if (isAuthenticated && resolvedContext.subscription_plan_id) {
        const plans = await listSubscriptionPlans({ page: 1, limit: 100 });
        const plan = Array.isArray(plans)
          ? plans.find((item) => item?.id === resolvedContext.subscription_plan_id)
          : null;
        if (plan?.price !== undefined && plan?.price !== null) {
          resolvedContext.amount = toDecimalString(plan.price);
        }
      }

      setCheckoutContext(resolvedContext);
      await saveOnboardingStep('payment', {
        ...resolvedContext,
        payment_method: method,
      });
    } catch (caughtError) {
      const code = caughtError?.code || caughtError?.message || 'UNKNOWN_ERROR';
      const message = resolveErrorMessage(code, caughtError?.message, t);
      setError({ code, message });
    } finally {
      setIsHydrating(false);
    }
  }, [isAuthenticated, t, user?.facility_id, user?.tenant_id]);

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  const ensureLoginResume = useCallback(async () => {
    let identifier = String(user?.email || '').trim().toLowerCase();
    if (!identifier) {
      const [progress, registration] = await Promise.all([
        readOnboardingProgress(),
        readRegistrationContext(),
      ]);
      identifier = String(progress?.context?.email || registration?.email || '').trim().toLowerCase();
    }
    if (!identifier) return;
    await saveAuthResumeContext({
      identifier,
      next_path: '/payment',
      params: {},
    });
  }, [user?.email]);

  const handleSelectMethod = useCallback((method) => {
    if (!PAYMENT_METHODS.includes(method)) return;
    setSelectedMethod(method);
    setError(null);
  }, []);

  const handlePay = useCallback(async () => {
    if (isPaying) return;
    setError(null);
    setNotice('');

    if (!isAuthenticated) {
      const message = t('onboarding.payment.errors.authRequired');
      setError({ code: 'UNAUTHORIZED', message });
      await ensureLoginResume();
      return;
    }

    if (!checkoutContext.subscription_id) {
      setError({
        code: 'ONBOARDING_SUBSCRIPTION_REQUIRED',
        message: t('onboarding.payment.errors.subscriptionRequired'),
      });
      return;
    }

    if (!checkoutContext.tenant_id) {
      setError({
        code: 'ONBOARDING_TENANT_REQUIRED',
        message: t('onboarding.payment.errors.tenantRequired'),
      });
      return;
    }

    const amount = toDecimalString(checkoutContext.amount || 0);
    if (Number(amount) <= 0) {
      setError({
        code: 'ONBOARDING_PAYMENT_AMOUNT_INVALID',
        message: t('onboarding.payment.errors.amountInvalid'),
      });
      return;
    }

    setIsPaying(true);
    try {
      let invoiceId = checkoutContext.invoice_id;
      if (!invoiceId) {
        const createdInvoice = await createInvoice({
          tenant_id: checkoutContext.tenant_id,
          facility_id: checkoutContext.facility_id || null,
          patient_id: null,
          status: 'SENT',
          billing_status: 'ISSUED',
          total_amount: amount,
          currency: checkoutContext.currency || 'USD',
          issued_at: toIsoTimestamp(new Date()),
        });
        invoiceId = String(createdInvoice?.id || '').trim();
        if (invoiceId) {
          setCheckoutContext((prev) => ({ ...prev, invoice_id: invoiceId }));
          try {
            await mergeOnboardingContext({
              invoice_id: invoiceId,
              payment_amount: amount,
              payment_currency: checkoutContext.currency || 'USD',
              payment_method: selectedMethod,
            });
          } catch {
            // Keep checkout in-memory even if progress persistence fails.
          }
        }
      }

      if (!invoiceId) {
        throw new Error('INVOICE_CREATE_FAILED');
      }

      const links = await listSubscriptionInvoices({
        page: 1,
        limit: 20,
        subscription_id: checkoutContext.subscription_id,
        invoice_id: invoiceId,
      });
      const hasLink = Array.isArray(links) && links.length > 0;
      if (!hasLink) {
        await createSubscriptionInvoice({
          subscription_id: checkoutContext.subscription_id,
          invoice_id: invoiceId,
        });
      }

      let paymentId = String(checkoutContext.payment_id || '').trim();
      if (!paymentId) {
        const createdPayment = await createPayment({
          tenant_id: checkoutContext.tenant_id,
          facility_id: checkoutContext.facility_id || null,
          patient_id: null,
          invoice_id: invoiceId,
          status: 'COMPLETED',
          method: selectedMethod,
          amount,
          paid_at: toIsoTimestamp(new Date()),
          transaction_ref: `onboarding-${Date.now()}`,
        });
        paymentId = String(createdPayment?.id || '').trim();
        if (!paymentId) {
          throw new Error('PAYMENT_CREATE_FAILED');
        }
        setCheckoutContext((prev) => ({ ...prev, invoice_id: invoiceId, payment_id: paymentId }));
        try {
          await mergeOnboardingContext({
            invoice_id: invoiceId,
            payment_id: paymentId,
            payment_status: 'COMPLETED',
            payment_method: selectedMethod,
            payment_amount: amount,
            payment_currency: checkoutContext.currency || 'USD',
          });
        } catch {
          // Keep checkout in-memory even if progress persistence fails.
        }
      }

      try {
        await updateInvoice(invoiceId, {
          status: 'PAID',
          billing_status: 'PAID',
        });
      } catch {
        // Non-blocking: payment/subscription activation remains source of truth.
      }

      await updateSubscription(checkoutContext.subscription_id, { status: 'ACTIVE' });

      await mergeOnboardingContext({
        invoice_id: invoiceId,
        payment_id: paymentId,
        payment_status: 'COMPLETED',
        payment_method: selectedMethod,
        payment_amount: amount,
        payment_currency: checkoutContext.currency || 'USD',
        trial_status: 'ACTIVE',
      });
      await saveOnboardingStep('payment_success', {
        invoice_id: invoiceId,
        payment_id: paymentId,
        payment_status: 'COMPLETED',
        payment_method: selectedMethod,
        subscription_id: checkoutContext.subscription_id,
      });

      setNotice(t('onboarding.payment.feedback.success'));
      router.replace('/payment-success');
    } catch (caughtError) {
      const code = caughtError?.code || caughtError?.message || 'UNKNOWN_ERROR';
      const message = resolveErrorMessage(code, caughtError?.message, t);
      setError({ code, message });
    } finally {
      setIsPaying(false);
    }
  }, [checkoutContext, ensureLoginResume, isAuthenticated, isPaying, router, selectedMethod, t]);

  const handleBack = useCallback(() => {
    router.replace('/billing-cycle');
  }, [router]);

  const handleLogin = useCallback(async () => {
    await ensureLoginResume();
    router.push('/login');
  }, [ensureLoginResume, router]);

  if (isHydrating) {
    return <LoadingSpinner accessibilityLabel={t('common.loading')} testID="onboarding-payment-loading" />;
  }

  const payBlocked = !isAuthenticated || isPaying;
  const payBlockedReason = !isAuthenticated
    ? t('onboarding.payment.actions.payBlockedAuth')
    : isPaying
      ? t('onboarding.payment.actions.payBlockedPending')
      : '';

  const methodCards = PAYMENT_METHODS.map((method) => {
    const selected = selectedMethod === method;
    const methodKey = method.toLowerCase();
    return (
      <Card key={method}>
        <Stack spacing="xs">
          <Text variant="label">{t(`onboarding.payment.methods.${methodKey}.title`)}</Text>
          <Text variant="caption">{t(`onboarding.payment.methods.${methodKey}.description`)}</Text>
          <Button
            size="small"
            variant={selected ? 'surface' : 'text'}
            onPress={() => handleSelectMethod(method)}
            accessibilityLabel={t('onboarding.payment.actions.selectMethodHint')}
            testID={`onboarding-payment-method-${methodKey}`}
          >
            {selected ? t('onboarding.payment.actions.selectedMethod') : t('onboarding.payment.actions.selectMethod')}
          </Button>
        </Stack>
      </Card>
    );
  });

  return (
    <Container size="medium" testID="onboarding-payment-screen">
      <Stack spacing="md">
        <Stack spacing="xs">
          {!isAuthenticated ? (
            <Text variant="caption">{t('onboarding.payment.readOnly')}</Text>
          ) : null}
        </Stack>

        <Card>
          <Stack spacing="xs">
            <Text variant="label">{t('onboarding.payment.summary.amount')}</Text>
            <Text variant="body">
              {t('onboarding.payment.summary.amountValue', {
                amount: toDecimalString(checkoutContext.amount || 0),
                currency: checkoutContext.currency || 'USD',
              })}
            </Text>
            <Text variant="caption">
              {t('onboarding.payment.summary.cycle', {
                cycle: t(`onboarding.billingCycle.options.${String(checkoutContext.billing_cycle || 'MONTHLY').toLowerCase()}`),
              })}
            </Text>
          </Stack>
        </Card>

        <Stack spacing="sm">{methodCards}</Stack>

        <Stack spacing="xs">
          {!isAuthenticated ? (
            <Button
              size="small"
              variant="surface"
              onPress={handleLogin}
              accessibilityLabel={t('onboarding.payment.actions.loginHint')}
              testID="onboarding-payment-login"
            >
              {t('onboarding.payment.actions.login')}
            </Button>
          ) : null}
          <Button
            size="small"
            variant="primary"
            onPress={handlePay}
            loading={isPaying}
            disabled={payBlocked}
            aria-disabled={payBlocked ? 'true' : undefined}
            accessibilityHint={payBlockedReason || t('onboarding.payment.actions.payHint')}
            accessibilityLabel={t('onboarding.payment.actions.payHint')}
            testID="onboarding-payment-pay"
          >
            {t('onboarding.payment.actions.pay')}
          </Button>
          {payBlockedReason ? (
            <Text variant="caption" testID="onboarding-payment-pay-reason">
              {payBlockedReason}
            </Text>
          ) : null}
          <Button
            size="small"
            variant="text"
            onPress={handleBack}
            accessibilityLabel={t('onboarding.payment.actions.backHint')}
            testID="onboarding-payment-back"
          >
            {t('onboarding.payment.actions.back')}
          </Button>
        </Stack>

        {notice ? (
          <Text variant="caption" testID="onboarding-payment-notice">
            {notice}
          </Text>
        ) : null}

        {error ? (
          <ErrorState
            size={ErrorStateSizes.SMALL}
            title={t('onboarding.payment.errors.title')}
            description={error.message}
            testID="onboarding-payment-error"
          />
        ) : null}
      </Stack>
    </Container>
  );
}

export default withRouteTermsAcceptance(OnboardingPaymentRoute, { screenKey: 'onboarding-payment' });
