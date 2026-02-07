/**
 * ThemeControls Component - Web
 * Wraps ThemeToggle (single-position light/dark toggle)
 * File: ThemeControls.web.jsx
 */
import React from 'react';
import ThemeToggle from '../ThemeToggle';
import { StyledThemeControls } from './ThemeControls.web.styles';

const ThemeControlsWeb = ({ testID, className, accessibilityLabel, accessibilityHint }) => (
  <StyledThemeControls data-testid={testID} className={className}>
    <ThemeToggle testID={testID} accessibilityLabel={accessibilityLabel} />
  </StyledThemeControls>
);

export default ThemeControlsWeb;
