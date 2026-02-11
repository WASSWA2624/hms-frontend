/**
 * UserSessionListScreen Android Styles
 * File: UserSessionListScreen.android.styles.jsx
 */
import styled from 'styled-components/native';

const StyledContainer = styled.View.withConfig({
  displayName: 'StyledContainer',
  componentId: 'StyledContainer',
})`
  flex: 1;
  width: 100%;
  min-height: 100%;
  background-color: ${({ theme }) => theme.colors.background.primary};
`;

const StyledContent = styled.View.withConfig({
  displayName: 'StyledContent',
  componentId: 'StyledContent',
})`
  width: 100%;
  flex: 1;
`;

const StyledList = styled.View.withConfig({
  displayName: 'StyledList',
  componentId: 'StyledList',
})`
  width: 100%;
`;

const StyledListBody = styled.View.withConfig({
  displayName: 'StyledListBody',
  componentId: 'StyledListBody',
})`
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md}px;
  width: 100%;
`;

const StyledStateStack = styled.View.withConfig({
  displayName: 'StyledStateStack',
  componentId: 'StyledStateStack',
})`
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm}px;
`;

export { StyledContainer, StyledContent, StyledList, StyledListBody, StyledStateStack };
