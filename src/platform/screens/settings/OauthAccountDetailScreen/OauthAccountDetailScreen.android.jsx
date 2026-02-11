/**
 * OauthAccountDetailScreen - Android
 * File: OauthAccountDetailScreen.android.jsx
 */
import React from 'react';
import {
  Button,
  Card,
  EmptyState,
  ErrorState,
  ErrorStateSizes,
  Icon,
  LoadingSpinner,
  OfflineState,
  OfflineStateSizes,
  Text,
} from '@platform/components';
import { useI18n } from '@hooks';
import { formatDateTime } from '@utils';
import {
  StyledActions,
  StyledContainer,
  StyledContent,
  StyledDetailGrid,
  StyledDetailItem,
  StyledInlineStates,
} from './OauthAccountDetailScreen.android.styles';
import useOauthAccountDetailScreen from './useOauthAccountDetailScreen';

const OauthAccountDetailScreenAndroid = () => {
  const { t, locale } = useI18n();
  const {
    oauthAccount,
    isLoading,
    hasError,
    errorMessage,
    isOffline,
    onRetry,
    onBack,
    onEdit,
    onDelete,
  } = useOauthAccountDetailScreen();

  const hasOauthAccount = Boolean(oauthAccount);

  if (isLoading && !hasOauthAccount) {
    return (
      <StyledContainer>
        <StyledContent>
          <LoadingSpinner
            accessibilityLabel={t('common.loading')}
            testID="oauth-account-detail-loading"
          />
        </StyledContent>
      </StyledContainer>
    );
  }

  if (isOffline && !hasOauthAccount) {
    return (
      <StyledContainer>
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
                icon={<Icon glyph="↻" size="xs" decorative />}
              >
                {t('common.retry')}
              </Button>
            )}
            testID="oauth-account-detail-offline"
          />
        </StyledContent>
      </StyledContainer>
    );
  }

  if (hasError && !hasOauthAccount) {
    return (
      <StyledContainer>
        <StyledContent>
          <ErrorState
            title={t('oauthAccount.detail.errorTitle')}
            description={errorMessage}
            action={(
              <Button
                variant="surface"
                size="small"
                onPress={onRetry}
                accessibilityLabel={t('common.retry')}
                accessibilityHint={t('common.retryHint')}
                icon={<Icon glyph="↻" size="xs" decorative />}
              >
                {t('common.retry')}
              </Button>
            )}
            testID="oauth-account-detail-error"
          />
        </StyledContent>
      </StyledContainer>
    );
  }

  if (!oauthAccount) {
    return (
      <StyledContainer>
        <StyledContent>
          <EmptyState
            title={t('oauthAccount.detail.notFoundTitle')}
            description={t('oauthAccount.detail.notFoundMessage')}
            testID="oauth-account-detail-not-found"
          />
          <StyledActions>
            <Button
              variant="surface"
              size="small"
              onPress={onBack}
              accessibilityLabel={t('common.back')}
              accessibilityHint={t('oauthAccount.detail.backHint')}
              icon={<Icon glyph="←" size="xs" decorative />}
              testID="oauth-account-detail-back"
            >
              {t('common.back')}
            </Button>
          </StyledActions>
        </StyledContent>
      </StyledContainer>
    );
  }

  const createdAt = formatDateTime(oauthAccount.created_at, locale);
  const updatedAt = formatDateTime(oauthAccount.updated_at, locale);
  const expiresAt = formatDateTime(oauthAccount.expires_at, locale);
  const userId = oauthAccount?.user_id ?? '';
  const provider = oauthAccount?.provider ?? '';
  const providerUserId = oauthAccount?.provider_user_id ?? '';
  const retryAction = onRetry ? (
    <Button
      variant="surface"
      size="small"
      onPress={onRetry}
      accessibilityLabel={t('common.retry')}
      accessibilityHint={t('common.retryHint')}
      icon={<Icon glyph="↻" size="xs" decorative />}
    >
      {t('common.retry')}
    </Button>
  ) : undefined;
  const showInlineError = hasOauthAccount && hasError;
  const showInlineOffline = hasOauthAccount && isOffline;

  return (
    <StyledContainer>
      <StyledContent>
        <StyledInlineStates>
          {showInlineError && (
            <ErrorState
              size={ErrorStateSizes.SMALL}
              title={t('oauthAccount.detail.errorTitle')}
              description={errorMessage}
              action={retryAction}
              testID="oauth-account-detail-error-banner"
            />
          )}
          {showInlineOffline && (
            <OfflineState
              size={OfflineStateSizes.SMALL}
              title={t('shell.banners.offline.title')}
              description={t('shell.banners.offline.message')}
              action={retryAction}
              testID="oauth-account-detail-offline-banner"
            />
          )}
        </StyledInlineStates>
        <Card variant="outlined" accessibilityLabel={t('oauthAccount.detail.title')} testID="oauth-account-detail-card">
          <StyledDetailGrid>
            <StyledDetailItem>
              <Text variant="label">{t('oauthAccount.detail.idLabel')}</Text>
              <Text variant="body" testID="oauth-account-detail-id">
                {oauthAccount.id}
              </Text>
            </StyledDetailItem>
            {userId ? (
              <StyledDetailItem>
                <Text variant="label">{t('oauthAccount.detail.userIdLabel')}</Text>
                <Text variant="body" testID="oauth-account-detail-user">
                  {userId}
                </Text>
              </StyledDetailItem>
            ) : null}
            {provider ? (
              <StyledDetailItem>
                <Text variant="label">{t('oauthAccount.detail.providerLabel')}</Text>
                <Text variant="body" testID="oauth-account-detail-provider">
                  {provider}
                </Text>
              </StyledDetailItem>
            ) : null}
            {providerUserId ? (
              <StyledDetailItem>
                <Text variant="label">{t('oauthAccount.detail.providerUserIdLabel')}</Text>
                <Text variant="body" testID="oauth-account-detail-provider-user-id">
                  {providerUserId}
                </Text>
              </StyledDetailItem>
            ) : null}
            {expiresAt ? (
              <StyledDetailItem>
                <Text variant="label">{t('oauthAccount.detail.expiresAtLabel')}</Text>
                <Text variant="body" testID="oauth-account-detail-expires-at">
                  {expiresAt}
                </Text>
              </StyledDetailItem>
            ) : null}
            {createdAt ? (
              <StyledDetailItem>
                <Text variant="label">{t('oauthAccount.detail.createdLabel')}</Text>
                <Text variant="body" testID="oauth-account-detail-created">
                  {createdAt}
                </Text>
              </StyledDetailItem>
            ) : null}
            {updatedAt ? (
              <StyledDetailItem>
                <Text variant="label">{t('oauthAccount.detail.updatedLabel')}</Text>
                <Text variant="body" testID="oauth-account-detail-updated">
                  {updatedAt}
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
            accessibilityHint={t('oauthAccount.detail.backHint')}
            icon={<Icon glyph="←" size="xs" decorative />}
            testID="oauth-account-detail-back"
            disabled={isLoading}
          >
            {t('common.back')}
          </Button>
          {onEdit && (
            <Button
              variant="surface"
              size="small"
              onPress={onEdit}
              accessibilityLabel={t('oauthAccount.detail.edit')}
              accessibilityHint={t('oauthAccount.detail.editHint')}
              icon={<Icon glyph="✎" size="xs" decorative />}
              testID="oauth-account-detail-edit"
              disabled={isLoading}
            >
              {t('oauthAccount.detail.edit')}
            </Button>
          )}
          <Button
            variant="surface"
            size="small"
            onPress={onDelete}
            loading={isLoading}
            accessibilityLabel={t('oauthAccount.detail.delete')}
            accessibilityHint={t('oauthAccount.detail.deleteHint')}
            icon={<Icon glyph="✕" size="xs" decorative />}
            testID="oauth-account-detail-delete"
          >
            {t('common.remove')}
          </Button>
        </StyledActions>
      </StyledContent>
    </StyledContainer>
  );
};

export default OauthAccountDetailScreenAndroid;
