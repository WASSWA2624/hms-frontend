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
        onChangeText={handleChange}
        onKeyPress={handleKeyPress}
        placeholder={placeholderText}
        type="search"
        aria-label={inputLabel}
        testID={testID ? `${testID}-input` : undefined}
        data-testid={testID ? `${testID}-input` : undefined}
      />
      {showClearButton && hasValue && (
        <StyledClearButton
          type="button"
          onClick={handleClear}
          onPress={handleClear}
          aria-label={clearButtonLabel}
          testID={testID ? `${testID}-clear` : undefined}
          data-testid={testID ? `${testID}-clear` : undefined}
        >
          <StyledClearIcon aria-hidden="true">x</StyledClearIcon>
        </StyledClearButton>
      )}
      <StyledSearchButton
        type="button"
        onClick={() => handleSubmit()}
        onPress={() => handleSubmit()}
        aria-label={searchIconLabel}
        testID={testID ? `${testID}-submit` : undefined}
        data-testid={testID ? `${testID}-submit` : undefined}
      >
        <StyledSearchIcon aria-hidden="true">/</StyledSearchIcon>
      </StyledSearchButton>
    </StyledContainer>
  );
};

export default SearchBarWeb;
