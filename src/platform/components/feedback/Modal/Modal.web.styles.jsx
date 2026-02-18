/**
 * Modal Web Styles
 * Styled-components for Web platform
 * File: Modal.web.styles.jsx
 */

import styled from 'styled-components';

const hexToRgba = (hexColor, alpha) => {
  if (typeof hexColor !== 'string' || !hexColor.startsWith('#')) {
    return hexColor;
  }

  const normalized = hexColor.slice(1);
  const safeHex = normalized.length === 3
    ? normalized.split('').map((char) => `${char}${char}`).join('')
    : normalized;

  if (safeHex.length !== 6) {
    return hexColor;
  }

  const red = Number.parseInt(safeHex.slice(0, 2), 16);
  const green = Number.parseInt(safeHex.slice(2, 4), 16);
  const blue = Number.parseInt(safeHex.slice(4, 6), 16);
  return `rgba(${red}, ${green}, ${blue}, ${alpha})`;
};

const StyledBackdrop = styled.div.withConfig({
  displayName: 'StyledBackdrop',
  componentId: 'StyledBackdrop',
  shouldForwardProp: (prop) => prop !== 'testID',
}).attrs(({ testID }) => ({
  'data-testid': testID,
}))`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: ${({ theme }) => theme.colors.overlay.backdrop};
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  animation: fadeIn 0.2s ease;
  
  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    animation: none;
  }
`;

const StyledModalContainer = styled.div.withConfig({
  displayName: 'StyledModalContainer',
  componentId: 'StyledModalContainer',
  shouldForwardProp: (prop) => prop !== 'size',
})`
  background-color: ${({ theme }) => theme.colors.background.primary};
  border-radius: ${({ theme, size }) => (size === 'fullscreen' ? 0 : theme.radius.sm)}px;
  width: ${({ size }) => {
    const widths = {
      small: '400px',
      medium: '600px',
      large: '800px',
      fullscreen: '100%',
    };
    return widths[size] || widths.medium;
  }};
  max-width: ${({ size }) => (size === 'fullscreen' ? '100%' : '90vw')};
  max-height: ${({ size }) => (size === 'fullscreen' ? '100%' : '90vh')};
  ${({ size }) => (size === 'fullscreen' ? 'height: 100%;' : '')}
  overflow: hidden;
  box-shadow: ${({ theme }) => `${theme.shadows.md.shadowOffset.width}px ${theme.shadows.md.shadowOffset.height * 5}px ${theme.shadows.md.shadowRadius * 5}px ${hexToRgba(theme.shadows.md.shadowColor, theme.shadows.md.shadowOpacity)}`};
  animation: slideUp 0.3s ease;
  position: relative;
  
  @keyframes slideUp {
    from {
      transform: translateY(20px);
      opacity: 0;
    }
    to {
      transform: translateY(0);
      opacity: 1;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    animation: none;
  }
`;

const StyledCloseButton = styled.button.withConfig({
  displayName: 'StyledCloseButton',
  componentId: 'StyledCloseButton',
  shouldForwardProp: (prop) => prop !== 'testID',
}).attrs(({ testID }) => ({
  'data-testid': testID,
}))`
  position: absolute;
  top: ${({ theme }) => theme.spacing.md}px;
  right: ${({ theme }) => theme.spacing.md}px;
  z-index: 10;
  min-width: 44px;
  min-height: 44px;
  width: ${({ theme }) => theme.spacing.xxl}px;
  height: ${({ theme }) => theme.spacing.xxl}px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: ${({ theme }) => theme.radius.full}px;
  background-color: ${({ theme }) => theme.colors.background.secondary};
  border: none;
  cursor: pointer;
  font-size: ${({ theme }) => theme.typography.fontSize.xl}px;
  line-height: ${({ theme }) => theme.typography.fontSize.xl}px;
  color: ${({ theme }) => theme.colors.text.primary};
  transition: background-color 0.2s ease;

  &:hover {
    background-color: ${({ theme }) => theme.colors.background.tertiary};
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.primary};
    outline-offset: 2px;
  }
`;

const StyledContent = styled.div.withConfig({
  displayName: 'StyledContent',
  componentId: 'StyledContent',
  shouldForwardProp: (prop) => prop !== '$hasCloseButton',
})`
  padding: ${({ theme }) => theme.spacing.lg}px;
  padding-right: ${({ theme, $hasCloseButton }) => (
    $hasCloseButton
      ? theme.spacing.lg + theme.spacing.xxl + theme.spacing.sm
      : theme.spacing.lg
  )}px;
  overflow-y: auto;
  overflow-x: hidden;
  max-height: 100%;
`;

const StyledDescription = styled.div.withConfig({
  displayName: 'StyledDescription',
  componentId: 'StyledDescription',
})`
  display: none;
`;

export { StyledBackdrop, StyledModalContainer, StyledCloseButton, StyledContent, StyledDescription };


