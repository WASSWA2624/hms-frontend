/**
 * MainLayout Component - Web
 * Main application layout for Web platform
 * File: MainLayout.web.jsx
 */

import React from 'react';
import { useI18n } from '@hooks';
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
 * MainLayout component for Web
 * @param {Object} props - MainLayout props
 * @param {React.ReactNode} props.children - Main content
 * @param {React.ReactNode} props.header - Header content
 * @param {React.ReactNode} props.footer - Footer content
 * @param {React.ReactNode} props.sidebar - Sidebar navigation (desktop only)
 * @param {React.ReactNode} props.breadcrumbs - Breadcrumbs navigation
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
  const hasSidebar = !!sidebar;

  return (
    <StyledContainer
      className={className}
      testID={testID}
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
      {breadcrumbs && (
        <StyledBreadcrumbs aria-label={t('navigation.breadcrumbs.label')}>
          {breadcrumbs}
        </StyledBreadcrumbs>
      )}
      <StyledBody>
        {sidebar && (
          <StyledSidebar role="complementary" aria-label={t('navigation.sidebar.label')}>
            {sidebar}
          </StyledSidebar>
        )}
        <StyledContent id="main-content" hasSidebar={hasSidebar}>
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

