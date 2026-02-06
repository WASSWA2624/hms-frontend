/**
 * ThemeControls Component - Android
 * Elegant theme toggle (light/dark)
 */
import React from 'react';
import { Text } from 'react-native';
import { useI18n } from '@hooks';
import useThemeControls from './useThemeControls';
import { THEME_MODES } from './types';
import { StyledThemeControls, StyledThemeToggle, StyledThemeOption } from './ThemeControls.android.styles';

const ThemeControlsAndroid = ({ testID, accessibilityLabel, accessibilityHint }) => {
  const { t } = useI18n();
  const { theme, setTheme } = useThemeControls();
  const resolvedLabel = accessibilityLabel || t('settings.theme.accessibilityLabel');
  const lightLabel = t('settings.theme.options.light');
  const darkLabel = t('settings.theme.options.dark');

  return (
    <StyledThemeControls testID={testID} accessibilityLabel={resolvedLabel}>
      <StyledThemeToggle>
        <StyledThemeOption
          active={theme === THEME_MODES.LIGHT}
          onPress={() => setTheme(THEME_MODES.LIGHT)}
          accessibilityRole="button"
          accessibilityLabel={lightLabel}
          accessibilityState={{ selected: theme === THEME_MODES.LIGHT }}
        >
          <Text style={{ fontSize: 16 }}>☀</Text>
        </StyledThemeOption>
        <StyledThemeOption
          active={theme === THEME_MODES.DARK}
          onPress={() => setTheme(THEME_MODES.DARK)}
          accessibilityRole="button"
          accessibilityLabel={darkLabel}
          accessibilityState={{ selected: theme === THEME_MODES.DARK }}
        >
          <Text style={{ fontSize: 16 }}>🌙</Text>
        </StyledThemeOption>
      </StyledThemeToggle>
    </StyledThemeControls>
  );
};

export default ThemeControlsAndroid;
