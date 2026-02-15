/**
 * AppLogo Component - Android
 * Shared logo from assets.
 * File: AppLogo.android.jsx
 */
import React from 'react';
import { StyledLogoImage } from './AppLogo.android.styles';
import useAppLogo from './useAppLogo';
import { SIZES } from './types';

const LOGO = require('../../../../../assets/logo.png');

/**
 * @param {Object} props
 * @param {string} [props.size]
 * @param {string} [props.accessibilityLabel]
 * @param {string} [props.testID]
 */
const AppLogoAndroid = ({
  size = SIZES.MD,
  accessibilityLabel,
  testID,
}) => {
  const { width, height } = useAppLogo({ size });
  return (
    <StyledLogoImage
      source={LOGO}
      resizeMode="contain"
      $width={width}
      $height={height}
      accessibilityLabel={accessibilityLabel}
      accessibilityRole="image"
      testID={testID}
    />
  );
};

export default AppLogoAndroid;
