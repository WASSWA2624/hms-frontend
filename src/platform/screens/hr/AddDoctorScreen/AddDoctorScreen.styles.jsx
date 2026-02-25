import styled from 'styled-components';

const getTablet = (theme) => theme.breakpoints?.tablet ?? 960;

const StyledContainer = styled.section.withConfig({
  displayName: 'AddDoctor_StyledContainer',
  componentId: 'AddDoctor_StyledContainer',
})`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md}px;
`;

const StyledHeader = styled.div.withConfig({
  displayName: 'AddDoctor_StyledHeader',
  componentId: 'AddDoctor_StyledHeader',
})`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing.sm}px;
`;

const StyledSection = styled.div.withConfig({
  displayName: 'AddDoctor_StyledSection',
  componentId: 'AddDoctor_StyledSection',
})`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm}px;
`;

const StyledSectionTitle = styled.h3.withConfig({
  displayName: 'AddDoctor_StyledSectionTitle',
  componentId: 'AddDoctor_StyledSectionTitle',
})`
  margin: 0;
  font-family: ${({ theme }) => theme.typography.fontFamily.bold};
  font-size: ${({ theme }) => theme.typography.fontSize.md}px;
  color: ${({ theme }) => theme.colors.text.primary};
`;

const StyledGrid = styled.div.withConfig({
  displayName: 'AddDoctor_StyledGrid',
  componentId: 'AddDoctor_StyledGrid',
})`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: ${({ theme }) => theme.spacing.sm}px;

  @media (max-width: ${({ theme }) => getTablet(theme)}px) {
    grid-template-columns: 1fr;
  }
`;

const StyledInlineActions = styled.div.withConfig({
  displayName: 'AddDoctor_StyledInlineActions',
  componentId: 'AddDoctor_StyledInlineActions',
})`
  display: flex;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing.xs}px;
`;

const StyledRowCard = styled.div.withConfig({
  displayName: 'AddDoctor_StyledRowCard',
  componentId: 'AddDoctor_StyledRowCard',
})`
  border: 1px solid ${({ theme }) => theme.colors.border.light};
  border-radius: ${({ theme }) => theme.radius.md}px;
  padding: ${({ theme }) => theme.spacing.sm}px;
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm}px;
  background: ${({ theme }) => theme.colors.surface.primary};
`;

const StyledCaption = styled.p.withConfig({
  displayName: 'AddDoctor_StyledCaption',
  componentId: 'AddDoctor_StyledCaption',
})`
  margin: 0;
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: ${({ theme }) => theme.typography.fontSize.xs}px;
`;

export {
  StyledCaption,
  StyledContainer,
  StyledGrid,
  StyledHeader,
  StyledInlineActions,
  StyledRowCard,
  StyledSection,
  StyledSectionTitle,
};
