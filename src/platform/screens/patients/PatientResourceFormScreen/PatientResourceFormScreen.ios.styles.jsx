import styled from 'styled-components/native';

const StyledContainer = styled.View.withConfig({
  displayName: 'PatientResourceFormScreen_StyledContainer',
  componentId: 'PatientResourceFormScreen_StyledContainer',
})`
  flex: 1;
  width: 100%;
  background-color: ${({ theme }) => theme.colors.background.primary};
`;

const StyledContent = styled.View.withConfig({
  displayName: 'PatientResourceFormScreen_StyledContent',
  componentId: 'PatientResourceFormScreen_StyledContent',
})`
  flex: 1;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.lg}px;
`;

const StyledHeader = styled.View.withConfig({
  displayName: 'PatientResourceFormScreen_StyledHeader',
  componentId: 'PatientResourceFormScreen_StyledHeader',
})`
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs}px;
`;

const StyledHeaderTop = styled.View.withConfig({
  displayName: 'PatientResourceFormScreen_StyledHeaderTop',
  componentId: 'PatientResourceFormScreen_StyledHeaderTop',
})`
  flex-direction: row;
  justify-content: space-between;
  align-items: flex-start;
  gap: ${({ theme }) => theme.spacing.sm}px;
`;

const StyledHeaderCopy = styled.View.withConfig({
  displayName: 'PatientResourceFormScreen_StyledHeaderCopy',
  componentId: 'PatientResourceFormScreen_StyledHeaderCopy',
})`
  flex: 1;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs}px;
`;

const StyledHelpButton = styled.Pressable.withConfig({
  displayName: 'PatientResourceFormScreen_StyledHelpButton',
  componentId: 'PatientResourceFormScreen_StyledHelpButton',
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
  displayName: 'PatientResourceFormScreen_StyledHelpButtonLabel',
  componentId: 'PatientResourceFormScreen_StyledHelpButtonLabel',
})`
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: ${({ theme }) => theme.typography.fontSize.md}px;
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
`;

const StyledHelpModalTitle = styled.Text.withConfig({
  displayName: 'PatientResourceFormScreen_StyledHelpModalTitle',
  componentId: 'PatientResourceFormScreen_StyledHelpModalTitle',
})`
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: ${({ theme }) => theme.typography.fontSize.md}px;
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
`;

const StyledHelpModalBody = styled.Text.withConfig({
  displayName: 'PatientResourceFormScreen_StyledHelpModalBody',
  componentId: 'PatientResourceFormScreen_StyledHelpModalBody',
})`
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: ${({ theme }) => theme.typography.fontSize.sm}px;
`;

const StyledHelpModalItem = styled.Text.withConfig({
  displayName: 'PatientResourceFormScreen_StyledHelpModalItem',
  componentId: 'PatientResourceFormScreen_StyledHelpModalItem',
})`
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: ${({ theme }) => theme.typography.fontSize.sm}px;
`;

const StyledInlineStates = styled.View.withConfig({
  displayName: 'PatientResourceFormScreen_StyledInlineStates',
  componentId: 'PatientResourceFormScreen_StyledInlineStates',
})`
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm}px;
`;

const StyledFormGrid = styled.View.withConfig({
  displayName: 'PatientResourceFormScreen_StyledFormGrid',
  componentId: 'PatientResourceFormScreen_StyledFormGrid',
})`
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md}px;
`;

const StyledFieldGroup = styled.View.withConfig({
  displayName: 'PatientResourceFormScreen_StyledFieldGroup',
  componentId: 'PatientResourceFormScreen_StyledFieldGroup',
})`
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs}px;
`;

const StyledFullRow = styled.View.withConfig({
  displayName: 'PatientResourceFormScreen_StyledFullRow',
  componentId: 'PatientResourceFormScreen_StyledFullRow',
})`
  width: 100%;
`;

const StyledHelperStack = styled.View.withConfig({
  displayName: 'PatientResourceFormScreen_StyledHelperStack',
  componentId: 'PatientResourceFormScreen_StyledHelperStack',
})`
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm}px;
`;

const StyledActions = styled.View.withConfig({
  displayName: 'PatientResourceFormScreen_StyledActions',
  componentId: 'PatientResourceFormScreen_StyledActions',
})`
  flex-direction: row;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing.sm}px;
`;

export {
  StyledActions,
  StyledContainer,
  StyledContent,
  StyledFieldGroup,
  StyledFormGrid,
  StyledFullRow,
  StyledHeader,
  StyledHeaderCopy,
  StyledHeaderTop,
  StyledHelperStack,
  StyledHelpButton,
  StyledHelpButtonLabel,
  StyledHelpModalBody,
  StyledHelpModalItem,
  StyledHelpModalTitle,
  StyledInlineStates,
};
