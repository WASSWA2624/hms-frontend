import styled from 'styled-components';
import { Pressable } from 'react-native';

const getDesktop = (theme) => theme.breakpoints?.desktop ?? 1280;
const getTablet = (theme) => theme.breakpoints?.tablet ?? 960;

const StyledContainer = styled.section`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md + 4}px;
  padding: ${({ theme }) => `${theme.spacing.sm}px ${theme.spacing.sm + 2}px`};
  border-radius: ${({ theme }) => theme.radius.lg}px;
  background:
    linear-gradient(145deg, rgba(17, 94, 89, 0.09) 0%, rgba(17, 94, 89, 0) 68%),
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
  max-width: 92ch;
  font-family: ${({ theme }) => theme.typography.fontFamily.regular};
  font-size: ${({ theme }) => theme.typography.fontSize.sm}px;
  color: ${({ theme }) => theme.colors.text.secondary};
`;

const StyledInlineActions = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing.xs}px;
  align-items: center;
`;

const StyledSummaryGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: ${({ theme }) => theme.spacing.sm}px;

  @media (max-width: ${({ theme }) => getDesktop(theme)}px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  @media (max-width: ${({ theme }) => getTablet(theme)}px) {
    grid-template-columns: 1fr;
  }
`;

const StyledSummaryTile = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs}px;
  padding: ${({ theme }) => `${theme.spacing.sm}px ${theme.spacing.sm + 1}px`};
  border: 1px solid ${({ theme }) => theme.colors.border.light};
  border-radius: ${({ theme }) => theme.radius.md + 2}px;
  background: ${({ theme }) => theme.colors.surface.primary};
`;

const StyledSummaryLabel = styled.span`
  font-family: ${({ theme }) => theme.typography.fontFamily.medium};
  font-size: ${({ theme }) => theme.typography.fontSize.xs}px;
  color: ${({ theme }) => theme.colors.text.secondary};
`;

const StyledSummaryValue = styled.span`
  font-family: ${({ theme }) => theme.typography.fontFamily.bold};
  font-size: ${({ theme }) => theme.typography.fontSize.lg}px;
  color: ${({ theme }) => theme.colors.text.primary};
`;

const StyledWorkspaceGrid = styled.div`
  display: grid;
  grid-template-columns: minmax(320px, 0.95fr) minmax(360px, 1.25fr) minmax(320px, 1fr);
  gap: ${({ theme }) => theme.spacing.md + 2}px;

  @media (max-width: ${({ theme }) => getDesktop(theme)}px) {
    grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
  }

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

const StyledQueueList = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs + 1}px;
`;

const StyledQueueItem = styled(Pressable)`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs}px;
  border: 1px solid ${({ $active, theme }) => ($active ? '#0d9488' : theme.colors.border.light)};
  border-left: 4px solid ${({ $active, theme }) => ($active ? '#0f766e' : theme.colors.border.medium)};
  border-radius: ${({ theme }) => theme.radius.md + 2}px;
  padding: ${({ theme }) => `${theme.spacing.xs + 2}px ${theme.spacing.sm}px`};
  background: ${({ $active, theme }) => ($active ? '#ecfeff' : theme.colors.surface.primary)};
`;

const StyledQueueLabel = styled.span`
  font-family: ${({ theme }) => theme.typography.fontFamily.medium};
  font-size: ${({ theme }) => theme.typography.fontSize.sm}px;
  color: ${({ theme }) => theme.colors.text.primary};
`;

const StyledQueueCount = styled.span`
  min-width: 32px;
  text-align: center;
  font-family: ${({ theme }) => theme.typography.fontFamily.bold};
  font-size: ${({ theme }) => theme.typography.fontSize.sm}px;
  color: ${({ theme }) => theme.colors.text.primary};
`;

const StyledRecordsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs + 1}px;
  max-height: clamp(320px, 56vh, 760px);
  overflow-y: auto;
  padding-right: ${({ theme }) => theme.spacing.xs}px;

  @media (max-width: ${({ theme }) => getTablet(theme)}px) {
    max-height: none;
    overflow: visible;
    padding-right: 0;
  }
`;

const StyledRecordItem = styled(Pressable)`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs}px;
  border: 1px solid ${({ $active, theme }) => ($active ? '#0d9488' : theme.colors.border.light)};
  border-radius: ${({ theme }) => theme.radius.md + 2}px;
  padding: ${({ theme }) => `${theme.spacing.xs + 2}px ${theme.spacing.sm}px`};
  background: ${({ $active, theme }) => ($active ? '#f0fdfa' : theme.colors.surface.primary)};
`;

const StyledRecordMeta = styled.span`
  font-family: ${({ theme }) => theme.typography.fontFamily.regular};
  font-size: ${({ theme }) => theme.typography.fontSize.xs + 1}px;
  color: ${({ theme }) => theme.colors.text.secondary};
`;

const StyledGroupBlock = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs}px;
`;

const StyledGroupTitle = styled.h4`
  margin: 0;
  font-family: ${({ theme }) => theme.typography.fontFamily.bold};
  font-size: ${({ theme }) => theme.typography.fontSize.sm}px;
  color: ${({ theme }) => theme.colors.text.primary};
`;

const StyledFormGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: ${({ theme }) => theme.spacing.sm}px;

  @media (max-width: ${({ theme }) => getTablet(theme)}px) {
    grid-template-columns: 1fr;
  }
`;

const StyledMessageText = styled.p`
  margin: 0;
  font-family: ${({ theme }) => theme.typography.fontFamily.medium};
  font-size: ${({ theme }) => theme.typography.fontSize.xs + 1}px;
  color: ${({ $variant, theme }) =>
    $variant === 'error'
      ? theme.colors.error
      : $variant === 'success'
        ? '#0f766e'
        : theme.colors.text.secondary};
`;

const StyledStickyActions = styled.div`
  display: none;

  @media (max-width: ${({ theme }) => getTablet(theme)}px) {
    position: sticky;
    bottom: 10px;
    z-index: 2;
    display: flex;
    justify-content: flex-end;
  }
`;

export {
  StyledContainer,
  StyledHeader,
  StyledHeading,
  StyledTitle,
  StyledDescription,
  StyledInlineActions,
  StyledSummaryGrid,
  StyledSummaryTile,
  StyledSummaryLabel,
  StyledSummaryValue,
  StyledWorkspaceGrid,
  StyledPanel,
  StyledSectionTitle,
  StyledQueueList,
  StyledQueueItem,
  StyledQueueLabel,
  StyledQueueCount,
  StyledRecordsList,
  StyledRecordItem,
  StyledRecordMeta,
  StyledGroupBlock,
  StyledGroupTitle,
  StyledFormGrid,
  StyledMessageText,
  StyledStickyActions,
};
