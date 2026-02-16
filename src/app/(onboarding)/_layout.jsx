/**
 * Onboarding Group Route Layout
 * Shared layout for onboarding routes.
 */
import React, { useEffect, useMemo, useState } from 'react';
import { Slot, usePathname, useRouter } from 'expo-router';
import { useSelector } from 'react-redux';
import { useI18n } from '@hooks';
import { LoadingSpinner } from '@platform/components';
import { AuthLayout } from '@platform/layouts';
import { readOnboardingProgress, readRegistrationContext, saveAuthResumeContext } from '@navigation';

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

function OnboardingGroupLayout() {
  const { t } = useI18n();
  const router = useRouter();
  const pathname = usePathname();
  const isAuthenticated = useSelector((state) => Boolean(state?.auth?.isAuthenticated));
  const isRehydrated = useSelector((state) => Boolean(state?._persist?.rehydrated));
  const [isRedirecting, setIsRedirecting] = useState(false);

  const authRequired = useMemo(() => AUTH_REQUIRED_PATHS.has(pathname), [pathname]);

  useEffect(() => {
    if (!isRehydrated || !authRequired || isAuthenticated) {
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
  }, [authRequired, isAuthenticated, isRehydrated, pathname, router]);

  if (isRedirecting) {
    return <LoadingSpinner accessibilityLabel={t('common.loading')} testID="onboarding-group-redirecting" />;
  }

  return (
    <AuthLayout
      accessibilityLabel={t('onboarding.layout.title')}
      screenTitle={t('onboarding.layout.title')}
      screenSubtitle={t('onboarding.layout.subtitle')}
      testID="onboarding-group-layout"
    >
      <Slot />
    </AuthLayout>
  );
}

export default OnboardingGroupLayout;
