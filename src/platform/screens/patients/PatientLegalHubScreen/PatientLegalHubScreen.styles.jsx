import styled from 'styled-components/native';

const StyledContainer = styled.View`
  flex: 1;
  gap: ${({ theme }) => theme.spacing.sm + theme.spacing.xs + 2}px;
`;

const StyledHeader = styled.View`
  gap: ${({ theme }) => theme.spacing.xs + 2}px;
`;

const StyledTabRow = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing.sm}px;
`;

const StyledActions = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing.sm}px;
`;

const StyledList = styled.View`
  gap: ${({ theme }) => theme.spacing.sm}px;
`;

const StyledListItem = styled.View`
  border-width: 1px;
  border-color: ${({ theme }) => theme.colors.border.light};
  border-radius: ${({ theme }) => theme.radius.lg - 2}px;
  padding: ${({ theme }) => theme.spacing.sm + theme.spacing.xs}px;
  gap: ${({ theme }) => theme.spacing.xs}px;
`;

const StyledListItemHeader = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing.sm}px;
`;

const StyledForm = styled.View`
  gap: ${({ theme }) => theme.spacing.sm + theme.spacing.xs}px;
`;

const StyledField = styled.View`
  gap: ${({ theme }) => theme.spacing.xs}px;
`;

const StyledFormActions = styled.View`
  flex-direction: row;
  justify-content: flex-end;
  gap: ${({ theme }) => theme.spacing.sm}px;
`;

export {
  StyledActions,
  StyledContainer,
  StyledField,
  StyledForm,
  StyledFormActions,
  StyledHeader,
  StyledList,
  StyledListItem,
  StyledListItemHeader,
  StyledTabRow,
};
