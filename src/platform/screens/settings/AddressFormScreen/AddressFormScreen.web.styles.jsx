/**
 * AddressFormScreen Web Styles
 */
import styled from 'styled-components';

const StyledContainer = styled.main.withConfig({
  displayName: 'AddressFormScreen_StyledContainer',
  componentId: 'AddressFormScreen_StyledContainer',
})`
  display: flex;
  flex-direction: column;
  width: 100%;
  min-height: 100%;
  background-color: ${({ theme }) => theme.colors.background.primary};
  padding: 0;
  box-sizing: border-box;
`;

const StyledContent = styled.div.withConfig({
  displayName: 'AddressFormScreen_StyledContent',
  componentId: 'AddressFormScreen_StyledContent',
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

const StyledInlineStates = styled.div.withConfig({
  displayName: 'AddressFormScreen_StyledInlineStates',
  componentId: 'AddressFormScreen_StyledInlineStates',
})`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm}px;
`;

const StyledFormGrid = styled.div.withConfig({
  displayName: 'AddressFormScreen_StyledFormGrid',
  componentId: 'AddressFormScreen_StyledFormGrid',
})`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: ${({ theme }) => theme.spacing.md}px;

  @media (max-width: ${({ theme }) => theme.breakpoints?.tablet ?? 768}px) {
    grid-template-columns: 1fr;
  }
`;

const StyledFieldGroup = styled.div.withConfig({
  displayName: 'AddressFormScreen_StyledFieldGroup',
  componentId: 'AddressFormScreen_StyledFieldGroup',
})`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs}px;
`;

const StyledFullRow = styled.div.withConfig({
  displayName: 'AddressFormScreen_StyledFullRow',
  componentId: 'AddressFormScreen_StyledFullRow',
})`
  grid-column: 1 / -1;
`;

const StyledHelperStack = styled.div.withConfig({
  displayName: 'AddressFormScreen_StyledHelperStack',
  componentId: 'AddressFormScreen_StyledHelperStack',
})`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm}px;
`;

const StyledActions = styled.div.withConfig({
  displayName: 'AddressFormScreen_StyledActions',
  componentId: 'AddressFormScreen_StyledActions',
})`
  display: flex;
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
