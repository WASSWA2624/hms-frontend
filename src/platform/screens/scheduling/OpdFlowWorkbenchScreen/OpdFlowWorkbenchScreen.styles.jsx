import styled from 'styled-components';
import { Pressable } from 'react-native';

const getTablet = (theme) => theme.breakpoints?.tablet ?? 960;
const PROGRESS_TONE_MAP = Object.freeze({
  indigo: {
    surface: '#eef2ff',
    border: '#4f46e5',
    text: '#312e81',
    dot: '#4f46e5',
  },
  amber: {
    surface: '#fff7ed',
    border: '#d97706',
    text: '#92400e',
    dot: '#f59e0b',
  },
  teal: {
    surface: '#ecfeff',
    border: '#0f766e',
    text: '#115e59',
    dot: '#14b8a6',
  },
  violet: {
    surface: '#f5f3ff',
    border: '#7c3aed',
    text: '#5b21b6',
    dot: '#8b5cf6',
  },
  green: {
    surface: '#ecfdf3',
    border: '#15803d',
    text: '#166534',
    dot: '#22c55e',
  },
});

const resolveProgressTone = (tone) => PROGRESS_TONE_MAP[tone] || PROGRESS_TONE_MAP.indigo;

const StyledContainer = styled.section.withConfig({
  displayName: 'OpdFlowWorkbench_StyledContainer',
  componentId: 'OpdFlowWorkbench_StyledContainer',
})`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md + 4}px;
  padding: ${({ theme }) => `${theme.spacing.sm}px ${theme.spacing.sm + 2}px`};
  border-radius: ${({ theme }) => theme.radius.lg}px;
  background:
    linear-gradient(180deg, rgba(15, 23, 42, 0.025) 0%, rgba(15, 23, 42, 0) 90%),
    ${({ theme }) => theme.colors.background.primary};
`;

const StyledLayout = styled.div.withConfig({
  displayName: 'OpdFlowWorkbench_StyledLayout',
  componentId: 'OpdFlowWorkbench_StyledLayout',
})`
  display: grid;
  grid-template-columns: minmax(340px, 1.05fr) minmax(0, 1.9fr);
  gap: ${({ theme }) => theme.spacing.md + 2}px;
  align-items: start;

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
  gap: ${({ theme }) => theme.spacing.sm + 2}px;
  min-height: 0;
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

const StyledWorkbenchHeader = styled.div.withConfig({
  displayName: 'OpdFlowWorkbench_StyledWorkbenchHeader',
  componentId: 'OpdFlowWorkbench_StyledWorkbenchHeader',
})`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing.sm}px;
  border: 1px solid ${({ theme }) => theme.colors.border.light};
  border-radius: ${({ theme }) => theme.radius.md + 2}px;
  background: ${({ theme }) => theme.colors.surface.primary};
  padding: ${({ theme }) => `${theme.spacing.sm + 2}px ${theme.spacing.md}px`};

  @media (max-width: ${({ theme }) => getTablet(theme)}px) {
    flex-direction: column;
    align-items: stretch;
  }
`;

const StyledWorkbenchHeading = styled.div.withConfig({
  displayName: 'OpdFlowWorkbench_StyledWorkbenchHeading',
  componentId: 'OpdFlowWorkbench_StyledWorkbenchHeading',
})`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs - 2}px;
  min-width: 0;
`;

const StyledWorkbenchTitle = styled.h2.withConfig({
  displayName: 'OpdFlowWorkbench_StyledWorkbenchTitle',
  componentId: 'OpdFlowWorkbench_StyledWorkbenchTitle',
})`
  margin: 0;
  font-family: ${({ theme }) => theme.typography.fontFamily.bold};
  font-size: ${({ theme }) => theme.typography.fontSize.lg}px;
  line-height: ${({ theme }) => Math.round(theme.typography.fontSize.lg * 1.2)}px;
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  color: ${({ theme }) => theme.colors.text.primary};
`;

const StyledWorkbenchDescription = styled.p.withConfig({
  displayName: 'OpdFlowWorkbench_StyledWorkbenchDescription',
  componentId: 'OpdFlowWorkbench_StyledWorkbenchDescription',
})`
  margin: 0;
  font-family: ${({ theme }) => theme.typography.fontFamily.regular};
  font-size: ${({ theme }) => theme.typography.fontSize.sm}px;
  line-height: ${({ theme }) => Math.round(theme.typography.fontSize.sm * 1.4)}px;
  color: ${({ theme }) => theme.colors.text.secondary};
  max-width: 76ch;
`;

const StyledFlowList = styled.div.withConfig({
  displayName: 'OpdFlowWorkbench_StyledFlowList',
  componentId: 'OpdFlowWorkbench_StyledFlowList',
})`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm}px;
  max-height: min(62vh, 740px);
  overflow-y: auto;
  padding-right: ${({ theme }) => theme.spacing.xs}px;
  overscroll-behavior: contain;
  scrollbar-gutter: stable both-edges;

  &::-webkit-scrollbar {
    width: 9px;
  }

  &::-webkit-scrollbar-thumb {
    background: ${({ theme }) => theme.colors.border.medium};
    border-radius: 999px;
  }

  &::-webkit-scrollbar-track {
    background: transparent;
  }

  @media (max-width: ${({ theme }) => getTablet(theme)}px) {
    max-height: none;
    overflow: visible;
    padding-right: 0;
  }
`;

const StyledFlowListItem = styled(Pressable).withConfig({
  displayName: 'OpdFlowWorkbench_StyledFlowListItem',
  componentId: 'OpdFlowWorkbench_StyledFlowListItem',
  shouldForwardProp: (prop) => !['$selected'].includes(prop),
})`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs + 2}px;
  min-height: 96px;
  border-radius: ${({ theme }) => theme.radius.md + 2}px;
  border-width: 1px;
  border-style: solid;
  border-color: ${({ theme, $selected }) =>
    $selected ? theme.colors.primary : theme.colors.border.medium};
  border-left-width: 3px;
  border-left-color: ${({ theme, $selected }) =>
    $selected ? theme.colors.primary : theme.colors.border.medium};
  background-color: ${({ theme, $selected }) =>
    $selected ? theme.colors.background.secondary : theme.colors.surface.primary};
  padding: ${({ theme }) => `${theme.spacing.sm - 1}px ${theme.spacing.sm + 1}px`};
  text-align: left;
  cursor: ${({ disabled }) => (disabled ? 'default' : 'pointer')};
  box-shadow: ${({ $selected }) =>
    $selected ? '0 6px 14px rgba(0, 120, 212, 0.14)' : '0 1px 3px rgba(0, 0, 0, 0.07)'};
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
      $selected ? '0 6px 16px rgba(0, 120, 212, 0.2)' : '0 4px 10px rgba(0, 0, 0, 0.1)'};
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
  align-items: flex-start;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing.xs}px;
`;

const StyledFlowListNumber = styled.span.withConfig({
  displayName: 'OpdFlowWorkbench_StyledFlowListNumber',
  componentId: 'OpdFlowWorkbench_StyledFlowListNumber',
})`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 20px;
  height: 20px;
  border-radius: 999px;
  border: 1px solid ${({ theme }) => theme.colors.border.medium};
  background: ${({ theme }) => theme.colors.surface.secondary};
  color: ${({ theme }) => theme.colors.text.secondary};
  font-family: ${({ theme }) => theme.typography.fontFamily.bold};
  font-size: ${({ theme }) => theme.typography.fontSize.xs}px;
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  font-variant-numeric: tabular-nums;
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
  font-size: ${({ theme }) => theme.typography.fontSize.sm + 1}px;
  line-height: ${({ theme }) =>
    Math.round((theme.typography.fontSize.sm + 1) * 1.2)}px;
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
  font-size: ${({ theme }) => theme.typography.fontSize.xs}px;
  line-height: ${({ theme }) => Math.round(theme.typography.fontSize.xs * 1.35)}px;
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
  gap: ${({ theme }) => theme.spacing.xs + 2}px;
`;

const StyledFlowListMetaPill = styled.div.withConfig({
  displayName: 'OpdFlowWorkbench_StyledFlowListMetaPill',
  componentId: 'OpdFlowWorkbench_StyledFlowListMetaPill',
})`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  border-radius: ${({ theme }) => theme.radius.sm + 2}px;
  border: 1px solid ${({ theme }) => theme.colors.border.light};
  padding: ${({ theme }) => `${theme.spacing.xs - 2}px ${theme.spacing.xs + 4}px`};
  background-color: ${({ theme }) => theme.colors.surface.secondary};
`;

const StyledFlowListMetaLabel = styled.span.withConfig({
  displayName: 'OpdFlowWorkbench_StyledFlowListMetaLabel',
  componentId: 'OpdFlowWorkbench_StyledFlowListMetaLabel',
})`
  font-family: ${({ theme }) => theme.typography.fontFamily.medium};
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: ${({ theme }) => theme.typography.fontSize.xs - 1}px;
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
  font-size: ${({ theme }) => theme.typography.fontSize.xs + 1}px;
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  font-variant-numeric: tabular-nums;
`;

const StyledFlowListSearch = styled.div.withConfig({
  displayName: 'OpdFlowWorkbench_StyledFlowListSearch',
  componentId: 'OpdFlowWorkbench_StyledFlowListSearch',
})`
  margin-top: ${({ theme }) => theme.spacing.xs}px;
`;

const StyledCardGrid = styled.div.withConfig({
  displayName: 'OpdFlowWorkbench_StyledCardGrid',
  componentId: 'OpdFlowWorkbench_StyledCardGrid',
})`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: ${({ theme }) => theme.spacing.sm + 1}px;

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
  padding: ${({ theme }) => `${theme.spacing.sm}px ${theme.spacing.sm + 2}px`};
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
  font-size: ${({ theme }) => theme.typography.fontSize.sm}px;
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  line-height: ${({ theme }) => Math.round(theme.typography.fontSize.sm * 1.25)}px;
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

const StyledLookupActions = styled.div.withConfig({
  displayName: 'OpdFlowWorkbench_StyledLookupActions',
  componentId: 'OpdFlowWorkbench_StyledLookupActions',
})`
  display: flex;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing.xs}px;
`;

const StyledContextCard = styled.div.withConfig({
  displayName: 'OpdFlowWorkbench_StyledContextCard',
  componentId: 'OpdFlowWorkbench_StyledContextCard',
})`
  border: 1px solid ${({ theme }) => theme.colors.border.light};
  border-radius: ${({ theme }) => theme.radius.md}px;
  background: ${({ theme }) => theme.colors.surface.secondary};
  padding: ${({ theme }) => theme.spacing.sm}px;
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs}px;
`;

const StyledContextGrid = styled.div.withConfig({
  displayName: 'OpdFlowWorkbench_StyledContextGrid',
  componentId: 'OpdFlowWorkbench_StyledContextGrid',
})`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: ${({ theme }) => theme.spacing.xs}px;
`;

const StyledContextValue = styled.p.withConfig({
  displayName: 'OpdFlowWorkbench_StyledContextValue',
  componentId: 'OpdFlowWorkbench_StyledContextValue',
})`
  margin: 0;
  font-family: ${({ theme }) => theme.typography.fontFamily.medium};
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: ${({ theme }) => theme.typography.fontSize.sm}px;
`;

const StyledShortcutActions = styled.div.withConfig({
  displayName: 'OpdFlowWorkbench_StyledShortcutActions',
  componentId: 'OpdFlowWorkbench_StyledShortcutActions',
})`
  display: flex;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing.xs}px;
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

const StyledVitalInsightRow = styled.div.withConfig({
  displayName: 'OpdFlowWorkbench_StyledVitalInsightRow',
  componentId: 'OpdFlowWorkbench_StyledVitalInsightRow',
})`
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing.xs}px;
`;

const StyledTriageLegend = styled.div.withConfig({
  displayName: 'OpdFlowWorkbench_StyledTriageLegend',
  componentId: 'OpdFlowWorkbench_StyledTriageLegend',
})`
  display: flex;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing.xs}px;
`;

const StyledTriageLegendItem = styled.div.withConfig({
  displayName: 'OpdFlowWorkbench_StyledTriageLegendItem',
  componentId: 'OpdFlowWorkbench_StyledTriageLegendItem',
})`
  display: inline-flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs}px;
`;

const StyledSectionTitle = styled.h3.withConfig({
  displayName: 'OpdFlowWorkbench_StyledSectionTitle',
  componentId: 'OpdFlowWorkbench_StyledSectionTitle',
})`
  margin: 0;
  font-family: ${({ theme }) => theme.typography.fontFamily.bold};
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: ${({ theme }) => theme.typography.fontSize.sm + 1}px;
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
  line-height: ${({ theme }) => Math.round(theme.typography.fontSize.sm * 1.5)}px;
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
  ${({ $tone }) => {
    const tone = resolveProgressTone($tone);
    return `
      --tone-surface: ${tone.surface};
      --tone-border: ${tone.border};
      --tone-text: ${tone.text};
      --tone-dot: ${tone.dot};
    `;
  }}
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs + 1}px;
  min-height: 44px;
  padding: ${({ theme }) => `${theme.spacing.xs + 2}px ${theme.spacing.sm - 1}px`};
  border-radius: ${({ theme }) => theme.radius.md}px;
  border: 1px solid
    ${({ $status, theme }) =>
      $status === 'current'
        ? 'var(--tone-border)'
        : $status === 'completed'
          ? 'var(--tone-border)'
          : theme.colors.border.light};
  background: ${({ $status, theme }) =>
    $status === 'current'
      ? 'var(--tone-surface)'
      : $status === 'completed'
        ? 'var(--tone-surface)'
        : theme.colors.surface.primary};
  color: ${({ $status, theme }) =>
    $status === 'current' || $status === 'completed'
      ? 'var(--tone-text)'
      : theme.colors.text.primary};
  font-family: ${({ theme }) => theme.typography.fontFamily.medium};
  font-size: ${({ theme }) => theme.typography.fontSize.xs - 1}px;
  line-height: ${({ theme }) => Math.round((theme.typography.fontSize.xs - 1) * 1.35)}px;
  font-weight: ${({ $status, theme }) =>
    $status === 'current' ? theme.typography.fontWeight.semibold : theme.typography.fontWeight.medium};
`;

const StyledProgressStepIndex = styled.span.withConfig({
  displayName: 'OpdFlowWorkbench_StyledProgressStepIndex',
  componentId: 'OpdFlowWorkbench_StyledProgressStepIndex',
})`
  min-width: 18px;
  height: 18px;
  border-radius: 999px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-family: ${({ theme }) => theme.typography.fontFamily.bold};
  font-size: ${({ theme }) => theme.typography.fontSize.xs - 2}px;
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  border: 1px solid
    ${({ $status, theme }) =>
      $status === 'current' || $status === 'completed'
        ? 'var(--tone-border)'
        : theme.colors.border.medium};
  background: ${({ $status, theme }) =>
    $status === 'current' || $status === 'completed'
      ? 'var(--tone-surface)'
      : theme.colors.surface.secondary};
  color: ${({ $status, theme }) =>
    $status === 'current' || $status === 'completed'
      ? 'var(--tone-text)'
      : theme.colors.text.secondary};
  flex-shrink: 0;
`;

const StyledProgressDot = styled.span.withConfig({
  displayName: 'OpdFlowWorkbench_StyledProgressDot',
  componentId: 'OpdFlowWorkbench_StyledProgressDot',
})`
  ${({ $tone }) => {
    const tone = resolveProgressTone($tone);
    return `
      --tone-dot: ${tone.dot};
      --tone-muted: #d1d5db;
    `;
  }}
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: ${({ $status, theme }) =>
    $status === 'completed' || $status === 'current'
      ? 'var(--tone-dot)'
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

const StyledProgressLegend = styled.div.withConfig({
  displayName: 'OpdFlowWorkbench_StyledProgressLegend',
  componentId: 'OpdFlowWorkbench_StyledProgressLegend',
})`
  display: flex;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing.xs}px;
  margin-top: ${({ theme }) => theme.spacing.xs}px;
`;

const StyledProgressLegendItem = styled.div.withConfig({
  displayName: 'OpdFlowWorkbench_StyledProgressLegendItem',
  componentId: 'OpdFlowWorkbench_StyledProgressLegendItem',
})`
  display: inline-flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs}px;
`;

const StyledModalBody = styled.div.withConfig({
  displayName: 'OpdFlowWorkbench_StyledModalBody',
  componentId: 'OpdFlowWorkbench_StyledModalBody',
})`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm}px;
`;

export {
  StyledCardGrid,
  StyledContainer,
  StyledFieldRow,
  StyledFlowList,
  StyledFlowListBadgeWrap,
  StyledFlowListItem,
  StyledFlowListItemHeader,
  StyledFlowListNumber,
  StyledFlowListMetaLabel,
  StyledFlowListMetaPill,
  StyledFlowListMetaRow,
  StyledFlowListSearch,
  StyledFlowListMetaValue,
  StyledFlowListPatientMeta,
  StyledFlowListPrimary,
  StyledFlowListTitle,
  StyledForm,
  StyledGuidanceList,
  StyledLookupActions,
  StyledInlineActions,
  StyledLayout,
  StyledContextCard,
  StyledContextGrid,
  StyledContextValue,
  StyledLinkedRecordItem,
  StyledLinkedRecordLabel,
  StyledLinkedRecordValue,
  StyledMeta,
  StyledPanel,
  StyledPanelHeader,
  StyledProgressDot,
  StyledProgressLegend,
  StyledProgressLegendItem,
  StyledProgressStep,
  StyledProgressStepIndex,
  StyledProgressTracker,
  StyledShortcutActions,
  StyledSectionTitle,
  StyledTriageLegend,
  StyledTriageLegendItem,
  StyledModalBody,
  StyledTimeline,
  StyledTimelineItem,
  StyledTimelineMeta,
  StyledVitalInsightRow,
  StyledWorkbenchDescription,
  StyledWorkbenchHeader,
  StyledWorkbenchHeading,
  StyledWorkbenchTitle,
};
