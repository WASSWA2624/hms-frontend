import styled from 'styled-components';

const StyledContainer = styled.main.withConfig({
  displayName: 'ClinicalResourceFormScreen_StyledContainer',
  componentId: 'ClinicalResourceFormScreen_StyledContainer',
})`
  display: flex;
  flex-direction: column;
  width: 100%;
  min-height: 100%;
  background-color: ${({ theme }) => theme.colors.background.primary};
`;

const StyledContent = styled.div.withConfig({
  displayName: 'ClinicalResourceFormScreen_StyledContent',
  componentId: 'ClinicalResourceFormScreen_StyledContent',
})`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.lg}px;
`;

const StyledInlineStates = styled.div.withConfig({
  displayName: 'ClinicalResourceFormScreen_StyledInlineStates',
  componentId: 'ClinicalResourceFormScreen_StyledInlineStates',
})`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm}px;
`;

const StyledFormGrid = styled.div.withConfig({
  displayName: 'ClinicalResourceFormScreen_StyledFormGrid',
  componentId: 'ClinicalResourceFormScreen_StyledFormGrid',
})`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: ${({ theme }) => theme.spacing.md}px;

  @media (max-width: ${({ theme }) => theme.breakpoints?.tablet ?? 768}px) {
    grid-template-columns: 1fr;
  }
`;

const StyledFieldGroup = styled.div.withConfig({
  displayName: 'ClinicalResourceFormScreen_StyledFieldGroup',
  componentId: 'ClinicalResourceFormScreen_StyledFieldGroup',
})`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs}px;
`;

const StyledFullRow = styled.div.withConfig({
  displayName: 'ClinicalResourceFormScreen_StyledFullRow',
  componentId: 'ClinicalResourceFormScreen_StyledFullRow',
})`
  grid-column: 1 / -1;
`;

const StyledHelperStack = styled.div.withConfig({
  displayName: 'ClinicalResourceFormScreen_StyledHelperStack',
  componentId: 'ClinicalResourceFormScreen_StyledHelperStack',
})`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm}px;
`;

const StyledActions = styled.div.withConfig({
  displayName: 'ClinicalResourceFormScreen_StyledActions',
  componentId: 'ClinicalResourceFormScreen_StyledActions',
})`
  display: flex;
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

