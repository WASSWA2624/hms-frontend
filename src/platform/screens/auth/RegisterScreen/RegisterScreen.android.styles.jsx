/**
 * RegisterScreen Android Styles
 * File: RegisterScreen.android.styles.jsx
 */
import styled from 'styled-components/native';

const StyledContainer = styled.View.withConfig({
  displayName: 'StyledContainer',
  componentId: 'StyledContainer',
})`
  width: 100%;
  max-width: ${({ theme }) => theme.spacing.xxl * 18}px;
  align-self: center;
`;

const StyledTopActions = styled.View.withConfig({
  displayName: 'StyledTopActions',
  componentId: 'StyledTopActions',
})`
  margin-bottom: ${({ theme }) => theme.spacing.sm}px;
`;

const StyledTitleBlock = styled.View.withConfig({
  displayName: 'StyledTitleBlock',
  componentId: 'StyledTitleBlock',
})`
  margin-bottom: ${({ theme }) => theme.spacing.md}px;
`;

const StyledForm = styled.View.withConfig({
  displayName: 'StyledForm',
  componentId: 'StyledForm',
})`
  width: 100%;
`;

const StyledActions = styled.View.withConfig({
  displayName: 'StyledActions',
  componentId: 'StyledActions',
})`
  flex-direction: row;
  margin-top: ${({ theme }) => theme.spacing.md}px;
`;

const StyledActionSlot = styled.View.withConfig({
  displayName: 'StyledActionSlot',
  componentId: 'StyledActionSlot',
})`
  flex: 1;
  margin-right: ${({ theme, $last }) => ($last ? 0 : theme.spacing.sm)}px;
`;

const StyledStatus = styled.View.withConfig({
  displayName: 'StyledStatus',
  componentId: 'StyledStatus',
})`
  margin-top: ${({ theme }) => theme.spacing.sm}px;
`;

export {
  StyledActions,
  StyledActionSlot,
  StyledContainer,
  StyledForm,
  StyledStatus,
  StyledTitleBlock,
  StyledTopActions,
};


