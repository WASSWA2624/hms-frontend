/**
 * HamburgerIcon Styles - Android
 * File: HamburgerIcon/HamburgerIcon.android.styles.jsx
 */
import styled from 'styled-components/native';
import { View } from 'react-native';

const StyledHamburgerIcon = styled(View).withConfig({
  displayName: 'StyledHamburgerIcon',
  componentId: 'StyledHamburgerIcon',
})`
  width: 18px;
  height: 12px;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  gap: 3px;
`;

const StyledHamburgerLine = styled(View).withConfig({
  displayName: 'StyledHamburgerLine',
  componentId: 'StyledHamburgerLine',
})`
  height: 1.5px;
  width: 14px;
  background-color: ${({ theme }) => theme.colors.text.primary};
  border-radius: ${({ theme }) => theme.radius?.full ?? 9999}px;
`;

export { StyledHamburgerIcon, StyledHamburgerLine };
