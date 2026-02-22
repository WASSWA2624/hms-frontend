/**
 * Tooltip iOS Styles
 * Styled-components for iOS platform
 * File: Tooltip.ios.styles.jsx
 */

import styled from 'styled-components/native';

const StyledTooltip = styled.View.withConfig({
  displayName: 'StyledTooltip',
  componentId: 'StyledTooltip',
})`
  position: absolute;
  z-index: 10000;
  padding-horizontal: ${({ theme }) => theme?.spacing?.md ?? 12}px;
  padding-vertical: ${({ theme }) => theme?.spacing?.sm ?? 8}px;
  border-radius: ${({ theme }) => theme?.radius?.sm ?? 6}px;
  background-color: ${({ theme }) => theme?.colors?.tooltip?.background || 'rgba(0, 0, 0, 0.85)'};
  max-width: ${({ theme }) => (theme?.spacing?.xxl ?? 40) * 4}px;
  shadow-color: ${({ theme }) => theme?.shadows?.sm?.shadowColor || '#000000'};
  shadow-offset: ${({ theme }) => theme?.shadows?.sm?.shadowOffset?.width ?? 0}px
    ${({ theme }) => theme?.shadows?.sm?.shadowOffset?.height ?? 2}px;
  shadow-opacity: ${({ theme }) => theme?.shadows?.sm?.shadowOpacity ?? 0.2};
  shadow-radius: ${({ theme }) => theme?.shadows?.sm?.shadowRadius ?? 4}px;
  ${({ position, theme }) => {
    const margin = theme?.spacing?.sm ?? 8;
    if (position === 'top') {
      return `bottom: 100%; margin-bottom: ${margin}px;`;
    }
    if (position === 'bottom') {
      return `top: 100%; margin-top: ${margin}px;`;
    }
    if (position === 'left') {
      return `right: 100%; margin-right: ${margin}px;`;
    }
    return `left: 100%; margin-left: ${margin}px;`;
  }}
`;

const StyledTooltipText = styled.Text.withConfig({
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


