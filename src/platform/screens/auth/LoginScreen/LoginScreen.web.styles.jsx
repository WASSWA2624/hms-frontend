/**
 * LoginScreen Web Styles
 */
import styled from 'styled-components';

const StyledContainer = styled.section.withConfig({
  displayName: 'StyledContainer',
  componentId: 'StyledContainer',
})`
  width: 100%;
  max-width: ${({ theme }) => theme.spacing.xxl * 17}px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm}px;
`;

const StyledForm = styled.form.withConfig({
  displayName: 'StyledForm',
  componentId: 'StyledForm',
})`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm}px;
`;

const StyledFormGuidance = styled.div.withConfig({
  displayName: 'StyledFormGuidance',
  componentId: 'StyledFormGuidance',
})`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs}px;
`;

const StyledFormPanel = styled.div.withConfig({
  displayName: 'StyledFormPanel',
  componentId: 'StyledFormPanel',
})`
  position: relative;
  overflow: hidden;
  padding: ${({ theme }) => theme.spacing.sm}px;
  border-radius: ${({ theme }) => theme.radius.md}px;
  border: 1px solid ${({ theme }) => `${theme.colors.primary}33`};
  background: linear-gradient(
    180deg,
    ${({ theme }) => theme.colors.background.primary} 0%,
    ${({ theme }) => theme.colors.background.secondary} 100%
  );
  box-shadow: 0 2px 0 rgba(8, 34, 74, 0.12), 0 10px 16px rgba(8, 34, 74, 0.1);
`;

const StyledField = styled.div.withConfig({
  displayName: 'StyledField',
  componentId: 'StyledField',
})`
  width: 100%;
  margin-bottom: ${({ theme }) => theme.spacing.sm}px;
`;

const StyledRemember = styled.div.withConfig({
  displayName: 'StyledRemember',
  componentId: 'StyledRemember',
})`
  margin-bottom: ${({ theme }) => theme.spacing.sm}px;
`;

const StyledActions = styled.div.withConfig({
  displayName: 'StyledActions',
  componentId: 'StyledActions',
})`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs}px;
  margin-top: ${({ theme }) => theme.spacing.xs / 2}px;

  > :first-child {
    width: 100%;
  }

  > :last-child:not(:first-child) {
    align-self: flex-start;
  }
`;

const StyledLinks = styled.div.withConfig({
  displayName: 'StyledLinks',
  componentId: 'StyledLinks',
})`
  margin-top: ${({ theme }) => theme.spacing.sm}px;
  padding-top: ${({ theme }) => theme.spacing.sm}px;
  border-top: 1px solid ${({ theme }) => `${theme.colors.primary}26`};
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: ${({ theme }) => theme.spacing.xs}px;

  > * {
    width: 100%;
  }

  @media (max-width: ${({ theme }) => theme.breakpoints?.desktop ?? 1024}px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  @media (max-width: ${({ theme }) => (theme.breakpoints?.tablet ?? 768) - 1}px) {
    grid-template-columns: 1fr;
  }
`;

const StyledStatus = styled.div.withConfig({
  displayName: 'StyledStatus',
  componentId: 'StyledStatus',
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
  StyledLinks,
  StyledRemember,
  StyledStatus,
};
