/**
 * DataTable Component - Web
 * Reusable, configurable data table with optional row-window virtualization.
 * File: DataTable.web.jsx
 */
import React, { useCallback, useMemo, useState } from 'react';

import { useI18n } from '@hooks';
import Checkbox from '../../forms/Checkbox';
import { DEFAULT_VIRTUALIZATION, ROW_DENSITIES } from './types';
import {
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
} from './DataTable.web.styles';

const resolveSortIndicator = (sortField, sortDirection, field) => {
  if (sortField !== field) return '';
  return sortDirection === 'desc' ? 'v' : '^';
};

const resolveSizeValue = (value) => {
  if (value == null) return undefined;
  if (typeof value === 'number') return `${value}px`;
  return String(value);
};

const resolveCellValue = (row, rowIndex, column) => {
  if (typeof column.renderCell === 'function') {
    return column.renderCell(row, rowIndex);
  }

  if (typeof column.accessor === 'function') {
    return column.accessor(row, rowIndex);
  }

  if (typeof column.accessor === 'string') {
    return row?.[column.accessor];
  }

  return row?.[column.id];
};

const DataTableRow = React.memo(({
  row,
  rowIndex,
  rowKey,
  columns,
  rowDensity,
  onRowPress,
  renderRowActions,
  selection,
  rowTestIdPrefix,
}) => {
  const isRowClickable = typeof onRowPress === 'function';
  const isSelected = Boolean(selection?.enabled && selection?.isRowSelected?.(row, rowIndex));

  const handleRowPress = useCallback(() => {
    if (!isRowClickable) return;
    onRowPress(row, rowIndex);
  }, [isRowClickable, onRowPress, row, rowIndex]);

  return (
    <StyledRow
      key={rowKey}
      onClick={handleRowPress}
      $clickable={isRowClickable}
      $stripeIndex={rowIndex}
      data-testid={rowTestIdPrefix ? `${rowTestIdPrefix}-${rowKey}` : undefined}
    >
      {selection?.enabled ? (
        <StyledCell
          $density={rowDensity}
          onClick={(event) => event.stopPropagation()}
        >
          <Checkbox
            checked={isSelected}
            onChange={(checked) => selection?.onToggleRow?.(row, Boolean(checked), rowIndex)}
            accessibilityLabel={selection?.selectRowLabel?.(row, rowIndex)}
            testID={selection?.rowCheckboxTestIdPrefix
              ? `${selection.rowCheckboxTestIdPrefix}-${rowKey}`
              : undefined}
          />
        </StyledCell>
      ) : null}

      {columns.map((column) => (
        <StyledCell
          key={`${rowKey}-${column.id}`}
          $density={rowDensity}
          $align={column.align}
          title={typeof column.getCellTitle === 'function'
            ? column.getCellTitle(row, rowIndex)
            : undefined}
        >
          {resolveCellValue(row, rowIndex, column)}
        </StyledCell>
      ))}

      {typeof renderRowActions === 'function' ? (
        <StyledCell
          $density={rowDensity}
          onClick={(event) => event.stopPropagation()}
        >
          {renderRowActions(row, rowIndex)}
        </StyledCell>
      ) : null}
    </StyledRow>
  );
});

const DataTableWeb = ({
  columns = [],
  rows = [],
  getRowKey,
  rowDensity = ROW_DENSITIES.COMPACT,
  sortField,
  sortDirection = 'asc',
  onSort,
  selection,
  renderRowActions,
  rowActionsLabel,
  onRowPress,
  virtualization,
  minWidth,
  emptyMessage,
  testID,
  className,
  style,
}) => {
  const { t } = useI18n();
  const [scrollTop, setScrollTop] = useState(0);

  const normalizedColumns = useMemo(() => columns
    .filter((column) => column && column.id)
    .map((column) => ({
      ...column,
      label: column.label ?? column.id,
      sortable: Boolean(column.sortable),
      width: resolveSizeValue(column.width),
      minWidth: resolveSizeValue(column.minWidth),
      align: column.align || 'left',
    })), [columns]);

  const normalizedVirtualization = useMemo(
    () => ({ ...DEFAULT_VIRTUALIZATION, ...(virtualization || {}) }),
    [virtualization]
  );

  const resolvedDensity = rowDensity === ROW_DENSITIES.COMFORTABLE
    ? ROW_DENSITIES.COMFORTABLE
    : ROW_DENSITIES.COMPACT;

  const normalizedRows = Array.isArray(rows) ? rows : [];
  const shouldVirtualize = Boolean(
    normalizedVirtualization.enabled
    && normalizedRows.length > normalizedVirtualization.threshold
  );

  const viewportHeight = normalizedVirtualization.maxHeight;
  const rowHeight = normalizedVirtualization.rowHeight;
  const overscan = normalizedVirtualization.overscan;

  const totalRows = normalizedRows.length;
  const startIndex = shouldVirtualize
    ? Math.max(0, Math.floor(scrollTop / rowHeight) - overscan)
    : 0;
  const endIndex = shouldVirtualize
    ? Math.min(
      totalRows,
      Math.ceil((scrollTop + viewportHeight) / rowHeight) + overscan
    )
    : totalRows;

  const renderedRows = shouldVirtualize
    ? normalizedRows.slice(startIndex, endIndex)
    : normalizedRows;

  const topSpacerHeight = shouldVirtualize ? startIndex * rowHeight : 0;
  const bottomSpacerHeight = shouldVirtualize
    ? Math.max(0, (totalRows - endIndex) * rowHeight)
    : 0;

  const columnSpan = normalizedColumns.length
    + (selection?.enabled ? 1 : 0)
    + (typeof renderRowActions === 'function' ? 1 : 0);

  const resolveRowKey = useCallback((row, rowIndex) => {
    if (typeof getRowKey === 'function') {
      const resolved = getRowKey(row, rowIndex);
      if (resolved != null && resolved !== '') return String(resolved);
    }

    const fallback = row?.id ?? row?.key ?? row?.slug;
    if (fallback != null && fallback !== '') return String(fallback);

    return `row-${rowIndex}`;
  }, [getRowKey]);

  const handleScroll = useCallback((event) => {
    if (!shouldVirtualize) return;
    setScrollTop(event?.currentTarget?.scrollTop ?? 0);
  }, [shouldVirtualize]);

  return (
    <StyledContainer
      className={className}
      style={style}
      data-testid={testID}
    >
      <StyledScrollArea
        onScroll={handleScroll}
        $maxHeight={shouldVirtualize ? viewportHeight : null}
        data-testid={testID ? `${testID}-scroll` : undefined}
      >
        <StyledTable $minWidth={resolveSizeValue(minWidth)}>
          <thead>
            <tr>
              {selection?.enabled ? (
                <StyledHeaderCell>
                  <Checkbox
                    checked={Boolean(selection?.allSelected)}
                    onChange={(checked) => selection?.onToggleAll?.(Boolean(checked))}
                    accessibilityLabel={selection?.selectAllLabel || 'Select all rows'}
                    testID={selection?.headerCheckboxTestId}
                  />
                </StyledHeaderCell>
              ) : null}

              {normalizedColumns.map((column) => {
                const sortIndicator = resolveSortIndicator(sortField, sortDirection, column.id);
                const isSortable = Boolean(column.sortable && typeof onSort === 'function');
                const headerTestId = testID ? `${testID}-sort-${column.id}` : undefined;
                const headerContent = typeof column.renderHeader === 'function'
                  ? column.renderHeader(column)
                  : column.label;

                return (
                  <StyledHeaderCell
                    key={column.id}
                    $align={column.align}
                    $width={column.width}
                    $minWidth={column.minWidth}
                  >
                    {isSortable ? (
                      <StyledHeaderButton
                        type="button"
                        onClick={() => onSort(column.id)}
                        aria-label={column.sortLabel || `Sort by ${column.label}`}
                        data-testid={headerTestId}
                      >
                        <StyledHeaderText>{headerContent}</StyledHeaderText>
                        <StyledSortIndicator>{sortIndicator}</StyledSortIndicator>
                      </StyledHeaderButton>
                    ) : (
                      <StyledHeaderText>{headerContent}</StyledHeaderText>
                    )}
                  </StyledHeaderCell>
                );
              })}

              {typeof renderRowActions === 'function' ? (
                <StyledHeaderCell>{rowActionsLabel || t('common.actions')}</StyledHeaderCell>
              ) : null}
            </tr>
          </thead>

          <tbody>
            {topSpacerHeight > 0 ? (
              <tr>
                <StyledSpacerCell colSpan={columnSpan} $height={topSpacerHeight} />
              </tr>
            ) : null}

            {renderedRows.map((row, index) => {
              const absoluteIndex = startIndex + index;
              const rowKey = resolveRowKey(row, absoluteIndex);

              return (
                <DataTableRow
                  key={rowKey}
                  row={row}
                  rowIndex={absoluteIndex}
                  rowKey={rowKey}
                  columns={normalizedColumns}
                  rowDensity={resolvedDensity}
                  onRowPress={onRowPress}
                  renderRowActions={renderRowActions}
                  selection={selection}
                  rowTestIdPrefix={testID ? `${testID}-row` : undefined}
                />
              );
            })}

            {bottomSpacerHeight > 0 ? (
              <tr>
                <StyledSpacerCell colSpan={columnSpan} $height={bottomSpacerHeight} />
              </tr>
            ) : null}

            {normalizedRows.length === 0 ? (
              <tr>
                <StyledEmptyCell $density={resolvedDensity} colSpan={columnSpan}>
                  {emptyMessage || t('listScaffold.emptyState.title')}
                </StyledEmptyCell>
              </tr>
            ) : null}
          </tbody>
        </StyledTable>
      </StyledScrollArea>
    </StyledContainer>
  );
};

export default DataTableWeb;

