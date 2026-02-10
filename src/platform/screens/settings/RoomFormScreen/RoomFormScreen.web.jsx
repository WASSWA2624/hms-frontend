/**
 * RoomFormScreen - Web
 */
import React from 'react';
import {
  Button,
  Card,
  ErrorState,
  ErrorStateSizes,
  Icon,
  LoadingSpinner,
  OfflineState,
  OfflineStateSizes,
  Select,
  Text,
  TextField,
} from '@platform/components';
import { useI18n } from '@hooks';
import {
  StyledActions,
  StyledContainer,
  StyledContent,
  StyledFieldGroup,
  StyledFormGrid,
  StyledFullRow,
  StyledHelperStack,
  StyledInlineStates,
} from './RoomFormScreen.web.styles';
import useRoomFormScreen from './useRoomFormScreen';

const RoomFormScreenWeb = () => {
  const { t } = useI18n();
  const {
    isEdit,
    name,
    setName,
    floor,
    setFloor,
    tenantId,
    setTenantId,
    facilityId,
    setFacilityId,
    tenantOptions,
    tenantListLoading,
    tenantListError,
    tenantErrorMessage,
    facilityOptions,
    facilityListLoading,
    facilityListError,
    facilityErrorMessage,
    hasTenants,
    hasFacilities,
    isCreateBlocked,
    isFacilityBlocked,
    isLoading,
    hasError,
    errorMessage,
    isOffline,
    room,
    onSubmit,
    onCancel,
    onGoToTenants,
    onGoToFacilities,
    onRetryTenants,
    onRetryFacilities,
    isSubmitDisabled,
  } = useRoomFormScreen();

  if (isEdit && !room && isLoading) {
    return (
      <StyledContainer role="main" aria-label={t('room.form.editTitle')}>
        <StyledContent>
          <LoadingSpinner accessibilityLabel={t('common.loading')} testID="room-form-loading" />
        </StyledContent>
      </StyledContainer>
    );
  }

  if (isEdit && hasError && !room) {
    return (
      <StyledContainer role="main" aria-label={t('room.form.editTitle')}>
        <StyledContent>
          <ErrorState
            title={t('room.form.loadError')}
            action={(
              <Button
                variant="surface"
                size="small"
                onPress={onCancel}
                accessibilityLabel={t('common.back')}
                accessibilityHint={t('room.form.cancelHint')}
                icon={<Icon glyph="?" size="xs" decorative />}
              >
                {t('common.back')}
              </Button>
            )}
            testID="room-form-load-error"
          />
        </StyledContent>
      </StyledContainer>
    );
  }

  const isFormDisabled = isLoading || (!isEdit && (isCreateBlocked || isFacilityBlocked));
  const retryTenantsAction = onRetryTenants ? (
    <Button
      variant="surface"
      size="small"
      onPress={onRetryTenants}
      accessibilityLabel={t('common.retry')}
      accessibilityHint={t('common.retryHint')}
      icon={<Icon glyph="?" size="xs" decorative />}
      testID="room-form-tenant-retry"
    >
      {t('common.retry')}
    </Button>
  ) : undefined;
  const retryFacilitiesAction = onRetryFacilities ? (
    <Button
      variant="surface"
      size="small"
      onPress={onRetryFacilities}
      accessibilityLabel={t('common.retry')}
      accessibilityHint={t('common.retryHint')}
      icon={<Icon glyph="?" size="xs" decorative />}
      testID="room-form-facility-retry"
    >
      {t('common.retry')}
    </Button>
  ) : undefined;
  const showInlineError = hasError && (!isEdit || Boolean(room));
  const showTenantBlocked = !isEdit && isCreateBlocked;
  const showFacilityBlocked = !isEdit && isFacilityBlocked;
  const showCreateBlocked = showTenantBlocked || showFacilityBlocked;
  const blockedMessage = showFacilityBlocked
    ? t('room.form.facilityBlockedMessage')
    : t('room.form.blockedMessage');
  const showFacilityEmpty = Boolean(tenantId) && !facilityListLoading && !facilityListError && !hasFacilities;

  return (
    <StyledContainer role="main" aria-label={isEdit ? t('room.form.editTitle') : t('room.form.createTitle')}>
      <StyledContent>
        <Text variant="h2" accessibilityRole="header" testID="room-form-title">
          {isEdit ? t('room.form.editTitle') : t('room.form.createTitle')}
        </Text>

        <StyledInlineStates>
          {isOffline && (
            <OfflineState
              size={OfflineStateSizes.SMALL}
              title={t('shell.banners.offline.title')}
              description={t('shell.banners.offline.message')}
              testID="room-form-offline"
            />
          )}
          {showInlineError && (
            <ErrorState
              size={ErrorStateSizes.SMALL}
              title={t('room.form.submitErrorTitle')}
              description={errorMessage}
              testID="room-form-submit-error"
            />
          )}
        </StyledInlineStates>

        <Card variant="outlined" accessibilityLabel={t('room.form.nameLabel')} testID="room-form-card">
          <StyledFormGrid>
            {!isEdit ? (
              <StyledFullRow>
                <StyledFieldGroup>
                  {tenantListLoading ? (
                    <LoadingSpinner
                      accessibilityLabel={t('common.loading')}
                      testID="room-form-tenant-loading"
                    />
                  ) : tenantListError ? (
                    <ErrorState
                      size={ErrorStateSizes.SMALL}
                      title={t('room.form.tenantLoadErrorTitle')}
                      description={tenantErrorMessage}
                      action={retryTenantsAction}
                      testID="room-form-tenant-error"
                    />
                  ) : !hasTenants ? (
                    <StyledHelperStack
                      role="region"
                      aria-label={t('room.form.tenantLabel')}
                      data-testid="room-form-no-tenants"
                    >
                      <Text variant="body">{t('room.form.noTenantsMessage')}</Text>
                      <Text variant="body">{t('room.form.createTenantFirst')}</Text>
                      <Button
                        variant="surface"
                        size="small"
                        onPress={onGoToTenants}
                        accessibilityLabel={t('room.form.goToTenants')}
                        accessibilityHint={t('room.form.goToTenantsHint')}
                        icon={<Icon glyph="?" size="xs" decorative />}
                        testID="room-form-go-to-tenants"
                      >
                        {t('room.form.goToTenants')}
                      </Button>
                    </StyledHelperStack>
                  ) : (
                    <Select
                      label={t('room.form.tenantLabel')}
                      placeholder={t('room.form.tenantPlaceholder')}
                      options={tenantOptions}
                      value={tenantId}
                      onValueChange={setTenantId}
                      accessibilityLabel={t('room.form.tenantLabel')}
                      accessibilityHint={t('room.form.tenantHint')}
                      helperText={t('room.form.tenantHint')}
                      required
                      compact
                      disabled={isFormDisabled}
                      testID="room-form-tenant"
                    />
                  )}
                </StyledFieldGroup>
              </StyledFullRow>
            ) : (
              <StyledFullRow>
                <StyledFieldGroup>
                  <TextField
                    label={t('room.form.tenantLabel')}
                    value={tenantId}
                    accessibilityLabel={t('room.form.tenantLabel')}
                    accessibilityHint={t('room.form.tenantLockedHint')}
                    helperText={t('room.form.tenantLockedHint')}
                    disabled
                    testID="room-form-tenant-readonly"
                  />
                </StyledFieldGroup>
              </StyledFullRow>
            )}

            {!isEdit ? (
              <StyledFullRow>
                <StyledFieldGroup>
                  {facilityListLoading ? (
                    <LoadingSpinner
                      accessibilityLabel={t('common.loading')}
                      testID="room-form-facility-loading"
                    />
                  ) : facilityListError ? (
                    <ErrorState
                      size={ErrorStateSizes.SMALL}
                      title={t('room.form.facilityLoadErrorTitle')}
                      description={facilityErrorMessage}
                      action={retryFacilitiesAction}
                      testID="room-form-facility-error"
                    />
                  ) : !tenantId ? (
                    <Select
                      label={t('room.form.facilityLabel')}
                      placeholder={t('room.form.facilityPlaceholder')}
                      options={[]}
                      value=""
                      onValueChange={() => {}}
                      accessibilityLabel={t('room.form.facilityLabel')}
                      accessibilityHint={t('room.form.selectTenantFirst')}
                      helperText={t('room.form.selectTenantFirst')}
                      compact
                      disabled
                      testID="room-form-select-tenant"
                    />
                  ) : showFacilityEmpty ? (
                    <StyledHelperStack
                      role="region"
                      aria-label={t('room.form.facilityLabel')}
                      data-testid="room-form-no-facilities"
                    >
                      <Text variant="body">{t('room.form.noFacilitiesMessage')}</Text>
                      <Text variant="body">{t('room.form.createFacilityRequired')}</Text>
                      <Button
                        variant="surface"
                        size="small"
                        onPress={onGoToFacilities}
                        accessibilityLabel={t('room.form.goToFacilities')}
                        accessibilityHint={t('room.form.goToFacilitiesHint')}
                        icon={<Icon glyph="?" size="xs" decorative />}
                        testID="room-form-go-to-facilities"
                      >
                        {t('room.form.goToFacilities')}
                      </Button>
                    </StyledHelperStack>
                  ) : (
                    <Select
                      label={t('room.form.facilityLabel')}
                      placeholder={t('room.form.facilityPlaceholder')}
                      options={facilityOptions}
                      value={facilityId}
                      onValueChange={setFacilityId}
                      accessibilityLabel={t('room.form.facilityLabel')}
                      accessibilityHint={t('room.form.facilityHint')}
                      helperText={t('room.form.facilityHint')}
                      required
                      compact
                      disabled={isFormDisabled}
                      testID="room-form-facility"
                    />
                  )}
                </StyledFieldGroup>
              </StyledFullRow>
            ) : (
              <StyledFullRow>
                <StyledFieldGroup>
                  <TextField
                    label={t('room.form.facilityLabel')}
                    value={facilityId}
                    accessibilityLabel={t('room.form.facilityLabel')}
                    accessibilityHint={t('room.form.facilityLockedHint')}
                    helperText={t('room.form.facilityLockedHint')}
                    disabled
                    testID="room-form-facility-readonly"
                  />
                </StyledFieldGroup>
              </StyledFullRow>
            )}

            <StyledFieldGroup>
              <TextField
                label={t('room.form.nameLabel')}
                placeholder={t('room.form.namePlaceholder')}
                value={name}
                onChange={(e) => setName(e.target.value)}
                accessibilityLabel={t('room.form.nameLabel')}
                accessibilityHint={t('room.form.nameHint')}
                helperText={showCreateBlocked ? blockedMessage : t('room.form.nameHint')}
                required
                density="compact"
                disabled={isFormDisabled}
                testID="room-form-name"
              />
            </StyledFieldGroup>

            <StyledFieldGroup>
              <TextField
                label={t('room.form.floorLabel')}
                placeholder={t('room.form.floorPlaceholder')}
                value={floor}
                onChange={(e) => setFloor(e.target.value)}
                accessibilityLabel={t('room.form.floorLabel')}
                accessibilityHint={t('room.form.floorHint')}
                helperText={showCreateBlocked ? blockedMessage : t('room.form.floorHint')}
                density="compact"
                disabled={isFormDisabled}
                testID="room-form-floor"
              />
            </StyledFieldGroup>
          </StyledFormGrid>
        </Card>

        <StyledActions>
          <Button
            variant="surface"
            size="small"
            onPress={onCancel}
            accessibilityLabel={t('room.form.cancel')}
            accessibilityHint={t('room.form.cancelHint')}
            icon={<Icon glyph="?" size="xs" decorative />}
            testID="room-form-cancel"
            disabled={isLoading}
          >
            {t('room.form.cancel')}
          </Button>
          <Button
            variant="surface"
            size="small"
            onPress={onSubmit}
            loading={isLoading}
            disabled={isSubmitDisabled}
            accessibilityLabel={isEdit ? t('room.form.submitEdit') : t('room.form.submitCreate')}
            accessibilityHint={isEdit ? t('room.form.submitEdit') : t('room.form.submitCreate')}
            icon={<Icon glyph="?" size="xs" decorative />}
            testID="room-form-submit"
          >
            {isEdit ? t('room.form.submitEdit') : t('room.form.submitCreate')}
          </Button>
        </StyledActions>
      </StyledContent>
    </StyledContainer>
  );
};

export default RoomFormScreenWeb;
