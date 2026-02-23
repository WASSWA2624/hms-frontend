import styled from 'styled-components/native';

const StyledContainer = styled.View`
  flex: 1;
  gap: ${({ theme }) => theme.spacing.sm + theme.spacing.xs + 2}px;
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
  gap: ${({ theme }) => theme.spacing.sm}px;
`;

const StyledSummaryValue = styled.Text`
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
  StyledPanelRow,
  StyledSummaryGrid,
  StyledSummaryValue,
  StyledTabRow,
};
