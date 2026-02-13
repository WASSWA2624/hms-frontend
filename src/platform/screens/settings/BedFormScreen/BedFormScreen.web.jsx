/**
 * BedFormScreen - Web
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
} from './BedFormScreen.web.styles';
import useBedFormScreen from './useBedFormScreen';

const BedFormScreenWeb = () => {
  const { t } = useI18n();
  const {
    isEdit,
    label,
    setLabel,
    status,
    setStatus,
    statusOptions,
    tenantId,
    setTenantId,
    facilityId,
    setFacilityId,
    wardId,
    setWardId,
    roomId,
    setRoomId,
    tenantOptions,
    tenantListLoading,
    tenantListError,
    tenantErrorMessage,
    facilityOptions,
    facilityListLoading,
    facilityListError,
    facilityErrorMessage,
    wardOptions,
    wardListLoading,
    wardListError,
    wardErrorMessage,
    roomOptions,
    roomListLoading,
    roomListError,
    roomErrorMessage,
    hasTenants,
    hasFacilities,
    hasWards,
    hasRooms,
    isCreateBlocked,
    isFacilityBlocked,
    isWardBlocked,
    isLoading,
    hasError,
    errorMessage,
    isOffline,
    bed,
    labelError,
    statusError,
    tenantError,
    facilityError,
    wardError,
    isTenantLocked,
    lockedTenantDisplay,
    onSubmit,
    onCancel,
    onGoToTenants,
    onGoToFacilities,
    onGoToWards,
    onGoToRooms,
    onRetryTenants,
    onRetryFacilities,
    onRetryWards,
    onRetryRooms,
    isSubmitDisabled,
  } = useBedFormScreen();

  if (isEdit && !bed && isLoading) {
    return (
      <StyledContainer role="main" aria-label={t('bed.form.editTitle')}>
        <StyledContent>
          <LoadingSpinner accessibilityLabel={t('common.loading')} testID="bed-form-loading" />
        </StyledContent>
      </StyledContainer>
    );
  }

  if (isEdit && hasError && !bed) {
    return (
      <StyledContainer role="main" aria-label={t('bed.form.editTitle')}>
        <StyledContent>
          <ErrorState
            title={t('bed.form.loadError')}
            action={
              <Button
                variant="surface"
                size="small"
                onPress={onCancel}
                accessibilityLabel={t('common.back')}
                accessibilityHint={t('bed.form.cancelHint')}
                icon={<Icon glyph="?" size="xs" decorative />}
              >
                {t('common.back')}
              </Button>
            }
            testID="bed-form-load-error"
          />
        </StyledContent>
      </StyledContainer>
    );
  }

  const isFormDisabled = isLoading || (!isEdit && (isCreateBlocked || isFacilityBlocked || isWardBlocked));
  const retryTenantsAction = onRetryTenants ? (
    <Button
      variant="surface"
      size="small"
      onPress={onRetryTenants}
      accessibilityLabel={t('common.retry')}
      accessibilityHint={t('common.retryHint')}
      icon={<Icon glyph="?" size="xs" decorative />}
      testID="bed-form-tenant-retry"
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
      testID="bed-form-facility-retry"
    >
      {t('common.retry')}
    </Button>
  ) : undefined;
  const retryWardsAction = onRetryWards ? (
    <Button
      variant="surface"
      size="small"
      onPress={onRetryWards}
      accessibilityLabel={t('common.retry')}
      accessibilityHint={t('common.retryHint')}
      icon={<Icon glyph="?" size="xs" decorative />}
      testID="bed-form-ward-retry"
    >
      {t('common.retry')}
    </Button>
  ) : undefined;
  const retryRoomsAction = onRetryRooms ? (
    <Button
      variant="surface"
      size="small"
      onPress={onRetryRooms}
      accessibilityLabel={t('common.retry')}
      accessibilityHint={t('common.retryHint')}
      icon={<Icon glyph="?" size="xs" decorative />}
      testID="bed-form-room-retry"
    >
      {t('common.retry')}
    </Button>
  ) : undefined;
  const showInlineError = hasError && (!isEdit || Boolean(bed));
  const showTenantBlocked = !isEdit && isCreateBlocked;
  const showFacilityBlocked = !isEdit && isFacilityBlocked;
  const showWardBlocked = !isEdit && isWardBlocked;
  const showCreateBlocked = showTenantBlocked || showFacilityBlocked || showWardBlocked;
  const blockedMessage = showWardBlocked
    ? t('bed.form.wardBlockedMessage')
    : showFacilityBlocked
      ? t('bed.form.facilityBlockedMessage')
      : t('bed.form.blockedMessage');
  const showFacilityEmpty = Boolean(tenantId) && !facilityListLoading && !facilityListError && !hasFacilities;
  const showWardEmpty = Boolean(facilityId) && !wardListLoading && !wardListError && !hasWards;
  const showRoomEmpty = Boolean(wardId) && !roomListLoading && !roomListError && !hasRooms;
  const labelHelperText = labelError || (showCreateBlocked ? blockedMessage : t('bed.form.labelHint'));
  const statusHelperText = statusError || (showCreateBlocked ? blockedMessage : t('bed.form.statusHint'));
  const tenantHelperText = tenantError || t('bed.form.tenantHint');
  const facilityHelperText = facilityError || t('bed.form.facilityHint');
  const wardHelperText = wardError || t('bed.form.wardHint');
  const roomSelectOptions = [{ value: '', label: t('bed.form.roomNone') }, ...roomOptions];

  return (
    <StyledContainer role="main" aria-label={isEdit ? t('bed.form.editTitle') : t('bed.form.createTitle')}>
      <StyledContent>
        <Text variant="h2" accessibilityRole="header" testID="bed-form-title">
          {isEdit ? t('bed.form.editTitle') : t('bed.form.createTitle')}
        </Text>

        <StyledInlineStates>
          {isOffline && (
            <OfflineState
              size={OfflineStateSizes.SMALL}
              title={t('shell.banners.offline.title')}
              description={t('shell.banners.offline.message')}
              testID="bed-form-offline"
            />
          )}
          {showInlineError && (
            <ErrorState
              size={ErrorStateSizes.SMALL}
              title={t('bed.form.submitErrorTitle')}
              description={errorMessage}
              testID="bed-form-submit-error"
            />
          )}
        </StyledInlineStates>

        <Card variant="outlined" accessibilityLabel={t('bed.form.labelLabel')} testID="bed-form-card">
          <StyledFormGrid>
            {!isEdit && !isTenantLocked ? (
              <StyledFullRow>
                <StyledFieldGroup>
                  {tenantListLoading ? (
                    <LoadingSpinner
                      accessibilityLabel={t('common.loading')}
                      testID="bed-form-tenant-loading"
                    />
                  ) : tenantListError ? (
                    <ErrorState
                      size={ErrorStateSizes.SMALL}
                      title={t('bed.form.tenantLoadErrorTitle')}
                      description={tenantErrorMessage}
                      action={retryTenantsAction}
                      testID="bed-form-tenant-error"
                    />
                  ) : !hasTenants ? (
                    <StyledHelperStack
                      role="region"
                      aria-label={t('bed.form.tenantLabel')}
                      data-testid="bed-form-no-tenants"
                    >
                      <Text variant="body">{t('bed.form.noTenantsMessage')}</Text>
                      <Text variant="body">{t('bed.form.createTenantFirst')}</Text>
                      <Button
                        variant="surface"
                        size="small"
                        onPress={onGoToTenants}
                        accessibilityLabel={t('bed.form.goToTenants')}
                        accessibilityHint={t('bed.form.goToTenantsHint')}
                        icon={<Icon glyph="?" size="xs" decorative />}
                        testID="bed-form-go-to-tenants"
                      >
                        {t('bed.form.goToTenants')}
                      </Button>
                    </StyledHelperStack>
                  ) : (
                    <Select
                      label={t('bed.form.tenantLabel')}
                      placeholder={t('bed.form.tenantPlaceholder')}
                      options={tenantOptions}
                      value={tenantId}
                      onValueChange={setTenantId}
                      accessibilityLabel={t('bed.form.tenantLabel')}
                      accessibilityHint={t('bed.form.tenantHint')}
                      errorMessage={tenantError}
                      helperText={tenantHelperText}
                      required
                      compact
                      disabled={isFormDisabled}
                      testID="bed-form-tenant"
                    />
                  )}
                </StyledFieldGroup>
              </StyledFullRow>
            ) : (
              <StyledFullRow>
                <StyledFieldGroup>
                  <TextField
                    label={t('bed.form.tenantLabel')}
                    value={isEdit ? tenantId : lockedTenantDisplay}
                    accessibilityLabel={t('bed.form.tenantLabel')}
                    accessibilityHint={t('bed.form.tenantLockedHint')}
                    helperText={t('bed.form.tenantLockedHint')}
                    disabled
                    testID="bed-form-tenant-readonly"
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
                      testID="bed-form-facility-loading"
                    />
                  ) : facilityListError ? (
                    <ErrorState
                      size={ErrorStateSizes.SMALL}
                      title={t('bed.form.facilityLoadErrorTitle')}
                      description={facilityErrorMessage}
                      action={retryFacilitiesAction}
                      testID="bed-form-facility-error"
                    />
                  ) : !tenantId ? (
                    <Select
                      label={t('bed.form.facilityLabel')}
                      placeholder={t('bed.form.facilityPlaceholder')}
                      options={[]}
                      value=""
                      onValueChange={() => {}}
                      accessibilityLabel={t('bed.form.facilityLabel')}
                      accessibilityHint={t('bed.form.selectTenantFirst')}
                      helperText={t('bed.form.selectTenantFirst')}
                      compact
                      disabled
                      testID="bed-form-select-tenant"
                    />
                  ) : showFacilityEmpty ? (
                    <StyledHelperStack
                      role="region"
                      aria-label={t('bed.form.facilityLabel')}
                      data-testid="bed-form-no-facilities"
                    >
                      <Text variant="body">{t('bed.form.noFacilitiesMessage')}</Text>
                      <Text variant="body">{t('bed.form.createFacilityRequired')}</Text>
                      <Button
                        variant="surface"
                        size="small"
                        onPress={onGoToFacilities}
                        accessibilityLabel={t('bed.form.goToFacilities')}
                        accessibilityHint={t('bed.form.goToFacilitiesHint')}
                        icon={<Icon glyph="?" size="xs" decorative />}
                        testID="bed-form-go-to-facilities"
                      >
                        {t('bed.form.goToFacilities')}
                      </Button>
                    </StyledHelperStack>
                  ) : (
                    <Select
                      label={t('bed.form.facilityLabel')}
                      placeholder={t('bed.form.facilityPlaceholder')}
                      options={facilityOptions}
                      value={facilityId}
                      onValueChange={setFacilityId}
                      accessibilityLabel={t('bed.form.facilityLabel')}
                      accessibilityHint={t('bed.form.facilityHint')}
                      errorMessage={facilityError}
                      helperText={facilityHelperText}
                      required
                      compact
                      disabled={isFormDisabled}
                      testID="bed-form-facility"
                    />
                  )}
                </StyledFieldGroup>
              </StyledFullRow>
            ) : (
              <StyledFullRow>
                <StyledFieldGroup>
                  <TextField
                    label={t('bed.form.facilityLabel')}
                    value={facilityId}
                    accessibilityLabel={t('bed.form.facilityLabel')}
                    accessibilityHint={t('bed.form.facilityLockedHint')}
                    helperText={t('bed.form.facilityLockedHint')}
                    disabled
                    testID="bed-form-facility-readonly"
                  />
                </StyledFieldGroup>
              </StyledFullRow>
            )}

            {!isEdit ? (
              <StyledFullRow>
                <StyledFieldGroup>
                  {wardListLoading ? (
                    <LoadingSpinner
                      accessibilityLabel={t('common.loading')}
                      testID="bed-form-ward-loading"
                    />
                  ) : wardListError ? (
                    <ErrorState
                      size={ErrorStateSizes.SMALL}
                      title={t('bed.form.wardLoadErrorTitle')}
                      description={wardErrorMessage}
                      action={retryWardsAction}
                      testID="bed-form-ward-error"
                    />
                  ) : !facilityId ? (
                    <Select
                      label={t('bed.form.wardLabel')}
                      placeholder={t('bed.form.wardPlaceholder')}
                      options={[]}
                      value=""
                      onValueChange={() => {}}
                      accessibilityLabel={t('bed.form.wardLabel')}
                      accessibilityHint={t('bed.form.selectFacilityFirst')}
                      helperText={t('bed.form.selectFacilityFirst')}
                      compact
                      disabled
                      testID="bed-form-select-facility"
                    />
                  ) : showWardEmpty ? (
                    <StyledHelperStack
                      role="region"
                      aria-label={t('bed.form.wardLabel')}
                      data-testid="bed-form-no-wards"
                    >
                      <Text variant="body">{t('bed.form.noWardsMessage')}</Text>
                      <Text variant="body">{t('bed.form.createWardRequired')}</Text>
                      <Button
                        variant="surface"
                        size="small"
                        onPress={onGoToWards}
                        accessibilityLabel={t('bed.form.goToWards')}
                        accessibilityHint={t('bed.form.goToWardsHint')}
                        icon={<Icon glyph="?" size="xs" decorative />}
                        testID="bed-form-go-to-wards"
                      >
                        {t('bed.form.goToWards')}
                      </Button>
                    </StyledHelperStack>
                  ) : (
                    <Select
                      label={t('bed.form.wardLabel')}
                      placeholder={t('bed.form.wardPlaceholder')}
                      options={wardOptions}
                      value={wardId}
                      onValueChange={setWardId}
                      accessibilityLabel={t('bed.form.wardLabel')}
                      accessibilityHint={t('bed.form.wardHint')}
                      errorMessage={wardError}
                      helperText={wardHelperText}
                      required
                      compact
                      disabled={isFormDisabled}
                      testID="bed-form-ward"
                    />
                  )}
                </StyledFieldGroup>
              </StyledFullRow>
            ) : (
              <StyledFullRow>
                <StyledFieldGroup>
                  <TextField
                    label={t('bed.form.wardLabel')}
                    value={wardId}
                    accessibilityLabel={t('bed.form.wardLabel')}
                    accessibilityHint={t('bed.form.wardLockedHint')}
                    helperText={t('bed.form.wardLockedHint')}
                    disabled
                    testID="bed-form-ward-readonly"
                  />
                </StyledFieldGroup>
              </StyledFullRow>
            )}

            <StyledFullRow>
              <StyledFieldGroup>
                {roomListLoading ? (
                  <LoadingSpinner
                    accessibilityLabel={t('common.loading')}
                    testID="bed-form-room-loading"
                  />
                ) : roomListError ? (
                  <ErrorState
                    size={ErrorStateSizes.SMALL}
                    title={t('bed.form.roomLoadErrorTitle')}
                    description={roomErrorMessage}
                    action={retryRoomsAction}
                    testID="bed-form-room-error"
                  />
                ) : !facilityId || !wardId ? (
                  <Select
                    label={t('bed.form.roomLabel')}
                    placeholder={t('bed.form.roomPlaceholder')}
                    options={[]}
                    value=""
                    onValueChange={() => {}}
                    accessibilityLabel={t('bed.form.roomLabel')}
                    accessibilityHint={t('bed.form.selectWardFirst')}
                    helperText={t('bed.form.selectWardFirst')}
                    compact
                    disabled
                    testID="bed-form-select-ward"
                  />
                ) : showRoomEmpty ? (
                  <StyledHelperStack
                    role="region"
                    aria-label={t('bed.form.roomLabel')}
                    data-testid="bed-form-no-rooms"
                  >
                    <Text variant="body">{t('bed.form.noRoomsMessage')}</Text>
                    <Text variant="body">{t('bed.form.createRoomOptional')}</Text>
                    <Button
                      variant="surface"
                      size="small"
                      onPress={onGoToRooms}
                      accessibilityLabel={t('bed.form.goToRooms')}
                      accessibilityHint={t('bed.form.goToRoomsHint')}
                      icon={<Icon glyph="?" size="xs" decorative />}
                      testID="bed-form-go-to-rooms"
                    >
                      {t('bed.form.goToRooms')}
                    </Button>
                  </StyledHelperStack>
                ) : (
                  <Select
                    label={t('bed.form.roomLabel')}
                    placeholder={t('bed.form.roomPlaceholder')}
                    options={roomSelectOptions}
                    value={roomId}
                    onValueChange={setRoomId}
                    accessibilityLabel={t('bed.form.roomLabel')}
                    accessibilityHint={t('bed.form.roomHint')}
                    helperText={t('bed.form.roomHint')}
                    compact
                    disabled={isFormDisabled}
                    testID="bed-form-room"
                  />
                )}
              </StyledFieldGroup>
            </StyledFullRow>

            <StyledFieldGroup>
              <TextField
                label={t('bed.form.labelLabel')}
                placeholder={t('bed.form.labelPlaceholder')}
                value={label}
                onChange={(e) => setLabel(e.target.value)}
                accessibilityLabel={t('bed.form.labelLabel')}
                accessibilityHint={t('bed.form.labelHint')}
                errorMessage={labelError}
                helperText={labelHelperText}
                required
                maxLength={50}
                density="compact"
                disabled={isFormDisabled}
                testID="bed-form-label"
              />
            </StyledFieldGroup>

            <StyledFieldGroup>
              <Select
                label={t('bed.form.statusLabel')}
                placeholder={t('bed.form.statusPlaceholder')}
                options={statusOptions}
                value={status}
                onValueChange={setStatus}
                accessibilityLabel={t('bed.form.statusLabel')}
                accessibilityHint={t('bed.form.statusHint')}
                errorMessage={statusError}
                helperText={statusHelperText}
                required={!isEdit}
                compact
                disabled={isFormDisabled}
                testID="bed-form-status"
              />
            </StyledFieldGroup>
          </StyledFormGrid>
        </Card>

        <StyledActions>
          <Button
            variant="surface"
            size="small"
            onPress={onCancel}
            accessibilityLabel={t('bed.form.cancel')}
            accessibilityHint={t('bed.form.cancelHint')}
            icon={<Icon glyph="?" size="xs" decorative />}
            testID="bed-form-cancel"
            disabled={isLoading}
          >
            {t('bed.form.cancel')}
          </Button>
          <Button
            variant="surface"
            size="small"
            onPress={onSubmit}
            loading={isLoading}
            disabled={isSubmitDisabled}
            accessibilityLabel={isEdit ? t('bed.form.submitEdit') : t('bed.form.submitCreate')}
            accessibilityHint={isEdit ? t('bed.form.submitEdit') : t('bed.form.submitCreate')}
            icon={<Icon glyph="?" size="xs" decorative />}
            testID="bed-form-submit"
          >
            {isEdit ? t('bed.form.submitEdit') : t('bed.form.submitCreate')}
          </Button>
        </StyledActions>
      </StyledContent>
    </StyledContainer>
  );
};

export default BedFormScreenWeb;
