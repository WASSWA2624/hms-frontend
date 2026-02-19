import styled from 'styled-components/native';

const StyledContainer = styled.View.withConfig({
  displayName: 'PatientResourceDetailScreen_StyledContainer',
  componentId: 'PatientResourceDetailScreen_StyledContainer',
})`
  flex: 1;
  width: 100%;
  background-color: ${({ theme }) => theme.colors.background.primary};
`;

const StyledContent = styled.View.withConfig({
  displayName: 'PatientResourceDetailScreen_StyledContent',
  componentId: 'PatientResourceDetailScreen_StyledContent',
})`
  flex: 1;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.lg}px;
`;

const StyledHeader = styled.View.withConfig({
  displayName: 'PatientResourceDetailScreen_StyledHeader',
  componentId: 'PatientResourceDetailScreen_StyledHeader',
})`
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs}px;
`;

const StyledHeaderTop = styled.View.withConfig({
  displayName: 'PatientResourceDetailScreen_StyledHeaderTop',
  componentId: 'PatientResourceDetailScreen_StyledHeaderTop',
})`
  flex-direction: row;
  justify-content: space-between;
  align-items: flex-start;
  gap: ${({ theme }) => theme.spacing.sm}px;
`;

const StyledHeaderCopy = styled.View.withConfig({
  displayName: 'PatientResourceDetailScreen_StyledHeaderCopy',
  componentId: 'PatientResourceDetailScreen_StyledHeaderCopy',
})`
  flex: 1;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs}px;
`;

const StyledHelpButton = styled.Pressable.withConfig({
  displayName: 'PatientResourceDetailScreen_StyledHelpButton',
  componentId: 'PatientResourceDetailScreen_StyledHelpButton',
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
  displayName: 'PatientResourceDetailScreen_StyledHelpButtonLabel',
  componentId: 'PatientResourceDetailScreen_StyledHelpButtonLabel',
})`
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: ${({ theme }) => theme.typography.fontSize.md}px;
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
`;

const StyledHelpModalTitle = styled.Text.withConfig({
  displayName: 'PatientResourceDetailScreen_StyledHelpModalTitle',
  componentId: 'PatientResourceDetailScreen_StyledHelpModalTitle',
})`
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: ${({ theme }) => theme.typography.fontSize.md}px;
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
`;

const StyledHelpModalBody = styled.Text.withConfig({
  displayName: 'PatientResourceDetailScreen_StyledHelpModalBody',
  componentId: 'PatientResourceDetailScreen_StyledHelpModalBody',
})`
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: ${({ theme }) => theme.typography.fontSize.sm}px;
`;

const StyledHelpModalItem = styled.Text.withConfig({
  displayName: 'PatientResourceDetailScreen_StyledHelpModalItem',
  componentId: 'PatientResourceDetailScreen_StyledHelpModalItem',
})`
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: ${({ theme }) => theme.typography.fontSize.sm}px;
`;

const StyledInlineStates = styled.View.withConfig({
  displayName: 'PatientResourceDetailScreen_StyledInlineStates',
  componentId: 'PatientResourceDetailScreen_StyledInlineStates',
})`
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm}px;
`;

const StyledDetailsGrid = styled.View.withConfig({
  displayName: 'PatientResourceDetailScreen_StyledDetailsGrid',
  componentId: 'PatientResourceDetailScreen_StyledDetailsGrid',
})`
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md}px;
`;

const StyledField = styled.View.withConfig({
  displayName: 'PatientResourceDetailScreen_StyledField',
  componentId: 'PatientResourceDetailScreen_StyledField',
})`
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs}px;
`;

const StyledFieldLabel = styled.Text.withConfig({
  displayName: 'PatientResourceDetailScreen_StyledFieldLabel',
  componentId: 'PatientResourceDetailScreen_StyledFieldLabel',
})`
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: ${({ theme }) => theme.typography.fontSize.xs}px;
`;

const StyledFieldValue = styled.Text.withConfig({
  displayName: 'PatientResourceDetailScreen_StyledFieldValue',
  componentId: 'PatientResourceDetailScreen_StyledFieldValue',
})`
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: ${({ theme }) => theme.typography.fontSize.sm}px;
`;

const StyledActions = styled.View.withConfig({
  displayName: 'PatientResourceDetailScreen_StyledActions',
  componentId: 'PatientResourceDetailScreen_StyledActions',
})`
  flex-direction: row;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing.sm}px;
`;

export {
  StyledActions,
  StyledContainer,
  StyledContent,
  StyledDetailsGrid,
  StyledField,
  StyledFieldLabel,
  StyledFieldValue,
  StyledHeader,
  StyledHeaderCopy,
  StyledHeaderTop,
  StyledHelpButton,
  StyledHelpButtonLabel,
  StyledHelpModalBody,
  StyledHelpModalItem,
  StyledHelpModalTitle,
  StyledInlineStates,
};
