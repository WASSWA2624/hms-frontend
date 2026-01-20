/**
 * LoadingSpinner Android Styles
 * Styled-components for Android platform
 * File: LoadingSpinner.android.styles.jsx
 */

import styled from 'styled-components/native';

const StyledContainer = styled.View.withConfig({
  displayName: 'StyledContainer',
  componentId: 'StyledContainer',
})`
  align-items: center;
  justify-content: center;
`;

const StyledSpinner = styled.ActivityIndicator.withConfig({
  displayName: 'StyledSpinner',
  componentId: 'StyledSpinner',
})`
  /* ActivityIndicator handles its own styling */
`;

export { StyledContainer, StyledSpinner };


