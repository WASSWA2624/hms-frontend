/**
 * Auth Group Route Layout
 * Shared layout for auth routes.
 */
import React, { useEffect } from 'react';
import { Slot, usePathname, useRouter } from 'expo-router';
import { resolveHomePath } from '@config/accessPolicy';
import { useAuth, useI18n, useSessionRestore } from '@hooks';
import { useAuthGuard } from '@navigation/guards';
import { AuthLayout } from '@platform/layouts';
import GlobalFooter, { FOOTER_VARIANTS } from '@platform/components/navigation/GlobalFooter';

const AUTH_SCREEN_META = {
  '/welcome': {
    titleKey: 'auth.welcome.title',
    subtitleKey: 'auth.welcome.description',
  },
  '/login': {
    titleKey: 'auth.login.title',
    subtitleKey: 'auth.login.description',
  },
  '/register': {
    titleKey: 'onboarding.layout.title',
    subtitleKey: 'auth.register.onboarding.subtitle',
  },
  '/resume-link-sent': {
    titleKey: 'onboarding.resumeLinkSent.title',
    subtitleKey: 'onboarding.resumeLinkSent.description',
  },
  '/forgot-password': {
    titleKey: 'auth.forgotPassword.title',
    subtitleKey: 'auth.forgotPassword.description',
  },
  '/reset-password': {
    titleKey: 'auth.resetPassword.title',
    subtitleKey: 'auth.resetPassword.description',
  },
  '/verify-email': {
    titleKey: 'auth.verifyEmail.title',
    subtitleKey: 'auth.verifyEmail.description',
  },
  '/verify-phone': {
    titleKey: 'auth.verifyPhone.title',
    subtitleKey: 'auth.verifyPhone.description',
  },
  '/tenant-selection': {
    titleKey: 'auth.tenantSelection.title',
    subtitleKey: 'auth.tenantSelection.description',
  },
  '/facility-selection': {
    titleKey: 'auth.facilitySelection.title',
    subtitleKey: 'auth.facilitySelection.description',
  },
};

const normalizeAuthPath = (pathname) => {
  if (!pathname) return '/';
  const withoutQuery = String(pathname).split('?')[0].split('#')[0];
  const withoutGroup = withoutQuery.replace('/(auth)', '');
  const normalized = withoutGroup.replace(/\/+$/, '');
  return normalized || '/';
};

const resolveScreenMeta = (normalizedPath) => {
  if (AUTH_SCREEN_META[normalizedPath]) return AUTH_SCREEN_META[normalizedPath];
  const segments = String(normalizedPath || '/').split('/').filter(Boolean);
  const topLevelPath = segments.length ? `/${segments[0]}` : '/';
  return AUTH_SCREEN_META[topLevelPath] || {
    titleKey: 'auth.layout.title',
    subtitleKey: 'auth.layout.subtitle',
  };
};

function AuthGroupLayout() {
  const { t } = useI18n();
  const { isReady: isSessionReady } = useSessionRestore();
  const { roles } = useAuth();
  const { authenticated } = useAuthGuard({ skipRedirect: true });
  const pathname = usePathname();
  const router = useRouter();
  const homePath = resolveHomePath(roles);
  const normalizedPath = normalizeAuthPath(pathname);
  const isRegisterRoute = normalizedPath === '/register';
  const screenMeta = resolveScreenMeta(normalizedPath);
  const canGoBack = typeof router?.canGoBack === 'function' && router.canGoBack();
  const authBackAction = {
    label: isRegisterRoute ? t('auth.register.onboarding.actions.back') : t('common.back'),
    hint: t('common.backHint'),
    disabledHint: t('auth.layout.backUnavailableHint'),
    disabled: !canGoBack,
    onPress: () => {
      if (typeof router?.back !== 'function') return;
      router.back();
    },
    testID: 'auth-layout-back',
  };

  useEffect(() => {
    if (!isSessionReady) return;
    if (!authenticated) return;
    router.replace(homePath);
  }, [authenticated, homePath, isSessionReady, router]);

  return (
    <AuthLayout
      accessibilityLabel={t('auth.layout.title')}
      showScreenHeader
      screenTitle={t(screenMeta.titleKey)}
      screenSubtitle={t(screenMeta.subtitleKey)}
      screenBackAction={authBackAction}
      testID="auth-group-layout"
      footer={(
        <GlobalFooter
          variant={FOOTER_VARIANTS.AUTH}
          accessibilityLabel={t('navigation.footer.title')}
          testID="auth-footer"
        />
      )}
    >
      <Slot />
    </AuthLayout>
  );
}

export default AuthGroupLayout;


