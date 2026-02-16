/**
 * LandingScreen - Android
 * Self-serve onboarding entry point (facility selection + CTA).
 * File: LandingScreen.android.jsx
 */

import React, { useCallback } from 'react';
import { useI18n } from '@hooks';
import { Button, Text } from '@platform/components';
import useLandingScreen from './useLandingScreen';
import {
  StyledContainer,
  StyledScroll,
  StyledContent,
  StyledEmbeddedContent,
  StyledSection,
  StyledOptionsList,
  StyledOptionButton,
  StyledOptionIcon,
  StyledOptionIndicator,
  StyledHelperText,
  StyledCTA,
  StyledCTAProceedAction,
} from './LandingScreen.android.styles';

const LandingScreenAndroid = ({ onStart, initialFacilityId, testID, embedded = false, isSubmitting = false }) => {
  const { t } = useI18n();
  const { options, selectedId, selectOption } = useLandingScreen({
    initialSelection: initialFacilityId,
  });

  const handleStart = useCallback(() => {
    if (onStart) onStart(selectedId);
  }, [onStart, selectedId]);

  const content = (
    <>
      <StyledSection>
        <Text variant="body">{t('landing.facility.prompt')}</Text>
        <StyledOptionsList>
          {options.map((option) => {
            const selected = option.id === selectedId;
            return (
              <StyledOptionButton
                key={option.id}
                $selected={selected}
                accessibilityRole="button"
                accessibilityState={{ selected }}
                onPress={() => selectOption(option.id)}
              >
                <StyledOptionIndicator $selected={selected} />
                <StyledOptionIcon>
                  <Text variant="caption">{option.icon}</Text>
                </StyledOptionIcon>
                <Text variant="body">{t(option.labelKey)}</Text>
              </StyledOptionButton>
            );
          })}
        </StyledOptionsList>
        <StyledHelperText>
          <Text variant="caption" color="text.secondary">{t('landing.selectionHelper')}</Text>
        </StyledHelperText>
      </StyledSection>

      <StyledCTA>
        <StyledCTAProceedAction>
          <Button
            size="small"
            variant="primary"
            accessibilityLabel={t('landing.cta.primary')}
            accessibilityHint={t('landing.cta.primaryHint')}
            onPress={handleStart}
            loading={isSubmitting}
            disabled={isSubmitting}
            testID="landing-proceed-button"
            style={{ width: '100%' }}
          >
            {t('landing.cta.primary')}
          </Button>
        </StyledCTAProceedAction>
      </StyledCTA>
    </>
  );

  if (embedded) {
    return <StyledEmbeddedContent testID={testID || 'landing-screen'}>{content}</StyledEmbeddedContent>;
  }

  return (
    <StyledContainer testID={testID || 'landing-screen'} accessibilityLabel={t('landing.pageTitle')}>
      <StyledScroll>
        <StyledContent>{content}</StyledContent>
      </StyledScroll>
    </StyledContainer>
  );
};

export default LandingScreenAndroid;

