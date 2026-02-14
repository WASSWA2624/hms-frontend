/**
 * Card Web Styles
 * Styled-components for Web platform
 * File: Card.web.styles.jsx
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

const StyledCard = styled.article.withConfig({
  displayName: 'StyledCard',
  componentId: 'StyledCard',
})`
  background-color: ${({ theme }) => theme.colors.background.secondary};
  border: 1px solid ${({ theme }) => theme.colors.background.tertiary};
  border-radius: ${({ theme }) => theme.radius.sm}px;
  overflow: hidden;
  ${({ variant, theme }) => {
    if (variant === 'elevated') {
      return `
        box-shadow: ${theme.shadows.md.shadowOffset.width}px ${theme.shadows.md.shadowOffset.height}px ${theme.shadows.md.shadowRadius}px ${hexToRgba(theme.shadows.md.shadowColor, theme.shadows.md.shadowOpacity)};
      `;
    }
    if (variant === 'outlined') {
      return `
        border: 1px solid ${theme.colors.background.tertiary};
      `;
    }
    return '';
  }}
  transition: box-shadow 0.2s ease, border-color 0.2s ease;
`;

const StyledCardHeader = styled.div.withConfig({
  displayName: 'StyledCardHeader',
  componentId: 'StyledCardHeader',
  shouldForwardProp: (prop) => !prop.startsWith('$'),
})`
  padding: ${({ theme }) => theme.spacing.md}px;
  border-bottom: ${({ $hasBody, $hasFooter, theme }) => ($hasBody || $hasFooter ? `1px solid ${theme.colors.background.tertiary}` : 'none')};
`;

const StyledCardBody = styled.div.withConfig({
  displayName: 'StyledCardBody',
  componentId: 'StyledCardBody',
  shouldForwardProp: (prop) => !prop.startsWith('$'),
})`
  padding: ${({ theme }) => theme.spacing.md}px;
  ${({ $hasHeader, $hasFooter }) => {
    let styles = '';
    if ($hasHeader) {
      styles += 'padding-top: 0;';
    }
    if ($hasFooter) {
      styles += 'padding-bottom: 0;';
    }
    return styles;
  }}
`;

const StyledCardFooter = styled.div.withConfig({
  displayName: 'StyledCardFooter',
  componentId: 'StyledCardFooter',
})`
  padding: ${({ theme }) => theme.spacing.md}px;
  border-top: 1px solid ${({ theme }) => theme.colors.background.tertiary};
`;

export { StyledCard, StyledCardHeader, StyledCardBody, StyledCardFooter };


