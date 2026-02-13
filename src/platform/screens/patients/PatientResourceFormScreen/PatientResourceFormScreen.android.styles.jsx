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
  StyledHelperStack,
  StyledInlineStates,
};
