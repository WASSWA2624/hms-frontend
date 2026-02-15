/**
 * AuthLayout Component - Android
 * Authentication layout for Android platform
 * File: AuthLayout.android.jsx
 */

import React from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AppLogo, AppLogoSizes, Text } from '@platform/components';
import { useI18n } from '@hooks';
import {
  StyledContainer,
  StyledKeyboardAvoidingView,
  StyledCard,
  StyledBranding,
  StyledBrandHeader,
  StyledBrandLogoShell,
  StyledBrandName,
  StyledContent,
  StyledHelpLinks,
} from './AuthLayout.android.styles';

/**
 * AuthLayout component for Android
 * @param {Object} props - AuthLayout props
 * @param {React.ReactNode} props.children - Auth form content
 * @param {React.ReactNode} props.branding - Branding/logo area
 * @param {React.ReactNode} props.helpLinks - Help/forgot password links
 * @param {React.ReactNode} props.banner - Optional banner slot (e.g. ShellBanners)
 * @param {React.ReactNode} props.footer - Optional footer slot (e.g. GlobalFooter)
 * @param {string} props.accessibilityLabel - Accessibility label
 * @param {string} props.testID - Test identifier
 */
const AuthLayoutAndroid = ({
  children,
  branding,
  helpLinks,
  banner,
  footer,
  accessibilityLabel,
  testID,
}) => {
  const { t } = useI18n();
  const appName = t('app.name');
  const { top: topInset, bottom: bottomInset } = useSafeAreaInsets();

  const resolvedBranding = branding ?? (
    <StyledBrandHeader>
      <StyledBrandLogoShell>
        <AppLogo size={AppLogoSizes.MD} accessibilityLabel={appName} />
      </StyledBrandLogoShell>
      <StyledBrandName>
        <Text variant="h2" align="center">{appName}</Text>
      </StyledBrandName>
    </StyledBrandHeader>
  );

  return (
    <StyledContainer
      topInset={topInset}
      bottomInset={bottomInset}
      accessibilityLabel={accessibilityLabel}
      testID={testID}
      accessibilityRole="none"
    >
      {banner}
      <StyledKeyboardAvoidingView behavior="height">
        <StyledCard>
          <StyledBranding>{resolvedBranding}</StyledBranding>
          <StyledContent
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            {children}
          </StyledContent>
          {helpLinks && <StyledHelpLinks>{helpLinks}</StyledHelpLinks>}
          {footer}
        </StyledCard>
      </StyledKeyboardAvoidingView>
    </StyledContainer>
  );
};

export default AuthLayoutAndroid;
