import styled from 'styled-components/native';

const StyledContainer = styled.View.withConfig({
  displayName: 'PatientResourceListScreen_StyledContainer',
  componentId: 'PatientResourceListScreen_StyledContainer',
})`
  flex: 1;
  width: 100%;
  background-color: ${({ theme }) => theme.colors.background.primary};
`;

const StyledContent = styled.View.withConfig({
  displayName: 'PatientResourceListScreen_StyledContent',
  componentId: 'PatientResourceListScreen_StyledContent',
})`
  flex: 1;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.lg}px;
`;

const StyledHeader = styled.View.withConfig({
  displayName: 'PatientResourceListScreen_StyledHeader',
  componentId: 'PatientResourceListScreen_StyledHeader',
})`
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs}px;
`;

const StyledHeaderTop = styled.View.withConfig({
  displayName: 'PatientResourceListScreen_StyledHeaderTop',
  componentId: 'PatientResourceListScreen_StyledHeaderTop',
})`
  flex-direction: row;
  justify-content: space-between;
  align-items: flex-start;
  gap: ${({ theme }) => theme.spacing.sm}px;
`;

const StyledHeaderCopy = styled.View.withConfig({
  displayName: 'PatientResourceListScreen_StyledHeaderCopy',
  componentId: 'PatientResourceListScreen_StyledHeaderCopy',
})`
  flex: 1;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs}px;
`;

const StyledHelpButton = styled.Pressable.withConfig({
  displayName: 'PatientResourceListScreen_StyledHelpButton',
  componentId: 'PatientResourceListScreen_StyledHelpButton',
})`
  min-height: 36px;
  min-width: 36px;
  border-radius: ${({ theme }) => theme.radius.full}px;
  border-width: 1px;
  border-color: ${({ theme }) => theme.colors.border.light};
  background-color: ${({ theme }) => theme.colors.background.secondary};
  align-items: center;
  justify-content: center;
`;

const StyledHelpButtonLabel = styled.Text.withConfig({
  displayName: 'PatientResourceListScreen_StyledHelpButtonLabel',
  componentId: 'PatientResourceListScreen_StyledHelpButtonLabel',
})`
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: ${({ theme }) => theme.typography.fontSize.md}px;
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
`;

const StyledHelpModalTitle = styled.Text.withConfig({
  displayName: 'PatientResourceListScreen_StyledHelpModalTitle',
  componentId: 'PatientResourceListScreen_StyledHelpModalTitle',
})`
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: ${({ theme }) => theme.typography.fontSize.md}px;
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
`;

const StyledHelpModalBody = styled.Text.withConfig({
  displayName: 'PatientResourceListScreen_StyledHelpModalBody',
  componentId: 'PatientResourceListScreen_StyledHelpModalBody',
})`
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: ${({ theme }) => theme.typography.fontSize.sm}px;
`;

const StyledHelpModalItem = styled.Text.withConfig({
  displayName: 'PatientResourceListScreen_StyledHelpModalItem',
  componentId: 'PatientResourceListScreen_StyledHelpModalItem',
})`
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: ${({ theme }) => theme.typography.fontSize.sm}px;
`;

const StyledToolbar = styled.View.withConfig({
  displayName: 'PatientResourceListScreen_StyledToolbar',
  componentId: 'PatientResourceListScreen_StyledToolbar',
})`
  flex-direction: column;
`;

const StyledToolbarActions = styled.View.withConfig({
  displayName: 'PatientResourceListScreen_StyledToolbarActions',
  componentId: 'PatientResourceListScreen_StyledToolbarActions',
})`
  flex-direction: row;
  justify-content: flex-end;
`;

const StyledAddButton = styled.Pressable.withConfig({
  displayName: 'PatientResourceListScreen_StyledAddButton',
  componentId: 'PatientResourceListScreen_StyledAddButton',
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
  displayName: 'PatientResourceListScreen_StyledAddLabel',
  componentId: 'PatientResourceListScreen_StyledAddLabel',
})`
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: ${({ theme }) => theme.typography.fontSize.xs}px;
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
`;

const StyledListBody = styled.View.withConfig({
  displayName: 'PatientResourceListScreen_StyledListBody',
  componentId: 'PatientResourceListScreen_StyledListBody',
})`
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md}px;
`;

const StyledStateStack = styled.View.withConfig({
  displayName: 'PatientResourceListScreen_StyledStateStack',
  componentId: 'PatientResourceListScreen_StyledStateStack',
})`
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm}px;
`;

const StyledList = styled.View.withConfig({
  displayName: 'PatientResourceListScreen_StyledList',
  componentId: 'PatientResourceListScreen_StyledList',
})`
  width: 100%;
`;

const StyledSeparator = styled.View.withConfig({
  displayName: 'PatientResourceListScreen_StyledSeparator',
  componentId: 'PatientResourceListScreen_StyledSeparator',
})`
  width: 100%;
  height: ${({ theme }) => theme.spacing.sm}px;
`;

export {
  StyledAddButton,
  StyledAddLabel,
  StyledContainer,
  StyledContent,
  StyledHeader,
  StyledHeaderCopy,
  StyledHeaderTop,
  StyledHelpButton,
  StyledHelpButtonLabel,
  StyledHelpModalBody,
  StyledHelpModalItem,
  StyledHelpModalTitle,
  StyledList,
  StyledListBody,
  StyledSeparator,
  StyledStateStack,
  StyledToolbar,
  StyledToolbarActions,
};
