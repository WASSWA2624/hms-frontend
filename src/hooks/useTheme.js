/**
 * useTheme Hook
 * Store-backed theme resolver for UI logic.
 * File: useTheme.js
 */
import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { selectTheme } from '@store/selectors';
import { getTheme } from '@theme';

const useTheme = () => {
  const themeValue = useSelector(selectTheme);

  // Stable reference based on the selector value and safe fallback behavior.
  return useMemo(() => {
    if (themeValue && typeof themeValue === 'object') return themeValue;
    if (typeof themeValue === 'string') return getTheme(themeValue);
    return getTheme('light');
  }, [themeValue]);
};

export default useTheme;

