import styled from 'styled-components/native';
import { Pressable } from 'react-native';
import { Text } from '@platform/components';

const RESIZE_HANDLE_WIDTH = 44;

const resolveCellFlex = (columnId) => {
  if (columnId === 'patient') return 1.4;
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
  flex-direction: row;
  flex-wrap: wrap;
  align-items: center;
  justify-content: flex-start;
  gap: ${({ theme }) => theme.spacing.xs / 2}px;
`;

const StyledActionButtonSlot = styled.View`
  margin-left: ${({ $isFirst, theme }) => ($isFirst ? 0 : theme.spacing.xs / 2)}px;
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
  flex-direction: ${({ $isTablet }) => ($isTablet ? 'row' : 'column')};
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing.sm}px;
`;

const StyledPatientCard = styled.View`
  width: ${({ $isTablet }) => ($isTablet ? '49%' : '100%')};
  border-width: 1px;
  border-color: ${({ theme }) => theme.colors.border.light};
  border-radius: ${({ theme }) => theme.radius.md}px;
  background-color: ${({ theme }) => theme.colors.background.primary};
  padding: ${({ theme }) => theme.spacing.sm}px;
  gap: ${({ theme }) => theme.spacing.sm}px;
`;

const StyledPatientCardHeader = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing.sm}px;
`;

const StyledPatientCardTitle = styled(Text)`
  flex: 1;
`;

const StyledPatientCardFields = styled.View`
  gap: ${({ theme }) => theme.spacing.xs}px;
`;

const StyledPatientCardFieldRow = styled.View`
  flex-direction: row;
  align-items: flex-start;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing.sm}px;
`;

const StyledPatientCardFieldLabel = styled(Text)`
  flex: 0.9;
`;

const StyledPatientCardFieldValue = styled(Text)`
  flex: 1.1;
  text-align: right;
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
