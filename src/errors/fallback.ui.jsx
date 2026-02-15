import React from 'react';
import useI18n from '@hooks/useI18n';
import {
  Container,
  Content,
  Title,
  Message,
  RetryButton,
  RetryText,
} from './fallback.ui.styles';

const FallbackUI = ({ error, onRetry }) => {
  const { t } = useI18n();

  const title = t('errors.fallback.title');
  const safeMessage = error?.safeMessage || t('errors.fallback.message');
  const retryLabel = t('errors.fallback.retry');
  const retryHint = t('errors.fallback.retryHint');

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
