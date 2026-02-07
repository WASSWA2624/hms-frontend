/**
 * Header Component Styles - Web
 * Theme-only; Microsoft Fluent / M365 look
 * File: Header.web.styles.jsx
 */
import styled from 'styled-components';

const StyledHeader = styled.header.withConfig({
  displayName: 'StyledHeader',
  componentId: 'StyledHeader',
})`
  background-color: ${({ theme }) => theme.colors.background.primary};
  border-bottom: 1px solid ${({ theme }) => theme.colors.background.tertiary};
  padding: ${({ theme }) => theme.spacing.xs}px ${({ theme }) => theme.spacing.sm}px;
  min-height: ${({ theme }) => theme.spacing.xl}px;
  position: sticky;
  top: 0;
  z-index: 1000;
  box-shadow: 0 1px 0 ${({ theme }) => theme.colors.background.tertiary};
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

const StyledHeaderRow = styled.div.withConfig({
  displayName: 'StyledHeaderRow',
  componentId: 'StyledHeaderRow',
})`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing.sm}px;
  width: 100%;
  min-width: 0;
`;

const StyledLeadingSlot = styled.div.withConfig({
  displayName: 'StyledLeadingSlot',
  componentId: 'StyledLeadingSlot',
})`
  display: inline-flex;
  align-items: center;
  flex: 0 0 auto;
`;

const StyledTitleGroup = styled.div.withConfig({
  displayName: 'StyledTitleGroup',
  componentId: 'StyledTitleGroup',
})`
  display: flex;
  flex-direction: column;
  gap: 0;
  flex: 1;
  min-width: 0;
  overflow: hidden;
`;

const StyledTrailingSlot = styled.div.withConfig({
  displayName: 'StyledTrailingSlot',
  componentId: 'StyledTrailingSlot',
})`
  display: inline-flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs}px;
  flex: 0 0 auto;
`;

export {
  StyledHeader,
  StyledHeaderRow,
  StyledLeadingSlot,
  StyledTitleGroup,
  StyledTrailingSlot,
};
