/**
 * AuthLayout Web Styles
 * Styled-components for Web platform
 * File: AuthLayout.web.styles.jsx
 */

import styled from 'styled-components';
import Text from '@platform/components/display/Text';

const toRgba = (hexColor, opacity) => {
  if (typeof hexColor !== 'string' || !hexColor.startsWith('#')) {
    return hexColor;
  }

  const normalized = hexColor.slice(1);
  const expanded = normalized.length === 3
    ? normalized.split('').map((char) => `${char}${char}`).join('')
    : normalized;

  if (expanded.length !== 6) {
    return hexColor;
  }

  const red = Number.parseInt(expanded.slice(0, 2), 16);
  const green = Number.parseInt(expanded.slice(2, 4), 16);
  const blue = Number.parseInt(expanded.slice(4, 6), 16);
  return `rgba(${red}, ${green}, ${blue}, ${opacity})`;
};

const StyledContainer = styled.main
  .withConfig({
    displayName: 'StyledContainer',
    componentId: 'StyledContainer',
    shouldForwardProp: (prop) => prop !== 'testID',
  })
  .attrs(({ testID }) => ({
    'data-testid': testID,
  }))`
  height: 100dvh;
  min-height: 100dvh;
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  overflow-y: auto;
  overflow-x: hidden;
  scrollbar-gutter: stable;
  padding: ${({ theme }) => theme.spacing.md}px;
  background: linear-gradient(
    160deg,
    ${({ theme }) => theme.colors.background.secondary} 0%,
    ${({ theme }) => theme.colors.background.primary} 100%
  );
  box-sizing: border-box;

  @media (min-width: ${({ theme }) => theme.breakpoints.tablet}px) {
    padding: ${({ theme }) => theme.spacing.lg}px;
  }
`;

const StyledBanner = styled.div.withConfig({
  displayName: 'StyledBanner',
  componentId: 'StyledBanner',
})`
  width: 100%;
  max-width: ${({ theme }) => theme.spacing.xxl * 20}px;
  margin-bottom: ${({ theme }) => theme.spacing.md}px;
`;

const StyledCard = styled.div.withConfig({
  displayName: 'StyledCard',
  componentId: 'StyledCard',
})`
  width: 100%;
  max-width: ${({ theme }) => theme.spacing.xxl * 20}px;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md}px;
  padding: ${({ theme }) => theme.spacing.lg}px;
  border-radius: ${({ theme }) => theme.radius.lg}px;
  border: 1px solid ${({ theme }) => theme.colors.background.tertiary};
  background-color: ${({ theme }) => theme.colors.background.primary};
  box-shadow: ${({ theme }) => {
    const shadow = theme.shadows?.md;
    if (!shadow) return 'none';
    return `${shadow.shadowOffset?.width ?? 0}px ${shadow.shadowOffset?.height ?? 2}px ${(shadow.shadowRadius ?? 4) * 2}px ${toRgba(shadow.shadowColor, shadow.shadowOpacity ?? 0.15)}`;
  }};
  box-sizing: border-box;
`;

const StyledBranding = styled.section.withConfig({
  displayName: 'StyledBranding',
  componentId: 'StyledBranding',
  shouldForwardProp: (prop) => prop !== '$withScreenHeader',
})`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm}px;
  padding-bottom: ${({ theme }) => theme.spacing.sm}px;
  border-bottom: 1px solid ${({ theme }) => `${theme.colors.primary}33`};
  margin-bottom: ${({ theme, $withScreenHeader }) =>
    ($withScreenHeader ? theme.spacing.xs : theme.spacing.sm)}px;
`;

const StyledBrandHeader = styled.div.withConfig({
  displayName: 'StyledBrandHeader',
  componentId: 'StyledBrandHeader',
})`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  gap: ${({ theme }) => theme.spacing.sm}px;
  width: 100%;
`;

const StyledBrandLogoShell = styled.div.withConfig({
  displayName: 'StyledBrandLogoShell',
  componentId: 'StyledBrandLogoShell',
})`
  width: ${({ theme }) => theme.spacing.xxl + theme.spacing.xs}px;
  height: ${({ theme }) => theme.spacing.xxl + theme.spacing.xs}px;
  min-width: ${({ theme }) => theme.spacing.xxl + theme.spacing.xs}px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: ${({ theme }) => theme.radius.md}px;
  border: 1px solid ${({ theme }) => `${theme.colors.primary}66`};
  background-color: ${({ theme }) => theme.colors.background.secondary};
`;

const StyledBrandName = styled.div.withConfig({
  displayName: 'StyledBrandName',
  componentId: 'StyledBrandName',
})`
  display: flex;
  min-width: 0;
  flex: 1;

  span,
  h1,
  h2,
  h3 {
    margin: 0;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
`;

const StyledSupplementalBranding = styled.div.withConfig({
  displayName: 'StyledSupplementalBranding',
  componentId: 'StyledSupplementalBranding',
})`
  width: 100%;
`;

const StyledScreenHeader = styled.section.withConfig({
  displayName: 'StyledScreenHeader',
  componentId: 'StyledScreenHeader',
})`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs}px;
  padding: ${({ theme }) => theme.spacing.sm}px;
  border-radius: ${({ theme }) => theme.radius.sm}px;
  border: 1px solid ${({ theme }) => `${theme.colors.primary}33`};
  background-color: ${({ theme }) => theme.colors.background.secondary};
  box-sizing: border-box;
`;

const StyledScreenHeaderRow = styled.div.withConfig({
  displayName: 'StyledScreenHeaderRow',
  componentId: 'StyledScreenHeaderRow',
})`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing.xs}px;
`;

const StyledScreenHeaderCopy = styled.div.withConfig({
  displayName: 'StyledScreenHeaderCopy',
  componentId: 'StyledScreenHeaderCopy',
})`
  flex: 1;
  min-width: 0;
`;

const StyledScreenHeaderTitle = styled.div.withConfig({
  displayName: 'StyledScreenHeaderTitle',
  componentId: 'StyledScreenHeaderTitle',
})`
  width: 100%;
`;

const StyledScreenHeaderTitleText = styled(Text).attrs({
  variant: 'label',
  color: 'primary',
})`
  text-transform: uppercase;
  letter-spacing: ${({ theme }) => theme.spacing.xs / 4}px;
`;

const StyledScreenHeaderSubtitle = styled.div.withConfig({
  displayName: 'StyledScreenHeaderSubtitle',
  componentId: 'StyledScreenHeaderSubtitle',
})`
  width: 100%;
`;

const StyledScreenHeaderSubtitleText = styled(Text).attrs({
  variant: 'body',
  color: 'text.secondary',
})``;

const StyledContent = styled.div.withConfig({
  displayName: 'StyledContent',
  componentId: 'StyledContent',
})`
  width: 100%;
  min-width: 0;
  overflow-x: hidden;
`;

const StyledHelpLinks = styled.div.withConfig({
  displayName: 'StyledHelpLinks',
  componentId: 'StyledHelpLinks',
})`
  margin-top: ${({ theme }) => theme.spacing.xs}px;
  display: flex;
  align-items: center;
`;

export {
  StyledBanner,
  StyledContainer,
  StyledCard,
  StyledBrandHeader,
  StyledBrandLogoShell,
  StyledBrandName,
  StyledBranding,
  StyledSupplementalBranding,
  StyledContent,
  StyledHelpLinks,
  StyledScreenHeader,
  StyledScreenHeaderRow,
  StyledScreenHeaderCopy,
  StyledScreenHeaderTitle,
  StyledScreenHeaderTitleText,
  StyledScreenHeaderSubtitle,
  StyledScreenHeaderSubtitleText,
};
