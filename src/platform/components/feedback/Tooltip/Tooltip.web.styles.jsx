/**
 * Tooltip Web Styles
 * Styled-components for Web platform
 * File: Tooltip.web.styles.jsx
 */

import styled from 'styled-components';

const StyledTooltip = styled.div.withConfig({
  displayName: 'StyledTooltip',
  componentId: 'StyledTooltip',
})`
  --tooltip-gap: ${({ theme }) => theme?.spacing?.sm ?? 8}px;
  --tooltip-arrow-size: ${({ theme }) => {
    const spacingXs = theme?.spacing?.xs ?? 4;
    return spacingXs + spacingXs / 2;
  }}px;
  --tooltip-bg: ${({ theme }) => theme?.colors?.tooltip?.background || 'rgba(0, 0, 0, 0.85)'};

  position: absolute;
  z-index: 2147483001;
  padding-left: ${({ theme }) => theme?.spacing?.md ?? 12}px;
  padding-right: ${({ theme }) => theme?.spacing?.md ?? 12}px;
  padding-top: ${({ theme }) => theme?.spacing?.sm ?? 8}px;
  padding-bottom: ${({ theme }) => theme?.spacing?.sm ?? 8}px;
  border-radius: ${({ theme }) => theme?.radius?.sm ?? 6}px;
  background-color: var(--tooltip-bg);
  max-width: ${({ theme }) => (theme?.spacing?.xxl ?? 40) * 4}px;
  animation: fadeIn 0.2s ease-out;
  
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

  &[data-mode='anchored'] {
    position: fixed;
    margin: 0;
    transform: none;
  }

  &[data-mode='relative'][data-placement='top'] {
    bottom: 100%;
    left: 50%;
    transform: translateX(-50%);
    margin-bottom: var(--tooltip-gap);
  }

  &[data-mode='relative'][data-placement='bottom'] {
    top: 100%;
    left: 50%;
    transform: translateX(-50%);
    margin-top: var(--tooltip-gap);
  }

  &[data-mode='relative'][data-placement='left'] {
    right: 100%;
    top: 50%;
    transform: translateY(-50%);
    margin-right: var(--tooltip-gap);
  }

  &[data-mode='relative'][data-placement='right'] {
    left: 100%;
    top: 50%;
    transform: translateY(-50%);
    margin-left: var(--tooltip-gap);
  }

  &::after {
    content: '';
    position: absolute;
    border: var(--tooltip-arrow-size) solid transparent;
  }

  &[data-placement='top']::after {
    top: 100%;
    left: 50%;
    transform: translateX(-50%);
    border-top-color: var(--tooltip-bg);
  }

  &[data-placement='bottom']::after {
    bottom: 100%;
    left: 50%;
    transform: translateX(-50%);
    border-bottom-color: var(--tooltip-bg);
  }

  &[data-placement='left']::after {
    left: 100%;
    top: 50%;
    transform: translateY(-50%);
    border-left-color: var(--tooltip-bg);
  }

  &[data-placement='right']::after {
    right: 100%;
    top: 50%;
    transform: translateY(-50%);
    border-right-color: var(--tooltip-bg);
  }
`;

const StyledTooltipText = styled.span.withConfig({
  displayName: 'StyledTooltipText',
  componentId: 'StyledTooltipText',
})`
  font-family: ${({ theme }) => theme?.typography?.fontFamily?.regular || 'System'};
  font-size: ${({ theme }) => theme?.typography?.fontSize?.sm ?? 14}px;
  font-weight: ${({ theme }) => theme?.typography?.fontWeight?.normal || '400'};
  line-height: ${({ theme }) =>
    (theme?.typography?.fontSize?.sm ?? 14) * (theme?.typography?.lineHeight?.normal ?? 1.4)}px;
  color: ${({ theme }) => theme?.colors?.tooltip?.text || '#FFFFFF'};
  text-align: center;
`;

export { StyledTooltip, StyledTooltipText };


