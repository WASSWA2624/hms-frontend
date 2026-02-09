/**
 * Sidebar Component Styles - Web
 * Semantic HTML; Microsoft Fluent (theme-design.mdc). Single scroll; sticky section headers.
 * File: Sidebar.web.styles.jsx
 */
import styled from 'styled-components';

const shadowToBoxShadow = (shadow) => {
  if (!shadow) return 'none';
  const x = shadow.shadowOffset && typeof shadow.shadowOffset.width === 'number' ? shadow.shadowOffset.width : 0;
  const y = shadow.shadowOffset && typeof shadow.shadowOffset.height === 'number' ? shadow.shadowOffset.height : 0;
  const blur = typeof shadow.shadowRadius === 'number' ? shadow.shadowRadius : 0;
  const alpha = typeof shadow.shadowOpacity === 'number' ? shadow.shadowOpacity : 0;
  const shadowColor = shadow.shadowColor || '#000000';

  if (shadowColor === '#000' || shadowColor === '#000000' || shadowColor.toLowerCase() === 'black') {
    return `${x}px ${y}px ${blur}px rgba(0, 0, 0, ${alpha})`;
  }

  return `${x}px ${y}px ${blur}px ${shadowColor}`;
};

const shouldNotForward = (prop) =>
  ['$collapsed', 'collapsed', 'accessibilityRole', 'accessibilityLabel', 'testID', 'footerSlot', 'items'].includes(prop);
const StyledSidebar = styled.nav.withConfig({
  displayName: 'StyledSidebar',
  componentId: 'StyledSidebar',
  shouldForwardProp: (prop) => !shouldNotForward(prop),
})`
  width: 100%;
  height: 100%;
  position: relative;
  display: flex;
  flex-direction: column;
  background-color: ${({ theme }) => theme.colors.background.primary};
  border-right: 1px solid ${({ theme }) => theme.colors.background.tertiary};
  border-radius: 0 ${({ theme }) => theme.radius?.sm ?? 4}px ${({ theme }) => theme.radius?.sm ?? 4}px 0;
`;

const StyledSidebarSearch = styled.div.withConfig({
  displayName: 'StyledSidebarSearch',
  componentId: 'StyledSidebarSearch',
})`
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs}px;
  padding: ${({ theme }) => theme.spacing.sm}px;
  padding-right: ${({ theme }) => theme.spacing.md}px;
  background-color: ${({ theme }) => theme.colors.background.primary};
  border-bottom: 1px solid ${({ theme }) => theme.colors.background.tertiary};

  @media (max-width: ${({ theme }) => (theme.breakpoints?.desktop ?? 1024) - 1}px) {
    display: none;
  }
`;

const StyledSidebarSearchResults = styled.div.withConfig({
  displayName: 'StyledSidebarSearchResults',
  componentId: 'StyledSidebarSearchResults',
})`
  border-radius: ${({ theme }) => theme.radius?.sm ?? 4}px;
  border: 1px solid ${({ theme }) => theme.colors.background.tertiary};
  background-color: ${({ theme }) => theme.colors.background.primary};
  box-shadow: ${({ theme }) => shadowToBoxShadow(theme.shadows?.sm)};
  max-height: ${({ theme }) => theme.spacing.xxl * 4}px;
  overflow-y: auto;
  overflow-x: hidden;
  padding: ${({ theme }) => theme.spacing.xs}px;
`;

const StyledSidebarSearchList = styled.ul.withConfig({
  displayName: 'StyledSidebarSearchList',
  componentId: 'StyledSidebarSearchList',
})`
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs}px;
`;

const StyledSidebarSearchItem = styled.button.withConfig({
  displayName: 'StyledSidebarSearchItem',
  componentId: 'StyledSidebarSearchItem',
})`
  width: 100%;
  min-height: 44px;
  padding: ${({ theme }) => theme.spacing.sm}px ${({ theme }) => theme.spacing.md}px;
  border: none;
  border-radius: ${({ theme }) => theme.radius?.sm ?? 4}px;
  background-color: transparent;
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm}px;
  cursor: pointer;
  text-align: left;
  color: ${({ theme }) => theme.colors.text.primary};
  transition: background-color 0.15s ease, color 0.15s ease;

  @media (prefers-reduced-motion: reduce) {
    transition: none;
  }

  &:hover {
    background-color: ${({ theme }) => theme.colors.background.secondary};
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.primary};
    outline-offset: 2px;
  }
`;

const StyledSidebarSearchIcon = styled.span.withConfig({
  displayName: 'StyledSidebarSearchIcon',
  componentId: 'StyledSidebarSearchIcon',
})`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 18px;
  height: 18px;
  flex-shrink: 0;
  color: ${({ theme }) => theme.colors.text.secondary};
`;

const StyledSidebarSearchText = styled.div.withConfig({
  displayName: 'StyledSidebarSearchText',
  componentId: 'StyledSidebarSearchText',
})`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs / 2}px;
  min-width: 0;
  flex: 1;
`;

const StyledSidebarSearchLabel = styled.span.withConfig({
  displayName: 'StyledSidebarSearchLabel',
  componentId: 'StyledSidebarSearchLabel',
})`
  font-size: ${({ theme }) => theme.typography.fontSize.sm}px;
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  color: ${({ theme }) => theme.colors.text.primary};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const StyledSidebarSearchMeta = styled.span.withConfig({
  displayName: 'StyledSidebarSearchMeta',
  componentId: 'StyledSidebarSearchMeta',
})`
  font-size: ${({ theme }) => theme.typography.fontSize.xs}px;
  color: ${({ theme }) => theme.colors.text.tertiary};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const StyledSidebarSearchEmpty = styled.div.withConfig({
  displayName: 'StyledSidebarSearchEmpty',
  componentId: 'StyledSidebarSearchEmpty',
})`
  padding: ${({ theme }) => theme.spacing.sm}px;
  font-size: ${({ theme }) => theme.typography.fontSize.xs}px;
  color: ${({ theme }) => theme.colors.text.tertiary};
`;

const StyledSidebarContent = styled.div.withConfig({
  displayName: 'StyledSidebarContent',
  componentId: 'StyledSidebarContent',
  shouldForwardProp: (prop) => prop !== '$collapsed',
})`
  flex: 1;
  min-height: 0;
  padding: ${({ theme }) => theme.spacing.xs}px;
  padding-right: ${({ theme }) => theme.spacing.md}px;
  padding-bottom: ${({ theme }) => theme.spacing.xs}px;
  scroll-padding-bottom: ${({ theme }) => theme.spacing.xs}px;
  overflow-y: auto;
  overflow-x: hidden;
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs / 2}px;
  scrollbar-gutter: stable;
`;

const StyledSidebarSection = styled.div.withConfig({
  displayName: 'StyledSidebarSection',
  componentId: 'StyledSidebarSection',
})`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs / 2}px;
`;

const StyledSidebarSectionHeader = styled.div.withConfig({
  displayName: 'StyledSidebarSectionHeader',
  componentId: 'StyledSidebarSectionHeader',
})`
  position: sticky;
  top: 0;
  z-index: 1;
  background-color: ${({ theme }) => theme.colors.background.primary};
  flex-shrink: 0;
  margin: 0;
  padding: 0;
`;

const StyledNavItemChildren = styled.div.withConfig({
  displayName: 'StyledNavItemChildren',
  componentId: 'StyledNavItemChildren',
})`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs / 2}px;
  padding-left: ${({ theme }) => theme.spacing.sm}px;
  border-left: 2px solid ${({ theme }) => theme.colors.background.tertiary};
  margin-left: ${({ theme }) => theme.spacing.sm}px;
`;

const StyledSidebarFooter = styled.div.withConfig({
  displayName: 'StyledSidebarFooter',
  componentId: 'StyledSidebarFooter',
})`
  padding: ${({ theme }) => theme.spacing.md}px;
  border-top: 1px solid ${({ theme }) => theme.colors.background.tertiary};
  background-color: ${({ theme }) => theme.colors.background.primary};
  flex-shrink: 0;
`;

const StyledNavSection = styled.div.withConfig({
  displayName: 'StyledNavSection',
  componentId: 'StyledNavSection',
})`
  margin-bottom: ${({ theme }) => theme.spacing.md}px;
`;

const StyledNavSectionHeader = styled.div.withConfig({
  displayName: 'StyledNavSectionHeader',
  componentId: 'StyledNavSectionHeader',
})`
  padding: ${({ theme }) => theme.spacing.sm}px ${({ theme }) => theme.spacing.md}px;
`;

const StyledNavSectionTitle = styled.span.withConfig({
  displayName: 'StyledNavSectionTitle',
  componentId: 'StyledNavSectionTitle',
})`
  font-size: ${({ theme }) => theme.typography.fontSize.xs}px;
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  color: ${({ theme }) => theme.colors.text.tertiary};
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const StyledNavItem = styled.button.withConfig({
  displayName: 'StyledNavItem',
  componentId: 'StyledNavItem',
  shouldForwardProp: (prop) => !['active', 'level'].includes(prop),
})`
  padding: ${({ theme }) => theme.spacing.sm}px ${({ theme }) => theme.spacing.md}px;
  min-height: 44px;
  border-radius: ${({ theme }) => theme.radius?.sm ?? 4}px;
  background-color: ${({ theme, active }) =>
    active ? theme.colors.background.secondary : 'transparent'};
  display: flex;
  flex-direction: row;
  align-items: center;
  border: none;
  cursor: pointer;
  width: 100%;
  text-align: left;
  font: inherit;
  color: inherit;
  transition: background-color 0.15s ease, color 0.15s ease;
  @media (prefers-reduced-motion: reduce) {
    transition: none;
  }

  &:hover {
    background-color: ${({ theme, active }) =>
      active ? theme.colors.background.secondary : theme.colors.background.tertiary};
  }

  &:active {
    background-color: ${({ theme }) => theme.colors.background.tertiary};
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.primary};
    outline-offset: 2px;
  }
`;

const StyledNavItemContent = styled.div.withConfig({
  displayName: 'StyledNavItemContent',
  componentId: 'StyledNavItemContent',
})`
  display: flex;
  flex-direction: row;
  align-items: center;
  flex: 1;
  gap: ${({ theme }) => theme.spacing.sm}px;
`;

const StyledNavItemLabel = styled.span.withConfig({
  displayName: 'StyledNavItemLabel',
  componentId: 'StyledNavItemLabel',
  shouldForwardProp: (prop) => prop !== 'active',
})`
  flex: 1;
  font-size: ${({ theme }) => theme.typography.fontSize.sm}px;
  font-weight: ${({ theme, active }) =>
    active ? theme.typography.fontWeight.semibold : theme.typography.fontWeight.normal};
  color: inherit;
`;

const StyledNavItemBadge = styled.span.withConfig({
  displayName: 'StyledNavItemBadge',
  componentId: 'StyledNavItemBadge',
})`
  margin-left: auto;
`;

const StyledExpandIcon = styled.span.withConfig({
  displayName: 'StyledExpandIcon',
  componentId: 'StyledExpandIcon',
  shouldForwardProp: (prop) => prop !== 'expanded',
})`
  font-size: 12px;
  color: ${({ theme }) => theme.colors.text.tertiary};
  transform: ${({ expanded }) => (expanded ? 'rotate(180deg)' : 'rotate(0deg)')};
  transition: transform 0.2s ease;
`;

export {
  StyledSidebar,
  StyledSidebarSearch,
  StyledSidebarSearchResults,
  StyledSidebarSearchList,
  StyledSidebarSearchItem,
  StyledSidebarSearchIcon,
  StyledSidebarSearchText,
  StyledSidebarSearchLabel,
  StyledSidebarSearchMeta,
  StyledSidebarSearchEmpty,
  StyledSidebarContent,
  StyledSidebarSection,
  StyledSidebarSectionHeader,
  StyledNavItemChildren,
  StyledSidebarFooter,
  StyledNavSection,
  StyledNavSectionHeader,
  StyledNavSectionTitle,
  StyledNavItem,
  StyledNavItemContent,
  StyledNavItemLabel,
  StyledNavItemBadge,
  StyledExpandIcon,
};
