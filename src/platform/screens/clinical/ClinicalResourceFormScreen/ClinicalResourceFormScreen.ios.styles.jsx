import styled from 'styled-components/native';

const StyledContainer = styled.View.withConfig({
  displayName: 'ClinicalResourceFormScreen_StyledContainer',
  componentId: 'ClinicalResourceFormScreen_StyledContainer',
})`
  flex: 1;
  width: 100%;
  background-color: ${({ theme }) => theme.colors.background.primary};
`;

const StyledContent = styled.View.withConfig({
  displayName: 'ClinicalResourceFormScreen_StyledContent',
  componentId: 'ClinicalResourceFormScreen_StyledContent',
})`
  flex: 1;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.lg}px;
`;

const StyledInlineStates = styled.View.withConfig({
  displayName: 'ClinicalResourceFormScreen_StyledInlineStates',
  componentId: 'ClinicalResourceFormScreen_StyledInlineStates',
})`
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm}px;
`;

const StyledFormGrid = styled.View.withConfig({
  displayName: 'ClinicalResourceFormScreen_StyledFormGrid',
  componentId: 'ClinicalResourceFormScreen_StyledFormGrid',
})`
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md}px;
`;

const StyledFieldGroup = styled.View.withConfig({
  displayName: 'ClinicalResourceFormScreen_StyledFieldGroup',
  componentId: 'ClinicalResourceFormScreen_StyledFieldGroup',
})`
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs}px;
`;

const StyledFullRow = styled.View.withConfig({
  displayName: 'ClinicalResourceFormScreen_StyledFullRow',
  componentId: 'ClinicalResourceFormScreen_StyledFullRow',
})`
  width: 100%;
`;

const StyledHelperStack = styled.View.withConfig({
  displayName: 'ClinicalResourceFormScreen_StyledHelperStack',
  componentId: 'ClinicalResourceFormScreen_StyledHelperStack',
})`
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm}px;
`;

const StyledActions = styled.View.withConfig({
  displayName: 'ClinicalResourceFormScreen_StyledActions',
  componentId: 'ClinicalResourceFormScreen_StyledActions',
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

