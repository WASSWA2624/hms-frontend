/**
 * AppFrame Component - iOS
 * Base application frame with slots for header, footer, and overlays
 * File: AppFrame.ios.jsx
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
  StyledScreenSlot,
  StyledSidebar,
} from './AppFrame.ios.styles';
import useAppFrame from './useAppFrame';

/**
 * AppFrame component for iOS
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
const AppFrameIOS = ({
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
      <StyledScrollView
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        $footerInset={hasFooter}
      >
        {hasSidebar && <StyledSidebar>{sidebar}</StyledSidebar>}
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
      {notices}
      {hasOverlay && <StyledOverlay>{overlay}</StyledOverlay>}
    </StyledContainer>
  );
};

export default AppFrameIOS;
