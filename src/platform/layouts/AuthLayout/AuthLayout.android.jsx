/**
 * AuthLayout Component - Android
 * Authentication layout for Android platform
 * File: AuthLayout.android.jsx
 */

import React, { useCallback, useState } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AppLogo, AppLogoSizes, Button, Icon, Text } from '@platform/components';
import { useI18n } from '@hooks';
import useAuthLayout from './useAuthLayout';
import {
  StyledBanner,
  StyledContainer,
  StyledKeyboardAvoidingView,
  StyledCard,
  StyledBranding,
  StyledBrandHeader,
  StyledBrandLogoShell,
  StyledBrandName,
  StyledSupplementalBranding,
  StyledScreenHeader,
  StyledScreenHeaderRow,
  StyledScreenHeaderCopy,
  StyledScreenHeaderTitleText,
  StyledScreenHeaderSubtitleText,
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
 */
const AuthLayoutAndroid = ({
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
}) => {
  const { t } = useI18n();
  const appName = t('app.name');
  const { top: topInset, bottom: bottomInset } = useSafeAreaInsets();
  const {
    hasScreenHeader,
    hasBackAction,
    isBackDisabled,
    resolvedBackLabel,
    resolvedBackHint,
    resolvedAccessibilityLabel,
  } = useAuthLayout({
    accessibilityLabel,
    showScreenHeader,
    screenTitle,
    screenSubtitle,
    screenBackAction,
    t,
  });
  const [scrollViewportHeight, setScrollViewportHeight] = useState(0);
  const [scrollContentHeight, setScrollContentHeight] = useState(0);

  const handleScrollLayout = useCallback((event) => {
    const nextHeight = event?.nativeEvent?.layout?.height ?? 0;
    setScrollViewportHeight(nextHeight);
  }, []);

  const handleContentSizeChange = useCallback((_width, nextHeight) => {
    setScrollContentHeight(nextHeight ?? 0);
  }, []);

  const shouldShowVerticalIndicator = scrollContentHeight > scrollViewportHeight + 1;

  return (
    <StyledContainer
      topInset={topInset}
      bottomInset={bottomInset}
      accessibilityLabel={resolvedAccessibilityLabel}
      testID={testID}
      accessibilityRole="none"
    >
      {banner ? <StyledBanner accessibilityRole="none">{banner}</StyledBanner> : null}
      <StyledKeyboardAvoidingView behavior="height">
        <StyledCard>
          <StyledBranding $withScreenHeader={hasScreenHeader}>
            <StyledBrandHeader>
              <StyledBrandLogoShell>
                <AppLogo size={AppLogoSizes.MD} accessibilityLabel={appName} />
              </StyledBrandLogoShell>
              <StyledBrandName>
                <Text
                  variant="h2"
                  align="center"
                  numberOfLines={1}
                  ellipsizeMode="tail"
                  adjustsFontSizeToFit
                  minimumFontScale={0.72}
                >
                  {appName}
                </Text>
              </StyledBrandName>
            </StyledBrandHeader>
            {branding ? <StyledSupplementalBranding>{branding}</StyledSupplementalBranding> : null}
          </StyledBranding>
          {hasScreenHeader ? (
            <StyledScreenHeader>
              <StyledScreenHeaderRow>
                <StyledScreenHeaderCopy>
                  {screenTitle ? (
                    <StyledScreenHeaderTitleText>{screenTitle}</StyledScreenHeaderTitleText>
                  ) : null}
                </StyledScreenHeaderCopy>
                {hasBackAction ? (
                  <Button
                    variant="surface"
                    size="small"
                    onPress={screenBackAction?.onPress}
                    disabled={isBackDisabled}
                    accessibilityLabel={resolvedBackLabel}
                    accessibilityHint={resolvedBackHint}
                    testID={screenBackAction?.testID || 'auth-layout-back'}
                    icon={<Icon glyph={'\u2190'} size="xs" decorative />}
                  >
                    {resolvedBackLabel}
                  </Button>
                ) : null}
              </StyledScreenHeaderRow>
              {screenSubtitle ? (
                <StyledScreenHeaderSubtitleText>{screenSubtitle}</StyledScreenHeaderSubtitleText>
              ) : null}
            </StyledScreenHeader>
          ) : null}
          <StyledContent
            horizontal={false}
            onLayout={handleScrollLayout}
            onContentSizeChange={handleContentSizeChange}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={shouldShowVerticalIndicator}
            showsHorizontalScrollIndicator={false}
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
