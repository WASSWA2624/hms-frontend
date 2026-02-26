import { useEffect } from 'react';
import { Slot, usePathname, useRouter } from 'expo-router';
import { LoadingSpinner } from '@platform/components';
import { useI18n, useScopeAccess } from '@hooks';
import { SCOPE_KEYS } from '@config/accessPolicy';
import { ClinicalScreen } from '@platform/screens';

export default function IcuLayoutRoute() {
  const { t } = useI18n();
  const pathname = usePathname();
  const router = useRouter();
  const { canRead, canManageAllTenants, tenantId, isResolved } = useScopeAccess(
    SCOPE_KEYS.ICU
  );
  const normalizedTenantId = String(tenantId || '').trim();
  const canAccessIcu = canRead;
  const hasScope = canManageAllTenants || Boolean(normalizedTenantId);

  useEffect(() => {
    if (!isResolved) return;
    if (!canAccessIcu || !hasScope) {
      router.replace('/dashboard');
    }
  }, [isResolved, canAccessIcu, hasScope, router]);

  if (!isResolved) {
    return (
      <ClinicalScreen>
        <LoadingSpinner
          accessibilityLabel={t('common.loading')}
          testID="icu-layout-loading"
        />
      </ClinicalScreen>
    );
  }

  if (!canAccessIcu || !hasScope) {
    return null;
  }

  return (
    <ClinicalScreen>
      <Slot key={pathname} />
    </ClinicalScreen>
  );
}
