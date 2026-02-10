/**
 * UserProfileDetailScreen iOS Styles
 * File: UserProfileDetailScreen.ios.styles.jsx
 */
import styled from 'styled-components/native';

const StyledContainer = styled.View.withConfig({
  displayName: 'UserProfileDetailScreen_StyledContainer',
  componentId: 'UserProfileDetailScreen_StyledContainer',
})`
  flex: 1;
  width: 100%;
  min-height: 100%;
  background-color: ${({ theme }) => theme.colors.background.primary};
`;

const StyledContent = styled.View.withConfig({
  displayName: 'UserProfileDetailScreen_StyledContent',
  componentId: 'UserProfileDetailScreen_StyledContent',
})`
  flex: 1;
  width: 100%;
  gap: ${({ theme }) => theme.spacing.lg}px;
`;

const StyledInlineStates = styled.View.withConfig({
  displayName: 'UserProfileDetailScreen_StyledInlineStates',
  componentId: 'UserProfileDetailScreen_StyledInlineStates',
})`
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm}px;
`;

const StyledDetailGrid = styled.View.withConfig({
  displayName: 'UserProfileDetailScreen_StyledDetailGrid',
  componentId: 'UserProfileDetailScreen_StyledDetailGrid',
})`
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md}px;
`;

const StyledDetailItem = styled.View.withConfig({
  displayName: 'UserProfileDetailScreen_StyledDetailItem',
  componentId: 'UserProfileDetailScreen_StyledDetailItem',
})`
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs}px;
`;

const StyledActions = styled.View.withConfig({
  displayName: 'UserProfileDetailScreen_StyledActions',
  componentId: 'UserProfileDetailScreen_StyledActions',
})`
  flex-direction: row;
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
