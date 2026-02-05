/**
 * SearchBar - Web
 * Input + Icon + Clear composition; Microsoft Fluent look
 * File: SearchBar.web.jsx
 */

import React from 'react';
import { Button, TextField } from '@platform/components';
import { useI18n } from '@hooks';
import { StyledContainer, StyledSearchIcon, StyledTextFieldWrapper } from './SearchBar.web.styles';
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

  return (
    <StyledContainer
      className={className}
      data-testid={testID}
      testID={testID}
      role="search"
      aria-label={searchRegionLabel}
      {...rest}
    >
      <StyledSearchIcon
        accessibilityLabel={searchIconLabel}
        aria-hidden="true"
        data-testid={testID ? `${testID}-icon` : undefined}
        testID={testID ? `${testID}-icon` : undefined}
      >
        🔍
      </StyledSearchIcon>
      <StyledTextFieldWrapper>
        <TextField
          value={localValue}
          onChange={handleChange}
          onKeyPress={handleKeyPress}
          placeholder={placeholderText}
          type="search"
          {...(accessibilityLabelText && { accessibilityLabel: accessibilityLabelText })}
          testID={testID ? `${testID}-input` : undefined}
        />
      </StyledTextFieldWrapper>
      {showClearButton && hasValue && (
        <Button
          variant="text"
          size="small"
          onClick={handleClear}
          accessibilityLabel={clearButtonLabel}
          testID={testID ? `${testID}-clear` : undefined}
        >
          ✕
        </Button>
      )}
    </StyledContainer>
  );
};

export default SearchBarWeb;
