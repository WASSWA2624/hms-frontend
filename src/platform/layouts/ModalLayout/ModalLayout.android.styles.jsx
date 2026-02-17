/**
 * ModalLayout Android Styles
 * Styled-components for Android platform
 * File: ModalLayout.android.styles.jsx
 */

import styled from 'styled-components/native';

const StyledContainer = styled.View.withConfig({
  displayName: 'StyledContainer',
  componentId: 'StyledContainer',
})`
  width: 100%;
  align-self: stretch;
  background-color: ${({ theme }) => theme.colors.background.primary};
  padding: ${({ theme }) => theme.spacing.md}px;
  min-height: ${({ theme }) => theme.spacing.xxl * 4}px;
  overflow: hidden;
`;

export {
  StyledContainer,
};


