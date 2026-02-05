/**
 * FilterBar Web Styles
 * Styled-components for Web platform
 * File: FilterBar.web.styles.jsx
 */

import styled from 'styled-components';

const StyledContainer = styled.div.withConfig({
  displayName: 'StyledContainer',
  componentId: 'StyledContainer',
})`
  display: flex;
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


