import { useEffect } from 'react';
import { Slot, usePathname, useRouter } from 'expo-router';
import { LoadingSpinner } from '@platform/components';
import { useI18n, useScopeAccess } from '@hooks';
import { SCOPE_KEYS } from '@config/accessPolicy';
import { ClinicalScreen } from '@platform/screens';

export default function LabLayoutRoute() {
  const { t } = useI18n();
  const pathname = usePathname();
  const router = useRouter();
  const { canRead, canManageAllTenants, tenantId, isResolved } = useScopeAccess(SCOPE_KEYS.LAB);
  const normalizedTenantId = String(tenantId || '').trim();
  const canAccessLab = canRead;
  const hasScope = canManageAllTenants || Boolean(normalizedTenantId);

  useEffect(() => {
    if (!isResolved) return;
    if (!canAccessLab || !hasScope) {
      router.replace('/dashboard');
    }
  }, [isResolved, canAccessLab, hasScope, router]);

  if (!isResolved) {
    return (
      <ClinicalScreen>
        <LoadingSpinner
          accessibilityLabel={t('common.loading')}
          testID="lab-layout-loading"
        />
      </ClinicalScreen>
    );
  }

  if (!canAccessLab || !hasScope) {
    return null;
  }

  return (
    <ClinicalScreen>
      <Slot key={pathname} />
    </ClinicalScreen>
  );
}
