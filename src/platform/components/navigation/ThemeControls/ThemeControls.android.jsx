/**
 * ThemeControls Component - Android
 * Wraps ThemeToggle (single-position light/dark toggle)
 * File: ThemeControls.android.jsx
 */
import React from 'react';
import ThemeToggle from '../ThemeToggle';
import { StyledThemeControls } from './ThemeControls.android.styles';

const ThemeControlsAndroid = ({ testID, accessibilityLabel, accessibilityHint }) => (
  <StyledThemeControls testID={testID} accessibilityLabel={accessibilityLabel}>
    <ThemeToggle testID={testID} accessibilityLabel={accessibilityLabel} />
  </StyledThemeControls>
);

export default ThemeControlsAndroid;
