/**
 * UserFormScreen - Web
 */
import React from 'react';
import {
  Button,
  ErrorState,
  LoadingSpinner,
  Select,
  Text,
  TextField,
} from '@platform/components';
import { useI18n } from '@hooks';
import { StyledContainer, StyledContent, StyledSection, StyledActions } from './UserFormScreen.web.styles';
import useUserFormScreen from './useUserFormScreen';

const UserFormScreenWeb = () => {
  const { t } = useI18n();
  const {
    isEdit,
    tenantId,
    setTenantId,
    facilityId,
    setFacilityId,
    email,
    setEmail,
    phone,
    setPhone,
    password,
    setPassword,
    status,
    setStatus,
    statusOptions,
    isLoading,
    hasError,
    user,
    onSubmit,
    onCancel,
  } = useUserFormScreen();

  if (isEdit && !user && isLoading) {
    return (
      <StyledContainer>
        <StyledContent>
          <LoadingSpinner accessibilityLabel={t('common.loading')} testID="user-form-loading" />
        </StyledContent>
      </StyledContainer>
    );
  }

  if (isEdit && hasError && !user) {
    return (
      <StyledContainer>
        <StyledContent>
          <ErrorState
            title={t('user.form.loadError')}
            action={(
              <Button variant="primary" onPress={onCancel} accessibilityLabel={t('common.back')}>
                {t('common.back')}
              </Button>
            )}
            testID="user-form-load-error"
          />
        </StyledContent>
      </StyledContainer>
    );
  }

  return (
    <StyledContainer>
      <StyledContent>
        <Text variant="h1" accessibilityRole="header" testID="user-form-title">
          {isEdit ? t('user.form.editTitle') : t('user.form.createTitle')}
        </Text>

        {!isEdit && (
          <StyledSection>
            <TextField
              label={t('user.form.tenantIdLabel')}
              placeholder={t('user.form.tenantIdPlaceholder')}
              value={tenantId}
              onChangeText={setTenantId}
              accessibilityLabel={t('user.form.tenantIdLabel')}
              accessibilityHint={t('user.form.tenantIdHint')}
              testID="user-form-tenant-id"
            />
          </StyledSection>
        )}

        <StyledSection>
          <TextField
            label={t('user.form.facilityIdLabel')}
            placeholder={t('user.form.facilityIdPlaceholder')}
            value={facilityId}
            onChangeText={setFacilityId}
            accessibilityLabel={t('user.form.facilityIdLabel')}
            accessibilityHint={t('user.form.facilityIdHint')}
            testID="user-form-facility-id"
          />
        </StyledSection>

        <StyledSection>
          <TextField
            label={t('user.form.emailLabel')}
            placeholder={t('user.form.emailPlaceholder')}
            value={email}
            onChangeText={setEmail}
            type="email"
            accessibilityLabel={t('user.form.emailLabel')}
            accessibilityHint={t('user.form.emailHint')}
            testID="user-form-email"
          />
        </StyledSection>

        <StyledSection>
          <TextField
            label={t('user.form.phoneLabel')}
            placeholder={t('user.form.phonePlaceholder')}
            value={phone}
            onChangeText={setPhone}
            type="tel"
            accessibilityLabel={t('user.form.phoneLabel')}
            accessibilityHint={t('user.form.phoneHint')}
            testID="user-form-phone"
          />
        </StyledSection>

        <StyledSection>
          <TextField
            label={t('user.form.passwordLabel')}
            placeholder={t('user.form.passwordPlaceholder')}
            value={password}
            onChangeText={setPassword}
            type="password"
            accessibilityLabel={t('user.form.passwordLabel')}
            accessibilityHint={t('user.form.passwordHint')}
            testID="user-form-password"
          />
        </StyledSection>

        <StyledSection>
          <Select
            label={t('user.form.statusLabel')}
            placeholder={t('user.form.statusPlaceholder')}
            options={statusOptions}
            value={status}
            onValueChange={setStatus}
            accessibilityLabel={t('user.form.statusLabel')}
            accessibilityHint={t('user.form.statusHint')}
            testID="user-form-status"
          />
        </StyledSection>

        <StyledActions>
          <Button
            variant="ghost"
            onPress={onCancel}
            accessibilityLabel={t('user.form.cancel')}
            accessibilityHint={t('user.form.cancelHint')}
            testID="user-form-cancel"
          >
            {t('user.form.cancel')}
          </Button>
          <Button
            variant="primary"
            onPress={onSubmit}
            accessibilityLabel={isEdit ? t('user.form.submitEdit') : t('user.form.submitCreate')}
            testID="user-form-submit"
          >
            {isEdit ? t('user.form.submitEdit') : t('user.form.submitCreate')}
          </Button>
        </StyledActions>
      </StyledContent>
    </StyledContainer>
  );
};

export default UserFormScreenWeb;
