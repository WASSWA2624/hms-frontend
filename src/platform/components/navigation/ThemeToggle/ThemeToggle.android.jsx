/**
 * ThemeToggle Component - Android
 * Single-position theme toggle (light/dark); one icon, press toggles
 * File: ThemeToggle.android.jsx
 */
import React from 'react';
import { useI18n } from '@hooks';
import useThemeControls from '../ThemeControls/useThemeControls';
import { THEME_MODES } from './types';
import {
  StyledThemeIcon,
  StyledThemeToggleButton,
  StyledThemeToggleTrack,
  StyledThemeToggleWrapper,
} from './ThemeToggle.android.styles';

const ThemeToggleAndroid = ({ testID, accessibilityLabel }) => {
  const { t } = useI18n();
  const { theme, setTheme } = useThemeControls();
  const resolvedLabel = accessibilityLabel || t('settings.theme.accessibilityLabel');
  const lightLabel = t('settings.theme.options.light');
  const darkLabel = t('settings.theme.options.dark');

  const isLight = theme === THEME_MODES.LIGHT;
  const toggleTheme = () => setTheme(isLight ? THEME_MODES.DARK : THEME_MODES.LIGHT);
  const currentLabel = isLight ? lightLabel : darkLabel;
  const currentIcon = isLight ? '\u2600' : '\u{1F319}';

  return (
    <StyledThemeToggleWrapper testID={testID} accessibilityLabel={resolvedLabel}>
      <StyledThemeToggleTrack>
        <StyledThemeToggleButton
          onPress={toggleTheme}
          accessibilityRole="button"
          accessibilityLabel={currentLabel}
          accessibilityState={{ selected: isLight }}
        >
          <StyledThemeIcon>{currentIcon}</StyledThemeIcon>
        </StyledThemeToggleButton>
      </StyledThemeToggleTrack>
    </StyledThemeToggleWrapper>
  );
};

export default ThemeToggleAndroid;
