/**
 * MainLayout Component - Web
 * Main application layout for Web platform
 * File: MainLayout.web.jsx
 */

import React from 'react';
import { useI18n } from '@hooks';
import useMainLayout from './useMainLayout';
import {
  StyledContainer,
  StyledHeader,
  StyledBody,
  StyledSidebar,
  StyledContent,
  StyledFooter,
  StyledBreadcrumbs,
  StyledSkipLink,
} from './MainLayout.web.styles';

/**
 * MainLayout component for Web.
 * Slot-based: use platform components (GlobalHeader, Sidebar, Breadcrumbs, GlobalFooter) at call site.
 * @param {Object} props - MainLayout props
 * @param {React.ReactNode} props.children - Main content
 * @param {React.ReactNode} props.header - Header slot (e.g. <GlobalHeader />)
 * @param {React.ReactNode} props.footer - Footer slot (e.g. <GlobalFooter />)
 * @param {React.ReactNode} props.sidebar - Sidebar slot (e.g. <Sidebar /> from @platform/components)
 * @param {React.ReactNode} props.breadcrumbs - Breadcrumbs slot
 * @param {string} props.accessibilityLabel - Accessibility label
 * @param {string} props.testID - Test identifier
 * @param {string} props.className - Additional CSS class
 */
const MainLayoutWeb = ({
  children,
  header,
  footer,
  sidebar,
  breadcrumbs,
  accessibilityLabel,
  testID,
  className,
}) => {
  const { t } = useI18n();
  const { hasSidebar } = useMainLayout({ header, footer, sidebar, breadcrumbs });

  return (
    <StyledContainer
      className={className}
      data-testid={testID}
      role="main"
      aria-label={accessibilityLabel}
    >
      <StyledSkipLink href="#main-content">
        {t('navigation.skipToMainContent')}
      </StyledSkipLink>
      {header && (
        <StyledHeader role="banner">
          {header}
        </StyledHeader>
      )}
      <StyledBody>
        {hasSidebar && (
          <StyledSidebar role="complementary" aria-label={t('navigation.sidebar.label')}>
            {sidebar}
          </StyledSidebar>
        )}
        <StyledContent id="main-content" hasSidebar={hasSidebar}>
          {breadcrumbs && (
            <StyledBreadcrumbs aria-label={t('navigation.breadcrumbs.label')}>
              {breadcrumbs}
            </StyledBreadcrumbs>
          )}
          {children}
        </StyledContent>
      </StyledBody>
      {footer && (
        <StyledFooter role="contentinfo">
          {footer}
        </StyledFooter>
      )}
    </StyledContainer>
  );
};

export default MainLayoutWeb;

