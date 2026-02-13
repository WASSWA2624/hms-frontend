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
  StyledInlineStates,
};
