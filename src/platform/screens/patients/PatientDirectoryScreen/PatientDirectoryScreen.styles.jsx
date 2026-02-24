import styled from 'styled-components/native';
import { Card, Text } from '@platform/components';

const StyledContainer = styled.View`
  width: 100%;
  align-self: stretch;
  max-width: 1180px;
  min-width: 0;
  gap: ${({ theme }) => theme.spacing.md}px;
  padding-bottom: ${({ theme }) => theme.spacing.md}px;
  padding-horizontal: ${({ theme, $isCompact }) =>
    $isCompact ? 0 : theme.spacing.xs}px;
`;

const StyledBreadcrumbActionGroup = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
  align-items: center;
  justify-content: flex-start;
  gap: ${({ theme }) => theme.spacing.sm}px;
`;

const StyledToolbarCard = styled(Card)`
  width: 100%;
  min-width: 0;
  align-self: stretch;
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
  align-items: stretch;
  gap: ${({ theme }) => theme.spacing.sm}px;
  min-width: 0;
`;

const StyledToolbarField = styled.View`
  flex-basis: 280px;
  flex-grow: 1;
  min-width: 0;
`;

const StyledSearchRow = styled.View`
  flex-direction: row;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm}px;
  width: 100%;
  min-width: 0;
`;

const StyledSearchInputSlot = styled.View`
  flex: 1;
  min-width: 0;
`;

const StyledSearchHelpAnchor = styled.View`
  position: relative;
  z-index: 2147483002;
`;

const StyledSearchHelpButton = styled.Pressable`
  min-width: ${({ theme }) =>
    theme.spacing.lg + theme.spacing.md + theme.spacing.xs}px;
  min-height: ${({ theme }) =>
    theme.spacing.lg + theme.spacing.md + theme.spacing.xs}px;
  width: ${({ theme }) =>
    theme.spacing.lg + theme.spacing.md + theme.spacing.xs}px;
  height: ${({ theme }) =>
    theme.spacing.lg + theme.spacing.md + theme.spacing.xs}px;
  border-radius: ${({ theme }) => theme.radius.full}px;
  align-items: center;
  justify-content: center;
  border-width: 0;
  background-color: transparent;
`;

const StyledSearchHelpBody = styled(Text).attrs({
  align: 'left',
})`
  margin-top: ${({ theme }) => theme.spacing.sm}px;
  line-height: ${({ theme }) =>
    theme.typography.fontSize.sm *
    (theme.typography.lineHeight.normal || 1.35)}px;
  color: ${({ theme }) => theme.colors.text.secondary};
`;

const StyledSearchHelpList = styled.View`
  margin-top: ${({ theme }) => theme.spacing.sm + theme.spacing.xs}px;
  width: 100%;
  gap: ${({ theme }) => theme.spacing.sm}px;
`;

const StyledSearchHelpItem = styled(Text).attrs({
  align: 'left',
})`
  font-size: ${({ theme }) => theme.typography.fontSize.xs}px;
  line-height: ${({ theme }) =>
    theme.typography.fontSize.xs *
    (theme.typography.lineHeight.normal || 1.35)}px;
  color: ${({ theme }) => theme.colors.text.secondary};
`;

const StyledListCard = styled(Card)`
  width: 100%;
  min-width: 0;
  align-self: stretch;
  gap: ${({ theme }) => theme.spacing.xs + 2}px;
  padding: ${({ theme, $isCompact }) => ($isCompact ? 0 : theme.spacing.xs)}px;
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
