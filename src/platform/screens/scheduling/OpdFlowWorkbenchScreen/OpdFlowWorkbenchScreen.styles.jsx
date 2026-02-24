import styled from 'styled-components';

const getTablet = (theme) => theme.breakpoints?.tablet ?? 960;

const StyledContainer = styled.section.withConfig({
  displayName: 'OpdFlowWorkbench_StyledContainer',
  componentId: 'OpdFlowWorkbench_StyledContainer',
})`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md}px;
`;

const StyledLayout = styled.div.withConfig({
  displayName: 'OpdFlowWorkbench_StyledLayout',
  componentId: 'OpdFlowWorkbench_StyledLayout',
})`
  display: grid;
  grid-template-columns: minmax(280px, 0.95fr) minmax(0, 2.05fr);
  gap: ${({ theme }) => theme.spacing.md}px;

  @media (max-width: ${({ theme }) => getTablet(theme)}px) {
    grid-template-columns: 1fr;
  }
`;

const StyledPanel = styled.div.withConfig({
  displayName: 'OpdFlowWorkbench_StyledPanel',
  componentId: 'OpdFlowWorkbench_StyledPanel',
})`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm}px;
`;

const StyledPanelHeader = styled.div.withConfig({
  displayName: 'OpdFlowWorkbench_StyledPanelHeader',
  componentId: 'OpdFlowWorkbench_StyledPanelHeader',
})`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing.xs}px;
`;

const StyledFlowList = styled.div.withConfig({
  displayName: 'OpdFlowWorkbench_StyledFlowList',
  componentId: 'OpdFlowWorkbench_StyledFlowList',
})`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs}px;
`;

const StyledCardGrid = styled.div.withConfig({
  displayName: 'OpdFlowWorkbench_StyledCardGrid',
  componentId: 'OpdFlowWorkbench_StyledCardGrid',
})`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: ${({ theme }) => theme.spacing.sm}px;

  @media (max-width: ${({ theme }) => getTablet(theme)}px) {
    grid-template-columns: 1fr;
  }
`;

const StyledMeta = styled.p.withConfig({
  displayName: 'OpdFlowWorkbench_StyledMeta',
  componentId: 'OpdFlowWorkbench_StyledMeta',
})`
  margin: 0;
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: ${({ theme }) => theme.typography.fontSize.xs}px;
`;

const StyledForm = styled.div.withConfig({
  displayName: 'OpdFlowWorkbench_StyledForm',
  componentId: 'OpdFlowWorkbench_StyledForm',
})`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm}px;
`;

const StyledFieldRow = styled.div.withConfig({
  displayName: 'OpdFlowWorkbench_StyledFieldRow',
  componentId: 'OpdFlowWorkbench_StyledFieldRow',
})`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: ${({ theme }) => theme.spacing.sm}px;

  @media (max-width: ${({ theme }) => getTablet(theme)}px) {
    grid-template-columns: 1fr;
  }
`;

const StyledInlineActions = styled.div.withConfig({
  displayName: 'OpdFlowWorkbench_StyledInlineActions',
  componentId: 'OpdFlowWorkbench_StyledInlineActions',
})`
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing.xs}px;
`;

const StyledSectionTitle = styled.h3.withConfig({
  displayName: 'OpdFlowWorkbench_StyledSectionTitle',
  componentId: 'OpdFlowWorkbench_StyledSectionTitle',
})`
  margin: 0;
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: ${({ theme }) => theme.typography.fontSize.sm}px;
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
`;

const StyledTimeline = styled.ul.withConfig({
  displayName: 'OpdFlowWorkbench_StyledTimeline',
  componentId: 'OpdFlowWorkbench_StyledTimeline',
})`
  margin: 0;
  padding-left: ${({ theme }) => theme.spacing.md}px;
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs}px;
`;

const StyledTimelineItem = styled.li.withConfig({
  displayName: 'OpdFlowWorkbench_StyledTimelineItem',
  componentId: 'OpdFlowWorkbench_StyledTimelineItem',
})`
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: ${({ theme }) => theme.typography.fontSize.xs}px;
`;

export {
  StyledCardGrid,
  StyledContainer,
  StyledFieldRow,
  StyledFlowList,
  StyledForm,
  StyledInlineActions,
  StyledLayout,
  StyledMeta,
  StyledPanel,
  StyledPanelHeader,
  StyledSectionTitle,
  StyledTimeline,
  StyledTimelineItem,
};
