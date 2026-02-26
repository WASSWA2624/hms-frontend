import styled from 'styled-components/native';

const StyledContainer = styled.View.withConfig({
  displayName: 'ClinicalResourceListScreen_StyledContainer',
  componentId: 'ClinicalResourceListScreen_StyledContainer',
})`
  flex: 1;
  width: 100%;
  background-color: ${({ theme }) => theme.colors.background.primary};
`;

const StyledContent = styled.View.withConfig({
  displayName: 'ClinicalResourceListScreen_StyledContent',
  componentId: 'ClinicalResourceListScreen_StyledContent',
})`
  flex: 1;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.lg}px;
`;

const StyledToolbar = styled.View.withConfig({
  displayName: 'ClinicalResourceListScreen_StyledToolbar',
  componentId: 'ClinicalResourceListScreen_StyledToolbar',
})`
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm}px;
`;

const StyledToolbarActions = styled.View.withConfig({
  displayName: 'ClinicalResourceListScreen_StyledToolbarActions',
  componentId: 'ClinicalResourceListScreen_StyledToolbarActions',
})`
  flex-direction: row;
  justify-content: flex-end;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs}px;
  flex-wrap: wrap;
`;

const StyledAddButton = styled.Pressable.withConfig({
  displayName: 'ClinicalResourceListScreen_StyledAddButton',
  componentId: 'ClinicalResourceListScreen_StyledAddButton',
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
  displayName: 'ClinicalResourceListScreen_StyledAddLabel',
  componentId: 'ClinicalResourceListScreen_StyledAddLabel',
})`
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: ${({ theme }) => theme.typography.fontSize.xs}px;
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
`;

const StyledListBody = styled.View.withConfig({
  displayName: 'ClinicalResourceListScreen_StyledListBody',
  componentId: 'ClinicalResourceListScreen_StyledListBody',
})`
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md}px;
`;

const StyledStateStack = styled.View.withConfig({
  displayName: 'ClinicalResourceListScreen_StyledStateStack',
  componentId: 'ClinicalResourceListScreen_StyledStateStack',
})`
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm}px;
`;

const StyledList = styled.View.withConfig({
  displayName: 'ClinicalResourceListScreen_StyledList',
  componentId: 'ClinicalResourceListScreen_StyledList',
})`
  width: 100%;
`;

const StyledSeparator = styled.View.withConfig({
  displayName: 'ClinicalResourceListScreen_StyledSeparator',
  componentId: 'ClinicalResourceListScreen_StyledSeparator',
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

