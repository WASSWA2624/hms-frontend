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
import Button from '../../forms/Button';
import Checkbox from '../../forms/Checkbox';
import Select from '../../forms/Select';
import TextField from '../../forms/TextField';
import Modal from '../../feedback/Modal';
import { DEFAULT_VIRTUALIZATION, ROW_DENSITIES } from './types';
import {
  StyledScaffold,
  StyledTopSection,
  StyledFilterToolsToggle,
  StyledFilterToolsHeader,
  StyledFilterToolsTitle,
  StyledFilterToolsActions,
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
  StyledExportModalTitle,
  StyledExportModalSubtitle,
  StyledExportSummary,
  StyledExportSection,
  StyledExportSectionTitle,
  StyledExportAdvancedToggle,
  StyledExportGrid,
  StyledExportField,
  StyledExportFieldLabel,
  StyledExportOptions,
  StyledExportActions,
  StyledExportStatus,
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

const SEARCH_SCOPE_TEST_ID_SEGMENT = 'search-scope';
const CONTROL_LABEL_COMPONENT_ID = 'styledcontrollabel';

const hasSearchScopeTestId = (props = {}) => {
  const testIds = [props.testID, props['data-testid']];
  return testIds.some((value) => (
    typeof value === 'string'
    && value.toLowerCase().includes(SEARCH_SCOPE_TEST_ID_SEGMENT)
  ));
};

const isSearchScopeControlLabel = (node) => {
  if (!React.isValidElement(node)) return false;
  const styledComponentId = node.type?.styledComponentId;
  return typeof styledComponentId === 'string'
    && styledComponentId.toLowerCase().includes(CONTROL_LABEL_COMPONENT_ID);
};

const normalizeSearchBarSlotNode = (node) => {
  if (!React.isValidElement(node)) {
    return { node, changed: false };
  }

  if (isSearchScopeControlLabel(node)) {
    return { node: null, changed: true };
  }

  let changed = false;
  const nextProps = {};
  const props = node.props || {};

  if (
    hasSearchScopeTestId(props)
    && Object.prototype.hasOwnProperty.call(props, 'label')
  ) {
    nextProps.label = undefined;
    changed = true;
  }

  if (props.children !== undefined) {
    let hasChildChanges = false;
    const normalizedChildren = React.Children.map(props.children, (child) => {
      const normalizedChild = normalizeSearchBarSlotNode(child);
      if (normalizedChild.changed) hasChildChanges = true;
      return normalizedChild.node;
    });

    if (hasChildChanges) {
      nextProps.children = normalizedChildren;
      changed = true;
    }
  }

  if (!changed) {
    return { node, changed: false };
  }

  return {
    node: React.cloneElement(node, nextProps),
    changed: true,
  };
};

const normalizeSearchBarSlotContent = (slotContent) => {
  let changed = false;
  const normalizedChildren = React.Children.map(slotContent, (child) => {
    const normalized = normalizeSearchBarSlotNode(child);
    if (normalized.changed) changed = true;
    return normalized.node;
  });

  if (!changed) {
    return slotContent;
  }

  const childCount = React.Children.count(slotContent);
  if (childCount === 1 && Array.isArray(normalizedChildren)) {
    return normalizedChildren[0] ?? null;
  }

  return normalizedChildren;
};

const EXPORT_FORMATS = {
  CSV: 'csv',
  EXCEL: 'excel',
  PDF: 'pdf',
  PRINT: 'print',
};

const EXPORT_SCOPES = {
  FILTERED: 'filtered',
  VISIBLE: 'visible',
  SELECTED: 'selected',
};

const EXPORT_PAGE_SIZES = {
  A4: 'a4',
  LETTER: 'letter',
};

const EXPORT_ORIENTATIONS = {
  PORTRAIT: 'portrait',
  LANDSCAPE: 'landscape',
};

const CSV_DELIMITERS = {
  COMMA: ',',
  SEMICOLON: ';',
  TAB: '\t',
};

const PAGE_DIMENSIONS = {
  [EXPORT_PAGE_SIZES.A4]: {
    [EXPORT_ORIENTATIONS.PORTRAIT]: { width: 595, height: 842 },
    [EXPORT_ORIENTATIONS.LANDSCAPE]: { width: 842, height: 595 },
  },
  [EXPORT_PAGE_SIZES.LETTER]: {
    [EXPORT_ORIENTATIONS.PORTRAIT]: { width: 612, height: 792 },
    [EXPORT_ORIENTATIONS.LANDSCAPE]: { width: 792, height: 612 },
  },
};

const DEFAULT_EXPORT_FILE_NAME = 'data-table-export';

const sanitizeFileName = (value, fallback = DEFAULT_EXPORT_FILE_NAME) => {
  const normalized = String(value || '')
    .trim()
    .replace(/\.[^/.]+$/, '')
    .replace(/[^a-zA-Z0-9 _-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^[-_.]+|[-_.]+$/g, '');

  return normalized || fallback;
};

const formatExportTimestamp = (date = new Date()) => {
  const pad = (number) => String(number).padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}_${pad(date.getHours())}-${pad(date.getMinutes())}-${pad(date.getSeconds())}`;
};

const escapeCsvValue = (value, delimiter) => {
  const raw = String(value ?? '');
  if (raw.includes('"')) {
    return `"${raw.replace(/"/g, '""')}"`;
  }
  if (raw.includes(delimiter) || raw.includes('\n') || raw.includes('\r')) {
    return `"${raw}"`;
  }
  return raw;
};

const escapeHtml = (value) => String(value ?? '')
  .replace(/&/g, '&amp;')
  .replace(/</g, '&lt;')
  .replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;')
  .replace(/'/g, '&#39;');

const normalizeExportValue = (value) => {
  if (value == null) return '';
  if (typeof value === 'string') return value;
  if (typeof value === 'number' || typeof value === 'boolean') return String(value);
  if (value instanceof Date) return value.toISOString();
  if (Array.isArray(value)) return value.map((entry) => normalizeExportValue(entry)).join(', ');
  if (typeof value === 'object') {
    if (typeof value.label === 'string') return value.label;
    if (typeof value.name === 'string') return value.name;
    try {
      return JSON.stringify(value);
    } catch (_) {
      return String(value);
    }
  }
  return String(value);
};

const resolveExportCellRawValue = (row, rowIndex, column) => {
  if (typeof column.exportAccessor === 'function') {
    return column.exportAccessor(row, rowIndex, column);
  }

  if (typeof column.exportAccessor === 'string') {
    return row?.[column.exportAccessor];
  }

  if (typeof column.accessor === 'function') {
    return column.accessor(row, rowIndex);
  }

  if (typeof column.accessor === 'string') {
    return row?.[column.accessor];
  }

  return row?.[column.id];
};

const resolveExportCellValue = (row, rowIndex, column) => {
  const rawValue = resolveExportCellRawValue(row, rowIndex, column);
  if (typeof column.exportFormatter === 'function') {
    return normalizeExportValue(column.exportFormatter(rawValue, row, rowIndex, column));
  }
  return normalizeExportValue(rawValue);
};

const resolveExportMatrix = ({
  records,
  columns,
  includeHeaders,
  includeRowNumbers,
}) => {
  const headerCells = [];
  if (includeRowNumbers) {
    headerCells.push('#');
  }
  headerCells.push(...columns.map((column) => column.label || column.id));

  const rows = records.map(({ row, rowIndex }) => {
    const cells = [];
    if (includeRowNumbers) {
      cells.push(String(rowIndex + 1));
    }
    columns.forEach((column) => {
      cells.push(resolveExportCellValue(row, rowIndex, column));
    });
    return cells;
  });

  return {
    headers: includeHeaders ? headerCells : [],
    rows,
  };
};

const resolveExportFileExtension = (format) => {
  if (format === EXPORT_FORMATS.CSV) return 'csv';
  if (format === EXPORT_FORMATS.EXCEL) return 'xls';
  if (format === EXPORT_FORMATS.PDF) return 'pdf';
  return 'txt';
};

const buildCsvContent = ({
  headers,
  rows,
  delimiter,
  includeMetadata,
  metadataLines,
}) => {
  const lines = [];

  if (includeMetadata) {
    metadataLines.forEach((line) => {
      lines.push(`# ${line}`);
    });
    if (metadataLines.length > 0) {
      lines.push('');
    }
  }

  if (headers.length > 0) {
    lines.push(headers.map((cell) => escapeCsvValue(cell, delimiter)).join(delimiter));
  }

  rows.forEach((cells) => {
    lines.push(cells.map((cell) => escapeCsvValue(cell, delimiter)).join(delimiter));
  });

  return lines.join('\r\n');
};

const buildExcelDocument = ({
  title,
  headers,
  rows,
  includeMetadata,
  metadataLines,
}) => {
  const metadataHtml = includeMetadata && metadataLines.length > 0
    ? `<div style="margin-bottom: 12px;">${metadataLines.map((line) => `<div>${escapeHtml(line)}</div>`).join('')}</div>`
    : '';
  const headerHtml = headers.length > 0
    ? `<thead><tr>${headers.map((header) => `<th>${escapeHtml(header)}</th>`).join('')}</tr></thead>`
    : '';
  const bodyHtml = rows.length > 0
    ? rows.map((cells) => `<tr>${cells.map((cell) => `<td>${escapeHtml(cell)}</td>`).join('')}</tr>`).join('')
    : '<tr><td>(No rows)</td></tr>';

  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <title>${escapeHtml(title)}</title>
  <style>
    body { font-family: Arial, sans-serif; margin: 16px; }
    table { border-collapse: collapse; width: 100%; }
    th, td { border: 1px solid #d1d1d6; padding: 6px 8px; font-size: 12px; text-align: left; }
    th { background: #f2f2f7; font-weight: 600; }
  </style>
</head>
<body>
  <h3>${escapeHtml(title)}</h3>
  ${metadataHtml}
  <table>
    ${headerHtml}
    <tbody>
      ${bodyHtml}
    </tbody>
  </table>
</body>
</html>`;
};

const sanitizePdfText = (value) => String(value ?? '')
  .replace(/[^\x20-\x7E]/g, ' ')
  .replace(/\\/g, '\\\\')
  .replace(/\(/g, '\\(')
  .replace(/\)/g, '\\)');

const wrapPdfLine = (line, maxChars) => {
  const text = String(line ?? '');
  if (text.length <= maxChars) return [text];
  const words = text.split(/\s+/).filter(Boolean);
  if (words.length === 0) return [''];

  const wrapped = [];
  let current = '';

  words.forEach((word) => {
    const candidate = current ? `${current} ${word}` : word;
    if (candidate.length <= maxChars) {
      current = candidate;
      return;
    }

    if (current) {
      wrapped.push(current);
      current = '';
    }

    if (word.length > maxChars) {
      for (let index = 0; index < word.length; index += maxChars) {
        wrapped.push(word.slice(index, index + maxChars));
      }
      return;
    }

    current = word;
  });

  if (current) {
    wrapped.push(current);
  }

  return wrapped;
};

const buildPdfBytes = ({
  lines,
  pageSize,
  orientation,
}) => {
  const dimensions = PAGE_DIMENSIONS[pageSize]?.[orientation]
    || PAGE_DIMENSIONS[EXPORT_PAGE_SIZES.A4][EXPORT_ORIENTATIONS.LANDSCAPE];
  const pageWidth = dimensions.width;
  const pageHeight = dimensions.height;
  const margin = 36;
  const lineHeight = 12;
  const maxChars = Math.max(40, Math.floor((pageWidth - margin * 2) / 5.5));
  const maxLinesPerPage = Math.max(20, Math.floor((pageHeight - margin * 2) / lineHeight));

  const wrappedLines = [];
  lines.forEach((line) => {
    wrappedLines.push(...wrapPdfLine(line, maxChars));
  });

  const pages = [];
  for (let index = 0; index < wrappedLines.length; index += maxLinesPerPage) {
    pages.push(wrappedLines.slice(index, index + maxLinesPerPage));
  }
  if (pages.length === 0) {
    pages.push(['(No rows)']);
  }

  const objects = [];
  const addObject = (content) => {
    objects.push(content);
    return objects.length;
  };

  const fontObjectId = addObject('<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>');
  const contentObjectIds = pages.map((pageLines) => {
    const streamLines = ['BT', '/F1 10 Tf'];
    let y = pageHeight - margin;
    pageLines.forEach((line) => {
      streamLines.push(`1 0 0 1 ${margin} ${y} Tm (${sanitizePdfText(line)}) Tj`);
      y -= lineHeight;
    });
    streamLines.push('ET');
    const stream = streamLines.join('\n');
    return addObject(`<< /Length ${stream.length} >>\nstream\n${stream}\nendstream`);
  });

  const pagesObjectId = addObject('<< /Type /Pages /Kids [] /Count 0 >>');
  const pageObjectIds = contentObjectIds.map((contentObjectId) => addObject(
    `<< /Type /Page /Parent ${pagesObjectId} 0 R /MediaBox [0 0 ${pageWidth} ${pageHeight}] /Resources << /Font << /F1 ${fontObjectId} 0 R >> >> /Contents ${contentObjectId} 0 R >>`
  ));
  objects[pagesObjectId - 1] = `<< /Type /Pages /Kids [${pageObjectIds.map((objectId) => `${objectId} 0 R`).join(' ')}] /Count ${pageObjectIds.length} >>`;
  const catalogObjectId = addObject(`<< /Type /Catalog /Pages ${pagesObjectId} 0 R >>`);

  let pdf = '%PDF-1.4\n';
  const offsets = [0];
  objects.forEach((content, index) => {
    offsets[index + 1] = pdf.length;
    pdf += `${index + 1} 0 obj\n${content}\nendobj\n`;
  });

  const xrefStart = pdf.length;
  pdf += `xref\n0 ${objects.length + 1}\n`;
  pdf += '0000000000 65535 f \n';
  for (let index = 1; index <= objects.length; index += 1) {
    pdf += `${String(offsets[index]).padStart(10, '0')} 00000 n \n`;
  }
  pdf += `trailer\n<< /Size ${objects.length + 1} /Root ${catalogObjectId} 0 R >>\nstartxref\n${xrefStart}\n%%EOF`;

  return new TextEncoder().encode(pdf);
};

const triggerDownload = (blob, fileName) => {
  if (typeof window === 'undefined' || typeof document === 'undefined') {
    return false;
  }
  if (typeof window.URL?.createObjectURL !== 'function') {
    return false;
  }

  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
  return true;
};

const buildPrintHtml = ({
  title,
  headers,
  rows,
  includeMetadata,
  metadataLines,
  pageSize,
  orientation,
}) => {
  const metadataHtml = includeMetadata && metadataLines.length > 0
    ? `<div class="meta">${metadataLines.map((line) => `<div>${escapeHtml(line)}</div>`).join('')}</div>`
    : '';
  const headerHtml = headers.length > 0
    ? `<thead><tr>${headers.map((header) => `<th>${escapeHtml(header)}</th>`).join('')}</tr></thead>`
    : '';
  const bodyHtml = rows.length > 0
    ? rows.map((cells) => `<tr>${cells.map((cell) => `<td>${escapeHtml(cell)}</td>`).join('')}</tr>`).join('')
    : '<tr><td>(No rows)</td></tr>';

  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <title>${escapeHtml(title)}</title>
  <style>
    @page { size: ${pageSize} ${orientation}; margin: 12mm; }
    body { font-family: Arial, sans-serif; margin: 0; color: #000; }
    h2 { margin: 0 0 8px 0; font-size: 18px; }
    .meta { margin-bottom: 10px; font-size: 12px; color: #333; }
    table { width: 100%; border-collapse: collapse; }
    th, td { border: 1px solid #d1d1d6; padding: 5px 7px; text-align: left; font-size: 11px; }
    th { background: #f2f2f7; font-weight: 600; }
  </style>
</head>
<body>
  <h2>${escapeHtml(title)}</h2>
  ${metadataHtml}
  <table>
    ${headerHtml}
    <tbody>${bodyHtml}</tbody>
  </table>
</body>
</html>`;
};

const DataTableRow = React.memo(({
  row,
  rowIndex,
  rowNumber,
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
      <StyledCell
        $density={rowDensity}
        $align="center"
        $isRowNumber
      >
        {rowNumber}
      </StyledCell>

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
  tableTitle,
  exportConfig,
  hasActiveFilters = false,
  testID,
  className,
  style,
}) => {
  const { t } = useI18n();
  const [scrollTop, setScrollTop] = useState(0);
  const [columnWidths, setColumnWidths] = useState({});
  const [activeResizeColumnId, setActiveResizeColumnId] = useState(null);
  const [isFilterToolsVisible, setIsFilterToolsVisible] = useState(() => Boolean(hasActiveFilters));
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [isExportAdvancedVisible, setIsExportAdvancedVisible] = useState(false);
  const [exportFormat, setExportFormat] = useState(EXPORT_FORMATS.CSV);
  const [exportScope, setExportScope] = useState(EXPORT_SCOPES.FILTERED);
  const [exportFileName, setExportFileName] = useState('');
  const [includeHeaders, setIncludeHeaders] = useState(true);
  const [includeRowNumbers, setIncludeRowNumbers] = useState(true);
  const [includeMetadata, setIncludeMetadata] = useState(true);
  const [includeTimestamp, setIncludeTimestamp] = useState(true);
  const [csvDelimiter, setCsvDelimiter] = useState(CSV_DELIMITERS.COMMA);
  const [pageSize, setPageSize] = useState(EXPORT_PAGE_SIZES.A4);
  const [orientation, setOrientation] = useState(EXPORT_ORIENTATIONS.LANDSCAPE);
  const [exportStatus, setExportStatus] = useState(null);
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

  const normalizedExportConfig = useMemo(() => ({
    enabled: exportConfig?.enabled !== false,
    defaultFileName: sanitizeFileName(
      exportConfig?.defaultFileName
        || tableTitle
        || testID
        || DEFAULT_EXPORT_FILE_NAME
    ),
  }), [exportConfig?.defaultFileName, exportConfig?.enabled, tableTitle, testID]);

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

  const selectedRecords = useMemo(() => {
    if (!selection?.enabled || typeof selection?.isRowSelected !== 'function') {
      return [];
    }

    return normalizedRows.reduce((accumulator, row, rowIndex) => {
      if (selection.isRowSelected(row, rowIndex)) {
        accumulator.push({ row, rowIndex });
      }
      return accumulator;
    }, []);
  }, [normalizedRows, selection]);

  const filteredRecords = useMemo(
    () => normalizedRows.map((row, rowIndex) => ({ row, rowIndex })),
    [normalizedRows]
  );

  const visibleRecords = useMemo(
    () => renderedRows.map((row, index) => ({ row, rowIndex: startIndex + index })),
    [renderedRows, startIndex]
  );

  const columnSpan = tableColumns.length
    + 1
    + (selection?.enabled ? 1 : 0)
    + (typeof renderRowActions === 'function' ? 1 : 0);

  const slotContext = useMemo(() => ({
    columns: tableColumns,
    rows: normalizedRows,
    sortField,
    sortDirection,
    rowDensity: resolvedDensity,
  }), [tableColumns, normalizedRows, sortField, sortDirection, resolvedDensity]);

  const searchBarContent = normalizeSearchBarSlotContent(
    resolveSlotContent(searchBar, slotContext)
  );
  const filterBarContent = resolveSlotContent(filterBar, slotContext);
  const bulkActionsContent = resolveSlotContent(bulkActionsBar, slotContext);
  const topContentNode = resolveSlotContent(topContent, slotContext);
  const statusContentNode = resolveSlotContent(statusContent, slotContext);
  const paginationContent = resolveSlotContent(pagination, slotContext);
  const tableNavigationContent = resolveSlotContent(tableNavigation, slotContext);
  const bottomContentNode = resolveSlotContent(bottomContent, slotContext);
  const hasFilterToolsSection = Boolean(
    searchBarContent
    || filterBarContent
    || normalizedExportConfig.enabled
  );

  const exportFormatOptions = useMemo(() => [
    { label: t('common.dataTable.export.formatOptionCsv'), value: EXPORT_FORMATS.CSV },
    { label: t('common.dataTable.export.formatOptionExcel'), value: EXPORT_FORMATS.EXCEL },
    { label: t('common.dataTable.export.formatOptionPdf'), value: EXPORT_FORMATS.PDF },
    { label: t('common.dataTable.export.formatOptionPrint'), value: EXPORT_FORMATS.PRINT },
  ], [t]);

  const csvDelimiterOptions = useMemo(() => [
    { label: t('common.dataTable.export.delimiterComma'), value: CSV_DELIMITERS.COMMA },
    { label: t('common.dataTable.export.delimiterSemicolon'), value: CSV_DELIMITERS.SEMICOLON },
    { label: t('common.dataTable.export.delimiterTab'), value: CSV_DELIMITERS.TAB },
  ], [t]);

  const pageSizeOptions = useMemo(() => [
    { label: t('common.dataTable.export.pageSizeA4'), value: EXPORT_PAGE_SIZES.A4 },
    { label: t('common.dataTable.export.pageSizeLetter'), value: EXPORT_PAGE_SIZES.LETTER },
  ], [t]);

  const orientationOptions = useMemo(() => [
    { label: t('common.dataTable.export.orientationLandscape'), value: EXPORT_ORIENTATIONS.LANDSCAPE },
    { label: t('common.dataTable.export.orientationPortrait'), value: EXPORT_ORIENTATIONS.PORTRAIT },
  ], [t]);

  const exportScopeOptions = useMemo(() => {
    const options = [
      {
        label: t('common.dataTable.export.scopeOptionFiltered', { count: filteredRecords.length }),
        value: EXPORT_SCOPES.FILTERED,
      },
      {
        label: t('common.dataTable.export.scopeOptionVisible', { count: visibleRecords.length }),
        value: EXPORT_SCOPES.VISIBLE,
      },
    ];

    if (selectedRecords.length > 0) {
      options.push({
        label: t('common.dataTable.export.scopeOptionSelected', { count: selectedRecords.length }),
        value: EXPORT_SCOPES.SELECTED,
      });
    }

    return options;
  }, [filteredRecords.length, visibleRecords.length, selectedRecords.length, t]);

  const exportRecords = useMemo(() => {
    if (exportScope === EXPORT_SCOPES.SELECTED && selectedRecords.length > 0) {
      return selectedRecords;
    }
    if (exportScope === EXPORT_SCOPES.VISIBLE) {
      return visibleRecords;
    }
    return filteredRecords;
  }, [exportScope, selectedRecords, visibleRecords, filteredRecords]);

  const activeExportScopeLabel = useMemo(
    () => exportScopeOptions.find((option) => option.value === exportScope)?.label || exportScope,
    [exportScopeOptions, exportScope]
  );

  const isPrintMode = exportFormat === EXPORT_FORMATS.PRINT;
  const isPdfLikeFormat = exportFormat === EXPORT_FORMATS.PDF || exportFormat === EXPORT_FORMATS.PRINT;

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

    const columnOffset = 1 + (selection?.enabled ? 1 : 0);
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

  useEffect(() => {
    if (exportFileName) return;
    setExportFileName(normalizedExportConfig.defaultFileName);
  }, [exportFileName, normalizedExportConfig.defaultFileName]);

  useEffect(() => {
    const allowedScopes = exportScopeOptions.map((option) => option.value);
    if (allowedScopes.includes(exportScope)) return;
    if (allowedScopes.length > 0) {
      setExportScope(allowedScopes[0]);
    }
  }, [exportScopeOptions, exportScope]);

  useEffect(() => {
    if (!hasActiveFilters) return;
    setIsFilterToolsVisible(true);
  }, [hasActiveFilters]);

  useEffect(() => {
    if (hasFilterToolsSection || !isFilterToolsVisible) return;
    setIsFilterToolsVisible(false);
  }, [hasFilterToolsSection, isFilterToolsVisible]);

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

  const resolveExportMetadataLines = useCallback((generatedAt) => {
    const lines = [
      t('common.dataTable.export.metadataRows', { count: exportRecords.length }),
      t('common.dataTable.export.metadataScope', { scope: activeExportScopeLabel }),
    ];

    if (includeTimestamp) {
      lines.push(
        t('common.dataTable.export.metadataGenerated', {
          value: generatedAt.toLocaleString(),
        })
      );
    }

    return lines;
  }, [exportRecords.length, activeExportScopeLabel, includeTimestamp, t]);

  const handleShowFilterTools = useCallback(() => {
    setIsFilterToolsVisible(true);
  }, []);

  const handleToggleFilterTools = useCallback(() => {
    setIsFilterToolsVisible((previous) => !previous);
  }, []);

  const handleOpenExportModal = useCallback(() => {
    setExportStatus(null);
    setIsExportAdvancedVisible(false);
    setIsExportModalOpen(true);
  }, []);

  const handleCloseExportModal = useCallback(() => {
    setIsExportModalOpen(false);
    setExportStatus(null);
  }, []);

  const handleToggleExportAdvanced = useCallback(() => {
    setIsExportAdvancedVisible((previous) => !previous);
  }, []);

  const handleRunExportAction = useCallback(() => {
    const title = tableTitle || t('common.dataTable.export.defaultTitle');
    const generatedAt = new Date();
    const matrix = resolveExportMatrix({
      records: exportRecords,
      columns: tableColumns,
      includeHeaders,
      includeRowNumbers,
    });
    const metadataLines = resolveExportMetadataLines(generatedAt);
    const safeBaseFileName = sanitizeFileName(
      exportFileName || normalizedExportConfig.defaultFileName
    );
    const timestampSuffix = includeTimestamp ? `-${formatExportTimestamp(generatedAt)}` : '';

    if (isPrintMode) {
      if (typeof window === 'undefined') {
        setExportStatus({
          type: 'error',
          message: t('common.dataTable.export.status.printUnavailable'),
        });
        return;
      }

      const printWindow = window.open('', '_blank', 'noopener,noreferrer');
      if (!printWindow || !printWindow.document) {
        setExportStatus({
          type: 'error',
          message: t('common.dataTable.export.status.printPopupBlocked'),
        });
        return;
      }

      const printHtml = buildPrintHtml({
        title,
        headers: matrix.headers,
        rows: matrix.rows,
        includeMetadata,
        metadataLines,
        pageSize,
        orientation,
      });
      printWindow.document.open();
      printWindow.document.write(printHtml);
      printWindow.document.close();
      printWindow.focus();
      printWindow.print();
      setExportStatus({
        type: 'success',
        message: t('common.dataTable.export.status.printOpened'),
      });
      return;
    }

    const extension = resolveExportFileExtension(exportFormat);
    const fileName = `${safeBaseFileName}${timestampSuffix}.${extension}`;
    let blob;

    if (exportFormat === EXPORT_FORMATS.CSV) {
      const csvContent = buildCsvContent({
        headers: matrix.headers,
        rows: matrix.rows,
        delimiter: csvDelimiter,
        includeMetadata,
        metadataLines,
      });
      blob = new Blob([`\uFEFF${csvContent}`], { type: 'text/csv;charset=utf-8;' });
    } else if (exportFormat === EXPORT_FORMATS.EXCEL) {
      const excelContent = buildExcelDocument({
        title,
        headers: matrix.headers,
        rows: matrix.rows,
        includeMetadata,
        metadataLines,
      });
      blob = new Blob([excelContent], { type: 'application/vnd.ms-excel;charset=utf-8;' });
    } else if (exportFormat === EXPORT_FORMATS.PDF) {
      const pdfLines = [title, ''];
      if (includeMetadata) {
        pdfLines.push(...metadataLines, '');
      }
      if (matrix.headers.length > 0) {
        pdfLines.push(matrix.headers.join(' | '));
        pdfLines.push(matrix.headers.map((header) => '-'.repeat(Math.max(3, Math.min(22, String(header).length)))).join('-+-'));
      }
      if (matrix.rows.length === 0) {
        pdfLines.push(t('common.dataTable.export.noRowsFallback'));
      } else {
        matrix.rows.forEach((cells) => {
          pdfLines.push(cells.join(' | '));
        });
      }

      const pdfBytes = buildPdfBytes({
        lines: pdfLines,
        pageSize,
        orientation,
      });
      blob = new Blob([pdfBytes], { type: 'application/pdf' });
    } else {
      setExportStatus({
        type: 'error',
        message: t('common.dataTable.export.status.unsupportedFormat'),
      });
      return;
    }

    const wasDownloaded = triggerDownload(blob, fileName);
    if (!wasDownloaded) {
      setExportStatus({
        type: 'error',
        message: t('common.dataTable.export.status.downloadFailed'),
      });
      return;
    }

    setExportStatus({
      type: 'success',
      message: t('common.dataTable.export.status.exported', {
        count: exportRecords.length,
        format: extension.toUpperCase(),
      }),
    });
  }, [
    tableTitle,
    exportRecords,
    tableColumns,
    includeHeaders,
    includeRowNumbers,
    resolveExportMetadataLines,
    exportFileName,
    normalizedExportConfig.defaultFileName,
    includeTimestamp,
    isPrintMode,
    includeMetadata,
    pageSize,
    orientation,
    exportFormat,
    csvDelimiter,
    t,
  ]);

  return (
    <StyledScaffold
      className={className}
      style={style}
      data-testid={testID}
    >
      <StyledContainer data-testid={testID ? `${testID}-table-container` : undefined}>
        {hasFilterToolsSection && !isFilterToolsVisible ? (
          <StyledFilterToolsToggle data-testid={testID ? `${testID}-filter-tools-toggle` : undefined}>
            <Button
              variant="text"
              size="small"
              onPress={handleShowFilterTools}
              testID={testID ? `${testID}-filter-tools-show` : 'data-table-filter-tools-show'}
              accessibilityLabel={t('common.dataTable.controls.showFiltersA11y')}
            >
              {t('common.dataTable.controls.showFilters')}
            </Button>
          </StyledFilterToolsToggle>
        ) : null}

        {hasFilterToolsSection && isFilterToolsVisible ? (
          <>
            <StyledFilterToolsHeader data-testid={testID ? `${testID}-filter-tools-header` : undefined}>
              <StyledFilterToolsTitle>{t('common.dataTable.controls.filtersTitle')}</StyledFilterToolsTitle>
              <StyledFilterToolsActions>
                {normalizedExportConfig.enabled ? (
                  <Button
                    variant="text"
                    size="small"
                    onPress={handleOpenExportModal}
                    testID={testID ? `${testID}-export-trigger` : 'data-table-export-trigger'}
                    accessibilityLabel={t('common.dataTable.controls.exportA11y')}
                  >
                    {t('common.dataTable.controls.export')}
                  </Button>
                ) : null}
                <Button
                  variant="text"
                  size="small"
                  onPress={handleToggleFilterTools}
                  testID={testID ? `${testID}-filter-tools-collapse` : 'data-table-filter-tools-collapse'}
                  accessibilityLabel={t('common.dataTable.controls.hideFiltersA11y')}
                >
                  {t('common.dataTable.controls.hideFilters')}
                </Button>
              </StyledFilterToolsActions>
            </StyledFilterToolsHeader>

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
          </>
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
                <StyledHeaderCell $align="center" $isRowNumber>
                  #
                </StyledHeaderCell>

                {selection?.enabled ? (
                  <StyledHeaderCell $align="center" $isSelection>
                    <Checkbox
                      checked={Boolean(selection?.allSelected)}
                      onChange={(checked) => selection?.onToggleAll?.(Boolean(checked))}
                      accessibilityLabel={selection?.selectAllLabel || t('common.dataTable.controls.selectAllRows')}
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
                    rowNumber={absoluteIndex + 1}
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

      {normalizedExportConfig.enabled ? (
        <Modal
          visible={isExportModalOpen}
          onDismiss={handleCloseExportModal}
          size="medium"
          accessibilityLabel={t('common.dataTable.exportModal.accessibilityLabel')}
          testID={testID ? `${testID}-export-modal` : 'data-table-export-modal'}
        >
          <StyledExportModalTitle>{t('common.dataTable.exportModal.title')}</StyledExportModalTitle>
          <StyledExportModalSubtitle>
            {t('common.dataTable.exportModal.subtitle')}
          </StyledExportModalSubtitle>

          <StyledExportSummary>
            {t('common.dataTable.export.summary', {
              filtered: filteredRecords.length,
              visible: visibleRecords.length,
              selected: selectedRecords.length,
            })}
          </StyledExportSummary>

          <StyledExportSection>
            <StyledExportSectionTitle>
              {t('common.dataTable.export.basicSectionTitle')}
            </StyledExportSectionTitle>
            <StyledExportGrid>
              <StyledExportField>
                <StyledExportFieldLabel>{t('common.dataTable.export.labelFormat')}</StyledExportFieldLabel>
                <Select
                  value={exportFormat}
                  onValueChange={setExportFormat}
                  options={exportFormatOptions}
                  compact
                  testID={testID ? `${testID}-export-format` : 'data-table-export-format'}
                />
              </StyledExportField>

              <StyledExportField>
                <StyledExportFieldLabel>{t('common.dataTable.export.labelScope')}</StyledExportFieldLabel>
                <Select
                  value={exportScope}
                  onValueChange={setExportScope}
                  options={exportScopeOptions}
                  compact
                  testID={testID ? `${testID}-export-scope` : 'data-table-export-scope'}
                />
              </StyledExportField>
            </StyledExportGrid>
          </StyledExportSection>

          <StyledExportAdvancedToggle>
            <Button
              variant="text"
              size="small"
              onPress={handleToggleExportAdvanced}
              testID={testID ? `${testID}-export-advanced-toggle` : 'data-table-export-advanced-toggle'}
              accessibilityLabel={isExportAdvancedVisible
                ? t('common.dataTable.export.hideAdvancedA11y')
                : t('common.dataTable.export.showAdvancedA11y')}
            >
              {isExportAdvancedVisible
                ? t('common.dataTable.export.hideAdvanced')
                : t('common.dataTable.export.showAdvanced')}
            </Button>
          </StyledExportAdvancedToggle>

          {isExportAdvancedVisible ? (
            <StyledExportSection data-testid={testID ? `${testID}-export-advanced-section` : 'data-table-export-advanced-section'}>
              <StyledExportSectionTitle>
                {t('common.dataTable.export.advancedSectionTitle')}
              </StyledExportSectionTitle>
              <StyledExportGrid>
                {!isPrintMode ? (
                  <StyledExportField>
                    <StyledExportFieldLabel>{t('common.dataTable.export.labelFileName')}</StyledExportFieldLabel>
                    <TextField
                      value={exportFileName}
                      onChange={(event) => setExportFileName(event.target.value)}
                      placeholder={normalizedExportConfig.defaultFileName}
                      density="compact"
                      testID={testID ? `${testID}-export-file-name` : 'data-table-export-file-name'}
                    />
                  </StyledExportField>
                ) : null}

                {exportFormat === EXPORT_FORMATS.CSV ? (
                  <StyledExportField>
                    <StyledExportFieldLabel>{t('common.dataTable.export.labelDelimiter')}</StyledExportFieldLabel>
                    <Select
                      value={csvDelimiter}
                      onValueChange={setCsvDelimiter}
                      options={csvDelimiterOptions}
                      compact
                      testID={testID ? `${testID}-export-delimiter` : 'data-table-export-delimiter'}
                    />
                  </StyledExportField>
                ) : null}

                {isPdfLikeFormat ? (
                  <StyledExportField>
                    <StyledExportFieldLabel>{t('common.dataTable.export.labelPageSize')}</StyledExportFieldLabel>
                    <Select
                      value={pageSize}
                      onValueChange={setPageSize}
                      options={pageSizeOptions}
                      compact
                      testID={testID ? `${testID}-export-page-size` : 'data-table-export-page-size'}
                    />
                  </StyledExportField>
                ) : null}

                {isPdfLikeFormat ? (
                  <StyledExportField>
                    <StyledExportFieldLabel>{t('common.dataTable.export.labelOrientation')}</StyledExportFieldLabel>
                    <Select
                      value={orientation}
                      onValueChange={setOrientation}
                      options={orientationOptions}
                      compact
                      testID={testID ? `${testID}-export-orientation` : 'data-table-export-orientation'}
                    />
                  </StyledExportField>
                ) : null}
              </StyledExportGrid>

              <StyledExportOptions>
                <Checkbox
                  checked={includeHeaders}
                  onChange={(checked) => setIncludeHeaders(Boolean(checked))}
                  label={t('common.dataTable.export.includeHeaders')}
                  testID={testID ? `${testID}-export-include-headers` : 'data-table-export-include-headers'}
                />
                <Checkbox
                  checked={includeRowNumbers}
                  onChange={(checked) => setIncludeRowNumbers(Boolean(checked))}
                  label={t('common.dataTable.export.includeRowNumbers')}
                  testID={testID ? `${testID}-export-include-row-numbers` : 'data-table-export-include-row-numbers'}
                />
                <Checkbox
                  checked={includeTimestamp}
                  onChange={(checked) => setIncludeTimestamp(Boolean(checked))}
                  label={t('common.dataTable.export.includeTimestamp')}
                  testID={testID ? `${testID}-export-include-timestamp` : 'data-table-export-include-timestamp'}
                />
                <Checkbox
                  checked={includeMetadata}
                  onChange={(checked) => setIncludeMetadata(Boolean(checked))}
                  label={t('common.dataTable.export.includeMetadata')}
                  testID={testID ? `${testID}-export-include-metadata` : 'data-table-export-include-metadata'}
                />
              </StyledExportOptions>
            </StyledExportSection>
          ) : null}

          {exportStatus ? (
            <StyledExportStatus $type={exportStatus.type}>
              {exportStatus.message}
            </StyledExportStatus>
          ) : null}

          <StyledExportActions>
            <Button
              variant="surface"
              size="small"
              onPress={handleCloseExportModal}
              testID={testID ? `${testID}-export-cancel` : 'data-table-export-cancel'}
            >
              {t('common.cancel')}
            </Button>
            <Button
              variant="primary"
              size="small"
              onPress={handleRunExportAction}
              testID={testID ? `${testID}-export-apply` : 'data-table-export-apply'}
            >
              {isPrintMode
                ? t('common.dataTable.controls.print')
                : t('common.dataTable.controls.export')}
            </Button>
          </StyledExportActions>
        </Modal>
      ) : null}
    </StyledScaffold>
  );
};

export default DataTableWeb;

