/**
 * Onboarding Group Route Layout
 * Shared layout for onboarding routes.
 */
import React, { useEffect, useMemo, useState } from 'react';
import { Slot, usePathname, useRouter } from 'expo-router';
import { useSelector } from 'react-redux';
import { useI18n, useSessionRestore } from '@hooks';
import { LoadingSpinner } from '@platform/components';
import { AuthLayout } from '@platform/layouts';
import { readOnboardingProgress, readRegistrationContext, saveAuthResumeContext } from '@navigation';

const ONBOARDING_SCREEN_META = {
  '/resume': {
    titleKey: 'onboarding.resume.title',
    subtitleKey: 'onboarding.resume.description',
  },
  '/provisioning': {
    titleKey: 'onboarding.provisioning.title',
    subtitleKey: 'onboarding.provisioning.subtitle',
  },
  '/welcome': {
    titleKey: 'onboarding.welcome.title',
    subtitleKey: 'onboarding.welcome.description',
  },
  '/checklist': {
    titleKey: 'onboarding.checklist.title',
    subtitleKey: 'onboarding.checklist.description',
  },
  '/modules': {
    titleKey: 'onboarding.modules.title',
    subtitleKey: 'onboarding.modules.description',
  },
  '/trial': {
    titleKey: 'onboarding.trial.title',
    subtitleKey: 'onboarding.trial.description',
  },
  '/upgrade': {
    titleKey: 'onboarding.upgrade.title',
    subtitleKey: 'onboarding.upgrade.description',
  },
  '/plan': {
    titleKey: 'onboarding.plan.title',
    subtitleKey: 'onboarding.plan.description',
  },
  '/billing-cycle': {
    titleKey: 'onboarding.billingCycle.title',
    subtitleKey: 'onboarding.billingCycle.description',
  },
  '/payment': {
    titleKey: 'onboarding.payment.title',
    subtitleKey: 'onboarding.payment.description',
  },
  '/payment-success': {
    titleKey: 'onboarding.paymentSuccess.title',
    subtitleKey: 'onboarding.paymentSuccess.subtitle',
  },
};

const AUTH_REQUIRED_PATHS = new Set([
  '/plan',
  '/billing-cycle',
  '/payment',
  '/payment-success',
  '/(onboarding)/plan',
  '/(onboarding)/billing-cycle',
  '/(onboarding)/payment',
  '/(onboarding)/payment-success',
]);

const normalizeOnboardingPath = (pathname) => {
  if (!pathname) return '/';
  if (pathname.startsWith('/(onboarding)/')) {
    return pathname.replace('/(onboarding)', '');
  }
  return pathname;
};

function OnboardingGroupLayout() {
  const { t } = useI18n();
  const router = useRouter();
  const pathname = usePathname();
  const normalizedPath = normalizeOnboardingPath(pathname);
  const screenMeta = ONBOARDING_SCREEN_META[normalizedPath] || {
    titleKey: 'onboarding.layout.title',
    subtitleKey: 'onboarding.layout.subtitle',
  };
  const isAuthenticated = useSelector((state) => Boolean(state?.auth?.isAuthenticated));
  const isRehydrated = useSelector((state) => Boolean(state?._persist?.rehydrated));
  const [isRedirecting, setIsRedirecting] = useState(false);

  const authRequired = useMemo(() => AUTH_REQUIRED_PATHS.has(pathname), [pathname]);
  const { isReady: isSessionReady } = useSessionRestore({ enabled: authRequired });
  const canGoBack = typeof router?.canGoBack === 'function' && router.canGoBack();
  const onboardingBackAction = {
    label: t('auth.register.onboarding.actions.back'),
    hint: t('common.backHint'),
    disabledHint: t('onboarding.layout.backUnavailableHint'),
    disabled: !canGoBack,
    onPress: () => router.back(),
    testID: 'onboarding-layout-back',
  };

  useEffect(() => {
    if (!isRehydrated || !isSessionReady || !authRequired || isAuthenticated) {
      setIsRedirecting(false);
      return;
    }

    let active = true;
    setIsRedirecting(true);

    const redirectToLogin = async () => {
      try {
        const [progress, registration] = await Promise.all([
          readOnboardingProgress(),
          readRegistrationContext(),
        ]);
        const identifier = String(progress?.context?.email || registration?.email || '').trim().toLowerCase();
        if (identifier) {
          await saveAuthResumeContext({
            identifier,
            next_path: pathname || '/plan',
            params: {},
          });
        }
      } finally {
        if (!active) return;
        router.replace('/login');
      }
    };

    redirectToLogin();
    return () => {
      active = false;
    };
  }, [authRequired, isAuthenticated, isRehydrated, isSessionReady, pathname, router]);

  if ((authRequired && !isSessionReady) || isRedirecting) {
    return <LoadingSpinner accessibilityLabel={t('common.loading')} testID="onboarding-group-redirecting" />;
  }

  return (
    <AuthLayout
      accessibilityLabel={t('onboarding.layout.title')}
      showScreenHeader
      screenTitle={t(screenMeta.titleKey)}
      screenSubtitle={t(screenMeta.subtitleKey)}
      screenBackAction={onboardingBackAction}
      testID="onboarding-group-layout"
    >
      <Slot />
    </AuthLayout>
  );
}

export default OnboardingGroupLayout;
