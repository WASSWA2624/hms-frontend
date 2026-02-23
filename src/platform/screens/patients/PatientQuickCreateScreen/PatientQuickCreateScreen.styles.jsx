import styled from 'styled-components/native';

const StyledContainer = styled.View`
  width: 100%;
  min-width: 0;
  align-self: stretch;
  gap: ${({ theme }) => theme.spacing.md}px;
`;

const StyledHeader = styled.View`
  gap: ${({ theme }) => theme.spacing.sm}px;
`;

const StyledFormGrid = styled.View`
  gap: ${({ theme }) => theme.spacing.sm + theme.spacing.xs}px;
`;

const StyledFieldBlock = styled.View`
  gap: ${({ theme }) => theme.spacing.xs}px;
`;

const StyledActions = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing.sm}px;
  justify-content: flex-end;
`;

export {
  StyledActions,
  StyledContainer,
  StyledFieldBlock,
  StyledFormGrid,
  StyledHeader,
};
