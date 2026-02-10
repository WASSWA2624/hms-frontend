/**
 * SearchBar - Web
 * Input + Icon + Clear composition; Microsoft Fluent look
 * File: SearchBar.web.jsx
 */

import React from 'react';
import { useI18n } from '@hooks';
import {
  StyledClearButton,
  StyledClearIcon,
  StyledContainer,
  StyledInput,
  StyledSearchButton,
  StyledSearchIcon,
} from './SearchBar.web.styles';
import useSearchBar from './useSearchBar';

const SearchBarWeb = ({
  value = '',
  onChange,
  onSearch,
  placeholder,
  showClearButton = true,
  debounceMs = 300,
  accessibilityLabel,
  testID,
  className,
  ...rest
}) => {
  const { t } = useI18n();
  const {
    localValue,
    hasValue,
    handleChange,
    handleClear,
    handleSubmit,
  } = useSearchBar({
    value,
    onChange,
    onSearch,
    debounceMs,
  });

  const placeholderText = placeholder || t('common.searchPlaceholder');
  const searchIconLabel = t('common.searchIcon');
  const clearButtonLabel = t('common.clearSearch');
  const accessibilityLabelText = accessibilityLabel;

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSubmit();
    }
  };

  const searchRegionLabel = accessibilityLabelText || placeholderText || searchIconLabel;
  const inputLabel = accessibilityLabelText || placeholderText || searchIconLabel;

  return (
    <StyledContainer
      className={className}
      data-testid={testID}
      testID={testID}
      role="search"
      aria-label={searchRegionLabel}
      {...rest}
    >
      <StyledInput
        value={localValue}
        onChange={handleChange}
        onKeyPress={handleKeyPress}
        placeholder={placeholderText}
        type="search"
        aria-label={inputLabel}
        data-testid={testID ? `${testID}-input` : undefined}
      />
      {showClearButton && hasValue && (
        <StyledClearButton
          type="button"
          onClick={handleClear}
          aria-label={clearButtonLabel}
          data-testid={testID ? `${testID}-clear` : undefined}
        >
          <StyledClearIcon viewBox="0 0 24 24" aria-hidden="true" focusable="false">
            <line x1="7" y1="7" x2="17" y2="17" />
            <line x1="17" y1="7" x2="7" y2="17" />
          </StyledClearIcon>
        </StyledClearButton>
      )}
      <StyledSearchButton
        type="button"
        onClick={() => handleSubmit()}
        aria-label={searchIconLabel}
        data-testid={testID ? `${testID}-submit` : undefined}
      >
        <StyledSearchIcon viewBox="0 0 24 24" aria-hidden="true" focusable="false">
          <circle cx="11" cy="11" r="6.5" />
          <line x1="16" y1="16" x2="21" y2="21" />
        </StyledSearchIcon>
      </StyledSearchButton>
    </StyledContainer>
  );
};

export default SearchBarWeb;
