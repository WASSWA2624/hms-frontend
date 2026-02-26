import styled from 'styled-components';
import { Pressable } from 'react-native';

const getTablet = (theme) => theme.breakpoints?.tablet ?? 960;

const StyledContainer = styled.section`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md + 4}px;
  padding: ${({ theme }) => `${theme.spacing.sm}px ${theme.spacing.sm + 2}px`};
  border-radius: ${({ theme }) => theme.radius.lg}px;
  background:
    linear-gradient(
      180deg,
      rgba(15, 118, 110, 0.06) 0%,
      rgba(15, 118, 110, 0) 72%
    ),
    ${({ theme }) => theme.colors.background.primary};
`;

const StyledHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: ${({ theme }) => theme.spacing.sm}px;
  padding: ${({ theme }) => `${theme.spacing.sm + 2}px ${theme.spacing.md}px`};
  border: 1px solid ${({ theme }) => theme.colors.border.light};
  border-radius: ${({ theme }) => theme.radius.md + 2}px;
  background: ${({ theme }) => theme.colors.surface.primary};

  @media (max-width: ${({ theme }) => getTablet(theme)}px) {
    flex-direction: column;
    align-items: stretch;
  }
`;

const StyledHeading = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs - 2}px;
`;

const StyledTitle = styled.h2`
  margin: 0;
  font-family: ${({ theme }) => theme.typography.fontFamily.bold};
  font-size: ${({ theme }) => theme.typography.fontSize.lg}px;
  color: ${({ theme }) => theme.colors.text.primary};
`;

const StyledDescription = styled.p`
  margin: 0;
  max-width: 88ch;
  font-family: ${({ theme }) => theme.typography.fontFamily.regular};
  font-size: ${({ theme }) => theme.typography.fontSize.sm}px;
  color: ${({ theme }) => theme.colors.text.secondary};
`;

const StyledLayout = styled.div`
  display: grid;
  grid-template-columns: minmax(340px, 1.05fr) minmax(0, 1.95fr);
  gap: ${({ theme }) => theme.spacing.md + 2}px;

  @media (max-width: ${({ theme }) => getTablet(theme)}px) {
    grid-template-columns: 1fr;
  }
`;

const StyledPanel = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm}px;
`;

const StyledSectionTitle = styled.h3`
  margin: 0;
  font-family: ${({ theme }) => theme.typography.fontFamily.bold};
  font-size: ${({ theme }) => theme.typography.fontSize.sm + 1}px;
  color: ${({ theme }) => theme.colors.text.primary};
`;

const StyledFilterGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: ${({ theme }) => theme.spacing.sm}px;

  @media (max-width: ${({ theme }) => getTablet(theme)}px) {
    grid-template-columns: 1fr;
  }
`;

const StyledFlowList = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs + 1}px;
  height: clamp(360px, 72vh, 820px);
  overflow-y: auto;
  padding-right: ${({ theme }) => theme.spacing.xs}px;
  overscroll-behavior: contain;

  &::-webkit-scrollbar {
    width: 9px;
  }

  &::-webkit-scrollbar-thumb {
    background: ${({ theme }) => theme.colors.border.medium};
    border-radius: 999px;
  }

  @media (max-width: ${({ theme }) => getTablet(theme)}px) {
    max-height: none;
    overflow: visible;
    padding-right: 0;
  }
`;

const StyledFlowListItem = styled(Pressable)`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs}px;
  border: 1px solid
    ${({ $selected, theme }) =>
      $selected ? '#0f766e' : theme.colors.border.light};
  border-left: 4px solid
    ${({ $selected, theme }) =>
      $selected ? '#0f766e' : theme.colors.border.medium};
  border-radius: ${({ theme }) => theme.radius.md + 2}px;
  padding: ${({ theme }) => `${theme.spacing.xs + 2}px ${theme.spacing.sm}px`};
  background: ${({ theme, $selected }) =>
    $selected ? '#effcf8' : theme.colors.surface.primary};
  box-shadow: ${({ $selected }) =>
    $selected
      ? '0 8px 18px rgba(15, 118, 110, 0.2)'
      : '0 2px 8px rgba(15, 23, 42, 0.1)'};
  transition:
    border-color 0.2s ease,
    background-color 0.2s ease,
    box-shadow 0.2s ease;

  &:hover {
    border-color: #0f766e;
    background: #f4fffb;
  }
`;

const StyledFlowTitleRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing.xs}px;
`;

const StyledFlowTitle = styled.p`
  margin: 0;
  font-family: ${({ theme }) => theme.typography.fontFamily.bold};
  font-size: ${({ theme }) => theme.typography.fontSize.sm + 1}px;
  color: ${({ theme }) => theme.colors.text.primary};
`;

const StyledFlowMeta = styled.p`
  margin: 0;
  font-family: ${({ theme }) => theme.typography.fontFamily.regular};
  font-size: ${({ theme }) => theme.typography.fontSize.xs}px;
  color: ${({ theme }) => theme.colors.text.secondary};
`;

const StyledInlineActions = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs}px;
`;

const StyledTabRow = styled(StyledInlineActions)`
  gap: ${({ theme }) => theme.spacing.xs - 1}px;
`;

const StyledFieldRow = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: ${({ theme }) => theme.spacing.sm}px;

  @media (max-width: ${({ theme }) => getTablet(theme)}px) {
    grid-template-columns: 1fr;
  }
`;

const StyledSnapshotGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: ${({ theme }) => theme.spacing.sm}px;

  @media (max-width: ${({ theme }) => getTablet(theme)}px) {
    grid-template-columns: 1fr;
  }
`;

const StyledSnapshotField = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
  border: 1px solid ${({ theme }) => theme.colors.border.light};
  border-radius: ${({ theme }) => theme.radius.md}px;
  padding: ${({ theme }) => `${theme.spacing.xs + 1}px ${theme.spacing.sm}px`};
`;

const StyledSnapshotLabel = styled.span`
  font-family: ${({ theme }) => theme.typography.fontFamily.medium};
  font-size: ${({ theme }) => theme.typography.fontSize.xs}px;
  color: ${({ theme }) => theme.colors.text.tertiary};
`;

const StyledSnapshotValue = styled.span`
  font-family: ${({ theme }) => theme.typography.fontFamily.bold};
  font-size: ${({ theme }) => theme.typography.fontSize.sm}px;
  color: ${({ theme }) => theme.colors.text.primary};
`;

const StyledTimeline = styled.ul`
  margin: 0;
  padding-left: ${({ theme }) => theme.spacing.md}px;
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs}px;
`;

const StyledTimelineItem = styled.li`
  font-family: ${({ theme }) => theme.typography.fontFamily.regular};
  font-size: ${({ theme }) => theme.typography.fontSize.sm}px;
  color: ${({ theme }) => theme.colors.text.primary};
`;

const StyledErrorText = styled.p`
  margin: 0;
  font-family: ${({ theme }) => theme.typography.fontFamily.medium};
  font-size: ${({ theme }) => theme.typography.fontSize.sm}px;
  color: ${({ theme }) => theme.colors.error};
`;

export {
  StyledContainer,
  StyledHeader,
  StyledHeading,
  StyledTitle,
  StyledDescription,
  StyledLayout,
  StyledPanel,
  StyledSectionTitle,
  StyledFilterGrid,
  StyledFlowList,
  StyledFlowListItem,
  StyledFlowTitleRow,
  StyledFlowTitle,
  StyledFlowMeta,
  StyledInlineActions,
  StyledTabRow,
  StyledFieldRow,
  StyledSnapshotGrid,
  StyledSnapshotField,
  StyledSnapshotLabel,
  StyledSnapshotValue,
  StyledTimeline,
  StyledTimelineItem,
  StyledErrorText,
};
