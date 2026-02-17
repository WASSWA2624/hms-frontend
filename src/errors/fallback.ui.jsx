import React from 'react';
import { tSync } from '@i18n';
import {
  Container,
  Content,
  Title,
  Message,
  RetryButton,
  RetryText,
} from './fallback.ui.styles';

const FallbackUI = ({ error, onRetry }) => {
  const title = tSync('errors.fallback.title');
  const safeMessage = error?.safeMessage || tSync('errors.fallback.message');
  const retryLabel = tSync('errors.fallback.retry');
  const retryHint = tSync('errors.fallback.retryHint');

  return (
    <Container>
      <Content>
        <Title accessibilityRole="header">{title}</Title>
        <Message accessibilityRole="alert">{safeMessage}</Message>
        {typeof onRetry === 'function' ? (
          <RetryButton
            onPress={onRetry}
            accessibilityRole="button"
            accessibilityLabel={retryLabel}
            accessibilityHint={retryHint}
          >
            <RetryText>{retryLabel}</RetryText>
          </RetryButton>
        ) : null}
      </Content>
    </Container>
  );
};

export default FallbackUI;
