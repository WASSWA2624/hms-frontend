import styled from 'styled-components/native';
import { Pressable } from 'react-native';
import { Text } from '@platform/components';

const RESIZE_HANDLE_WIDTH = 44;

const resolveCellFlex = (columnId) => {
  if (columnId === 'patient') return 1.4;
  if (columnId === 'contact') return 1.15;
  if (columnId === 'actions') return 1.45;
  if (columnId === 'number') return 0.45;
  return 1;
};

const resolveCellAlignment = (columnId) => {
  if (columnId === 'number') return 'center';
  return 'flex-start';
};

const StyledTable = styled.View`
  width: 100%;
  border-width: 1px;
  border-color: ${({ theme }) => theme.colors.border.light};
`;

const StyledHeaderRow = styled.View`
  flex-direction: row;
  align-items: center;
  background-color: ${({ theme }) => theme.colors.background.secondary};
  border-bottom-width: 1px;
  border-bottom-color: ${({ theme }) => theme.colors.border.light};
`;

const StyledDataRow = styled.View`
  flex-direction: row;
  align-items: center;
  border-bottom-width: ${({ $isLastRow }) => ($isLastRow ? 0 : 1)}px;
  border-bottom-color: ${({ theme }) => theme.colors.border.light};
  background-color: ${({ $rowIndex, $isHovered, theme }) => {
    if ($isHovered) return theme.colors.background.tertiary;
    return $rowIndex % 2 === 0
      ? theme.colors.background.primary
      : theme.colors.background.secondary;
  }};
`;

const StyledCell = styled.View`
  flex: ${({ $isWeb, $columnId }) => ($isWeb ? 0 : resolveCellFlex($columnId))};
  width: ${({ $isWeb, $columnWidth }) => ($isWeb ? `${$columnWidth}px` : 'auto')};
  flex-basis: ${({ $isWeb, $columnWidth }) => ($isWeb ? `${$columnWidth}px` : 'auto')};
  flex-shrink: ${({ $isWeb }) => ($isWeb ? 0 : 1)};
  min-width: 0;
  padding-vertical: ${({ theme }) => theme.spacing.xs}px;
  padding-horizontal: ${({ theme }) => theme.spacing.sm}px;
  justify-content: center;
  align-items: ${({ $columnId }) => resolveCellAlignment($columnId)};
  border-right-width: ${({ $isLastColumn }) => ($isLastColumn ? 0 : 1)}px;
  border-right-color: ${({ theme }) => theme.colors.border.light};
`;

const StyledHeaderCellContent = styled.View`
  width: 100%;
  position: relative;
  padding-right: ${({ $isResizable, theme }) => ($isResizable ? theme.spacing.md : 0)}px;
`;

const StyledHeaderCellText = styled(Text)`
  width: 100%;
  font-size: ${({ theme }) => theme.typography.fontSize.xs}px;
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
`;

const StyledResizeHandle = styled(Pressable)`
  position: absolute;
  top: ${({ theme }) => -theme.spacing.md}px;
  right: ${({ theme }) => -(theme.spacing.md + (RESIZE_HANDLE_WIDTH / 2))}px;
  bottom: ${({ theme }) => -theme.spacing.md}px;
  width: ${RESIZE_HANDLE_WIDTH}px;
  min-height: 44px;
  align-items: center;
  justify-content: center;
  z-index: 3;
  cursor: col-resize;
`;

const StyledResizeRail = styled.View`
  width: 2px;
  height: 70%;
  border-radius: ${({ theme }) => theme.radius.full}px;
  background-color: ${({ theme, $active }) => (
    $active ? theme.colors.primary : theme.colors.border.medium
  )};
  opacity: ${({ $active }) => ($active ? 0.98 : 0.8)};
`;

const StyledCellText = styled(Text)`
  width: 100%;
`;

const StyledActionButtonsRow = styled.View`
  width: 100%;
  min-width: 0;
  flex-direction: row;
  flex-wrap: wrap;
  align-items: center;
  justify-content: ${({ $isCompact }) => ($isCompact ? 'space-between' : 'flex-start')};
  gap: ${({ theme }) => theme.spacing.xs / 2}px;
`;

const StyledActionButtonSlot = styled.View`
  margin-left: ${({ $isFirst, $isCompact, theme }) => (
    $isCompact ? 0 : ($isFirst ? 0 : theme.spacing.xs / 2)
  )}px;
  flex: ${({ $isCompact }) => ($isCompact ? 1 : 0)};
  min-width: ${({ $isCompact, theme }) => ($isCompact ? `${theme.spacing.xxl + theme.spacing.sm}px` : 'auto')};
`;

const StyledRowNumberBadge = styled.View`
  min-width: 20px;
  min-height: 20px;
  padding-horizontal: ${({ theme }) => theme.spacing.xs + 1}px;
  border-radius: ${({ theme }) => theme.radius.full}px;
  align-items: center;
  justify-content: center;
  border-width: 1px;
  border-color: ${({ theme }) => theme.colors.border.light};
  background-color: ${({ theme }) => theme.colors.background.primary};
`;

const StyledCardsGrid = styled.View`
  width: 100%;
  min-width: 0;
  flex-direction: ${({ $isTablet }) => ($isTablet ? 'row' : 'column')};
  flex-wrap: wrap;
  justify-content: ${({ $isTablet }) => ($isTablet ? 'space-between' : 'flex-start')};
  gap: ${({ theme }) => theme.spacing.sm}px;
`;

const StyledPatientCard = styled.View`
  width: ${({ $isTablet }) => ($isTablet ? '48%' : '100%')};
  flex-basis: ${({ $isTablet }) => ($isTablet ? '48%' : '100%')};
  max-width: ${({ $isTablet }) => ($isTablet ? '48%' : '100%')};
  min-width: 0;
  border-width: 1px;
  border-color: ${({ theme }) => theme.colors.border.light};
  border-radius: ${({ theme }) => theme.radius.md}px;
  background-color: ${({ theme }) => theme.colors.background.primary};
  padding-vertical: ${({ $isCompact, theme }) => (
    $isCompact ? theme.spacing.xs + 1 : theme.spacing.sm
  )}px;
  padding-horizontal: ${({ $isCompact, theme }) => (
    $isCompact ? theme.spacing.xs + 2 : theme.spacing.sm
  )}px;
  gap: ${({ $isCompact, theme }) => ($isCompact ? theme.spacing.xs : theme.spacing.sm)}px;
  overflow: hidden;
`;

const StyledPatientCardHeader = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing.xs}px;
`;

const StyledPatientCardTitle = styled(Text)`
  flex: 1;
  line-height: ${({ theme }) => theme.typography.lineHeight?.tight || 22}px;
`;

const StyledPatientCardFields = styled.View`
  gap: ${({ theme }) => Math.max(2, Math.floor(theme.spacing.xs / 2))}px;
`;

const StyledPatientCardFieldRow = styled.View`
  flex-direction: row;
  align-items: flex-start;
  justify-content: flex-start;
  gap: ${({ $isCompact, theme }) => (
    $isCompact ? Math.max(6, Math.floor(theme.spacing.xs + 1)) : theme.spacing.sm
  )}px;
  min-width: 0;
`;

const StyledPatientCardFieldLabel = styled(Text)`
  flex-basis: ${({ $isCompact }) => ($isCompact ? '36%' : '33%')};
  flex-grow: 0;
  flex-shrink: 0;
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: ${({ theme }) => Math.max(10, theme.typography.fontSize.xs - 1)}px;
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  text-transform: uppercase;
`;

const StyledPatientCardFieldValue = styled(Text)`
  flex: 1;
  min-width: 0;
  width: auto;
  text-align: left;
  color: ${({ theme }) => theme.colors.text.primary};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
`;

export {
  RESIZE_HANDLE_WIDTH,
  StyledActionButtonsRow,
  StyledActionButtonSlot,
  StyledCardsGrid,
  StyledCell,
  StyledCellText,
  StyledDataRow,
  StyledHeaderCellContent,
  StyledHeaderCellText,
  StyledHeaderRow,
  StyledPatientCard,
  StyledPatientCardFieldLabel,
  StyledPatientCardFieldRow,
  StyledPatientCardFields,
  StyledPatientCardFieldValue,
  StyledPatientCardHeader,
  StyledPatientCardTitle,
  StyledResizeHandle,
  StyledResizeRail,
  StyledRowNumberBadge,
  StyledTable,
};
