/**
 * Button Web Styles
 * Styled-components for Web platform
 * File: Button.web.styles.jsx
 */
import styled from 'styled-components';

const BUTTON_STYLE_PROPS = ['variant', 'state', 'hasIcon', 'size'];
const StyledButton = styled.button.withConfig({
  displayName: 'StyledButton',
  componentId: 'StyledButton',
  shouldForwardProp: (prop) => !BUTTON_STYLE_PROPS.includes(prop),
})`
  display: inline-flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  min-height: ${({ size, theme, variant }) => {
    const heights = {
      small: 44,
      medium: 48,
      large: 56,
    };
    const surfaceHeights = {
      small: 32,
      medium: 36,
      large: 40,
    };
    const resolved = variant === 'surface' ? surfaceHeights : heights;
    return resolved[size] || resolved.medium;
  }}px;
  padding-left: ${({ size, theme, variant }) => {
    const padding = {
      small: theme.spacing.md,
      medium: theme.spacing.lg,
      large: theme.spacing.xl,
    };
    const surfacePadding = {
      small: theme.spacing.sm,
      medium: theme.spacing.md,
      large: theme.spacing.lg,
    };
    const resolved = variant === 'surface' ? surfacePadding : padding;
    return resolved[size] || resolved.medium;
  }}px;
  padding-right: ${({ size, theme, variant }) => {
    const padding = {
      small: theme.spacing.md,
      medium: theme.spacing.lg,
      large: theme.spacing.xl,
    };
    const surfacePadding = {
      small: theme.spacing.sm,
      medium: theme.spacing.md,
      large: theme.spacing.lg,
    };
    const resolved = variant === 'surface' ? surfacePadding : padding;
    return resolved[size] || resolved.medium;
  }}px;
  padding-top: ${({ size, theme, variant }) => {
    const padding = {
      small: theme.spacing.sm,
      medium: theme.spacing.md,
      large: theme.spacing.lg,
    };
    const surfacePadding = {
      small: theme.spacing.xs,
      medium: theme.spacing.sm,
      large: theme.spacing.md,
    };
    const resolved = variant === 'surface' ? surfacePadding : padding;
    return resolved[size] || resolved.medium;
  }}px;
  padding-bottom: ${({ size, theme, variant }) => {
    const padding = {
      small: theme.spacing.sm,
      medium: theme.spacing.md,
      large: theme.spacing.lg,
    };
    const surfacePadding = {
      small: theme.spacing.xs,
      medium: theme.spacing.sm,
      large: theme.spacing.md,
    };
    const resolved = variant === 'surface' ? surfacePadding : padding;
    return resolved[size] || resolved.medium;
  }}px;
  border-radius: ${({ theme }) => theme.radius.sm}px;
  border-style: solid;
  background-color: ${({ variant, state, theme }) => {
    if (state === 'disabled') {
      return variant === 'text'
        ? 'transparent'
        : theme.colors.background.tertiary;
    }
    if (state === 'loading') {
      return variant === 'text' ? 'transparent' : theme.colors.primary;
    }
    if (variant === 'primary') {
      return state === 'active' || state === 'hover'
        ? theme.colors.primary
        : theme.colors.primary;
    }
    if (variant === 'secondary') {
      return state === 'active' || state === 'hover'
        ? theme.colors.secondary
        : theme.colors.secondary;
    }
    if (variant === 'outline') {
      return 'transparent';
    }
    if (variant === 'surface') {
      return state === 'active' || state === 'hover'
        ? theme.colors.background.tertiary
        : theme.colors.background.secondary;
    }
    return 'transparent';
  }};
  border-width: ${({ variant }) => (variant === 'outline' || variant === 'surface' ? 1 : 0)}px;
  border-color: ${({ variant, state, theme }) => {
    if (variant === 'outline') {
      if (state === 'disabled') return theme.colors.background.tertiary;
      return theme.colors.primary;
    }
    if (variant === 'surface') {
      return theme.colors.background.tertiary;
    }
    return 'transparent';
  }};
  opacity: ${({ state }) => (state === 'disabled' ? 0.5 : 1)};
  cursor: ${({ state }) => (state === 'disabled' ? 'not-allowed' : 'pointer')};
  user-select: none;
  position: relative;
  overflow: hidden;
  transform: translateY(0);
  transition:
    transform 120ms ease,
    box-shadow 120ms ease,
    filter 120ms ease,
    opacity 120ms ease,
    background-color 120ms ease;
  box-shadow: ${({ variant, state, theme }) => {
    if (state === 'disabled') return 'none';
    if (variant === 'text') return 'none';
    if (variant === 'outline') return `0 2px 0 ${theme.colors.background.tertiary}, 0 8px 16px rgba(10, 30, 70, 0.1)`;
    if (variant === 'surface') return `0 2px 0 ${theme.colors.background.tertiary}, 0 8px 18px rgba(10, 30, 70, 0.12)`;
    return '0 3px 0 rgba(8, 34, 74, 0.28), 0 12px 22px rgba(8, 34, 74, 0.22)';
  }};

  &::before {
    content: '';
    position: absolute;
    left: 1px;
    right: 1px;
    top: 1px;
    height: 42%;
    border-radius: inherit;
    pointer-events: none;
    opacity: ${({ variant, state }) => {
      if (state === 'disabled' || variant === 'text') return 0;
      return 0.28;
    }};
    background: linear-gradient(180deg, rgba(255, 255, 255, 0.45), rgba(255, 255, 255, 0));
  }

  &:hover {
    ${({ variant, state, theme }) => {
      if (state === 'disabled' || state === 'loading') return '';
      if (variant === 'primary') {
        return `background-color: ${theme.colors.primary}; opacity: 0.98; transform: translateY(-1px); box-shadow: 0 4px 0 rgba(8, 34, 74, 0.32), 0 16px 28px rgba(8, 34, 74, 0.24);`;
      }
      if (variant === 'secondary') {
        return `background-color: ${theme.colors.secondary}; opacity: 0.98; transform: translateY(-1px); box-shadow: 0 4px 0 rgba(8, 34, 74, 0.32), 0 16px 28px rgba(8, 34, 74, 0.24);`;
      }
      if (variant === 'outline') {
        return `border-color: ${theme.colors.primary}; background-color: ${theme.colors.background.secondary}; transform: translateY(-1px); box-shadow: 0 3px 0 ${theme.colors.background.tertiary}, 0 10px 18px rgba(10, 30, 70, 0.14);`;
      }
      if (variant === 'surface') {
        return `background-color: ${theme.colors.background.tertiary}; transform: translateY(-1px); box-shadow: 0 3px 0 ${theme.colors.background.tertiary}, 0 10px 18px rgba(10, 30, 70, 0.14);`;
      }
      if (variant === 'text') {
        return `background-color: ${theme.colors.background.secondary};`;
      }
      return '';
    }}
  }

  &:active {
    ${({ variant, state, theme }) => {
      if (state === 'disabled' || state === 'loading') return '';
      if (variant === 'primary') {
        return `background-color: ${theme.colors.primary}; opacity: 1; transform: translateY(2px); box-shadow: 0 1px 0 rgba(8, 34, 74, 0.24), 0 4px 10px rgba(8, 34, 74, 0.18);`;
      }
      if (variant === 'secondary') {
        return `background-color: ${theme.colors.secondary}; opacity: 1; transform: translateY(2px); box-shadow: 0 1px 0 rgba(8, 34, 74, 0.24), 0 4px 10px rgba(8, 34, 74, 0.18);`;
      }
      if (variant === 'outline') {
        return `border-color: ${theme.colors.primary}; background-color: ${theme.colors.background.tertiary}; transform: translateY(1px); box-shadow: 0 1px 0 ${theme.colors.background.tertiary}, 0 4px 10px rgba(10, 30, 70, 0.1);`;
      }
      if (variant === 'surface') {
        return `background-color: ${theme.colors.background.tertiary}; transform: translateY(1px); box-shadow: 0 1px 0 ${theme.colors.background.tertiary}, 0 4px 10px rgba(10, 30, 70, 0.1);`;
      }
      if (variant === 'text') {
        return `background-color: ${theme.colors.background.tertiary};`;
      }
      return '';
    }}
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.primary};
    outline-offset: 2px;
  }
`;

const StyledButtonText = styled.span.withConfig({
  displayName: 'StyledButtonText',
  componentId: 'StyledButtonText',
})`
  font-family: ${({ theme }) => theme.typography.fontFamily.regular};
  font-size: ${({ size, theme, variant }) => {
    if (variant === 'surface') {
      return theme.typography.fontSize.xs;
    }
    const sizes = {
      small: theme.typography.fontSize.sm,
      medium: theme.typography.fontSize.md,
      large: theme.typography.fontSize.lg,
    };
    return sizes[size] || sizes.medium;
  }}px;
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  line-height: ${({ size, theme, variant }) => {
    if (variant === 'surface') {
      return theme.typography.fontSize.xs * theme.typography.lineHeight.normal;
    }
    const lineHeights = {
      small: theme.typography.fontSize.sm * theme.typography.lineHeight.normal,
      medium: theme.typography.fontSize.md * theme.typography.lineHeight.normal,
      large: theme.typography.fontSize.lg * theme.typography.lineHeight.normal,
    };
    return lineHeights[size] || lineHeights.medium;
  }}px;
  color: ${({ variant, state, theme }) => {
    if (state === 'disabled') {
      return theme.colors.text.tertiary;
    }
    if (variant === 'primary' || variant === 'secondary') {
      return theme.colors.text.inverse;
    }
    if (variant === 'outline') {
      return state === 'active' || state === 'hover'
        ? theme.colors.primary
        : theme.colors.primary;
    }
    if (variant === 'surface') {
      return theme.colors.text.primary;
    }
    return theme.colors.primary;
  }};
  margin-left: ${({ hasIcon, theme }) => (hasIcon ? theme.spacing.xs : 0)}px;
`;

const StyledButtonContent = styled.span.withConfig({
  displayName: 'StyledButtonContent',
  componentId: 'StyledButtonContent',
})`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
`;

const SPINNER_STYLE_PROPS = ['size', 'variant', 'hasText'];
const StyledSpinner = styled.span.withConfig({
  displayName: 'StyledSpinner',
  componentId: 'StyledSpinner',
  shouldForwardProp: (prop) => !SPINNER_STYLE_PROPS.includes(prop),
})`
  display: inline-block;
  width: ${({ size, theme }) => {
    const sizes = {
      small: theme.spacing.sm,
      medium: theme.spacing.md,
      large: theme.spacing.lg,
    };
    return `${sizes[size] || sizes.medium}px`;
  }};
  height: ${({ size, theme }) => {
    const sizes = {
      small: theme.spacing.sm,
      medium: theme.spacing.md,
      large: theme.spacing.lg,
    };
    return `${sizes[size] || sizes.medium}px`;
  }};
  border: 2px solid ${({ theme }) => theme.colors.background.tertiary};
  border-top-color: ${({ variant, theme }) => {
    if (variant === 'primary' || variant === 'secondary') {
      return theme.colors.text.inverse;
    }
    if (variant === 'surface') {
      return theme.colors.text.primary;
    }
    return theme.colors.primary;
  }};
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
  margin-right: ${({ hasText, theme }) => (hasText ? theme.spacing.xs : 0)}px;

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`;

export { StyledButton, StyledButtonText, StyledButtonContent, StyledSpinner };

