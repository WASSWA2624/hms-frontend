/**
 * VerifyPhoneScreen Android Styles
 */
import styled from 'styled-components/native';

const StyledContainer = styled.View.withConfig({
  displayName: 'StyledContainer',
  componentId: 'VerifyPhoneScreen_StyledContainer',
})`
  width: 100%;
  max-width: ${({ theme }) => theme.spacing.xxl * 16}px;
  align-self: center;
`;

const StyledForm = styled.View.withConfig({
  displayName: 'StyledForm',
  componentId: 'VerifyPhoneScreen_StyledForm',
})`
  width: 100%;
`;

const StyledField = styled.View.withConfig({
  displayName: 'StyledField',
  componentId: 'VerifyPhoneScreen_StyledField',
})`
  margin-bottom: ${({ theme }) => theme.spacing.sm}px;
`;

const StyledActions = styled.View.withConfig({
  displayName: 'StyledActions',
  componentId: 'VerifyPhoneScreen_StyledActions',
})`
  margin-top: ${({ theme }) => theme.spacing.xs}px;
`;

const StyledStatus = styled.View.withConfig({
  displayName: 'StyledStatus',
  componentId: 'VerifyPhoneScreen_StyledStatus',
})`
  margin-top: ${({ theme }) => theme.spacing.sm}px;
`;

export {
  StyledActions,
  StyledContainer,
  StyledField,
  StyledForm,
  StyledStatus,
};

