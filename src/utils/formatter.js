/**
 * Formatting Utilities
 * Pure functions for data formatting
 * File: formatter.js
 */

/**
 * Formats a date into a locale string.
 * Note: defaults to UTC for deterministic output across environments.
 * @param {Date|string|number} date
 * @param {string} [locale='en-US']
 * @param {Object} [options]
 * @param {string} [options.timeZone='UTC']
 * @returns {string}
 */
const formatDate = (date, locale = 'en-US', options = {}) => {
  if (!date) return '';

  const timeZone = options.timeZone || 'UTC';
  const parsed = new Date(date);
  if (Number.isNaN(parsed.getTime())) return '';

  return new Intl.DateTimeFormat(locale, { timeZone }).format(parsed);
};

/**
 * Formats a date + time into a locale string.
 * @param {Date|string|number} date
 * @param {string} [locale='en-US']
 * @param {Object} [options]
 * @param {string} [options.year='numeric']
 * @param {string} [options.month='short']
 * @param {string} [options.day='2-digit']
 * @param {string} [options.hour='2-digit']
 * @param {string} [options.minute='2-digit']
 * @param {string} [options.timeZone]
 * @returns {string}
 */
const formatDateTime = (date, locale = 'en-US', options = {}) => {
  if (!date) return '';

  const parsed = new Date(date);
  if (Number.isNaN(parsed.getTime())) return '';

  const {
    year = 'numeric',
    month = 'short',
    day = '2-digit',
    hour = '2-digit',
    minute = '2-digit',
    timeZone,
  } = options;

  const formatOptions = {
    year,
    month,
    day,
    hour,
    minute,
  };

  if (timeZone) {
    formatOptions.timeZone = timeZone;
  }

  return new Intl.DateTimeFormat(locale, formatOptions).format(parsed);
};

const formatCurrency = (amount, currency = 'USD', locale = 'en-US') => {
  if (typeof amount !== 'number') return '';
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
  }).format(amount);
};

const formatNumber = (number, locale = 'en-US') => {
  if (typeof number !== 'number') return '';
  return new Intl.NumberFormat(locale).format(number);
};

export { formatDate, formatDateTime, formatCurrency, formatNumber };

