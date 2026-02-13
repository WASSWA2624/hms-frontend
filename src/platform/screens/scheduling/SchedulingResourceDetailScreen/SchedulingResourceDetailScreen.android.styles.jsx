import styled from 'styled-components/native';

const StyledContainer = styled.View.withConfig({
  displayName: 'SchedulingResourceDetailScreen_StyledContainer',
  componentId: 'SchedulingResourceDetailScreen_StyledContainer',
})`
  flex: 1;
  width: 100%;
  background-color: ${({ theme }) => theme.colors.background.primary};
`;

const StyledContent = styled.View.withConfig({
  displayName: 'SchedulingResourceDetailScreen_StyledContent',
  componentId: 'SchedulingResourceDetailScreen_StyledContent',
})`
  flex: 1;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.lg}px;
`;

const StyledInlineStates = styled.View.withConfig({
  displayName: 'SchedulingResourceDetailScreen_StyledInlineStates',
  componentId: 'SchedulingResourceDetailScreen_StyledInlineStates',
})`
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm}px;
`;

const StyledDetailsGrid = styled.View.withConfig({
  displayName: 'SchedulingResourceDetailScreen_StyledDetailsGrid',
  componentId: 'SchedulingResourceDetailScreen_StyledDetailsGrid',
})`
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md}px;
`;

const StyledField = styled.View.withConfig({
  displayName: 'SchedulingResourceDetailScreen_StyledField',
  componentId: 'SchedulingResourceDetailScreen_StyledField',
})`
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs}px;
`;

const StyledFieldLabel = styled.Text.withConfig({
  displayName: 'SchedulingResourceDetailScreen_StyledFieldLabel',
  componentId: 'SchedulingResourceDetailScreen_StyledFieldLabel',
})`
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: ${({ theme }) => theme.typography.fontSize.xs}px;
`;

const StyledFieldValue = styled.Text.withConfig({
  displayName: 'SchedulingResourceDetailScreen_StyledFieldValue',
  componentId: 'SchedulingResourceDetailScreen_StyledFieldValue',
})`
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: ${({ theme }) => theme.typography.fontSize.sm}px;
`;

const StyledActions = styled.View.withConfig({
  displayName: 'SchedulingResourceDetailScreen_StyledActions',
  componentId: 'SchedulingResourceDetailScreen_StyledActions',
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

