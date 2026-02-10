/**
 * TenantFormScreen iOS Styles
 */
import styled from 'styled-components/native';
import { ScrollView, View } from 'react-native';

const StyledScrollView = styled(ScrollView).attrs({
  contentContainerStyle: { flexGrow: 1 },
}).withConfig({
  displayName: 'StyledScrollView',
  componentId: 'StyledScrollView',
})`
  flex: 1;
`;

const StyledContainer = styled(View).withConfig({
  displayName: 'StyledContainer',
  componentId: 'StyledContainer',
})`
  flex: 1;
  width: 100%;
  min-height: 100%;
  background-color: ${({ theme }) => theme.colors.background.primary};
  padding: ${({ theme }) => theme.spacing.lg}px;
`;

const StyledContent = styled(View).withConfig({
  displayName: 'StyledContent',
  componentId: 'StyledContent',
})`
  flex: 1;
  width: 100%;
`;

const StyledSection = styled.View.withConfig({
  displayName: 'StyledSection',
  componentId: 'StyledSection',
})`
  margin-top: ${({ theme }) => theme.spacing.lg}px;
`;

const StyledActions = styled.View.withConfig({
  displayName: 'StyledActions',
  componentId: 'StyledActions',
})`
  flex-direction: row;
  gap: ${({ theme }) => theme.spacing.sm}px;
  margin-top: ${({ theme }) => theme.spacing.xl}px;
  flex-wrap: wrap;
`;

export { StyledScrollView, StyledContainer, StyledContent, StyledSection, StyledActions };
