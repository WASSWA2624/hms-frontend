/**
 * LandingScreen - Web
 * Self-serve onboarding entry point (facility selection + CTA).
 * File: LandingScreen.web.jsx
 */

import React, { useCallback } from 'react';
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
  StyledCTA,
  StyledCtaHelper,
} from './LandingScreen.web.styles';
import useLandingScreen from './useLandingScreen';

const LandingScreenWeb = ({ onStart, initialFacilityId, testID, embedded = false, isSubmitting = false }) => {
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
    return <StyledEmbeddedContent data-testid={testID || 'landing-screen'}>{content}</StyledEmbeddedContent>;
  }

  return (
    <StyledContainer role="main" aria-label={t('landing.cta.primary')} data-testid={testID || 'landing-screen'}>
      <StyledContent>{content}</StyledContent>
    </StyledContainer>
  );
};

export default LandingScreenWeb;
