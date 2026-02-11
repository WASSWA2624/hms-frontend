/**
 * AuthLayout Component - iOS
 * Authentication layout for iOS platform
 * File: AuthLayout.ios.jsx
 */

import React, { memo } from 'react';
import {
  StyledContainer,
  StyledKeyboardAvoidingView,
  StyledScrollView,
  StyledCard,
  StyledBranding,
  StyledContent,
  StyledHelpLinks,
} from './AuthLayout.ios.styles';

/**
 * AuthLayout component for iOS
 * @param {Object} props - AuthLayout props
 * @param {React.ReactNode} props.children - Auth form content
 * @param {React.ReactNode} props.branding - Branding/logo area
 * @param {React.ReactNode} props.helpLinks - Help/forgot password links
 * @param {React.ReactNode} props.banner - Optional banner slot (e.g. ShellBanners)
 * @param {string} props.accessibilityLabel - Accessibility label
 * @param {string} props.testID - Test identifier
 */
const AuthLayoutIOS = ({
  children,
  branding,
  helpLinks,
  banner,
  accessibilityLabel,
  testID,
}) => {
  return (
    <StyledContainer
      accessibilityLabel={accessibilityLabel}
      testID={testID}
      accessibilityRole="none"
    >
      {banner}
      <StyledKeyboardAvoidingView behavior="padding">
        <StyledScrollView
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <StyledCard>
            {branding && (
              <StyledBranding>
                {branding}
              </StyledBranding>
            )}
            <StyledContent>
              {children}
            </StyledContent>
            {helpLinks && (
              <StyledHelpLinks>
                {helpLinks}
              </StyledHelpLinks>
            )}
          </StyledCard>
        </StyledScrollView>
      </StyledKeyboardAvoidingView>
    </StyledContainer>
  );
};

export default memo(AuthLayoutIOS);

