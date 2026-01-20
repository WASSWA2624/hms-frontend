/**
 * HomeScreen Component - Android
 * Authenticated home screen for Android platform
 * File: HomeScreen.android.jsx
 */
// 1. External dependencies
import React from 'react';
import { ScrollView } from 'react-native';

// 2. Platform components (from barrel file)
import { Text } from '@platform/components';

// 3. Hooks and utilities (absolute imports via aliases)
import { useI18n } from '@hooks';

// 4. Styles (relative import - platform-specific)
import {
  StyledHomeContainer,
  StyledContent,
  StyledWelcomeSection,
  StyledWelcomeMessage,
} from './HomeScreen.android.styles';

// 5. Component-specific hook (relative import)
import useHomeScreen from './useHomeScreen';

// 6. Types and constants (relative import)
import { STATES } from './types';

/**
 * HomeScreen component for Android
 * @param {Object} props - HomeScreen props
 */
const HomeScreenAndroid = (props) => {
  const { t } = useI18n();
  const {} = useHomeScreen();

  return (
    <ScrollView
      contentContainerStyle={{ flexGrow: 1 }}
      accessibilityLabel={t('home.title')}
      testID="home-screen"
    >
      <StyledHomeContainer>
        <StyledContent>
          <StyledWelcomeSection>
            <Text
              variant="h1"
              accessibilityRole="header"
              testID="home-welcome-title"
            >
              {t('home.welcome.title')}
            </Text>
            <StyledWelcomeMessage>
              <Text
                variant="body"
                testID="home-welcome-message"
              >
                {t('home.welcome.message')}
              </Text>
            </StyledWelcomeMessage>
          </StyledWelcomeSection>
        </StyledContent>
      </StyledHomeContainer>
    </ScrollView>
  );
};

export default HomeScreenAndroid;

