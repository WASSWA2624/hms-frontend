import { useEffect } from 'react';
import { Slot, usePathname, useRouter } from 'expo-router';
import { LoadingSpinner } from '@platform/components';
import { useI18n, useScopeAccess } from '@hooks';
import { SCOPE_KEYS } from '@config/accessPolicy';
import { ClinicalScreen } from '@platform/screens';

export default function RadiologyLayoutRoute() {
  const { t } = useI18n();
  const pathname = usePathname();
  const router = useRouter();
  const { canRead, canManageAllTenants, tenantId, isResolved } = useScopeAccess(
    SCOPE_KEYS.RADIOLOGY
  );
  const hasScope = canManageAllTenants || Boolean(String(tenantId || '').trim());

  useEffect(() => {
    if (!isResolved) return;
    if (!canRead || !hasScope) {
      router.replace('/dashboard');
    }
  }, [canRead, hasScope, isResolved, router]);

  if (!isResolved) {
    return (
      <ClinicalScreen>
        <LoadingSpinner
          accessibilityLabel={t('common.loading')}
          testID="radiology-layout-loading"
        />
      </ClinicalScreen>
    );
  }

  if (!canRead || !hasScope) return null;

  return (
    <ClinicalScreen>
      <Slot key={pathname} />
    </ClinicalScreen>
  );
}

