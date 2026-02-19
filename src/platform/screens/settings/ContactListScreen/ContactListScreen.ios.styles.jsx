/**
 * ContactListScreen iOS Styles
 * File: ContactListScreen.ios.styles.jsx
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
  flex: 1;
  width: 100%;
`;

const StyledToolbar = styled.View.withConfig({
  displayName: 'StyledToolbar',
  componentId: 'StyledToolbar',
})`
  flex-direction: column;
  align-items: stretch;
  gap: ${({ theme }) => theme.spacing.sm}px;
`;

const StyledSearchSlot = styled.View.withConfig({
  displayName: 'StyledSearchSlot',
  componentId: 'StyledSearchSlot',
})`
  width: 100%;
`;

const StyledScopeSlot = styled.View.withConfig({
  displayName: 'StyledScopeSlot',
  componentId: 'StyledScopeSlot',
})`
  width: 100%;
`;

const StyledToolbarActions = styled.View.withConfig({
  displayName: 'StyledToolbarActions',
  componentId: 'StyledToolbarActions',
})`
  flex-direction: row;
  align-items: center;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing.sm}px;
`;

const StyledAddButton = styled.Pressable.withConfig({
  displayName: 'StyledAddButton',
  componentId: 'StyledAddButton',
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
  displayName: 'StyledAddLabel',
  componentId: 'StyledAddLabel',
})`
  font-family: ${({ theme }) => theme.typography.fontFamily.regular};
  font-size: ${({ theme }) => theme.typography.fontSize.xs}px;
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  color: ${({ theme }) => theme.colors.text.primary};
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

const StyledList = styled.View.withConfig({
  displayName: 'StyledList',
  componentId: 'StyledList',
})`
  width: 100%;
`;

const StyledPagination = styled.View.withConfig({
  displayName: 'StyledPagination',
  componentId: 'StyledPagination',
})`
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm}px;
  border-top-width: 1px;
  border-top-color: ${({ theme }) => theme.colors.border.light};
  padding-top: ${({ theme }) => theme.spacing.sm}px;
`;

const StyledPaginationInfo = styled.Text.withConfig({
  displayName: 'StyledPaginationInfo',
  componentId: 'StyledPaginationInfo',
})`
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: ${({ theme }) => theme.typography.fontSize.xs}px;
`;

const StyledPaginationActions = styled.View.withConfig({
  displayName: 'StyledPaginationActions',
  componentId: 'StyledPaginationActions',
})`
  flex-direction: row;
  align-items: center;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing.xs}px;
`;

const StyledPaginationControl = styled.View.withConfig({
  displayName: 'StyledPaginationControl',
  componentId: 'StyledPaginationControl',
})`
  flex-direction: row;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs}px;
`;

const StyledPaginationControlLabel = styled.Text.withConfig({
  displayName: 'StyledPaginationControlLabel',
  componentId: 'StyledPaginationControlLabel',
})`
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: ${({ theme }) => theme.typography.fontSize.xs}px;
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
`;

const StyledPaginationSelectSlot = styled.View.withConfig({
  displayName: 'StyledPaginationSelectSlot',
  componentId: 'StyledPaginationSelectSlot',
})`
  min-width: 86px;
`;

const StyledPaginationNavButton = styled.Pressable.withConfig({
  displayName: 'StyledPaginationNavButton',
  componentId: 'StyledPaginationNavButton',
})`
  min-width: 36px;
  min-height: 32px;
  align-items: center;
  justify-content: center;
  border-width: 1px;
  border-color: ${({ theme }) => theme.colors.border.light};
  border-radius: ${({ theme }) => theme.radius.sm}px;
  background-color: ${({ theme }) => theme.colors.background.secondary};
  opacity: ${({ disabled }) => (disabled ? 0.5 : 1)};
`;

const StyledPaginationNavLabel = styled.Text.withConfig({
  displayName: 'StyledPaginationNavLabel',
  componentId: 'StyledPaginationNavLabel',
})`
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: ${({ theme }) => theme.typography.fontSize.sm}px;
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
`;

export {
  StyledContainer,
  StyledContent,
  StyledToolbar,
  StyledSearchSlot,
  StyledScopeSlot,
  StyledToolbarActions,
  StyledAddButton,
  StyledAddLabel,
  StyledListBody,
  StyledStateStack,
  StyledList,
  StyledPagination,
  StyledPaginationInfo,
  StyledPaginationActions,
  StyledPaginationControl,
  StyledPaginationControlLabel,
  StyledPaginationSelectSlot,
  StyledPaginationNavButton,
  StyledPaginationNavLabel,
};
