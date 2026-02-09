/**
 * LandingScreen - Web
 * Self-serve onboarding entry point (facility selection + CTA).
 * File: LandingScreen.web.jsx
 */

import React, { useCallback } from 'react';
import { useI18n } from '@hooks';
import { Button, Text } from '@platform/components';
import useLandingScreen from './useLandingScreen';
import {
  StyledContainer,
  StyledContent,
  StyledHero,
  StyledSection,
  StyledOptionsGrid,
  StyledOptionButton,
  StyledOptionIndicator,
  StyledHelperText,
  StyledCTA,
  StyledChecklist,
  StyledChecklistItem,
  StyledChecklistBullet,
} from './LandingScreen.web.styles';

const LandingScreenWeb = ({ onStart, initialFacilityId, testID }) => {
  const { t } = useI18n();
  const { options, selectedId, selectOption } = useLandingScreen({
    initialSelection: initialFacilityId,
  });

  const handleStart = useCallback(() => {
    if (onStart) onStart(selectedId);
  }, [onStart, selectedId]);

  return (
    <StyledContainer role="main" aria-label={t('landing.title')} data-testid={testID || 'landing-screen'}>
      <StyledContent>
        <StyledHero>
          <Text variant="h1" accessibilityRole="header">
            {t('landing.title')}
          </Text>
          <Text variant="body">{t('landing.description')}</Text>
        </StyledHero>

        <StyledSection>
          <Text variant="label">{t('landing.facility.title')}</Text>
          <Text variant="caption">{t('landing.facility.hint')}</Text>
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
                  <Text variant="body">{t(option.labelKey)}</Text>
                </StyledOptionButton>
              );
            })}
          </StyledOptionsGrid>
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
      </StyledContent>
    </StyledContainer>
  );
};

export default LandingScreenWeb;
