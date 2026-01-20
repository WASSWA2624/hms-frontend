/**
 * LandingScreen Component - iOS
 * Landing page screen for iOS platform
 * File: LandingScreen.ios.jsx
 */
// 1. External dependencies
import React from 'react';
import { ScrollView } from 'react-native';

// 2. Platform components (from barrel file)
import { Button, Text, Container } from '@platform/components';

// 3. Hooks and utilities (absolute imports via aliases)
import { useI18n } from '@hooks';

// 4. Styles (relative import - platform-specific)
import {
  StyledLandingContainer,
  StyledContent,
  StyledHeroSection,
  StyledButtonGroup,
} from './LandingScreen.ios.styles';

// 5. Component-specific hook (relative import)
import useLandingScreen from './useLandingScreen';

// 6. Types and constants (relative import)
import { STATES } from './types';

/**
 * LandingScreen component for iOS
 * @param {Object} props - LandingScreen props
 */
const LandingScreenIOS = (props) => {
  const { t } = useI18n();
  const { handleGetStarted, handleLearnMore } = useLandingScreen();

  return (
    <ScrollView
      contentContainerStyle={{ flexGrow: 1 }}
      accessibilityLabel={t('landing.title')}
      testID="landing-screen"
    >
      <StyledLandingContainer>
        <StyledContent>
          <StyledHeroSection>
            <Text
              variant="h1"
              align="center"
              accessibilityRole="header"
              testID="landing-hero-title"
            >
              {t('landing.hero.title')}
            </Text>
            <Text
              variant="body"
              align="center"
              style={{ marginTop: 16, maxWidth: 600 }}
              testID="landing-hero-description"
            >
              {t('landing.hero.description')}
            </Text>
          </StyledHeroSection>

          <StyledButtonGroup>
            <Button
              variant="primary"
              size="large"
              onPress={handleGetStarted}
              accessibilityLabel={t('landing.cta.getStarted')}
              accessibilityHint={t('landing.cta.getStartedHint')}
              testID="landing-get-started-button"
            >
              {t('landing.cta.getStarted')}
            </Button>
            <Button
              variant="secondary"
              size="large"
              onPress={handleLearnMore}
              accessibilityLabel={t('landing.cta.learnMore')}
              accessibilityHint={t('landing.cta.learnMoreHint')}
              testID="landing-learn-more-button"
            >
              {t('landing.cta.learnMore')}
            </Button>
          </StyledButtonGroup>
        </StyledContent>
      </StyledLandingContainer>
    </ScrollView>
  );
};

export default LandingScreenIOS;

