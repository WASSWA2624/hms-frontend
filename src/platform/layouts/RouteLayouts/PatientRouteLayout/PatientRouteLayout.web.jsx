/**
 * PatientRouteLayout Component - Web
 * Reusable route layout for patient-facing routes on Web
 * File: PatientRouteLayout.web.jsx
 */
import React, { useEffect, useMemo } from 'react';
import { Slot } from 'expo-router';
import { useI18n, useShellBanners } from '@hooks';
import PatientFrame from '../../PatientFrame';
import {
  GlobalHeader,
  LanguageControls,
  NoticeSurface,
  ShellBanners,
  Sidebar,
  ThemeControls,
} from '@platform/components';
import GlobalFooter, { FOOTER_VARIANTS } from '@platform/components/navigation/GlobalFooter';
import usePatientRouteLayout from './usePatientRouteLayout';
import useBreadcrumbs from '@platform/layouts/common/useBreadcrumbs';

/**
 * PatientRouteLayout component for Web
 */
const PatientRouteLayoutWeb = () => {
  const { t } = useI18n();
  const { headerActions, overlaySlot, patientItems, isItemVisible } = usePatientRouteLayout();
  const breadcrumbItems = useBreadcrumbs(patientItems, 'navigation.items.patient');
  const pageTitle = useMemo(() => {
    const current = breadcrumbItems[breadcrumbItems.length - 1]?.label;
    const appName = t('app.name');
    if (!current) return appName;
    return `${current} | ${appName}`;
  }, [breadcrumbItems, t]);

  useEffect(() => {
    if (typeof document === 'undefined') return;
    document.title = pageTitle;
  }, [pageTitle]);
  const banners = useShellBanners();
  const bannerSlot = banners.length ? (
    <ShellBanners banners={banners} testID="patient-shell-banners" />
  ) : null;
  const headerUtilitySlot = (
    <>
      <LanguageControls
        testID="patient-language-controls"
        accessibilityLabel={t('settings.language.accessibilityLabel')}
        accessibilityHint={t('settings.language.hint')}
      />
      <ThemeControls
        testID="patient-theme-controls"
        accessibilityLabel={t('settings.theme.accessibilityLabel')}
        accessibilityHint={t('settings.theme.hint')}
      />
    </>
  );

  return (
    <PatientFrame
      header={(
        <GlobalHeader
          title={t('navigation.patientNavigation')}
          accessibilityLabel={t('navigation.header.title')}
          testID="patient-header"
          actions={headerActions}
          utilitySlot={headerUtilitySlot}
        />
      )}
      sidebar={(
        <Sidebar
          accessibilityLabel={t('navigation.sidebar.title')}
          items={patientItems}
          itemsI18nPrefix="navigation.items.patient"
          isItemVisible={isItemVisible}
          testID="patient-sidebar"
        />
      )}
      footer={(
        <GlobalFooter
          variant={FOOTER_VARIANTS.PATIENT}
          accessibilityLabel={t('navigation.footer.title')}
          testID="patient-footer"
        />
      )}
      banner={bannerSlot}
      overlay={overlaySlot}
      notices={<NoticeSurface testID="patient-notice-surface" />}
      accessibilityLabel={t('navigation.patientNavigation')}
      testID="patient-route-layout"
    >
      <Slot />
    </PatientFrame>
  );
};

export default PatientRouteLayoutWeb;
