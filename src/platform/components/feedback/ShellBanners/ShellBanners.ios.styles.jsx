/**
 * ShellBanners iOS Styles
 * Styled-components for iOS platform
 * File: ShellBanners.ios.styles.jsx
 */
import styled from 'styled-components/native';

const spacingMap = (spacing, theme) => theme.spacing?.[spacing] || theme.spacing.xs;

const StyledStack = styled.View.withConfig({
  displayName: 'StyledStack',
  componentId: 'StyledStack',
})`
  flex-direction: column;
`;

const StyledStackItem = styled.View.withConfig({
  displayName: 'StyledStackItem',
  componentId: 'StyledStackItem',
})`
  margin-bottom: ${({ isLast, spacing, theme }) => (isLast ? 0 : `${spacingMap(spacing, theme)}px`)};
`;

export { StyledStack, StyledStackItem };
