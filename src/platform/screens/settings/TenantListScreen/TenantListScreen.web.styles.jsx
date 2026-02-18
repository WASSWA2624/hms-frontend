/**
 * TenantListScreen Web Styles
 * File: TenantListScreen.web.styles.jsx
 */
import styled from 'styled-components';

const getTablet = (theme) => theme.breakpoints?.tablet ?? 768;

const StyledContainer = styled.main.withConfig({
  displayName: 'StyledContainer',
  componentId: 'StyledContainer',
})`
  display: flex;
  flex-direction: column;
  width: 100%;
  min-height: 100%;
  background-color: ${({ theme }) => theme.colors.background.primary};
  padding: 0;
  box-sizing: border-box;
`;

const StyledContent = styled.div.withConfig({
  displayName: 'StyledContent',
  componentId: 'StyledContent',
})`
  flex: 1;
  width: 100%;
  max-width: 100%;
  margin-left: auto;
  margin-right: auto;
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md}px;
`;

const StyledToolbar = styled.div.withConfig({
  displayName: 'StyledToolbar',
  componentId: 'StyledToolbar',
})`
  display: flex;
  flex-direction: column;
  align-items: stretch;
  gap: ${({ theme }) => theme.spacing.sm}px;

  @media (min-width: ${({ theme }) => getTablet(theme)}px) {
    display: grid;
    grid-template-columns: minmax(300px, 1fr) minmax(180px, 220px) auto;
    align-items: end;
  }
`;

const StyledSearchSlot = styled.div.withConfig({
  displayName: 'StyledSearchSlot',
  componentId: 'StyledSearchSlot',
})`
  width: 100%;
`;

const StyledScopeSlot = styled.div.withConfig({
  displayName: 'StyledScopeSlot',
  componentId: 'StyledScopeSlot',
})`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs}px;
  width: 100%;
`;

const StyledControlLabel = styled.span.withConfig({
  displayName: 'StyledControlLabel',
  componentId: 'StyledControlLabel',
})`
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: ${({ theme }) => theme.typography.fontSize.xs}px;
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  line-height: 1.2;
`;

const StyledToolbarActions = styled.div.withConfig({
  displayName: 'StyledToolbarActions',
  componentId: 'StyledToolbarActions',
})`
  display: flex;
  align-items: flex-end;
  justify-content: flex-end;
  gap: ${({ theme }) => theme.spacing.sm}px;
  flex-wrap: wrap;
`;

const StyledTableSettingsButton = styled.button.withConfig({
  displayName: 'StyledTableSettingsButton',
  componentId: 'StyledTableSettingsButton',
})`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: ${({ theme }) => theme.spacing.xs}px ${({ theme }) => theme.spacing.sm}px;
  min-height: 36px;
  border-radius: ${({ theme }) => theme.radius.sm}px;
  border: 1px solid ${({ theme }) => theme.colors.border.light};
  background-color: ${({ theme }) => theme.colors.background.secondary};
  color: ${({ theme }) => theme.colors.text.primary};
  cursor: pointer;

  &:hover {
    background-color: ${({ theme }) => theme.colors.background.tertiary};
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.primary};
    outline-offset: 2px;
  }
`;

const StyledAddButton = styled.button.withConfig({
  displayName: 'StyledAddButton',
  componentId: 'StyledAddButton',
})`
  display: inline-flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs}px;
  padding: ${({ theme }) => theme.spacing.xs}px ${({ theme }) => theme.spacing.sm}px;
  min-height: 36px;
  border-radius: ${({ theme }) => theme.radius.sm}px;
  border: 1px solid ${({ theme }) => theme.colors.background.tertiary};
  background-color: ${({ theme }) => theme.colors.background.secondary};
  color: ${({ theme }) => theme.colors.text.primary};
  cursor: pointer;

  &:hover {
    background-color: ${({ theme }) => theme.colors.background.tertiary};
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.primary};
    outline-offset: 2px;
  }
`;

const StyledAddLabel = styled.span.withConfig({
  displayName: 'StyledAddLabel',
  componentId: 'StyledAddLabel',
})`
  font-family: ${({ theme }) => theme.typography.fontFamily.regular};
  font-size: ${({ theme }) => theme.typography.fontSize.xs}px;
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  line-height: ${({ theme }) => theme.typography.fontSize.xs * theme.typography.lineHeight.normal}px;
  color: ${({ theme }) => theme.colors.text.primary};
`;

const StyledFilterPanel = styled.div.withConfig({
  displayName: 'StyledFilterPanel',
  componentId: 'StyledFilterPanel',
})`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm}px;
  padding: ${({ theme }) => theme.spacing.sm}px;
  border-radius: ${({ theme }) => theme.radius.sm}px;
  border: 1px solid ${({ theme }) => theme.colors.border.light};
  background-color: ${({ theme }) => theme.colors.background.secondary};
`;

const StyledFilterRow = styled.div.withConfig({
  displayName: 'StyledFilterRow',
  componentId: 'StyledFilterRow',
})`
  display: grid;
  grid-template-columns: 1fr;
  gap: ${({ theme }) => theme.spacing.xs}px;

  @media (min-width: ${({ theme }) => getTablet(theme)}px) {
    grid-template-columns: minmax(120px, 1fr) minmax(110px, 150px) minmax(180px, 2fr) auto;
    align-items: end;
  }
`;

const StyledFilterActions = styled.div.withConfig({
  displayName: 'StyledFilterActions',
  componentId: 'StyledFilterActions',
})`
  display: flex;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing.xs}px;
`;

const StyledFilterRowActions = styled.div.withConfig({
  displayName: 'StyledFilterRowActions',
  componentId: 'StyledFilterRowActions',
})`
  display: flex;
  justify-content: flex-end;
  align-items: flex-end;
`;

const StyledFilterButton = styled.button.withConfig({
  displayName: 'StyledFilterButton',
  componentId: 'StyledFilterButton',
})`
  min-height: 36px;
  border-radius: ${({ theme }) => theme.radius.sm}px;
  border: 1px solid ${({ theme }) => theme.colors.border.light};
  background-color: ${({ theme }) => theme.colors.background.primary};
  color: ${({ theme }) => theme.colors.text.primary};
  padding: 0 ${({ theme }) => theme.spacing.sm}px;
  cursor: pointer;

  &:disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }
`;

const StyledListBody = styled.div.withConfig({
  displayName: 'StyledListBody',
  componentId: 'StyledListBody',
})`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md}px;
  width: 100%;
`;

const StyledStateStack = styled.div.withConfig({
  displayName: 'StyledStateStack',
  componentId: 'StyledStateStack',
})`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm}px;
`;

const StyledBulkBar = styled.div.withConfig({
  displayName: 'StyledBulkBar',
  componentId: 'StyledBulkBar',
})`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing.sm}px;
  padding: ${({ theme }) => theme.spacing.sm}px;
  border-radius: ${({ theme }) => theme.radius.sm}px;
  border: 1px solid ${({ theme }) => theme.colors.border.light};
  background-color: ${({ theme }) => theme.colors.background.secondary};
`;

const StyledBulkInfo = styled.span.withConfig({
  displayName: 'StyledBulkInfo',
  componentId: 'StyledBulkInfo',
})`
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: ${({ theme }) => theme.typography.fontSize.xs}px;
`;

const StyledBulkActions = styled.div.withConfig({
  displayName: 'StyledBulkActions',
  componentId: 'StyledBulkActions',
})`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs}px;
`;

const StyledStatusBadge = styled.span.withConfig({
  displayName: 'StyledStatusBadge',
  componentId: 'StyledStatusBadge',
})`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 88px;
  border-radius: 999px;
  padding: 3px ${({ theme }) => theme.spacing.sm}px;
  font-size: ${({ theme }) => theme.typography.fontSize.xs}px;
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  white-space: nowrap;
  background-color: ${({ theme, $tone }) => ($tone === 'success' ? `${theme.colors.success}22` : `${theme.colors.warning}22`)};
  color: ${({ theme, $tone }) => ($tone === 'success' ? theme.colors.success : theme.colors.warning)};
`;

const StyledRowActions = styled.div.withConfig({
  displayName: 'StyledRowActions',
  componentId: 'StyledRowActions',
})`
  display: inline-flex;
  width: 100%;
  justify-content: flex-end;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs}px;
  flex-wrap: nowrap;
  white-space: nowrap;
`;

const StyledActionButton = styled.button.withConfig({
  displayName: 'StyledActionButton',
  componentId: 'StyledActionButton',
})`
  min-height: 30px;
  padding: 0 ${({ theme }) => theme.spacing.sm}px;
  border-radius: ${({ theme }) => theme.radius.sm}px;
  border: 1px solid ${({ theme }) => theme.colors.border.light};
  background-color: ${({ theme }) => theme.colors.background.primary};
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: ${({ theme }) => theme.typography.fontSize.xs}px;
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  white-space: nowrap;
  cursor: pointer;

  &:hover {
    background-color: ${({ theme }) => theme.colors.background.secondary};
  }
`;

const StyledDangerActionButton = styled(StyledActionButton).withConfig({
  displayName: 'StyledDangerActionButton',
  componentId: 'StyledDangerActionButton',
})`
  border-color: ${({ theme }) => `${theme.colors.error}66`};
  color: ${({ theme }) => theme.colors.error};

  &:hover {
    background-color: ${({ theme }) => `${theme.colors.error}12`};
  }
`;

const StyledPrimaryCellText = styled.span.withConfig({
  displayName: 'StyledPrimaryCellText',
  componentId: 'StyledPrimaryCellText',
})`
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  color: ${({ theme }) => theme.colors.text.primary};
`;

const StyledCodeCellText = styled.span.withConfig({
  displayName: 'StyledCodeCellText',
  componentId: 'StyledCodeCellText',
})`
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace;
  color: ${({ theme }) => theme.colors.text.secondary};
`;

const StyledPagination = styled.div.withConfig({
  displayName: 'StyledPagination',
  componentId: 'StyledPagination',
})`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing.sm}px;
  border-top: 1px solid ${({ theme }) => theme.colors.border.light};
  padding-top: ${({ theme }) => theme.spacing.sm}px;
`;

const StyledPaginationInfo = styled.span.withConfig({
  displayName: 'StyledPaginationInfo',
  componentId: 'StyledPaginationInfo',
})`
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: ${({ theme }) => theme.typography.fontSize.xs}px;
`;

const StyledPaginationActions = styled.div.withConfig({
  displayName: 'StyledPaginationActions',
  componentId: 'StyledPaginationActions',
})`
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing.xs}px;
`;

const StyledPaginationControl = styled.div.withConfig({
  displayName: 'StyledPaginationControl',
  componentId: 'StyledPaginationControl',
})`
  display: inline-flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs}px;
`;

const StyledPaginationControlLabel = styled.span.withConfig({
  displayName: 'StyledPaginationControlLabel',
  componentId: 'StyledPaginationControlLabel',
})`
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: ${({ theme }) => theme.typography.fontSize.xs}px;
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
`;

const StyledPaginationSelectSlot = styled.div.withConfig({
  displayName: 'StyledPaginationSelectSlot',
  componentId: 'StyledPaginationSelectSlot',
})`
  min-width: 86px;
`;

const StyledMobileList = styled.ul.withConfig({
  displayName: 'StyledMobileList',
  componentId: 'StyledMobileList',
})`
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 0;
`;

const StyledSettingsBody = styled.div.withConfig({
  displayName: 'StyledSettingsBody',
  componentId: 'StyledSettingsBody',
})`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm}px;
`;

const StyledSettingsSection = styled.section.withConfig({
  displayName: 'StyledSettingsSection',
  componentId: 'StyledSettingsSection',
})`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs}px;
`;

const StyledSettingsTitle = styled.h3.withConfig({
  displayName: 'StyledSettingsTitle',
  componentId: 'StyledSettingsTitle',
})`
  margin: 0;
  font-size: ${({ theme }) => theme.typography.fontSize.sm}px;
  color: ${({ theme }) => theme.colors.text.primary};
`;

const StyledColumnRow = styled.div.withConfig({
  displayName: 'StyledColumnRow',
  componentId: 'StyledColumnRow',
})`
  display: grid;
  grid-template-columns: 1fr auto;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm}px;
`;

const StyledColumnMoveControls = styled.div.withConfig({
  displayName: 'StyledColumnMoveControls',
  componentId: 'StyledColumnMoveControls',
})`
  display: inline-flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs}px;
`;

const StyledMoveButton = styled.button.withConfig({
  displayName: 'StyledMoveButton',
  componentId: 'StyledMoveButton',
})`
  min-height: 28px;
  min-width: 28px;
  border-radius: ${({ theme }) => theme.radius.sm}px;
  border: 1px solid ${({ theme }) => theme.colors.border.light};
  background-color: ${({ theme }) => theme.colors.background.primary};
  color: ${({ theme }) => theme.colors.text.primary};
  cursor: pointer;

  &:disabled {
    cursor: not-allowed;
    opacity: 0.4;
  }
`;

const StyledSettingsActions = styled.div.withConfig({
  displayName: 'StyledSettingsActions',
  componentId: 'StyledSettingsActions',
})`
  display: flex;
  justify-content: flex-end;
`;

export {
  StyledContainer,
  StyledContent,
  StyledToolbar,
  StyledSearchSlot,
  StyledScopeSlot,
  StyledControlLabel,
  StyledToolbarActions,
  StyledTableSettingsButton,
  StyledAddButton,
  StyledAddLabel,
  StyledFilterPanel,
  StyledFilterRow,
  StyledFilterActions,
  StyledFilterRowActions,
  StyledFilterButton,
  StyledListBody,
  StyledStateStack,
  StyledBulkBar,
  StyledBulkInfo,
  StyledBulkActions,
  StyledStatusBadge,
  StyledPrimaryCellText,
  StyledCodeCellText,
  StyledRowActions,
  StyledActionButton,
  StyledDangerActionButton,
  StyledPagination,
  StyledPaginationInfo,
  StyledPaginationActions,
  StyledPaginationControl,
  StyledPaginationControlLabel,
  StyledPaginationSelectSlot,
  StyledMobileList,
  StyledSettingsBody,
  StyledSettingsSection,
  StyledSettingsTitle,
  StyledColumnRow,
  StyledColumnMoveControls,
  StyledMoveButton,
  StyledSettingsActions,
};

