import '@debug/web-console-logger';
import React, { useEffect } from 'react';
import { Provider } from 'react-redux';
import { Slot, usePathname } from 'expo-router';
import { ErrorBoundary } from '@errors';
import { I18nProvider } from '@i18n';
import { tSync } from '@i18n';
import { bootstrapApp } from '@bootstrap';
import { logger } from '@logging';
import store from '@store';
import { persistLastRoute } from '@navigation/routePersistence';
import {
  StyledSlotContainer,
} from '@platform/layouts/common/RootLayoutStyles';
import ThemeProviderWrapper from '@platform/layouts/common/ThemeProviderWrapper';
import FaviconHead from '@platform/layouts/common/FaviconHead';

const translateSync = (key, fallback) => {
  if (typeof tSync !== 'function') return fallback;
  const value = tSync(key);
  if (typeof value !== 'string' || !value.trim() || value === key) return fallback;
  return value;
};

const APP_NAME = translateSync('app.name', 'HMS');
const ROOT_PAGE_NAME = translateSync('home.title', 'Home');

const toTitleCase = (value) =>
  value
    .split(' ')
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

const resolvePageName = (pathname) => {
  if (!pathname || pathname === '/') return ROOT_PAGE_NAME;

  const segments = pathname.split('/').filter(Boolean);
  const pageSegment = segments[segments.length - 1] || '';
  if (!pageSegment) return ROOT_PAGE_NAME;

  if (pageSegment === 'landing') return translateSync('landing.pageTitle', 'Landing');
  if (pageSegment === 'settings') return translateSync('navigation.header.settings', 'Settings');

  return toTitleCase(pageSegment.replace(/[-_]+/g, ' '));
};

const resolveDocumentTitle = (pathname) => {
  const pageName = resolvePageName(pathname);
  return `${pageName} | ${APP_NAME}`;
};

/**
 * Root Layout Component
 *
 * Renders app immediately; bootstrap and persist run in background.
 * Per bootstrap-config.mdc: Bootstrap errors are non-blocking (logged).
 * Per state-management.mdc: Redux persist rehydrates async; UI shows defaults until then.
 */
const RootLayout = () => {
  const pathname = usePathname();

  useEffect(() => {
    bootstrapApp().catch((error) => {
      logger.error('Bootstrap failed (non-blocking)', { error: error?.message });
    });
  }, []);

  useEffect(() => {
    persistLastRoute(pathname);
  }, [pathname]);

  useEffect(() => {
    if (typeof document === 'undefined') return;
    document.title = resolveDocumentTitle(pathname);
  }, [pathname]);

  return (
    <>
      <FaviconHead />
      <Provider store={store}>
        <ThemeProviderWrapper>
          <I18nProvider>
            <ErrorBoundary>
            <StyledSlotContainer>
              <Slot />
            </StyledSlotContainer>
            </ErrorBoundary>
          </I18nProvider>
        </ThemeProviderWrapper>
      </Provider>
    </>
  );
};

export default RootLayout;
