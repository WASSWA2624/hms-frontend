/**
 * Select Component - Web
 * Picker/dropdown primitive for Web platform (keyboard accessible)
 * File: Select.web.jsx
 */
// 1. External dependencies
import React, { useCallback, useEffect, useId, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

// 2. Platform components (from barrel file) - N/A for Select

// 3. Hooks and utilities (absolute imports via aliases)
import { useI18n } from '@hooks';
import { humanizeDisplayText, humanizeIdentifier } from '@utils';

// 4. Styles (relative import - platform-specific)
import {
  StyledContainer,
  StyledLabelRow,
  StyledLabel,
  StyledRequired,
  StyledTrigger,
  StyledTriggerText,
  StyledChevron,
  StyledMenu,
  StyledSearchContainer,
  StyledSearchInput,
  StyledOption,
  StyledOptionText,
  StyledNoResults,
  StyledHelperText,
} from './Select.web.styles';

// 5. Component-specific hook (relative import)
import useSelect from './useSelect';

// 6. Types and constants (relative import)
import { VALIDATION_STATES } from './types';

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
 * @param {string} [props.className]
 * @param {Object} [props.style]
 * @param {boolean} [props.compact]
 * @param {boolean} [props.searchable]
 */
const SelectWeb = ({
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
  className,
  style,
  compact = false,
  searchable = false,
}) => {
  const { t } = useI18n();
  const defaultPlaceholder = placeholder || t('common.selectPlaceholder');
  const compactAttr = compact ? 'true' : 'false';
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
    toggleSelect,
    handleFocus,
    handleBlur,
    handleSelect,
  } = useSelect({ value, options: sanitizedOptions, onValueChange, required, validate });

  const finalValidationState = validationState || (disabled ? VALIDATION_STATES.DISABLED : internalValidationState);
  const finalErrorMessage = errorMessage || internalErrorMessage;
  const displayHelperText = finalErrorMessage || helperText;

  const rootRef = useRef(null);
  const triggerRef = useRef(null);
  const menuRef = useRef(null);
  const searchInputRef = useRef(null);
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const [searchQuery, setSearchQuery] = useState('');
  const helperId = useId();
  const resolvedHelperId = testID ? `${testID}-helper` : helperId;
  const [menuPosition, setMenuPosition] = useState({
    placement: 'bottom',
    align: 'left',
    top: 0,
    left: 0,
    right: undefined,
    width: 0,
    maxHeight: 240,
  });
  const longestOptionLabelLength = useMemo(() => options.reduce((longest, option) => {
    const raw = option?.label ?? option?.value ?? '';
    return Math.max(longest, String(raw).length);
  }, 0), [options]);

  const normalizedSearchQuery = useMemo(
    () => String(searchQuery || '').trim().toLowerCase(),
    [searchQuery]
  );

  const filteredOptions = useMemo(() => {
    if (!searchable || !normalizedSearchQuery) return sanitizedOptions;
    return sanitizedOptions.filter((option) => (
      String(option?.label || '').toLowerCase().includes(normalizedSearchQuery)
    ));
  }, [searchable, normalizedSearchQuery, sanitizedOptions]);

  const computeMenuPosition = useCallback(() => {
    if (!triggerRef.current) return;
    const rect = triggerRef.current.getBoundingClientRect();
    const gap = 8;
    const viewportWidth = window.innerWidth || 0;
    const viewportHeight = window.innerHeight || 0;
    const spaceBelow = Math.max(0, viewportHeight - rect.bottom - gap);
    const spaceAbove = Math.max(0, rect.top - gap);
    const placement = spaceBelow >= spaceAbove ? 'bottom' : 'top';
    const availableHeight = placement === 'bottom' ? spaceBelow : spaceAbove;
    const maxHeight = availableHeight > 0 ? Math.min(320, availableHeight) : 240;
    const measuredMenuWidth = menuRef.current?.scrollWidth ?? 0;
    const estimatedLabelWidth = longestOptionLabelLength > 0
      ? longestOptionLabelLength * 7.2 + 52
      : rect.width;
    const desiredWidth = Math.max(
      rect.width,
      Math.min(Math.max(measuredMenuWidth, estimatedLabelWidth), 420)
    );
    const maxWidth = Math.max(120, viewportWidth - gap * 2);
    const width = Math.min(desiredWidth, maxWidth);

    const measuredMenuHeight = menuRef.current ? menuRef.current.scrollHeight : 0;
    const optionCount = menuRef.current
      ? menuRef.current.querySelectorAll('[role="option"]').length
      : 0;
    const estimatedOptionHeight = compact ? 36 : 44;
    const estimatedMenuHeight = measuredMenuHeight
      || Math.max(estimatedOptionHeight, optionCount * estimatedOptionHeight);
    const menuHeight = Math.min(maxHeight, estimatedMenuHeight);

    const spaceRight = Math.max(0, viewportWidth - rect.left - gap);
    const spaceLeft = Math.max(0, rect.right - gap);
    const align = spaceRight >= width || spaceRight >= spaceLeft ? 'left' : 'right';

    let left;
    let right;
    if (align === 'left') {
      left = Math.min(Math.max(rect.left, gap), Math.max(gap, viewportWidth - width - gap));
      right = undefined;
    } else {
      right = Math.min(
        Math.max(viewportWidth - rect.right, gap),
        Math.max(gap, viewportWidth - width - gap)
      );
      left = undefined;
    }

    let top = placement === 'bottom'
      ? rect.bottom + gap
      : rect.top - menuHeight - gap;
    const maxTop = Math.max(gap, viewportHeight - menuHeight - gap);
    top = Math.min(Math.max(top, gap), maxTop);

    setMenuPosition({
      placement,
      align,
      top,
      left,
      right,
      width,
      maxHeight,
    });
  }, [compact, longestOptionLabelLength]);

  // Close on outside click
  useEffect(() => {
    if (!open) return;

    const handleClickOutside = (event) => {
      if (
        rootRef.current &&
        !rootRef.current.contains(event.target) &&
        (!menuRef.current || !menuRef.current.contains(event.target))
      ) {
        closeSelect();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [closeSelect, open]);

  // Reset focused index when menu opens/closes
  useEffect(() => {
    if (open) {
      setFocusedIndex(-1);
    } else {
      setSearchQuery('');
    }
  }, [open]);

  // Focus search input (searchable) or first option when menu opens
  useEffect(() => {
    if (!open || !menuRef.current) return;

    if (searchable && searchInputRef.current) {
      searchInputRef.current.focus();
      return;
    }

    if (!searchable) {
      const firstOption = menuRef.current.querySelector('[role="option"]:not([aria-disabled="true"])');
      if (firstOption) {
        firstOption.focus();
      }
    }
  }, [open, searchable]);

  useEffect(() => {
    if (!open) return;
    computeMenuPosition();
    let rafId;
    let timeoutId;
    if (typeof window.requestAnimationFrame === 'function') {
      rafId = window.requestAnimationFrame(() => {
        computeMenuPosition();
      });
    } else {
      timeoutId = window.setTimeout(() => {
        computeMenuPosition();
      }, 0);
    }
    const handleResize = () => computeMenuPosition();
    window.addEventListener('resize', handleResize);
    window.addEventListener('scroll', handleResize, true);
    return () => {
      if (rafId != null && typeof window.cancelAnimationFrame === 'function') {
        window.cancelAnimationFrame(rafId);
      }
      if (timeoutId != null) {
        window.clearTimeout(timeoutId);
      }
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('scroll', handleResize, true);
    };
  }, [open, computeMenuPosition, normalizedSearchQuery, filteredOptions.length]);

  const handleTriggerKeyDown = (e) => {
    if (disabled) return;
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      toggleSelect();
    }
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      openSelect();
    }
    if (e.key === 'Escape') {
      e.preventDefault();
      closeSelect();
    }
  };

  const handleMenuKeyDown = (e) => {
    if (disabled) return;

    const enabledOptions = filteredOptions.filter((opt) => !opt.disabled);
    const currentIndex = enabledOptions.findIndex((opt) => filteredOptions.indexOf(opt) === focusedIndex);

    if (enabledOptions.length === 0) {
      if (e.key === 'Escape') {
        e.preventDefault();
        closeSelect();
      }
      return;
    }

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      const nextIndex = currentIndex < enabledOptions.length - 1 ? currentIndex + 1 : 0;
      const nextOption = enabledOptions[nextIndex];
      const nextOptionIndex = filteredOptions.indexOf(nextOption);
      setFocusedIndex(nextOptionIndex);
      if (menuRef.current) {
        const optionElement = testID
          ? menuRef.current.querySelector(`[data-testid="${testID}-option-${nextOptionIndex}"]`)
          : menuRef.current.querySelectorAll('[role="option"]')[nextOptionIndex];
        if (optionElement) {
          optionElement.focus();
        }
      }
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      const prevIndex = currentIndex > 0 ? currentIndex - 1 : enabledOptions.length - 1;
      const prevOption = enabledOptions[prevIndex];
      const prevOptionIndex = filteredOptions.indexOf(prevOption);
      setFocusedIndex(prevOptionIndex);
      if (menuRef.current) {
        const optionElement = testID
          ? menuRef.current.querySelector(`[data-testid="${testID}-option-${prevOptionIndex}"]`)
          : menuRef.current.querySelectorAll('[role="option"]')[prevOptionIndex];
        if (optionElement) {
          optionElement.focus();
        }
      }
    } else if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      if (currentIndex >= 0 && currentIndex < enabledOptions.length) {
        handleSelect(enabledOptions[currentIndex].value);
      }
    } else if (e.key === 'Escape') {
      e.preventDefault();
      closeSelect();
      if (rootRef.current) {
        const trigger = rootRef.current.querySelector('[role="combobox"]');
        if (trigger) {
          trigger.focus();
        }
      }
    }
  };

  const handleSearchInputKeyDown = useCallback((event) => {
    if (event.key === 'Escape') {
      event.preventDefault();
      closeSelect();
      triggerRef.current?.focus?.();
      return;
    }
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      const firstEnabledIndex = filteredOptions.findIndex((option) => !option.disabled);
      if (firstEnabledIndex < 0) return;
      setFocusedIndex(firstEnabledIndex);
      if (menuRef.current) {
        const optionElement = testID
          ? menuRef.current.querySelector(`[data-testid="${testID}-option-${firstEnabledIndex}"]`)
          : menuRef.current.querySelectorAll('[role="option"]')[firstEnabledIndex];
        optionElement?.focus?.();
      }
    }
  }, [closeSelect, filteredOptions, testID]);

  return (
    <StyledContainer
      ref={rootRef}
      style={style}
      className={className}
      data-compact={compactAttr}
    >
      {label ? (
        <StyledLabelRow data-compact={compactAttr}>
          <StyledLabel>{label}</StyledLabel>
          {required ? <StyledRequired> *</StyledRequired> : null}
        </StyledLabelRow>
      ) : null}

      <StyledTrigger
        ref={triggerRef}
        onClick={disabled ? undefined : toggleSelect}
        onFocus={handleFocus}
        onBlur={handleBlur}
        onKeyDown={handleTriggerKeyDown}
        disabled={disabled}
        data-validation-state={finalValidationState}
        data-focused={isFocused ? 'true' : 'false'}
        data-compact={compactAttr}
        role="combobox"
        aria-label={accessibilityLabel || label || defaultPlaceholder}
        aria-describedby={displayHelperText ? resolvedHelperId : undefined}
        aria-expanded={open}
        aria-haspopup="listbox"
        aria-invalid={finalValidationState === 'error'}
        aria-required={required}
        data-testid={testID}
      >
        <StyledTriggerText
          data-disabled={disabled ? 'true' : 'false'}
          data-placeholder={!selectedOption ? 'true' : 'false'}
          data-compact={compactAttr}
        >
          {selectedOption ? selectedOption.label : defaultPlaceholder}
        </StyledTriggerText>
        <StyledChevron
          aria-hidden="true"
          data-compact={compactAttr}
          data-open={open ? 'true' : 'false'}
        />
      </StyledTrigger>

      {open
        ? createPortal(
          <StyledMenu
            ref={menuRef}
            role="listbox"
            onKeyDown={handleMenuKeyDown}
            data-testid={testID ? `${testID}-menu` : undefined}
            data-placement={menuPosition.placement}
            data-align={menuPosition.align}
            data-top={String(menuPosition.top)}
            data-left={menuPosition.left != null ? String(menuPosition.left) : undefined}
            data-right={menuPosition.right != null ? String(menuPosition.right) : undefined}
            data-width={String(menuPosition.width)}
            data-max-height={String(menuPosition.maxHeight)}
          >
            {searchable ? (
              <StyledSearchContainer>
                <StyledSearchInput
                  ref={searchInputRef}
                  type="search"
                  value={searchQuery}
                  onChange={(event) => setSearchQuery(event.target.value)}
                  onKeyDown={handleSearchInputKeyDown}
                  placeholder={t('common.searchPlaceholder')}
                  aria-label={t('common.search')}
                  data-testid={testID ? `${testID}-search-input` : undefined}
                />
              </StyledSearchContainer>
            ) : null}
            {filteredOptions.length > 0 ? filteredOptions.map((opt, index) => (
              <StyledOption
                key={`${String(opt.value)}-${index}`}
                disabled={!!opt.disabled}
                onClick={() => {
                  if (opt.disabled) return;
                  handleSelect(opt.value);
                }}
                onFocus={() => setFocusedIndex(index)}
                role="option"
                aria-selected={value === opt.value}
                aria-disabled={opt.disabled}
                aria-label={opt.label}
                tabIndex={opt.disabled ? -1 : index === 0 ? 0 : -1}
                data-testid={testID ? `${testID}-option-${index}` : undefined}
              >
                <StyledOptionText>{opt.label}</StyledOptionText>
              </StyledOption>
            )) : (
              <StyledNoResults data-testid={testID ? `${testID}-no-results` : undefined}>
                {t('listScaffold.emptyState.title')}
              </StyledNoResults>
            )}
          </StyledMenu>,
          document.body
        )
        : null}

      {displayHelperText ? (
        <StyledHelperText
          data-validation-state={finalValidationState}
          id={resolvedHelperId}
        >
          {displayHelperText}
        </StyledHelperText>
      ) : null}
    </StyledContainer>
  );
};

export default SelectWeb;


