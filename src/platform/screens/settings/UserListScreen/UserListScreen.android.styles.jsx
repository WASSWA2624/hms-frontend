/**
 * UserListScreen Android Styles
 * File: UserListScreen.android.styles.jsx
 */
import styled from 'styled-components/native';

const StyledContainer = styled.View.withConfig({
  displayName: 'UserListScreen_StyledContainer',
  componentId: 'UserListScreen_StyledContainer',
})`
  flex: 1;
  width: 100%;
  min-height: 100%;
  background-color: ${({ theme }) => theme.colors.background.primary};
`;

const StyledContent = styled.View.withConfig({
  displayName: 'UserListScreen_StyledContent',
  componentId: 'UserListScreen_StyledContent',
})`
  flex: 1;
  width: 100%;
`;

const StyledToolbar = styled.View.withConfig({
  displayName: 'UserListScreen_StyledToolbar',
  componentId: 'UserListScreen_StyledToolbar',
})`
  flex-direction: column;
  align-items: stretch;
  gap: ${({ theme }) => theme.spacing.sm}px;
`;

const StyledToolbarActions = styled.View.withConfig({
  displayName: 'UserListScreen_StyledToolbarActions',
  componentId: 'UserListScreen_StyledToolbarActions',
})`
  flex-direction: row;
  align-items: center;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing.sm}px;
`;

const StyledAddButton = styled.Pressable.withConfig({
  displayName: 'UserListScreen_StyledAddButton',
  componentId: 'UserListScreen_StyledAddButton',
})`
  flex-direction: row;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs}px;
  padding-vertical: ${({ theme }) => theme.spacing.xs}px;
  padding-horizontal: ${({ theme }) => theme.spacing.sm}px;
  border-radius: ${({ theme }) => theme.radius.sm}px;
  border-width: 1px;
  border-color: ${({ theme }) => theme.colors.background.tertiary};
  background-color: ${({ theme }) => theme.colors.background.secondary};
`;

const StyledAddLabel = styled.Text.withConfig({
  displayName: 'UserListScreen_StyledAddLabel',
  componentId: 'UserListScreen_StyledAddLabel',
})`
  font-family: ${({ theme }) => theme.typography.fontFamily.regular};
  font-size: ${({ theme }) => theme.typography.fontSize.xs}px;
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  color: ${({ theme }) => theme.colors.text.primary};
`;

const StyledListBody = styled.View.withConfig({
  displayName: 'UserListScreen_StyledListBody',
  componentId: 'UserListScreen_StyledListBody',
})`
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md}px;
  width: 100%;
`;

const StyledStateStack = styled.View.withConfig({
  displayName: 'UserListScreen_StyledStateStack',
  componentId: 'UserListScreen_StyledStateStack',
})`
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm}px;
`;

const StyledList = styled.View.withConfig({
  displayName: 'UserListScreen_StyledList',
  componentId: 'UserListScreen_StyledList',
})`
  width: 100%;
`;

const StyledSeparator = styled.View.withConfig({
  displayName: 'UserListScreen_StyledSeparator',
  componentId: 'UserListScreen_StyledSeparator',
})`
  width: 100%;
  height: ${({ theme }) => theme.spacing.sm}px;
`;

export {
  StyledContainer,
  StyledContent,
  StyledToolbar,
  StyledToolbarActions,
  StyledAddButton,
  StyledAddLabel,
  StyledListBody,
  StyledStateStack,
  StyledList,
  StyledSeparator,
};
