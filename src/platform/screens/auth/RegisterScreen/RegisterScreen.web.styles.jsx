/**
 * RegisterScreen Web Styles
 * File: RegisterScreen.web.styles.jsx
 */
import styled from 'styled-components';

const StyledContainer = styled.section.withConfig({
  displayName: 'StyledContainer',
  componentId: 'StyledContainer',
})`
  width: 100%;
  max-width: ${({ theme }) => theme.spacing.xxl * 18}px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md}px;
`;

const StyledFormGuidance = styled.div.withConfig({
  displayName: 'StyledFormGuidance',
  componentId: 'StyledFormGuidance',
})`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  text-align: left;
  gap: ${({ theme }) => theme.spacing.xs}px;
  margin-bottom: ${({ theme }) => theme.spacing.sm}px;
`;

const StyledForm = styled.form.withConfig({
  displayName: 'StyledForm',
  componentId: 'StyledForm',
})`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs}px;
`;

const StyledFieldGrid = styled.div.withConfig({
  displayName: 'StyledFieldGrid',
  componentId: 'StyledFieldGrid',
})`
  display: grid;
  grid-template-columns: 1fr;
  row-gap: ${({ theme }) => theme.spacing.sm}px;
  column-gap: ${({ theme }) => theme.spacing.md}px;

  @media (min-width: ${({ theme }) => theme.breakpoints?.desktop ?? 1024}px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
`;

const StyledActions = styled.div.withConfig({
  displayName: 'StyledActions',
  componentId: 'StyledActions',
})`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing.sm}px;
  margin-top: ${({ theme }) => theme.spacing.xs}px;

  > * {
    flex: 1;
  }
`;

const StyledStatus = styled.div.withConfig({
  displayName: 'StyledStatus',
  componentId: 'StyledStatus',
})`
  margin-top: ${({ theme }) => theme.spacing.xs}px;
`;

export {
  StyledActions,
  StyledContainer,
  StyledFieldGrid,
  StyledFormGuidance,
  StyledForm,
  StyledStatus,
};


