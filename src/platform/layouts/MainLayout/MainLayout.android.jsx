/**
 * MainLayout Component - Android
 * Main application layout for Android platform
 * File: MainLayout.android.jsx
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
      <StyledScrollView
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <StyledContent>
          {breadcrumbs && (
            <StyledBreadcrumbs accessibilityRole="none" accessibilityLabel={t('navigation.breadcrumbs.label')}>
              {breadcrumbs}
            </StyledBreadcrumbs>
          )}
          <StyledScreenSlot>
            {children}
          </StyledScreenSlot>
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

export default MainLayoutAndroid;

