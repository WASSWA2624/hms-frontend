import React from 'react';
import { usePathname, useRouter } from 'expo-router';
import { Button, Icon } from '@platform/components';
import { useI18n } from '@hooks';
import {
  StyledContainer,
  StyledContent,
  StyledModuleNavigation,
  StyledModuleNavigationRail,
} from './PatientsScreen.styles';

const MODULE_NAV_ITEMS = Object.freeze([
  {
    key: 'directory',
    path: '/patients',
    labelKey: 'patients.overview.quickPaths.directoryTitle',
    icon: '\u2630',
  },
  {
    key: 'legal',
    path: '/patients/legal',
    labelKey: 'patients.overview.quickPaths.legalTitle',
    icon: '\u2696',
  },
  {
    key: 'overview',
    path: '/patients/overview',
    labelKey: 'patients.overview.title',
    icon: '\u2139',
  },
]);

const resolveActiveModuleNavKey = (pathname) => {
  const normalizedPathname = String(pathname || '').trim().toLowerCase();
  if (normalizedPathname.startsWith('/patients/legal')) return 'legal';
  if (normalizedPathname === '/patients/overview') return 'overview';
  return 'directory';
};

const PatientsScreen = ({ children }) => {
  const { t } = useI18n();
  const router = useRouter();
  const pathname = usePathname();
  const activeNavKey = resolveActiveModuleNavKey(pathname);

  return (
    <StyledContainer testID="patients-screen" accessibilityLabel={t('patients.screen.label')}>
      <StyledModuleNavigation>
        <StyledModuleNavigationRail>
          {MODULE_NAV_ITEMS.map((item) => (
            <Button
              key={item.key}
              variant={activeNavKey === item.key ? 'primary' : 'surface'}
              size="small"
              onPress={() => router.push(item.path)}
              accessibilityRole="tab"
              accessibilityState={{ selected: activeNavKey === item.key }}
              accessibilityLabel={t(item.labelKey)}
              testID={`patients-module-nav-${item.key}`}
              icon={<Icon glyph={item.icon} size="xs" decorative />}
            >
              {t(item.labelKey)}
            </Button>
          ))}
        </StyledModuleNavigationRail>
      </StyledModuleNavigation>
      <StyledContent>{children}</StyledContent>
    </StyledContainer>
  );
};

export default PatientsScreen;
