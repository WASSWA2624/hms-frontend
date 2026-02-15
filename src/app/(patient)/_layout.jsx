/**
 * Patient Group Route Layout
 *
 * Route layout for patient-facing routes.
 * Per app-router.mdc: layouts use `_layout.jsx` and default exports.
 * Per component-structure.mdc: layout logic belongs in platform/layouts/.
 */
import { useMemo } from 'react';
import { useRoleGuard } from '@navigation/guards';
import { PATIENT_MENU_ITEMS } from '@config/sideMenu';
import { PatientRouteLayout } from '@platform/layouts';

export default function PatientGroupLayout() {
  const requiredRoles = useMemo(
    () =>
      [...new Set(
        PATIENT_MENU_ITEMS.flatMap((item) =>
          Array.isArray(item.roles) ? item.roles : []
        )
      )],
    []
  );

  useRoleGuard({
    requiredRoles,
    redirectPath: '/dashboard',
  });

  return <PatientRouteLayout />;
}
