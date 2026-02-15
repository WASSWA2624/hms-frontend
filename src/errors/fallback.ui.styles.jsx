import styled from 'styled-components/native';

const Container = styled.View`
  flex: 1;
  align-items: center;
  justify-content: center;
  background-color: ${({ theme }) => theme.colors.background.primary};
  padding: ${({ theme }) => theme.spacing.lg}px;
`;

const Content = styled.View`
  align-items: center;
  width: 100%;
  max-width: 420px;
`;

const Title = styled.Text`
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: ${({ theme }) => theme.typography.fontSize.xl}px;
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  text-align: center;
  margin-bottom: ${({ theme }) => theme.spacing.sm}px;
`;

const Message = styled.Text`
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: ${({ theme }) => theme.typography.fontSize.md}px;
  text-align: center;
  margin-bottom: ${({ theme }) => theme.spacing.md}px;
`;

const RetryButton = styled.Pressable`
  align-items: center;
  justify-content: center;
  min-height: ${({ theme }) => theme.spacing.xxl - theme.spacing.xs}px;
  min-width: ${({ theme }) => theme.spacing.xxl - theme.spacing.xs}px;
  padding-vertical: ${({ theme }) => theme.spacing.sm}px;
  padding-horizontal: ${({ theme }) => theme.spacing.lg}px;
  background-color: ${({ theme }) => theme.colors.primary};
  border-radius: ${({ theme }) => theme.radius.sm}px;
`;

const RetryText = styled.Text`
  color: ${({ theme }) => theme.colors.onPrimary};
  font-size: ${({ theme }) => theme.typography.fontSize.md}px;
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
`;

export { Container, Content, Title, Message, RetryButton, RetryText };
