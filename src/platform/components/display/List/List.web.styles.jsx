/**
 * List Web Styles
 * Styled-components for Web platform
 * File: List.web.styles.jsx
 */
import styled from 'styled-components';

const StyledList = styled.div.withConfig({
  displayName: 'StyledList',
})`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

export { StyledList };
