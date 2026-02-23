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
  min-width: 44px;
  min-height: 44px;
  width: 44px;
  height: 44px;
  border-radius: ${({ theme }) => theme.radius.full}px;
  align-items: center;
  justify-content: center;
  border-width: 1px;
  border-color: ${({ theme }) => theme.colors.border.medium};
  background-color: ${({ theme }) => theme.colors.background.surface};
`;

const StyledHelpBody = styled(Text)`
  margin-top: ${({ theme }) => theme.spacing.sm}px;
`;

const StyledHelpList = styled.View`
  margin-top: ${({ theme }) => theme.spacing.md}px;
  gap: ${({ theme }) => theme.spacing.xs}px;
`;

const StyledHelpListItem = styled(Text)`
  font-size: ${({ theme }) => theme.typography.fontSize.xs}px;
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
