import styled from 'styled-components';

const StyledContainer = styled.main.withConfig({
  displayName: 'SchedulingResourceFormScreen_StyledContainer',
  componentId: 'SchedulingResourceFormScreen_StyledContainer',
})`
  display: flex;
  flex-direction: column;
  width: 100%;
  min-height: 100%;
  background-color: ${({ theme }) => theme.colors.background.primary};
`;

const StyledContent = styled.div.withConfig({
  displayName: 'SchedulingResourceFormScreen_StyledContent',
  componentId: 'SchedulingResourceFormScreen_StyledContent',
})`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.lg}px;
`;

const StyledInlineStates = styled.div.withConfig({
  displayName: 'SchedulingResourceFormScreen_StyledInlineStates',
  componentId: 'SchedulingResourceFormScreen_StyledInlineStates',
})`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm}px;
`;

const StyledFormGrid = styled.div.withConfig({
  displayName: 'SchedulingResourceFormScreen_StyledFormGrid',
  componentId: 'SchedulingResourceFormScreen_StyledFormGrid',
})`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: ${({ theme }) => theme.spacing.md}px;

  @media (max-width: ${({ theme }) => theme.breakpoints?.tablet ?? 768}px) {
    grid-template-columns: 1fr;
  }
`;

const StyledFieldGroup = styled.div.withConfig({
  displayName: 'SchedulingResourceFormScreen_StyledFieldGroup',
  componentId: 'SchedulingResourceFormScreen_StyledFieldGroup',
})`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs}px;
`;

const StyledLookupStack = styled.div.withConfig({
  displayName: 'SchedulingResourceFormScreen_StyledLookupStack',
  componentId: 'SchedulingResourceFormScreen_StyledLookupStack',
})`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs}px;
`;

const StyledFullRow = styled.div.withConfig({
  displayName: 'SchedulingResourceFormScreen_StyledFullRow',
  componentId: 'SchedulingResourceFormScreen_StyledFullRow',
})`
  grid-column: 1 / -1;
`;

const StyledRepeaterStack = styled.div.withConfig({
  displayName: 'SchedulingResourceFormScreen_StyledRepeaterStack',
  componentId: 'SchedulingResourceFormScreen_StyledRepeaterStack',
})`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm}px;
`;

const StyledRepeaterItem = styled.div.withConfig({
  displayName: 'SchedulingResourceFormScreen_StyledRepeaterItem',
  componentId: 'SchedulingResourceFormScreen_StyledRepeaterItem',
})`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm}px;
  border: 1px solid ${({ theme }) => theme.colors.background.tertiary};
  border-radius: ${({ theme }) => theme.radii?.md ?? 8}px;
  padding: ${({ theme }) => theme.spacing.sm}px;
`;

const StyledRepeaterHeader = styled.div.withConfig({
  displayName: 'SchedulingResourceFormScreen_StyledRepeaterHeader',
  componentId: 'SchedulingResourceFormScreen_StyledRepeaterHeader',
})`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm}px;
`;

const StyledRepeaterGrid = styled.div.withConfig({
  displayName: 'SchedulingResourceFormScreen_StyledRepeaterGrid',
  componentId: 'SchedulingResourceFormScreen_StyledRepeaterGrid',
})`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: ${({ theme }) => theme.spacing.sm}px;

  @media (max-width: ${({ theme }) => theme.breakpoints?.tablet ?? 768}px) {
    grid-template-columns: 1fr;
  }
`;

const StyledHelperStack = styled.div.withConfig({
  displayName: 'SchedulingResourceFormScreen_StyledHelperStack',
  componentId: 'SchedulingResourceFormScreen_StyledHelperStack',
})`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm}px;
`;

const StyledActions = styled.div.withConfig({
  displayName: 'SchedulingResourceFormScreen_StyledActions',
  componentId: 'SchedulingResourceFormScreen_StyledActions',
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
  StyledHelperStack,
  StyledInlineStates,
  StyledLookupStack,
  StyledRepeaterGrid,
  StyledRepeaterHeader,
  StyledRepeaterItem,
  StyledRepeaterStack,
};

