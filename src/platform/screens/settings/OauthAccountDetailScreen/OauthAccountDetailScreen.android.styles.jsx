/**
 * OauthAccountDetailScreen Android Styles
 * File: OauthAccountDetailScreen.android.styles.jsx
 */
import styled from 'styled-components/native';

const StyledContainer = styled.View.withConfig({
  displayName: 'OauthAccountDetailScreen_StyledContainer',
  componentId: 'OauthAccountDetailScreen_StyledContainer',
})`
  flex: 1;
  width: 100%;
  min-height: 100%;
  background-color: ${({ theme }) => theme.colors.background.primary};
`;

const StyledContent = styled.View.withConfig({
  displayName: 'OauthAccountDetailScreen_StyledContent',
  componentId: 'OauthAccountDetailScreen_StyledContent',
})`
  flex: 1;
  width: 100%;
  gap: ${({ theme }) => theme.spacing.lg}px;
`;

const StyledInlineStates = styled.View.withConfig({
  displayName: 'OauthAccountDetailScreen_StyledInlineStates',
  componentId: 'OauthAccountDetailScreen_StyledInlineStates',
})`
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm}px;
`;

const StyledDetailGrid = styled.View.withConfig({
  displayName: 'OauthAccountDetailScreen_StyledDetailGrid',
  componentId: 'OauthAccountDetailScreen_StyledDetailGrid',
})`
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md}px;
`;

const StyledDetailItem = styled.View.withConfig({
  displayName: 'OauthAccountDetailScreen_StyledDetailItem',
  componentId: 'OauthAccountDetailScreen_StyledDetailItem',
})`
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs}px;
`;

const StyledActions = styled.View.withConfig({
  displayName: 'OauthAccountDetailScreen_StyledActions',
  componentId: 'OauthAccountDetailScreen_StyledActions',
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
