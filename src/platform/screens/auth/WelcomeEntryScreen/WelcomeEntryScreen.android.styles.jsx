/**
 * WelcomeEntryScreen Android Styles
 */
import styled from 'styled-components/native';

const StyledContainer = styled.View.withConfig({
  displayName: 'StyledContainer',
  componentId: 'WelcomeEntry_StyledContainer',
})`
  width: 100%;
  max-width: ${({ theme }) => theme.spacing.xxl * 16}px;
  align-self: center;
`;

const StyledHeader = styled.View.withConfig({
  displayName: 'StyledHeader',
  componentId: 'WelcomeEntry_StyledHeader',
})`
  margin-bottom: ${({ theme }) => theme.spacing.md}px;
`;

const StyledActions = styled.View.withConfig({
  displayName: 'StyledActions',
  componentId: 'WelcomeEntry_StyledActions',
})`
  gap: ${({ theme }) => theme.spacing.xs}px;
`;

const StyledResumeCard = styled.View.withConfig({
  displayName: 'StyledResumeCard',
  componentId: 'WelcomeEntry_StyledResumeCard',
})`
  margin-bottom: ${({ theme }) => theme.spacing.sm}px;
`;

const StyledResumeContent = styled.View.withConfig({
  displayName: 'StyledResumeContent',
  componentId: 'WelcomeEntry_StyledResumeContent',
})`
  gap: ${({ theme }) => theme.spacing.xs}px;
`;

const StyledResumeActions = styled.View.withConfig({
  displayName: 'StyledResumeActions',
  componentId: 'WelcomeEntry_StyledResumeActions',
})`
  gap: ${({ theme }) => theme.spacing.xs}px;
`;

export {
  StyledActions,
  StyledContainer,
  StyledHeader,
  StyledResumeActions,
  StyledResumeCard,
  StyledResumeContent,
};
