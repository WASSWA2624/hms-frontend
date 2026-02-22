import styled from 'styled-components/native';

const Container = styled.View`
  flex: 1;
  align-items: center;
  justify-content: center;
  background-color: ${({ theme }) => theme?.colors?.background?.primary || '#FFFFFF'};
  padding: ${({ theme }) => theme?.spacing?.lg ?? 16}px;
`;

const Content = styled.View`
  align-items: center;
  width: 100%;
  max-width: 420px;
`;

const Title = styled.Text`
  color: ${({ theme }) => theme?.colors?.text?.primary || '#000000'};
  font-size: ${({ theme }) => theme?.typography?.fontSize?.xl ?? 24}px;
  font-weight: ${({ theme }) => theme?.typography?.fontWeight?.semibold || '600'};
  text-align: center;
  margin-bottom: ${({ theme }) => theme?.spacing?.sm ?? 8}px;
`;

const Message = styled.Text`
  color: ${({ theme }) => theme?.colors?.text?.secondary || '#3C3C43'};
  font-size: ${({ theme }) => theme?.typography?.fontSize?.md ?? 16}px;
  text-align: center;
  margin-bottom: ${({ theme }) => theme?.spacing?.md ?? 12}px;
`;

const RetryButton = styled.Pressable`
  align-items: center;
  justify-content: center;
  min-height: ${({ theme }) => (theme?.spacing?.xxl ?? 40) - (theme?.spacing?.xs ?? 4)}px;
  min-width: ${({ theme }) => (theme?.spacing?.xxl ?? 40) - (theme?.spacing?.xs ?? 4)}px;
  padding-vertical: ${({ theme }) => theme?.spacing?.sm ?? 8}px;
  padding-horizontal: ${({ theme }) => theme?.spacing?.lg ?? 16}px;
  background-color: ${({ theme }) => theme?.colors?.primary || '#0078D4'};
  border-radius: ${({ theme }) => theme?.radius?.sm ?? 6}px;
`;

const RetryText = styled.Text`
  color: ${({ theme }) => theme?.colors?.onPrimary || '#FFFFFF'};
  font-size: ${({ theme }) => theme?.typography?.fontSize?.md ?? 16}px;
  font-weight: ${({ theme }) => theme?.typography?.fontWeight?.medium || '500'};
`;

export { Container, Content, Title, Message, RetryButton, RetryText };
