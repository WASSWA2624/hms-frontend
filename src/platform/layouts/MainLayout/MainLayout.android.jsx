/**
 * MainLayout Component - Android
 * Main application layout for Android platform
 * File: MainLayout.android.jsx
 */

import React from 'react';
import { useI18n } from '@hooks';
import useMainLayout from './useMainLayout';
import {
  StyledContainer,
  StyledHeader,
  StyledScrollView,
  StyledContent,
  StyledFooter,
  StyledBreadcrumbs,
  StyledScreenSlot,
} from './MainLayout.android.styles';

/**
 * MainLayout component for Android
 * @param {Object} props - MainLayout props
 * @param {React.ReactNode} props.children - Main content
 * @param {React.ReactNode} props.header - Header content
 * @param {React.ReactNode} props.footer - Footer content
 * @param {React.ReactNode} props.breadcrumbs - Breadcrumbs navigation
 * @param {string} props.accessibilityLabel - Accessibility label
 * @param {string} props.testID - Test identifier
 */
const MainLayoutAndroid = ({
  children,
  header,
  footer,
  breadcrumbs,
  accessibilityLabel,
  testID,
}) => {
  const { t } = useI18n();
  const {
    hasHeader,
    hasFooter,
    hasBreadcrumbs,
  } = useMainLayout({ header, footer, breadcrumbs });
  const resolvedAccessibilityLabel = accessibilityLabel || t('navigation.mainNavigation');

  return (
    <StyledContainer
      accessibilityLabel={resolvedAccessibilityLabel}
      testID={testID}
      accessibilityRole="none"
    >
      {hasHeader && (
        <StyledHeader accessibilityRole="header">
          {header}
        </StyledHeader>
      )}
      <StyledScrollView
        keyboardShouldPersistTaps="handled"
        showsHorizontalScrollIndicator={false}
      >
        <StyledContent>
          {hasBreadcrumbs && (
            <StyledBreadcrumbs accessibilityRole="none" accessibilityLabel={t('navigation.breadcrumbs.label')}>
              {breadcrumbs}
            </StyledBreadcrumbs>
          )}
          <StyledScreenSlot>
            {children}
          </StyledScreenSlot>
        </StyledContent>
      </StyledScrollView>
      {hasFooter && (
        <StyledFooter accessibilityRole="none">
          {footer}
        </StyledFooter>
      )}
    </StyledContainer>
  );
};

export default MainLayoutAndroid;

