/**
 * Select Component - Android
 * Picker/dropdown primitive for Android platform
 * File: Select.android.jsx
 */

import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Dimensions, Modal } from 'react-native';
import useSelect from './useSelect';
import { useI18n } from '@hooks';
import { VALIDATION_STATES } from './types';
import {
  StyledContainer,
  StyledLabelRow,
  StyledLabel,
  StyledRequired,
  StyledTrigger,
  StyledTriggerText,
  StyledChevron,
  StyledOverlay,
  StyledSheet,
  StyledOptionList,
  StyledOption,
  StyledOptionText,
  StyledHelperText,
} from './Select.android.styles';

/**
 * @typedef {Object} SelectOption
 * @property {string} label
 * @property {string|number} value
 * @property {boolean} [disabled]
 */

/**
 * @param {Object} props
 * @param {string} [props.label]
 * @param {string} [props.placeholder]
 * @param {SelectOption[]} props.options
 * @param {string|number|null|undefined} props.value
 * @param {(value: any) => void} props.onValueChange
 * @param {boolean} [props.required]
 * @param {boolean} [props.disabled]
 * @param {string} [props.validationState]
 * @param {string} [props.errorMessage]
 * @param {string} [props.helperText]
 * @param {(value: any) => boolean|{valid: boolean, error?: string}} [props.validate]
 * @param {string} [props.accessibilityLabel]
 * @param {string} [props.accessibilityHint]
 * @param {string} [props.testID]
 * @param {Object} [props.style]
 */
const SelectAndroid = ({
  label,
  placeholder,
  options = [],
  value,
  onValueChange,
  required = false,
  disabled = false,
  validationState,
  errorMessage,
  helperText,
  validate,
  accessibilityLabel,
  accessibilityHint,
  testID,
  style,
}) => {
  const { t } = useI18n();
  const defaultPlaceholder = placeholder || t('common.selectPlaceholder');
  
  const {
    open,
    isFocused,
    validationState: internalValidationState,
    errorMessage: internalErrorMessage,
    selectedOption,
    openSelect,
    closeSelect,
    handleFocus,
    handleBlur,
    handleSelect,
  } = useSelect({ value, options, onValueChange, required, validate });

  const finalValidationState = validationState || (disabled ? VALIDATION_STATES.DISABLED : internalValidationState);
  const finalErrorMessage = errorMessage || internalErrorMessage;
  const displayHelperText = finalErrorMessage || helperText;

  const triggerRef = useRef(null);
  const [menuPosition, setMenuPosition] = useState({
    top: 0,
    left: 0,
    right: undefined,
    width: 0,
    maxHeight: 240,
    placement: 'bottom',
    align: 'left',
  });

  const computeMenuPosition = useCallback(() => {
    if (!triggerRef.current?.measureInWindow) return;
    const window = Dimensions.get('window');
    triggerRef.current.measureInWindow((x, y, width, height) => {
      const gap = 8;
      const spaceBelow = window.height - (y + height);
      const spaceAbove = y;
      const spaceRight = window.width - x;
      const spaceLeft = x + width;
      const placement = spaceBelow >= spaceAbove ? 'bottom' : 'top';
      const availableHeight = placement === 'bottom' ? spaceBelow : spaceAbove;
      const maxHeight = Math.min(240, Math.max(availableHeight - gap, 120));
      const resolvedWidth = Math.min(width, window.width - gap * 2);
      const align = spaceRight >= spaceLeft ? 'left' : 'right';
      let left;
      let right;
      if (align === 'left') {
        left = Math.min(Math.max(x, gap), window.width - resolvedWidth - gap);
      } else {
        right = Math.min(Math.max(window.width - (x + width), gap), window.width - resolvedWidth - gap);
      }
      let top = placement === 'bottom' ? y + height + gap : y - maxHeight - gap;
      if (top < gap) top = gap;
      if (top + maxHeight > window.height - gap) {
        top = Math.max(gap, window.height - maxHeight - gap);
      }

      setMenuPosition({
        top,
        left,
        right,
        width: resolvedWidth,
        maxHeight,
        placement,
        align,
      });
    });
  }, []);

  useEffect(() => {
    if (!open) return;
    computeMenuPosition();
    const subscription = Dimensions.addEventListener('change', computeMenuPosition);
    return () => subscription?.remove?.();
  }, [open, computeMenuPosition]);

  return (
    <StyledContainer style={style}>
      {label ? (
        <StyledLabelRow>
          <StyledLabel>{label}</StyledLabel>
          {required ? <StyledRequired> *</StyledRequired> : null}
        </StyledLabelRow>
      ) : null}

      <StyledTrigger
        ref={triggerRef}
        onPress={disabled ? undefined : openSelect}
        onFocus={handleFocus}
        onBlur={handleBlur}
        disabled={disabled}
        validationState={finalValidationState}
        isFocused={isFocused}
        accessibilityRole="button"
        accessibilityLabel={accessibilityLabel || label || defaultPlaceholder}
        accessibilityHint={accessibilityHint || displayHelperText}
        accessibilityState={{ disabled }}
        testID={testID}
      >
        <StyledTriggerText disabled={disabled} isPlaceholder={!selectedOption}>
          {selectedOption ? selectedOption.label : defaultPlaceholder}
        </StyledTriggerText>
        <StyledChevron aria-hidden>▾</StyledChevron>
      </StyledTrigger>

      {displayHelperText ? (
        <StyledHelperText validationState={finalValidationState}>{displayHelperText}</StyledHelperText>
      ) : null}

      <Modal transparent visible={open} animationType="fade" onRequestClose={closeSelect}>
        <StyledOverlay onPress={closeSelect} accessibilityRole="button" accessibilityLabel={t('common.closeSelect')}>
          <StyledSheet
            $top={menuPosition.top}
            $left={menuPosition.left}
            $right={menuPosition.right}
            $width={menuPosition.width}
            $maxHeight={menuPosition.maxHeight}
          >
            <StyledOptionList>
              {options.map((opt, index) => (
                <StyledOption
                  key={`${String(opt.value)}-${index}`}
                  disabled={!!opt.disabled}
                  onPress={() => {
                    if (opt.disabled) return;
                    handleSelect(opt.value);
                  }}
                  accessibilityRole="button"
                  accessibilityLabel={opt.label}
                  testID={testID ? `${testID}-option-${index}` : undefined}
                >
                  <StyledOptionText>{opt.label}</StyledOptionText>
                </StyledOption>
              ))}
            </StyledOptionList>
          </StyledSheet>
        </StyledOverlay>
      </Modal>
    </StyledContainer>
  );
};

export default SelectAndroid;


