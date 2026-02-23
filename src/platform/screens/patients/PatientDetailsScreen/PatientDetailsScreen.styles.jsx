import styled from 'styled-components/native';

const StyledContainer = styled.View`
  flex: 1;
  width: 100%;
  min-width: 0;
  gap: ${({ theme }) => theme.spacing.sm + theme.spacing.xs + 2}px;
  overflow: visible;
`;

const StyledPageNavigation = styled.View`
  width: 100%;
  min-width: 0;
  gap: ${({ theme }) => theme.spacing.sm}px;
  overflow: visible;
`;

const StyledPageNavigationTitle = styled.Text`
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: ${({ theme }) => theme.typography.fontSize.xs}px;
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  text-transform: uppercase;
`;

const StyledChromeTabsRail = styled.View`
  width: 100%;
  min-height: ${({ theme }) => theme.spacing.lg + theme.spacing.md}px;
  flex-direction: row;
  flex-wrap: wrap;
  align-items: stretch;
  gap: ${({ theme }) => theme.spacing.xs}px;
  padding: ${({ theme }) => theme.spacing.xs}px;
  border-width: 1px;
  border-color: ${({ theme }) => theme.colors.border.medium};
  border-radius: ${({ theme }) => theme.radius.lg}px;
  background-color: ${({ theme }) => theme.colors.background.tertiary};
  overflow: visible;
`;

const StyledChromeTabSlot = styled.View`
  min-height: ${({ theme }) => theme.spacing.lg + theme.spacing.xs}px;
  min-width: ${({ $isCompact }) => ($isCompact ? '48%' : '136px')};
  flex-grow: 0;
  flex-shrink: 0;
`;

const StyledSummaryGrid = styled.View`
  width: 100%;
  gap: ${({ theme }) => theme.spacing.xs + 2}px;
`;

const StyledSummarySection = styled.View`
  width: 100%;
  gap: ${({ theme }) => theme.spacing.xs}px;
`;

const StyledSummarySectionTitle = styled.Text`
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: ${({ theme }) => theme.typography.fontSize.sm}px;
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
`;

const StyledSummaryRow = styled.View`
  flex-direction: ${({ $isCompact }) => ($isCompact ? 'column' : 'row')};
  align-items: ${({ $isCompact }) => ($isCompact ? 'flex-start' : 'center')};
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing.xs}px;
  padding-vertical: ${({ theme }) => theme.spacing.xs / 2}px;
  border-bottom-width: 1px;
  border-bottom-color: ${({ theme }) => theme.colors.border.light};
`;

const StyledSummaryLabel = styled.Text`
  flex-shrink: 0;
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: ${({ theme }) => theme.typography.fontSize.xs}px;
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  text-transform: uppercase;
`;

const StyledSummaryValue = styled.Text`
  flex: 1;
  width: 100%;
  color: ${({ theme }) => theme.colors.text.secondary};
  text-align: ${({ $isCompact }) => ($isCompact ? 'left' : 'right')};
`;

const StyledReadOnlyNotice = styled.Text`
  margin-top: ${({ theme }) => theme.spacing.sm}px;
  color: ${({ theme }) => theme.colors.text.secondary};
`;

const StyledActions = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm}px;
  overflow: visible;
`;

const StyledResourceSection = styled.View`
  width: 100%;
  gap: ${({ theme }) => theme.spacing.sm}px;
  overflow: visible;
`;

const StyledResourceSectionHeader = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing.sm}px;
  margin-bottom: ${({ theme }) => theme.spacing.xs}px;
`;

const StyledResourceSectionTitle = styled.Text`
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: ${({ theme }) => theme.typography.fontSize.sm}px;
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
`;

const StyledResourceSectionDescription = styled.Text`
  color: ${({ theme }) => theme.colors.text.secondary};
  margin-bottom: ${({ theme }) => theme.spacing.sm}px;
`;

const StyledListItem = styled.View`
  border-width: 1px;
  border-color: ${({ theme }) => theme.colors.border.light};
  border-radius: ${({ theme }) => theme.radius.lg - 2}px;
  padding: ${({ theme }) => theme.spacing.sm + theme.spacing.xs}px;
  gap: ${({ theme }) => theme.spacing.xs}px;
`;

const StyledItemHeader = styled.View`
  flex-direction: row;
  align-items: flex-start;
  flex-wrap: wrap;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing.sm}px;
`;

const StyledItemActions = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing.xs}px;
`;

const StyledFieldBlock = styled.View`
  width: 100%;
  min-width: 0;
  gap: ${({ theme }) => theme.spacing.xs}px;
`;

const StyledFormGrid = styled.View`
  width: 100%;
  gap: ${({ theme }) => theme.spacing.sm + theme.spacing.xs}px;
  overflow: visible;
`;

const StyledFormActions = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
  align-items: center;
  justify-content: flex-end;
  gap: ${({ theme }) => theme.spacing.sm}px;
`;

export {
  StyledActions,
  StyledChromeTabSlot,
  StyledChromeTabsRail,
  StyledContainer,
  StyledFieldBlock,
  StyledFormActions,
  StyledFormGrid,
  StyledItemActions,
  StyledItemHeader,
  StyledListItem,
  StyledPageNavigation,
  StyledPageNavigationTitle,
  StyledReadOnlyNotice,
  StyledResourceSection,
  StyledResourceSectionDescription,
  StyledResourceSectionHeader,
  StyledResourceSectionTitle,
  StyledSummaryLabel,
  StyledSummaryGrid,
  StyledSummaryRow,
  StyledSummarySection,
  StyledSummarySectionTitle,
  StyledSummaryValue,
};
