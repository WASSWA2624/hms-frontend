/**
 * ModalLayout Web Styles
 * Styled-components for Web platform
 * File: ModalLayout.web.styles.jsx
 */

import styled from 'styled-components';

const StyledContainer = styled.div.withConfig({
  displayName: 'StyledContainer',
  componentId: 'StyledContainer',
})`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm}px;
  background-color: ${({ theme }) => theme.colors.background.primary};
  padding: ${({ theme }) => theme.spacing.md}px;
  border-radius: ${({ theme }) => theme.radius.sm}px;
  min-height: ${({ theme }) => theme.spacing.xxl * 4}px;
  overflow-x: hidden;
  box-sizing: border-box;
`;

export {
  StyledContainer,
};


