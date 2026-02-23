import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import styled, { useTheme } from 'styled-components/native';
import { Button, Icon, Text } from '@platform/components';
import { Platform, Pressable } from 'react-native';

const sanitizeString = (value) => String(value || '').trim();
const IS_WEB = Platform.OS === 'web';
const RESIZE_HANDLE_WIDTH = 14;
const DEFAULT_WEB_TABLE_WIDTH = 980;
const ACTION_LABEL_COLLAPSE_WIDTH = 255;

const clampValue = (value, min, max) => {
  const boundedMin = Number.isFinite(min) ? min : -Infinity;
  const boundedMax = Number.isFinite(max) ? max : Infinity;
  return Math.min(boundedMax, Math.max(boundedMin, value));
};

const StyledTable = styled.View`
  width: 100%;
  border-width: 1px;
  border-color: ${({ theme }) => theme.colors.border?.subtle || '#e2e8f0'};
`;

const StyledHeaderRow = styled.View`
  flex-direction: row;
  align-items: center;
  background-color: ${({ theme }) => theme.colors.background?.secondary || '#f8fafc'};
  border-bottom-width: 1px;
  border-bottom-color: ${({ theme }) => theme.colors.border?.subtle || '#e2e8f0'};
`;

const StyledDataRow = styled.View`
  flex-direction: row;
  align-items: center;
  border-bottom-width: ${({ $isLastRow }) => ($isLastRow ? 0 : 1)}px;
  border-bottom-color: ${({ theme }) => theme.colors.border?.subtle || '#e2e8f0'};
  background-color: ${({ $rowIndex, $isHovered, theme }) => {
    if ($isHovered) {
      return theme.colors.background?.tertiary || '#eef2f7';
    }
    return $rowIndex % 2 === 0
      ? theme.colors.background?.primary || '#ffffff'
      : theme.colors.background?.secondary || '#f8fafc';
  }};
`;

const resolveCellFlex = (columnId) => {
  if (columnId === 'patient') return 1.4;
  if (columnId === 'actions') return 1.45;
  if (columnId === 'number') return 0.45;
  return 1;
};

const resolveCellAlignment = (columnId) => {
  if (columnId === 'actions') return 'flex-start';
  if (columnId === 'number') return 'center';
  return 'flex-start';
};

const StyledCell = styled.View`
  flex: ${({ $columnId }) => resolveCellFlex($columnId)};
  min-width: 0;
  padding: 4px 8px;
  justify-content: center;
  align-items: ${({ $columnId }) => resolveCellAlignment($columnId)};
  border-right-width: ${({ $isLastColumn }) => ($isLastColumn ? 0 : 1)}px;
  border-right-color: ${({ theme }) => theme.colors.border?.subtle || '#e2e8f0'};
`;

const StyledHeaderCellContent = styled.View`
  width: 100%;
  position: relative;
  padding-right: ${({ $isResizable }) => ($isResizable ? 10 : 0)}px;
`;

const StyledHeaderCellText = styled(Text)`
  width: 100%;
  font-size: 11px;
  font-weight: ${({ theme }) => theme?.typography?.fontWeight?.semibold || '600'};
`;

const StyledResizeHandle = styled(Pressable)`
  position: absolute;
  top: -4px;
  right: -8px;
  bottom: -4px;
  width: ${RESIZE_HANDLE_WIDTH}px;
  align-items: center;
  justify-content: center;
  z-index: 3;
  cursor: col-resize;
`;

const StyledResizeRail = styled.View`
  width: 2px;
  height: 70%;
  border-radius: 999px;
  background-color: ${({ theme, $active }) => (
    $active
      ? theme.colors.primary
      : theme.colors.border?.default || '#94a3b8'
  )};
  opacity: ${({ $active }) => ($active ? 0.98 : 0.8)};
`;

const StyledCellText = styled(Text)`
  width: 100%;
`;

const StyledActionButtonsRow = styled.View`
  width: 100%;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
`;

const StyledActionButtonSlot = styled.View`
  margin-left: ${({ $isFirst }) => ($isFirst ? 0 : 2)}px;
`;

const StyledRowNumberBadge = styled.View`
  min-width: 20px;
  height: 18px;
  padding-horizontal: 5px;
  border-radius: 999px;
  align-items: center;
  justify-content: center;
  border-width: 1px;
  border-color: ${({ theme }) => theme.colors.border?.subtle || '#e2e8f0'};
  background-color: ${({ theme }) => theme.colors.background?.primary || '#ffffff'};
`;

const resolveLabel = (value, fallback = '-') => {
  const normalized = sanitizeString(value);
  return normalized || fallback;
};

const toPositiveInteger = (value) => {
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) return null;
  const normalized = Math.trunc(parsed);
  return normalized > 0 ? normalized : null;
};

const resolveNumericSuffix = (value) => {
  const normalized = sanitizeString(value);
  if (!normalized) return null;
  const match = normalized.match(/(\d+)(?!.*\d)/);
  if (!match) return null;
  return toPositiveInteger(match[1]);
};

const resolveStableIdentity = (item) =>
  sanitizeString(item?.id)
  || sanitizeString(item?.listKey)
  || sanitizeString(item?.humanFriendlyId)
  || sanitizeString(item?.displayName);

const toTestIdSegment = (value) =>
  sanitizeString(value).replace(/[^a-z0-9_-]+/gi, '-');

const hashToPositiveInteger = (value) => {
  const normalized = sanitizeString(value);
  if (!normalized) return null;

  let hash = 0;
  for (let index = 0; index < normalized.length; index += 1) {
    hash = ((hash << 5) - hash) + normalized.charCodeAt(index);
    hash |= 0;
  }

  return toPositiveInteger(Math.abs(hash % 100000)) || 1;
};

const PatientListCards = ({
  items = [],
  onOpenPatient,
  onEditPatient,
  onDeletePatient,
  patientLabel = 'Patient',
  patientIdLabel,
  tenantLabel,
  facilityLabel,
  openButtonLabel,
  editButtonLabel = 'Edit',
  deleteButtonLabel = 'Delete',
  actionsLabel = 'Actions',
  resolveOpenAccessibilityLabel,
  resolveEditAccessibilityLabel,
  resolveDeleteAccessibilityLabel,
  testIdPrefix,
  showNumbers = true,
}) => {
  const theme = useTheme();
  const tableRef = useRef(null);
  const resizeCleanupRef = useRef(null);
  const [tableWidth, setTableWidth] = useState(0);
  const [columnWidths, setColumnWidths] = useState({});
  const [activeResizeColumnId, setActiveResizeColumnId] = useState(null);
  const [hoveredRowKey, setHoveredRowKey] = useState(null);
  const compactActionButtonStyle = useMemo(
    () => ({
      minHeight: 28,
      paddingLeft: 8,
      paddingRight: 8,
      paddingTop: 2,
      paddingBottom: 2,
    }),
    []
  );
  const compactIconActionButtonStyle = useMemo(
    () => ({
      ...compactActionButtonStyle,
      minWidth: 30,
      paddingLeft: 6,
      paddingRight: 6,
    }),
    [compactActionButtonStyle]
  );
  const editButtonStyle = useMemo(
    () => ({
      ...compactIconActionButtonStyle,
      borderColor: `${theme?.colors?.primary || '#2563eb'}66`,
      backgroundColor: theme?.colors?.background?.primary || '#ffffff',
    }),
    [compactIconActionButtonStyle, theme]
  );
  const editButtonStyleWithLabel = useMemo(
    () => ({
      ...compactActionButtonStyle,
      borderColor: `${theme?.colors?.primary || '#2563eb'}66`,
      backgroundColor: theme?.colors?.background?.primary || '#ffffff',
    }),
    [compactActionButtonStyle, theme]
  );
  const deleteButtonStyle = useMemo(
    () => ({
      ...compactIconActionButtonStyle,
      borderColor: `${theme?.colors?.error || '#dc2626'}66`,
      backgroundColor: theme?.colors?.background?.primary || '#ffffff',
    }),
    [compactIconActionButtonStyle, theme]
  );
  const deleteButtonStyleWithLabel = useMemo(
    () => ({
      ...compactActionButtonStyle,
      borderColor: `${theme?.colors?.error || '#dc2626'}66`,
      backgroundColor: theme?.colors?.background?.primary || '#ffffff',
    }),
    [compactActionButtonStyle, theme]
  );

  const normalizedItems = useMemo(() => {
    const sourceItems = Array.isArray(items) ? items : [];

    return sourceItems.map((item, index) => {
      const stableIdentity = resolveStableIdentity(item);
      const rowKey = stableIdentity || `${resolveLabel(item?.displayName, 'Patient')}-${index + 1}`;

      const explicitNumber = (
        toPositiveInteger(item?.cardNumber)
        || resolveNumericSuffix(item?.humanFriendlyId)
      );

      if (explicitNumber) {
        return { ...item, __rowKey: rowKey, __cardNumber: explicitNumber };
      }

      return {
        ...item,
        __rowKey: rowKey,
        __cardNumber: hashToPositiveInteger(stableIdentity) || index + 1,
      };
    });
  }, [items]);

  const columns = useMemo(() => {
    const tableColumns = [
      {
        id: 'patient',
        label: patientLabel,
      },
      {
        id: 'patientId',
        label: patientIdLabel,
      },
      {
        id: 'tenant',
        label: tenantLabel,
      },
      {
        id: 'facility',
        label: facilityLabel,
      },
      {
        id: 'actions',
        label: actionsLabel,
      },
    ];

    if (!showNumbers) return tableColumns;
    return [
      {
        id: 'number',
        label: '#',
      },
      ...tableColumns,
    ];
  }, [actionsLabel, facilityLabel, patientIdLabel, patientLabel, showNumbers, tenantLabel]);

  const totalColumnFlex = useMemo(
    () => columns.reduce((sum, column) => sum + resolveCellFlex(column.id), 0),
    [columns]
  );

  const resolveDefaultWebWidth = useCallback((columnId) => {
    const safeTableWidth = tableWidth > 0 ? tableWidth : DEFAULT_WEB_TABLE_WIDTH;
    const widthShare = safeTableWidth * (resolveCellFlex(columnId) / Math.max(totalColumnFlex, 0.0001));
    return Math.max(1, Math.round(widthShare));
  }, [tableWidth, totalColumnFlex]);

  const resolvedColumnWidths = useMemo(() => {
    if (!IS_WEB) return {};

    const widthMap = {};
    columns.forEach((column) => {
      const explicitWidth = columnWidths[column.id];
      widthMap[column.id] = Number.isFinite(explicitWidth) && explicitWidth > 0
        ? explicitWidth
        : resolveDefaultWebWidth(column.id);
    });
    return widthMap;
  }, [columnWidths, columns, resolveDefaultWebWidth]);

  const resolveColumnStyle = useCallback((columnId) => {
    if (!IS_WEB) return undefined;
    const width = resolvedColumnWidths[columnId] || resolveDefaultWebWidth(columnId);
    return {
      width,
      flexGrow: 0,
      flexShrink: 0,
      flexBasis: width,
    };
  }, [resolvedColumnWidths, resolveDefaultWebWidth]);

  const actionColumnWidth = useMemo(() => {
    if (!IS_WEB) return null;
    const explicit = resolvedColumnWidths.actions;
    if (Number.isFinite(explicit) && explicit > 0) return explicit;
    return resolveDefaultWebWidth('actions');
  }, [resolvedColumnWidths.actions, resolveDefaultWebWidth]);

  const showActionLabels = !IS_WEB || actionColumnWidth >= ACTION_LABEL_COLLAPSE_WIDTH;

  const handleColumnResizeStart = useCallback((event, columnIndex) => {
    if (!IS_WEB || typeof window === 'undefined' || typeof document === 'undefined') return;
    const currentColumn = columns[columnIndex];
    const nextColumn = columns[columnIndex + 1];
    if (!currentColumn || !nextColumn) return;

    const pointerButton = Number(event?.button ?? event?.nativeEvent?.button ?? 0);
    if (pointerButton !== 0) return;
    event?.preventDefault?.();
    event?.stopPropagation?.();

    if (resizeCleanupRef.current) {
      resizeCleanupRef.current();
      resizeCleanupRef.current = null;
    }

    const currentColumnId = currentColumn.id;
    const nextColumnId = nextColumn.id;
    const currentMinWidth = 1;
    const nextMinWidth = 1;
    const startCurrentWidth = resolvedColumnWidths[currentColumnId] || resolveDefaultWebWidth(currentColumnId);
    const startNextWidth = resolvedColumnWidths[nextColumnId] || resolveDefaultWebWidth(nextColumnId);
    const totalWidth = startCurrentWidth + startNextWidth;
    const startX = Number(event?.clientX ?? event?.nativeEvent?.clientX ?? event?.nativeEvent?.pageX ?? 0);
    const maxCurrentWidth = Math.max(currentMinWidth, totalWidth - nextMinWidth);

    setActiveResizeColumnId(currentColumnId);

    const previousUserSelect = document.body.style.userSelect;
    const previousCursor = document.body.style.cursor;
    document.body.style.userSelect = 'none';
    document.body.style.cursor = 'col-resize';

    const handleMouseMove = (moveEvent) => {
      const currentX = Number(moveEvent?.clientX ?? moveEvent?.pageX ?? startX);
      const delta = currentX - startX;
      const nextCurrentWidth = clampValue(
        startCurrentWidth + delta,
        currentMinWidth,
        maxCurrentWidth
      );
      const nextWidth = Math.round(nextCurrentWidth);
      const adjacentWidth = Math.round(totalWidth - nextCurrentWidth);

      setColumnWidths((previous) => {
        const nextMap = {
          ...previous,
          [currentColumnId]: nextWidth,
          [nextColumnId]: adjacentWidth,
        };
        const isUnchanged = (
          previous[currentColumnId] === nextWidth
          && previous[nextColumnId] === adjacentWidth
        );
        return isUnchanged ? previous : nextMap;
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
    };

    resizeCleanupRef.current = cleanup;
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    window.addEventListener('blur', handleMouseUp);
    window.addEventListener('mouseleave', handleMouseUp);
  }, [columns, resolvedColumnWidths, resolveDefaultWebWidth]);

  useEffect(() => {
    if (!IS_WEB) return undefined;
    const node = tableRef.current;
    if (!node || typeof node.getBoundingClientRect !== 'function') return undefined;

    const updateTableWidth = () => {
      const measuredWidth = Math.round(node.getBoundingClientRect().width || 0);
      setTableWidth((current) => (current === measuredWidth ? current : measuredWidth));
    };

    updateTableWidth();

    if (typeof ResizeObserver === 'function') {
      const observer = new ResizeObserver(updateTableWidth);
      observer.observe(node);
      return () => observer.disconnect();
    }

    window.addEventListener('resize', updateTableWidth);
    return () => window.removeEventListener('resize', updateTableWidth);
  }, []);

  useEffect(() => {
    if (!IS_WEB) return;

    setColumnWidths((previous) => {
      const nextMap = {};
      columns.forEach((column) => {
        const previousWidth = previous[column.id];
        nextMap[column.id] = Number.isFinite(previousWidth) && previousWidth > 0
          ? previousWidth
          : resolveDefaultWebWidth(column.id);
      });

      const prevKeys = Object.keys(previous);
      const nextKeys = Object.keys(nextMap);
      const keysMatch = prevKeys.length === nextKeys.length
        && nextKeys.every((key) => previous[key] === nextMap[key]);
      return keysMatch ? previous : nextMap;
    });
  }, [columns, resolveDefaultWebWidth]);

  useEffect(() => () => {
    if (resizeCleanupRef.current) {
      resizeCleanupRef.current();
      resizeCleanupRef.current = null;
    }
  }, []);

  useEffect(() => {
    if (!hoveredRowKey) return;
    const hasHoveredRow = normalizedItems.some((item) => item.__rowKey === hoveredRowKey);
    if (!hasHoveredRow) setHoveredRowKey(null);
  }, [hoveredRowKey, normalizedItems]);

  return (
    <StyledTable ref={tableRef}>
      <StyledHeaderRow>
        {columns.map((column, columnIndex) => {
          const isLastColumn = columnIndex === columns.length - 1;
          const canResizeColumn = IS_WEB && !isLastColumn;
          return (
            <StyledCell
              key={column.id}
              $columnId={column.id}
              $isLastColumn={isLastColumn}
              style={resolveColumnStyle(column.id)}
            >
              <StyledHeaderCellContent $isResizable={canResizeColumn}>
                <StyledHeaderCellText variant="caption" numberOfLines={1} ellipsizeMode="tail">
                  {column.label}
                </StyledHeaderCellText>
                {canResizeColumn ? (
                  <StyledResizeHandle
                    accessibilityRole="button"
                    accessibilityLabel={`Resize ${column.label}`}
                    onMouseDown={(event) => handleColumnResizeStart(event, columnIndex)}
                    onPress={(pressEvent) => pressEvent?.stopPropagation?.()}
                    testID={`patient-table-resize-${column.id}`}
                  >
                    <StyledResizeRail $active={activeResizeColumnId === column.id} />
                  </StyledResizeHandle>
                ) : null}
              </StyledHeaderCellContent>
            </StyledCell>
          );
        })}
      </StyledHeaderRow>

      {normalizedItems.map((item, index) => {
        const patientId = sanitizeString(item?.id);
        const openAccessibilityLabel = typeof resolveOpenAccessibilityLabel === 'function'
          ? resolveOpenAccessibilityLabel(item, index)
          : openButtonLabel;
        const editAccessibilityLabel = typeof resolveEditAccessibilityLabel === 'function'
          ? resolveEditAccessibilityLabel(item, index)
          : editButtonLabel;
        const deleteAccessibilityLabel = typeof resolveDeleteAccessibilityLabel === 'function'
          ? resolveDeleteAccessibilityLabel(item, index)
          : deleteButtonLabel;
        const canOpenPatient = Boolean(patientId) && typeof onOpenPatient === 'function';
        const canEditPatient = Boolean(patientId) && typeof onEditPatient === 'function';
        const canDeletePatient = Boolean(patientId) && typeof onDeletePatient === 'function';
        const isLastRow = index === normalizedItems.length - 1;
        const isHovered = hoveredRowKey === item.__rowKey;

        return (
          <StyledDataRow
            key={item.__rowKey}
            $isLastRow={isLastRow}
            $rowIndex={index}
            $isHovered={isHovered}
            onMouseEnter={IS_WEB ? () => setHoveredRowKey(item.__rowKey) : undefined}
            onMouseLeave={IS_WEB ? () => setHoveredRowKey((current) => (current === item.__rowKey ? null : current)) : undefined}
            testID={testIdPrefix ? `${testIdPrefix}row-${toTestIdSegment(item.__rowKey)}` : undefined}
          >
            {columns.map((column, columnIndex) => {
              const isLastColumn = columnIndex === columns.length - 1;
              const numberBadgeTestId = (
                column.id === 'number'
                ? `${testIdPrefix || ''}number-${toTestIdSegment(item.__rowKey)}`
                : undefined
              );

              if (column.id === 'number') {
                return (
                  <StyledCell
                    key={`${item.__rowKey}-${column.id}`}
                    $columnId={column.id}
                    $isLastColumn={isLastColumn}
                    style={resolveColumnStyle(column.id)}
                  >
                    <StyledRowNumberBadge testID={numberBadgeTestId}>
                      <Text variant="caption">{item.__cardNumber}</Text>
                    </StyledRowNumberBadge>
                  </StyledCell>
                );
              }

              if (column.id === 'actions') {
                const detailsButtonStyle = showActionLabels
                  ? compactActionButtonStyle
                  : compactIconActionButtonStyle;
                const editActionStyle = showActionLabels
                  ? editButtonStyleWithLabel
                  : editButtonStyle;
                const deleteActionStyle = showActionLabels
                  ? deleteButtonStyleWithLabel
                  : deleteButtonStyle;
                return (
                  <StyledCell
                    key={`${item.__rowKey}-${column.id}`}
                    $columnId={column.id}
                    $isLastColumn={isLastColumn}
                    style={resolveColumnStyle(column.id)}
                  >
                    <StyledActionButtonsRow>
                      <StyledActionButtonSlot $isFirst>
                        <Button
                          variant="surface"
                          size="small"
                          onPress={() => onOpenPatient?.(patientId)}
                          disabled={!canOpenPatient}
                          accessibilityLabel={openAccessibilityLabel}
                          icon={<Icon glyph={'\u2139'} size="xs" tone="primary" decorative />}
                          style={detailsButtonStyle}
                          testID={testIdPrefix ? `${testIdPrefix}${index + 1}` : undefined}
                        >
                          {showActionLabels ? openButtonLabel : null}
                        </Button>
                      </StyledActionButtonSlot>
                      <StyledActionButtonSlot>
                        <Button
                          variant="surface"
                          size="small"
                          onPress={() => onEditPatient?.(patientId)}
                          disabled={!canEditPatient}
                          accessibilityLabel={editAccessibilityLabel}
                          icon={<Icon glyph={'\u270e'} size="xs" tone="primary" decorative />}
                          style={editActionStyle}
                          testID={testIdPrefix ? `${testIdPrefix}edit-${index + 1}` : undefined}
                        >
                          {showActionLabels ? editButtonLabel : null}
                        </Button>
                      </StyledActionButtonSlot>
                      <StyledActionButtonSlot>
                        <Button
                          variant="surface"
                          size="small"
                          onPress={() => onDeletePatient?.(patientId)}
                          disabled={!canDeletePatient}
                          accessibilityLabel={deleteAccessibilityLabel}
                          icon={<Icon glyph={'\u2715'} size="xs" tone="error" decorative />}
                          style={deleteActionStyle}
                          testID={testIdPrefix ? `${testIdPrefix}delete-${index + 1}` : undefined}
                        >
                          {showActionLabels ? deleteButtonLabel : null}
                        </Button>
                      </StyledActionButtonSlot>
                    </StyledActionButtonsRow>
                  </StyledCell>
                );
              }

              let value = '-';
              let variant = 'caption';
              if (column.id === 'patient') {
                value = resolveLabel(item?.displayName, `Patient ${index + 1}`);
                variant = 'label';
              } else if (column.id === 'patientId') {
                value = resolveLabel(item?.humanFriendlyId);
              } else if (column.id === 'tenant') {
                value = resolveLabel(item?.tenantLabel);
              } else if (column.id === 'facility') {
                value = resolveLabel(item?.facilityLabel);
              }

              return (
                <StyledCell
                  key={`${item.__rowKey}-${column.id}`}
                  $columnId={column.id}
                  $isLastColumn={isLastColumn}
                  style={resolveColumnStyle(column.id)}
                >
                  <StyledCellText variant={variant} numberOfLines={1} ellipsizeMode="tail">
                    {value}
                  </StyledCellText>
                </StyledCell>
              );
            })}
          </StyledDataRow>
        );
      })}
    </StyledTable>
  );
};

export default PatientListCards;
