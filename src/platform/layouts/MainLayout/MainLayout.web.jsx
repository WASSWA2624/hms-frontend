/**
 * MainLayout Component - Web
 * Main application layout for Web platform
 * File: MainLayout.web.jsx
 */

import React from 'react';
import { useI18n } from '@hooks';
import { useSidebarNavigation } from '@hooks';
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
import SidebarItem from '@platform/components/navigation/SidebarItem';

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
  breadcrumbs,
  accessibilityLabel,
  testID,
  className,
}) => {
  const { t } = useI18n();
  const { sidebarMenu, activeMenuId, navigateToMenu } = useSidebarNavigation();
  const hasSidebar = sidebarMenu && sidebarMenu.length > 0;

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
        {hasSidebar && (
          <StyledSidebar role="complementary" aria-label={t('navigation.sidebar.label')}>
            {sidebarMenu.map((item) => (
              <SidebarItem
                key={item.id}
                icon={item.icon}
                label={t(`navigation.sidebar.${item.id}`)}
                collapsed={false}
                active={activeMenuId === item.id}
                onClick={() => navigateToMenu(item.id)}
              />
            ))}
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

