import styled from 'styled-components';

const StyledContainer = styled.main.withConfig({
  displayName: 'SchedulingResourceDetailScreen_StyledContainer',
  componentId: 'SchedulingResourceDetailScreen_StyledContainer',
})`
  display: flex;
  flex-direction: column;
  width: 100%;
  min-height: 100%;
  background-color: ${({ theme }) => theme.colors.background.primary};
`;

const StyledContent = styled.div.withConfig({
  displayName: 'SchedulingResourceDetailScreen_StyledContent',
  componentId: 'SchedulingResourceDetailScreen_StyledContent',
})`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.lg}px;
`;

const StyledInlineStates = styled.div.withConfig({
  displayName: 'SchedulingResourceDetailScreen_StyledInlineStates',
  componentId: 'SchedulingResourceDetailScreen_StyledInlineStates',
})`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm}px;
`;

const StyledDetailsGrid = styled.div.withConfig({
  displayName: 'SchedulingResourceDetailScreen_StyledDetailsGrid',
  componentId: 'SchedulingResourceDetailScreen_StyledDetailsGrid',
})`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: ${({ theme }) => theme.spacing.md}px;

  @media (max-width: ${({ theme }) => theme.breakpoints?.tablet ?? 768}px) {
    grid-template-columns: 1fr;
  }
`;

const StyledField = styled.div.withConfig({
  displayName: 'SchedulingResourceDetailScreen_StyledField',
  componentId: 'SchedulingResourceDetailScreen_StyledField',
})`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs}px;
`;

const StyledFieldLabel = styled.p.withConfig({
  displayName: 'SchedulingResourceDetailScreen_StyledFieldLabel',
  componentId: 'SchedulingResourceDetailScreen_StyledFieldLabel',
})`
  margin: 0;
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: ${({ theme }) => theme.typography.fontSize.xs}px;
`;

const StyledFieldValue = styled.p.withConfig({
  displayName: 'SchedulingResourceDetailScreen_StyledFieldValue',
  componentId: 'SchedulingResourceDetailScreen_StyledFieldValue',
})`
  margin: 0;
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: ${({ theme }) => theme.typography.fontSize.sm}px;
`;

const StyledActions = styled.div.withConfig({
  displayName: 'SchedulingResourceDetailScreen_StyledActions',
  componentId: 'SchedulingResourceDetailScreen_StyledActions',
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

