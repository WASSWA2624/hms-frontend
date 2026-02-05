/**
 * ListScaffold Web Styles
 * Styled-components for Web platform
 * File: ListScaffold.web.styles.jsx
 */

import styled from 'styled-components';

const StyledContainer = styled.div.withConfig({
  displayName: 'StyledContainer',
  componentId: 'StyledContainer',
})`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: ${({ theme }) => theme.spacing.xxl * 4}px;
  padding: ${({ theme }) => theme.spacing.lg}px;
`;

export {
  StyledContainer,
};

