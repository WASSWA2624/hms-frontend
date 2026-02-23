import styled from 'styled-components/native';
import { Text } from '@platform/components';

const StyledLabelRow = styled.View`
  width: 100%;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing.sm}px;
`;

const StyledLabelText = styled(Text)`
  flex: 1;
`;

const StyledHelpAnchor = styled.View`
  position: relative;
  z-index: 21000;
`;

const StyledHelpButton = styled.Pressable`
  min-width: 32px;
  min-height: 32px;
  width: 32px;
  height: 32px;
  border-radius: ${({ theme }) => theme.radius.full}px;
  align-items: center;
  justify-content: center;
  border-width: 0;
  background-color: transparent;
`;

const StyledHelpBody = styled(Text).attrs({
  align: 'left',
})`
  margin-top: ${({ theme }) => theme.spacing.sm}px;
`;

const StyledHelpList = styled.View`
  margin-top: ${({ theme }) => theme.spacing.md}px;
  gap: ${({ theme }) => theme.spacing.xs}px;
`;

const StyledHelpListItem = styled(Text).attrs({
  align: 'left',
})`
  font-size: ${({ theme }) => theme.typography.fontSize.xs}px;
  color: ${({ theme }) => theme.colors.text.secondary};
`;

export {
  StyledHelpAnchor,
  StyledHelpBody,
  StyledHelpButton,
  StyledHelpList,
  StyledHelpListItem,
  StyledLabelRow,
  StyledLabelText,
};
