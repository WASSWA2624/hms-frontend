import styled from 'styled-components/native';

const StyledContainer = styled.View.withConfig({
  displayName: 'ClinicalResourceDetailScreen_StyledContainer',
  componentId: 'ClinicalResourceDetailScreen_StyledContainer',
})`
  flex: 1;
  width: 100%;
  background-color: ${({ theme }) => theme.colors.background.primary};
`;

const StyledContent = styled.View.withConfig({
  displayName: 'ClinicalResourceDetailScreen_StyledContent',
  componentId: 'ClinicalResourceDetailScreen_StyledContent',
})`
  flex: 1;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.lg}px;
`;

const StyledInlineStates = styled.View.withConfig({
  displayName: 'ClinicalResourceDetailScreen_StyledInlineStates',
  componentId: 'ClinicalResourceDetailScreen_StyledInlineStates',
})`
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm}px;
`;

const StyledDetailsGrid = styled.View.withConfig({
  displayName: 'ClinicalResourceDetailScreen_StyledDetailsGrid',
  componentId: 'ClinicalResourceDetailScreen_StyledDetailsGrid',
})`
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md}px;
`;

const StyledField = styled.View.withConfig({
  displayName: 'ClinicalResourceDetailScreen_StyledField',
  componentId: 'ClinicalResourceDetailScreen_StyledField',
})`
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs}px;
`;

const StyledFieldLabel = styled.Text.withConfig({
  displayName: 'ClinicalResourceDetailScreen_StyledFieldLabel',
  componentId: 'ClinicalResourceDetailScreen_StyledFieldLabel',
})`
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: ${({ theme }) => theme.typography.fontSize.xs}px;
`;

const StyledFieldValue = styled.Text.withConfig({
  displayName: 'ClinicalResourceDetailScreen_StyledFieldValue',
  componentId: 'ClinicalResourceDetailScreen_StyledFieldValue',
})`
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: ${({ theme }) => theme.typography.fontSize.sm}px;
`;

const StyledActions = styled.View.withConfig({
  displayName: 'ClinicalResourceDetailScreen_StyledActions',
  componentId: 'ClinicalResourceDetailScreen_StyledActions',
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

