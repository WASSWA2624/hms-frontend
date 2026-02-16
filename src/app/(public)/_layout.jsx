/**
 * Public Group Route Layout
 * Shared layout for public onboarding/auth entry routes.
 */
import React from 'react';
import { Slot, usePathname, useRouter } from 'expo-router';
import { useI18n } from '@hooks';
import { AuthLayout } from '@platform/layouts';

function PublicGroupLayout() {
  const { t } = useI18n();
  const pathname = usePathname();
  const router = useRouter();
  const isLandingRoute = pathname === '/landing' || pathname === '/(public)/landing';
  const canGoBack = typeof router?.canGoBack === 'function' && router.canGoBack();
  const publicBackAction = {
    label: t('common.back'),
    hint: t('common.backHint'),
    disabledHint: t('landing.backUnavailableHint'),
    disabled: !canGoBack,
    onPress: () => {
      if (typeof router?.back !== 'function') return;
      router.back();
    },
    testID: 'public-layout-back',
  };

  return (
    <AuthLayout
      accessibilityLabel={t('landing.title')}
      showScreenHeader
      screenTitle={t('landing.title')}
      screenSubtitle={isLandingRoute ? t('landing.badge') : t('landing.description')}
      screenBackAction={isLandingRoute ? undefined : publicBackAction}
      testID="public-group-layout"
    >
      <Slot />
    </AuthLayout>
  );
}

export default PublicGroupLayout;
