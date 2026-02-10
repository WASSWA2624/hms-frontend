/**
 * FacilityListScreen Android Styles
 * File: FacilityListScreen.android.styles.jsx
 */
import styled from 'styled-components/native';

const StyledContainer = styled.View.withConfig({
  displayName: 'StyledContainer',
  componentId: 'StyledContainer',
})`
  flex: 1;
  width: 100%;
  min-height: 100%;
  background-color: ${({ theme }) => theme.colors.background.primary};
`;

const StyledContent = styled.View.withConfig({
  displayName: 'StyledContent',
  componentId: 'StyledContent',
})`
  flex: 1;
  width: 100%;
`;

const StyledToolbar = styled.View.withConfig({
  displayName: 'StyledToolbar',
  componentId: 'StyledToolbar',
})`
  flex-direction: column;
  align-items: stretch;
  gap: ${({ theme }) => theme.spacing.sm}px;
`;

const StyledSearchSlot = styled.View.withConfig({
  displayName: 'StyledSearchSlot',
  componentId: 'StyledSearchSlot',
})`
  width: 100%;
`;

const StyledToolbarActions = styled.View.withConfig({
  displayName: 'StyledToolbarActions',
  componentId: 'StyledToolbarActions',
})`
  flex-direction: row;
  align-items: center;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing.sm}px;
`;

const StyledListBody = styled.View.withConfig({
  displayName: 'StyledListBody',
  componentId: 'StyledListBody',
})`
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md}px;
  width: 100%;
`;

const StyledStateStack = styled.View.withConfig({
  displayName: 'StyledStateStack',
  componentId: 'StyledStateStack',
})`
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm}px;
`;

const StyledList = styled.View.withConfig({
  displayName: 'StyledList',
  componentId: 'StyledList',
})`
  width: 100%;
`;

const StyledSeparator = styled.View.withConfig({
  displayName: 'StyledSeparator',
  componentId: 'StyledSeparator',
})`
  width: 100%;
  height: ${({ theme }) => theme.spacing.sm}px;
`;

export {
  StyledContainer,
  StyledContent,
  StyledToolbar,
  StyledSearchSlot,
  StyledToolbarActions,
  StyledListBody,
  StyledStateStack,
  StyledList,
  StyledSeparator,
};
