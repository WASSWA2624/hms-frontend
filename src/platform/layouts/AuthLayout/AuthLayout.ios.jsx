/**
 * AuthLayout Component - iOS
 * Authentication layout for iOS platform
 * File: AuthLayout.ios.jsx
 */

import React from 'react';
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
 * @param {string} props.accessibilityLabel - Accessibility label
 * @param {string} props.testID - Test identifier
 */
const AuthLayoutIOS = ({
  children,
  branding,
  helpLinks,
  accessibilityLabel,
  testID,
}) => {
  return (
    <StyledContainer
      accessibilityLabel={accessibilityLabel}
      testID={testID}
      accessibilityRole="main"
    >
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

export default AuthLayoutIOS;

