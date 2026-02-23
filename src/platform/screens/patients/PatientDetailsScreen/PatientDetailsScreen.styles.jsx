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

const StyledChromeTabsRail = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
  align-items: flex-end;
  gap: ${({ theme }) => theme.spacing.xs}px;
  padding: ${({ theme }) => theme.spacing.xs}px;
  border-width: 1px;
  border-color: ${({ theme }) => theme.colors.border.light};
  border-radius: ${({ theme }) => theme.radius.lg}px;
  background-color: ${({ theme }) => theme.colors.background.secondary};
`;

const StyledChromeTab = styled.Pressable`
  flex-direction: row;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing.xs}px;
  min-height: 28px;
  min-width: ${({ $isCompact }) => ($isCompact ? '48%' : '140px')};
  padding-vertical: ${({ theme }) => theme.spacing.xs}px;
  padding-horizontal: ${({ theme, $isCompact }) => (
    $isCompact ? theme.spacing.sm : theme.spacing.md
  )}px;
  border-width: 1px;
  border-color: ${({ theme }) => theme.colors.border.light};
  border-top-left-radius: ${({ theme }) => theme.radius.lg + 4}px;
  border-top-right-radius: ${({ theme }) => theme.radius.lg + 4}px;
  border-bottom-left-radius: ${({ theme }) => theme.radius.xs}px;
  border-bottom-right-radius: ${({ theme }) => theme.radius.xs}px;
  border-bottom-width: ${({ $isActive }) => ($isActive ? 0 : 1)}px;
  background-color: ${({ theme, $isActive }) => (
    $isActive ? theme.colors.background.primary : theme.colors.background.tertiary
  )};
  margin-bottom: ${({ $isActive }) => ($isActive ? '-1px' : '0px')};
  opacity: ${({ $isActive }) => ($isActive ? 1 : 0.95)};
`;

const StyledChromeTabLabel = styled.Text`
  color: ${({ theme, $isActive }) => (
    $isActive ? theme.colors.text.primary : theme.colors.text.secondary
  )};
  font-size: ${({ theme }) => theme.typography.fontSize.xs}px;
  font-weight: ${({ theme, $isActive }) => (
    $isActive ? theme.typography.fontWeight.semibold : theme.typography.fontWeight.medium
  )};
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

const StyledResourceSection = styled.View`
  gap: ${({ theme }) => theme.spacing.sm}px;
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
  align-items: center;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing.sm}px;
`;

const StyledItemActions = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing.xs}px;
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

export {
  StyledActions,
  StyledChromeTab,
  StyledChromeTabLabel,
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
