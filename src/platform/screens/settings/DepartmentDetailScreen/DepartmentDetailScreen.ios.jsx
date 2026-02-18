/**
 * DepartmentDetailScreen - iOS
 * File: DepartmentDetailScreen.ios.jsx
 */
import React from 'react';
import {
  Badge,
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
import { formatDateTime, humanizeIdentifier } from '@utils';
import {
  StyledContainer,
  StyledContent,
  StyledDetailGrid,
  StyledDetailItem,
  StyledInlineStates,
  StyledActions,
} from './DepartmentDetailScreen.ios.styles';
import useDepartmentDetailScreen from './useDepartmentDetailScreen';

const DepartmentDetailScreenIOS = () => {
  const { t, locale } = useI18n();
  const {
    department,
    isLoading,
    hasError,
    errorMessage,
    isOffline,
    onRetry,
    onBack,
    onEdit,
    onDelete,
  } = useDepartmentDetailScreen();

  const hasDepartment = Boolean(department);

  if (isLoading && !hasDepartment) {
    return (
      <StyledContainer>
        <StyledContent>
          <LoadingSpinner
            accessibilityLabel={t('common.loading')}
            testID="department-detail-loading"
          />
        </StyledContent>
      </StyledContainer>
    );
  }

  if (isOffline && !hasDepartment) {
    return (
      <StyledContainer>
        <StyledContent>
          <OfflineState
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
            testID="department-detail-offline"
          />
        </StyledContent>
      </StyledContainer>
    );
  }

  if (hasError && !hasDepartment) {
    return (
      <StyledContainer>
        <StyledContent>
          <ErrorState
            title={t('department.detail.errorTitle')}
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
            testID="department-detail-error"
          />
        </StyledContent>
      </StyledContainer>
    );
  }

  if (!department) {
    return (
      <StyledContainer>
        <StyledContent>
          <EmptyState
            title={t('department.detail.notFoundTitle')}
            description={t('department.detail.notFoundMessage')}
            testID="department-detail-not-found"
          />
          <StyledActions>
            <Button
              variant="surface"
              size="small"
              onPress={onBack}
              accessibilityLabel={t('common.back')}
              accessibilityHint={t('department.detail.backHint')}
              testID="department-detail-back"
            >
              {t('common.back')}
            </Button>
          </StyledActions>
        </StyledContent>
      </StyledContainer>
    );
  }

  const createdAt = formatDateTime(department.created_at, locale);
  const updatedAt = formatDateTime(department.updated_at, locale);
  const displayName = humanizeIdentifier(department?.name) || t('department.detail.nameFallback');
  const shortName = String(department?.short_name ?? '').trim();
  const typeValue = String(department?.department_type ?? '').trim();
  const typeLabel = (() => {
    if (!typeValue) return '';
    const key = `department.form.type${typeValue}`;
    const resolved = t(key);
    return resolved === key ? typeValue : resolved;
  })();
  const tenantLabel = humanizeIdentifier(
    department?.tenant_name
    ?? department?.tenant?.name
    ?? department?.tenant_label
  );
  const facilityLabel = humanizeIdentifier(
    department?.facility_name
    ?? department?.facility?.name
    ?? department?.facility_label
  );
  const branchLabel = humanizeIdentifier(
    department?.branch_name
    ?? department?.branch?.name
    ?? department?.branch_label
  );
  const isActive = department?.is_active ?? false;
  const statusLabel = isActive ? t('common.on') : t('common.off');
  const statusVariant = isActive ? 'success' : 'warning';
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
  const showInlineError = hasDepartment && hasError;
  const showInlineOffline = hasDepartment && isOffline;

  return (
    <StyledContainer>
      <StyledContent>
        <StyledInlineStates>
          {showInlineError && (
            <ErrorState
              size={ErrorStateSizes.SMALL}
              title={t('department.detail.errorTitle')}
              description={errorMessage}
              action={retryAction}
              testID="department-detail-error-banner"
            />
          )}
          {showInlineOffline && (
            <OfflineState
              size={OfflineStateSizes.SMALL}
              title={t('shell.banners.offline.title')}
              description={t('shell.banners.offline.message')}
              action={retryAction}
              testID="department-detail-offline-banner"
            />
          )}
        </StyledInlineStates>
        <Card variant="outlined" accessibilityLabel={t('department.detail.title')} testID="department-detail-card">
          <StyledDetailGrid>
            <StyledDetailItem>
              <Text variant="label">{t('department.detail.nameLabel')}</Text>
              <Text variant="body" testID="department-detail-name">
                {displayName}
              </Text>
            </StyledDetailItem>
            {tenantLabel ? (
              <StyledDetailItem>
                <Text variant="label">{t('department.detail.tenantLabel')}</Text>
                <Text variant="body" testID="department-detail-tenant">
                  {tenantLabel}
                </Text>
              </StyledDetailItem>
            ) : null}
            {facilityLabel ? (
              <StyledDetailItem>
                <Text variant="label">{t('department.detail.facilityLabel')}</Text>
                <Text variant="body" testID="department-detail-facility">
                  {facilityLabel}
                </Text>
              </StyledDetailItem>
            ) : null}
            {branchLabel ? (
              <StyledDetailItem>
                <Text variant="label">{t('department.detail.branchLabel')}</Text>
                <Text variant="body" testID="department-detail-branch">
                  {branchLabel}
                </Text>
              </StyledDetailItem>
            ) : null}
            {shortName ? (
              <StyledDetailItem>
                <Text variant="label">{t('department.detail.shortNameLabel')}</Text>
                <Text variant="body" testID="department-detail-short-name">
                  {shortName}
                </Text>
              </StyledDetailItem>
            ) : null}
            {typeLabel ? (
              <StyledDetailItem>
                <Text variant="label">{t('department.detail.typeLabel')}</Text>
                <Text variant="body" testID="department-detail-type">
                  {typeLabel}
                </Text>
              </StyledDetailItem>
            ) : null}
            <StyledDetailItem>
              <Text variant="label">{t('department.detail.activeLabel')}</Text>
              <Badge
                variant={statusVariant}
                size="small"
                accessibilityLabel={t('department.detail.activeLabel')}
                testID="department-detail-active"
              >
                {statusLabel}
              </Badge>
            </StyledDetailItem>
            {createdAt ? (
              <StyledDetailItem>
                <Text variant="label">{t('department.detail.createdLabel')}</Text>
                <Text variant="body" testID="department-detail-created">
                  {createdAt}
                </Text>
              </StyledDetailItem>
            ) : null}
            {updatedAt ? (
              <StyledDetailItem>
                <Text variant="label">{t('department.detail.updatedLabel')}</Text>
                <Text variant="body" testID="department-detail-updated">
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
            accessibilityHint={t('department.detail.backHint')}
            testID="department-detail-back"
            disabled={isLoading}
          >
            {t('common.back')}
          </Button>
          {onEdit && (
            <Button
              variant="surface"
              size="small"
              onPress={onEdit}
              accessibilityLabel={t('department.detail.edit')}
              accessibilityHint={t('department.detail.editHint')}
              testID="department-detail-edit"
              disabled={isLoading}
            >
              {t('department.detail.edit')}
            </Button>
          )}
          {onDelete && (
            <Button
              variant="surface"
              size="small"
              onPress={onDelete}
              loading={isLoading}
              accessibilityLabel={t('department.detail.delete')}
              accessibilityHint={t('department.detail.deleteHint')}
              testID="department-detail-delete"
            >
              {t('common.remove')}
            </Button>
          )}
        </StyledActions>
      </StyledContent>
    </StyledContainer>
  );
};

export default DepartmentDetailScreenIOS;

