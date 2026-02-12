/**
 * WelcomeEntryScreen Web Styles
 */
import styled from 'styled-components';

const StyledContainer = styled.section.withConfig({
  displayName: 'StyledContainer',
  componentId: 'WelcomeEntry_StyledContainer',
})`
  width: 100%;
  max-width: ${({ theme }) => theme.spacing.xxl * 16}px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md}px;
`;

const StyledHeader = styled.div.withConfig({
  displayName: 'StyledHeader',
  componentId: 'WelcomeEntry_StyledHeader',
})`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs}px;
`;

const StyledActions = styled.div.withConfig({
  displayName: 'StyledActions',
  componentId: 'WelcomeEntry_StyledActions',
})`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs}px;
`;

const StyledResumeContent = styled.div.withConfig({
  displayName: 'StyledResumeContent',
  componentId: 'WelcomeEntry_StyledResumeContent',
})`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs}px;
`;

const StyledResumeActions = styled.div.withConfig({
  displayName: 'StyledResumeActions',
  componentId: 'WelcomeEntry_StyledResumeActions',
})`
  display: flex;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing.xs}px;
`;

export {
  StyledActions,
  StyledContainer,
  StyledHeader,
  StyledResumeActions,
  StyledResumeContent,
};
