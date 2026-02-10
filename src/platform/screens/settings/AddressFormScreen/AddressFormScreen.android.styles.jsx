/**
 * AddressFormScreen Android Styles
 */
import styled from 'styled-components/native';

const StyledContainer = styled.View.withConfig({
  displayName: 'AddressFormScreen_StyledContainer',
  componentId: 'AddressFormScreen_StyledContainer',
})`
  flex: 1;
  width: 100%;
  min-height: 100%;
  background-color: ${({ theme }) => theme.colors.background.primary};
`;

const StyledContent = styled.View.withConfig({
  displayName: 'AddressFormScreen_StyledContent',
  componentId: 'AddressFormScreen_StyledContent',
})`
  flex: 1;
  width: 100%;
  gap: ${({ theme }) => theme.spacing.md}px;
`;

const StyledInlineStates = styled.View.withConfig({
  displayName: 'AddressFormScreen_StyledInlineStates',
  componentId: 'AddressFormScreen_StyledInlineStates',
})`
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm}px;
`;

const StyledFormGrid = styled.View.withConfig({
  displayName: 'AddressFormScreen_StyledFormGrid',
  componentId: 'AddressFormScreen_StyledFormGrid',
})`
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md}px;
`;

const StyledFieldGroup = styled.View.withConfig({
  displayName: 'AddressFormScreen_StyledFieldGroup',
  componentId: 'AddressFormScreen_StyledFieldGroup',
})`
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs}px;
`;

const StyledFullRow = styled.View.withConfig({
  displayName: 'AddressFormScreen_StyledFullRow',
  componentId: 'AddressFormScreen_StyledFullRow',
})``;

const StyledHelperStack = styled.View.withConfig({
  displayName: 'AddressFormScreen_StyledHelperStack',
  componentId: 'AddressFormScreen_StyledHelperStack',
})`
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm}px;
`;

const StyledActions = styled.View.withConfig({
  displayName: 'AddressFormScreen_StyledActions',
  componentId: 'AddressFormScreen_StyledActions',
})`
  flex-direction: row;
  gap: ${({ theme }) => theme.spacing.sm}px;
  flex-wrap: wrap;
`;

export {
  StyledContainer,
  StyledContent,
  StyledInlineStates,
  StyledFormGrid,
  StyledFieldGroup,
  StyledFullRow,
  StyledHelperStack,
  StyledActions,
};
