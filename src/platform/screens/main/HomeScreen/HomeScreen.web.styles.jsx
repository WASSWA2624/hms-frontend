/**
 * DashboardScreen Web Styles
 * Styled-components for Web platform
 * File: HomeScreen.web.styles.jsx
 */
import styled from 'styled-components';

const getTablet = (theme) => theme.breakpoints?.tablet;
const getDesktop = (theme) => theme.breakpoints?.desktop;

const StyledHomeContainer = styled.main.withConfig({
  displayName: 'StyledHomeContainer',
  componentId: 'HomeScreen_StyledHomeContainer',
})`
  display: flex;
  flex-direction: column;
  width: 100%;
  min-height: 100%;
  background-color: ${({ theme }) => theme.colors.background.primary};
  padding-right: 0;
  box-sizing: border-box;
`;

const StyledContent = styled.div.withConfig({
  displayName: 'StyledContent',
  componentId: 'HomeScreen_StyledContent',
})`
  flex: 1;
  width: 100%;
  max-width: 100%;
  margin-left: auto;
  margin-right: auto;
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.lg}px;
`;

const StyledWelcomeSection = styled.section.withConfig({
  displayName: 'StyledWelcomeSection',
  componentId: 'HomeScreen_StyledWelcomeSection',
})`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm}px;
`;

const StyledWelcomeMessage = styled.div.withConfig({
  displayName: 'StyledWelcomeMessage',
  componentId: 'HomeScreen_StyledWelcomeMessage',
})`
  margin-top: ${({ theme }) => theme.spacing.md}px;
`;

const StyledWelcomeMeta = styled.div.withConfig({
  displayName: 'StyledWelcomeMeta',
  componentId: 'HomeScreen_StyledWelcomeMeta',
})`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm}px;
  color: ${({ theme }) => theme.colors.text.secondary};
`;

const StyledSection = styled.section.withConfig({
  displayName: 'StyledSection',
  componentId: 'HomeScreen_StyledSection',
})`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm}px;
`;

const StyledSectionHeader = styled.div.withConfig({
  displayName: 'StyledSectionHeader',
  componentId: 'HomeScreen_StyledSectionHeader',
})`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs}px;

  @media (min-width: ${({ theme }) => getTablet(theme)}px) {
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
  }
`;

const StyledSectionTitleGroup = styled.div.withConfig({
  displayName: 'StyledSectionTitleGroup',
  componentId: 'HomeScreen_StyledSectionTitleGroup',
})`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs}px;
`;

const StyledSectionMeta = styled.div.withConfig({
  displayName: 'StyledSectionMeta',
  componentId: 'HomeScreen_StyledSectionMeta',
})`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm}px;
  color: ${({ theme }) => theme.colors.text.secondary};
`;

const StyledSectionBody = styled.div.withConfig({
  displayName: 'StyledSectionBody',
  componentId: 'HomeScreen_StyledSectionBody',
})`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm}px;
`;

const StyledStatGrid = styled.div.withConfig({
  displayName: 'StyledStatGrid',
  componentId: 'HomeScreen_StyledStatGrid',
})`
  display: grid;
  grid-template-columns: 1fr;
  gap: ${({ theme }) => theme.spacing.sm}px;

  @media (min-width: ${({ theme }) => getTablet(theme)}px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  @media (min-width: ${({ theme }) => getDesktop(theme)}px) {
    grid-template-columns: repeat(4, minmax(0, 1fr));
  }
`;

const StyledCardWrapper = styled.div.withConfig({
  displayName: 'StyledCardWrapper',
  componentId: 'HomeScreen_StyledCardWrapper',
})`
  height: 100%;
`;

const StyledStatCardContent = styled.div.withConfig({
  displayName: 'StyledStatCardContent',
  componentId: 'HomeScreen_StyledStatCardContent',
})`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm}px;
`;

const StyledStatValueRow = styled.div.withConfig({
  displayName: 'StyledStatValueRow',
  componentId: 'HomeScreen_StyledStatValueRow',
})`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing.sm}px;
`;

const StyledCapacityList = styled.div.withConfig({
  displayName: 'StyledCapacityList',
  componentId: 'HomeScreen_StyledCapacityList',
})`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm}px;
`;

const StyledCapacityItem = styled.div.withConfig({
  displayName: 'StyledCapacityItem',
  componentId: 'HomeScreen_StyledCapacityItem',
})`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs}px;
`;

const StyledCapacityHeader = styled.div.withConfig({
  displayName: 'StyledCapacityHeader',
  componentId: 'HomeScreen_StyledCapacityHeader',
})`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing.sm}px;
`;

const StyledSectionGrid = styled.div.withConfig({
  displayName: 'StyledSectionGrid',
  componentId: 'HomeScreen_StyledSectionGrid',
})`
  display: grid;
  grid-template-columns: 1fr;
  gap: ${({ theme }) => theme.spacing.md}px;

  @media (min-width: ${({ theme }) => getDesktop(theme)}px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
`;

const StyledCardHeaderContent = styled.div.withConfig({
  displayName: 'StyledCardHeaderContent',
  componentId: 'HomeScreen_StyledCardHeaderContent',
})`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs}px;
`;

const StyledList = styled.ul.withConfig({
  displayName: 'StyledList',
  componentId: 'HomeScreen_StyledList',
})`
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
`;

const StyledListItem = styled.li.withConfig({
  displayName: 'StyledListItem',
  componentId: 'HomeScreen_StyledListItem',
})`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing.sm}px;
  padding: ${({ theme }) => theme.spacing.xs}px 0;
  border-bottom: 1px solid ${({ theme }) => theme.colors.background.tertiary};

  &:last-child {
    border-bottom: none;
  }
`;

const StyledListItemContent = styled.div.withConfig({
  displayName: 'StyledListItemContent',
  componentId: 'HomeScreen_StyledListItemContent',
})`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs}px;
  min-width: 0;
`;

const StyledListItemMeta = styled.div.withConfig({
  displayName: 'StyledListItemMeta',
  componentId: 'HomeScreen_StyledListItemMeta',
})`
  color: ${({ theme }) => theme.colors.text.secondary};
`;

const StyledStateWrapper = styled.div.withConfig({
  displayName: 'StyledStateWrapper',
  componentId: 'HomeScreen_StyledStateWrapper',
})`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: ${({ theme }) => theme.spacing.xl}px 0;
`;

const StyledLoadingGrid = styled.div.withConfig({
  displayName: 'StyledLoadingGrid',
  componentId: 'HomeScreen_StyledLoadingGrid',
})`
  display: grid;
  grid-template-columns: 1fr;
  gap: ${({ theme }) => theme.spacing.md}px;

  @media (min-width: ${({ theme }) => getTablet(theme)}px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  @media (min-width: ${({ theme }) => getDesktop(theme)}px) {
    grid-template-columns: repeat(4, minmax(0, 1fr));
  }
`;

const StyledLoadingBlock = styled.div.withConfig({
  displayName: 'StyledLoadingBlock',
  componentId: 'HomeScreen_StyledLoadingBlock',
})`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm}px;
`;

export {
  StyledHomeContainer,
  StyledContent,
  StyledWelcomeSection,
  StyledWelcomeMessage,
  StyledWelcomeMeta,
  StyledSection,
  StyledSectionHeader,
  StyledSectionTitleGroup,
  StyledSectionMeta,
  StyledSectionBody,
  StyledStatGrid,
  StyledCardWrapper,
  StyledStatCardContent,
  StyledStatValueRow,
  StyledCapacityList,
  StyledCapacityItem,
  StyledCapacityHeader,
  StyledSectionGrid,
  StyledCardHeaderContent,
  StyledList,
  StyledListItem,
  StyledListItemContent,
  StyledListItemMeta,
  StyledStateWrapper,
  StyledLoadingGrid,
  StyledLoadingBlock,
};

