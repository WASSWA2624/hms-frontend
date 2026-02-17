import styled from 'styled-components';
import { View, ActivityIndicator } from 'react-native';
import {
  getRootLayoutBackgroundColor,
  getRootLayoutIndicatorColor,
} from './RootLayoutStyles.styles';

const StyledLoadingContainer = styled(View).withConfig({
  displayName: 'StyledLoadingContainer',
  componentId: 'StyledLoadingContainer',
})`
  flex: 1;
  justify-content: center;
  align-items: center;
  background-color: ${({ theme }) => getRootLayoutBackgroundColor(theme)};
`;

const StyledActivityIndicator = styled(ActivityIndicator).withConfig({
  displayName: 'StyledActivityIndicator',
  componentId: 'StyledActivityIndicator',
}).attrs(({ theme }) => ({
  color: getRootLayoutIndicatorColor(theme),
}))`
`;

const StyledSlotContainer = styled(View).withConfig({
  displayName: 'StyledSlotContainer',
  componentId: 'StyledSlotContainer',
})`
  flex: 1;
  height: 100%;
  background-color: ${({ theme }) => getRootLayoutBackgroundColor(theme)};
`;

export {
  StyledLoadingContainer,
  StyledActivityIndicator,
  StyledSlotContainer,
};

