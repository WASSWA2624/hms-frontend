/**
 * useTheme Hook
 * Store-backed theme resolver for UI logic.
 * File: useTheme.js
 */
import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { selectTheme } from '@store/selectors';
import { getTheme } from '@theme';

const isPlainObject = (value) =>
  Boolean(value) && typeof value === 'object' && !Array.isArray(value);

const mergeTheme = (baseTheme, overrideTheme) => {
  if (!isPlainObject(baseTheme)) return baseTheme;
  if (!isPlainObject(overrideTheme)) return baseTheme;

  const result = { ...baseTheme };

  Object.entries(overrideTheme).forEach(([key, overrideValue]) => {
    if (overrideValue === undefined) return;

    const baseValue = baseTheme[key];
    if (isPlainObject(baseValue) && isPlainObject(overrideValue)) {
      result[key] = mergeTheme(baseValue, overrideValue);
      return;
    }

    result[key] = overrideValue;
  });

  return result;
};

const resolveThemeMode = (themeValue) => {
  if (themeValue === 'dark') return 'dark';
  if (themeValue === 'light') return 'light';

  if (isPlainObject(themeValue)) {
    const modeCandidate = String(
      themeValue.mode || themeValue.theme || themeValue.scheme || ''
    ).toLowerCase();
    if (modeCandidate === 'dark') return 'dark';
    if (modeCandidate === 'light') return 'light';
  }

  return 'light';
};

const useTheme = () => {
  const themeValue = useSelector(selectTheme);

  // Stable reference based on selector value with normalization for legacy persisted theme shapes.
  return useMemo(() => {
    const mode = resolveThemeMode(themeValue);
    const baseTheme = getTheme(mode);
    if (isPlainObject(themeValue)) {
      return mergeTheme(baseTheme, themeValue);
    }
    if (typeof themeValue === 'string') {
      return baseTheme;
    }
    return getTheme('light');
  }, [themeValue]);
};

export default useTheme;

