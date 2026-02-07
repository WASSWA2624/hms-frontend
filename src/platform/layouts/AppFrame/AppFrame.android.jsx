/**
 * AppFrame Component - Android
 * Base application frame with slots for header, footer, and overlays
 * File: AppFrame.android.jsx
 */

import React from 'react';
import { useI18n } from '@hooks';
import {
  StyledBanner,
  StyledBreadcrumbs,
  StyledContainer,
  StyledContent,
  StyledFooter,
  StyledHeader,
  StyledOverlay,
  StyledScrollView,
  StyledSidebar,
} from './AppFrame.android.styles';
import useAppFrame from './useAppFrame';

/**
 * AppFrame component for Android
 * @param {Object} props - AppFrame props
 * @param {React.ReactNode} props.children - Main content
 * @param {React.ReactNode} props.header - Header slot
 * @param {React.ReactNode} props.footer - Footer slot
 * @param {React.ReactNode} props.sidebar - Sidebar slot
 * @param {React.ReactNode} props.breadcrumbs - Breadcrumbs slot
 * @param {React.ReactNode} props.overlay - Overlay slot
 * @param {React.ReactNode} props.banner - Banner slot
 * @param {React.ReactNode} props.notices - Notices slot
 * @param {string} props.accessibilityLabel - Accessibility label
 * @param {string} props.testID - Test identifier
 */
const AppFrameAndroid = ({
  children,
  header,
  footer,
  sidebar,
  breadcrumbs,
  overlay,
  banner,
  notices,
  accessibilityLabel,
  testID,
}) => {
  const { t } = useI18n();
  const { hasBanner, hasBreadcrumbs, hasFooter, hasHeader, hasOverlay, hasSidebar } = useAppFrame({
    header,
    footer,
    sidebar,
    breadcrumbs,
    overlay,
    banner,
  });

  return (
    <StyledContainer accessibilityRole="none" accessibilityLabel={accessibilityLabel} testID={testID}>
      {hasHeader && (
        <StyledHeader accessibilityRole="header">
          {header}
        </StyledHeader>
      )}
      {hasBanner && (
        <StyledBanner accessibilityRole="none">
          {banner}
        </StyledBanner>
      )}
      {hasBreadcrumbs && (
        <StyledBreadcrumbs accessibilityRole="none" accessibilityLabel={t('navigation.breadcrumbs.label')}>
          {breadcrumbs}
        </StyledBreadcrumbs>
      )}
      <StyledScrollView
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          flexGrow: 1,
          flexDirection: 'column',
          paddingBottom: hasFooter ? 96 : 0,
        }}
      >
        {hasSidebar && <StyledSidebar>{sidebar}</StyledSidebar>}
        <StyledContent>{children}</StyledContent>
      </StyledScrollView>
      {hasFooter && (
        <StyledFooter accessibilityRole="none">
          {footer}
        </StyledFooter>
      )}
      {notices}
      {hasOverlay && <StyledOverlay>{overlay}</StyledOverlay>}
    </StyledContainer>
  );
};

export default AppFrameAndroid;
