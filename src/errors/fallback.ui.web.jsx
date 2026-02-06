/**
 * Fallback UI Component - Web
 * Generic error fallback (minimal, theme-driven). Uses styled-components (not /native).
 * Per theme-design.mdc: *.web → styled-components. Per component-structure.mdc: .withConfig.
 */
import React from 'react';
import styled from 'styled-components';
import en from '@i18n/locales/en.json';

const getNestedValue = (obj, path) =>
  String(path)
    .split('.')
    .reduce((cur, key) => (cur && cur[key] !== undefined ? cur[key] : undefined), obj);
const getText = (key, fallback) => getNestedValue(en, key) || fallback;

const Container = styled.div.withConfig({
  displayName: 'FallbackUI_Container',
  componentId: 'FallbackUI_Container',
})`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: ${({ theme }) => theme?.spacing?.lg ?? 24}px;
  background-color: ${({ theme }) => theme?.colors?.background?.primary ?? '#FFFFFF'};
`;

const Title = styled.h1.withConfig({
  displayName: 'FallbackUI_Title',
  componentId: 'FallbackUI_Title',
})`
  font-size: ${({ theme }) => theme?.typography?.fontSize?.lg ?? 20}px;
  color: ${({ theme }) => theme?.colors?.textPrimary ?? theme?.colors?.text?.primary ?? '#000000'};
  margin: 0 0 ${({ theme }) => theme?.spacing?.sm ?? 8}px 0;
  text-align: center;
`;

const Message = styled.p.withConfig({
  displayName: 'FallbackUI_Message',
  componentId: 'FallbackUI_Message',
})`
  font-size: ${({ theme }) => theme?.typography?.fontSize?.sm ?? 14}px;
  color: ${({ theme }) => theme?.colors?.textSecondary ?? theme?.colors?.text?.secondary ?? '#3C3C43'};
  margin: 0 0 ${({ theme }) => theme?.spacing?.md ?? 16}px 0;
  text-align: center;
`;

const RetryButton = styled.button.withConfig({
  displayName: 'FallbackUI_RetryButton',
  componentId: 'FallbackUI_RetryButton',
})`
  background-color: ${({ theme }) => theme?.colors?.primary ?? '#0078D4'};
  color: ${({ theme }) => theme?.colors?.onPrimary ?? '#FFFFFF'};
  padding: ${({ theme }) => theme?.spacing?.sm ?? 8}px ${({ theme }) => theme?.spacing?.lg ?? 24}px;
  border-radius: ${({ theme }) => theme?.radius?.sm ?? 4}px;
  border: none;
  cursor: pointer;
  font-size: inherit;
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
      <Title role="heading" aria-level={1}>{title}</Title>
      <Message>{message}</Message>
      {onRetry && (
        <RetryButton
          type="button"
          onClick={onRetry}
          aria-label={retry}
          title={retryHint}
        >
          {retry}
        </RetryButton>
      )}
    </Container>
  );
};

export default FallbackUI;
