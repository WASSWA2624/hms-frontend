/**
 * LandingScreen - Web
 * Self-serve onboarding entry point (facility selection + CTA).
 * File: LandingScreen.web.jsx
 */

import React, { useCallback } from 'react';
import { useRouter } from 'expo-router';
import { Button, Text } from '@platform/components';
import { useI18n } from '@hooks';
import {
  StyledContainer,
  StyledContent,
  StyledEmbeddedContent,
  StyledHero,
  StyledHeroBadge,
  StyledSection,
  StyledOptionsGrid,
  StyledOptionButton,
  StyledOptionIcon,
  StyledOptionIndicator,
  StyledHelperText,
  StyledCTA,
  StyledCTAButtons,
  StyledCTABackAction,
  StyledCTAProceedAction,
} from './LandingScreen.web.styles';
import useLandingScreen from './useLandingScreen';

const LandingScreenWeb = ({ onStart, initialFacilityId, testID, embedded = false, isSubmitting = false }) => {
  const router = useRouter();
  const { t } = useI18n();
  const { options, selectedId, selectOption } = useLandingScreen({
    initialSelection: initialFacilityId,
  });

  const handleBack = useCallback(() => {
    router.back();
  }, [router]);

  const handleStart = useCallback(() => {
    if (onStart) onStart(selectedId);
  }, [onStart, selectedId]);

  const content = (
    <>
      <StyledHero>
        <StyledHeroBadge>
          <Text variant="caption" color="primary">{t('landing.badge')}</Text>
        </StyledHeroBadge>
      </StyledHero>

      <StyledSection>
        <Text variant="body">{t('landing.facility.prompt')}</Text>
        <StyledOptionsGrid>
          {options.map((option) => {
            const selected = option.id === selectedId;
            return (
              <StyledOptionButton
                key={option.id}
                type="button"
                $selected={selected}
                aria-pressed={selected}
                onClick={() => selectOption(option.id)}
              >
                <StyledOptionIndicator $selected={selected} />
                <StyledOptionIcon aria-hidden>{option.icon}</StyledOptionIcon>
                <Text variant="body">{t(option.labelKey)}</Text>
              </StyledOptionButton>
            );
          })}
        </StyledOptionsGrid>
        <StyledHelperText>
          <Text variant="caption" color="text.secondary">{t('landing.selectionHelper')}</Text>
        </StyledHelperText>
      </StyledSection>

      <StyledCTA>
        <StyledCTAButtons>
          <StyledCTABackAction>
            <Button
              size="small"
              variant="outline"
              accessibilityLabel={t('common.back')}
              accessibilityHint={t('landing.cta.backHint')}
              onPress={handleBack}
              disabled={isSubmitting}
              testID="landing-back-button"
            >
              {t('common.back')}
            </Button>
          </StyledCTABackAction>
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
            >
              {t('landing.cta.primary')}
            </Button>
          </StyledCTAProceedAction>
        </StyledCTAButtons>
      </StyledCTA>
    </>
  );

  if (embedded) {
    return <StyledEmbeddedContent data-testid={testID || 'landing-screen'}>{content}</StyledEmbeddedContent>;
  }

  return (
    <StyledContainer role="main" aria-label={t('landing.pageTitle')} data-testid={testID || 'landing-screen'}>
      <StyledContent>{content}</StyledContent>
    </StyledContainer>
  );
};

export default LandingScreenWeb;

