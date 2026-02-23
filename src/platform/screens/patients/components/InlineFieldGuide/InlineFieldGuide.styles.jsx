import styled from 'styled-components/native';
import { Text } from '@platform/components';

const StyledGuideText = styled(Text)`
  margin-top: ${({ theme }) => theme.spacing.xs}px;
  margin-bottom: ${({ theme }) => theme.spacing.xs}px;
  color: ${({ theme }) => theme.colors.text.secondary};
`;

export { StyledGuideText };
