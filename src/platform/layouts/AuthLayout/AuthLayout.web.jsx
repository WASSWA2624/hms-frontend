/**
 * AuthLayout Component - Web
 * Authentication layout for Web platform
 * File: AuthLayout.web.jsx
 */

import React from 'react';
import { AppLogo, AppLogoSizes, Button, Icon, Text } from '@platform/components';
import { useI18n } from '@hooks';
import useAuthLayout from './useAuthLayout';
import {
  StyledBanner,
  StyledContainer,
  StyledCard,
  StyledBrandHeader,
  StyledBrandLogoShell,
  StyledBrandName,
  StyledBranding,
  StyledSupplementalBranding,
  StyledContent,
  StyledHelpLinks,
  StyledScreenHeader,
  StyledScreenHeaderRow,
  StyledScreenHeaderCopy,
  StyledScreenHeaderTitle,
  StyledScreenHeaderTitleText,
  StyledScreenHeaderSubtitle,
  StyledScreenHeaderSubtitleText,
} from './AuthLayout.web.styles';

/**
 * AuthLayout component for Web
 * @param {Object} props - AuthLayout props
 * @param {React.ReactNode} props.children - Auth form content
 * @param {React.ReactNode} props.branding - Branding/logo area
 * @param {React.ReactNode} props.helpLinks - Help/forgot password links
 * @param {React.ReactNode} props.banner - Optional banner slot (e.g. ShellBanners)
 * @param {React.ReactNode} props.footer - Optional footer slot (e.g. GlobalFooter)
 * @param {string} props.screenTitle - Optional auth screen heading (e.g. Onboarding)
 * @param {string} props.screenSubtitle - Optional auth screen helper copy
 * @param {boolean} props.showScreenHeader - Toggle screen header visibility
 * @param {Object} props.screenBackAction - Optional back action config for screen header
 * @param {string} props.screenBackAction.label - Back button label
 * @param {string} props.screenBackAction.hint - Back button accessibility hint
 * @param {string} props.screenBackAction.disabledHint - Disabled-state hint/reason
 * @param {boolean} props.screenBackAction.disabled - Back button disabled flag
 * @param {Function} props.screenBackAction.onPress - Back button press handler
 * @param {string} props.screenBackAction.testID - Back button test id
 * @param {string} props.accessibilityLabel - Accessibility label
 * @param {string} props.testID - Test identifier
 * @param {string} props.className - Additional CSS class
 */
const AuthLayoutWeb = ({
  children,
  branding,
  helpLinks,
  banner,
  footer,
  screenTitle,
  screenSubtitle,
  showScreenHeader = false,
  screenBackAction,
  accessibilityLabel,
  testID,
  className,
}) => {
  const { t } = useI18n();
  const appName = t('app.name');
  const {
    hasScreenHeader,
    hasBackAction,
    isBackDisabled,
    resolvedBackLabel,
    resolvedBackHint,
    resolvedAccessibilityLabel,
    resolvedScreenHeaderLabel,
  } = useAuthLayout({
    accessibilityLabel,
    showScreenHeader,
    screenTitle,
    screenSubtitle,
    screenBackAction,
    t,
  });

  return (
    <StyledContainer
      className={className}
      testID={testID}
      role="main"
      aria-label={resolvedAccessibilityLabel}
    >
      {banner ? <StyledBanner role="region">{banner}</StyledBanner> : null}
      <StyledCard>
        <StyledBranding $withScreenHeader={hasScreenHeader}>
          <StyledBrandHeader>
            <StyledBrandLogoShell>
              <AppLogo size={AppLogoSizes.MD} accessibilityLabel={appName} />
            </StyledBrandLogoShell>
            <StyledBrandName>
              <Text variant="h2">{appName}</Text>
            </StyledBrandName>
          </StyledBrandHeader>
          {branding ? <StyledSupplementalBranding>{branding}</StyledSupplementalBranding> : null}
        </StyledBranding>
        {hasScreenHeader ? (
          <StyledScreenHeader role="region" aria-label={resolvedScreenHeaderLabel}>
            <StyledScreenHeaderRow>
              <StyledScreenHeaderCopy>
                {screenTitle ? (
                  <StyledScreenHeaderTitle>
                    <StyledScreenHeaderTitleText>{screenTitle}</StyledScreenHeaderTitleText>
                  </StyledScreenHeaderTitle>
                ) : null}
              </StyledScreenHeaderCopy>
              {hasBackAction ? (
                <Button
                  variant="surface"
                  size="small"
                  type="button"
                  onPress={screenBackAction?.onPress}
                  disabled={isBackDisabled}
                  accessibilityLabel={resolvedBackLabel}
                  accessibilityHint={resolvedBackHint}
                  title={resolvedBackHint}
                  testID={screenBackAction?.testID || 'auth-layout-back'}
                  icon={<Icon glyph={'\u2190'} size="xs" decorative />}
                >
                  {resolvedBackLabel}
                </Button>
              ) : null}
            </StyledScreenHeaderRow>
            {screenSubtitle ? (
              <StyledScreenHeaderSubtitle>
                <StyledScreenHeaderSubtitleText>{screenSubtitle}</StyledScreenHeaderSubtitleText>
              </StyledScreenHeaderSubtitle>
            ) : null}
          </StyledScreenHeader>
        ) : null}
        <StyledContent>
          {children}
        </StyledContent>
        {helpLinks && (
          <StyledHelpLinks>
            {helpLinks}
          </StyledHelpLinks>
        )}
        {footer}
      </StyledCard>
    </StyledContainer>
  );
};

export default AuthLayoutWeb;
