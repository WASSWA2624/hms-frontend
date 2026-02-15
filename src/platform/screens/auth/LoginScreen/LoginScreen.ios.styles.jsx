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

const StyledFormGuidance = styled.View.withConfig({
  displayName: 'StyledFormGuidance',
  componentId: 'LoginScreen_StyledFormGuidance',
})`
  margin-bottom: ${({ theme }) => theme.spacing.sm}px;
  gap: ${({ theme }) => theme.spacing.xs}px;
`;

const StyledForm = styled.View.withConfig({
  displayName: 'StyledForm',
  componentId: 'LoginScreen_StyledForm',
})`
  width: 100%;
`;

const StyledFormPanel = styled.View.withConfig({
  displayName: 'StyledFormPanel',
  componentId: 'LoginScreen_StyledFormPanel',
})`
  padding: ${({ theme }) => theme.spacing.sm}px;
  border-width: 1px;
  border-color: ${({ theme }) => `${theme.colors.primary}33`};
  border-radius: ${({ theme }) => theme.radius.md}px;
  background-color: ${({ theme }) => theme.colors.background.secondary};
  shadow-color: #08224a;
  shadow-offset: 0px 2px;
  shadow-opacity: 0.08;
  shadow-radius: 6px;
  elevation: 2;
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
  margin-top: ${({ theme }) => theme.spacing.xs / 2}px;
`;

const StyledPrimaryAction = styled.View.withConfig({
  displayName: 'StyledPrimaryAction',
  componentId: 'LoginScreen_StyledPrimaryAction',
})`
  margin-bottom: ${({ theme, $withSecondary }) => ($withSecondary ? theme.spacing.xs : 0)}px;
`;

const StyledLinks = styled.View.withConfig({
  displayName: 'StyledLinks',
  componentId: 'LoginScreen_StyledLinks',
})`
  margin-top: ${({ theme }) => theme.spacing.sm}px;
  padding-top: ${({ theme }) => theme.spacing.sm}px;
  border-top-width: 1px;
  border-top-color: ${({ theme }) => `${theme.colors.primary}26`};
`;

const StyledLinkItem = styled.View.withConfig({
  displayName: 'StyledLinkItem',
  componentId: 'LoginScreen_StyledLinkItem',
})`
  align-items: flex-start;
  margin-bottom: ${({ theme, $last }) => ($last ? 0 : theme.spacing.xs)}px;
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
  StyledFormGuidance,
  StyledFormPanel,
  StyledForm,
  StyledLinkItem,
  StyledLinks,
  StyledPrimaryAction,
  StyledRemember,
  StyledStatus,
};
