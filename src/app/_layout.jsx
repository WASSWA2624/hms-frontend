import '@debug/web-console-logger';
import React, { useEffect } from 'react';
import { Provider } from 'react-redux';
import { Slot, usePathname } from 'expo-router';
import { ErrorBoundary } from '@errors';
import { I18nProvider } from '@i18n';
import { bootstrapApp } from '@bootstrap';
import { logger } from '@logging';
import store from '@store';
import { persistLastRoute } from '@navigation/routePersistence';
import {
  StyledSlotContainer,
} from '@platform/layouts/common/RootLayoutStyles';
import ThemeProviderWrapper from '@platform/layouts/common/ThemeProviderWrapper';
import FaviconHead from '@platform/layouts/common/FaviconHead';

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

  return (
    <ErrorBoundary>
      <FaviconHead />
      <Provider store={store}>
        <ThemeProviderWrapper>
          <I18nProvider>
            <StyledSlotContainer>
              <Slot />
            </StyledSlotContainer>
          </I18nProvider>
        </ThemeProviderWrapper>
      </Provider>
    </ErrorBoundary>
  );
};

export default RootLayout;
