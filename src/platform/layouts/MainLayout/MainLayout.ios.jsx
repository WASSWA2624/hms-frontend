/**
 * MainLayout Component - iOS
 * Main application layout for iOS platform
 * File: MainLayout.ios.jsx
 */

import React from 'react';
import { useI18n } from '@hooks';
import {
  StyledContainer,
  StyledHeader,
  StyledScrollView,
  StyledContent,
  StyledFooter,
  StyledBreadcrumbs,
} from './MainLayout.ios.styles';

/**
 * MainLayout component for iOS
 * @param {Object} props - MainLayout props
 * @param {React.ReactNode} props.children - Main content
 * @param {React.ReactNode} props.header - Header content
 * @param {React.ReactNode} props.footer - Footer content
 * @param {React.ReactNode} props.breadcrumbs - Breadcrumbs navigation
 * @param {string} props.accessibilityLabel - Accessibility label
 * @param {string} props.testID - Test identifier
 */
const MainLayoutIOS = ({
  children,
  header,
  footer,
  breadcrumbs,
  accessibilityLabel,
  testID,
}) => {
  const { t } = useI18n();

  return (
    <StyledContainer
      accessibilityLabel={accessibilityLabel}
      testID={testID}
      accessibilityRole="none"
    >
      {header && (
        <StyledHeader accessibilityRole="header">
          {header}
        </StyledHeader>
      )}
      {breadcrumbs && (
        <StyledBreadcrumbs accessibilityRole="none" accessibilityLabel={t('navigation.breadcrumbs.label')}>
          {breadcrumbs}
        </StyledBreadcrumbs>
      )}
      <StyledScrollView
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <StyledContent>
          {children}
        </StyledContent>
      </StyledScrollView>
      {footer && (
        <StyledFooter accessibilityRole="none">
          {footer}
        </StyledFooter>
      )}
    </StyledContainer>
  );
};

export default MainLayoutIOS;

