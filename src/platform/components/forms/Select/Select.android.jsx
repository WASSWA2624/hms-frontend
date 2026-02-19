/**
 * Select Component - Android
 * Picker/dropdown primitive for Android platform
 * File: Select.android.jsx
 */

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Dimensions, Modal } from 'react-native';
import useSelect from './useSelect';
import { useI18n } from '@hooks';
import { humanizeDisplayText, humanizeIdentifier } from '@utils';
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
  StyledSearchContainer,
  StyledSearchInput,
  StyledOptionList,
  StyledOption,
  StyledOptionText,
  StyledNoResults,
  StyledNoResultsText,
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
 * @param {boolean} [props.searchable]
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
  compact = false,
  style,
  searchable = false,
}) => {
  const { t } = useI18n();
  const defaultPlaceholder = placeholder || t('common.selectPlaceholder');
  const sanitizedOptions = useMemo(
    () => options.map((option) => {
      const sanitizedLabel = humanizeDisplayText(option?.label);
      const valueFallback = humanizeIdentifier(option?.value);
      return {
        ...option,
        label: sanitizedLabel || valueFallback || t('common.notAvailable'),
      };
    }),
    [options, t]
  );
  
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
  } = useSelect({ value, options: sanitizedOptions, onValueChange, required, validate });

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
  const [searchQuery, setSearchQuery] = useState('');
  const normalizedSearchQuery = useMemo(
    () => String(searchQuery || '').trim().toLowerCase(),
    [searchQuery]
  );
  const longestOptionLabelLength = useMemo(
    () => sanitizedOptions.reduce((longest, option) => {
      const labelLength = String(option?.label || '').length;
      return Math.max(longest, labelLength);
    }, 0),
    [sanitizedOptions]
  );
  const filteredOptions = useMemo(() => {
    if (!searchable || !normalizedSearchQuery) return sanitizedOptions;
    return sanitizedOptions.filter((option) => (
      String(option?.label || '').toLowerCase().includes(normalizedSearchQuery)
    ));
  }, [searchable, normalizedSearchQuery, sanitizedOptions]);

  const computeMenuPosition = useCallback(() => {
    if (!triggerRef.current?.measureInWindow) return;
    const window = Dimensions.get('window');
    triggerRef.current.measureInWindow((x, y, width, height) => {
      const gap = 8;
      const spaceBelow = Math.max(0, window.height - (y + height) - gap);
      const spaceAbove = Math.max(0, y - gap);
      const maxWidth = Math.max(140, window.width - gap * 2);
      const estimatedLabelWidth = longestOptionLabelLength > 0
        ? longestOptionLabelLength * 7.2 + 56
        : width;
      const desiredWidth = Math.max(
        width,
        Math.min(Math.max(estimatedLabelWidth, width), 420)
      );
      const resolvedWidth = Math.min(desiredWidth, maxWidth);

      const spaceRight = Math.max(0, window.width - x - gap);
      const spaceLeft = Math.max(0, x + width - gap);
      const placement = spaceBelow >= spaceAbove ? 'bottom' : 'top';
      const availableHeight = placement === 'bottom' ? spaceBelow : spaceAbove;
      const maxHeight = Math.max(120, Math.min(320, availableHeight || 240));
      const align = spaceRight >= resolvedWidth || spaceRight >= spaceLeft ? 'left' : 'right';
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
  }, [longestOptionLabelLength]);

  useEffect(() => {
    if (!open) return;
    computeMenuPosition();
    const subscription = Dimensions.addEventListener('change', computeMenuPosition);
    return () => subscription?.remove?.();
  }, [open, computeMenuPosition]);

  useEffect(() => {
    if (open) return;
    setSearchQuery('');
  }, [open]);

  return (
    <StyledContainer style={style} $compact={compact}>
      {label ? (
        <StyledLabelRow $compact={compact}>
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
        $compact={compact}
        accessibilityRole="button"
        accessibilityLabel={accessibilityLabel || label || defaultPlaceholder}
        accessibilityHint={accessibilityHint || displayHelperText}
        accessibilityState={{ disabled }}
        testID={testID}
      >
        <StyledTriggerText disabled={disabled} isPlaceholder={!selectedOption} $compact={compact}>
          {selectedOption ? selectedOption.label : defaultPlaceholder}
        </StyledTriggerText>
        <StyledChevron aria-hidden $compact={compact}>v</StyledChevron>
      </StyledTrigger>

      {displayHelperText ? (
        <StyledHelperText validationState={finalValidationState}>{displayHelperText}</StyledHelperText>
      ) : null}

      <Modal transparent visible={open} animationType="fade" onRequestClose={closeSelect}>
        <StyledOverlay onPress={closeSelect} accessibilityRole="button" accessibilityLabel={t('common.closeSelect')}>
          <StyledSheet
            testID={testID ? `${testID}-menu-sheet` : undefined}
            $top={menuPosition.top}
            $left={menuPosition.left}
            $right={menuPosition.right}
            $width={menuPosition.width}
            $maxHeight={menuPosition.maxHeight}
          >
            {searchable ? (
              <StyledSearchContainer>
                <StyledSearchInput
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                  placeholder={t('common.searchPlaceholder')}
                  accessibilityLabel={t('common.search')}
                  testID={testID ? `${testID}-search-input` : undefined}
                />
              </StyledSearchContainer>
            ) : null}
            <StyledOptionList keyboardShouldPersistTaps="handled">
              {filteredOptions.length > 0 ? filteredOptions.map((opt, index) => (
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
              )) : (
                <StyledNoResults testID={testID ? `${testID}-no-results` : undefined}>
                  <StyledNoResultsText>{t('listScaffold.emptyState.title')}</StyledNoResultsText>
                </StyledNoResults>
              )}
            </StyledOptionList>
          </StyledSheet>
        </StyledOverlay>
      </Modal>
    </StyledContainer>
  );
};

export default SelectAndroid;


