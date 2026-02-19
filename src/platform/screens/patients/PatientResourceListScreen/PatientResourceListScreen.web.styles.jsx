import styled from 'styled-components';

const getTablet = (theme) => theme.breakpoints?.tablet ?? 768;

const StyledContainer = styled.main.withConfig({
  displayName: 'PatientResourceListScreen_StyledContainer',
  componentId: 'PatientResourceListScreen_StyledContainer',
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
  displayName: 'PatientResourceListScreen_StyledContent',
  componentId: 'PatientResourceListScreen_StyledContent',
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

const StyledHeader = styled.div.withConfig({
  displayName: 'PatientResourceListScreen_StyledHeader',
  componentId: 'PatientResourceListScreen_StyledHeader',
})`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs}px;
`;

const StyledHeaderTop = styled.div.withConfig({
  displayName: 'PatientResourceListScreen_StyledHeaderTop',
  componentId: 'PatientResourceListScreen_StyledHeaderTop',
})`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing.sm}px;
`;

const StyledHeaderCopy = styled.div.withConfig({
  displayName: 'PatientResourceListScreen_StyledHeaderCopy',
  componentId: 'PatientResourceListScreen_StyledHeaderCopy',
})`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs}px;
`;

const StyledHelpAnchor = styled.div.withConfig({
  displayName: 'PatientResourceListScreen_StyledHelpAnchor',
  componentId: 'PatientResourceListScreen_StyledHelpAnchor',
})`
  position: relative;
  display: inline-flex;
`;

const StyledHelpButton = styled.button.withConfig({
  displayName: 'PatientResourceListScreen_StyledHelpButton',
  componentId: 'PatientResourceListScreen_StyledHelpButton',
})`
  min-height: 36px;
  min-width: 36px;
  border-radius: ${({ theme }) => theme.radius.full}px;
  border: 1px solid ${({ theme }) => theme.colors.border.light};
  background-color: ${({ theme }) => theme.colors.background.secondary};
  color: ${({ theme }) => theme.colors.text.primary};
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
`;

const StyledHelpModalTitle = styled.h3.withConfig({
  displayName: 'PatientResourceListScreen_StyledHelpModalTitle',
  componentId: 'PatientResourceListScreen_StyledHelpModalTitle',
})`
  margin: 0;
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: ${({ theme }) => theme.typography.fontSize.md}px;
`;

const StyledHelpModalBody = styled.p.withConfig({
  displayName: 'PatientResourceListScreen_StyledHelpModalBody',
  componentId: 'PatientResourceListScreen_StyledHelpModalBody',
})`
  margin: 0;
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: ${({ theme }) => theme.typography.fontSize.sm}px;
`;

const StyledHelpChecklist = styled.ul.withConfig({
  displayName: 'PatientResourceListScreen_StyledHelpChecklist',
  componentId: 'PatientResourceListScreen_StyledHelpChecklist',
})`
  margin: 0;
  padding-left: ${({ theme }) => theme.spacing.md}px;
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs}px;
`;

const StyledHelpItem = styled.li.withConfig({
  displayName: 'PatientResourceListScreen_StyledHelpItem',
  componentId: 'PatientResourceListScreen_StyledHelpItem',
})`
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: ${({ theme }) => theme.typography.fontSize.sm}px;
`;

const StyledToolbar = styled.div.withConfig({
  displayName: 'PatientResourceListScreen_StyledToolbar',
  componentId: 'PatientResourceListScreen_StyledToolbar',
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
  displayName: 'PatientResourceListScreen_StyledSearchSlot',
  componentId: 'PatientResourceListScreen_StyledSearchSlot',
})`
  width: 100%;
`;

const StyledScopeSlot = styled.div.withConfig({
  displayName: 'PatientResourceListScreen_StyledScopeSlot',
  componentId: 'PatientResourceListScreen_StyledScopeSlot',
})`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs}px;
  width: 100%;
`;

const StyledControlLabel = styled.span.withConfig({
  displayName: 'PatientResourceListScreen_StyledControlLabel',
  componentId: 'PatientResourceListScreen_StyledControlLabel',
})`
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: ${({ theme }) => theme.typography.fontSize.xs}px;
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  line-height: 1.2;
`;

const StyledToolbarActions = styled.div.withConfig({
  displayName: 'PatientResourceListScreen_StyledToolbarActions',
  componentId: 'PatientResourceListScreen_StyledToolbarActions',
})`
  display: flex;
  align-items: flex-end;
  justify-content: flex-end;
  gap: ${({ theme }) => theme.spacing.sm}px;
  flex-wrap: wrap;
`;

const StyledTableSettingsButton = styled.button.withConfig({
  displayName: 'PatientResourceListScreen_StyledTableSettingsButton',
  componentId: 'PatientResourceListScreen_StyledTableSettingsButton',
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
`;

const StyledAddButton = styled.button.withConfig({
  displayName: 'PatientResourceListScreen_StyledAddButton',
  componentId: 'PatientResourceListScreen_StyledAddButton',
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
`;

const StyledAddLabel = styled.span.withConfig({
  displayName: 'PatientResourceListScreen_StyledAddLabel',
  componentId: 'PatientResourceListScreen_StyledAddLabel',
})`
  font-size: ${({ theme }) => theme.typography.fontSize.xs}px;
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
`;

const StyledFilterPanel = styled.div.withConfig({
  displayName: 'PatientResourceListScreen_StyledFilterPanel',
  componentId: 'PatientResourceListScreen_StyledFilterPanel',
})`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm}px;
  padding: ${({ theme }) => theme.spacing.sm}px;
  border-radius: ${({ theme }) => theme.radius.sm}px;
  border: 1px solid ${({ theme }) => theme.colors.border.light};
  background-color: ${({ theme }) => theme.colors.background.secondary};
`;

const StyledFilterHeader = styled.div.withConfig({
  displayName: 'PatientResourceListScreen_StyledFilterHeader',
  componentId: 'PatientResourceListScreen_StyledFilterHeader',
})`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing.xs}px;
`;

const StyledFilterTitle = styled.span.withConfig({
  displayName: 'PatientResourceListScreen_StyledFilterTitle',
  componentId: 'PatientResourceListScreen_StyledFilterTitle',
})`
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: ${({ theme }) => theme.typography.fontSize.sm}px;
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
`;

const StyledFilterToggleButton = styled.button.withConfig({
  displayName: 'PatientResourceListScreen_StyledFilterToggleButton',
  componentId: 'PatientResourceListScreen_StyledFilterToggleButton',
})`
  min-height: 28px;
  min-width: 28px;
  border-radius: ${({ theme }) => theme.radius.sm}px;
  border: 1px solid ${({ theme }) => theme.colors.border.light};
  background-color: ${({ theme }) => theme.colors.background.primary};
  color: ${({ theme }) => theme.colors.text.secondary};
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
`;

const StyledFilterChevron = styled.span.withConfig({
  displayName: 'PatientResourceListScreen_StyledFilterChevron',
  componentId: 'PatientResourceListScreen_StyledFilterChevron',
  shouldForwardProp: (prop) => prop !== '$collapsed',
})`
  transform: ${({ $collapsed }) => ($collapsed ? 'rotate(-90deg)' : 'rotate(0deg)')};
  transition: transform 0.2s ease;
`;

const StyledFilterBody = styled.div.withConfig({
  displayName: 'PatientResourceListScreen_StyledFilterBody',
  componentId: 'PatientResourceListScreen_StyledFilterBody',
})`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm}px;
`;

const StyledFilterRow = styled.div.withConfig({
  displayName: 'PatientResourceListScreen_StyledFilterRow',
  componentId: 'PatientResourceListScreen_StyledFilterRow',
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
  displayName: 'PatientResourceListScreen_StyledFilterActions',
  componentId: 'PatientResourceListScreen_StyledFilterActions',
})`
  display: flex;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing.xs}px;
`;

const StyledFilterRowActions = styled.div.withConfig({
  displayName: 'PatientResourceListScreen_StyledFilterRowActions',
  componentId: 'PatientResourceListScreen_StyledFilterRowActions',
})`
  display: flex;
  justify-content: flex-end;
  align-items: flex-end;
`;

const StyledFilterButton = styled.button.withConfig({
  displayName: 'PatientResourceListScreen_StyledFilterButton',
  componentId: 'PatientResourceListScreen_StyledFilterButton',
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
  displayName: 'PatientResourceListScreen_StyledListBody',
  componentId: 'PatientResourceListScreen_StyledListBody',
})`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md}px;
  width: 100%;
`;

const StyledStateStack = styled.div.withConfig({
  displayName: 'PatientResourceListScreen_StyledStateStack',
  componentId: 'PatientResourceListScreen_StyledStateStack',
})`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm}px;
`;

const StyledBulkBar = styled.div.withConfig({
  displayName: 'PatientResourceListScreen_StyledBulkBar',
  componentId: 'PatientResourceListScreen_StyledBulkBar',
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
  displayName: 'PatientResourceListScreen_StyledBulkInfo',
  componentId: 'PatientResourceListScreen_StyledBulkInfo',
})`
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: ${({ theme }) => theme.typography.fontSize.xs}px;
`;

const StyledBulkActions = styled.div.withConfig({
  displayName: 'PatientResourceListScreen_StyledBulkActions',
  componentId: 'PatientResourceListScreen_StyledBulkActions',
})`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs}px;
`;

const StyledRowActions = styled.div.withConfig({
  displayName: 'PatientResourceListScreen_StyledRowActions',
  componentId: 'PatientResourceListScreen_StyledRowActions',
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
  displayName: 'PatientResourceListScreen_StyledActionButton',
  componentId: 'PatientResourceListScreen_StyledActionButton',
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
`;

const StyledDangerActionButton = styled(StyledActionButton).withConfig({
  displayName: 'PatientResourceListScreen_StyledDangerActionButton',
  componentId: 'PatientResourceListScreen_StyledDangerActionButton',
})`
  border-color: ${({ theme }) => `${theme.colors.error}66`};
  color: ${({ theme }) => theme.colors.error};
`;

const StyledPagination = styled.div.withConfig({
  displayName: 'PatientResourceListScreen_StyledPagination',
  componentId: 'PatientResourceListScreen_StyledPagination',
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
  displayName: 'PatientResourceListScreen_StyledPaginationInfo',
  componentId: 'PatientResourceListScreen_StyledPaginationInfo',
})`
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: ${({ theme }) => theme.typography.fontSize.xs}px;
`;

const StyledPaginationActions = styled.div.withConfig({
  displayName: 'PatientResourceListScreen_StyledPaginationActions',
  componentId: 'PatientResourceListScreen_StyledPaginationActions',
})`
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing.xs}px;
`;

const StyledPaginationControl = styled.div.withConfig({
  displayName: 'PatientResourceListScreen_StyledPaginationControl',
  componentId: 'PatientResourceListScreen_StyledPaginationControl',
})`
  display: inline-flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs}px;
`;

const StyledPaginationControlLabel = styled.span.withConfig({
  displayName: 'PatientResourceListScreen_StyledPaginationControlLabel',
  componentId: 'PatientResourceListScreen_StyledPaginationControlLabel',
})`
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: ${({ theme }) => theme.typography.fontSize.xs}px;
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
`;

const StyledPaginationSelectSlot = styled.div.withConfig({
  displayName: 'PatientResourceListScreen_StyledPaginationSelectSlot',
  componentId: 'PatientResourceListScreen_StyledPaginationSelectSlot',
})`
  min-width: 86px;
`;

const StyledPaginationNavButton = styled(StyledActionButton).withConfig({
  displayName: 'PatientResourceListScreen_StyledPaginationNavButton',
  componentId: 'PatientResourceListScreen_StyledPaginationNavButton',
})`
  min-width: 36px;
  padding: 0;
  font-size: ${({ theme }) => theme.typography.fontSize.sm}px;
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  line-height: 1;
`;

const StyledMobileList = styled.ul.withConfig({
  displayName: 'PatientResourceListScreen_StyledMobileList',
  componentId: 'PatientResourceListScreen_StyledMobileList',
})`
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
`;

const StyledTitleCellText = styled.span.withConfig({
  displayName: 'PatientResourceListScreen_StyledTitleCellText',
  componentId: 'PatientResourceListScreen_StyledTitleCellText',
})`
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  color: ${({ theme }) => theme.colors.text.primary};
`;

const StyledSubtitleCellText = styled.span.withConfig({
  displayName: 'PatientResourceListScreen_StyledSubtitleCellText',
  componentId: 'PatientResourceListScreen_StyledSubtitleCellText',
})`
  color: ${({ theme }) => theme.colors.text.secondary};
`;

const StyledSettingsBody = styled.div.withConfig({
  displayName: 'PatientResourceListScreen_StyledSettingsBody',
  componentId: 'PatientResourceListScreen_StyledSettingsBody',
})`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm}px;
`;

const StyledSettingsSection = styled.section.withConfig({
  displayName: 'PatientResourceListScreen_StyledSettingsSection',
  componentId: 'PatientResourceListScreen_StyledSettingsSection',
})`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs}px;
`;

const StyledSettingsTitle = styled.h3.withConfig({
  displayName: 'PatientResourceListScreen_StyledSettingsTitle',
  componentId: 'PatientResourceListScreen_StyledSettingsTitle',
})`
  margin: 0;
  font-size: ${({ theme }) => theme.typography.fontSize.sm}px;
  color: ${({ theme }) => theme.colors.text.primary};
`;

const StyledColumnRow = styled.div.withConfig({
  displayName: 'PatientResourceListScreen_StyledColumnRow',
  componentId: 'PatientResourceListScreen_StyledColumnRow',
})`
  display: grid;
  grid-template-columns: 1fr auto;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm}px;
`;

const StyledColumnMoveControls = styled.div.withConfig({
  displayName: 'PatientResourceListScreen_StyledColumnMoveControls',
  componentId: 'PatientResourceListScreen_StyledColumnMoveControls',
})`
  display: inline-flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs}px;
`;

const StyledMoveButton = styled.button.withConfig({
  displayName: 'PatientResourceListScreen_StyledMoveButton',
  componentId: 'PatientResourceListScreen_StyledMoveButton',
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
  displayName: 'PatientResourceListScreen_StyledSettingsActions',
  componentId: 'PatientResourceListScreen_StyledSettingsActions',
})`
  display: flex;
  justify-content: flex-end;
`;

export {
  StyledActionButton,
  StyledAddButton,
  StyledAddLabel,
  StyledBulkActions,
  StyledBulkBar,
  StyledBulkInfo,
  StyledColumnMoveControls,
  StyledColumnRow,
  StyledContainer,
  StyledContent,
  StyledDangerActionButton,
  StyledControlLabel,
  StyledFilterActions,
  StyledFilterBody,
  StyledFilterButton,
  StyledFilterHeader,
  StyledFilterPanel,
  StyledFilterRowActions,
  StyledFilterRow,
  StyledFilterChevron,
  StyledFilterTitle,
  StyledFilterToggleButton,
  StyledHeader,
  StyledHeaderCopy,
  StyledHeaderTop,
  StyledHelpAnchor,
  StyledHelpButton,
  StyledHelpChecklist,
  StyledHelpItem,
  StyledHelpModalBody,
  StyledHelpModalTitle,
  StyledListBody,
  StyledMobileList,
  StyledMoveButton,
  StyledPagination,
  StyledPaginationActions,
  StyledPaginationControl,
  StyledPaginationControlLabel,
  StyledPaginationInfo,
  StyledPaginationNavButton,
  StyledPaginationSelectSlot,
  StyledRowActions,
  StyledScopeSlot,
  StyledSearchSlot,
  StyledSettingsActions,
  StyledSettingsBody,
  StyledSettingsSection,
  StyledSettingsTitle,
  StyledStateStack,
  StyledSubtitleCellText,
  StyledTableSettingsButton,
  StyledTitleCellText,
  StyledToolbar,
  StyledToolbarActions,
};
