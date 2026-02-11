/**
 * RegisterScreen iOS Styles
 * File: RegisterScreen.ios.styles.jsx
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

const StyledFormGuidance = styled.View.withConfig({
  displayName: 'StyledFormGuidance',
  componentId: 'StyledFormGuidance',
})`
  width: 100%;
  margin-bottom: ${({ theme }) => theme.spacing.sm}px;
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
  StyledFormGuidance,
  StyledForm,
  StyledStatus,
};



