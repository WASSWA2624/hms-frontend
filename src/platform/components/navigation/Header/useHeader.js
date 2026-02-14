/**
 * useHeader Hook
 * Shared logic for generic Header component
 * File: useHeader.js
 */

import { useI18n } from '@hooks';

/**
 * Resolves accessibility label for the header
 * @param {Object} [options] - Hook options
 * @param {string} [options.accessibilityLabel] - Explicit label
 * @param {string|React.ReactNode} [options.title] - Title (string used as fallback label)
 * @returns {Object} { resolvedLabel }
 */
const useHeader = ({ accessibilityLabel, title } = {}) => {
  const { t } = useI18n();
  const defaultKey = 'navigation.header.title';
  const hasExplicitLabel = typeof accessibilityLabel === 'string' && accessibilityLabel.length > 0;
  const hasStringTitle = typeof title === 'string';
  const resolvedLabel = hasExplicitLabel
    ? accessibilityLabel
    : hasStringTitle
      ? title
      : (t(defaultKey) || '');
  return { resolvedLabel };
};

export default useHeader;
