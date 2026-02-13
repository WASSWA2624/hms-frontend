import { useEffect } from 'react';
import { Slot, usePathname, useRouter } from 'expo-router';
import { LoadingSpinner } from '@platform/components';
import { useI18n, useSchedulingAccess } from '@hooks';
import { SchedulingScreen } from '@platform/screens';

export default function SchedulingLayoutRoute() {
  const { t } = useI18n();
  const pathname = usePathname();
  const router = useRouter();
  const {
    canAccessScheduling,
    canManageAllTenants,
    tenantId,
    isResolved,
  } = useSchedulingAccess();
  const normalizedTenantId = String(tenantId || '').trim();
  const hasScope = canManageAllTenants || Boolean(normalizedTenantId);

  useEffect(() => {
    if (!isResolved) return;
    if (!canAccessScheduling || !hasScope) {
      router.replace('/dashboard');
    }
  }, [isResolved, canAccessScheduling, hasScope, router]);

  if (!isResolved) {
    return (
      <SchedulingScreen>
        <LoadingSpinner accessibilityLabel={t('common.loading')} testID="scheduling-layout-loading" />
      </SchedulingScreen>
    );
  }

  if (!canAccessScheduling || !hasScope) {
    return null;
  }

  return (
    <SchedulingScreen>
      <Slot key={pathname} />
    </SchedulingScreen>
  );
}

