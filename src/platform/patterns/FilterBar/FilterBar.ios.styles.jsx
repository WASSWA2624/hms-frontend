/**
 * FilterBar iOS Styles
 * Styled-components for iOS platform
 * File: FilterBar.ios.styles.jsx
 */

import styled from 'styled-components/native';

const StyledContainer = styled.View.withConfig({
  displayName: 'StyledContainer',
  componentId: 'StyledContainer',
})`
  flex-direction: row;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing.sm}px;
  align-items: center;
  width: 100%;
  padding: ${({ theme }) => theme.spacing.sm}px;
  background-color: ${({ theme }) => theme.colors.background.secondary};
  border-radius: ${({ theme }) => theme.radius.sm}px;
`;

export {
  StyledContainer,
};


