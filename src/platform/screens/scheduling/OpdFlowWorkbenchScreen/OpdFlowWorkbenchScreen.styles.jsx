import styled from 'styled-components';
import { Pressable } from 'react-native';

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
  gap: ${({ theme }) => theme.spacing.xs + 2}px;
`;

const StyledFlowListItem = styled(Pressable).withConfig({
  displayName: 'OpdFlowWorkbench_StyledFlowListItem',
  componentId: 'OpdFlowWorkbench_StyledFlowListItem',
  shouldForwardProp: (prop) => !['$selected'].includes(prop),
})`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs + 1}px;
  min-height: 96px;
  border-radius: ${({ theme }) => theme.radius.lg}px;
  border-width: 1px;
  border-style: solid;
  border-color: ${({ theme, $selected }) =>
    $selected ? theme.colors.primary : theme.colors.border.medium};
  border-left-width: 5px;
  border-left-color: ${({ theme, $selected }) =>
    $selected ? theme.colors.primary : theme.colors.border.medium};
  background-color: ${({ theme, $selected }) =>
    $selected ? theme.colors.background.secondary : theme.colors.surface.primary};
  padding: ${({ theme }) => `${theme.spacing.sm + 1}px ${theme.spacing.sm + 2}px`};
  text-align: left;
  cursor: ${({ disabled }) => (disabled ? 'default' : 'pointer')};
  box-shadow: ${({ $selected }) =>
    $selected ? '0 2px 8px rgba(0, 120, 212, 0.16)' : '0 1px 3px rgba(0, 0, 0, 0.06)'};
  transition:
    border-color 0.2s ease,
    background-color 0.2s ease,
    box-shadow 0.2s ease,
    transform 0.2s ease;

  &:hover {
    border-color: ${({ theme }) => theme.colors.primary};
    background-color: ${({ theme, $selected }) =>
      $selected ? theme.colors.background.secondary : theme.colors.background.tertiary};
    box-shadow: ${({ $selected }) =>
      $selected ? '0 4px 12px rgba(0, 120, 212, 0.22)' : '0 3px 10px rgba(0, 0, 0, 0.12)'};
    transform: translateY(-1px);
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.primary};
    outline-offset: 2px;
  }
`;

const StyledFlowListItemHeader = styled.div.withConfig({
  displayName: 'OpdFlowWorkbench_StyledFlowListItemHeader',
  componentId: 'OpdFlowWorkbench_StyledFlowListItemHeader',
})`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing.xs}px;
`;

const StyledFlowListPrimary = styled.div.withConfig({
  displayName: 'OpdFlowWorkbench_StyledFlowListPrimary',
  componentId: 'OpdFlowWorkbench_StyledFlowListPrimary',
})`
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
`;

const StyledFlowListTitle = styled.h4.withConfig({
  displayName: 'OpdFlowWorkbench_StyledFlowListTitle',
  componentId: 'OpdFlowWorkbench_StyledFlowListTitle',
  shouldForwardProp: (prop) => !['$selected'].includes(prop),
})`
  margin: 0;
  font-family: ${({ theme }) => theme.typography.fontFamily.bold};
  color: ${({ theme, $selected }) =>
    $selected ? theme.colors.primary : theme.colors.text.primary};
  font-size: ${({ theme }) => theme.typography.fontSize.lg}px;
  line-height: ${({ theme }) =>
    Math.round(theme.typography.fontSize.lg * 1.2)}px;
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  letter-spacing: 0.01em;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const StyledFlowListPatientMeta = styled.p.withConfig({
  displayName: 'OpdFlowWorkbench_StyledFlowListPatientMeta',
  componentId: 'OpdFlowWorkbench_StyledFlowListPatientMeta',
})`
  margin: 0;
  font-family: ${({ theme }) => theme.typography.fontFamily.regular};
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: ${({ theme }) => theme.typography.fontSize.sm}px;
  line-height: ${({ theme }) => Math.round(theme.typography.fontSize.sm * 1.3)}px;
`;

const StyledFlowListBadgeWrap = styled.div.withConfig({
  displayName: 'OpdFlowWorkbench_StyledFlowListBadgeWrap',
  componentId: 'OpdFlowWorkbench_StyledFlowListBadgeWrap',
})`
  flex-shrink: 0;
  display: inline-flex;
  max-width: 190px;
`;

const StyledFlowListMetaRow = styled.div.withConfig({
  displayName: 'OpdFlowWorkbench_StyledFlowListMetaRow',
  componentId: 'OpdFlowWorkbench_StyledFlowListMetaRow',
})`
  display: flex;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing.xs}px;
`;

const StyledFlowListMetaPill = styled.div.withConfig({
  displayName: 'OpdFlowWorkbench_StyledFlowListMetaPill',
  componentId: 'OpdFlowWorkbench_StyledFlowListMetaPill',
})`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  border-radius: ${({ theme }) => theme.radius.md}px;
  border: 1px solid ${({ theme }) => theme.colors.border.light};
  padding: 4px ${({ theme }) => theme.spacing.xs + 1}px;
  background-color: ${({ theme }) => theme.colors.surface.secondary};
`;

const StyledFlowListMetaLabel = styled.span.withConfig({
  displayName: 'OpdFlowWorkbench_StyledFlowListMetaLabel',
  componentId: 'OpdFlowWorkbench_StyledFlowListMetaLabel',
})`
  font-family: ${({ theme }) => theme.typography.fontFamily.medium};
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: ${({ theme }) => theme.typography.fontSize.xs}px;
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  text-transform: uppercase;
  letter-spacing: 0.02em;
`;

const StyledFlowListMetaValue = styled.span.withConfig({
  displayName: 'OpdFlowWorkbench_StyledFlowListMetaValue',
  componentId: 'OpdFlowWorkbench_StyledFlowListMetaValue',
})`
  font-family: ${({ theme }) => theme.typography.fontFamily.bold};
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: ${({ theme }) => theme.typography.fontSize.sm}px;
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  font-variant-numeric: tabular-nums;
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

const StyledLinkedRecordItem = styled.div.withConfig({
  displayName: 'OpdFlowWorkbench_StyledLinkedRecordItem',
  componentId: 'OpdFlowWorkbench_StyledLinkedRecordItem',
})`
  border: 1px solid ${({ theme }) => theme.colors.border.light};
  border-radius: ${({ theme }) => theme.radius.md}px;
  background-color: ${({ theme }) => theme.colors.surface.primary};
  padding: ${({ theme }) => `${theme.spacing.xs + 2}px ${theme.spacing.sm + 1}px`};
`;

const StyledLinkedRecordLabel = styled.p.withConfig({
  displayName: 'OpdFlowWorkbench_StyledLinkedRecordLabel',
  componentId: 'OpdFlowWorkbench_StyledLinkedRecordLabel',
})`
  margin: 0;
  font-family: ${({ theme }) => theme.typography.fontFamily.medium};
  color: ${({ theme }) => theme.colors.text.tertiary};
  font-size: ${({ theme }) => theme.typography.fontSize.xs}px;
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  letter-spacing: 0.02em;
`;

const StyledLinkedRecordValue = styled.p.withConfig({
  displayName: 'OpdFlowWorkbench_StyledLinkedRecordValue',
  componentId: 'OpdFlowWorkbench_StyledLinkedRecordValue',
})`
  margin: ${({ theme }) => `${theme.spacing.xs - 2}px 0 0 0`};
  font-family: ${({ theme }) => theme.typography.fontFamily.bold};
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: ${({ theme }) => theme.typography.fontSize.md}px;
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  line-height: ${({ theme }) => Math.round(theme.typography.fontSize.md * 1.25)}px;
  font-variant-numeric: tabular-nums;
`;

const StyledMeta = styled.p.withConfig({
  displayName: 'OpdFlowWorkbench_StyledMeta',
  componentId: 'OpdFlowWorkbench_StyledMeta',
})`
  margin: 0;
  font-family: ${({ theme }) => theme.typography.fontFamily.regular};
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
  overflow-anchor: none;
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
  font-family: ${({ theme }) => theme.typography.fontFamily.bold};
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: ${({ theme }) => theme.typography.fontSize.md}px;
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
  font-family: ${({ theme }) => theme.typography.fontFamily.regular};
  font-size: ${({ theme }) => theme.typography.fontSize.sm}px;
  line-height: ${({ theme }) => Math.round(theme.typography.fontSize.sm * 1.35)}px;
`;

const StyledTimelineMeta = styled.span.withConfig({
  displayName: 'OpdFlowWorkbench_StyledTimelineMeta',
  componentId: 'OpdFlowWorkbench_StyledTimelineMeta',
})`
  color: ${({ theme }) => theme.colors.text.secondary};
  font-family: ${({ theme }) => theme.typography.fontFamily.regular};
  font-size: ${({ theme }) => theme.typography.fontSize.xs}px;
`;

const StyledProgressTracker = styled.ul.withConfig({
  displayName: 'OpdFlowWorkbench_StyledProgressTracker',
  componentId: 'OpdFlowWorkbench_StyledProgressTracker',
})`
  margin: 0;
  padding: 0;
  list-style: none;
  display: grid;
  grid-template-columns: repeat(5, minmax(0, 1fr));
  gap: ${({ theme }) => theme.spacing.xs}px;

  @media (max-width: ${({ theme }) => getTablet(theme)}px) {
    grid-template-columns: 1fr;
  }
`;

const StyledProgressStep = styled.li.withConfig({
  displayName: 'OpdFlowWorkbench_StyledProgressStep',
  componentId: 'OpdFlowWorkbench_StyledProgressStep',
})`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs}px;
  padding: ${({ theme }) => `${theme.spacing.xs + 2}px ${theme.spacing.xs + 1}px`};
  border-radius: ${({ theme }) => theme.spacing.xs}px;
  border: 1px solid
    ${({ $status, theme }) =>
      $status === 'current' ? theme.colors.primary : theme.colors.border.light};
  background: ${({ $status, theme }) =>
    $status === 'current'
      ? theme.colors.background.secondary
      : $status === 'completed'
        ? theme.colors.surface.secondary
        : theme.colors.surface.primary};
  color: ${({ $status, theme }) =>
    $status === 'current' ? theme.colors.primary : theme.colors.text.primary};
  font-family: ${({ theme }) => theme.typography.fontFamily.medium};
  font-size: ${({ theme }) => theme.typography.fontSize.sm}px;
  font-weight: ${({ $status, theme }) =>
    $status === 'current' ? theme.typography.fontWeight.semibold : theme.typography.fontWeight.medium};
`;

const StyledProgressDot = styled.span.withConfig({
  displayName: 'OpdFlowWorkbench_StyledProgressDot',
  componentId: 'OpdFlowWorkbench_StyledProgressDot',
})`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: ${({ $status, theme }) =>
    $status === 'completed' || $status === 'current'
      ? theme.colors.success
      : theme.colors.border.medium};
`;

const StyledGuidanceList = styled.ul.withConfig({
  displayName: 'OpdFlowWorkbench_StyledGuidanceList',
  componentId: 'OpdFlowWorkbench_StyledGuidanceList',
})`
  margin: 0;
  padding-left: ${({ theme }) => theme.spacing.md}px;
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs}px;
`;

export {
  StyledCardGrid,
  StyledContainer,
  StyledFieldRow,
  StyledFlowList,
  StyledFlowListBadgeWrap,
  StyledFlowListItem,
  StyledFlowListItemHeader,
  StyledFlowListMetaLabel,
  StyledFlowListMetaPill,
  StyledFlowListMetaRow,
  StyledFlowListMetaValue,
  StyledFlowListPatientMeta,
  StyledFlowListPrimary,
  StyledFlowListTitle,
  StyledForm,
  StyledGuidanceList,
  StyledInlineActions,
  StyledLayout,
  StyledLinkedRecordItem,
  StyledLinkedRecordLabel,
  StyledLinkedRecordValue,
  StyledMeta,
  StyledPanel,
  StyledPanelHeader,
  StyledProgressDot,
  StyledProgressStep,
  StyledProgressTracker,
  StyledSectionTitle,
  StyledTimeline,
  StyledTimelineItem,
  StyledTimelineMeta,
};
