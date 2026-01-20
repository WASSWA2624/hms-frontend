/**
 * Root Layout Styles - iOS
 * Styled-components for iOS platform
 * File: RootLayoutStyles.ios.styles.jsx
 * 
 * Per theme-design.mdc: iOS styles use styled-components/native entrypoint
 * Per component-structure.mdc: Platform separation is MANDATORY
 */

import styled from 'styled-components/native';
import { View, ActivityIndicator } from 'react-native';

const StyledLoadingContainer = styled(View).withConfig({
  displayName: 'StyledLoadingContainer',
})`
  flex: 1;
  justify-content: center;
  align-items: center;
`;

const StyledActivityIndicator = styled(ActivityIndicator).withConfig({
  displayName: 'StyledActivityIndicator',
})`
  /* ActivityIndicator styling if needed */
`;

export {
  StyledLoadingContainer,
  StyledActivityIndicator,
};

