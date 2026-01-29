/**
 * SettingsScreen Web Styles
 * File: SettingsScreen.web.styles.jsx
 */

import styled from 'styled-components/native';

export const StyledContainer = styled.View`
  flex: 1;
  background-color: ${({ theme }) => theme?.colors?.background?.primary || '#ffffff'};
  padding: 24px;
`;

export const StyledContent = styled.View`
  flex: 1;
  width: 100%;
`;

export const StyledTabBarContainer = styled.View`
  width: 100%;
  border-bottom-width: 1px;
  border-bottom-color: ${({ theme }) => theme?.colors?.border?.light || '#e0e0e0'};
  margin-bottom: 24px;
`;

export const StyledTabBar = styled.View`
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  overflow-x: auto;
  overflow-y: hidden;
  -webkit-overflow-scrolling: touch;
  gap: 0;
  min-width: 0;
`;
