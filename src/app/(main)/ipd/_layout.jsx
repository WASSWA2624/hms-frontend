import { useEffect } from 'react';
import { Slot, usePathname, useRouter } from 'expo-router';
import { LoadingSpinner } from '@platform/components';
import { useI18n, useScopeAccess } from '@hooks';
import { SCOPE_KEYS } from '@config/accessPolicy';
import { ClinicalScreen } from '@platform/screens';

export default function IpdLayoutRoute() {
  const { t } = useI18n();
  const pathname = usePathname();
  const router = useRouter();
  const { canRead, canManageAllTenants, tenantId, isResolved } = useScopeAccess(SCOPE_KEYS.IPD);
  const normalizedTenantId = String(tenantId || '').trim();
  const canAccessIpd = canRead;
  const hasScope = canManageAllTenants || Boolean(normalizedTenantId);

  useEffect(() => {
    if (!isResolved) return;
    if (!canAccessIpd || !hasScope) {
      router.replace('/dashboard');
    }
  }, [isResolved, canAccessIpd, hasScope, router]);

  if (!isResolved) {
    return (
      <ClinicalScreen>
        <LoadingSpinner
          accessibilityLabel={t('common.loading')}
          testID="ipd-layout-loading"
        />
      </ClinicalScreen>
    );
  }

  if (!canAccessIpd || !hasScope) {
    return null;
  }

  return (
    <ClinicalScreen>
      <Slot key={pathname} />
    </ClinicalScreen>
  );
}
