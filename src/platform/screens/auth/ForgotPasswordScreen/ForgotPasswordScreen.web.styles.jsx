/**
 * ForgotPasswordScreen Web Styles
 */
import styled from 'styled-components';

const StyledContainer = styled.section.withConfig({
  displayName: 'StyledContainer',
  componentId: 'ForgotPasswordScreen_StyledContainer',
})`
  width: 100%;
  max-width: ${({ theme }) => theme.spacing.xxl * 16}px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md}px;
`;

const StyledForm = styled.form.withConfig({
  displayName: 'StyledForm',
  componentId: 'ForgotPasswordScreen_StyledForm',
})`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm}px;
`;

const StyledField = styled.div.withConfig({
  displayName: 'StyledField',
  componentId: 'ForgotPasswordScreen_StyledField',
})`
  width: 100%;
`;

const StyledActions = styled.div.withConfig({
  displayName: 'StyledActions',
  componentId: 'ForgotPasswordScreen_StyledActions',
})`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs}px;
  margin-top: ${({ theme }) => theme.spacing.xs}px;
`;

const StyledStatus = styled.div.withConfig({
  displayName: 'StyledStatus',
  componentId: 'ForgotPasswordScreen_StyledStatus',
})`
  margin-top: ${({ theme }) => theme.spacing.xs}px;
`;

export {
  StyledActions,
  StyledContainer,
  StyledField,
  StyledForm,
  StyledStatus,
};

