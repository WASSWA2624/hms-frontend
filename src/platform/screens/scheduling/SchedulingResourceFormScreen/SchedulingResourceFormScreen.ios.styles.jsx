import styled from 'styled-components/native';

const StyledContainer = styled.View.withConfig({
  displayName: 'SchedulingResourceFormScreen_StyledContainer',
  componentId: 'SchedulingResourceFormScreen_StyledContainer',
})`
  flex: 1;
  width: 100%;
  background-color: ${({ theme }) => theme.colors.background.primary};
`;

const StyledContent = styled.View.withConfig({
  displayName: 'SchedulingResourceFormScreen_StyledContent',
  componentId: 'SchedulingResourceFormScreen_StyledContent',
})`
  flex: 1;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.lg}px;
`;

const StyledInlineStates = styled.View.withConfig({
  displayName: 'SchedulingResourceFormScreen_StyledInlineStates',
  componentId: 'SchedulingResourceFormScreen_StyledInlineStates',
})`
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm}px;
`;

const StyledFormGrid = styled.View.withConfig({
  displayName: 'SchedulingResourceFormScreen_StyledFormGrid',
  componentId: 'SchedulingResourceFormScreen_StyledFormGrid',
})`
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md}px;
`;

const StyledFieldGroup = styled.View.withConfig({
  displayName: 'SchedulingResourceFormScreen_StyledFieldGroup',
  componentId: 'SchedulingResourceFormScreen_StyledFieldGroup',
})`
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs}px;
`;

const StyledLookupStack = styled.View.withConfig({
  displayName: 'SchedulingResourceFormScreen_StyledLookupStack',
  componentId: 'SchedulingResourceFormScreen_StyledLookupStack',
})`
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs}px;
`;

const StyledFullRow = styled.View.withConfig({
  displayName: 'SchedulingResourceFormScreen_StyledFullRow',
  componentId: 'SchedulingResourceFormScreen_StyledFullRow',
})`
  width: 100%;
`;

const StyledRepeaterStack = styled.View.withConfig({
  displayName: 'SchedulingResourceFormScreen_StyledRepeaterStack',
  componentId: 'SchedulingResourceFormScreen_StyledRepeaterStack',
})`
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm}px;
`;

const StyledRepeaterItem = styled.View.withConfig({
  displayName: 'SchedulingResourceFormScreen_StyledRepeaterItem',
  componentId: 'SchedulingResourceFormScreen_StyledRepeaterItem',
})`
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm}px;
  border-width: 1px;
  border-color: ${({ theme }) => theme.colors.background.tertiary};
  border-radius: ${({ theme }) => theme.radii?.md ?? 8}px;
  padding: ${({ theme }) => theme.spacing.sm}px;
`;

const StyledRepeaterHeader = styled.View.withConfig({
  displayName: 'SchedulingResourceFormScreen_StyledRepeaterHeader',
  componentId: 'SchedulingResourceFormScreen_StyledRepeaterHeader',
})`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm}px;
`;

const StyledRepeaterGrid = styled.View.withConfig({
  displayName: 'SchedulingResourceFormScreen_StyledRepeaterGrid',
  componentId: 'SchedulingResourceFormScreen_StyledRepeaterGrid',
})`
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm}px;
`;

const StyledHelperStack = styled.View.withConfig({
  displayName: 'SchedulingResourceFormScreen_StyledHelperStack',
  componentId: 'SchedulingResourceFormScreen_StyledHelperStack',
})`
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm}px;
`;

const StyledActions = styled.View.withConfig({
  displayName: 'SchedulingResourceFormScreen_StyledActions',
  componentId: 'SchedulingResourceFormScreen_StyledActions',
})`
  flex-direction: row;
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

