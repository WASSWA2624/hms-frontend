/**
 * Auth Group Route Layout
 * Shared layout for auth routes.
 */
import React, { useEffect } from 'react';
import { Slot, useRouter } from 'expo-router';
import { useI18n, useAuth } from '@hooks';
import { AuthLayout } from '@platform/layouts';

function AuthGroupLayout() {
  const { t } = useI18n();
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) return;
    router.replace('/dashboard');
  }, [isAuthenticated, router]);

  return (
    <AuthLayout
      accessibilityLabel={t('auth.register.onboarding.layoutLabel')}
      testID="auth-group-layout"
    >
      <Slot />
    </AuthLayout>
  );
}

export default AuthGroupLayout;


