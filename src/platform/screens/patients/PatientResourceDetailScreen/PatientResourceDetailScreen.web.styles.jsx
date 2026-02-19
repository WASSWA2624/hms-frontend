import styled from 'styled-components';

const StyledContainer = styled.main.withConfig({
  displayName: 'PatientResourceDetailScreen_StyledContainer',
  componentId: 'PatientResourceDetailScreen_StyledContainer',
})`
  display: flex;
  flex-direction: column;
  width: 100%;
  min-height: 100%;
  background-color: ${({ theme }) => theme.colors.background.primary};
`;

const StyledContent = styled.div.withConfig({
  displayName: 'PatientResourceDetailScreen_StyledContent',
  componentId: 'PatientResourceDetailScreen_StyledContent',
})`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.lg}px;
`;

const StyledHeader = styled.section.withConfig({
  displayName: 'PatientResourceDetailScreen_StyledHeader',
  componentId: 'PatientResourceDetailScreen_StyledHeader',
})`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs}px;
`;

const StyledHeaderTop = styled.div.withConfig({
  displayName: 'PatientResourceDetailScreen_StyledHeaderTop',
  componentId: 'PatientResourceDetailScreen_StyledHeaderTop',
})`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing.md}px;
`;

const StyledHeaderCopy = styled.div.withConfig({
  displayName: 'PatientResourceDetailScreen_StyledHeaderCopy',
  componentId: 'PatientResourceDetailScreen_StyledHeaderCopy',
})`
  display: flex;
  flex: 1;
  min-width: 0;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs}px;
`;

const StyledHelpAnchor = styled.div.withConfig({
  displayName: 'PatientResourceDetailScreen_StyledHelpAnchor',
  componentId: 'PatientResourceDetailScreen_StyledHelpAnchor',
})`
  position: relative;
  display: inline-flex;
`;

const StyledHelpButton = styled.button.withConfig({
  displayName: 'PatientResourceDetailScreen_StyledHelpButton',
  componentId: 'PatientResourceDetailScreen_StyledHelpButton',
})`
  min-width: 44px;
  min-height: 44px;
  border-radius: ${({ theme }) => theme.radius.full}px;
  border: 1px solid ${({ theme }) => theme.colors.background.tertiary};
  background-color: ${({ theme }) => theme.colors.background.secondary};
  color: ${({ theme }) => theme.colors.text.primary};
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;

  &:hover {
    background-color: ${({ theme }) => theme.colors.background.tertiary};
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.primary};
    outline-offset: 2px;
  }
`;

const StyledHelpModalTitle = styled.h2.withConfig({
  displayName: 'PatientResourceDetailScreen_StyledHelpModalTitle',
  componentId: 'PatientResourceDetailScreen_StyledHelpModalTitle',
})`
  margin: 0;
  color: ${({ theme }) => theme.colors.text.primary};
  font-family: ${({ theme }) => theme.typography.fontFamily.bold};
  font-size: ${({ theme }) => theme.typography.fontSize.md}px;
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
`;

const StyledHelpModalBody = styled.p.withConfig({
  displayName: 'PatientResourceDetailScreen_StyledHelpModalBody',
  componentId: 'PatientResourceDetailScreen_StyledHelpModalBody',
})`
  margin: 0;
  color: ${({ theme }) => theme.colors.text.secondary};
  font-family: ${({ theme }) => theme.typography.fontFamily.regular};
  font-size: ${({ theme }) => theme.typography.fontSize.sm}px;
  line-height: ${({ theme }) => theme.typography.fontSize.sm * theme.typography.lineHeight.normal}px;
`;

const StyledHelpChecklist = styled.ul.withConfig({
  displayName: 'PatientResourceDetailScreen_StyledHelpChecklist',
  componentId: 'PatientResourceDetailScreen_StyledHelpChecklist',
})`
  margin: 0;
  padding-left: ${({ theme }) => theme.spacing.lg}px;
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs}px;
`;

const StyledHelpItem = styled.li.withConfig({
  displayName: 'PatientResourceDetailScreen_StyledHelpItem',
  componentId: 'PatientResourceDetailScreen_StyledHelpItem',
})`
  color: ${({ theme }) => theme.colors.text.primary};
  font-family: ${({ theme }) => theme.typography.fontFamily.regular};
  font-size: ${({ theme }) => theme.typography.fontSize.sm}px;
  line-height: ${({ theme }) => theme.typography.fontSize.sm * theme.typography.lineHeight.normal}px;
`;

const StyledInlineStates = styled.div.withConfig({
  displayName: 'PatientResourceDetailScreen_StyledInlineStates',
  componentId: 'PatientResourceDetailScreen_StyledInlineStates',
})`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm}px;
`;

const StyledDetailsGrid = styled.div.withConfig({
  displayName: 'PatientResourceDetailScreen_StyledDetailsGrid',
  componentId: 'PatientResourceDetailScreen_StyledDetailsGrid',
})`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: ${({ theme }) => theme.spacing.md}px;

  @media (max-width: ${({ theme }) => theme.breakpoints?.tablet ?? 768}px) {
    grid-template-columns: 1fr;
  }
`;

const StyledField = styled.div.withConfig({
  displayName: 'PatientResourceDetailScreen_StyledField',
  componentId: 'PatientResourceDetailScreen_StyledField',
})`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs}px;
`;

const StyledFieldLabel = styled.p.withConfig({
  displayName: 'PatientResourceDetailScreen_StyledFieldLabel',
  componentId: 'PatientResourceDetailScreen_StyledFieldLabel',
})`
  margin: 0;
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: ${({ theme }) => theme.typography.fontSize.xs}px;
`;

const StyledFieldValue = styled.p.withConfig({
  displayName: 'PatientResourceDetailScreen_StyledFieldValue',
  componentId: 'PatientResourceDetailScreen_StyledFieldValue',
})`
  margin: 0;
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: ${({ theme }) => theme.typography.fontSize.sm}px;
`;

const StyledActions = styled.div.withConfig({
  displayName: 'PatientResourceDetailScreen_StyledActions',
  componentId: 'PatientResourceDetailScreen_StyledActions',
})`
  display: flex;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing.sm}px;
`;

export {
  StyledActions,
  StyledContainer,
  StyledContent,
  StyledDetailsGrid,
  StyledField,
  StyledFieldLabel,
  StyledFieldValue,
  StyledHeader,
  StyledHeaderCopy,
  StyledHeaderTop,
  StyledHelpAnchor,
  StyledHelpButton,
  StyledHelpChecklist,
  StyledHelpItem,
  StyledHelpModalBody,
  StyledHelpModalTitle,
  StyledInlineStates,
};
