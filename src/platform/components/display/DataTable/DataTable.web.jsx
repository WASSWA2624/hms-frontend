/**
 * DataTable Component - Web
 * Reusable, configurable data table with optional row-window virtualization.
 * File: DataTable.web.jsx
 */
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import { useI18n } from '@hooks';
import Checkbox from '../../forms/Checkbox';
import { DEFAULT_VIRTUALIZATION, ROW_DENSITIES } from './types';
import {
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

const resolvePixelValue = (value) => {
  if (typeof value === 'number' && Number.isFinite(value)) {
    return value;
  }

  if (typeof value !== 'string') return undefined;
  const normalized = value.trim().toLowerCase();
  if (!normalized.endsWith('px')) return undefined;

  const parsed = Number.parseFloat(normalized.slice(0, -2));
  return Number.isFinite(parsed) ? parsed : undefined;
};

const clampValue = (value, min, max) => {
  let next = value;
  if (Number.isFinite(min)) next = Math.max(min, next);
  if (Number.isFinite(max)) next = Math.min(max, next);
  return next;
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

const resolveSlotContent = (slot, context) => (
  typeof slot === 'function' ? slot(context) : slot
);

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
          $align="center"
          $isSelection
          $allowOverflow
          $truncate={false}
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
          $width={column.width}
          $minWidth={column.minWidth}
          $truncate={column.truncate !== false}
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
          $align="right"
          $isActions
          $allowOverflow
          $truncate={false}
          onClick={(event) => event.stopPropagation()}
        >
          {renderRowActions(row, rowIndex)}
        </StyledCell>
      ) : null}
    </StyledRow>
  );
});

/**
 * `searchBar`, `filterBar`, `bulkActionsBar`, `pagination`, and `tableNavigation`
 * accept either a React node or a render function receiving table context.
 */
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
  showDefaultEmptyRow = true,
  searchBar,
  filterBar,
  bulkActionsBar,
  topContent,
  statusContent,
  pagination,
  tableNavigation,
  bottomContent,
  columnResize,
  testID,
  className,
  style,
}) => {
  const { t } = useI18n();
  const [scrollTop, setScrollTop] = useState(0);
  const [columnWidths, setColumnWidths] = useState({});
  const [activeResizeColumnId, setActiveResizeColumnId] = useState(null);
  const tableRef = useRef(null);
  const headerCellRefs = useRef({});
  const resizeCleanupRef = useRef(null);

  const normalizedColumns = useMemo(() => columns
    .filter((column) => column && column.id)
    .map((column) => ({
      ...column,
      label: column.label ?? column.id,
      sortable: Boolean(column.sortable),
      width: resolveSizeValue(column.width),
      minWidth: resolveSizeValue(column.minWidth),
      maxWidth: resolveSizeValue(column.maxWidth),
      resizable: column.resizable !== false,
      align: column.align || 'left',
    })), [columns]);

  const normalizedColumnResize = useMemo(() => {
    const minWidth = Number.isFinite(columnResize?.minWidth)
      ? Number(columnResize.minWidth)
      : undefined;
    const maxWidth = Number.isFinite(columnResize?.maxWidth)
      ? Number(columnResize.maxWidth)
      : undefined;

    return {
      enabled: columnResize?.enabled !== false,
      minWidth,
      maxWidth,
      onResize: typeof columnResize?.onResize === 'function' ? columnResize.onResize : undefined,
    };
  }, [columnResize]);

  const tableColumns = useMemo(() => normalizedColumns.map((column) => {
    const overrideWidth = columnWidths[column.id];
    const resolvedWidth = Number.isFinite(overrideWidth)
      ? `${overrideWidth}px`
      : column.width;
    const isFreeResizable = normalizedColumnResize.enabled && column.resizable !== false;
    const minWidth = isFreeResizable ? undefined : column.minWidth;

    return {
      ...column,
      width: resolvedWidth,
      minWidth,
    };
  }), [normalizedColumns, columnWidths, normalizedColumnResize.enabled]);

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

  const columnSpan = tableColumns.length
    + (selection?.enabled ? 1 : 0)
    + (typeof renderRowActions === 'function' ? 1 : 0);

  const slotContext = useMemo(() => ({
    columns: tableColumns,
    rows: normalizedRows,
    sortField,
    sortDirection,
    rowDensity: resolvedDensity,
  }), [tableColumns, normalizedRows, sortField, sortDirection, resolvedDensity]);

  const searchBarContent = resolveSlotContent(searchBar, slotContext);
  const filterBarContent = resolveSlotContent(filterBar, slotContext);
  const bulkActionsContent = resolveSlotContent(bulkActionsBar, slotContext);
  const topContentNode = resolveSlotContent(topContent, slotContext);
  const statusContentNode = resolveSlotContent(statusContent, slotContext);
  const paginationContent = resolveSlotContent(pagination, slotContext);
  const tableNavigationContent = resolveSlotContent(tableNavigation, slotContext);
  const bottomContentNode = resolveSlotContent(bottomContent, slotContext);

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

  const emitColumnResize = useCallback((columnId, width) => {
    if (!normalizedColumnResize.onResize) return;
    normalizedColumnResize.onResize({
      columnId,
      width,
      columns: tableColumns,
    });
  }, [normalizedColumnResize, tableColumns]);

  const resolveAutoFitWidth = useCallback((column) => {
    const headerCell = headerCellRefs.current[column.id];
    const table = tableRef.current;
    if (!headerCell || !table) return undefined;

    const columnOffset = selection?.enabled ? 1 : 0;
    const fallbackColumnIndex = tableColumns.findIndex((current) => current.id === column.id);
    const columnIndex = Number.isInteger(headerCell.cellIndex) && headerCell.cellIndex >= 0
      ? headerCell.cellIndex
      : (fallbackColumnIndex >= 0 ? fallbackColumnIndex + columnOffset : -1);
    if (!Number.isInteger(columnIndex) || columnIndex < 0) return undefined;

    const measureCellWidth = (cell) => {
      if (!cell) return 0;
      const scrollWidth = Number.isFinite(cell.scrollWidth) ? cell.scrollWidth : 0;
      const measuredWidth = cell.getBoundingClientRect?.().width ?? 0;
      return Math.ceil(Math.max(scrollWidth, measuredWidth));
    };

    let widest = measureCellWidth(headerCell);
    const bodyRows = Array.from(table.tBodies?.[0]?.rows || []);

    bodyRows.forEach((row) => {
      const cell = row?.cells?.[columnIndex];
      if (!cell || cell.colSpan > 1) return;
      widest = Math.max(widest, measureCellWidth(cell));
    });

    const columnMaxWidth = resolvePixelValue(column.maxWidth);
    const maxWidth = Number.isFinite(columnMaxWidth)
      ? columnMaxWidth
      : normalizedColumnResize.maxWidth;

    return Math.max(0, Math.round(clampValue(widest, undefined, maxWidth)));
  }, [normalizedColumnResize.maxWidth, selection?.enabled, tableColumns]);

  useEffect(() => {
    setColumnWidths((previous) => {
      const allowedIds = new Set(normalizedColumns.map((column) => column.id));
      const entries = Object.entries(previous).filter(([columnId]) => allowedIds.has(columnId));
      if (entries.length === Object.keys(previous).length) return previous;
      return Object.fromEntries(entries);
    });
  }, [normalizedColumns]);

  useEffect(() => () => {
    if (resizeCleanupRef.current) {
      resizeCleanupRef.current();
      resizeCleanupRef.current = null;
    }
  }, []);

  const handleColumnResizeStart = useCallback((event, column) => {
    if (!normalizedColumnResize.enabled || column.resizable === false) return;
    if (event.button !== 0) return;
    event.preventDefault();
    event.stopPropagation();

    if (resizeCleanupRef.current) {
      resizeCleanupRef.current();
      resizeCleanupRef.current = null;
    }

    const headerCell = headerCellRefs.current[column.id];
    const measuredWidth = headerCell?.getBoundingClientRect?.().width;
    const defaultMinWidth = normalizedColumnResize.minWidth;
    const columnMinWidth = resolvePixelValue(column.minWidth);
    const minWidth = Number.isFinite(columnMinWidth) ? columnMinWidth : defaultMinWidth;
    const columnMaxWidth = resolvePixelValue(column.maxWidth);
    const maxWidth = Number.isFinite(columnMaxWidth)
      ? columnMaxWidth
      : normalizedColumnResize.maxWidth;

    const baseWidth = columnWidths[column.id]
      ?? resolvePixelValue(column.width)
      ?? measuredWidth
      ?? 0;
    const startWidth = Math.max(0, clampValue(baseWidth, minWidth, maxWidth));
    const startX = event.clientX;
    let latestWidth = Math.round(startWidth);

    setActiveResizeColumnId(column.id);

    const previousUserSelect = document.body.style.userSelect;
    const previousCursor = document.body.style.cursor;
    document.body.style.userSelect = 'none';
    document.body.style.cursor = 'col-resize';

    const handleMouseMove = (moveEvent) => {
      const delta = moveEvent.clientX - startX;
      const nextWidth = clampValue(startWidth + delta, minWidth, maxWidth);
      latestWidth = Math.round(nextWidth);

      setColumnWidths((previous) => {
        if (previous[column.id] === latestWidth) return previous;
        return { ...previous, [column.id]: latestWidth };
      });
    };

    let handleMouseUp = () => {};
    const cleanup = () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('blur', handleMouseUp);
      window.removeEventListener('mouseleave', handleMouseUp);
      document.body.style.userSelect = previousUserSelect;
      document.body.style.cursor = previousCursor;
      setActiveResizeColumnId(null);
    };

    handleMouseUp = () => {
      cleanup();
      emitColumnResize(column.id, latestWidth);
    };

    resizeCleanupRef.current = cleanup;
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    window.addEventListener('blur', handleMouseUp);
    window.addEventListener('mouseleave', handleMouseUp);
  }, [columnWidths, normalizedColumnResize, emitColumnResize]);

  const handleColumnAutoFit = useCallback((event, column) => {
    if (!normalizedColumnResize.enabled || column.resizable === false) return;
    event.preventDefault();
    event.stopPropagation();

    if (resizeCleanupRef.current) {
      resizeCleanupRef.current();
      resizeCleanupRef.current = null;
    }

    const nextWidth = resolveAutoFitWidth(column);
    if (!Number.isFinite(nextWidth)) return;

    setColumnWidths((previous) => {
      if (previous[column.id] === nextWidth) return previous;
      return { ...previous, [column.id]: nextWidth };
    });
    emitColumnResize(column.id, nextWidth);
  }, [normalizedColumnResize.enabled, resolveAutoFitWidth, emitColumnResize]);

  return (
    <StyledScaffold
      className={className}
      style={style}
      data-testid={testID}
    >
      <StyledContainer data-testid={testID ? `${testID}-table-container` : undefined}>
        {searchBarContent ? (
          <StyledTopSection
            $slot="search"
            data-testid={testID ? `${testID}-search-bar` : undefined}
          >
            {searchBarContent}
          </StyledTopSection>
        ) : null}

        {filterBarContent ? (
          <StyledTopSection data-testid={testID ? `${testID}-filter-bar` : undefined}>
            {filterBarContent}
          </StyledTopSection>
        ) : null}

        {bulkActionsContent ? (
          <StyledTopSection data-testid={testID ? `${testID}-bulk-actions` : undefined}>
            {bulkActionsContent}
          </StyledTopSection>
        ) : null}

        {topContentNode ? (
          <StyledTopSection data-testid={testID ? `${testID}-top-content` : undefined}>
            {topContentNode}
          </StyledTopSection>
        ) : null}

        {statusContentNode ? (
          <StyledStatusSection data-testid={testID ? `${testID}-status` : undefined}>
            {statusContentNode}
          </StyledStatusSection>
        ) : null}

        <StyledScrollArea
          onScroll={handleScroll}
          $maxHeight={shouldVirtualize ? viewportHeight : null}
          data-testid={testID ? `${testID}-scroll` : undefined}
        >
          <StyledTable ref={tableRef} $minWidth={resolveSizeValue(minWidth)}>
            <thead>
              <tr>
                {selection?.enabled ? (
                  <StyledHeaderCell $align="center" $isSelection>
                    <Checkbox
                      checked={Boolean(selection?.allSelected)}
                      onChange={(checked) => selection?.onToggleAll?.(Boolean(checked))}
                      accessibilityLabel={selection?.selectAllLabel || 'Select all rows'}
                      testID={selection?.headerCheckboxTestId}
                    />
                  </StyledHeaderCell>
                ) : null}

                {tableColumns.map((column) => {
                  const sortIndicator = resolveSortIndicator(sortField, sortDirection, column.id);
                  const isSortable = Boolean(column.sortable && typeof onSort === 'function');
                  const headerTestId = testID ? `${testID}-sort-${column.id}` : undefined;
                  const headerCellTestId = testID ? `${testID}-header-${column.id}` : undefined;
                  const resizeHandleTestId = testID ? `${testID}-resize-${column.id}` : undefined;
                  const headerContent = typeof column.renderHeader === 'function'
                    ? column.renderHeader(column)
                    : column.label;
                  const canResize = Boolean(normalizedColumnResize.enabled && column.resizable !== false);

                  return (
                    <StyledHeaderCell
                      key={column.id}
                      $align={column.align}
                      $width={column.width}
                      $minWidth={column.minWidth}
                      $isResizable={canResize}
                      ref={(node) => {
                        if (node) {
                          headerCellRefs.current[column.id] = node;
                        } else {
                          delete headerCellRefs.current[column.id];
                        }
                      }}
                      data-testid={headerCellTestId}
                    >
                      {isSortable ? (
                        <StyledHeaderButton
                          type="button"
                          onClick={() => onSort(column.id)}
                          aria-label={column.sortLabel || `Sort by ${column.label}`}
                          $align={column.align}
                          data-testid={headerTestId}
                        >
                          <StyledHeaderText>{headerContent}</StyledHeaderText>
                          <StyledSortIndicator>{sortIndicator}</StyledSortIndicator>
                        </StyledHeaderButton>
                      ) : (
                        <StyledHeaderText>{headerContent}</StyledHeaderText>
                      )}

                      {canResize ? (
                        <StyledResizeHandle
                          type="button"
                          aria-label={`Resize ${column.label} column`}
                          title={`Resize ${column.label} column (double-click to auto-fit)`}
                          onMouseDown={(event) => handleColumnResizeStart(event, column)}
                          onDoubleClick={(event) => handleColumnAutoFit(event, column)}
                          onClick={(event) => event.stopPropagation()}
                          data-testid={resizeHandleTestId}
                          $active={activeResizeColumnId === column.id}
                        />
                      ) : null}
                    </StyledHeaderCell>
                  );
                })}

                {typeof renderRowActions === 'function' ? (
                  <StyledHeaderCell $align="right" $isActions>
                    {rowActionsLabel || t('common.actions')}
                  </StyledHeaderCell>
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
                    columns={tableColumns}
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

              {normalizedRows.length === 0 && showDefaultEmptyRow ? (
                <tr>
                  <StyledEmptyCell $density={resolvedDensity} colSpan={columnSpan}>
                    {emptyMessage || t('listScaffold.emptyState.title')}
                  </StyledEmptyCell>
                </tr>
              ) : null}
            </tbody>
          </StyledTable>
        </StyledScrollArea>

        {(paginationContent || tableNavigationContent || bottomContentNode) ? (
          <StyledBottomBar>
            <StyledBottomPrimary data-testid={testID ? `${testID}-pagination` : undefined}>
              {paginationContent}
            </StyledBottomPrimary>
            <StyledBottomSecondary data-testid={testID ? `${testID}-navigation` : undefined}>
              {tableNavigationContent}
              {bottomContentNode}
            </StyledBottomSecondary>
          </StyledBottomBar>
        ) : null}
      </StyledContainer>
    </StyledScaffold>
  );
};

export default DataTableWeb;

