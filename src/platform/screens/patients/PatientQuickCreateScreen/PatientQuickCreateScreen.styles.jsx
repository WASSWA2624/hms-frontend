import styled from 'styled-components/native';

const StyledContainer = styled.View`
  flex: 1;
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
