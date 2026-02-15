/**
 * useI18n Hook
 * Provides translation helper for UI (no hardcoded UI strings).
 * File: useI18n.js
 */
import { useCallback, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { createI18n } from '@i18n';
import { selectLocale } from '@store/selectors';

const useI18n = () => {
  const locale = useSelector(selectLocale);

  const i18n = useMemo(() => createI18n({ initialLocale: locale }), [locale]);

  const tSync = useCallback(
    (key, params) => {
      const normalizedKey = typeof key === 'string' ? key : '';
      if (!normalizedKey) return '';

      try {
        return i18n.tSync(normalizedKey, params, locale);
      } catch {
        return normalizedKey;
      }
    },
    [i18n, locale]
  );

  const t = useCallback((key, params) => tSync(key, params), [tSync]);

  return { t, tSync, locale };
};

export default useI18n;

