/**
 * PasswordField Component - Web
 * Password input field with strength indicator for Web platform
 * File: PasswordField.web.jsx
 */
// 1. External dependencies
import React from 'react';
import { View } from 'react-native';

// 2. Platform components (from barrel file)
import TextField from '../TextField';

// 3. Hooks and utilities (absolute imports via aliases)
import { useI18n } from '@hooks';

// 4. Styles (relative import - platform-specific)
import {
  StyledContainer,
  StyledPasswordStrength,
  StyledPasswordStrengthBar,
  StyledPasswordStrengthLabel,
} from './PasswordField.web.styles';

// 5. Component-specific hook (relative import)
import usePasswordField from './usePasswordField';

// 6. Types and constants (relative import)
import { PASSWORD_STRENGTH } from './types';

/**
 * PasswordField component for Web
 * @param {Object} props - PasswordField props
 * @param {string} props.label - Field label
 * @param {string} props.placeholder - Placeholder text
 * @param {string} props.value - Password value
 * @param {Function} props.onChange - Change handler (web)
 * @param {Function} props.onChangeText - Change handler (alias for onChange)
 * @param {string} props.errorMessage - Error message
 * @param {boolean} props.required - Required field
 * @param {boolean} props.disabled - Disabled state
 * @param {boolean} props.showStrengthIndicator - Show password strength indicator (default: true)
 * @param {string} props.autoComplete - Autocomplete attribute
 * @param {string} props.accessibilityLabel - Accessibility label
 * @param {string} props.testID - Test identifier
 * @param {string} props.className - Additional CSS class
 * @param {Object} props.style - Additional styles
 */
const PasswordFieldWeb = ({
  label,
  placeholder,
  value = '',
  onChange,
  onChangeText,
  errorMessage,
  required = false,
  disabled = false,
  showStrengthIndicator = true,
  autoComplete = 'new-password',
  accessibilityLabel,
  testID,
  className,
  style,
  ...rest
}) => {
  const { t } = useI18n();
  const { passwordStrength } = usePasswordField({ password: value });
  
  // Use i18n for default values
  const defaultLabel = label || t('auth.password');
  const defaultPlaceholder = placeholder || t('auth.enterPassword');
  
  // Translate password strength label
  const strengthLabelMap = {
    [PASSWORD_STRENGTH.WEAK]: t('auth.passwordStrength.weak'),
    [PASSWORD_STRENGTH.FAIR]: t('auth.passwordStrength.fair'),
    [PASSWORD_STRENGTH.GOOD]: t('auth.passwordStrength.good'),
    [PASSWORD_STRENGTH.STRONG]: t('auth.passwordStrength.strong'),
    [PASSWORD_STRENGTH.VERY_STRONG]: t('auth.passwordStrength.veryStrong'),
  };
  const strengthLabel = passwordStrength.strength !== undefined ? strengthLabelMap[passwordStrength.strength] : '';

  return (
    <StyledContainer style={style} className={className} data-testid={testID}>
      <TextField
        label={defaultLabel}
        placeholder={defaultPlaceholder}
        value={value}
        onChange={onChange}
        onChangeText={onChangeText}
        type="password"
        required={required}
        disabled={disabled}
        errorMessage={errorMessage}
        autoComplete={autoComplete}
        accessibilityLabel={accessibilityLabel || defaultLabel}
        testID={testID}
        {...rest}
      />
      {showStrengthIndicator && value && (
        <StyledPasswordStrength>
          <StyledPasswordStrengthBar
            strength={passwordStrength.strength}
            color={passwordStrength.color}
          />
          {strengthLabel && (
            <StyledPasswordStrengthLabel color={passwordStrength.color}>
              {strengthLabel}
            </StyledPasswordStrengthLabel>
          )}
        </StyledPasswordStrength>
      )}
    </StyledContainer>
  );
};

export default PasswordFieldWeb;

