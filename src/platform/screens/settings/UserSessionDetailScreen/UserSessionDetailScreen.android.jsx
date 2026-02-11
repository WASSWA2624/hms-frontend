/**
 * UserSessionDetailScreen - Android
 * File: UserSessionDetailScreen.android.jsx
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
  Snackbar,
  Text,
} from '@platform/components';
import { useI18n } from '@hooks';
import { formatDateTime } from '@utils';
import {
  StyledContainer,
  StyledContent,
  StyledInlineStates,
  StyledDetailGrid,
  StyledDetailItem,
  StyledActions,
} from './UserSessionDetailScreen.android.styles';
import useUserSessionDetailScreen from './useUserSessionDetailScreen';

const UserSessionDetailScreenAndroid = () => {
  const { t, locale } = useI18n();
  const {
    session,
    isLoading,
    hasError,
    errorMessage,
    isOffline,
    noticeMessage,
    onDismissNotice,
    onRetry,
    onBack,
    onRevoke,
  } = useUserSessionDetailScreen();
  const hasSession = Boolean(session);

  const retryAction = onRetry ? (
    <Button
      variant="surface"
      size="small"
      onPress={onRetry}
      accessibilityLabel={t('common.retry')}
      accessibilityHint={t('common.retryHint')}
      testID="user-session-detail-retry"
    >
      {t('common.retry')}
    </Button>
  ) : undefined;
  const showInlineError = hasSession && hasError;
  const showInlineOffline = hasSession && isOffline;

  if (isLoading && !hasSession) {
    return (
      <StyledContainer accessibilityRole="main" accessibilityLabel={t('userSession.detail.title')}>
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
      <StyledContainer accessibilityRole="main" accessibilityLabel={t('userSession.detail.title')}>
        <StyledContent>
          <OfflineState
            size={OfflineStateSizes.SMALL}
            title={t('shell.banners.offline.title')}
            description={t('shell.banners.offline.message')}
            action={retryAction}
            testID="user-session-detail-offline"
          />
        </StyledContent>
      </StyledContainer>
    );
  }

  if (hasError && !hasSession) {
    return (
      <StyledContainer accessibilityRole="main" accessibilityLabel={t('userSession.detail.title')}>
        <StyledContent>
          <ErrorState
            title={t('userSession.detail.errorTitle')}
            description={errorMessage}
            action={retryAction}
            testID="user-session-detail-error"
          />
        </StyledContent>
      </StyledContainer>
    );
  }

  if (!session) {
    return (
      <StyledContainer accessibilityRole="main" accessibilityLabel={t('userSession.detail.title')}>
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
              testID="user-session-detail-back"
            >
              {t('common.back')}
            </Button>
          </StyledActions>
        </StyledContent>
      </StyledContainer>
    );
  }

  const createdAt = formatDateTime(session.created_at, locale);
  const expiresAt = formatDateTime(session.expires_at, locale);
  const revokedAt = formatDateTime(session.revoked_at, locale);
  const email = session?.user?.email ?? '';

  return (
    <StyledContainer accessibilityRole="main" accessibilityLabel={t('userSession.detail.title')}>
      {noticeMessage ? (
        <Snackbar
          visible={Boolean(noticeMessage)}
          message={noticeMessage}
          variant="error"
          position="bottom"
          onDismiss={onDismissNotice}
          testID="user-session-detail-notice"
        />
      ) : null}
      <StyledContent>
        <StyledInlineStates>
          {showInlineError && (
            <ErrorState
              size={ErrorStateSizes.SMALL}
              title={t('userSession.detail.errorTitle')}
              description={errorMessage}
              action={retryAction}
              testID="user-session-detail-error-banner"
            />
          )}
          {showInlineOffline && (
            <OfflineState
              size={OfflineStateSizes.SMALL}
              title={t('shell.banners.offline.title')}
              description={t('shell.banners.offline.message')}
              action={retryAction}
              testID="user-session-detail-offline-banner"
            />
          )}
        </StyledInlineStates>
        <Text variant="h1" accessibilityRole="header" testID="user-session-detail-title">
          {t('userSession.detail.title')}
        </Text>
        <Card variant="outlined" accessibilityLabel={t('userSession.detail.title')} testID="user-session-detail-card">
          <StyledDetailGrid>
            <StyledDetailItem>
              <Text variant="label">{t('userSession.detail.idLabel')}</Text>
              <Text variant="body" testID="user-session-detail-id">
                {session.id}
              </Text>
            </StyledDetailItem>
            {email ? (
              <StyledDetailItem>
                <Text variant="label">{t('userSession.detail.emailLabel')}</Text>
                <Text variant="body" testID="user-session-detail-email">
                  {email}
                </Text>
              </StyledDetailItem>
            ) : null}
            {createdAt ? (
              <StyledDetailItem>
                <Text variant="label">{t('userSession.detail.createdLabel')}</Text>
                <Text variant="body" testID="user-session-detail-created">
                  {createdAt}
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
          {!session.revoked_at ? (
            <Button
              variant="surface"
              size="small"
              onPress={onRevoke}
              loading={isLoading}
              accessibilityLabel={t('userSession.detail.revoke')}
              accessibilityHint={t('userSession.detail.revokeHint')}
              testID="user-session-detail-revoke"
            >
              {t('common.remove')}
            </Button>
          ) : null}
        </StyledActions>
      </StyledContent>
    </StyledContainer>
  );
};

export default UserSessionDetailScreenAndroid;
