import styled from 'styled-components/native';

const StyledContainer = styled.View.withConfig({
  displayName: 'SchedulingResourceListScreen_StyledContainer',
  componentId: 'SchedulingResourceListScreen_StyledContainer',
})`
  flex: 1;
  width: 100%;
  background-color: ${({ theme }) => theme.colors.background.primary};
`;

const StyledContent = styled.View.withConfig({
  displayName: 'SchedulingResourceListScreen_StyledContent',
  componentId: 'SchedulingResourceListScreen_StyledContent',
})`
  flex: 1;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.lg}px;
`;

const StyledToolbar = styled.View.withConfig({
  displayName: 'SchedulingResourceListScreen_StyledToolbar',
  componentId: 'SchedulingResourceListScreen_StyledToolbar',
})`
  flex-direction: column;
`;

const StyledToolbarActions = styled.View.withConfig({
  displayName: 'SchedulingResourceListScreen_StyledToolbarActions',
  componentId: 'SchedulingResourceListScreen_StyledToolbarActions',
})`
  flex-direction: row;
  justify-content: flex-end;
`;

const StyledAddButton = styled.Pressable.withConfig({
  displayName: 'SchedulingResourceListScreen_StyledAddButton',
  componentId: 'SchedulingResourceListScreen_StyledAddButton',
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
  displayName: 'SchedulingResourceListScreen_StyledAddLabel',
  componentId: 'SchedulingResourceListScreen_StyledAddLabel',
})`
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: ${({ theme }) => theme.typography.fontSize.xs}px;
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
`;

const StyledListBody = styled.View.withConfig({
  displayName: 'SchedulingResourceListScreen_StyledListBody',
  componentId: 'SchedulingResourceListScreen_StyledListBody',
})`
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md}px;
`;

const StyledStateStack = styled.View.withConfig({
  displayName: 'SchedulingResourceListScreen_StyledStateStack',
  componentId: 'SchedulingResourceListScreen_StyledStateStack',
})`
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm}px;
`;

const StyledList = styled.View.withConfig({
  displayName: 'SchedulingResourceListScreen_StyledList',
  componentId: 'SchedulingResourceListScreen_StyledList',
})`
  width: 100%;
`;

const StyledSeparator = styled.View.withConfig({
  displayName: 'SchedulingResourceListScreen_StyledSeparator',
  componentId: 'SchedulingResourceListScreen_StyledSeparator',
})`
  width: 100%;
  height: ${({ theme }) => theme.spacing.sm}px;
`;

export {
  StyledAddButton,
  StyledAddLabel,
  StyledContainer,
  StyledContent,
  StyledList,
  StyledListBody,
  StyledSeparator,
  StyledStateStack,
  StyledToolbar,
  StyledToolbarActions,
};

