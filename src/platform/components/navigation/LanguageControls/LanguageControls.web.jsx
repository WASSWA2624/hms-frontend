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
  const [menuPlacement, setMenuPlacement] = useState({ vertical: 'bottom', horizontal: 'right' });
  const wrapperRef = useRef(null);
  const menuRef = useRef(null);

  const resolvedLabel = accessibilityLabel || t('settings.language.accessibilityLabel');
  const resolvedHint = accessibilityHint || t('settings.language.hint');

  const close = useCallback(() => setOpen(false), []);

  const updateMenuPlacement = useCallback(() => {
    if (!wrapperRef.current || !menuRef.current) return;
    const triggerRect = wrapperRef.current.getBoundingClientRect();
    const menuRect = menuRef.current.getBoundingClientRect();
    const viewportHeight = window.innerHeight || 0;
    const viewportWidth = window.innerWidth || 0;
    const spaceBelow = viewportHeight - triggerRect.bottom;
    const spaceAbove = triggerRect.top;
    const spaceRight = viewportWidth - triggerRect.right;
    const spaceLeft = triggerRect.left;
    const vertical = spaceBelow >= menuRect.height || spaceBelow >= spaceAbove ? 'bottom' : 'top';
    const horizontal = spaceRight >= menuRect.width || spaceRight >= spaceLeft ? 'right' : 'left';
    setMenuPlacement({ vertical, horizontal });
  }, []);

  useEffect(() => {
    if (!open) return undefined;
    const handleClickOutside = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) close();
    };
    const raf = requestAnimationFrame(updateMenuPlacement);
    document.addEventListener('mousedown', handleClickOutside);
    window.addEventListener('resize', updateMenuPlacement);
    window.addEventListener('scroll', updateMenuPlacement, true);
    return () => {
      cancelAnimationFrame(raf);
      document.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('resize', updateMenuPlacement);
      window.removeEventListener('scroll', updateMenuPlacement, true);
    };
  }, [open, close, updateMenuPlacement]);

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
        <StyledLanguageMenu
          ref={menuRef}
          $vertical={menuPlacement.vertical}
          $horizontal={menuPlacement.horizontal}
          role="listbox"
          aria-label={resolvedLabel}
          data-testid={testID ? `${testID}-menu` : undefined}
        >
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
