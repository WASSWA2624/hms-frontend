/**
 * Brand - Web
 * Brand block for MainRouteLayout header (app name, logo)
 * File: Brand/Brand.web.jsx
 */

import React from 'react';
import { AppLogo, AppLogoSizes } from '@platform/components';
import {
  StyledBrand,
  StyledBrandName,
  StyledBrandShortName,
} from './Brand.web.styles';

export default function Brand({ appName, appShortName }) {
  return (
    <StyledBrand>
      <AppLogo size={AppLogoSizes.SM} accessibilityLabel={appName} />
      <StyledBrandName>{appName}</StyledBrandName>
      <StyledBrandShortName>{appShortName}</StyledBrandShortName>
    </StyledBrand>
  );
}
