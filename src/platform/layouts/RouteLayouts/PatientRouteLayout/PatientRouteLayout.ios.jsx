/**
 * PatientRouteLayout Component - iOS
 * Reusable route layout for patient-facing routes on iOS
 * File: PatientRouteLayout.ios.jsx
 */
import React, { useMemo } from 'react';
import { Slot } from 'expo-router';
import { useI18n, useShellBanners } from '@hooks';
import { getMenuIconGlyph } from '@config/sideMenu';
import PatientFrame from '../../PatientFrame';
import {
  GlobalHeader,
  LanguageControls,
  NoticeSurface,
  ShellBanners,
  TabBar,
  ThemeControls,
} from '@platform/components';
import GlobalFooter, { FOOTER_VARIANTS } from '@platform/components/navigation/GlobalFooter';
import usePatientRouteLayout from './usePatientRouteLayout';

/**
 * PatientRouteLayout component for iOS
 */
const PatientRouteLayoutIOS = () => {
  const { t } = useI18n();
  const { headerActions, overlaySlot, patientItems, isItemVisible } = usePatientRouteLayout();
  const tabBarItems = useMemo(
    () =>
      patientItems.map((it) => ({
        ...it,
        href: it.path,
        label: t(`navigation.items.patient.${it.id}`),
        icon: getMenuIconGlyph(it.icon),
      })),
    [patientItems, t]
  );
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
      banner={bannerSlot}
      footer={(
        <GlobalFooter
          variant={FOOTER_VARIANTS.PATIENT}
          accessibilityLabel={t('navigation.footer.title')}
          testID="patient-footer"
          quickActionsSlot={(
            <TabBar
              accessibilityLabel={t('navigation.tabBar.title')}
              items={tabBarItems}
              isTabVisible={isItemVisible}
              testID="patient-tabbar"
            />
          )}
        />
      )}
      overlay={overlaySlot}
      notices={<NoticeSurface testID="patient-notice-surface" />}
      accessibilityLabel={t('navigation.patientNavigation')}
      testID="patient-route-layout"
    >
      <Slot />
    </PatientFrame>
  );
};

export default PatientRouteLayoutIOS;
