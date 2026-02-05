/**
 * Root Layout Styles - Web
 * Styled-components for Web platform
 * File: RootLayoutStyles.web.styles.jsx
 * 
 * Per theme-design.mdc: Web styles use styled-components entrypoint (not /native)
 * Per component-structure.mdc: Platform separation is MANDATORY
 * Per theme-design.mdc: Consume theme tokens only; Microsoft Fluent look and feel.
 */

import styled from 'styled-components';
import { View, ActivityIndicator } from 'react-native';

const StyledLoadingContainer = styled(View).withConfig({
  displayName: 'StyledLoadingContainer',
  componentId: 'StyledLoadingContainer',
})`
  flex: 1;
  justify-content: center;
  align-items: center;
  background-color: ${({ theme }) => theme.colors?.background?.primary ?? '#FFFFFF'};
`;

const StyledActivityIndicator = styled(ActivityIndicator).withConfig({
  displayName: 'StyledActivityIndicator',
  componentId: 'StyledActivityIndicator',
}).attrs(({ theme }) => ({
  color: theme?.colors?.primary ?? '#0078D4',
}))`
  /* Fluent primary color applied via attrs */
`;

const StyledSlotContainer = styled(View).withConfig({
  displayName: 'StyledSlotContainer',
  componentId: 'StyledSlotContainer',
})`
  flex: 1;
  height: 100%;
  background-color: ${({ theme }) => theme.colors?.background?.primary ?? '#FFFFFF'};
`;

export {
  StyledLoadingContainer,
  StyledActivityIndicator,
  StyledSlotContainer,
};

