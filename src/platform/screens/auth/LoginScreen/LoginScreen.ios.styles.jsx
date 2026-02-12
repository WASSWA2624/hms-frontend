/**
 * LoginScreen iOS Styles
 */
import styled from 'styled-components/native';

const StyledContainer = styled.View.withConfig({
  displayName: 'StyledContainer',
  componentId: 'LoginScreen_StyledContainer',
})`
  width: 100%;
  max-width: ${({ theme }) => theme.spacing.xxl * 16}px;
  align-self: center;
`;

const StyledForm = styled.View.withConfig({
  displayName: 'StyledForm',
  componentId: 'LoginScreen_StyledForm',
})`
  width: 100%;
`;

const StyledField = styled.View.withConfig({
  displayName: 'StyledField',
  componentId: 'LoginScreen_StyledField',
})`
  margin-bottom: ${({ theme }) => theme.spacing.sm}px;
`;

const StyledRemember = styled.View.withConfig({
  displayName: 'StyledRemember',
  componentId: 'LoginScreen_StyledRemember',
})`
  margin-bottom: ${({ theme }) => theme.spacing.sm}px;
`;

const StyledActions = styled.View.withConfig({
  displayName: 'StyledActions',
  componentId: 'LoginScreen_StyledActions',
})`
  margin-top: ${({ theme }) => theme.spacing.xs}px;
`;

const StyledLinks = styled.View.withConfig({
  displayName: 'StyledLinks',
  componentId: 'LoginScreen_StyledLinks',
})`
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: center;
  margin-top: ${({ theme }) => theme.spacing.sm}px;
`;

const StyledStatus = styled.View.withConfig({
  displayName: 'StyledStatus',
  componentId: 'LoginScreen_StyledStatus',
})`
  margin-top: ${({ theme }) => theme.spacing.sm}px;
`;

export {
  StyledActions,
  StyledContainer,
  StyledField,
  StyledForm,
  StyledLinks,
  StyledRemember,
  StyledStatus,
};

