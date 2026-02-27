import { useEffect } from 'react';
import { Slot, usePathname, useRouter } from 'expo-router';
import { LoadingSpinner } from '@platform/components';
import { useI18n, useScopeAccess } from '@hooks';
import { SCOPE_KEYS } from '@config/accessPolicy';
import { ClinicalScreen } from '@platform/screens';

export default function LayoutRoute() {
  const { t } = useI18n();
  const pathname = usePathname();
  const router = useRouter();
  const pharmacyScope = useScopeAccess(SCOPE_KEYS.PHARMACY);
  const inventoryScope = useScopeAccess(SCOPE_KEYS.INVENTORY);
  const isResolved = pharmacyScope.isResolved && inventoryScope.isResolved;
  const hasPharmacyScope =
    pharmacyScope.canManageAllTenants || Boolean(String(pharmacyScope.tenantId || '').trim());
  const hasInventoryScope =
    inventoryScope.canManageAllTenants || Boolean(String(inventoryScope.tenantId || '').trim());
  const canReadWorkspace =
    (pharmacyScope.canRead && hasPharmacyScope) ||
    (inventoryScope.canRead && hasInventoryScope);

  useEffect(() => {
    if (!isResolved) return;
    if (!canReadWorkspace) {
      router.replace('/dashboard');
    }
  }, [canReadWorkspace, isResolved, router]);

  if (!isResolved) {
    return (
      <ClinicalScreen>
        <LoadingSpinner
          accessibilityLabel={t('common.loading')}
          testID="pharmacy-layout-loading"
        />
      </ClinicalScreen>
    );
  }

  if (!canReadWorkspace) {
    return null;
  }

  return (
    <ClinicalScreen>
      <Slot key={pathname} />
    </ClinicalScreen>
  );
}
