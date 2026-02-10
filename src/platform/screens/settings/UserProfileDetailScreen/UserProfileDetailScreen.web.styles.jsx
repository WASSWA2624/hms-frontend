/**
 * UserProfileDetailScreen Web Styles
 * File: UserProfileDetailScreen.web.styles.jsx
 */
import styled from 'styled-components';

const getTablet = (theme) => theme.breakpoints?.tablet ?? 768;

const StyledContainer = styled.main.withConfig({
  displayName: 'UserProfileDetailScreen_StyledContainer',
  componentId: 'UserProfileDetailScreen_StyledContainer',
})`
  display: flex;
  flex-direction: column;
  width: 100%;
  min-height: 100%;
  background-color: ${({ theme }) => theme.colors.background.primary};
  padding: 0;
  box-sizing: border-box;
`;

const StyledContent = styled.div.withConfig({
  displayName: 'UserProfileDetailScreen_StyledContent',
  componentId: 'UserProfileDetailScreen_StyledContent',
})`
  flex: 1;
  width: 100%;
  max-width: 100%;
  margin-left: auto;
  margin-right: auto;
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.lg}px;
`;

const StyledInlineStates = styled.div.withConfig({
  displayName: 'UserProfileDetailScreen_StyledInlineStates',
  componentId: 'UserProfileDetailScreen_StyledInlineStates',
})`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm}px;
`;

const StyledDetailGrid = styled.div.withConfig({
  displayName: 'UserProfileDetailScreen_StyledDetailGrid',
  componentId: 'UserProfileDetailScreen_StyledDetailGrid',
})`
  display: grid;
  grid-template-columns: 1fr;
  gap: ${({ theme }) => theme.spacing.md}px;

  @media (min-width: ${({ theme }) => getTablet(theme)}px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
`;

const StyledDetailItem = styled.div.withConfig({
  displayName: 'UserProfileDetailScreen_StyledDetailItem',
  componentId: 'UserProfileDetailScreen_StyledDetailItem',
})`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs}px;
`;

const StyledActions = styled.div.withConfig({
  displayName: 'UserProfileDetailScreen_StyledActions',
  componentId: 'UserProfileDetailScreen_StyledActions',
})`
  display: flex;
  gap: ${({ theme }) => theme.spacing.sm}px;
  flex-wrap: wrap;
`;

export {
  StyledContainer,
  StyledContent,
  StyledInlineStates,
  StyledDetailGrid,
  StyledDetailItem,
  StyledActions,
};
