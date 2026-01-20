/**
 * Root Layout Styles - Web
 * Styled-components for Web platform
 * File: RootLayoutStyles.web.styles.jsx
 * 
 * Per theme-design.mdc: Web styles use styled-components entrypoint (not /native)
 * Per component-structure.mdc: Platform separation is MANDATORY
 */

import styled from 'styled-components';
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

