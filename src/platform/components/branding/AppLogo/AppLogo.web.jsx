/**
 * AppLogo Component - Web
 * Shared logo from public.
 * File: AppLogo.web.jsx
 */
import React from 'react';
import { StyledLogoImage } from './AppLogo.web.styles';
import useAppLogo from './useAppLogo';
import { SIZES } from './types';
import { PUBLIC_LOGO } from '@config/app-identity';

/**
 * @param {Object} props
 * @param {string} [props.size]
 * @param {string} [props.accessibilityLabel]
 * @param {string} [props.testID]
 * @param {string} [props.className]
 */
const AppLogoWeb = ({
  size = SIZES.MD,
  accessibilityLabel,
  testID,
  className,
}) => {
  const { width, height } = useAppLogo({ size });
  return (
    <StyledLogoImage
      src={PUBLIC_LOGO}
      alt={accessibilityLabel ?? ''}
      $width={width}
      $height={height}
      role="img"
      aria-label={accessibilityLabel ?? undefined}
      data-testid={testID}
      className={className}
    />
  );
};

export default AppLogoWeb;
