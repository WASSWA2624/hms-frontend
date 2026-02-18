/**
 * DataTable Web Styles
 * File: DataTable.web.styles.jsx
 */
import styled from 'styled-components';

const StyledContainer = styled.div.withConfig({
  displayName: 'StyledContainer',
  componentId: 'DataTableContainer',
})`
  width: 100%;
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
  min-width: ${({ $minWidth }) => ($minWidth ? `${$minWidth}px` : '100%')};
  border-collapse: collapse;
  border-spacing: 0;
  table-layout: fixed;
`;

const StyledHeaderCell = styled.th.withConfig({
  displayName: 'StyledHeaderCell',
  componentId: 'DataTableHeaderCell',
})`
  text-align: ${({ $align }) => $align || 'left'};
  padding: ${({ theme }) => theme.spacing.sm}px;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border.light};
  background-color: ${({ theme }) => theme.colors.background.secondary};
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: ${({ theme }) => theme.typography.fontSize.xs}px;
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  white-space: nowrap;
  position: sticky;
  top: 0;
  z-index: 2;

  ${({ $width }) => ($width ? `width: ${$width};` : '')}
  ${({ $minWidth }) => ($minWidth ? `min-width: ${$minWidth};` : '')}
`;

const StyledHeaderButton = styled.button.withConfig({
  displayName: 'StyledHeaderButton',
  componentId: 'DataTableHeaderButton',
})`
  display: inline-flex;
  align-items: center;
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
})``;

const StyledSortIndicator = styled.span.withConfig({
  displayName: 'StyledSortIndicator',
  componentId: 'DataTableSortIndicator',
})`
  font-size: ${({ theme }) => theme.typography.fontSize.xs}px;
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
  padding: ${({ theme, $density }) => ($density === 'comfortable' ? theme.spacing.sm : theme.spacing.xs)}px
    ${({ theme }) => theme.spacing.sm}px;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border.light};
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: ${({ theme }) => theme.typography.fontSize.xs}px;
  vertical-align: middle;
  text-align: ${({ $align }) => $align || 'left'};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const StyledSpacerCell = styled.td.withConfig({
  displayName: 'StyledSpacerCell',
  componentId: 'DataTableSpacerCell',
})`
  border: none;
  padding: 0;
  height: ${({ $height }) => `${$height}px`};
`;

const StyledEmptyCell = styled(StyledCell).withConfig({
  displayName: 'StyledEmptyCell',
  componentId: 'DataTableEmptyCell',
})`
  text-align: center;
  color: ${({ theme }) => theme.colors.text.secondary};
`;

export {
  StyledContainer,
  StyledScrollArea,
  StyledTable,
  StyledHeaderCell,
  StyledHeaderButton,
  StyledHeaderText,
  StyledSortIndicator,
  StyledRow,
  StyledCell,
  StyledSpacerCell,
  StyledEmptyCell,
};

