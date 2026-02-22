/**
 * SystemBanner Web Styles
 * Styled-components for Web platform
 * File: SystemBanner.web.styles.jsx
 */
import styled from 'styled-components';
import { BANNER_VARIANTS } from '@utils/shellBanners';

const getVariantColors = (variant, theme) => {
  const colors = theme?.colors || {};
  const surface = colors.background?.secondary || '#F5F5F7';
  const textPrimary = colors.text?.primary || colors.textPrimary || '#1f2937';
  const inverse = colors.onPrimary || colors.text?.inverse || '#FFFFFF';
  const maintenance = colors.status?.error || {
    background: colors.error || '#FFEBEE',
    text: '#C62828',
  };

  if (variant === BANNER_VARIANTS.MAINTENANCE) {
    return {
      background: maintenance.background,
      text: maintenance.text,
      border: 'rgba(198, 40, 40, 0.28)',
      accent: null,
      sheen: 'rgba(255, 255, 255, 0.35)',
      glow: 'rgba(198, 40, 40, 0.18)',
    };
  }
  if (variant === BANNER_VARIANTS.LOW_QUALITY || variant === BANNER_VARIANTS.OFFLINE) {
    return {
      background: surface,
      text: textPrimary,
      border: 'rgba(255, 149, 0, 0.25)',
      accent: colors.warning || '#FF9500',
      sheen: 'rgba(255, 255, 255, 0.75)',
      glow: 'rgba(255, 149, 0, 0.12)',
    };
  }
  if (variant === BANNER_VARIANTS.ONLINE) {
    return {
      background: colors.success || '#34C759',
      text: inverse,
      border: 'rgba(255, 255, 255, 0.25)',
      accent: null,
      sheen: 'rgba(255, 255, 255, 0.3)',
      glow: 'rgba(52, 199, 89, 0.22)',
    };
  }
  return {
    background: colors.primary || '#0078D4',
    text: inverse,
    border: 'rgba(255, 255, 255, 0.22)',
    accent: null,
    sheen: 'rgba(255, 255, 255, 0.28)',
    glow: 'rgba(0, 120, 212, 0.22)',
  };
};

const StyledBanner = styled.div.withConfig({
  displayName: 'StyledBanner',
  componentId: 'StyledBanner',
})`
  width: 100%;
  max-width: 100%;
  box-sizing: border-box;
  position: relative;
  overflow: hidden;
  border: 1px solid ${({ variant, theme }) => getVariantColors(variant, theme).border};
  ${({ variant, theme }) => {
    const { accent } = getVariantColors(variant, theme);
    return accent ? `border-left: 6px solid ${accent};` : '';
  }}
  border-radius: ${({ theme }) => theme.radius.xl ?? theme.radius.lg}px;
  background-color: ${({ variant, theme }) => getVariantColors(variant, theme).background};
  background-image:
    linear-gradient(
      135deg,
      ${({ variant, theme }) => getVariantColors(variant, theme).sheen} 0%,
      rgba(255, 255, 255, 0.08) 45%,
      rgba(255, 255, 255, 0) 70%
    ),
    radial-gradient(
      140% 180% at 100% 0%,
      rgba(255, 255, 255, 0.35) 0%,
      rgba(255, 255, 255, 0) 60%
    );
  color: ${({ variant, theme }) => getVariantColors(variant, theme).text};
  padding: ${({ theme }) => theme.spacing.md}px ${({ theme }) => theme.spacing.lg}px;
  min-height: ${({ theme }) => theme.spacing.xl + theme.spacing.sm}px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing.md}px;
  box-shadow:
    0 14px 28px rgba(0, 0, 0, 0.12),
    0 6px 12px ${({ variant, theme }) => getVariantColors(variant, theme).glow},
    inset 0 1px 0 rgba(255, 255, 255, 0.5),
    inset 0 -3px 6px rgba(0, 0, 0, 0.08);
  transform: translateZ(0);
  transition: transform 0.2s ease, box-shadow 0.2s ease;

  &::after {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: inherit;
    box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.28);
    pointer-events: none;
  }

  @media (hover: hover) {
    &:hover {
      transform: translateY(-1px);
      box-shadow:
        0 18px 34px rgba(0, 0, 0, 0.16),
        0 8px 16px ${({ variant, theme }) => getVariantColors(variant, theme).glow},
        inset 0 1px 0 rgba(255, 255, 255, 0.6),
        inset 0 -3px 8px rgba(0, 0, 0, 0.1);
    }
  }
`;

const StyledContent = styled.div.withConfig({
  displayName: 'StyledContent',
  componentId: 'StyledContent',
})`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs}px;
  flex: 1;
  min-width: 0;
`;

const StyledTitle = styled.div.withConfig({
  displayName: 'StyledTitle',
  componentId: 'StyledTitle',
})`
  font-family: ${({ theme }) => theme.typography.fontFamily.medium};
  font-size: ${({ theme }) => theme.typography.fontSize.md}px;
  font-weight: ${({ theme }) => theme.typography.fontWeight.semiBold};
  letter-spacing: 0.01em;
`;

const StyledMessage = styled.div.withConfig({
  displayName: 'StyledMessage',
  componentId: 'StyledMessage',
})`
  font-family: ${({ theme }) => theme.typography.fontFamily.regular};
  font-size: ${({ theme }) => theme.typography.fontSize.sm}px;
  font-weight: ${({ theme }) => theme.typography.fontWeight.regular};
  line-height: 1.4;
`;

const StyledActions = styled.div.withConfig({
  displayName: 'StyledActions',
  componentId: 'StyledActions',
})`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm}px;
  margin-left: auto;
`;

const StyledActionButton = styled.button.withConfig({
  displayName: 'StyledActionButton',
  componentId: 'StyledActionButton',
})`
  background: rgba(255, 255, 255, 0.18);
  border: 1px solid rgba(255, 255, 255, 0.4);
  color: inherit;
  border-radius: ${({ theme }) => theme.radius.full}px;
  padding: ${({ theme }) => theme.spacing.xs}px ${({ theme }) => theme.spacing.md}px;
  font-family: ${({ theme }) => theme.typography.fontFamily.medium};
  font-size: ${({ theme }) => theme.typography.fontSize.sm}px;
  cursor: pointer;
  min-height: ${({ theme }) => theme.spacing.xl}px;
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.5),
    0 2px 6px rgba(0, 0, 0, 0.15);
  transition: transform 0.15s ease, box-shadow 0.15s ease, background-color 0.15s ease;

  &:hover {
    transform: translateY(-1px);
    background: rgba(255, 255, 255, 0.28);
    box-shadow:
      inset 0 1px 0 rgba(255, 255, 255, 0.6),
      0 4px 10px rgba(0, 0, 0, 0.18);
  }

  &:active {
    transform: translateY(0);
    box-shadow:
      inset 0 1px 0 rgba(255, 255, 255, 0.4),
      0 2px 6px rgba(0, 0, 0, 0.14);
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.primary};
    outline-offset: 2px;
  }
`;

const StyledDismissButton = styled.button.withConfig({
  displayName: 'StyledDismissButton',
  componentId: 'StyledDismissButton',
})`
  background: transparent;
  border: none;
  color: inherit;
  font-family: ${({ theme }) => theme.typography.fontFamily.medium};
  font-size: ${({ theme }) => theme.typography.fontSize.sm}px;
  cursor: pointer;
  min-height: ${({ theme }) => theme.spacing.xl}px;
  opacity: 0.85;

  &:hover {
    opacity: 1;
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.primary};
    outline-offset: 2px;
  }
`;

export {
  StyledActions,
  StyledActionButton,
  StyledBanner,
  StyledContent,
  StyledDismissButton,
  StyledMessage,
  StyledTitle,
};
