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
  StyledSection,
  StyledOptionsList,
  StyledOptionButton,
  StyledOptionIndicator,
  StyledHelperText,
  StyledCTA,
  StyledChecklist,
  StyledChecklistItem,
  StyledChecklistBullet,
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
        <Text variant="h1" accessibilityRole="header">
          {t('landing.title')}
        </Text>
        <Text variant="body">{t('landing.description')}</Text>
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
      </StyledCTA>

      <StyledSection>
        <Text variant="label">{t('landing.next.title')}</Text>
        <StyledChecklist>
          <StyledChecklistItem>
            <StyledChecklistBullet />
            <Text variant="caption">{t('landing.next.items.provision')}</Text>
          </StyledChecklistItem>
          <StyledChecklistItem>
            <StyledChecklistBullet />
            <Text variant="caption">{t('landing.next.items.samples')}</Text>
          </StyledChecklistItem>
          <StyledChecklistItem>
            <StyledChecklistBullet />
            <Text variant="caption">{t('landing.next.items.checklist')}</Text>
          </StyledChecklistItem>
        </StyledChecklist>
      </StyledSection>
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

export default LandingScreenAndroid;
