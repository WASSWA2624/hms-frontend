/**
 * UserSessionDetailScreen - Web
 * File: UserSessionDetailScreen.web.jsx
 */
import React from 'react';
import {
  Button,
  Card,
  EmptyState,
  ErrorState,
  ErrorStateSizes,
  LoadingSpinner,
  OfflineState,
  OfflineStateSizes,
  Text,
} from '@platform/components';
import { useI18n } from '@hooks';
import { formatDateTime } from '@utils';
import {
  StyledContainer,
  StyledContent,
  StyledDetailGrid,
  StyledDetailItem,
  StyledInlineStates,
  StyledActions,
} from './UserSessionDetailScreen.web.styles';
import useUserSessionDetailScreen from './useUserSessionDetailScreen';

const UserSessionDetailScreenWeb = () => {
  const { t, locale } = useI18n();
  const {
    session,
    sessionLabel,
    userLabel,
    statusLabel,
    isLoading,
    hasError,
    errorMessage,
    isOffline,
    canViewTechnicalIds,
    onRetry,
    onBack,
  } = useUserSessionDetailScreen();

  const hasSession = Boolean(session);

  if (isLoading && !hasSession) {
    return (
      <StyledContainer role="main" aria-label={t('userSession.detail.title')}>
        <StyledContent>
          <LoadingSpinner
            accessibilityLabel={t('common.loading')}
            testID="user-session-detail-loading"
          />
        </StyledContent>
      </StyledContainer>
    );
  }

  if (isOffline && !hasSession) {
    return (
      <StyledContainer role="main" aria-label={t('userSession.detail.title')}>
        <StyledContent>
          <OfflineState
            size={OfflineStateSizes.SMALL}
            title={t('shell.banners.offline.title')}
            description={t('shell.banners.offline.message')}
            action={(
              <Button
                variant="surface"
                size="small"
                onPress={onRetry}
                accessibilityLabel={t('common.retry')}
                accessibilityHint={t('common.retryHint')}
              >
                {t('common.retry')}
              </Button>
            )}
            testID="user-session-detail-offline"
          />
        </StyledContent>
      </StyledContainer>
    );
  }

  if (hasError && !hasSession) {
    return (
      <StyledContainer role="main" aria-label={t('userSession.detail.title')}>
        <StyledContent>
          <ErrorState
            title={t('userSession.detail.errorTitle')}
            description={errorMessage}
            action={(
              <Button
                variant="surface"
                size="small"
                onPress={onRetry}
                accessibilityLabel={t('common.retry')}
                accessibilityHint={t('common.retryHint')}
              >
                {t('common.retry')}
              </Button>
            )}
            testID="user-session-detail-error"
          />
        </StyledContent>
      </StyledContainer>
    );
  }

  if (!session) {
    return (
      <StyledContainer role="main" aria-label={t('userSession.detail.title')}>
        <StyledContent>
          <EmptyState
            title={t('userSession.detail.notFoundTitle')}
            description={t('userSession.detail.notFoundMessage')}
            testID="user-session-detail-not-found"
          />
          <StyledActions>
            <Button
              variant="surface"
              size="small"
              onPress={onBack}
              accessibilityLabel={t('common.back')}
              accessibilityHint={t('userSession.detail.backHint')}
              testID="user-session-detail-back"
            >
              {t('common.back')}
            </Button>
          </StyledActions>
        </StyledContent>
      </StyledContainer>
    );
  }

  const startedAt = formatDateTime(session.created_at, locale);
  const expiresAt = formatDateTime(session.expires_at, locale);
  const revokedAt = formatDateTime(session.revoked_at, locale);

  const retryAction = onRetry ? (
    <Button
      variant="surface"
      size="small"
      onPress={onRetry}
      accessibilityLabel={t('common.retry')}
      accessibilityHint={t('common.retryHint')}
    >
      {t('common.retry')}
    </Button>
  ) : undefined;

  const showInlineError = hasSession && hasError;
  const showInlineOffline = hasSession && isOffline;

  return (
    <StyledContainer role="main" aria-label={t('userSession.detail.title')}>
      <StyledContent>
        <StyledInlineStates>
          {showInlineError ? (
            <ErrorState
              size={ErrorStateSizes.SMALL}
              title={t('userSession.detail.errorTitle')}
              description={errorMessage}
              action={retryAction}
              testID="user-session-detail-error-banner"
            />
          ) : null}
          {showInlineOffline ? (
            <OfflineState
              size={OfflineStateSizes.SMALL}
              title={t('shell.banners.offline.title')}
              description={t('shell.banners.offline.message')}
              action={retryAction}
              testID="user-session-detail-offline-banner"
            />
          ) : null}
        </StyledInlineStates>
        <Card variant="outlined" accessibilityLabel={t('userSession.detail.title')} testID="user-session-detail-card">
          <StyledDetailGrid>
            {canViewTechnicalIds ? (
              <StyledDetailItem>
                <Text variant="label">{t('userSession.detail.idLabel')}</Text>
                <Text variant="body" testID="user-session-detail-id">
                  {session.id}
                </Text>
              </StyledDetailItem>
            ) : null}
            {sessionLabel ? (
              <StyledDetailItem>
                <Text variant="label">{t('userSession.detail.sessionLabel')}</Text>
                <Text variant="body" testID="user-session-detail-session">
                  {sessionLabel}
                </Text>
              </StyledDetailItem>
            ) : null}
            {userLabel ? (
              <StyledDetailItem>
                <Text variant="label">{t('userSession.detail.userLabel')}</Text>
                <Text variant="body" testID="user-session-detail-user">
                  {userLabel}
                </Text>
              </StyledDetailItem>
            ) : null}
            <StyledDetailItem>
              <Text variant="label">{t('userSession.detail.statusLabel')}</Text>
              <Text variant="body" testID="user-session-detail-status">
                {statusLabel}
              </Text>
            </StyledDetailItem>
            {startedAt ? (
              <StyledDetailItem>
                <Text variant="label">{t('userSession.detail.startedLabel')}</Text>
                <Text variant="body" testID="user-session-detail-started">
                  {startedAt}
                </Text>
              </StyledDetailItem>
            ) : null}
            {expiresAt ? (
              <StyledDetailItem>
                <Text variant="label">{t('userSession.detail.expiresLabel')}</Text>
                <Text variant="body" testID="user-session-detail-expires">
                  {expiresAt}
                </Text>
              </StyledDetailItem>
            ) : null}
            {revokedAt ? (
              <StyledDetailItem>
                <Text variant="label">{t('userSession.detail.revokedLabel')}</Text>
                <Text variant="body" testID="user-session-detail-revoked">
                  {revokedAt}
                </Text>
              </StyledDetailItem>
            ) : null}
          </StyledDetailGrid>
        </Card>
        <StyledActions>
          <Button
            variant="surface"
            size="small"
            onPress={onBack}
            accessibilityLabel={t('common.back')}
            accessibilityHint={t('userSession.detail.backHint')}
            testID="user-session-detail-back"
            disabled={isLoading}
          >
            {t('common.back')}
          </Button>
        </StyledActions>
      </StyledContent>
    </StyledContainer>
  );
};

export default UserSessionDetailScreenWeb;

