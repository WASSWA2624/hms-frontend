import styled from 'styled-components/native';
import { Card, Text } from '@platform/components';

const StyledContainer = styled.View`
  width: 100%;
  align-self: center;
  max-width: 1180px;
  gap: ${({ theme }) => theme.spacing.md}px;
  padding-bottom: ${({ theme }) => theme.spacing.md}px;
`;

const StyledBreadcrumbActionGroup = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
  align-items: center;
  justify-content: flex-start;
  gap: ${({ theme }) => theme.spacing.sm}px;
`;

const StyledToolbarCard = styled(Card)`
  gap: ${({ theme }) => theme.spacing.xs}px;
  padding: 0;
  overflow: visible;
`;

const StyledAdvancedFilters = styled.View`
  gap: ${({ theme }) => theme.spacing.sm + theme.spacing.xs}px;
  border-top-width: 1px;
  border-top-color: ${({ theme }) => theme.colors.border.light};
  padding-top: ${({ theme }) => theme.spacing.sm + theme.spacing.xs}px;
`;

const StyledToolbarGrid = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm}px;
`;

const StyledToolbarField = styled.View`
  flex-basis: 280px;
  flex-grow: 1;
  min-width: 180px;
`;

const StyledSearchRow = styled.View`
  flex-direction: row;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm}px;
`;

const StyledSearchInputSlot = styled.View`
  flex: 1;
  min-width: 220px;
`;

const StyledSearchHelpAnchor = styled.View`
  position: relative;
  z-index: 2147483002;
`;

const StyledSearchHelpButton = styled.Pressable`
  min-width: 44px;
  min-height: 44px;
  width: 44px;
  height: 44px;
  border-radius: ${({ theme }) => theme.radius.full}px;
  align-items: center;
  justify-content: center;
  border-width: 1px;
  border-color: ${({ theme }) => theme.colors.border.medium};
  background-color: ${({ theme }) => theme.colors.background.surface};
`;

const StyledSearchHelpBody = styled(Text)`
  margin-top: ${({ theme }) => theme.spacing.sm}px;
`;

const StyledSearchHelpList = styled.View`
  margin-top: ${({ theme }) => theme.spacing.sm + theme.spacing.xs}px;
  gap: ${({ theme }) => theme.spacing.xs + 2}px;
`;

const StyledSearchHelpItem = styled(Text)`
  font-size: ${({ theme }) => theme.typography.fontSize.xs}px;
`;

const StyledListCard = styled(Card)`
  gap: ${({ theme }) => theme.spacing.xs + 2}px;
  padding: ${({ theme }) => theme.spacing.xs}px;
`;

const StyledPaginationRow = styled.View`
  margin-top: ${({ theme }) => theme.spacing.xs}px;
  flex-direction: row;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing.sm + theme.spacing.xs}px;
`;

const StyledPaginationActions = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm}px;
`;

const StyledRowsControl = styled.View`
  flex-direction: row;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs + 2}px;
`;

const StyledRowsSelectSlot = styled.View`
  width: 96px;
`;

const StyledFilterActions = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: flex-start;
  gap: ${({ theme }) => theme.spacing.sm}px;
`;

export {
  StyledAdvancedFilters,
  StyledBreadcrumbActionGroup,
  StyledContainer,
  StyledFilterActions,
  StyledListCard,
  StyledPaginationActions,
  StyledPaginationRow,
  StyledRowsControl,
  StyledRowsSelectSlot,
  StyledSearchHelpAnchor,
  StyledSearchHelpBody,
  StyledSearchHelpButton,
  StyledSearchHelpItem,
  StyledSearchHelpList,
  StyledSearchInputSlot,
  StyledSearchRow,
  StyledToolbarCard,
  StyledToolbarField,
  StyledToolbarGrid,
};
