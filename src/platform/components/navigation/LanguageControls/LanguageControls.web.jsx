/**
 * LanguageControls Component - Web
 * Flag button that opens language list with flags
 * File: LanguageControls.web.jsx
 */
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useI18n } from '@hooks';
import useLanguageControls from './useLanguageControls';
import { LOCALE_FLAG_CODES, FLAG_CDN_BASE } from './types';
import {
  StyledLanguageControls,
  StyledFlagTrigger,
  StyledLanguageMenu,
  StyledLanguageItem,
  StyledLanguageItemFlag,
} from './LanguageControls.web.styles';

const getFlagSrc = (locale) => {
  const code = LOCALE_FLAG_CODES[locale] || 'us';
  return `${FLAG_CDN_BASE}/w40/${code}.png`;
};

/**
 * LanguageControls component for Web
 */
const LanguageControlsWeb = ({ testID, className, accessibilityLabel, accessibilityHint }) => {
  const { t } = useI18n();
  const { locale, options, setLocale } = useLanguageControls();
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef(null);

  const resolvedLabel = accessibilityLabel || t('settings.language.accessibilityLabel');
  const resolvedHint = accessibilityHint || t('settings.language.hint');

  const close = useCallback(() => setOpen(false), []);

  useEffect(() => {
    if (!open) return;
    const handleClickOutside = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) close();
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [open, close]);

  return (
    <StyledLanguageControls ref={wrapperRef} data-testid={testID} className={className}>
      <StyledFlagTrigger
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={resolvedLabel}
        title={resolvedHint}
        data-testid={testID ? `${testID}-trigger` : undefined}
      >
        <img src={getFlagSrc(locale)} alt="" width={24} height={18} loading="lazy" />
      </StyledFlagTrigger>
      {open && (
        <StyledLanguageMenu role="listbox" aria-label={resolvedLabel} data-testid={testID ? `${testID}-menu` : undefined}>
          {options.map((opt) => (
            <StyledLanguageItem
              key={opt.value}
              type="button"
              role="option"
              aria-selected={opt.value === locale}
              onClick={() => {
                setLocale(opt.value);
                close();
              }}
              data-testid={testID ? `${testID}-option-${opt.value}` : undefined}
            >
              <StyledLanguageItemFlag>
                <img src={getFlagSrc(opt.value)} alt="" width={24} height={18} loading="lazy" />
              </StyledLanguageItemFlag>
              <span>{opt.label}</span>
            </StyledLanguageItem>
          ))}
        </StyledLanguageMenu>
      )}
    </StyledLanguageControls>
  );
};

export default LanguageControlsWeb;
