/**
 * UserProfileListScreen Web Styles
 * File: UserProfileListScreen.web.styles.jsx
 */
import styled from 'styled-components';

const StyledContainer = styled.main.withConfig({
  displayName: 'StyledContainer',
  componentId: 'StyledContainer',
})`
  flex: 1;
  width: 100%;
  min-height: 100vh;
  background-color: ${({ theme }) => theme.colors.background.primary};
  padding: ${({ theme }) => theme.spacing.xl}px;
`;

const StyledContent = styled.div.withConfig({
  displayName: 'StyledContent',
  componentId: 'StyledContent',
})`
  width: 100%;
  max-width: 800px;
  margin-left: auto;
  margin-right: auto;
`;

const StyledList = styled.ul.withConfig({
  displayName: 'StyledList',
  componentId: 'StyledList',
})`
  list-style: none;
  padding: 0;
  margin: 0;
  margin-top: ${({ theme }) => theme.spacing.lg}px;

  & > li {
    margin-bottom: ${({ theme }) => theme.spacing.md}px;
  }
`;

export { StyledContainer, StyledContent, StyledList };
