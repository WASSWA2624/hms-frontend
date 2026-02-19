/**
 * DataTable Android Styles
 * File: DataTable.android.styles.jsx
 */
import styled from 'styled-components/native';

const StyledContainer = styled.View.withConfig({
  displayName: 'StyledContainer',
  componentId: 'DataTableContainer',
})`
  width: 100%;
`;

const StyledHeaderRow = styled.View.withConfig({
  displayName: 'StyledHeaderRow',
  componentId: 'DataTableHeaderRow',
})`
  flex-direction: row;
  align-items: center;
  padding: ${({ theme }) => theme.spacing.xs}px ${({ theme }) => theme.spacing.sm}px;
  border-bottom-width: 1px;
  border-bottom-color: ${({ theme }) => theme.colors.border.light};
  background-color: ${({ theme }) => theme.colors.background.secondary};
`;

const StyledHeaderText = styled.Text.withConfig({
  displayName: 'StyledHeaderText',
  componentId: 'DataTableHeaderText',
})`
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: ${({ theme }) => theme.typography.fontSize.xs}px;
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  text-align: ${({ $align }) => $align || 'left'};
`;

const StyledRow = styled.View.withConfig({
  displayName: 'StyledRow',
  componentId: 'DataTableRow',
})`
  flex-direction: row;
  align-items: center;
  padding: ${({ theme, $density }) => ($density === 'comfortable' ? theme.spacing.sm : theme.spacing.xs)}px
    ${({ theme }) => theme.spacing.sm}px;
  border-bottom-width: 1px;
  border-bottom-color: ${({ theme }) => theme.colors.border.light};
  background-color: ${({ theme, $stripeIndex }) => (
    Number.isInteger($stripeIndex) && $stripeIndex % 2 === 0
      ? theme.colors.background.primary
      : theme.colors.background.secondary
  )};
`;

const StyledCell = styled.View.withConfig({
  displayName: 'StyledCell',
  componentId: 'DataTableCell',
})`
  flex: ${({ $flex }) => $flex || 1};
  min-width: 0;
  padding-right: ${({ theme }) => theme.spacing.xs}px;
`;

const StyledCellText = styled.Text.withConfig({
  displayName: 'StyledCellText',
  componentId: 'DataTableCellText',
})`
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: ${({ theme }) => theme.typography.fontSize.xs}px;
  text-align: ${({ $align }) => $align || 'left'};
`;

const StyledEmptyText = styled.Text.withConfig({
  displayName: 'StyledEmptyText',
  componentId: 'DataTableEmptyText',
})`
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: ${({ theme }) => theme.typography.fontSize.xs}px;
  text-align: center;
  padding: ${({ theme }) => theme.spacing.sm}px;
`;

export {
  StyledContainer,
  StyledHeaderRow,
  StyledHeaderText,
  StyledRow,
  StyledCell,
  StyledCellText,
  StyledEmptyText,
};

