/**
 * ThemeToggle Component - Web
 * Single-position theme toggle (light/dark); one icon, click toggles
 * File: ThemeToggle.web.jsx
 */
import React from 'react';
import { useI18n } from '@hooks';
import useThemeControls from '../ThemeControls/useThemeControls';
import { THEME_MODES } from './types';
import { StyledThemeToggleWrapper, StyledThemeToggleTrack, StyledThemeToggleButton } from './ThemeToggle.web.styles';

const SunIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <circle cx="12" cy="12" r="4" />
    <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
  </svg>
);

const MoonIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
  </svg>
);

const ThemeToggleWeb = ({ testID, className, accessibilityLabel }) => {
  const { t } = useI18n();
  const { theme, setTheme } = useThemeControls();
  const resolvedLabel = accessibilityLabel || t('settings.theme.accessibilityLabel');
  const lightLabel = t('settings.theme.options.light');
  const darkLabel = t('settings.theme.options.dark');

  const isLight = theme === THEME_MODES.LIGHT;
  const toggleTheme = () => setTheme(isLight ? THEME_MODES.DARK : THEME_MODES.LIGHT);
  const currentLabel = isLight ? lightLabel : darkLabel;

  return (
    <StyledThemeToggleWrapper data-testid={testID} className={className} role="group" aria-label={resolvedLabel}>
      <StyledThemeToggleTrack>
        <StyledThemeToggleButton
          type="button"
          onClick={toggleTheme}
          aria-pressed={isLight}
          aria-label={currentLabel}
          title={currentLabel}
          data-testid={testID ? `${testID}-${isLight ? 'light' : 'dark'}` : undefined}
        >
          {isLight ? <SunIcon /> : <MoonIcon />}
        </StyledThemeToggleButton>
      </StyledThemeToggleTrack>
    </StyledThemeToggleWrapper>
  );
};

export default ThemeToggleWeb;
