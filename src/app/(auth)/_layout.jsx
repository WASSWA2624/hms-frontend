/**
 * Auth Group Route Layout
 * Shared layout for auth routes.
 */
import React, { useEffect } from 'react';
import { Slot, useRouter } from 'expo-router';
import { useI18n, useSessionRestore } from '@hooks';
import { useAuthGuard } from '@navigation/guards';
import { AuthLayout } from '@platform/layouts';
import GlobalFooter, { FOOTER_VARIANTS } from '@platform/components/navigation/GlobalFooter';

function AuthGroupLayout() {
  const { t } = useI18n();
  const { isReady: isSessionReady } = useSessionRestore();
  const { authenticated } = useAuthGuard({ skipRedirect: true });
  const router = useRouter();

  useEffect(() => {
    if (!isSessionReady) return;
    if (!authenticated) return;
    router.replace('/dashboard');
  }, [authenticated, isSessionReady, router]);

  return (
    <AuthLayout
      accessibilityLabel={t('auth.layout.title')}
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


