import { useEffect, useMemo } from 'react';
import { Slot, usePathname, useRouter } from 'expo-router';
import { LoadingSpinner } from '@platform/components';
import { useI18n, useScopeAccess } from '@hooks';
import { ClinicalScreen } from '@platform/screens';

const resolveDiagnosticsScope = (pathname) =>
  String(pathname || '').startsWith('/diagnostics/radiology') ? 'radiology' : 'lab';

export default function DiagnosticsLayoutRoute() {
  const { t } = useI18n();
  const pathname = usePathname();
  const router = useRouter();
  const resolvedScope = useMemo(() => resolveDiagnosticsScope(pathname), [pathname]);
  const { canRead, canManageAllTenants, tenantId, isResolved } = useScopeAccess(resolvedScope);
  const normalizedTenantId = String(tenantId || '').trim();
  const hasScope = canManageAllTenants || Boolean(normalizedTenantId);

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
          testID="diagnostics-layout-loading"
        />
      </ClinicalScreen>
    );
  }

  if (!canRead || !hasScope) {
    return null;
  }

  return (
    <ClinicalScreen>
      <Slot key={pathname} />
    </ClinicalScreen>
  );
}