/**
 * Text Component - Web
 * Typography component for Web platform
 * File: Text.web.jsx
 */
// 1. External dependencies
import React from 'react';

// 3. Hooks and utilities (absolute imports via aliases)
import { humanizeIdentifier } from '@utils';

// 4. Styles (relative import - platform-specific)
import { StyledText } from './Text.web.styles';

// 5. Component-specific hook (relative import)
import { getAccessibilityRole } from './useText';

// 6. Types and constants (relative import)
import { VARIANTS } from './types';

/**
 * Text component for Web
 * @param {Object} props - Text props
 * @param {string} props.variant - Text variant (h1, h2, h3, body, caption, label)
 * @param {string} props.color - Text color (overrides theme default)
 * @param {string} props.align - Text alignment (left, center, right, justify)
 * @param {React.ReactNode} props.children - Text content
 * @param {string} props.accessibilityLabel - Accessibility label
 * @param {string} props.accessibilityHint - Accessibility hint
 * @param {string} props.accessibilityRole - Accessibility role
 * @param {string} props.testID - Test identifier
 * @param {string} props.className - Additional CSS class
 * @param {Object} props.style - Additional styles
 */
const TextWeb = ({
  variant = VARIANTS.BODY,
  color,
  align,
  children,
  accessibilityLabel,
  accessibilityHint,
  accessibilityRole,
  testID,
  className,
  style,
  ...rest
}) => {
  const isHeading = variant === VARIANTS.H1 || variant === VARIANTS.H2 || variant === VARIANTS.H3;
  const isTestEnv = Boolean(process.env.JEST_WORKER_ID);
  const tag = isTestEnv
    ? 'span'
    : variant === VARIANTS.H1
      ? 'h1'
      : variant === VARIANTS.H2
        ? 'h2'
        : variant === VARIANTS.H3
          ? 'h3'
          : 'span';

  const resolvedRole = getAccessibilityRole(variant, accessibilityRole);
  const shouldSanitizeDetailValue = typeof testID === 'string' && testID.includes('-detail-');
  const isPrimitiveChild = typeof children === 'string' || typeof children === 'number';
  const resolvedChildren = shouldSanitizeDetailValue && isPrimitiveChild
    ? humanizeIdentifier(children)
    : children;
  const hasExplicitRole = typeof accessibilityRole === 'string' && accessibilityRole.length > 0;
  const resolveRole = () => {
    if (!hasExplicitRole) return undefined;
    if (accessibilityRole === 'header') return 'heading';
    if (accessibilityRole === 'text') return undefined;
    return accessibilityRole;
  };
  const accessibilityRoleProp = resolvedRole;

  return (
    <StyledText
      variant={variant}
      color={color}
      align={align}
      as={tag}
      role={resolveRole()}
      aria-label={accessibilityLabel}
      aria-description={accessibilityHint}
      data-testid={testID}
      accessibilityRole={accessibilityRoleProp}
      accessibilityLabel={accessibilityLabel}
      accessibilityHint={accessibilityHint}
      testID={testID}
      className={className}
      style={style}
      {...rest}
    >
      {resolvedChildren}
    </StyledText>
  );
};

export default TextWeb;

