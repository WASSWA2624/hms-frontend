/**
 * RegisterScreen Android Styles
 * File: RegisterScreen.android.styles.jsx
 */
import styled from 'styled-components/native';

const StyledContainer = styled.View.withConfig({
  displayName: 'StyledContainer',
  componentId: 'StyledContainer',
})`
  width: 100%;
  max-width: ${({ theme }) => theme.spacing.xxl * 18}px;
  align-self: center;
`;

const StyledForm = styled.View.withConfig({
  displayName: 'StyledForm',
  componentId: 'StyledForm',
})`
  width: 100%;
`;

const StyledField = styled.View.withConfig({
  displayName: 'StyledField',
  componentId: 'StyledField',
})`
  margin-bottom: ${({ theme }) => theme.spacing.sm}px;
`;

const StyledTerms = styled.View.withConfig({
  displayName: 'StyledTerms',
  componentId: 'StyledTerms',
})`
  margin-bottom: ${({ theme }) => theme.spacing.sm}px;
`;

const StyledTermsLink = styled.View.withConfig({
  displayName: 'StyledTermsLink',
  componentId: 'StyledTermsLink',
})`
  align-items: flex-start;
  margin-top: ${({ theme }) => theme.spacing.xs / 2}px;
`;

const StyledTermsError = styled.View.withConfig({
  displayName: 'StyledTermsError',
  componentId: 'StyledTermsError',
})`
  margin-top: ${({ theme }) => theme.spacing.xs / 2}px;
`;

const StyledActions = styled.View.withConfig({
  displayName: 'StyledActions',
  componentId: 'StyledActions',
})`
  flex-direction: row;
  margin-top: ${({ theme }) => theme.spacing.xs}px;
`;

const StyledActionSlot = styled.View.withConfig({
  displayName: 'StyledActionSlot',
  componentId: 'StyledActionSlot',
})`
  flex: 1;
  margin-right: ${({ theme, $last }) => ($last ? 0 : theme.spacing.sm)}px;
`;

const StyledStatus = styled.View.withConfig({
  displayName: 'StyledStatus',
  componentId: 'StyledStatus',
})`
  margin-top: ${({ theme }) => theme.spacing.xs}px;
`;

export {
  StyledActions,
  StyledActionSlot,
  StyledContainer,
  StyledField,
  StyledForm,
  StyledTerms,
  StyledTermsLink,
  StyledTermsError,
  StyledStatus,
};



