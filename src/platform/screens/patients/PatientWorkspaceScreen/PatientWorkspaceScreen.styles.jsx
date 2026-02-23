import styled from 'styled-components/native';

const StyledContainer = styled.View`
  flex: 1;
  width: 100%;
  min-width: 0;
  gap: ${({ theme }) => theme.spacing.sm + theme.spacing.xs + 2}px;
`;

const StyledPageNavigation = styled.View`
  gap: ${({ theme }) => theme.spacing.sm}px;
`;

const StyledPageNavigationTitle = styled.Text`
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: ${({ theme }) => theme.typography.fontSize.xs}px;
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  text-transform: uppercase;
`;

const StyledPageTabsRow = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing.xs + 2}px;
`;

const StyledPageActionsRow = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing.xs + 2}px;
`;

const StyledHeader = styled.View`
  gap: ${({ theme }) => theme.spacing.xs + 2}px;
`;

const StyledTabRow = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing.sm}px;
`;

const StyledPanelRow = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing.sm}px;
`;

const StyledSummaryGrid = styled.View`
  gap: ${({ theme }) => theme.spacing.xs + 2}px;
`;

const StyledSummarySection = styled.View`
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
  gap: ${({ theme }) => theme.spacing.sm}px;
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
  align-items: center;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing.sm}px;
`;

const StyledFieldBlock = styled.View`
  gap: ${({ theme }) => theme.spacing.xs}px;
`;

const StyledFormGrid = styled.View`
  gap: ${({ theme }) => theme.spacing.sm + theme.spacing.xs}px;
`;

const StyledFormActions = styled.View`
  flex-direction: row;
  justify-content: flex-end;
  gap: ${({ theme }) => theme.spacing.sm}px;
`;

const StyledBadgeText = styled.Text`
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: ${({ theme }) => theme.typography.fontSize.xs}px;
`;

export {
  StyledActions,
  StyledBadgeText,
  StyledContainer,
  StyledFieldBlock,
  StyledFormActions,
  StyledFormGrid,
  StyledHeader,
  StyledItemHeader,
  StyledListItem,
  StyledPageActionsRow,
  StyledPageNavigation,
  StyledPageNavigationTitle,
  StyledPageTabsRow,
  StyledPanelRow,
  StyledReadOnlyNotice,
  StyledSummaryLabel,
  StyledSummaryGrid,
  StyledSummaryRow,
  StyledSummarySection,
  StyledSummarySectionTitle,
  StyledSummaryValue,
  StyledTabRow,
};
