/**
 * UserMfaDetailScreen - iOS
 * File: UserMfaDetailScreen.ios.jsx
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
  StyledContainer,
  StyledContent,
  StyledDetailGrid,
  StyledDetailItem,
  StyledInlineStates,
  StyledActions,
} from './UserMfaDetailScreen.ios.styles';
import useUserMfaDetailScreen from './useUserMfaDetailScreen';

const UserMfaDetailScreenIOS = () => {
  const { t, locale } = useI18n();
  const {
    userMfa,
    mfaLabel,
    userLabel,
    isLoading,
    hasError,
    errorMessage,
    isOffline,
    onRetry,
    onBack,
    onEdit,
    onDelete,
  } = useUserMfaDetailScreen();

  const hasUserMfa = Boolean(userMfa);

  if (isLoading && !hasUserMfa) {
    return (
      <StyledContainer>
        <StyledContent>
          <LoadingSpinner
            accessibilityLabel={t('common.loading')}
            testID="user-mfa-detail-loading"
          />
        </StyledContent>
      </StyledContainer>
    );
  }

  if (isOffline && !hasUserMfa) {
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
                icon={<Icon glyph="R" size="xs" decorative />}
              >
                {t('common.retry')}
              </Button>
            )}
            testID="user-mfa-detail-offline"
          />
        </StyledContent>
      </StyledContainer>
    );
  }

  if (hasError && !hasUserMfa) {
    return (
      <StyledContainer>
        <StyledContent>
          <ErrorState
            title={t('userMfa.detail.errorTitle')}
            description={errorMessage}
            action={(
              <Button
                variant="surface"
                size="small"
                onPress={onRetry}
                accessibilityLabel={t('common.retry')}
                accessibilityHint={t('common.retryHint')}
                icon={<Icon glyph="R" size="xs" decorative />}
              >
                {t('common.retry')}
              </Button>
            )}
            testID="user-mfa-detail-error"
          />
        </StyledContent>
      </StyledContainer>
    );
  }

  if (!userMfa) {
    return (
      <StyledContainer>
        <StyledContent>
          <EmptyState
            title={t('userMfa.detail.notFoundTitle')}
            description={t('userMfa.detail.notFoundMessage')}
            testID="user-mfa-detail-not-found"
          />
          <StyledActions>
            <Button
              variant="surface"
              size="small"
              onPress={onBack}
              accessibilityLabel={t('common.back')}
              accessibilityHint={t('userMfa.detail.backHint')}
              icon={<Icon glyph="<" size="xs" decorative />}
              testID="user-mfa-detail-back"
            >
              {t('common.back')}
            </Button>
          </StyledActions>
        </StyledContent>
      </StyledContainer>
    );
  }

  const createdAt = formatDateTime(userMfa.created_at, locale);
  const updatedAt = formatDateTime(userMfa.updated_at, locale);
  const lastUsedAt = formatDateTime(userMfa.last_used_at, locale);
  const channel = userMfa?.channel ?? '';
  const isEnabled = userMfa?.is_enabled ?? false;
  const channelKey = channel ? `userMfa.channel.${channel}` : '';
  const resolvedChannel = channelKey ? t(channelKey) : '';
  const channelLabel = resolvedChannel === channelKey ? channel : resolvedChannel;
  const retryAction = onRetry ? (
    <Button
      variant="surface"
      size="small"
      onPress={onRetry}
      accessibilityLabel={t('common.retry')}
      accessibilityHint={t('common.retryHint')}
      icon={<Icon glyph="R" size="xs" decorative />}
    >
      {t('common.retry')}
    </Button>
  ) : undefined;
  const showInlineError = hasUserMfa && hasError;
  const showInlineOffline = hasUserMfa && isOffline;

  return (
    <StyledContainer>
      <StyledContent>
        <StyledInlineStates>
          {showInlineError && (
            <ErrorState
              size={ErrorStateSizes.SMALL}
              title={t('userMfa.detail.errorTitle')}
              description={errorMessage}
              action={retryAction}
              testID="user-mfa-detail-error-banner"
            />
          )}
          {showInlineOffline && (
            <OfflineState
              size={OfflineStateSizes.SMALL}
              title={t('shell.banners.offline.title')}
              description={t('shell.banners.offline.message')}
              action={retryAction}
              testID="user-mfa-detail-offline-banner"
            />
          )}
        </StyledInlineStates>
        <Card variant="outlined" accessibilityLabel={t('userMfa.detail.title')} testID="user-mfa-detail-card">
          <StyledDetailGrid>
            {mfaLabel ? (
              <StyledDetailItem>
                <Text variant="label">{t('userMfa.detail.idLabel')}</Text>
                <Text variant="body" testID="user-mfa-detail-id">
                  {mfaLabel}
                </Text>
              </StyledDetailItem>
            ) : null}
            {userLabel ? (
              <StyledDetailItem>
                <Text variant="label">{t('userMfa.detail.userIdLabel')}</Text>
                <Text variant="body" testID="user-mfa-detail-user">
                  {userLabel}
                </Text>
              </StyledDetailItem>
            ) : null}
            {channelLabel ? (
              <StyledDetailItem>
                <Text variant="label">{t('userMfa.detail.channelLabel')}</Text>
                <Text variant="body" testID="user-mfa-detail-channel">
                  {channelLabel}
                </Text>
              </StyledDetailItem>
            ) : null}
            <StyledDetailItem>
              <Text variant="label">{t('userMfa.detail.enabledLabel')}</Text>
              <Text variant="body" testID="user-mfa-detail-enabled">
                {isEnabled ? t('common.on') : t('common.off')}
              </Text>
            </StyledDetailItem>
            {lastUsedAt ? (
              <StyledDetailItem>
                <Text variant="label">{t('userMfa.detail.lastUsedLabel')}</Text>
                <Text variant="body" testID="user-mfa-detail-last-used">
                  {lastUsedAt}
                </Text>
              </StyledDetailItem>
            ) : null}
            {createdAt ? (
              <StyledDetailItem>
                <Text variant="label">{t('userMfa.detail.createdLabel')}</Text>
                <Text variant="body" testID="user-mfa-detail-created">
                  {createdAt}
                </Text>
              </StyledDetailItem>
            ) : null}
            {updatedAt ? (
              <StyledDetailItem>
                <Text variant="label">{t('userMfa.detail.updatedLabel')}</Text>
                <Text variant="body" testID="user-mfa-detail-updated">
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
            accessibilityHint={t('userMfa.detail.backHint')}
            icon={<Icon glyph="<" size="xs" decorative />}
            testID="user-mfa-detail-back"
            disabled={isLoading}
          >
            {t('common.back')}
          </Button>
          {onEdit && (
            <Button
              variant="surface"
              size="small"
              onPress={onEdit}
              accessibilityLabel={t('userMfa.detail.edit')}
              accessibilityHint={t('userMfa.detail.editHint')}
              icon={<Icon glyph="E" size="xs" decorative />}
              testID="user-mfa-detail-edit"
              disabled={isLoading}
            >
              {t('userMfa.detail.edit')}
            </Button>
          )}
          {onDelete ? (
            <Button
              variant="surface"
              size="small"
              onPress={onDelete}
              loading={isLoading}
              accessibilityLabel={t('userMfa.detail.delete')}
              accessibilityHint={t('userMfa.detail.deleteHint')}
              icon={<Icon glyph="X" size="xs" decorative />}
              testID="user-mfa-detail-delete"
            >
              {t('common.remove')}
            </Button>
          ) : null}
        </StyledActions>
      </StyledContent>
    </StyledContainer>
  );
};

export default UserMfaDetailScreenIOS;
