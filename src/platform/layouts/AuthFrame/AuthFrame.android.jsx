/**
 * AuthFrame Component - Android
 * Authentication frame with slots for header, footer, and overlays
 * File: AuthFrame.android.jsx
 */

import React from 'react';
import {
  StyledBanner,
  StyledCard,
  StyledContainer,
  StyledContent,
  StyledFooter,
  StyledHeader,
  StyledNotices,
  StyledOverlay,
  StyledScrollView,
} from './AuthFrame.android.styles';

/**
 * AuthFrame component for Android
 * @param {Object} props - AuthFrame props
 * @param {React.ReactNode} props.children - Main content
 * @param {React.ReactNode} props.header - Header slot
 * @param {React.ReactNode} props.footer - Footer slot
 * @param {React.ReactNode} props.overlay - Overlay slot
 * @param {React.ReactNode} props.banner - Banner slot
 * @param {React.ReactNode} props.notices - Notices slot
 * @param {string} props.accessibilityLabel - Accessibility label
 * @param {string} props.testID - Test identifier
 */
const AuthFrameAndroid = ({
  children,
  header,
  footer,
  overlay,
  banner,
  notices,
  accessibilityLabel,
  testID,
}) => {
  return (
    <StyledContainer accessibilityRole="none" accessibilityLabel={accessibilityLabel} testID={testID}>
      <StyledScrollView keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
        <StyledCard>
          {header && <StyledHeader>{header}</StyledHeader>}
          <StyledContent>{children}</StyledContent>
          {footer && <StyledFooter>{footer}</StyledFooter>}
        </StyledCard>
      </StyledScrollView>
      {banner && <StyledBanner>{banner}</StyledBanner>}
      {notices ? <StyledNotices>{notices}</StyledNotices> : null}
      {overlay && <StyledOverlay>{overlay}</StyledOverlay>}
    </StyledContainer>
  );
};

export default AuthFrameAndroid;
