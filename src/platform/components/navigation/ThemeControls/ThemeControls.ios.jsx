/**
 * ThemeControls Component - iOS
 * Wraps ThemeToggle (single-position light/dark toggle)
 * File: ThemeControls.ios.jsx
 */
import React from 'react';
import ThemeToggle from '../ThemeToggle';
import { StyledThemeControls } from './ThemeControls.ios.styles';

const ThemeControlsIOS = ({ testID, accessibilityLabel, accessibilityHint }) => (
  <StyledThemeControls testID={testID} accessibilityLabel={accessibilityLabel}>
    <ThemeToggle testID={testID} accessibilityLabel={accessibilityLabel} />
  </StyledThemeControls>
);

export default ThemeControlsIOS;
