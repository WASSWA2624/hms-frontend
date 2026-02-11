/**
 * LandingScreen - iOS
 * Self-serve onboarding entry point (facility selection + CTA).
 * File: LandingScreen.ios.jsx
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
  StyledHelperText,
  StyledCTA,
  StyledCtaHelper,
} from './LandingScreen.ios.styles';

const LandingScreenIOS = ({ onStart, initialFacilityId, testID, embedded = false, isSubmitting = false }) => {
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
        <Text variant="h2" accessibilityRole="header">
          {t('landing.title')}
        </Text>
        <Text variant="body">
          {t('landing.description')}
        </Text>
      </StyledHero>

      <StyledSection>
        <Text variant="label">{t('landing.facility.title')}</Text>
        <Text variant="caption">{t('landing.facility.hint')}</Text>
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
          <Text variant="caption">{t('landing.selectionHelper')}</Text>
        </StyledHelperText>
      </StyledSection>

      <StyledCTA>
        <Button
          size="large"
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
    <StyledContainer testID={testID || 'landing-screen'} accessibilityLabel={t('landing.title')}>
      <StyledScroll>
        <StyledContent>{content}</StyledContent>
      </StyledScroll>
    </StyledContainer>
  );
};

export default LandingScreenIOS;
