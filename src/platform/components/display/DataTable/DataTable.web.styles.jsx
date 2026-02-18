/**
 * DataTable Web Styles
 * File: DataTable.web.styles.jsx
 */
import styled from 'styled-components';

const SELECTION_COLUMN_WIDTH = 48;
const ACTIONS_COLUMN_WIDTH = 220;

const resolveHeaderJustify = (align) => {
  if (align === 'right') return 'flex-end';
  if (align === 'center') return 'center';
  return 'flex-start';
};

const StyledScaffold = styled.div.withConfig({
  displayName: 'StyledScaffold',
  componentId: 'DataTableScaffold',
})`
  display: flex;
  flex-direction: column;
  width: 100%;
  gap: ${({ theme }) => theme.spacing.sm}px;
`;

const StyledTopSection = styled.div.withConfig({
  displayName: 'StyledTopSection',
  componentId: 'DataTableTopSection',
})`
  width: 100%;
`;

const StyledStatusSection = styled.div.withConfig({
  displayName: 'StyledStatusSection',
  componentId: 'DataTableStatusSection',
})`
  width: 100%;
`;

const StyledContainer = styled.div.withConfig({
  displayName: 'StyledContainer',
  componentId: 'DataTableContainer',
})`
  width: 100%;
  border: 1px solid ${({ theme }) => theme.colors.border.light};
  border-radius: ${({ theme }) => theme.radius.sm}px;
  background-color: ${({ theme }) => theme.colors.background.primary};
  overflow: hidden;
`;

const StyledScrollArea = styled.div.withConfig({
  displayName: 'StyledScrollArea',
  componentId: 'DataTableScrollArea',
})`
  width: 100%;
  overflow: auto;
  max-height: ${({ $maxHeight }) => ($maxHeight ? `${$maxHeight}px` : 'none')};
`;

const StyledTable = styled.table.withConfig({
  displayName: 'StyledTable',
  componentId: 'DataTableTable',
})`
  width: 100%;
  min-width: ${({ $minWidth }) => ($minWidth || '100%')};
  border-collapse: collapse;
  border-spacing: 0;
  table-layout: fixed;
`;

const StyledHeaderCell = styled.th.withConfig({
  displayName: 'StyledHeaderCell',
  componentId: 'DataTableHeaderCell',
})`
  text-align: ${({ $align }) => $align || 'left'};
  padding: ${({ theme }) => theme.spacing.xs / 2}px ${({ theme }) => theme.spacing.sm}px;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border.light};
  background-color: ${({ theme }) => theme.colors.background.secondary};
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: ${({ theme }) => theme.typography.fontSize.xs}px;
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  letter-spacing: 0.02em;
  white-space: nowrap;
  position: sticky;
  top: 0;
  z-index: 2;
  vertical-align: middle;

  ${({ $isResizable, theme }) => ($isResizable
    ? `padding-right: calc(${theme.spacing.sm}px + 12px);`
    : '')}
  ${({ $width }) => ($width ? `width: ${$width};` : '')}
  ${({ $minWidth }) => ($minWidth ? `min-width: ${$minWidth};` : '')}
  ${({ $isSelection }) => ($isSelection
    ? `width: ${SELECTION_COLUMN_WIDTH}px; min-width: ${SELECTION_COLUMN_WIDTH}px; max-width: ${SELECTION_COLUMN_WIDTH}px;`
    : '')}
  ${({ $isActions }) => ($isActions
    ? `width: ${ACTIONS_COLUMN_WIDTH}px; min-width: ${ACTIONS_COLUMN_WIDTH}px;`
    : '')}
`;

const StyledHeaderButton = styled.button.withConfig({
  displayName: 'StyledHeaderButton',
  componentId: 'DataTableHeaderButton',
})`
  display: flex;
  width: 100%;
  align-items: center;
  justify-content: ${({ $align }) => resolveHeaderJustify($align)};
  gap: ${({ theme }) => theme.spacing.xs}px;
  border: none;
  background: none;
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: ${({ theme }) => theme.typography.fontSize.xs}px;
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  cursor: pointer;
  padding: 0;

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.primary};
    outline-offset: 2px;
  }
`;

const StyledHeaderText = styled.span.withConfig({
  displayName: 'StyledHeaderText',
  componentId: 'DataTableHeaderText',
})`
  overflow: hidden;
  text-overflow: ellipsis;
`;

const StyledSortIndicator = styled.span.withConfig({
  displayName: 'StyledSortIndicator',
  componentId: 'DataTableSortIndicator',
})`
  display: inline-flex;
  min-width: 12px;
  justify-content: center;
  font-size: ${({ theme }) => theme.typography.fontSize.xs}px;
`;

const StyledResizeHandle = styled.button.withConfig({
  displayName: 'StyledResizeHandle',
  componentId: 'DataTableResizeHandle',
})`
  position: absolute;
  top: 0;
  right: -1px;
  width: 14px;
  height: 100%;
  border: none;
  border-left: 1px solid ${({ theme, $active }) => (
    $active ? theme.colors.primary : theme.colors.border.light
  )};
  background: transparent;
  padding: 0;
  margin: 0;
  cursor: col-resize;
  touch-action: none;
  z-index: 3;

  &::before {
    content: '';
    position: absolute;
    top: 8px;
    bottom: 8px;
    left: 50%;
    transform: translateX(-50%);
    width: 2px;
    border-radius: 999px;
    background-color: ${({ theme, $active }) => (
      $active ? theme.colors.primary : theme.colors.text.tertiary
    )};
    opacity: ${({ $active }) => ($active ? 0.95 : 0.78)};
    transition: opacity 120ms ease-in-out;
  }

  &:hover {
    border-left-color: ${({ theme }) => theme.colors.primary};
  }

  &:hover::before {
    opacity: 1;
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.primary};
    outline-offset: -2px;
  }
`;

const StyledRow = styled.tr.withConfig({
  displayName: 'StyledRow',
  componentId: 'DataTableRow',
})`
  background-color: ${({ theme, $stripeIndex }) => (
    Number.isInteger($stripeIndex) && $stripeIndex % 2 === 0
      ? theme.colors.background.primary
      : theme.colors.background.secondary
  )};

  ${({ $clickable }) => ($clickable ? 'cursor: pointer;' : '')}
  transition: background-color 120ms ease-in-out;

  &:hover {
    ${({ $clickable, theme }) => ($clickable
      ? `background-color: ${theme.colors.background.tertiary};`
      : '')}
  }
`;

const StyledCell = styled.td.withConfig({
  displayName: 'StyledCell',
  componentId: 'DataTableCell',
})`
  padding: ${({ theme, $density }) => ($density === 'comfortable' ? theme.spacing.xs : theme.spacing.xs / 2)}px
    ${({ theme }) => theme.spacing.xs}px;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border.light};
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: ${({ theme }) => theme.typography.fontSize.xs}px;
  vertical-align: middle;
  text-align: ${({ $align }) => $align || 'left'};
  white-space: ${({ $allowOverflow }) => ($allowOverflow ? 'normal' : 'nowrap')};
  overflow: ${({ $truncate }) => ($truncate === false ? 'visible' : 'hidden')};
  text-overflow: ${({ $truncate }) => ($truncate === false ? 'clip' : 'ellipsis')};

  ${({ $width }) => ($width ? `width: ${$width};` : '')}
  ${({ $minWidth }) => ($minWidth ? `min-width: ${$minWidth};` : '')}
  ${({ $isSelection }) => ($isSelection
    ? `width: ${SELECTION_COLUMN_WIDTH}px; min-width: ${SELECTION_COLUMN_WIDTH}px; max-width: ${SELECTION_COLUMN_WIDTH}px;`
    : '')}
  ${({ $isActions }) => ($isActions
    ? `width: ${ACTIONS_COLUMN_WIDTH}px; min-width: ${ACTIONS_COLUMN_WIDTH}px;`
    : '')}
`;

const StyledSpacerCell = styled.td.withConfig({
  displayName: 'StyledSpacerCell',
  componentId: 'DataTableSpacerCell',
})`
  border: none;
  padding: 0;
  height: ${({ $height }) => `${$height}px`};
`;

const StyledEmptyCell = styled.td.withConfig({
  displayName: 'StyledEmptyCell',
  componentId: 'DataTableEmptyCell',
})`
  padding: ${({ theme, $density }) => ($density === 'comfortable' ? theme.spacing.xs : theme.spacing.xs / 2)}px
    ${({ theme }) => theme.spacing.xs}px;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border.light};
  font-size: ${({ theme }) => theme.typography.fontSize.xs}px;
  vertical-align: middle;
  text-align: center;
  color: ${({ theme }) => theme.colors.text.secondary};
`;

const StyledBottomBar = styled.div.withConfig({
  displayName: 'StyledBottomBar',
  componentId: 'DataTableBottomBar',
})`
  display: flex;
  flex-wrap: wrap;
  width: 100%;
  align-items: center;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing.sm}px;
`;

const StyledBottomPrimary = styled.div.withConfig({
  displayName: 'StyledBottomPrimary',
  componentId: 'DataTableBottomPrimary',
})`
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing.xs}px;
`;

const StyledBottomSecondary = styled.div.withConfig({
  displayName: 'StyledBottomSecondary',
  componentId: 'DataTableBottomSecondary',
})`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing.xs}px;
`;

export {
  StyledScaffold,
  StyledTopSection,
  StyledStatusSection,
  StyledContainer,
  StyledScrollArea,
  StyledTable,
  StyledHeaderCell,
  StyledHeaderButton,
  StyledHeaderText,
  StyledSortIndicator,
  StyledResizeHandle,
  StyledRow,
  StyledCell,
  StyledSpacerCell,
  StyledEmptyCell,
  StyledBottomBar,
  StyledBottomPrimary,
  StyledBottomSecondary,
};

