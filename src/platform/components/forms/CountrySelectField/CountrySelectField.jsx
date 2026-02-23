import React, { useMemo } from 'react';
import { useI18n } from '@hooks';
import Select from '../Select';
import { COUNTRY_FALLBACK_DATA } from './countryData';

const COUNTRY_OPTION_CACHE = new Map();

const normalizeString = (value) => String(value || '').trim();

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

  const options = COUNTRY_FALLBACK_DATA
    .map((country) => {
      const code = normalizeString(country?.code).toUpperCase();
      const fallbackName = normalizeString(country?.name);
      if (!/^[A-Z]{2}$/.test(code) || !fallbackName) return null;

      const localizedName = resolveLocalizedCountryName(displayNames, code, fallbackName);
      const flag = toFlagEmoji(code);

      return {
        code,
        value: localizedName,
        label: flag ? `${flag} ${localizedName}` : localizedName,
      };
    })
    .filter(Boolean)
    .sort((left, right) => left.value.localeCompare(right.value));

  COUNTRY_OPTION_CACHE.set(normalizedLocale, options);
  return options;
};

const CountrySelectField = ({
  value = '',
  onValueChange,
  onChange,
  onChangeText,
  searchable = true,
  ...rest
}) => {
  const { locale } = useI18n();
  const normalizedValue = normalizeString(value);

  const localizedOptions = useMemo(
    () => buildCountryOptionsForLocale(locale),
    [locale]
  );

  const options = useMemo(() => {
    if (!normalizedValue) return localizedOptions;

    const hasExactValue = localizedOptions.some(
      (option) => normalizeString(option.value).toLowerCase() === normalizedValue.toLowerCase()
    );
    if (hasExactValue) return localizedOptions;

    return [{ value: normalizedValue, label: normalizedValue }, ...localizedOptions];
  }, [localizedOptions, normalizedValue]);

  const handleValueChange = (nextValue) => {
    const normalizedNextValue = normalizeString(nextValue);

    if (typeof onValueChange === 'function') {
      onValueChange(normalizedNextValue);
    }
    if (typeof onChangeText === 'function') {
      onChangeText(normalizedNextValue);
    }
    if (typeof onChange === 'function') {
      onChange({
        target: { value: normalizedNextValue },
        nativeEvent: { text: normalizedNextValue },
      });
    }
  };

  return (
    <Select
      value={normalizedValue}
      options={options}
      onValueChange={handleValueChange}
      searchable={searchable}
      {...rest}
    />
  );
};

export default CountrySelectField;
