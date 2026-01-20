/**
 * LoadingSpinner Web Styles
 * Styled-components for Web platform
 * File: LoadingSpinner.web.styles.jsx
 */

import styled from 'styled-components';

/**
 * Get border width based on size
 * @param {string} size - Spinner size
 * @returns {string} Border width
 */
const getBorderWidth = (size) => {
  const widths = {
    small: '2px',
    medium: '3px',
    large: '4px',
  };
  return widths[size] || widths.medium;
};

/**
 * Get spinner dimensions based on size
 * @param {string} size - Spinner size
 * @param {Object} theme - Theme object
 * @returns {string} Spinner dimension in pixels
 */
const getSpinnerDimension = (size, theme) => {
  const sizes = {
    small: theme.spacing.md,
    medium: theme.spacing.lg,
    large: theme.spacing.xl,
  };
  return `${sizes[size] || sizes.medium}px`;
};

/**
 * Get border color (fallback to theme)
 * @param {string} color - Custom color
 * @param {Object} theme - Theme object
 * @returns {string} Border color
 */
const getBorderColor = (color, theme) => {
  return color || theme.colors.background.tertiary;
};

/**
 * Get border top color (fallback to theme primary)
 * @param {string} color - Custom color
 * @param {Object} theme - Theme object
 * @returns {string} Border top color
 */
const getBorderTopColor = (color, theme) => {
  return color || theme.colors.primary;
};

const StyledContainer = styled.div.withConfig({
  displayName: 'StyledContainer',
  componentId: 'StyledContainer',
})`
  display: inline-flex;
  align-items: center;
  justify-content: center;
`;

const StyledSpinner = styled.div.withConfig({
  displayName: 'StyledSpinner',
  componentId: 'StyledSpinner',
})`
  border: ${({ size, theme }) => getBorderWidth(size)} solid ${({ color, theme }) => getBorderColor(color, theme)};
  border-top-color: ${({ color, theme }) => getBorderTopColor(color, theme)};
  border-radius: 50%;
  width: ${({ size, theme }) => getSpinnerDimension(size, theme)};
  height: ${({ size, theme }) => getSpinnerDimension(size, theme)};
  animation: spin 0.8s linear infinite;

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`;

export { StyledContainer, StyledSpinner, getBorderWidth, getSpinnerDimension, getBorderColor, getBorderTopColor };


