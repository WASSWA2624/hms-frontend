/**
 * UserRoleListScreen iOS Styles
 * File: UserRoleListScreen.ios.styles.jsx
 */
import { StyleSheet } from 'react-native';
import styled from 'styled-components/native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: 16,
    paddingHorizontal: 16,
  },
});

const StyledContainer = styled.View`
  flex: 1;
  background-color: ${({ theme }) => theme.colors.background.primary};
  padding-vertical: ${({ theme }) => theme.spacing.lg}px;
  padding-horizontal: ${({ theme }) => theme.spacing.lg}px;
`;

const StyledContent = styled.View`
  flex: 1;
  width: 100%;
`;

export { StyledContainer, StyledContent, styles };
