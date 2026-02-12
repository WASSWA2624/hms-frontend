/**
 * LoginScreen Web Styles
 */
import styled from 'styled-components';

const StyledContainer = styled.section.withConfig({
  displayName: 'StyledContainer',
  componentId: 'StyledContainer',
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
  componentId: 'StyledForm',
})`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm}px;
`;

const StyledField = styled.div.withConfig({
  displayName: 'StyledField',
  componentId: 'StyledField',
})`
  width: 100%;
`;

const StyledRemember = styled.div.withConfig({
  displayName: 'StyledRemember',
  componentId: 'StyledRemember',
})`
  margin-top: ${({ theme }) => theme.spacing.xs}px;
`;

const StyledActions = styled.div.withConfig({
  displayName: 'StyledActions',
  componentId: 'StyledActions',
})`
  margin-top: ${({ theme }) => theme.spacing.xs}px;

  > * {
    width: 100%;
  }
`;

const StyledLinks = styled.div.withConfig({
  displayName: 'StyledLinks',
  componentId: 'StyledLinks',
})`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing.xs}px;
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
  StyledField,
  StyledForm,
  StyledLinks,
  StyledRemember,
  StyledStatus,
};
