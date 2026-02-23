import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Button, Icon, Text } from '@platform/components';
import { Platform, useWindowDimensions } from 'react-native';
import {
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
} from './PatientListCards.styles';

const sanitizeString = (value) => String(value || '').trim();
const IS_WEB = Platform.OS === 'web';
const DEFAULT_WEB_TABLE_WIDTH = 980;
const ACTION_LABEL_COLLAPSE_WIDTH = 255;
const SMALL_SCREEN_MAX_WIDTH = 767;
const TABLET_MAX_WIDTH = 1023;

const clampValue = (value, min, max) => {
  const boundedMin = Number.isFinite(min) ? min : -Infinity;
  const boundedMax = Number.isFinite(max) ? max : Infinity;
  return Math.min(boundedMax, Math.max(boundedMin, value));
};

const resolveCellFlex = (columnId) => {
  if (columnId === 'patient') return 1.4;
  if (columnId === 'actions') return 1.45;
  if (columnId === 'number') return 0.45;
  return 1;
};

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

const resolveStableIdentity = (item) => (
  sanitizeString(item?.id)
  || sanitizeString(item?.listKey)
  || sanitizeString(item?.humanFriendlyId)
  || sanitizeString(item?.displayName)
);

const toTestIdSegment = (value) => (
  sanitizeString(value).replace(/[^a-z0-9_-]+/gi, '-')
);

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
  patientLabel = '',
  patientIdLabel = '',
  tenantLabel = '',
  facilityLabel = '',
  openButtonLabel = '',
  editButtonLabel = '',
  deleteButtonLabel = '',
  actionsLabel = '',
  numberLabel = '#',
  emptyValueLabel = '-',
  resolveOpenAccessibilityLabel,
  resolveEditAccessibilityLabel,
  resolveDeleteAccessibilityLabel,
  resolveResizeAccessibilityLabel,
  resolveUnnamedPatientLabel,
  testIdPrefix,
  showNumbers = true,
}) => {
  const { width: viewportWidth } = useWindowDimensions();
  const tableRef = useRef(null);
  const resizeCleanupRef = useRef(null);
  const [tableWidth, setTableWidth] = useState(0);
  const [columnWidths, setColumnWidths] = useState({});
  const [activeResizeColumnId, setActiveResizeColumnId] = useState(null);
  const [hoveredRowKey, setHoveredRowKey] = useState(null);
  const safeViewportWidth = Number.isFinite(viewportWidth) ? viewportWidth : 0;
  const isSmallScreen = safeViewportWidth > 0 && safeViewportWidth <= SMALL_SCREEN_MAX_WIDTH;
  const isTabletScreen = safeViewportWidth > SMALL_SCREEN_MAX_WIDTH && safeViewportWidth <= TABLET_MAX_WIDTH;
  const useResponsiveCards = !IS_WEB || isSmallScreen || isTabletScreen;

  const normalizedItems = useMemo(() => {
    const sourceItems = Array.isArray(items) ? items : [];

    return sourceItems.map((item, index) => {
      const stableIdentity = resolveStableIdentity(item);
      const rowKey = stableIdentity || `${resolveLabel(item?.displayName, 'row')}-${index + 1}`;

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
        label: numberLabel,
      },
      ...tableColumns,
    ];
  }, [actionsLabel, facilityLabel, numberLabel, patientIdLabel, patientLabel, showNumbers, tenantLabel]);

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

  const resolveColumnWidth = useCallback((columnId) => {
    if (!IS_WEB) return null;
    const width = resolvedColumnWidths[columnId] || resolveDefaultWebWidth(columnId);
    return width;
  }, [resolvedColumnWidths, resolveDefaultWebWidth]);

  const actionColumnWidth = useMemo(() => {
    if (!IS_WEB) return null;
    const explicit = resolvedColumnWidths.actions;
    if (Number.isFinite(explicit) && explicit > 0) return explicit;
    return resolveDefaultWebWidth('actions');
  }, [resolvedColumnWidths.actions, resolveDefaultWebWidth]);

  const showActionLabels = !isSmallScreen && (!IS_WEB || actionColumnWidth >= ACTION_LABEL_COLLAPSE_WIDTH);

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

  const renderActionButtons = useCallback(({
    patientId,
    index,
    canOpenPatient,
    canEditPatient,
    canDeletePatient,
    openAccessibilityLabel,
    editAccessibilityLabel,
    deleteAccessibilityLabel,
  }) => (
    <StyledActionButtonsRow>
      <StyledActionButtonSlot $isFirst>
        <Button
          variant="surface"
          size="medium"
          onPress={() => onOpenPatient?.(patientId)}
          disabled={!canOpenPatient}
          accessibilityLabel={openAccessibilityLabel}
          icon={<Icon glyph={'\u2139'} size="xs" tone="primary" decorative />}
          testID={testIdPrefix ? `${testIdPrefix}${index + 1}` : undefined}
        >
          {showActionLabels ? openButtonLabel : null}
        </Button>
      </StyledActionButtonSlot>
      <StyledActionButtonSlot>
        <Button
          variant="surface"
          size="medium"
          onPress={() => onEditPatient?.(patientId)}
          disabled={!canEditPatient}
          accessibilityLabel={editAccessibilityLabel}
          icon={<Icon glyph={'\u270e'} size="xs" tone="primary" decorative />}
          testID={testIdPrefix ? `${testIdPrefix}edit-${index + 1}` : undefined}
        >
          {showActionLabels ? editButtonLabel : null}
        </Button>
      </StyledActionButtonSlot>
      <StyledActionButtonSlot>
        <Button
          variant="surface"
          size="medium"
          onPress={() => onDeletePatient?.(patientId)}
          disabled={!canDeletePatient}
          accessibilityLabel={deleteAccessibilityLabel}
          icon={<Icon glyph={'\u2715'} size="xs" tone="error" decorative />}
          testID={testIdPrefix ? `${testIdPrefix}delete-${index + 1}` : undefined}
        >
          {showActionLabels ? deleteButtonLabel : null}
        </Button>
      </StyledActionButtonSlot>
    </StyledActionButtonsRow>
  ), [
    onDeletePatient,
    onEditPatient,
    onOpenPatient,
    deleteButtonLabel,
    editButtonLabel,
    openButtonLabel,
    showActionLabels,
    testIdPrefix,
  ]);

  if (useResponsiveCards) {
    return (
      <StyledCardsGrid $isTablet={isTabletScreen}>
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
          const unnamedPatientLabel = typeof resolveUnnamedPatientLabel === 'function'
            ? resolveUnnamedPatientLabel(index)
            : resolveLabel(patientLabel, emptyValueLabel);
          const patientName = resolveLabel(item?.displayName, unnamedPatientLabel);
          const fieldRows = [
            {
              key: 'patientId',
              label: patientIdLabel,
              value: resolveLabel(item?.humanFriendlyId, emptyValueLabel),
            },
            {
              key: 'tenant',
              label: tenantLabel,
              value: resolveLabel(item?.tenantLabel, emptyValueLabel),
            },
            {
              key: 'facility',
              label: facilityLabel,
              value: resolveLabel(item?.facilityLabel, emptyValueLabel),
            },
          ].filter((field) => sanitizeString(field.label));

          return (
            <StyledPatientCard
              key={item.__rowKey}
              $isTablet={isTabletScreen}
              testID={testIdPrefix ? `${testIdPrefix}row-${toTestIdSegment(item.__rowKey)}` : undefined}
            >
              <StyledPatientCardHeader>
                <StyledPatientCardTitle variant="label" numberOfLines={1} ellipsizeMode="tail">
                  {patientName}
                </StyledPatientCardTitle>
                {showNumbers ? (
                  <StyledRowNumberBadge testID={testIdPrefix ? `${testIdPrefix}number-${toTestIdSegment(item.__rowKey)}` : undefined}>
                    <Text variant="caption">{item.__cardNumber}</Text>
                  </StyledRowNumberBadge>
                ) : null}
              </StyledPatientCardHeader>

              {fieldRows.length > 0 ? (
                <StyledPatientCardFields>
                  {fieldRows.map((field) => (
                    <StyledPatientCardFieldRow key={field.key}>
                      <StyledPatientCardFieldLabel variant="caption">
                        {field.label}
                      </StyledPatientCardFieldLabel>
                      <StyledPatientCardFieldValue variant="caption" numberOfLines={1} ellipsizeMode="tail">
                        {field.value}
                      </StyledPatientCardFieldValue>
                    </StyledPatientCardFieldRow>
                  ))}
                </StyledPatientCardFields>
              ) : null}

              {renderActionButtons({
                patientId,
                index,
                canOpenPatient,
                canEditPatient,
                canDeletePatient,
                openAccessibilityLabel,
                editAccessibilityLabel,
                deleteAccessibilityLabel,
              })}
            </StyledPatientCard>
          );
        })}
      </StyledCardsGrid>
    );
  }

  return (
    <StyledTable ref={tableRef}>
      <StyledHeaderRow>
        {columns.map((column, columnIndex) => {
          const isLastColumn = columnIndex === columns.length - 1;
          const canResizeColumn = IS_WEB && !isLastColumn;
          const resizeAccessibilityLabel = typeof resolveResizeAccessibilityLabel === 'function'
            ? resolveResizeAccessibilityLabel(column, columnIndex)
            : column.label;

          return (
            <StyledCell
              key={column.id}
              $columnId={column.id}
              $isLastColumn={isLastColumn}
              $isWeb={IS_WEB}
              $columnWidth={resolveColumnWidth(column.id)}
            >
              <StyledHeaderCellContent $isResizable={canResizeColumn}>
                <StyledHeaderCellText variant="caption" numberOfLines={1} ellipsizeMode="tail">
                  {column.label}
                </StyledHeaderCellText>
                {canResizeColumn ? (
                  <StyledResizeHandle
                    accessibilityRole="button"
                    accessibilityLabel={resizeAccessibilityLabel}
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
        const unnamedPatientLabel = typeof resolveUnnamedPatientLabel === 'function'
          ? resolveUnnamedPatientLabel(index)
          : resolveLabel(patientLabel, emptyValueLabel);

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
                    $isWeb={IS_WEB}
                    $columnWidth={resolveColumnWidth(column.id)}
                  >
                    <StyledRowNumberBadge testID={numberBadgeTestId}>
                      <Text variant="caption">{item.__cardNumber}</Text>
                    </StyledRowNumberBadge>
                  </StyledCell>
                );
              }

              if (column.id === 'actions') {
                return (
                  <StyledCell
                    key={`${item.__rowKey}-${column.id}`}
                    $columnId={column.id}
                    $isLastColumn={isLastColumn}
                    $isWeb={IS_WEB}
                    $columnWidth={resolveColumnWidth(column.id)}
                  >
                    {renderActionButtons({
                      patientId,
                      index,
                      canOpenPatient,
                      canEditPatient,
                      canDeletePatient,
                      openAccessibilityLabel,
                      editAccessibilityLabel,
                      deleteAccessibilityLabel,
                    })}
                  </StyledCell>
                );
              }

              let value = emptyValueLabel;
              let variant = 'caption';
              if (column.id === 'patient') {
                value = resolveLabel(item?.displayName, unnamedPatientLabel);
                variant = 'label';
              } else if (column.id === 'patientId') {
                value = resolveLabel(item?.humanFriendlyId, emptyValueLabel);
              } else if (column.id === 'tenant') {
                value = resolveLabel(item?.tenantLabel, emptyValueLabel);
              } else if (column.id === 'facility') {
                value = resolveLabel(item?.facilityLabel, emptyValueLabel);
              }

              return (
                <StyledCell
                  key={`${item.__rowKey}-${column.id}`}
                  $columnId={column.id}
                  $isLastColumn={isLastColumn}
                  $isWeb={IS_WEB}
                  $columnWidth={resolveColumnWidth(column.id)}
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
