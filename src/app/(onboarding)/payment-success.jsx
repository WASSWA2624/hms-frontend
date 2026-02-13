/**
 * Payment Success Route
 * Step 11.1.14: post-payment activation verification.
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
  getSubscription,
  listPayments,
  listSubscriptionInvoices,
} from '@features';
import {
  mergeOnboardingContext,
  readOnboardingProgress,
  readRegistrationContext,
  saveAuthResumeContext,
  saveOnboardingStep,
} from '@navigation';
import { resolveErrorMessage, toDecimalString } from '@navigation/onboardingHelpers';

const normalizeStatus = (value) => String(value || '').trim().toUpperCase();

export default function OnboardingPaymentSuccessRoute() {
  const { t } = useI18n();
  const router = useRouter();
  const { isAuthenticated, user, loadCurrentUser } = useAuth();

  const [isHydrating, setIsHydrating] = useState(true);
  const [error, setError] = useState(null);
  const [summary, setSummary] = useState(null);

  const hydrate = useCallback(async () => {
    setIsHydrating(true);
    setError(null);
    try {
      const [registration, progress] = await Promise.all([
        readRegistrationContext(),
        readOnboardingProgress(),
      ]);

      const context = progress?.context || {};
      const subscriptionId = String(context.subscription_id || '').trim();
      const invoiceId = String(context.invoice_id || '').trim();
      const paymentId = String(context.payment_id || '').trim();

      if (!subscriptionId && !invoiceId && !paymentId) {
        setError({
          code: 'ONBOARDING_CONTEXT_MISSING',
          message: t('onboarding.paymentSuccess.errors.missingContext'),
        });
        return;
      }

      if (!isAuthenticated) {
        setSummary({
          subscription_id: subscriptionId,
          invoice_id: invoiceId,
          payment_id: paymentId,
          subscription_status: normalizeStatus(context.trial_status || 'UNKNOWN'),
          payment_status: normalizeStatus(context.payment_status || 'UNKNOWN'),
          payment_method: String(context.payment_method || '').trim().toUpperCase(),
          amount: toDecimalString(context.payment_amount || 0),
          currency: String(context.payment_currency || 'USD').trim().toUpperCase(),
          activated: false,
          auth_required: true,
        });
        return;
      }

      let effectiveUser = user;
      if (!effectiveUser?.id) {
        const loadAction = await loadCurrentUser();
        if (loadAction?.meta?.requestStatus === 'fulfilled') {
          effectiveUser = loadAction.payload || null;
        }
      }
      const resolvedTenantId = String(
        effectiveUser?.tenant_id || user?.tenant_id || context.tenant_id || registration?.tenant_id || ''
      ).trim();

      const [subscription, subscriptionInvoiceList, paymentList] = await Promise.all([
        subscriptionId ? getSubscription(subscriptionId) : Promise.resolve(null),
        subscriptionId || invoiceId
          ? listSubscriptionInvoices({
              page: 1,
              limit: 50,
              ...(subscriptionId ? { subscription_id: subscriptionId } : {}),
              ...(invoiceId ? { invoice_id: invoiceId } : {}),
            })
          : Promise.resolve([]),
        invoiceId || resolvedTenantId
          ? listPayments({
              page: 1,
              limit: 50,
              order: 'desc',
              ...(invoiceId ? { invoice_id: invoiceId } : {}),
              ...(resolvedTenantId ? { tenant_id: resolvedTenantId } : {}),
            })
          : Promise.resolve([]),
      ]);

      const links = Array.isArray(subscriptionInvoiceList) ? subscriptionInvoiceList : [];
      const payments = Array.isArray(paymentList) ? paymentList : [];

      const matchedPayment =
        (paymentId ? payments.find((item) => String(item?.id || '').trim() === paymentId) : null) ||
        payments.find((item) => normalizeStatus(item?.status) === 'COMPLETED') ||
        payments[0] ||
        null;

      const resolvedInvoiceId =
        invoiceId ||
        String(matchedPayment?.invoice_id || '').trim() ||
        String(links[0]?.invoice_id || '').trim();

      const resolvedSubscriptionStatus = normalizeStatus(subscription?.status || context.trial_status || 'UNKNOWN');
      const resolvedPaymentStatus = normalizeStatus(matchedPayment?.status || context.payment_status || 'UNKNOWN');
      const hasLinkedInvoice = links.some((item) => String(item?.invoice_id || '').trim() === resolvedInvoiceId);
      const activated = resolvedSubscriptionStatus === 'ACTIVE' && (resolvedPaymentStatus === 'COMPLETED' || hasLinkedInvoice);

      const nextSummary = {
        subscription_id: String(subscription?.id || subscriptionId).trim(),
        invoice_id: resolvedInvoiceId,
        payment_id: String(matchedPayment?.id || paymentId).trim(),
        subscription_status: resolvedSubscriptionStatus,
        payment_status: resolvedPaymentStatus,
        payment_method: String(matchedPayment?.method || context.payment_method || '').trim().toUpperCase(),
        amount: toDecimalString(matchedPayment?.amount || context.payment_amount || 0),
        currency: String(matchedPayment?.currency || context.payment_currency || 'USD').trim().toUpperCase(),
        activated,
        auth_required: false,
      };

      setSummary(nextSummary);
      await saveOnboardingStep('payment_success', nextSummary);
      await mergeOnboardingContext(nextSummary);
    } catch (caughtError) {
      const code = caughtError?.code || caughtError?.message || 'UNKNOWN_ERROR';
      const message = resolveErrorMessage(code, caughtError?.message, t);
      setError({ code, message });
    } finally {
      setIsHydrating(false);
    }
  }, [isAuthenticated, loadCurrentUser, t, user, user?.tenant_id]);

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  const handleLogin = useCallback(async () => {
    const identifier = String(user?.email || '').trim().toLowerCase();
    if (identifier) {
      await saveAuthResumeContext({
        identifier,
        next_path: '/payment-success',
        params: {},
      });
    }
    router.replace('/login');
  }, [router, user?.email]);

  const handleContinue = useCallback(() => {
    if (!summary?.activated) {
      hydrate();
      return;
    }
    router.replace('/dashboard');
  }, [hydrate, router, summary?.activated]);

  const handleBack = useCallback(() => {
    router.replace('/payment');
  }, [router]);

  if (isHydrating) {
    return <LoadingSpinner accessibilityLabel={t('common.loading')} testID="onboarding-payment-success-loading" />;
  }

  if (error || !summary) {
    return (
      <ErrorState
        size={ErrorStateSizes.SMALL}
        title={t('onboarding.paymentSuccess.errors.title')}
        description={error?.message || t('onboarding.paymentSuccess.errors.missingContext')}
        action={(
          <Button
            size="small"
            variant="surface"
            onPress={hydrate}
            accessibilityLabel={t('common.retry')}
            testID="onboarding-payment-success-retry"
          >
            {t('common.retry')}
          </Button>
        )}
        testID="onboarding-payment-success-error"
      />
    );
  }

  if (summary.auth_required) {
    return (
      <ErrorState
        size={ErrorStateSizes.SMALL}
        title={t('onboarding.paymentSuccess.errors.authRequiredTitle')}
        description={t('onboarding.paymentSuccess.errors.authRequiredDescription')}
        action={(
          <Button
            size="small"
            variant="surface"
            onPress={handleLogin}
            accessibilityLabel={t('onboarding.paymentSuccess.actions.loginHint')}
            testID="onboarding-payment-success-login"
          >
            {t('onboarding.paymentSuccess.actions.login')}
          </Button>
        )}
        testID="onboarding-payment-success-auth-required"
      />
    );
  }

  const subscriptionStatusKey = String(summary.subscription_status || 'UNKNOWN').toLowerCase();
  const paymentStatusKey = String(summary.payment_status || 'UNKNOWN').toLowerCase();

  return (
    <Container size="medium" testID="onboarding-payment-success-screen">
      <Stack spacing="md">
        <Stack spacing="xs">
          <Text variant="h3">{t('onboarding.paymentSuccess.title')}</Text>
          <Text variant="body">
            {summary.activated
              ? t('onboarding.paymentSuccess.descriptionActivated')
              : t('onboarding.paymentSuccess.descriptionPending')}
          </Text>
        </Stack>

        <Card>
          <Stack spacing="sm">
            <Stack spacing="xs">
              <Text variant="label">{t('onboarding.paymentSuccess.summary.subscriptionStatus')}</Text>
              <Text variant="body">{t(`onboarding.paymentSuccess.status.${subscriptionStatusKey}`)}</Text>
            </Stack>
            <Stack spacing="xs">
              <Text variant="label">{t('onboarding.paymentSuccess.summary.paymentStatus')}</Text>
              <Text variant="body">{t(`onboarding.paymentSuccess.paymentStatus.${paymentStatusKey}`)}</Text>
            </Stack>
            <Stack spacing="xs">
              <Text variant="label">{t('onboarding.paymentSuccess.summary.amount')}</Text>
              <Text variant="body">
                {t('onboarding.paymentSuccess.summary.amountValue', {
                  amount: toDecimalString(summary.amount || 0),
                  currency: summary.currency || 'USD',
                })}
              </Text>
            </Stack>
            <Stack spacing="xs">
              <Text variant="label">{t('onboarding.paymentSuccess.summary.method')}</Text>
              <Text variant="body">
                {summary.payment_method
                  ? t(`onboarding.payment.methods.${summary.payment_method.toLowerCase()}.title`)
                  : t('onboarding.paymentSuccess.notAvailable')}
              </Text>
            </Stack>
          </Stack>
        </Card>

        <Stack spacing="xs">
          <Button
            size="small"
            variant="primary"
            onPress={handleContinue}
            accessibilityLabel={summary.activated
              ? t('onboarding.paymentSuccess.actions.continueHint')
              : t('onboarding.paymentSuccess.actions.retryHint')}
            testID="onboarding-payment-success-primary"
          >
            {summary.activated
              ? t('onboarding.paymentSuccess.actions.continue')
              : t('onboarding.paymentSuccess.actions.retry')}
          </Button>
          <Button
            size="small"
            variant="text"
            onPress={handleBack}
            accessibilityLabel={t('onboarding.paymentSuccess.actions.backHint')}
            testID="onboarding-payment-success-back"
          >
            {t('onboarding.paymentSuccess.actions.back')}
          </Button>
        </Stack>
      </Stack>
    </Container>
  );
}
