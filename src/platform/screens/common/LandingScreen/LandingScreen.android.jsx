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
  StyledHero,
  StyledHeroBadge,
  StyledSection,
  StyledOptionsList,
  StyledOptionButton,
  StyledOptionIcon,
  StyledOptionIndicator,
  StyledCTA,
  StyledCtaHelper,
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
      <StyledHero>
        <StyledHeroBadge>
          <Text variant="caption">{t('landing.badge')}</Text>
        </StyledHeroBadge>
      </StyledHero>

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
      </StyledSection>

      <StyledCTA>
        <Button
          size="medium"
          variant="primary"
          accessibilityLabel={t('landing.cta.primary')}
          accessibilityHint={t('landing.cta.primaryHint')}
          onPress={handleStart}
          loading={isSubmitting}
          disabled={isSubmitting}
        >
          {t('landing.cta.primary')}
        </Button>
        <StyledCtaHelper>
          <Text variant="caption">{t('landing.cta.helper')}</Text>
        </StyledCtaHelper>
      </StyledCTA>
    </>
  );

  if (embedded) {
    return <StyledEmbeddedContent testID={testID || 'landing-screen'}>{content}</StyledEmbeddedContent>;
  }

  return (
    <StyledContainer testID={testID || 'landing-screen'} accessibilityLabel={t('landing.cta.primary')}>
      <StyledScroll>
        <StyledContent>{content}</StyledContent>
      </StyledScroll>
    </StyledContainer>
  );
};

export default LandingScreenAndroid;
