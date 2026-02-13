import { useEffect } from 'react';
import { Slot, usePathname, useRouter } from 'expo-router';
import { LoadingSpinner } from '@platform/components';
import { useI18n, usePatientAccess } from '@hooks';
import { PatientsScreen } from '@platform/screens';

export default function PatientsLayoutRoute() {
  const { t } = useI18n();
  const pathname = usePathname();
  const router = useRouter();
  const {
    canAccessPatients,
    canManageAllTenants,
    tenantId,
    isResolved,
  } = usePatientAccess();
  const normalizedTenantId = String(tenantId || '').trim();
  const hasScope = canManageAllTenants || Boolean(normalizedTenantId);

  useEffect(() => {
    if (!isResolved) return;
    if (!canAccessPatients || !hasScope) {
      router.replace('/dashboard');
    }
  }, [isResolved, canAccessPatients, hasScope, router]);

  if (!isResolved) {
    return (
      <PatientsScreen>
        <LoadingSpinner accessibilityLabel={t('common.loading')} testID="patients-layout-loading" />
      </PatientsScreen>
    );
  }

  if (!canAccessPatients || !hasScope) {
    return null;
  }

  return (
    <PatientsScreen>
      <Slot key={pathname} />
    </PatientsScreen>
  );
}

