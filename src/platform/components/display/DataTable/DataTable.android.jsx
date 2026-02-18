/**
 * DataTable Component - Android
 * Lightweight native fallback for API parity.
 * File: DataTable.android.jsx
 */
import React, { useCallback } from 'react';
import { FlatList, Pressable } from 'react-native';

import { useI18n } from '@hooks';
import Checkbox from '../../forms/Checkbox';
import {
  StyledContainer,
  StyledHeaderRow,
  StyledHeaderText,
  StyledRow,
  StyledCell,
  StyledCellText,
  StyledEmptyText,
} from './DataTable.android.styles';

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

const DataTableAndroid = ({
  columns = [],
  rows = [],
  getRowKey,
  rowDensity = 'compact',
  selection,
  renderRowActions,
  onRowPress,
  emptyMessage,
  testID,
}) => {
  const { t } = useI18n();
  const normalizedRows = Array.isArray(rows) ? rows : [];
  const normalizedColumns = Array.isArray(columns) ? columns.filter((column) => column?.id) : [];

  const resolveRowKey = useCallback((row, rowIndex) => {
    if (typeof getRowKey === 'function') {
      const resolved = getRowKey(row, rowIndex);
      if (resolved != null && resolved !== '') return String(resolved);
    }
    const fallback = row?.id ?? row?.key ?? row?.slug;
    if (fallback != null && fallback !== '') return String(fallback);
    return `row-${rowIndex}`;
  }, [getRowKey]);

  if (normalizedRows.length === 0) {
    return (
      <StyledContainer testID={testID}>
        <StyledEmptyText>{emptyMessage || t('listScaffold.emptyState.title')}</StyledEmptyText>
      </StyledContainer>
    );
  }

  return (
    <StyledContainer testID={testID}>
      <StyledHeaderRow>
        {selection?.enabled ? (
          <StyledCell $flex={0.35}>
            <Checkbox
              checked={Boolean(selection?.allSelected)}
              onChange={(checked) => selection?.onToggleAll?.(Boolean(checked))}
              accessibilityLabel={selection?.selectAllLabel || 'Select all rows'}
            />
          </StyledCell>
        ) : null}

        {normalizedColumns.map((column) => (
          <StyledCell key={column.id}>
            <StyledHeaderText>{column.label || column.id}</StyledHeaderText>
          </StyledCell>
        ))}

        {typeof renderRowActions === 'function' ? (
          <StyledCell>
            <StyledHeaderText>{t('common.actions')}</StyledHeaderText>
          </StyledCell>
        ) : null}
      </StyledHeaderRow>

      <FlatList
        data={normalizedRows}
        keyExtractor={resolveRowKey}
        renderItem={({ item, index }) => {
          const rowKey = resolveRowKey(item, index);
          const onPress = typeof onRowPress === 'function'
            ? () => onRowPress(item, index)
            : undefined;

          return (
            <Pressable onPress={onPress}>
              <StyledRow $density={rowDensity} $stripeIndex={index}>
                {selection?.enabled ? (
                  <StyledCell $flex={0.35}>
                    <Checkbox
                      checked={Boolean(selection?.isRowSelected?.(item, index))}
                      onChange={(checked) => selection?.onToggleRow?.(item, Boolean(checked), index)}
                      accessibilityLabel={selection?.selectRowLabel?.(item, index)}
                    />
                  </StyledCell>
                ) : null}

                {normalizedColumns.map((column) => {
                  const value = resolveCellValue(item, index, column);
                  const isPrimitive = ['string', 'number', 'boolean'].includes(typeof value) || value == null;

                  return (
                    <StyledCell key={`${rowKey}-${column.id}`}>
                      {isPrimitive ? (
                        <StyledCellText numberOfLines={1}>
                          {value == null ? '' : String(value)}
                        </StyledCellText>
                      ) : value}
                    </StyledCell>
                  );
                })}

                {typeof renderRowActions === 'function' ? (
                  <StyledCell>
                    {renderRowActions(item, index)}
                  </StyledCell>
                ) : null}
              </StyledRow>
            </Pressable>
          );
        }}
      />
    </StyledContainer>
  );
};

export default DataTableAndroid;

