import React, { useEffect, useMemo, useRef, useState } from 'react';
import styled from 'styled-components/native';
import { useI18n } from '@hooks';
import Select from '../Select';
import TextField from '../TextField';
import { PHONE_COUNTRY_FALLBACK_DATA } from './phoneCountryData';

const COUNTRY_OPTION_CACHE = new Map();
const DEFAULT_COUNTRY_CODE = 'UG';
const DEFAULT_MAX_LENGTH = 40;

const StyledRow = styled.View`
  width: 100%;
  flex-direction: row;
  flex-wrap: wrap;
  gap: 8px;
  align-items: flex-end;
`;

const StyledCountryCodeField = styled.View`
  min-width: 160px;
  flex-grow: 0;
  flex-shrink: 0;
  width: 220px;
`;

const StyledPhoneNumberField = styled.View`
  min-width: 220px;
  flex-grow: 1;
  flex-shrink: 1;
`;

const normalizeString = (value) => String(value || '').trim();
const normalizeDigits = (value) => normalizeString(value).replace(/\D/g, '');

const resolveTranslation = (t, key, fallback) => {
  if (!key || typeof t !== 'function') return fallback;
  const translated = t(key);
  const normalized = normalizeString(translated);
  if (!normalized || normalized === key) return fallback;
  return translated;
};

const toFlagEmoji = (countryCode) => {
  const normalizedCode = normalizeString(countryCode).toUpperCase();
  if (!/^[A-Z]{2}$/.test(normalizedCode)) return '';
  const first = normalizedCode.codePointAt(0) + 127397;
  const second = normalizedCode.codePointAt(1) + 127397;
  return String.fromCodePoint(first, second);
};

const resolveLocalizedCountryName = (displayNames, code, fallbackName) => {
  if (!displayNames || typeof displayNames.of !== 'function') {
    return fallbackName;
  }
  try {
    const localized = normalizeString(displayNames.of(code));
    if (!localized || localized.toUpperCase() === code) {
      return fallbackName;
    }
    return localized;
  } catch {
    return fallbackName;
  }
};

const buildCountryOptionsForLocale = (locale = 'en') => {
  const normalizedLocale = normalizeString(locale) || 'en';
  if (COUNTRY_OPTION_CACHE.has(normalizedLocale)) {
    return COUNTRY_OPTION_CACHE.get(normalizedLocale);
  }

  let displayNames;
  if (typeof Intl !== 'undefined' && typeof Intl.DisplayNames === 'function') {
    try {
      displayNames = new Intl.DisplayNames([normalizedLocale], { type: 'region' });
    } catch {
      displayNames = null;
    }
  }

  const options = PHONE_COUNTRY_FALLBACK_DATA
    .map((country) => {
      const code = normalizeString(country?.code).toUpperCase();
      const fallbackName = normalizeString(country?.name);
      const dialCode = normalizeString(country?.dialCode);
      if (!/^[A-Z]{2}$/.test(code) || !fallbackName || !/^\+\d+$/.test(dialCode)) {
        return null;
      }

      const localizedName = resolveLocalizedCountryName(displayNames, code, fallbackName);
      const flag = toFlagEmoji(code);
      const dialDigits = normalizeDigits(dialCode);

      return {
        value: code,
        label: flag ? `${flag} ${localizedName} (${dialCode})` : `${localizedName} (${dialCode})`,
        countryName: localizedName,
        dialCode,
        dialDigits,
      };
    })
    .filter(Boolean)
    .sort((left, right) => left.countryName.localeCompare(right.countryName));

  COUNTRY_OPTION_CACHE.set(normalizedLocale, options);
  return options;
};

const findCountryOptionByCode = (options, countryCode) => {
  const normalizedCode = normalizeString(countryCode).toUpperCase();
  if (!normalizedCode) return null;
  return options.find((option) => option.value === normalizedCode) || null;
};

const buildPhoneValue = (countryCode, phoneNumber, options) => {
  const normalizedPhoneDigits = normalizeDigits(phoneNumber);
  if (!normalizedPhoneDigits) return '';

  const selectedCountry = findCountryOptionByCode(options, countryCode) || options[0];
  if (!selectedCountry?.dialCode) return normalizedPhoneDigits;
  return `${selectedCountry.dialCode}${normalizedPhoneDigits}`;
};

const parsePhoneValue = (value, options, fallbackCountryCode) => {
  const fallbackCountry = (
    findCountryOptionByCode(options, fallbackCountryCode)
    || options[0]
    || null
  );
  const fallbackCode = fallbackCountry?.value || '';
  const normalizedValue = normalizeString(value);

  if (!normalizedValue) {
    return { countryCode: fallbackCode, phoneNumber: '' };
  }

  const numericValue = normalizeDigits(normalizedValue);
  if (!numericValue) {
    return { countryCode: fallbackCode, phoneNumber: '' };
  }

  if (normalizedValue.startsWith('+')) {
    const sortedByDialLength = [...options].sort(
      (left, right) => right.dialDigits.length - left.dialDigits.length
    );
    const matchedCountry = sortedByDialLength.find((option) => (
      option.dialDigits && numericValue.startsWith(option.dialDigits)
    ));

    if (matchedCountry) {
      return {
        countryCode: matchedCountry.value,
        phoneNumber: numericValue.slice(matchedCountry.dialDigits.length),
      };
    }
  }

  return {
    countryCode: fallbackCode,
    phoneNumber: numericValue,
  };
};

const resolveInputValue = (valueOrEvent) => (
  valueOrEvent?.target?.value
  ?? valueOrEvent?.nativeEvent?.text
  ?? valueOrEvent
  ?? ''
);

const emitChanges = (nextValue, { onValueChange, onChangeText, onChange }) => {
  if (typeof onValueChange === 'function') {
    onValueChange(nextValue);
  }
  if (typeof onChangeText === 'function') {
    onChangeText(nextValue);
  }
  if (typeof onChange === 'function') {
    onChange({
      target: { value: nextValue },
      nativeEvent: { text: nextValue },
    });
  }
};

const PhoneField = ({
  value = '',
  onValueChange,
  onChangeText,
  onChange,
  label,
  placeholder,
  helperText,
  errorMessage,
  required = false,
  disabled = false,
  maxLength = DEFAULT_MAX_LENGTH,
  defaultCountryCode = DEFAULT_COUNTRY_CODE,
  countryCodeLabel,
  countryCodePlaceholder,
  accessibilityLabel,
  accessibilityHint,
  searchable = true,
  compact = true,
  density = 'compact',
  testID,
}) => {
  const { t, locale } = useI18n();
  const options = useMemo(() => buildCountryOptionsForLocale(locale), [locale]);
  const normalizedDefaultCountryCode = normalizeString(defaultCountryCode).toUpperCase();

  const fallbackCountryCode = useMemo(() => {
    const fallbackMatch = findCountryOptionByCode(options, normalizedDefaultCountryCode);
    if (fallbackMatch) return fallbackMatch.value;
    return options[0]?.value || '';
  }, [options, normalizedDefaultCountryCode]);

  const [selectedCountryCode, setSelectedCountryCode] = useState(fallbackCountryCode);
  const [phoneNumber, setPhoneNumber] = useState('');
  const previousControlledValueRef = useRef(null);

  useEffect(() => {
    setSelectedCountryCode((currentValue) => {
      const currentMatch = findCountryOptionByCode(options, currentValue);
      if (currentMatch) return currentMatch.value;
      return fallbackCountryCode;
    });
  }, [options, fallbackCountryCode]);

  useEffect(() => {
    const normalizedIncomingValue = normalizeString(value);
    if (previousControlledValueRef.current === normalizedIncomingValue) return;
    previousControlledValueRef.current = normalizedIncomingValue;

    const parsedValue = parsePhoneValue(normalizedIncomingValue, options, fallbackCountryCode);
    setSelectedCountryCode(parsedValue.countryCode || fallbackCountryCode);
    setPhoneNumber(parsedValue.phoneNumber);
  }, [value, options, fallbackCountryCode]);

  const resolvedCountryCodeLabel = normalizeString(countryCodeLabel)
    || resolveTranslation(t, 'common.phone.countryCodeLabel', 'Country code');
  const resolvedCountryCodePlaceholder = normalizeString(countryCodePlaceholder)
    || resolveTranslation(t, 'common.phone.countryCodePlaceholder', 'Select code');

  const handleCountryCodeChange = (nextCountryCode) => {
    const matchedOption = findCountryOptionByCode(options, nextCountryCode);
    const resolvedCountryCode = matchedOption?.value || fallbackCountryCode;
    setSelectedCountryCode(resolvedCountryCode);

    const nextValue = buildPhoneValue(resolvedCountryCode, phoneNumber, options);
    emitChanges(nextValue, { onValueChange, onChangeText, onChange });
  };

  const handlePhoneNumberChange = (valueOrEvent) => {
    const nextPhoneNumber = normalizeDigits(resolveInputValue(valueOrEvent));
    setPhoneNumber(nextPhoneNumber);

    const nextValue = buildPhoneValue(selectedCountryCode, nextPhoneNumber, options);
    emitChanges(nextValue, { onValueChange, onChangeText, onChange });
  };

  return (
    <StyledRow>
      <StyledCountryCodeField>
        <Select
          label={resolvedCountryCodeLabel}
          value={selectedCountryCode}
          options={options}
          onValueChange={handleCountryCodeChange}
          placeholder={resolvedCountryCodePlaceholder}
          searchable={searchable}
          compact={compact}
          disabled={disabled}
          testID={testID ? `${testID}-country-code` : undefined}
        />
      </StyledCountryCodeField>

      <StyledPhoneNumberField>
        <TextField
          label={label}
          value={phoneNumber}
          onChange={handlePhoneNumberChange}
          onChangeText={handlePhoneNumberChange}
          type="tel"
          placeholder={placeholder}
          helperText={helperText}
          errorMessage={errorMessage}
          required={required}
          disabled={disabled}
          maxLength={maxLength}
          density={density}
          accessibilityLabel={accessibilityLabel || label}
          accessibilityHint={accessibilityHint}
          testID={testID}
        />
      </StyledPhoneNumberField>
    </StyledRow>
  );
};

export default PhoneField;
