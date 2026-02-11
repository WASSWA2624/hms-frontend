/**
 * UserMfaDetailScreen Android Styles
 * File: UserMfaDetailScreen.android.styles.jsx
 */
import styled from 'styled-components/native';

const StyledContainer = styled.View.withConfig({
  displayName: 'UserMfaDetailScreen_StyledContainer',
  componentId: 'UserMfaDetailScreen_StyledContainer',
})`
  flex: 1;
  width: 100%;
  min-height: 100%;
  background-color: ${({ theme }) => theme.colors.background.primary};
`;

const StyledContent = styled.View.withConfig({
  displayName: 'UserMfaDetailScreen_StyledContent',
  componentId: 'UserMfaDetailScreen_StyledContent',
})`
  flex: 1;
  width: 100%;
  gap: ${({ theme }) => theme.spacing.lg}px;
`;

const StyledInlineStates = styled.View.withConfig({
  displayName: 'UserMfaDetailScreen_StyledInlineStates',
  componentId: 'UserMfaDetailScreen_StyledInlineStates',
})`
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm}px;
`;

const StyledDetailGrid = styled.View.withConfig({
  displayName: 'UserMfaDetailScreen_StyledDetailGrid',
  componentId: 'UserMfaDetailScreen_StyledDetailGrid',
})`
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md}px;
`;

const StyledDetailItem = styled.View.withConfig({
  displayName: 'UserMfaDetailScreen_StyledDetailItem',
  componentId: 'UserMfaDetailScreen_StyledDetailItem',
})`
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs}px;
`;

const StyledActions = styled.View.withConfig({
  displayName: 'UserMfaDetailScreen_StyledActions',
  componentId: 'UserMfaDetailScreen_StyledActions',
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
