import { useEffect } from 'react';
import { Slot, usePathname, useRouter } from 'expo-router';
import { LoadingSpinner } from '@platform/components';
import { useClinicalAccess, useI18n } from '@hooks';
import { ClinicalScreen } from '@platform/screens';

export default function InventoryLayoutRoute() {
  const { t } = useI18n();
  const pathname = usePathname();
  const router = useRouter();
  const { canAccessClinical, canManageAllTenants, tenantId, isResolved } =
    useClinicalAccess();
  const normalizedTenantId = String(tenantId || '').trim();
  const hasScope = canManageAllTenants || Boolean(normalizedTenantId);

  useEffect(() => {
    if (!isResolved) return;
    if (!canAccessClinical || !hasScope) {
      router.replace('/dashboard');
    }
  }, [isResolved, canAccessClinical, hasScope, router]);

  if (!isResolved) {
    return (
      <ClinicalScreen>
        <LoadingSpinner
          accessibilityLabel={t('common.loading')}
          testID="inventory-layout-loading"
        />
      </ClinicalScreen>
    );
  }

  if (!canAccessClinical || !hasScope) {
    return null;
  }

  return (
    <ClinicalScreen>
      <Slot key={pathname} />
    </ClinicalScreen>
  );
}
