import styled from 'styled-components';

const StyledContainer = styled.main.withConfig({
  displayName: 'PatientResourceDetailScreen_StyledContainer',
  componentId: 'PatientResourceDetailScreen_StyledContainer',
})`
  display: flex;
  flex-direction: column;
  width: 100%;
  min-height: 100%;
  background-color: ${({ theme }) => theme.colors.background.primary};
`;

const StyledContent = styled.div.withConfig({
  displayName: 'PatientResourceDetailScreen_StyledContent',
  componentId: 'PatientResourceDetailScreen_StyledContent',
})`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.lg}px;
`;

const StyledInlineStates = styled.div.withConfig({
  displayName: 'PatientResourceDetailScreen_StyledInlineStates',
  componentId: 'PatientResourceDetailScreen_StyledInlineStates',
})`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm}px;
`;

const StyledDetailsGrid = styled.div.withConfig({
  displayName: 'PatientResourceDetailScreen_StyledDetailsGrid',
  componentId: 'PatientResourceDetailScreen_StyledDetailsGrid',
})`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: ${({ theme }) => theme.spacing.md}px;

  @media (max-width: ${({ theme }) => theme.breakpoints?.tablet ?? 768}px) {
    grid-template-columns: 1fr;
  }
`;

const StyledField = styled.div.withConfig({
  displayName: 'PatientResourceDetailScreen_StyledField',
  componentId: 'PatientResourceDetailScreen_StyledField',
})`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs}px;
`;

const StyledFieldLabel = styled.p.withConfig({
  displayName: 'PatientResourceDetailScreen_StyledFieldLabel',
  componentId: 'PatientResourceDetailScreen_StyledFieldLabel',
})`
  margin: 0;
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: ${({ theme }) => theme.typography.fontSize.xs}px;
`;

const StyledFieldValue = styled.p.withConfig({
  displayName: 'PatientResourceDetailScreen_StyledFieldValue',
  componentId: 'PatientResourceDetailScreen_StyledFieldValue',
})`
  margin: 0;
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: ${({ theme }) => theme.typography.fontSize.sm}px;
`;

const StyledActions = styled.div.withConfig({
  displayName: 'PatientResourceDetailScreen_StyledActions',
  componentId: 'PatientResourceDetailScreen_StyledActions',
})`
  display: flex;
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
