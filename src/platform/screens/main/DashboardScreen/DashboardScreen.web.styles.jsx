/**
 * DashboardScreen Web Styles
 * Styled-components for Web platform
 * File: DashboardScreen.web.styles.jsx
 */
import styled from 'styled-components';

const getTablet = (theme) => theme.breakpoints?.tablet || 768;
const getDesktop = (theme) => theme.breakpoints?.desktop || 1200;

const StyledHomeContainer = styled.main.withConfig({
  displayName: 'StyledHomeContainer',
  componentId: 'DashboardScreenWeb_StyledHomeContainer',
})`
  display: flex;
  flex-direction: column;
  width: 100%;
  min-height: 100%;
  background: ${({ theme }) => theme.colors?.background?.primary || '#f7fafc'};
`;

const StyledContent = styled.div.withConfig({
  displayName: 'StyledContent',
  componentId: 'DashboardScreenWeb_StyledContent',
})`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing?.lg ?? 24}px;
  width: 100%;
`;

const StyledSection = styled.section.withConfig({
  displayName: 'StyledSection',
  componentId: 'DashboardScreenWeb_StyledSection',
})`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing?.sm ?? 12}px;
`;

const StyledSectionHeader = styled.div.withConfig({
  displayName: 'StyledSectionHeader',
  componentId: 'DashboardScreenWeb_StyledSectionHeader',
})`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing?.xs ?? 8}px;

  @media (min-width: ${({ theme }) => getTablet(theme)}px) {
    align-items: center;
    flex-direction: row;
    justify-content: space-between;
  }
`;

const StyledSectionTitleGroup = styled.div.withConfig({
  displayName: 'StyledSectionTitleGroup',
  componentId: 'DashboardScreenWeb_StyledSectionTitleGroup',
})`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing?.xs ?? 8}px;
`;

const StyledSectionMeta = styled.div.withConfig({
  displayName: 'StyledSectionMeta',
  componentId: 'DashboardScreenWeb_StyledSectionMeta',
})`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing?.xs ?? 8}px;
  color: ${({ theme }) => theme.colors?.text?.secondary || '#64748b'};
`;

const StyledSectionBody = styled.div.withConfig({
  displayName: 'StyledSectionBody',
  componentId: 'DashboardScreenWeb_StyledSectionBody',
})`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing?.sm ?? 12}px;
`;

const StyledHeroPanel = styled.div.withConfig({
  displayName: 'StyledHeroPanel',
  componentId: 'DashboardScreenWeb_StyledHeroPanel',
})`
  border: 1px solid ${({ theme }) => theme.colors?.background?.tertiary || '#e2e8f0'};
  border-radius: ${({ theme }) => theme.radius?.lg ?? 16}px;
  padding: ${({ theme }) => theme.spacing?.lg ?? 24}px;
  background:
    radial-gradient(circle at top right, rgba(37, 99, 235, 0.16), transparent 54%),
    linear-gradient(
      135deg,
      ${({ theme }) => theme.colors?.background?.primary || '#ffffff'} 0%,
      ${({ theme }) => theme.colors?.background?.secondary || '#f8fafc'} 100%
    );
`;

const StyledWelcomeSection = styled.div.withConfig({
  displayName: 'StyledWelcomeSection',
  componentId: 'DashboardScreenWeb_StyledWelcomeSection',
})`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing?.md ?? 16}px;
`;

const StyledWelcomeMessage = styled.div.withConfig({
  displayName: 'StyledWelcomeMessage',
  componentId: 'DashboardScreenWeb_StyledWelcomeMessage',
})`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing?.xs ?? 8}px;
`;

const StyledWelcomeMeta = styled.div.withConfig({
  displayName: 'StyledWelcomeMeta',
  componentId: 'DashboardScreenWeb_StyledWelcomeMeta',
})`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing?.sm ?? 12}px;
  color: ${({ theme }) => theme.colors?.text?.secondary || '#64748b'};
`;

const StyledBadgeRow = styled.div.withConfig({
  displayName: 'StyledBadgeRow',
  componentId: 'DashboardScreenWeb_StyledBadgeRow',
})`
  display: flex;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing?.xs ?? 8}px;
`;

const StyledSummaryGrid = styled.div.withConfig({
  displayName: 'StyledSummaryGrid',
  componentId: 'DashboardScreenWeb_StyledSummaryGrid',
})`
  display: grid;
  grid-template-columns: repeat(1, minmax(0, 1fr));
  gap: ${({ theme }) => theme.spacing?.sm ?? 12}px;

  @media (min-width: ${({ theme }) => getTablet(theme)}px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  @media (min-width: ${({ theme }) => getDesktop(theme)}px) {
    grid-template-columns: repeat(5, minmax(0, 1fr));
  }
`;

const StyledStatCardContent = styled.div.withConfig({
  displayName: 'StyledStatCardContent',
  componentId: 'DashboardScreenWeb_StyledStatCardContent',
})`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing?.sm ?? 12}px;
`;

const StyledStatValueRow = styled.div.withConfig({
  displayName: 'StyledStatValueRow',
  componentId: 'DashboardScreenWeb_StyledStatValueRow',
})`
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing?.xs ?? 8}px;
`;

const StyledAnalyticsGrid = styled.div.withConfig({
  displayName: 'StyledAnalyticsGrid',
  componentId: 'DashboardScreenWeb_StyledAnalyticsGrid',
})`
  display: grid;
  grid-template-columns: 1fr;
  gap: ${({ theme }) => theme.spacing?.md ?? 16}px;

  @media (min-width: ${({ theme }) => getDesktop(theme)}px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
`;

const StyledTrendChart = styled.div.withConfig({
  displayName: 'StyledTrendChart',
  componentId: 'DashboardScreenWeb_StyledTrendChart',
})`
  display: grid;
  grid-template-columns: repeat(7, minmax(0, 1fr));
  align-items: end;
  gap: ${({ theme }) => theme.spacing?.xs ?? 8}px;
  min-height: 220px;
`;

const StyledTrendColumn = styled.div.withConfig({
  displayName: 'StyledTrendColumn',
  componentId: 'DashboardScreenWeb_StyledTrendColumn',
})`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${({ theme }) => theme.spacing?.xs ?? 8}px;
  min-width: 0;
`;

const StyledTrendBarTrack = styled.div.withConfig({
  displayName: 'StyledTrendBarTrack',
  componentId: 'DashboardScreenWeb_StyledTrendBarTrack',
})`
  width: 100%;
  max-width: 44px;
  height: 144px;
  border-radius: ${({ theme }) => theme.radius?.md ?? 12}px;
  border: 1px solid ${({ theme }) => theme.colors?.background?.tertiary || '#e2e8f0'};
  background: ${({ theme }) => theme.colors?.background?.secondary || '#f1f5f9'};
  display: flex;
  align-items: flex-end;
  padding: 3px;
  box-sizing: border-box;
`;

const StyledTrendBarFill = styled.div.withConfig({
  displayName: 'StyledTrendBarFill',
  componentId: 'DashboardScreenWeb_StyledTrendBarFill',
})`
  width: 100%;
  height: ${({ $height }) => `${$height}%`};
  min-height: ${({ $height }) => ($height > 0 ? '6px' : '0')};
  border-radius: ${({ theme }) => theme.radius?.sm ?? 8}px;
  background: linear-gradient(180deg, #2563eb 0%, #0d9488 100%);
`;

const StyledTrendMeta = styled.div.withConfig({
  displayName: 'StyledTrendMeta',
  componentId: 'DashboardScreenWeb_StyledTrendMeta',
})`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 2px;
`;

const StyledDonutLayout = styled.div.withConfig({
  displayName: 'StyledDonutLayout',
  componentId: 'DashboardScreenWeb_StyledDonutLayout',
})`
  display: grid;
  grid-template-columns: 1fr;
  gap: ${({ theme }) => theme.spacing?.md ?? 16}px;
  align-items: center;

  @media (min-width: ${({ theme }) => getTablet(theme)}px) {
    grid-template-columns: auto minmax(0, 1fr);
  }
`;

const StyledDonut = styled.div.withConfig({
  displayName: 'StyledDonut',
  componentId: 'DashboardScreenWeb_StyledDonut',
})`
  width: 168px;
  height: 168px;
  margin: 0 auto;
  border-radius: 50%;
  background: ${({ $gradient }) => $gradient};
  position: relative;
  border: 1px solid rgba(15, 23, 42, 0.08);
`;

const StyledDonutCenter = styled.div.withConfig({
  displayName: 'StyledDonutCenter',
  componentId: 'DashboardScreenWeb_StyledDonutCenter',
})`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 84px;
  height: 84px;
  border-radius: 50%;
  background: ${({ theme }) => theme.colors?.background?.primary || '#ffffff'};
  border: 1px solid ${({ theme }) => theme.colors?.background?.tertiary || '#e2e8f0'};
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: ${({ theme }) => theme.spacing?.xs ?? 8}px;
  box-sizing: border-box;
`;

const StyledLegendList = styled.ul.withConfig({
  displayName: 'StyledLegendList',
  componentId: 'DashboardScreenWeb_StyledLegendList',
})`
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing?.xs ?? 8}px;
`;

const StyledLegendItem = styled.li.withConfig({
  displayName: 'StyledLegendItem',
  componentId: 'DashboardScreenWeb_StyledLegendItem',
})`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing?.sm ?? 12}px;
  min-width: 0;
`;

const StyledLegendLabel = styled.div.withConfig({
  displayName: 'StyledLegendLabel',
  componentId: 'DashboardScreenWeb_StyledLegendLabel',
})`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing?.xs ?? 8}px;
  min-width: 0;
`;

const StyledLegendSwatch = styled.span.withConfig({
  displayName: 'StyledLegendSwatch',
  componentId: 'DashboardScreenWeb_StyledLegendSwatch',
})`
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: ${({ $color }) => $color || '#94a3b8'};
  flex: 0 0 auto;
`;

const StyledHighlightGrid = styled.div.withConfig({
  displayName: 'StyledHighlightGrid',
  componentId: 'DashboardScreenWeb_StyledHighlightGrid',
})`
  display: grid;
  grid-template-columns: 1fr;
  gap: ${({ theme }) => theme.spacing?.sm ?? 12}px;

  @media (min-width: ${({ theme }) => getTablet(theme)}px) {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
`;

const StyledHighlightCard = styled.div.withConfig({
  displayName: 'StyledHighlightCard',
  componentId: 'DashboardScreenWeb_StyledHighlightCard',
})`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing?.xs ?? 8}px;
  border: 1px solid ${({ theme }) => theme.colors?.background?.tertiary || '#e2e8f0'};
  border-radius: ${({ theme }) => theme.radius?.md ?? 12}px;
  padding: ${({ theme }) => theme.spacing?.md ?? 16}px;
  background: ${({ theme }) => theme.colors?.background?.secondary || '#f8fafc'};
`;

const StyledSectionGrid = styled.div.withConfig({
  displayName: 'StyledSectionGrid',
  componentId: 'DashboardScreenWeb_StyledSectionGrid',
})`
  display: grid;
  grid-template-columns: 1fr;
  gap: ${({ theme }) => theme.spacing?.md ?? 16}px;

  @media (min-width: ${({ theme }) => getDesktop(theme)}px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
`;

const StyledList = styled.ul.withConfig({
  displayName: 'StyledList',
  componentId: 'DashboardScreenWeb_StyledList',
})`
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
`;

const StyledListItem = styled.li.withConfig({
  displayName: 'StyledListItem',
  componentId: 'DashboardScreenWeb_StyledListItem',
})`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing?.sm ?? 12}px;
  padding: ${({ theme }) => theme.spacing?.sm ?? 12}px 0;
  border-bottom: 1px solid ${({ theme }) => theme.colors?.background?.tertiary || '#e2e8f0'};

  &:last-child {
    border-bottom: none;
    padding-bottom: 0;
  }
`;

const StyledListItemContent = styled.div.withConfig({
  displayName: 'StyledListItemContent',
  componentId: 'DashboardScreenWeb_StyledListItemContent',
})`
  display: flex;
  flex-direction: column;
  gap: 4px;
  min-width: 0;
`;

const StyledListItemMeta = styled.div.withConfig({
  displayName: 'StyledListItemMeta',
  componentId: 'DashboardScreenWeb_StyledListItemMeta',
})`
  color: ${({ theme }) => theme.colors?.text?.secondary || '#64748b'};
`;

const StyledActivityMeta = styled.div.withConfig({
  displayName: 'StyledActivityMeta',
  componentId: 'DashboardScreenWeb_StyledActivityMeta',
})`
  color: ${({ theme }) => theme.colors?.text?.secondary || '#64748b'};
  white-space: nowrap;
`;

const StyledQuickActions = styled.div.withConfig({
  displayName: 'StyledQuickActions',
  componentId: 'DashboardScreenWeb_StyledQuickActions',
})`
  display: flex;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing?.sm ?? 12}px;
`;

const StyledCardHeaderContent = styled.div.withConfig({
  displayName: 'StyledCardHeaderContent',
  componentId: 'DashboardScreenWeb_StyledCardHeaderContent',
})`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing?.xs ?? 8}px;
`;

const StyledStateWrapper = styled.div.withConfig({
  displayName: 'StyledStateWrapper',
  componentId: 'DashboardScreenWeb_StyledStateWrapper',
})`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: ${({ theme }) => theme.spacing?.xl ?? 32}px 0;
`;

const StyledLoadingGrid = styled.div.withConfig({
  displayName: 'StyledLoadingGrid',
  componentId: 'DashboardScreenWeb_StyledLoadingGrid',
})`
  display: grid;
  grid-template-columns: repeat(1, minmax(0, 1fr));
  gap: ${({ theme }) => theme.spacing?.sm ?? 12}px;

  @media (min-width: ${({ theme }) => getTablet(theme)}px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  @media (min-width: ${({ theme }) => getDesktop(theme)}px) {
    grid-template-columns: repeat(5, minmax(0, 1fr));
  }
`;

const StyledLoadingBlock = styled.div.withConfig({
  displayName: 'StyledLoadingBlock',
  componentId: 'DashboardScreenWeb_StyledLoadingBlock',
})`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing?.sm ?? 12}px;
`;

const StyledCardWrapper = styled.div.withConfig({
  displayName: 'StyledCardWrapper',
  componentId: 'DashboardScreenWeb_StyledCardWrapper',
})`
  height: 100%;
`;

export {
  StyledHomeContainer,
  StyledContent,
  StyledSection,
  StyledSectionHeader,
  StyledSectionTitleGroup,
  StyledSectionMeta,
  StyledSectionBody,
  StyledHeroPanel,
  StyledWelcomeSection,
  StyledWelcomeMessage,
  StyledWelcomeMeta,
  StyledBadgeRow,
  StyledSummaryGrid,
  StyledStatCardContent,
  StyledStatValueRow,
  StyledAnalyticsGrid,
  StyledTrendChart,
  StyledTrendColumn,
  StyledTrendBarTrack,
  StyledTrendBarFill,
  StyledTrendMeta,
  StyledDonutLayout,
  StyledDonut,
  StyledDonutCenter,
  StyledLegendList,
  StyledLegendItem,
  StyledLegendLabel,
  StyledLegendSwatch,
  StyledHighlightGrid,
  StyledHighlightCard,
  StyledSectionGrid,
  StyledList,
  StyledListItem,
  StyledListItemContent,
  StyledListItemMeta,
  StyledActivityMeta,
  StyledQuickActions,
  StyledCardHeaderContent,
  StyledStateWrapper,
  StyledLoadingGrid,
  StyledLoadingBlock,
  StyledCardWrapper,
};
