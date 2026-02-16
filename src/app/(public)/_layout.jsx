/**
 * Public Group Route Layout
 * Shared layout for public onboarding/auth entry routes.
 */
import React from 'react';
import { Slot, usePathname, useRouter } from 'expo-router';
import { useI18n } from '@hooks';
import { AuthLayout } from '@platform/layouts';

const PUBLIC_SCREEN_META = {
  '/landing': {
    titleKey: 'landing.title',
    subtitleKey: 'landing.badge',
    showBackAction: true,
    backDisabledHintKey: 'landing.backUnavailableHint',
  },
  '/terms': {
    titleKey: 'terms.title',
    subtitleKey: 'terms.subtitle',
    showBackAction: true,
    backDisabledHintKey: 'terms.backUnavailableHint',
  },
};

const normalizePublicPath = (pathname) => {
  if (!pathname) return '/';
  const withoutQuery = String(pathname).split('?')[0].split('#')[0];
  const withoutGroup = withoutQuery.replace('/(public)', '');
  const normalized = withoutGroup.replace(/\/+$/, '');
  return normalized || '/';
};

function PublicGroupLayout() {
  const { t } = useI18n();
  const pathname = usePathname();
  const router = useRouter();
  const normalizedPath = normalizePublicPath(pathname);
  const screenMeta = PUBLIC_SCREEN_META[normalizedPath] || {
    titleKey: 'landing.title',
    subtitleKey: 'landing.description',
    showBackAction: true,
    backDisabledHintKey: 'landing.backUnavailableHint',
  };
  const canGoBack = typeof router?.canGoBack === 'function' && router.canGoBack();
  const publicBackAction = {
    label: t('common.back'),
    hint: t('common.backHint'),
    disabledHint: t(screenMeta.backDisabledHintKey),
    disabled: !canGoBack,
    onPress: () => {
      if (typeof router?.back !== 'function') return;
      router.back();
    },
    testID: 'public-layout-back',
  };

  return (
    <AuthLayout
      accessibilityLabel={t(screenMeta.titleKey)}
      showScreenHeader
      screenTitle={t(screenMeta.titleKey)}
      screenSubtitle={t(screenMeta.subtitleKey)}
      screenBackAction={screenMeta.showBackAction ? publicBackAction : undefined}
      testID="public-group-layout"
    >
      <Slot />
    </AuthLayout>
  );
}

export default PublicGroupLayout;
