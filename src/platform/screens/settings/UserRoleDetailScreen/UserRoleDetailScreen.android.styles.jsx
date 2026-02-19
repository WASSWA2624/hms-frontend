/**
 * UserRoleDetailScreen Android Styles
 * File: UserRoleDetailScreen.android.styles.jsx
 */
import styled from 'styled-components/native';

const StyledContainer = styled.View.withConfig({
  displayName: 'UserRoleDetailScreen_StyledContainer',
  componentId: 'UserRoleDetailScreen_StyledContainer',
})`
  flex: 1;
  width: 100%;
  min-height: 100%;
  background-color: ${({ theme }) => theme.colors.background.primary};
`;

const StyledContent = styled.View.withConfig({
  displayName: 'UserRoleDetailScreen_StyledContent',
  componentId: 'UserRoleDetailScreen_StyledContent',
})`
  flex: 1;
  width: 100%;
  gap: ${({ theme }) => theme.spacing.lg}px;
`;

const StyledInlineStates = styled.View.withConfig({
  displayName: 'UserRoleDetailScreen_StyledInlineStates',
  componentId: 'UserRoleDetailScreen_StyledInlineStates',
})`
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm}px;
`;

const StyledDetailGrid = styled.View.withConfig({
  displayName: 'UserRoleDetailScreen_StyledDetailGrid',
  componentId: 'UserRoleDetailScreen_StyledDetailGrid',
})`
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md}px;
`;

const StyledDetailItem = styled.View.withConfig({
  displayName: 'UserRoleDetailScreen_StyledDetailItem',
  componentId: 'UserRoleDetailScreen_StyledDetailItem',
})`
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs}px;
`;

const StyledActions = styled.View.withConfig({
  displayName: 'UserRoleDetailScreen_StyledActions',
  componentId: 'UserRoleDetailScreen_StyledActions',
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
