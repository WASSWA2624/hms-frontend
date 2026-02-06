/**
 * Fallback UI Component - Native (iOS/Android)
 * Generic error fallback (minimal, theme-driven). Uses styled-components/native.
 * Per theme-design.mdc: *.ios/android → styled-components/native. Per component-structure.mdc: .withConfig.
 */
import React from 'react';
import styled from 'styled-components/native';
import en from '@i18n/locales/en.json';

const getNestedValue = (obj, path) =>
  String(path)
    .split('.')
    .reduce((cur, key) => (cur && cur[key] !== undefined ? cur[key] : undefined), obj);
const getText = (key, fallback) => getNestedValue(en, key) || fallback;

const Container = styled.View.withConfig({
  displayName: 'FallbackUI_Container',
  componentId: 'FallbackUI_Container',
})`
  flex: 1;
  align-items: center;
  justify-content: center;
  padding: ${({ theme }) => theme?.spacing?.lg ?? 24}px;
  background-color: ${({ theme }) => theme?.colors?.background?.primary ?? '#FFFFFF'};
`;

const Title = styled.Text.withConfig({
  displayName: 'FallbackUI_Title',
  componentId: 'FallbackUI_Title',
})`
  font-size: ${({ theme }) => theme?.typography?.fontSize?.lg ?? 20}px;
  color: ${({ theme }) => theme?.colors?.textPrimary ?? theme?.colors?.text?.primary ?? '#000000'};
  margin-bottom: ${({ theme }) => theme?.spacing?.sm ?? 8}px;
  text-align: center;
`;

const Message = styled.Text.withConfig({
  displayName: 'FallbackUI_Message',
  componentId: 'FallbackUI_Message',
})`
  font-size: ${({ theme }) => theme?.typography?.fontSize?.sm ?? 14}px;
  color: ${({ theme }) => theme?.colors?.textSecondary ?? theme?.colors?.text?.secondary ?? '#3C3C43'};
  margin-bottom: ${({ theme }) => theme?.spacing?.md ?? 16}px;
  text-align: center;
`;

const RetryButton = styled.Pressable.withConfig({
  displayName: 'FallbackUI_RetryButton',
  componentId: 'FallbackUI_RetryButton',
})`
  background-color: ${({ theme }) => theme?.colors?.primary ?? '#0078D4'};
  padding: ${({ theme }) => theme?.spacing?.sm ?? 8}px ${({ theme }) => theme?.spacing?.lg ?? 24}px;
  border-radius: ${({ theme }) => theme?.radius?.sm ?? 4}px;
`;

const RetryText = styled.Text.withConfig({
  displayName: 'FallbackUI_RetryText',
  componentId: 'FallbackUI_RetryText',
})`
  color: ${({ theme }) => theme?.colors?.onPrimary ?? '#FFFFFF'};
`;

const FallbackUI = ({ error, onRetry }) => {
  const title = getText('errors.fallback.title', 'Something went wrong');
  const message =
    error?.safeMessage ||
    getText('errors.fallback.message', 'An unexpected error occurred');
  const retry = getText('errors.fallback.retry', 'Retry');
  const retryHint = getText('errors.fallback.retryHint', 'Try again');

  return (
    <Container>
      <Title accessibilityRole="header">{title}</Title>
      <Message>{message}</Message>
      {onRetry && (
        <RetryButton
          onPress={onRetry}
          accessibilityRole="button"
          accessibilityLabel={retry}
          accessibilityHint={retryHint}
        >
          <RetryText>{retry}</RetryText>
        </RetryButton>
      )}
    </Container>
  );
};

export default FallbackUI;
