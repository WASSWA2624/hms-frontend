import styled from 'styled-components';

const StyledContainer = styled.main.withConfig({
  displayName: 'PatientResourceFormScreen_StyledContainer',
  componentId: 'PatientResourceFormScreen_StyledContainer',
})`
  display: flex;
  flex-direction: column;
  width: 100%;
  min-height: 100%;
  background-color: ${({ theme }) => theme.colors.background.primary};
`;

const StyledContent = styled.div.withConfig({
  displayName: 'PatientResourceFormScreen_StyledContent',
  componentId: 'PatientResourceFormScreen_StyledContent',
})`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.lg}px;
`;

const StyledHeader = styled.section.withConfig({
  displayName: 'PatientResourceFormScreen_StyledHeader',
  componentId: 'PatientResourceFormScreen_StyledHeader',
})`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs}px;
`;

const StyledHeaderTop = styled.div.withConfig({
  displayName: 'PatientResourceFormScreen_StyledHeaderTop',
  componentId: 'PatientResourceFormScreen_StyledHeaderTop',
})`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing.md}px;
`;

const StyledHeaderCopy = styled.div.withConfig({
  displayName: 'PatientResourceFormScreen_StyledHeaderCopy',
  componentId: 'PatientResourceFormScreen_StyledHeaderCopy',
})`
  display: flex;
  flex: 1;
  min-width: 0;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs}px;
`;

const StyledHelpAnchor = styled.div.withConfig({
  displayName: 'PatientResourceFormScreen_StyledHelpAnchor',
  componentId: 'PatientResourceFormScreen_StyledHelpAnchor',
})`
  position: relative;
  display: inline-flex;
`;

const StyledHelpButton = styled.button.withConfig({
  displayName: 'PatientResourceFormScreen_StyledHelpButton',
  componentId: 'PatientResourceFormScreen_StyledHelpButton',
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
  displayName: 'PatientResourceFormScreen_StyledHelpModalTitle',
  componentId: 'PatientResourceFormScreen_StyledHelpModalTitle',
})`
  margin: 0;
  color: ${({ theme }) => theme.colors.text.primary};
  font-family: ${({ theme }) => theme.typography.fontFamily.bold};
  font-size: ${({ theme }) => theme.typography.fontSize.md}px;
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
`;

const StyledHelpModalBody = styled.p.withConfig({
  displayName: 'PatientResourceFormScreen_StyledHelpModalBody',
  componentId: 'PatientResourceFormScreen_StyledHelpModalBody',
})`
  margin: 0;
  color: ${({ theme }) => theme.colors.text.secondary};
  font-family: ${({ theme }) => theme.typography.fontFamily.regular};
  font-size: ${({ theme }) => theme.typography.fontSize.sm}px;
  line-height: ${({ theme }) => theme.typography.fontSize.sm * theme.typography.lineHeight.normal}px;
`;

const StyledHelpChecklist = styled.ul.withConfig({
  displayName: 'PatientResourceFormScreen_StyledHelpChecklist',
  componentId: 'PatientResourceFormScreen_StyledHelpChecklist',
})`
  margin: 0;
  padding-left: ${({ theme }) => theme.spacing.lg}px;
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs}px;
`;

const StyledHelpItem = styled.li.withConfig({
  displayName: 'PatientResourceFormScreen_StyledHelpItem',
  componentId: 'PatientResourceFormScreen_StyledHelpItem',
})`
  color: ${({ theme }) => theme.colors.text.primary};
  font-family: ${({ theme }) => theme.typography.fontFamily.regular};
  font-size: ${({ theme }) => theme.typography.fontSize.sm}px;
  line-height: ${({ theme }) => theme.typography.fontSize.sm * theme.typography.lineHeight.normal}px;
`;

const StyledInlineStates = styled.div.withConfig({
  displayName: 'PatientResourceFormScreen_StyledInlineStates',
  componentId: 'PatientResourceFormScreen_StyledInlineStates',
})`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm}px;
`;

const StyledFormGrid = styled.div.withConfig({
  displayName: 'PatientResourceFormScreen_StyledFormGrid',
  componentId: 'PatientResourceFormScreen_StyledFormGrid',
})`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: ${({ theme }) => theme.spacing.md}px;

  @media (max-width: ${({ theme }) => theme.breakpoints?.tablet ?? 768}px) {
    grid-template-columns: 1fr;
  }
`;

const StyledFieldGroup = styled.div.withConfig({
  displayName: 'PatientResourceFormScreen_StyledFieldGroup',
  componentId: 'PatientResourceFormScreen_StyledFieldGroup',
})`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs}px;
`;

const StyledFullRow = styled.div.withConfig({
  displayName: 'PatientResourceFormScreen_StyledFullRow',
  componentId: 'PatientResourceFormScreen_StyledFullRow',
})`
  grid-column: 1 / -1;
`;

const StyledHelperStack = styled.div.withConfig({
  displayName: 'PatientResourceFormScreen_StyledHelperStack',
  componentId: 'PatientResourceFormScreen_StyledHelperStack',
})`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm}px;
`;

const StyledActions = styled.div.withConfig({
  displayName: 'PatientResourceFormScreen_StyledActions',
  componentId: 'PatientResourceFormScreen_StyledActions',
})`
  display: flex;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing.sm}px;
`;

export {
  StyledActions,
  StyledContainer,
  StyledContent,
  StyledFieldGroup,
  StyledFormGrid,
  StyledFullRow,
  StyledHeader,
  StyledHeaderCopy,
  StyledHeaderTop,
  StyledHelperStack,
  StyledHelpAnchor,
  StyledHelpButton,
  StyledHelpChecklist,
  StyledHelpItem,
  StyledHelpModalBody,
  StyledHelpModalTitle,
  StyledInlineStates,
};
