/**
 * Public Group Route Layout
 * Shared layout for public onboarding/auth entry routes.
 */
import React from 'react';
import { Slot } from 'expo-router';
import { useI18n } from '@hooks';
import { AuthLayout } from '@platform/layouts';

function PublicGroupLayout() {
  const { t } = useI18n();

  return (
    <AuthLayout
      accessibilityLabel={t('landing.title')}
      screenTitle={t('landing.title')}
      screenSubtitle={t('landing.description')}
      testID="public-group-layout"
    >
      <Slot />
    </AuthLayout>
  );
}

export default PublicGroupLayout;
